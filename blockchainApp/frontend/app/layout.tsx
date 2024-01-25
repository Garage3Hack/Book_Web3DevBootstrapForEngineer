import '@mantine/core/styles.css';
import './globals.css'
import type { Metadata } from 'next'

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { AppMenu } from '@/components/common/AppMenu';
import { Web3SignerContextProvider } from '@/context/web3.context';

export const metadata: Metadata = {
  title: 'Blockchain Sample App',
  description: 'This is a sample app that demonstrates Web3 Blockchain features.',
};

export default function RootLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        {/* Mantineを利用するための設定 */}
        <MantineProvider defaultColorScheme="dark">
          {/* MetaMask情報をアプリ全体で共有するための設定 */}
          <Web3SignerContextProvider>
            {/* アプリ全体で共通のレイアウトを適用する */}
            <AppMenu>
              {children}
            </AppMenu>
          </Web3SignerContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
