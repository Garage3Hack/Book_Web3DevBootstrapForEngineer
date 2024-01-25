"use client"

import { useContext, useEffect, useState } from "react";
import { Button, Card, Group, SimpleGrid, Stack, Text, TextInput, Title, Image, Badge, Modal, Center, Container, Alert } from "@mantine/core";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";
import { ethers as ethersV5 } from "ethersV5"
import { IconCubePlus, IconUser } from "@tabler/icons-react";
import { Seaport } from "@opensea/seaport-js";
import { Web3SignerContext } from "@/context/web3.context";

export default function SellOrders() {
  // アプリケーション全体のステータスとしてWeb3 providerを取得、設定
  const { signer } = useContext(Web3SignerContext);

  const [sellOrders, setSellOrders] = useState<Array<OrderWithCounter>>([]);
  // 公開中売り注文の一覧取得
  const fetchSellOrders = async () => {
    const resp = await fetch('/api/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const datas = await resp.json();
    console.log(datas);
    setSellOrders(datas);
  }
  useEffect(() => {
    fetchSellOrders();
  }, []);

  // Seaport Contractのアドレスを入力
  const seaportAddress = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";
  // NOTICE: 各自アドレスが異なるので、確認・変更してください【5.3節リスト36参照】
  // Seaportのインスタンスを保持するState
  const [mySeaport, setMySeaport] = useState<Seaport | null>(null)
  // Seaportインスタンスを作成して保持
  useEffect(() => {
    // Seaportインスタンスの初期化
    const setupSeaport = async () => {
      if (signer) {
        // NOTE: seaport-jsはethers V6をサポートしていないため、V5のprovider/signerを作成
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
  // NFT購入処理
  const buyNft = async (index: number, order: OrderWithCounter) => {
    try {
      // 売り注文に対して買い注文を作成
      const { executeAllActions: executeAllFulfillActions } = await mySeaport!.fulfillOrders({
        fulfillOrderDetails: [{ order }],
        accountAddress: await signer?.getAddress()
      });

      // 買い注文をSeaportコントラクトに発行
      const transaction = await executeAllFulfillActions();
      console.log(transaction); // For debugging
      // 売り注文の削除
      const query = new URLSearchParams({id: index.toString()});
      fetch('/api/order?' + query, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });
      // アラートメッセージを設定して終了する
      setAlert({color: 'teal', title: 'Success buy NFT', message: 'Now you own the NFT!' });
      fetchSellOrders();
    } catch (error ) {
      setAlert({color: 'red', title: 'Failed to buy NFT', message: (error as {message: string}).message});
    }

  };

  const [ alert, setAlert ] = useState<{color: string, title: string, message: string} | null>(null);

  return (
    <div>
    <Title order={1} style={{ paddingBottom: 12 }}>Sell NFT Orders</Title>
      {
        alert ?
          <Container py={8}>
            <Alert
              variant="light"
              color={alert.color}
              title={alert.title}
              withCloseButton
              onClose={() => setAlert(null)}
              icon={<IconCubePlus />}>
              {alert.message}
            </Alert>
          </Container> : null
      }
      <SimpleGrid cols={{ base: 1, sm: 3, lg: 5 }}>
      {/* NFT一覧 */}
      {
          sellOrders.map((order, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={`https://source.unsplash.com/300x200?glass&s=${index}`}
                  height={160}
                  alt="No image"
                />
              </Card.Section>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{`NFT #${order.parameters.offer[0].identifierOrCriteria}`}</Text>
                <Badge color="red" variant="light">
                  tokenId: {order.parameters.offer[0].identifierOrCriteria}
                </Badge>
              </Group>
              <Group mt="xs" mb="xs">
                <IconUser size="2rem" stroke={1.5} />
                <Text size="md" c="dimmed">
                  {order.parameters.consideration[0].recipient.slice(0, 6) + '...' + order.parameters.consideration[0].recipient.slice(-2)}
                </Text>
              </Group>
              <Group mt="xs" mb="xs">
                <Text fz="lg" fw={700}>
                  {`Price: ${ethers.formatEther(BigInt(order.parameters.consideration[0].startAmount))} ether`}
                </Text>
                <Button
                  variant="light"
                  color="red"
                  mt="xs"
                  radius="xl"
                  style={{ flex: 1 }}
                  onClick={() => { buyNft(index, order); }}
                >
                  Buy this NFT
                </Button>
              </Group>
            </Card>
          ))
        }
      </SimpleGrid>
    </div>
  )
}
