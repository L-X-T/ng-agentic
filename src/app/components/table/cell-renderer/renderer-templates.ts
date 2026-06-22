import { DatePipe } from '@angular/common';

export function renderBooleanTemplate(value: any, aggFunc: string): string {
  if (aggFunc !== 'count' && aggFunc !== 'count_d' && aggFunc !== 'sum') {
    return value
      ? '<span class="icon i-lxt-check cell--center"></span>'
      : '<span class="icon i-lxt-cancel cell--center"></span>';
  } else {
    return `<span>${value}</span>`;
  }
}

export function renderTextTemplate(value: any): string {
  return `<span>${value}</span>`;
}

export function renderNumberTemplate(value: any): string {
  return `<span class="cell--right">${value}</span>`;
}

export function renderCheckboxTemplate(value: any, aggFunc: string): string {
  if (aggFunc !== 'count' && aggFunc !== 'count_d' && aggFunc !== 'sum') {
    return `
      <div class="ag-selection-checkbox cell--checkbox " role="presentation">
                <!--AG-CHECKBOX--><div role="presentation" ref="eCheckbox" class="ag-labeled ag-label-align-right ag-checkbox ag-input-field">
                <div ref="eLabel" class="ag-input-field-label ag-label ag-hidden ag-checkbox-label" aria-hidden="true" role="presentation" id="ag-4271-label"></div>
                <div ref="eWrapper" class="ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper ${
                  value === true ? 'ag-checked' : ''
                }" role="presentation">
                    <input ref="eInput" class="ag-input-field-input ag-checkbox-input" type="checkbox" id="ag-4271-input" value=${value}>
                </div>
            </div>
            </div>`;
  } else {
    return `<span>${value}</span>`;
  }
}

export function renderDateTemplate(value: any, aggFunc: string, dateFormat: string): string {
  const datePipe: DatePipe = new DatePipe('en-US');
  if (aggFunc !== 'count' && aggFunc !== 'count_d') {
    return `<span>${datePipe.transform(value, dateFormat)}</span>`;
  } else {
    return `<span>${value}</span>`;
  }
}

export function renderOrdinalNumberTemplate(value: any, aggFunc: string): string {
  if (aggFunc !== 'count' && aggFunc !== 'count_d' && aggFunc !== 'sum') {
    return `<span class="cell--right">${value}.</span>`;
  } else {
    return `<span class="cell--right">${value}</span>`;
  }
}

export function renderStatusTemplate(value: string, aggFunc: string): string {
  switch (value) {
    case 'ready':
      return `
        <div class="status-ellipse status--ready">
          <span class="icon i-lxt-status-ready"></span>
          <span>Ready</span>
        </div>`;
    case 'active':
      return `
        <div class="status-ellipse status--active">
          <span class="icon i-lxt-status-active"></span>
          <span>Active</span>
        </div>`;
    case 'warning':
      return `
        <div class="status-ellipse status--warning">
          <span class="icon i-lxt-warning"></span>
          <span>Warning</span>
        </div>`;
    case 'deactivated':
      return `
        <div class="status-ellipse status--error">
          <span class="icon i-lxt-status-deactivated"></span>
          <span>Deactivated</span>
        </div>`;
    case 'emergencyStop':
      return `
        <div class="status-ellipse status--error">
          <span class="icon i-lxt-status-emergency-stopp"></span>
          <span>Emergency stop</span>
        </div>`;
    case 'maintenance':
      return `
        <div class="status-ellipse status--maintenance">
          <span class="icon i-lxt-status-maintenance"></span>
          <span>Maintenance</span>
        </div>`;
    case 'jam':
      return `
        <div class="status-ellipse status--warning">
          <span class="icon i-lxt-status-jam"></span>
          <span>Jam</span>
        </div>`;
    case 'error':
      return `
        <div class="status-ellipse status--error">
          <span class="icon i-lxt-error"></span>
          <span>Error</span>
        </div>`;
    default:
      if (aggFunc !== 'count' && aggFunc !== 'count_d') {
        return `
          <div class="status-ellipse status--unknown">
          <span class="icon i-lxt-status-unkown">
          </span>
          <span>Unknown
          </span>
          </div>`;
      } else {
        return `<span>${value}</span>`;
      }
  }
}

export function renderProgressTemplate(value: any, aggFunc: string): string {
  if (aggFunc !== 'count' && aggFunc !== 'count_d') {
    return `
      <div class="progress-bar" style="width: ${value}%;">
        <span>${value}%</span>
      </div>`;
  } else {
    return `<span>${value}</span>`;
  }
}

export function renderDefaultTemplate(value: any): string {
  return `<span>${value}</span>`;
}
