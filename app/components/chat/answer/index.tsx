'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, MessageRating, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import copy from 'copy-to-clipboard'
import Button from '@/app/components/base/button'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Tooltip from '@/app/components/base/tooltip'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { randomString } from '@/utils/string'
import { Clipboard, ClipboardCheck } from '@/app/components/base/icons/line/files'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Thought from '../thought'

function OperationBtn({ innerContent, onClick, className }: { innerContent: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <div
      className={`relative box-border flex items-center justify-center h-8 w-8 p-0.5 rounded-full cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-ds-surface ${className ?? ''}`}
      onClick={onClick && onClick}
    >
      {innerContent}
    </div>
  )
}

const AssistantMark: FC = () => (
  <img src="/logo-mark.png" alt="小望" className="w-full h-full object-contain" draggable={false} />
)

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}

const IconWrapper: FC<{ children: React.ReactNode | string }> = ({ children }) => {
  return (
    <div className="rounded-full h-6 w-6 flex items-center justify-center">
      {children}
    </div>
  )
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [] } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0
  const [isCopied, setIsCopied] = React.useState(false)

  const { t } = useTranslation()

  const handleCopy = () => {
    const text = isAgentMode
      ? (agent_thoughts || []).map(i => i.thought || '').filter(Boolean).join('\n\n') || content
      : content
    if (!text) { return }
    copy(text)
    setIsCopied(true)
    window.setTimeout(() => setIsCopied(false), 2000)
  }

  const renderFeedbackRating = (rating: MessageRating | undefined) => {
    if (!rating) { return null }

    const isLike = rating === 'like'
    const ratingIconClassname = isLike ? 'text-primary-600 bg-primary-50' : 'text-red-600 bg-red-50'
    return (
      <Tooltip
        selector={`user-feedback-${randomString(16)}`}
        content={isLike ? '取消赞同' : '取消反对'}
      >
        <div
          className="relative box-border flex items-center justify-center h-8 w-8 p-0.5 rounded-full cursor-pointer text-gray-500 hover:text-gray-800 hover:bg-ds-surface"
          onClick={async () => {
            await onFeedback?.(id, { rating: null })
          }}
        >
          <div className={`${ratingIconClassname} rounded-full h-6 w-6 flex items-center justify-center`}>
            <RatingIcon isLike={isLike} />
          </div>
        </div>
      </Tooltip>
    )
  }

  const renderItemOperation = () => {
    return (
      <div className={`${s.itemOperation} flex gap-0.5`}>
        <Tooltip selector={`copy-answer-${randomString(16)}`} content={t('common.operation.copy') as string}>
          {OperationBtn({
            innerContent: (
              <IconWrapper>
                {isCopied
                  ? <ClipboardCheck className="w-3.5 h-3.5 text-gray-500" />
                  : <Clipboard className="w-3.5 h-3.5 text-gray-500" />}
              </IconWrapper>
            ),
            onClick: handleCopy,
          })}
        </Tooltip>
        {!feedback?.rating && (
          <>
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.like') as string}>
              {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={true} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'like' }) })}
            </Tooltip>
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.dislike') as string}>
              {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={false} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'dislike' }) })}
            </Tooltip>
          </>
        )}
      </div>
    )
  }

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && (
            <StreamdownMarkdown content={item.thought} />
          )}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}

          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div key={id}>
      <div className={`${s.answerWrap} flex items-start gap-3`}>
        <div className={`${s.answerIcon}`}>
          <AssistantMark />
          {isResponding && (
            <div className={s.typeingIcon}>
              <LoadingAnim type="avatar" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className={`${s.assistantBody} relative`}>
            <div className={`${workflowProcess ? 'min-w-0 pc:min-w-[320px]' : ''}`}>
              {workflowProcess && (
                <WorkflowProcess data={workflowProcess} hideInfo />
              )}
              {(isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0) : !content))
                ? (
                  <div className="flex items-center justify-center w-6 h-5">
                    <LoadingAnim type="text" />
                  </div>
                )
                : (isAgentMode
                  ? agentModeAnswer
                  : (
                    <StreamdownMarkdown content={content} />
                  ))}
              {suggestedQuestions.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {suggestedQuestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        className="!text-sm !rounded-full !h-auto !py-1.5 !px-3"
                        type="link"
                        onClick={() => suggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {!isResponding && !!content && !feedbackDisabled && !item.feedbackDisabled && (
              <div className="mt-2 flex flex-row items-center gap-1">
                {renderItemOperation()}
                {renderFeedbackRating(feedback?.rating)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(Answer)
