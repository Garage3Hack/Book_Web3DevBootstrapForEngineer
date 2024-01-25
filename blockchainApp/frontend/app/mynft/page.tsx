'use client'
import { ethers, isError } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';
import { Web3SignerContext } from '@/context/web3.context';
import {
  Alert, Avatar, Button, Card, Container, Group, SimpleGrid, Stack,
  Text, TextInput, Title, Image, Badge, Modal
} from '@mantine/core';
import { IconCubePlus } from '@tabler/icons-react';
import { MyERC721, MyERC721__factory } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { ethers as ethersV5 } from "ethersV5"
import { Seaport } from "@opensea/seaport-js";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { CreateOrderInput } from "@opensea/seaport-js/lib/types";

type NFT = {
  tokenId: bigint,
  name: string,
  description: string,
  image: string,
};

// デプロイしたMyERC721 Contractのアドレスを入力
const contractAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0';
// NOTICE：各自アドレスが異なるので、確認・変更してください！【5.3節リスト08を参照】

export default function MyNFT() {

  // アプリケーション全体のステータスとしてWeb3 providerを取得、設定
  const { signer } = useContext(Web3SignerContext);

  // MyERC721のコントラクトのインスタンスを保持するState
  const [myERC721Contract, setMyERC721Contract] = useState<MyERC721 | null>(null);

  // MyERC721のコントラクトのインスタンスをethers.jsを利用して生成
  useEffect(() => {
    // MyERC721コントラクトの取得
    const contract = MyERC721__factory.connect(contractAddress, signer);
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

  // 保有するNFTの一覧を生成
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  // MyERC721コントラクトを呼び出して、自身が保有するNFTの情報を取得
  useEffect(() => {
    const fetchMyNFTs = async () => {
      const nfts = [];
      if (myERC721Contract && myERC721Contract.runner) {
        const myAddress = signer?.getAddress()!
        // 自分が保有するNFTの総数を確認
        let balance = BigInt(0);
        try {
          balance = await myERC721Contract.balanceOf(myAddress)
        } catch (err) {
          if (isError(err, "BAD_DATA")) {
            // balanceOfにおいて、対応アドレスの保有NFTが0のときは、BAD_DATAエラーが発生するためハンドリング
            balance = BigInt(0);
          } else {
            throw err;
          }
        }
        for (let i = 0; i < balance; i++) {
          // ERC721Enumerableのメソッドを利用して、インデックスから自身が保有するNFTのtokenIdを取得
          const tokenId = await myERC721Contract.tokenOfOwnerByIndex(myAddress, i);
          // NOTE：本来は下記のようにtokenURIからJson Metadataを取得しNFTのコンテンツ情報にアクセス
          // const tokenURI = await myERC721Contract.tokenURI(tokenId);
          // const response = await fetch(tokenURI);
          // const jsonMetaData = await response.json();
          // NOTICE: 下記は画面表示のためのダミーデータ
          const jsonMetaData = {
            name: `NFT #${tokenId}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image: `https://source.unsplash.com/300x200?glass&s=${tokenId}`
          }
          nfts.push({ tokenId, ...jsonMetaData });
        }
        setMyNFTs(nfts);
      }
    };
    fetchMyNFTs();
  }, [myERC721Contract, signer]);

  // NFT作成のSuccess Alert
  const [showAlert, setShowAlert] = useState(false); // Alertの表示管理
  const [alertMessage, setAlertMessage] = useState(''); // Alert message

  // NFT売り注文作成
  // Seaport Contractのアドレスを入力
  const seaportAddress = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";
  // NOTICE：各自アドレスが異なる可能性があります。deploy-local.tsスクリプトの出力を参考に変更してください【5.3節リスト36参照】
  // Seaportのインスタンスを保持するState
  const [mySeaport, setMySeaport] = useState<Seaport | null>(null)
  // Seaportインスタンスを作成して保持
  useEffect(() => {
    // Seaportインスタンスの初期化
    const setupSeaport = async () => {
      if (signer) {
        // NOTE：seaport-jsはethers V6をサポートしていないため、V5のprovider/signerを作成
        const { ethereum } = window as any;
        const ethersV5Provider = new ethersV5.providers.Web3Provider(ethereum);
        const ethersV5Signer = await ethersV5Provider.getSigner();
        // ローカルにデプロイしたSeaport Contractのアドレスを指定
        const lSeaport = new Seaport(ethersV5Signer, {
          overrides: {
            contractAddress: seaportAddress,
          }
        });
        setMySeaport(lSeaport);
      }
    }
    setupSeaport();
  }, [signer]);
  // 売り注文作成モーダルの表示コントロール
  const [opened, { open, close }] = useDisclosure(false);
  // NFT売却における価格データを保持する
  const refSellOrder = useRef<HTMLInputElement>(null);
  // NFT作成中のローディング
  const [loadingSellOrder, setLoadingSellOrder] = useState(false);
  // 売りに出すNFTのtokenIdを保持する
  const [sellTargetTokenId, setSellTargetTokenId] = useState<string | null>(null);
  //モーダルオープン
  const openModal = (tokenId: string) => {
    // 売却対象のNFTのtokenIdを保持しておく
    setSellTargetTokenId(tokenId);
    open();
  }
  // NFT売り注文作成処理
  const createSellOrder = async () => {
    try {
      setLoadingSellOrder(true);
      // フォームに入力した価格を取得
      const price = refSellOrder.current!.value;
      // 売り注文作成のための入力データを作成
      const firstStandardCreateOrderInput = {
        offer: [
          {

            itemType: ItemType.ERC721,
            token: contractAddress,
            identifier: sellTargetTokenId
          }
        ], // 上記はMyERC721を売りに出していることを示している
        consideration: [
          {
            amount: ethers.parseUnits(price, 'ether').toString(),
            recipient: await signer?.getAddress()!,
            token: ethers.ZeroAddress // its mean native token.
          }
          // 上記は売りに出したNFTの売価と受取人を指定している
        ],
        // 下記のように手数料やロイヤリティを指定することもできる
        // fees: [{ recipient: signer._address, basisPoints: 500 }]
      } as CreateOrderInput;
      // 売りの注文を作成する
      const orderUseCase = await mySeaport!.createOrder(
        firstStandardCreateOrderInput
      );
      // executeAllActionsの返り値で返却されるorderは、NFT売却者が(offerer)が署名した売り注文データとなっている
      const order = await orderUseCase.executeAllActions();
      console.log(order); // For debugging
      // 作成した売り注文公開APIを実行する
      fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });
      // 成功した場合はアラートを表示する
      setShowAlert(true);
      setAlertMessage(`NFT (${sellTargetTokenId}) is now for sale`);
    } finally {
      setLoadingSellOrder(false);
      setSellTargetTokenId(null);
      close();
    }
  };

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
        {/* NFT一覧 */}
        {
          myNFTs.map((nft, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={nft.image}
                  height={160}
                  alt="No image"
                />
              </Card.Section>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{nft.name}</Text>
                <Badge color="blue" variant="light">
                  tokenId: {nft.tokenId.toString()}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {nft.description}
              </Text>
              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => { openModal(nft.tokenId.toString()) }}
              >
                Sell this NFT
              </Button>
            </Card>
          ))
        }
      </SimpleGrid >
      <Modal opened={opened} onClose={close} title="Sell your NFT">
        <Stack>
          <TextInput
            ref={refSellOrder}
            label="Price (ether)"
            placeholder="10" />
          <Button loading={loadingSellOrder} onClick={createSellOrder}>Create sell
            order</Button>
        </Stack>
      </Modal>
    </div >
  );
}
