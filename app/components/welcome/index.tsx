'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from '../value-panel'
import FileUploaderInAttachmentWrapper from '../base/file-uploader-in-attachment'
import s from './style.module.css'
import { ChatBtn, EditBtn, PromptTemplate } from './massive-component'
import type { AppInfo, PromptConfig } from '@/types/app'
import Toast from '@/app/components/base/toast'
import Select from '@/app/components/base/select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import AppIcon from '@/app/components/base/app-icon'

// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)\}\}/g

export interface IWelcomeProps {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
}

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo: _siteInfo,
  promptConfig,
  onStartChat,
  canEditInputs,
  savedInputs,
  onInputsChange,
}) => {
  const { t } = useTranslation()
  const hasVar = promptConfig.prompt_variables.length > 0
  const [isFold, setIsFold] = useState<boolean>(true)
  const [inputs, setInputs] = useState<Record<string, any>>((() => {
    if (hasSetInputs) { return savedInputs }

    const res: Record<string, any> = {}
    if (promptConfig) {
      promptConfig.prompt_variables.forEach((item) => {
        res[item.key] = ''
      })
    }
    return res
  })())
  useEffect(() => {
    if (!savedInputs) {
      const res: Record<string, any> = {}
      if (promptConfig) {
        promptConfig.prompt_variables.forEach((item) => {
          res[item.key] = ''
        })
      }
      setInputs(res)
    }
    else {
      setInputs(savedInputs)
    }
  }, [savedInputs])

  const highLightPromoptTemplate = (() => {
    if (!promptConfig) { return '' }
    const res = promptConfig.prompt_template.replace(regex, (match, p1) => {
      return `<span class='text-gray-800 font-bold'>${inputs?.[p1] ? inputs?.[p1] : match}</span>`
    })
    return res
  })()

  const { notify } = Toast
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const renderHeader = () => {
    return (
      <div className="sticky top-0 z-[5] flex items-center justify-between border-b border-ds-divider mobile:h-12 tablet:h-14 px-4 tablet:px-6 bg-white/90 backdrop-blur-sm">
        <div className="text-sm font-medium text-gray-800 truncate">{conversationName}</div>
      </div>
    )
  }

  const renderInputs = () => {
    return (
      <div className="space-y-3">
        {promptConfig.prompt_variables.map(item => (
          <div className="tablet:flex items-start mobile:space-y-2 tablet:space-y-0 mobile:text-xs tablet:text-sm" key={item.key}>
            <label className={`flex-shrink-0 flex items-center tablet:leading-9 mobile:text-gray-700 tablet:text-gray-900 mobile:font-medium pc:font-normal ${s.formLabel}`}>{item.name}</label>
            {item.type === 'select'
              && (
                <Select
                  className="w-full"
                  defaultValue={inputs?.[item.key]}
                  onSelect={(i) => { setInputs({ ...inputs, [item.key]: i.value }) }}
                  items={(item.options || []).map(i => ({ name: i, value: i }))}
                  allowSearch={false}
                  bgClassName="bg-gray-50"
                />
              )}
            {item.type === 'string' && (
              <input
                placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
                value={inputs?.[item.key] || ''}
                onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
                className="w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50"
                maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
              />
            )}
            {item.type === 'paragraph' && (
              <textarea
                className="w-full h-[104px] flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50"
                placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
                value={inputs?.[item.key] || ''}
                onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
              />
            )}
            {item.type === 'number' && (
              <input
                type="number"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                value={inputs[item.key]}
                onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
              />
            )}

            {
              item.type === 'file' && (
                <FileUploaderInAttachmentWrapper
                  fileConfig={{
                    allowed_file_types: item.allowed_file_types,
                    allowed_file_extensions: item.allowed_file_extensions,
                    allowed_file_upload_methods: item.allowed_file_upload_methods!,
                    number_limits: 1,
                    fileUploadConfig: {} as any,
                  }}
                  onChange={(files) => {
                    setInputs({ ...inputs, [item.key]: files[0] })
                  }}
                  value={inputs?.[item.key] || []}
                />
              )
            }
            {
              item.type === 'file-list' && (
                <FileUploaderInAttachmentWrapper
                  fileConfig={{
                    allowed_file_types: item.allowed_file_types,
                    allowed_file_extensions: item.allowed_file_extensions,
                    allowed_file_upload_methods: item.allowed_file_upload_methods!,
                    number_limits: item.max_length,
                    fileUploadConfig: {} as any,
                  }}
                  onChange={(files) => {
                    setInputs({ ...inputs, [item.key]: files })
                  }}
                  value={inputs?.[item.key] || []}
                />
              )
            }
          </div>
        ))}
      </div>
    )
  }

  const canChat = () => {
    const vars = promptConfig?.prompt_variables ?? []

    const hasEmptyRequired = vars.some((v) => {
      const isRequired = v?.required ?? true
      if (!isRequired) { return false }

      const val = inputs?.[v.key]

      if (typeof val === 'string') { return val.trim() === '' }

      return val === undefined || val === null
    })

    if (hasEmptyRequired) {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }

    return true
  }

  const handleChat = () => {
    if (!canChat()) { return }

    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) { delete inputs[key] }
    })

    onStartChat(inputs)
  }

  // DeepSeek 风格空态：无变量时由 Main 自动 start，这里只作兜底展示
  const renderNoVarPanel = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full pt-[12vh] pc:pt-[18vh]">
        <div className="flex items-center gap-3 mb-10">
          <AppIcon size="large" />
          <h1 className="text-[28px] pc:text-[32px] font-semibold text-gray-900 tracking-tight">
            你好，我能帮什么忙吗？
          </h1>
        </div>
        <ChatBtn onClick={handleChat} />
      </div>
    )
  }

  const renderVarPanel = () => {
    return (
      <div className="flex flex-col items-center w-full pt-[8vh]">
        <div className="flex items-center gap-3 mb-8">
          <AppIcon size="large" />
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">
            你好，我能帮什么忙吗？
          </h1>
        </div>
        <div className="w-full max-w-[560px]">
          <TemplateVarPanel
            isFold={false}
            header={
              <div className="text-sm font-medium text-gray-700">
                开始前请完善对话设置
              </div>
            }
          >
            {renderInputs()}
            <ChatBtn
              className="mt-3 mobile:ml-0 tablet:ml-[128px]"
              onClick={handleChat}
            />
          </TemplateVarPanel>
        </div>
      </div>
    )
  }

  const renderVarOpBtnGroup = () => {
    return (
      <VarOpBtnGroup
        onConfirm={() => {
          if (!canChat()) { return }

          onInputsChange(inputs)
          setIsFold(true)
        }}
        onCancel={() => {
          setInputs(savedInputs)
          setIsFold(true)
        }}
      />
    )
  }

  const renderHasSetInputsPublic = () => {
    if (!canEditInputs) {
      return (
        <TemplateVarPanel
          isFold={false}
          header={
            <>
              <PanelTitle
                title={t('app.chat.publicPromptConfigTitle')}
                className="mb-1"
              />
              <PromptTemplate html={highLightPromoptTemplate} />
            </>
          }
        />
      )
    }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <>
            <PanelTitle
              title={t('app.chat.publicPromptConfigTitle')}
              className="mb-1"
            />
            <PromptTemplate html={highLightPromoptTemplate} />
            {isFold && (
              <div className="flex items-center justify-between mt-3 border-t border-ds-divider pt-4 text-xs text-primary-600">
                <span className="text-gray-700">{t('app.chat.configStatusDes')}</span>
                <EditBtn onClick={() => setIsFold(false)} />
              </div>
            )}
          </>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputsPrivate = () => {
    if (!canEditInputs || !hasVar) { return null }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <div className="flex items-center justify-between text-primary-600">
            <PanelTitle
              title={!isFold ? t('app.chat.privatePromptConfigTitle') : t('app.chat.configStatusDes')}
            />
            {isFold && (
              <EditBtn onClick={() => setIsFold(false)} />
            )}
          </div>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputs = () => {
    if ((!isPublicVersion && !canEditInputs) || !hasVar) { return null }

    return (
      <div className="pt-4 mb-5">
        {isPublicVersion ? renderHasSetInputsPublic() : renderHasSetInputsPrivate()}
      </div>
    )
  }

  return (
    <div className="relative">
      {hasSetInputs && hasVar && renderHeader()}
      <div className="mx-auto w-full max-w-chat px-4 mobile:px-3">
        {
          !hasSetInputs && (
            hasVar ? renderVarPanel() : renderNoVarPanel()
          )
        }

        {hasSetInputs && renderHasSetInputs()}
      </div>
    </div>
  )
}

export default React.memo(Welcome)
