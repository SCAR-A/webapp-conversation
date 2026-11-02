import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  title?: string
  isMobile?: boolean
  onClose?: () => void
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  title,
  isMobile,
  onClose,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'shrink-0 flex flex-col overflow-y-auto ds-scroll bg-white',
        'pc:w-[260px] tablet:w-[220px] mobile:w-[280px]',
        'border-r border-[#E4E6EB]',
        isMobile ? 'h-screen' : 'h-full',
      )}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon size="small" />
          {title && (
            <span className="text-[15px] font-semibold text-gray-800 truncate">{title}</span>
          )}
        </div>
        {isMobile && (
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 px-3 pt-2 pb-1 bg-white">
          <button
            type="button"
            onClick={() => { onCurrentIdChange('-1') }}
            className="group flex w-full items-center justify-start gap-2 h-11 rounded-xl px-3 bg-[#F5F6F8] hover:bg-[#ECEEF2] text-primary-600 text-sm font-semibold transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            {t('app.chat.newChat')}
          </button>
        </div>
      )}

      <nav className="mt-3 flex-1 space-y-0.5 px-3 pb-2 overflow-y-auto ds-scroll bg-white">
        {list.length > 0 && (
          <div className="px-2 pb-2 text-xs font-medium text-gray-400">最近</div>
        )}
        {list.map((item) => {
          const isCurrent = item.id === currentId
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-[#F5F6F8] text-gray-900'
                  : 'text-gray-700 hover:bg-[#F5F6F8]',
                'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors',
              )}
            >
              <ChatBubbleOvalLeftEllipsisIcon
                className={classNames(
                  isCurrent ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
                  'mr-2.5 h-4 w-4 flex-shrink-0',
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </div>
          )
        })}
      </nav>

      <div className="flex flex-shrink-0 items-center gap-2.5 px-4 py-3 bg-white border-t border-[#E4E6EB]">
        <AppIcon size="tiny" rounded />
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-800 truncate">{copyRight || '小望'}</div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
