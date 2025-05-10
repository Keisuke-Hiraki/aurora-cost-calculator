# Aurora Cost Calculator

AWS Aurora データベースの料金計算ツール - Aurora StandardとI/O-Optimizedの比較・分析ができるウェブアプリケーション

## 機能

- Aurora インスタンスタイプを選択してI/Oとストレージのコスト比較を表示
- 現在の月間I/O使用量とストレージ使用量に基づいて最適な料金モデルを提案
- Aurora Standard、Aurora I/O-Optimized、リザーブドインスタンス、Aurora Serverless v2の料金比較
- 損益分岐点のグラフィカル表示
- ストレージサイズによる料金比較グラフ

## 主な機能の解説

1. **損益分岐点計算**
   - I/O使用量に基づいたAurora StandardとI/O-Optimizedの損益分岐点を計算
   - グラフで視覚的に表示

2. **コスト最適化提案**
   - 使用状況に基づき最適な料金プランを提案
   - 月間・年間のコスト削減額を表示

3. **多様な比較オプション**
   - リザーブドインスタンス（1年/3年、一部/全額前払い）
   - Aurora Serverless v2（ACUベースの自動スケーリング）
   - 各種インスタンスタイプでの比較

## 使用技術

- Next.js
- TypeScript
- TailwindCSS
- Recharts (グラフ表示)
- Vercelでのデプロイ

## 開発方法

```bash
# リポジトリをクローン
git clone https://github.com/Keisuke-Hiraki/aurora-cost-calculator.git
cd aurora-cost-calculator

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスできます。

## Vercelへのデプロイ

このアプリケーションは [Vercel](https://vercel.com) へのデプロイを前提に設計されています。

1. Vercelのアカウントを作成する（まだ持っていない場合）
2. Vercelのダッシュボードで「New Project」をクリック
3. GitHubからこのリポジトリをインポート
4. 設定をデフォルトのままでデプロイボタンをクリック

## 注意事項

- 料金情報は例示的なものであり、AWS公式の価格情報を参照することをお勧めします
- 実際の料金はリージョンや契約条件によって異なる場合があります
- このツールは意思決定の参考として使用し、正確な料金については必ずAWSに確認してください

## ライセンス

MIT

## コントリビュート

バグ報告や機能要望は Issue または Pull Request でお待ちしています。
