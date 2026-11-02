import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  if (!isMobile) { return null }

  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-white border-b border-ds-divider">
      <button
        type="button"
        className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-ds-surface transition-colors"
        onClick={() => onShowSideBar?.()}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex items-center space-x-2 min-w-0">
        <AppIcon size="tiny" />
        <div className="text-sm text-gray-800 font-semibold truncate max-w-[180px]">{title}</div>
      </div>
      <button
        type="button"
        className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-ds-surface transition-colors"
        onClick={() => onCreateNewChat?.()}
        aria-label="New chat"
      >
        <PencilSquareIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  )
}

export default React.memo(Header)
