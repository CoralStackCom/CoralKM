import { X } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from './button'

interface DrawerProps {
  isOpen: boolean
  children?: React.ReactNode
  handleCloseDrawer: () => void
  title: string
}

/**
 * Provides a right hand drawer that slides in and out
 */
export function Drawer({ isOpen, children, handleCloseDrawer, title }: DrawerProps) {
  return (
    <>
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[600px] bg-card border-l border-border shadow-lg transition-transform duration-300 ease-in-out z-50',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <Button variant="ghost" size="icon" onClick={handleCloseDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={handleCloseDrawer} />}
    </>
  )
}
