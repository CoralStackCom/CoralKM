import React from 'react'

import type { INamespace } from '@coralkm/core'
import type { WalletExportedData } from '../providers/wallet/wallet'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

/**
 * Props for the RecoverSuccessModal component.
 */
interface RecoverModalProps {
  recoveredWallet?: {
    key: string
    data: WalletExportedData
    namespace: INamespace
  }
}

/**
 * Recovery success modal component for wallet namespace recovery. Shows a dialog at end of
 * recovery process to inform user of success.
 */
export function RecoverSuccessModal({ recoveredWallet }: RecoverModalProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (recoveredWallet) {
      setIsDialogOpen(true)
    }
  }, [recoveredWallet])

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={open => {
        setIsDialogOpen(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wallet Recovered Successfully!!!</DialogTitle>
          <DialogDescription>
            The wallet has been successfully recovered. You can now close this dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-sm">
            <strong>Namespace:</strong>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(recoveredWallet?.namespace, null, 2)}
            </pre>
          </div>
          <div className="text-sm mt-2">
            <strong>Data Encryption Key:</strong>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {recoveredWallet?.key}
            </pre>
          </div>
          <div className="text-sm mt-2">
            <strong>Decrypted Wallet Backup:</strong>
            <pre className="h-48 w-120 text-xs bg-muted p-3 rounded-lg overflow-auto">
              {JSON.stringify(recoveredWallet?.data, null, 2)}
            </pre>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              setIsDialogOpen(false)
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
