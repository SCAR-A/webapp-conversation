'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  isRequest: boolean
  toolName: string
  content: string
}

const Panel: FC<Props> = ({
  isRequest,
  toolName,
  content,
}) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-[10px] bg-[#F7F8FA] overflow-hidden border-l-2 border-l-primary-600 border border-ds-divider">
      <div className="flex items-center px-3 py-1.5 leading-[18px] text-xs font-semibold text-gray-500">
        {t(`tools.thought.${isRequest ? 'requestTitle' : 'responseTitle'}`)} {toolName}
      </div>
      <div className="px-3 pb-2.5 leading-[1.55] text-[13px] italic text-gray-500">{content}</div>
    </div>
  )
}
export default React.memo(Panel)
