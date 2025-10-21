import { ChevronDown } from 'lucide-react'

import type { IAgentUserProfile } from '@coralkm/core'

import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { userProfiles } from '../lib/user-profiles'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface UserProfileSelectorProps {
  currentProfile: IAgentUserProfile
  onProfileChange: (profile: IAgentUserProfile) => void
}

export function UserProfileSelector({ currentProfile, onProfileChange }: UserProfileSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center pl-0 gap-3 hover:bg-accent/50 rounded-lg px-3 py-2 transition-colors outline-none">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage
            src={
              currentProfile.displayPicture
                ? `data:image/png;base64,${currentProfile.displayPicture}`
                : undefined
            }
            alt={currentProfile.displayName}
          />
          <AvatarFallback>{currentProfile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2 min-w-0">
          {currentProfile.displayName}
        </h1>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {userProfiles.map(profile => (
          <DropdownMenuItem
            key={profile.displayName}
            onClick={() => onProfileChange(profile)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage
                src={
                  profile.displayPicture
                    ? `data:image/png;base64,${profile.displayPicture}`
                    : undefined
                }
                alt={profile.displayName}
              />
              <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{profile.displayName}</span>
            {currentProfile.displayName === profile.displayName && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
