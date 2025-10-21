import { Check, Copy, Info, RotateCcw } from 'lucide-react'
import React from 'react'

import { ChannelList } from '../components/channel-list'
import { ChannelView } from '../components/channel-view'
import { MessageComposer } from '../components/message-composer'
import { UserProfileSelector } from '../components/profile-selector'
import { RecoverModal } from '../components/recover-modal'
import { RecoverSuccessModal } from '../components/recover-success-modal'
import { Button } from '../components/ui/button'
import { Drawer } from '../components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { styleMessage } from '../lib/style-messages'
import type { IChannel } from '../providers/wallet'
import { useWallet } from '../providers/wallet'

export default function App() {
  const [selectedChannelId, setSelectedChannelId] = React.useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = React.useState(320)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isUserDrawerOpen, setIsUserDrawerOpen] = React.useState(false)
  const [copied, setCopied] = React.useState<'did' | 'namespace' | null>(null)
  const [isRotating, setIsRotating] = React.useState(false)
  const {
    user: currentUser,
    channels,
    wallet,
    namespace,
    walletKey,
    backupData,
    restoredData,
  } = useWallet()

  const handleChannelSelect = (channel: IChannel) => {
    setSelectedChannelId(channel.id)
  }

  const handleCopy = async (value: string, button: 'did' | 'namespace') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(button)
      // revert after 1 second
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isResizing) {
      // Limit sidebar width between 300px and 500px
      const newWidth = Math.min(Math.max(e.clientX, 300), 500)
      setSidebarWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const selectedChannel = selectedChannelId ? channels.get(selectedChannelId) || null : null

  return (
    <div
      className="flex flex-col h-screen bg-background overflow-x-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
        {/* Left section: name + DID + actions */}
        <div className="flex items-center gap-2 min-w-0">
          <UserProfileSelector
            currentProfile={{
              displayName: currentUser?.displayName || 'Loading...',
              displayPicture: currentUser?.displayPicture || '',
            }}
            onProfileChange={async profile => {
              await wallet.updateUserProfile({
                displayName: profile.displayName,
                displayPicture: profile.displayPicture,
              })
              // Update the window title as well
              document.title = `${profile.displayName} - CoralKM Wallet`
            }}
          />
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2 min-w-0">
            <span className="text-lg text-muted-foreground flex items-center gap-1 min-w-0">
              (
              <span
                className="truncate max-w-[220px]"
                title={currentUser?.routing_id || currentUser?.mediator_id}
              >
                {currentUser?.routing_id || currentUser?.mediator_id}
              </span>
              )
              <Button
                title="Rotate Keys"
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-black/10"
                onClick={async () => {
                  setIsRotating(true)
                  await wallet.rotateKeys()
                  setTimeout(() => setIsRotating(false), 1000)
                }}
              >
                <RotateCcw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              </Button>
              <RecoverModal wallet={wallet} />
              <Button
                title="Wallet Info"
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-black/10"
                onClick={() => setIsUserDrawerOpen(true)}
              >
                <Info className="h-3.5 w-3.5" />
              </Button>
              <Button
                title="Copy DID"
                variant="ghost"
                size="icon"
                className={`h-6 w-6  ${copied === 'did' ? 'bg-green-500 text-white hover:bg-green-600' : 'hover:bg-black/10'}`}
                onClick={() =>
                  handleCopy(currentUser?.routing_id || currentUser?.mediator_id || '', 'did')
                }
              >
                {copied === 'did' ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </span>
          </h1>
        </div>

        {/* Right section: GitHub button */}
        <button
          title="View Source Code on GitHub"
          onClick={() => window.open('https://github.com/CoralStackOrg/CoralKM', '_blank')}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition"
        >
          <img src="./github.svg" className="h-5 w-5" />
          GitHub
        </button>
      </div>

      <RecoverSuccessModal recoveredWallet={restoredData} />

      <Drawer
        isOpen={isUserDrawerOpen}
        handleCloseDrawer={() => {
          setIsUserDrawerOpen(false)
        }}
        title="User Info"
      >
        <Tabs defaultValue="wallet" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="wallet" className="flex-1">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="identifiers" className="flex-1">
              Identifiers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wallet" className="flex-1 overflow-y-auto p-4 mt-0">
            <h3 className="font-semibold mb-2">
              Wallet Namespace:
              <Button
                title="Copy DID"
                variant="ghost"
                size="icon"
                className={`h-6 w-6  ${copied === 'namespace' ? 'bg-green-500 text-white hover:bg-green-600' : 'hover:bg-black/10'}`}
                onClick={() => handleCopy(JSON.stringify(namespace, null, 2), 'namespace')}
              >
                {copied === 'namespace' ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </h3>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(namespace, null, 2)}
            </pre>
            <h3 className="font-semibold mt-4 mb-2">Wallet Data Encryption Key:</h3>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">{walletKey}</pre>
            <h3 className="font-semibold mt-4 mb-2">Wallet Data:</h3>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(backupData, null, 2)}
            </pre>
          </TabsContent>
          <TabsContent value="identifiers" className="flex-1 overflow-y-auto p-4 mt-0">
            {currentUser && (
              <>
                <h3 className="font-semibold mb-2">Routing DID:</h3>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(currentUser.routing_did, null, 2)}
                </pre>
                <h3 className="font-semibold my-2">Mediator DID:</h3>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(currentUser.mediator_did, null, 2)}
                </pre>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Drawer>

      <div className="flex flex-1 min-h-0">
        <div
          className="border-r border-border flex-shrink-0 relative"
          style={{ width: `${sidebarWidth}px` }}
        >
          <ChannelList
            channels={Array.from(channels.values())}
            selectedChannel={selectedChannel}
            onSelectChannel={handleChannelSelect}
            onAddChannel={async did => {
              await wallet.addChannel(did)
            }}
          />
          {/* Resize Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors"
            onMouseDown={handleMouseDown}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChannelView channel={selectedChannel} styleMessage={styleMessage} />
          {selectedChannel && currentUser && (
            <MessageComposer
              currentUser={currentUser}
              selectedChannel={selectedChannel}
              sendMessage={async message => {
                await wallet.sendMessage(message)
              }}
              addGuardian={async guardianDID => {
                await wallet.addGuardian(guardianDID)
              }}
              removeGuardian={async guardianDID => {
                await wallet.removeGuardian(guardianDID)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
