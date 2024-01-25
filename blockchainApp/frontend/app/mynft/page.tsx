'use client'
import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';
import artifact from '../../abi/MyERC721.sol/MyERC721.json';
import { Web3SignerContext } from '@/context/web3.context';
import {
  Alert, Avatar, Button, Card, Container, Group, SimpleGrid, Stack,
  Text, TextInput, Title
} from '@mantine/core';
import { IconCubePlus } from '@tabler/icons-react';

// デプロイしたMyERC721 Contractのアドレスを入力
const contractAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0';
// NOTICE：各自アドレスが異なるので、確認・変更してください！【5.3節リスト08を参照】

export default function MyNFT() {

  // アプリケーション全体のステータスとしてWeb3 providerを取得、設定
  const { signer } = useContext(Web3SignerContext);

  // MyERC721のコントラクトのインスタンスを保持するState
  const [myERC721Contract, setMyERC721Contract] = useState<ethers.Contract | null>(null);

  // MyERC721のコントラクトのインスタンスをethers.jsを利用して生成
  useEffect(() => {
    // MyERC721コントラクトの取得
    const contract = new ethers.Contract(
      contractAddress,
      artifact.abi,
      signer
    );
    setMyERC721Contract(contract);
    // NFT作成フォームのデフォルト値として、現在のアカウントアドレスを設定
    const fillAddress = async () => {
      if (ref.current) {
        const myAddress = await signer?.getAddress();
        if (myAddress) {
          ref.current.value = myAddress!;
        }
      }
    }
    fillAddress();
  }, [signer]);

  // Mintボタンを押したときにMyERC721Contractにトランザクションを発行し、NFTを作成し自分のWalletに送信
  const ref = useRef<HTMLInputElement>(null);
  // NFT作成中のローディング
  const [loading, setLoading] = useState(false);
  // NFT作成処理
  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const account = ref.current!.value;
      // MyERC721コントラクトにNFT作成（safeMint）トランザクションを発行
      await myERC721Contract?.safeMint(account, 'https://example.com/nft.json');
      // 成功した場合はアラートを表示する
      setShowAlert(true);
      setAlertMessage(`NFT minted and sent to the wallet ${account?.slice(0, 6) +
        '...' + account?.slice(-2)}. Enjoy your NFT!`)
    } finally {
      setLoading(false);
    }
  };

  // NFT作成のSuccess Alert
  const [showAlert, setShowAlert] = useState(false); // Alertの表示管理
  const [alertMessage, setAlertMessage] = useState(''); // Alert message

  return (
    <div>
      <Title order={1} style={{ paddingBottom: 12 }}>My NFT Management</Title>
      {/* アラート表示 */}
      {
        showAlert ?
          <Container py={8}>
            <Alert
              variant='light'
              color='teal'
              title='NFT Minted Successfully!'
              withCloseButton
              onClose={() => setShowAlert(false)}
              icon={<IconCubePlus />}>
              {alertMessage}
            </Alert>
          </Container> : null
      }
      <SimpleGrid cols={{ base: 1, sm: 3, lg: 5 }}>
        {/* NFT作成フォーム */}
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Card.Section>
            <Container py={12}>
              <Group justify='center'>
                <Avatar color='blue' radius='xl'>
                  <IconCubePlus size='1.5rem' />
                </Avatar>
                <Text fw={700}>Mint Your NFTs !</Text>
              </Group>
            </Container>
          </Card.Section>
          <Stack>
            <TextInput
              ref={ref}
              label='Wallet address'
              placeholder='0x0000...' />
            <Button loading={loading} onClick={handleButtonClick}>Mint NFT</Button>
          </Stack>
        </Card>
      </SimpleGrid>
    </div>
  );
}
