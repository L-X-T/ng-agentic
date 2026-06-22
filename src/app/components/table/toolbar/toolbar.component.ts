import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ButtonComponent } from '@components/button';

import { ActionType, TableRow, Toolbar, ToolbarAction } from '../';
import { UiHelperService } from './ui-helper.service';
import { LimitPipe } from '../limit.pipe';

@Component({
  host: {
    '(document:click)': 'clickout($event)',
  },
  imports: [ButtonComponent, ReactiveFormsModule, LimitPipe],
  selector: 'lxt-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnChanges, AfterViewInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly helperService = inject(UiHelperService);
  protected readonly ActionType = ActionType;
  protected actionsMenuOpen = false;
  protected hasOverflow = false;
  protected actionLimit!: number;

  filterAction: ToolbarAction | undefined;

  @Input() toolbar!: Toolbar;
  @Input() selectedRows: TableRow[] = [];
  @Input() selectedRowCount = 0;
  @Input() infoMessage = '';

  @Output() actionExecuted = new EventEmitter<ToolbarAction>();
  @Output() searchExecuted = new EventEmitter<string>();

  @ViewChild('actionsMenu') actionsMenu!: ElementRef;
  @ViewChild('actionslist') actionsList!: ElementRef;
  @ViewChild('actionsMenuToggle', { read: ElementRef }) actionsMenuToggle!: ElementRef;

  @HostListener('window:resize')
  onResize() {
    this.detectOverflow();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (
      this.actionsMenuToggle &&
      (this.contains(this.actionsMenuToggle.nativeElement, event) ||
        this.contains(this.actionsMenu.nativeElement, event))
    ) {
      return;
    }
    this.actionsMenuOpen = false;
  }

  private contains(container: HTMLElement, event: MouseEvent): boolean {
    const rect = container.getBoundingClientRect();
    const xRange = Math.max(rect.x, Math.min(event.clientX, rect.x + rect.width)) === event.clientX;
    const yRange = Math.max(rect.y, Math.min(event.clientY, rect.y + rect.height)) === event.clientY;
    return xRange && yRange;
  }

  callableStatus: { [index: string]: boolean } = {};
  searchControl: FormControl<string> = new FormControl<string>('', { nonNullable: true });
  protected ActionsOverflowed = 0;

  constructor(private ref: ElementRef) {}

  ngOnInit() {
    this.initSearchForm();
  }

  ngAfterViewInit(): void {
    this.detectOverflow();
    // trigger change detection to prevent NG0100 error
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterAction = this.toolbar.actions.find((a) => a?.type === ActionType.Filter);
    this.determineCallableStatus();
  }

  protected toggleActionsMenu(state?: boolean): void {
    this.actionsMenuOpen = state ?? !this.actionsMenuOpen;
    this.ref.nativeElement.classList.toggle('actions-menu-open', this.actionsMenuOpen);
  }

  private initSearchForm(): void {
    this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchExecuted.emit(searchTerm);
    });
  }

  private determineCallableStatus(): void {
    this.toolbar.actions.forEach((action) => {
      this.callableStatus[action.key as string] = this.isActionCallable(action);
    });
  }

  private isActionCallable(action: ToolbarAction): boolean {
    if (!action.minRecords && !action.maxRecords) {
      return true;
    } else if (action.minRecords && action.maxRecords) {
      if (
        this.selectedRowCount &&
        this.selectedRowCount >= action.minRecords &&
        this.selectedRowCount <= action.maxRecords
      ) {
        return this.checkExecutionConditions(action);
      }
    } else if (action.minRecords) {
      if (this.selectedRowCount && this.selectedRowCount >= action.minRecords) {
        return this.checkExecutionConditions(action);
      }
    } else if (action.maxRecords) {
      if (this.selectedRowCount && this.selectedRowCount <= action.maxRecords) {
        return this.checkExecutionConditions(action);
      }
    }

    return false;
  }

  private checkExecutionConditions(action: ToolbarAction): boolean {
    if (action.executionConditions.length < 1) {
      return true;
    }
    if (this.selectedRows.length < 1) {
      return false;
    }

    let matchCount = 0;
    action.executionConditions.forEach((condition) => {
      let rowMatchCount = 0;
      this.selectedRows.forEach((row) => {
        if (this.helperService.compareValues(row[condition.referenceColumn], condition.operator, condition.value)) {
          rowMatchCount++;
        }
      });
      if (this.selectedRows.length === rowMatchCount) {
        matchCount++;
      }
    });

    return action.executionConditions.length === matchCount;
  }

  protected detectOverflow(): void {
    const actionsContainer = this.actionsList.nativeElement;
    const lastAction = actionsContainer?.lastChild.previousElementSibling as HTMLElement;
    const toolbar = this.ref.nativeElement;
    const searchSection = toolbar.lastChild;
    const availableSpace = toolbar.offsetWidth - searchSection.offsetWidth;
    this.actionLimit = 0;
    let usedSpace = 0;
    for (const action of actionsContainer.childNodes) {
      if (!action.offsetWidth) {
        continue;
      }
      usedSpace += action.offsetWidth + 16;
      if (usedSpace > availableSpace - 120) {
        break;
      }
      this.actionLimit++;
    }
    if (usedSpace < availableSpace - 120) {
      const avg = usedSpace / this.actionLimit;
      this.actionLimit += Math.floor((availableSpace - usedSpace - 120) / avg);
    }

    this.hasOverflow = this.actionLimit < this.toolbar.actions.length;
  }

  onExecuteAction(action: ToolbarAction): void {
    this.actionExecuted.emit(action);
  }
}
