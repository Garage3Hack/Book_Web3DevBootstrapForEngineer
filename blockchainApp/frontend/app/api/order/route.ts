import { OrderWithCounter } from '@opensea/seaport-js/lib/types';
import { NextResponse } from 'next/server';

// 売り注文の中央データベース
const orderDatas: Array<OrderWithCounter> = [];

// 売り注文（seaport-jsのsell order）を登録・公開するPOST API
export async function POST(request: Request) {
  const data = await request.json() as OrderWithCounter
  orderDatas.push(data);
  return NextResponse.json({ message: 'SUCCESS' });
};

// 公開中売り注文（sell order）の一覧を取得するAPI
export async function GET() {
  return NextResponse.json(orderDatas);
}

// 登録された売り注文（sell order）の削除を行うAPI
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  // indexの指定が正しくなければエラー
  if (!id || isNaN(+id)) return NextResponse.json({
    message: 'ERROR No index'
  }, { status: 400 });
  const res = orderDatas.splice(+id!, 1);
  // 削除ができていなければエラー
  if (res.length != 1) return NextResponse.json({ message: 'ERROR Not Found' },
    { status: 404 });
  return NextResponse.json({ message: 'SUCCESS' });
}
