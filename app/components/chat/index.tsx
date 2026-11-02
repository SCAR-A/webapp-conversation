'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const hasPendingImageUploads = files.some(file => file.progress !== -1 && file.progress < 100)
    const hasPendingAttachmentUploads = attachmentFiles.some(file => file.progress !== -1 && file.progress < 100)
    if (hasPendingImageUploads || hasPendingAttachmentUploads) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  const canSend = query.trim().length > 0
  const hasUserMessage = chatList.some(item => !item.isAnswer)
  const isEmptyChat = !hasUserMessage

  const renderComposer = (centered = false) => (
    <div className={cn(
      centered
        ? 'w-full max-w-[720px] mx-auto px-0'
        : 'w-full max-w-chat mx-auto',
    )}>
      <div className={`${s.composer} relative p-3.5 max-h-[200px] overflow-y-auto`}>
        {
          visionConfig?.enabled && (
            <>
              <div className="flex items-center mb-2">
                <ChatImageUploader
                  settings={visionConfig}
                  onUpload={onUpload}
                  disabled={files.length >= visionConfig.number_limits}
                />
              </div>
              <div className="mb-2">
                <ImageList
                  list={files}
                  onRemove={onRemove}
                  onReUpload={onReUpload}
                  onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                  onImageLinkLoadError={onImageLinkLoadError}
                />
              </div>
            </>
          )
        }
        {
          fileConfig?.enabled && (
            <div className="mb-2">
              <FileUploaderInAttachmentWrapper
                fileConfig={fileConfig}
                value={attachmentFiles}
                onChange={setAttachmentFiles}
              />
            </div>
          )
        }
        <div className="flex items-end gap-2">
          <Textarea
            className="block w-full px-2 py-2.5 leading-6 max-h-none text-[15px] text-gray-800 outline-none appearance-none resize-none bg-transparent placeholder:text-gray-400"
            value={query}
            onChange={handleContentChange}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
            autoSize
            placeholder="给 小望 发送消息"
          />
          <Tooltip
            selector="send-tip"
            htmlContent={
              <div>
                <div>{t('common.operation.send')} Enter</div>
                <div>{t('common.operation.lineBreak')} Shift Enter</div>
              </div>
            }
          >
            <button
              type="button"
              className={`${s.sendBtn} ${!canSend ? s.sendBtnDisabled : ''} shrink-0`}
              onClick={() => { if (canSend) { handleSend() } }}
              disabled={!canSend}
              aria-label="Send"
            >
              <PaperAirplaneIcon className="w-4 h-4 -rotate-45 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </Tooltip>
        </div>
      </div>
      {!centered && (
        <div className="text-center text-[11px] text-gray-400 mt-2">
          AI 生成内容仅供参考
        </div>
      )}
    </div>
  )

  return (
    <div className={cn(!feedbackDisabled && 'px-0', 'h-full')}>
      {isEmptyChat
        ? (
          <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-2 pb-24">
            <div className="flex items-center gap-3 mb-10">
              <img src="/logo-mark.png" alt="小望" className="w-10 h-10 object-contain" draggable={false} />
              <h1 className="text-[26px] pc:text-[30px] font-semibold text-gray-900 tracking-tight">
                你好，我能帮什么忙吗？
              </h1>
            </div>
            {!isHideSendInput && (
              <div className="w-full">
                {renderComposer(true)}
              </div>
            )}
          </div>
        )
        : (
          <div className="h-full space-y-[18px] pt-4 pb-[148px]">
            {chatList.map((item) => {
              if (item.isAnswer) {
                const isLast = item.id === chatList[chatList.length - 1].id
                return <Answer
                  key={item.id}
                  item={item}
                  feedbackDisabled={feedbackDisabled}
                  onFeedback={onFeedback}
                  isResponding={isResponding && isLast}
                  suggestionClick={suggestionClick}
                />
              }
              return (
                <Question
                  key={item.id}
                  id={item.id}
                  content={item.content}
                  useCurrentUserAvatar={useCurrentUserAvatar}
                  imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
                />
              )
            })}
          </div>
        )}
      {
        !isHideSendInput && !isEmptyChat && (
          <div className="fixed z-10 bottom-0 right-0 left-0 pc:left-[260px] tablet:left-[220px] mobile:left-0 px-4 mobile:px-3 pb-3 pt-8 bg-gradient-to-t from-white via-white to-transparent">
            {renderComposer(false)}
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
