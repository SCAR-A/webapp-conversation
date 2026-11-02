import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

export interface IButtonProps {
  type?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button: FC<IButtonProps> = ({
  type,
  disabled,
  children,
  className,
  onClick,
  loading = false,
}) => {
  let style = 'cursor-pointer'
  switch (type) {
    case 'link':
      style = disabled
        ? 'border-solid border border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400'
        : 'border-solid border border-gray-200 cursor-pointer text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-200'
      break
    case 'primary':
      style = (disabled || loading)
        ? 'bg-primary-600/60 cursor-not-allowed text-white'
        : 'bg-primary-600 hover:bg-primary-700 cursor-pointer text-white active:scale-[0.98]'
      break
    default:
      style = disabled
        ? 'border-solid border border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400'
        : 'border-solid border border-gray-200 cursor-pointer text-gray-500 hover:bg-ds-surface hover:border-gray-300'
      break
  }

  return (
    <div
      className={`flex justify-center items-center content-center h-9 leading-5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${style} ${className && className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      <Spinner loading={loading} className="!text-white !h-3 !w-3 !border-2 !ml-1" />
    </div>
  )
}

export default React.memo(Button)
