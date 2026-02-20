/**
 * Component Properties
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
}
