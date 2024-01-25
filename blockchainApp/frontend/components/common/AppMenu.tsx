'use client';
import { AppShell, Burger, Button, Flex, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavbarLinks } from './NavbarLinks';
import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3SignerContext } from '@/context/web3.context';
import {
  IconWallet
} from "@tabler/icons-react";

export function AppMenu({ children }: { children: React.ReactNode }) {
  // モバイルの場合、アプリメニューがハンバーガーメニューとして開閉できるようになります
  const [opened, { toggle }] = useDisclosure(false);
  // アプリケーション全体のステータスとしてWeb3 providerを取得、設定します
  const { signer, setSigner } = useContext(Web3SignerContext);
  const [account, setAccount] = useState<string | null>(null);

  // signerが設定、変更されたら、アカウントを更新します
  useEffect(() => {
    async function fetchAddress() {
      if (signer) {
        const address = await signer.getAddress()
        setAccount(address);
      }
    }
    fetchAddress();
  }, [signer]);

  // ボタンを押下した時に実行される関数
  const handleButtonClick = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      // Ethereumプロバイダーを取得し
      const lProvider = new ethers.BrowserProvider(ethereum);
      // Ethereum プロバイダーから、アカウントを取得、React Context APIで作成したアプリケーション全体ステートに設定
      const lSigner = await lProvider.getSigner();
      setSigner(lSigner);
    }
  }
  return (
    // MantineのApplication headerやmenuを作成するコンポーネントを利用します
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* アプリケーションヘッダー */}
      <AppShell.Header
        style={{
          padding: '5px'
        }}>
        <Flex
          mih={40}
          gap="sm"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title style={{ paddingLeft: '5px' }} order={1} size="h3" >sample app</Title>
          {/* MetaMask Walletと接続するボタン、接続済の場合はWalletアドレスが短縮して表示されます */}
          { signer ?
            <Button
              radius="xl"
              variant="default"
              leftSection={<IconWallet />}
              style={{ marginLeft: 'auto' }}>
              {account?.slice(0, 6) + '...' + account?.slice(-2)}
            </Button>
            :
            <Button onClick={handleButtonClick} style={{ marginLeft: 'auto' }}>
              Connect
            </Button>
          }
        </Flex>
      </AppShell.Header>

      {/* アプリケーション ナビゲーションメニュー(左側に表示) */}
      <AppShell.Navbar p={{ base: 5 }}>
        <NavbarLinks />
      </AppShell.Navbar>

      {/* アプリケーションメイン画面、URLごとのページが表示されます */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
