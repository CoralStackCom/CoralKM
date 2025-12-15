import { Html5Qrcode } from 'html5-qrcode'
import { Camera, Upload, X } from 'lucide-react'
import React from 'react'

import { Button } from './ui/button'

interface ScannerProps {
  onScanSuccess: (decodedText: string, format: string) => void
  onClose: () => void
}

export function Scanner({ onScanSuccess }: ScannerProps) {
  const [isScanning, setIsScanning] = React.useState(false)
  const [scannedResult, setScannedResult] = React.useState<{
    text: string
    format: string
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const scannerRef = React.useRef<Html5Qrcode | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const startCameraScanning = async () => {
    try {
      setError(null)
      const html5QrCode = new Html5Qrcode('qr-reader')
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText, decodedResult) => {
          const format = decodedResult.result.format?.formatName || 'Unknown'
          setScannedResult({ text: decodedText, format })
          onScanSuccess(decodedText, format)
          stopScanning()
        },
        () => {
          // Ignore errors during scanning
        }
      )

      setIsScanning(true)
    } catch (err) {
      setError('Failed to start camera. Please check camera permissions.')
      console.error('Camera start error:', err)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
        scannerRef.current = null
        setIsScanning(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      const html5QrCode = new Html5Qrcode('qr-reader')
      scannerRef.current = html5QrCode

      const result = await html5QrCode.scanFile(file, false)
      const format = 'File Upload'
      setScannedResult({ text: result, format })
      onScanSuccess(result, format)
    } catch (err) {
      setError('Failed to scan the uploaded file. Please try another image.')
      console.error('File scan error:', err)
    }
  }

  const handleCopyResult = async () => {
    if (scannedResult) {
      try {
        await navigator.clipboard.writeText(scannedResult.text)
      } catch (err) {
        console.error('Copy failed', err)
      }
    }
  }

  const resetScanner = () => {
    setScannedResult(null)
    setError(null)
    stopScanning()
  }

  React.useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
        {!isScanning && !scannedResult && (
          <div className="flex flex-col gap-3">
            <Button onClick={startCameraScanning} className="w-full gap-2">
              <Camera className="h-4 w-4" />
              Scan with Camera
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
        )}

        <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>

        {isScanning && (
          <Button variant="destructive" onClick={stopScanning} className="w-full gap-2">
            <X className="h-4 w-4" />
            Stop Scanning
          </Button>
        )}

        {scannedResult && (
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                Format: {scannedResult.format}
              </h3>
              <p className="text-sm break-all">{scannedResult.text}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyResult} className="flex-1">
                Copy Result
              </Button>
              <Button variant="outline" onClick={resetScanner} className="flex-1 bg-transparent">
                Scan Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
