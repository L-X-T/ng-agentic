import { LicenseManager } from 'ag-grid-enterprise';

export class TableLicenseManager {
  static setLicenseKey(licenseKey: string): void {
    LicenseManager.setLicenseKey(licenseKey);
  }
}
