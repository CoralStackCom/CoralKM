import { Copy, Download, X } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import React from 'react'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface QRGeneratorProps {
  onClose: () => void
  didValue: string | undefined
}

export function DIDQrGenerator({ onClose, didValue }: QRGeneratorProps) {
  const [didAddress, setDidAddress] = React.useState(didValue || '')
  const [error, setError] = React.useState<string | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(didAddress)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const handleDownload = () => {
    const canvas = document.getElementById('did-qr') as HTMLCanvasElement
    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'did-qr.png'
    link.click()
  }

  const isValid = didAddress.trim().length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">DID Address</label>
          <Input
            placeholder="did:example:123456789abcdef"
            value={didAddress}
            onChange={e => {
              setDidAddress(e.target.value)
              setError(null)
            }}
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
        )}

        {isValid && (
          <div className="flex flex-col items-center gap-4 p-4 bg-muted rounded-lg">
            <QRCodeCanvas id="did-qr" value={didAddress} size={220} level="H" />

            <div className="flex w-full gap-2">
              <Button onClick={handleCopy} className="flex-1 gap-2">
                <Copy className="h-4 w-4" />
                Copy DID
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download QR
              </Button>
            </div>
          </div>
        )}

        <Button variant="destructive" onClick={onClose} className="w-full gap-2">
          <X className="h-4 w-4" />
          Close
        </Button>
      </div>
    </div>
  )
}
