'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
  const userName = ''
  return (
    <div className="flex items-start justify-end gap-2" key={id}>
      <div className="max-w-[78%] mobile:max-w-[88%]">
        <div className={`${s.userBubble} relative text-[15px] leading-[1.5] px-4 py-3`}>
          {imgSrcs && imgSrcs.length > 0 && (
            <div className="mb-2">
              <ImageGallery srcs={imgSrcs} />
            </div>
          )}
          <StreamdownMarkdown content={content} />
        </div>
      </div>
      {useCurrentUserAvatar && (
        <div className="w-7 h-7 shrink-0 leading-7 text-center rounded-full bg-primary-600 text-white text-xs font-semibold">
          {userName?.[0]?.toLocaleUpperCase() || 'U'}
        </div>
      )}
    </div>
  )
}

export default React.memo(Question)
