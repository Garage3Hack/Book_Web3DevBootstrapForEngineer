# ブロックチェーンサンプル（Appendix）　 ローカル環境にイーサリアムネットワークを構築する(A1.1)

## Dockerのインストール
MacOSの場合：
https://docs.docker.com/desktop/install/mac-install/

Windowsの場合：
https://docs.docker.com/desktop/install/windows-install/

## リスト1. dockerのバージョン確認
```
docker version
```

## リスト2. docker-composeのバージョン確認
```
docker compose version
```

## リスト3. gethコンテナイメージの取得
```
docker pull ethereum/client-go:v1.13.3
```

## リスト4. Dockerイメージの一覧表示
```
docker images
```

## リスト6. フォルダの作成と移動
```
mkdir poanet
cd poanet
```
## リスト8. コンテナの起動
```
docker compose up -d
```

## リスト9. 起動の確認
```
docker ps
```

## リスト10. コンテナへのアクセス
node1へのアクセス：
```
docker exec -it poanet-node1-1 /bin/sh
```
node2へのアクセス：
```
docker exec -it poanet-node2-1 /bin/sh
```

## リスト11. アカウントの作成（コンテナ内） 
```
geth --datadir eth_data account new
```

## リスト13. gethの初期化（コンテナ内）
```
geth init --datadir eth_data genesis.json
```

## リスト14. gethとコンソールの起動（コンテナ内）
```
geth --networkid 12345 --datadir eth_data --nodiscover console
```

## リスト15. enodeの取得（gethコマンド）
```
admin.nodeInfo.enode
```

## リスト16. config.tomlの作成（コンテナ内）
```
geth --networkid 12345 --datadir eth_data dumpconfig > config.toml
```

## リスト19. node1とnode2のgethの再起動（コンテナ内）
```
geth --networkid 12345 --datadir eth_data --nodiscover --config config.toml --miner.etherbase A1.1.4で作成したアドレス --bootnodes A1.1.7のリスト15で取得した相手のenode --http --http.addr 0.0.0.0 --allow-insecure-unlock --unlock A1.1.4で作成したアドレス console

node1の例：
geth --networkid 12345 --datadir eth_data --nodiscover --config config.toml --miner.etherbase 0x60733D645307a9402240186559Ca562411221842 --bootnodes enode://4ab522bf0328c53de3a62235dce8f98aa7b83de36ebf8ce7e38b6f2e83bd764341c66a0fd84fa076d24e5fcc8552515d0c8a80fb7ef68a593c2b8e2886b3840f@172.20.0.11:30303 --http --http.addr 0.0.0.0 --allow-insecure-unlock --unlock 0x60733D645307a9402240186559Ca562411221842 console

node2の例：
geth --networkid 12345 --datadir eth_data --nodiscover --config config.toml --miner.etherbase 0x31995A10661cD73aeEf18FC8736fB068f84Ca995 --bootnodes enode://4d88fe4195060a62a61c7cb32500f547c66661bcdee3b76513f2ade9ee2da695119a73db07e472b544c2c33cc50d54dc730f7b64ef1ed9afb78b73b0839d5e0d@172.20.0.10:30303 --http --http.addr 0.0.0.0 --allow-insecure-unlock --unlock 0x31995A10661cD73aeEf18FC8736fB068f84Ca995 console
```

## リスト20. 接続確認（gethコマンド）
```
net.peerCount
```

## リスト21. マイニングの開始（gethコマンド）
```
miner.start()
```

## リスト22. node1のアドレスの残高確認（gethコマンド）
```
eth.getBalance(eth.accounts[0])
```

## リスト23. node2のアカウントアドレスの確認（gethコマンド）
```
eth.accounts[0]
```

## リスト24. 送金トランザクションの実行（gethコマンド）
```
eth.sendTransaction({from:eth.accounts[0], to:"0x31995A10661cD73aeEf18FC8736fB068f84Ca995",value:1000})
```

## リスト25. 残高の確認（gethコマンド）
```
eth.getBalance(eth.accounts[0])
```

## リスト26. ホストからの接続確認
```
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545/
```

## リスト27. dotenvのインストール
```
npm install dotenv@16.3.1
```

## リスト30. poanetへのスマートコントラクトのデプロイ
```
npx hardhat run --network poanet scripts/deploy-local.ts
```

## リスト32. Webアプリケーションの起動
```
npm run dev
```