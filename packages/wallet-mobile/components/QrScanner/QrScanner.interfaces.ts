/**
 * QR Scanner Component Properties
 */
export interface QRScannerComponentProps {
  /**
   * Callback function executed when a QR code is successfully scanned
   */
  onScan: (data: string) => void

  /**
   * Optional callback to cancel scanning
   */
  onCancel?: () => void

  /**
   * Optional regex pattern to validate scanned data.
   * When provided, scanned data that does not match will show an error.
   */
  validPattern?: RegExp

  /**
   * Error message shown when scanned data doesn't match the validPattern.
   * Defaults to "Invalid QR code format" if not provided.
   */
  invalidMessage?: string
}
