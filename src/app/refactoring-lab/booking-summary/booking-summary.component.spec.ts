import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BookingSummaryComponent } from './booking-summary.component';

function button(root: HTMLElement, label: string): HTMLButtonElement {
  const match = Array.from(root.querySelectorAll('button')).find((element) => element.textContent?.trim() === label);
  if (!match) {
    throw new Error('Missing button: ' + label);
  }
  return match;
}

function labels(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('li'), (item) => item.textContent?.trim() ?? '');
}

describe('BookingSummaryComponent behavior', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSummaryComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('shows the initial bookings in their supplied order', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(labels(root)).toEqual(['Lin', 'Ada', 'Sam']);
  });

  it('excludes cancelled and pending records from Active', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    fixture.componentRef.setInput('bookings', [
      { id: 'P', status: 'pending', label: 'Pat' },
      { id: 'A', status: 'active', label: 'Ada' },
      { id: 'C', status: 'cancelled', label: 'Cal' },
    ]);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    button(root, 'Show active').click();
    await fixture.whenStable();
    expect(labels(root)).toEqual(['Ada']);
  });

  it('restores All without mutating or reordering the supplied records', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    const bookings = Object.freeze([
      { id: 'S', status: 'active', label: 'Sam' },
      { id: 'C', status: 'cancelled', label: 'Cal' },
      { id: 'A', status: 'active', label: 'Ada' },
    ]);
    fixture.componentRef.setInput('bookings', bookings);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    button(root, 'Show active').click();
    await fixture.whenStable();
    expect(labels(root)).toEqual(['Sam', 'Ada']);
    button(root, 'Show all').click();
    await fixture.whenStable();
    expect(labels(root)).toEqual(['Sam', 'Cal', 'Ada']);
    expect(bookings.map((booking) => booking.label)).toEqual(['Sam', 'Cal', 'Ada']);
  });

  it('updates the filtered list when the input changes', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    button(root, 'Show active').click();
    await fixture.whenStable();
    fixture.componentRef.setInput('bookings', [{ id: 'M', status: 'active', label: 'Mae' }]);
    await fixture.whenStable();
    expect(labels(root)).toEqual(['Mae']);
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Bookings shown: 1');
  });

  it('shows an empty result and zero count when Active has no matches', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    fixture.componentRef.setInput('bookings', [{ id: 'P', status: 'pending', label: 'Pat' }]);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    button(root, 'Show active').click();
    await fixture.whenStable();
    expect(labels(root)).toEqual(['No bookings match the filter']);
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Bookings shown: 0');
  });

  it('exposes the selected filter through the button pressed states', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(button(root, 'Show all').getAttribute('aria-pressed')).toBe('true');
    button(root, 'Show active').click();
    await fixture.whenStable();
    expect(button(root, 'Show all').getAttribute('aria-pressed')).toBe('false');
    expect(button(root, 'Show active').getAttribute('aria-pressed')).toBe('true');
  });
});
