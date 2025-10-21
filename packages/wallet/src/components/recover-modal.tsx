import { Shield } from 'lucide-react'
import React from 'react'

import type { Wallet } from '../providers/wallet/wallet'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Textarea } from './ui/textarea'

interface RecoverModalProps {
  wallet: Wallet
}

/**
 * Recovery modal component for wallet namespace recovery. Opens a dialog to input
 * the namespace JSON and validates it before allowing recovery.
 */
export function RecoverModal({ wallet }: RecoverModalProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [namespaceJSON, setNamespaceJSON] = React.useState('')
  const [fieldError, setFieldError] = React.useState<string | null>(null)

  const validateField = (text: string) => {
    if (!text.trim()) {
      setFieldError(null)
      return false
    }
    try {
      JSON.parse(text)

      // Check required fields here if needed
      if ('id' in JSON.parse(text) === false) {
        setFieldError('Missing required field: id')
        return false
      }
      if ('gateway_did' in JSON.parse(text) === false) {
        setFieldError('Missing required field: gateway_did')
        return false
      }

      setFieldError(null)
      return true
    } catch {
      setFieldError('Invalid JSON')
      return false
    }
  }

  const submitRecovery = () => {
    if (validateField(namespaceJSON)) {
      // Proceed with recovery
      setIsDialogOpen(false)
      // Call wallet recovery method here if needed
      wallet.recoverWallet(JSON.parse(namespaceJSON))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitRecovery()
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={open => {
        setIsDialogOpen(open)
        if (!open) {
          setNamespaceJSON('')
          setFieldError(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Recover Wallet">
          <Shield className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recover Wallet</DialogTitle>
          <DialogDescription>
            Paste the namespace JSON copied from the wallet you want to recover below:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Namespace"
            value={namespaceJSON}
            onChange={e => {
              setNamespaceJSON(e.target.value)
              validateField(e.target.value)
            }}
            className={fieldError ? 'border-red-500' : ''}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={5}
          />
          {fieldError && <p className="text-sm text-red-500 mt-1">{fieldError}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false)
              setNamespaceJSON('')
              setFieldError(null)
            }}
          >
            Cancel
          </Button>
          <Button onClick={submitRecovery} disabled={!namespaceJSON.trim() || fieldError !== null}>
            Recover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
