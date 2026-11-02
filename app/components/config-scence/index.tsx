import type { FC } from 'react'
import React from 'react'
import type { IWelcomeProps } from '../welcome'
import Welcome from '../welcome'

const ConfigSence: FC<IWelcomeProps> = (props) => {
  // 无变量且已进入对话时，空态由 Chat 负责，避免重复欢迎区
  if (props.hasSetInputs && (props.promptConfig?.prompt_variables?.length || 0) === 0) {
    return null
  }

  return (
    <div className="mb-5 antialiased font-sans overflow-hidden shrink-0">
      <Welcome {...props} />
    </div>
  )
}
export default React.memo(ConfigSence)
