import type { Metadata } from 'next'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata: Metadata = {
  title: '小望',
  description: '小望',
  icons: {
    icon: [
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo-mark.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/favicon-32.png',
    apple: '/logo-mark.png',
  },
}

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'zh-Hans'} className="h-full">
      <body className="h-full bg-white antialiased">
        <div className="w-screen h-screen min-w-[320px] overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
