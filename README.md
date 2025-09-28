# Numer0n

3桁の数字を推測するゲーム「ヌメロン」のWebアプリケーションです。

## ゲームルール

- コンピュータが3桁の数字（各桁は異なる数字）を生成します
- プレイヤーは3桁の数字を推測して入力します
- 結果として以下が表示されます：
  - **EAT**: 数字と位置が両方とも正しい桁数
  - **BITE**: 数字は正しいが位置が間違っている桁数

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Cloudflare Pages Functions
- **データストレージ**: Cloudflare KV
- **開発環境**: ESLint

## セットアップ

### 前提条件
- Node.js (推奨: 18.x以上)
- npm
- Cloudflareアカウント

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd Numer0n
```

2. 依存関係をインストール
```bash
npm install
```

3. Cloudflare KV設定
```bash
# wrangler.toml.exampleをwrangler.tomlにコピー
cp wrangler.toml.example wrangler.toml

# KV namespaceを作成
wrangler kv:namespace create GAME_KV
wrangler kv:namespace create GAME_KV --preview

# 生成されたIDをwrangler.tomlに設定
```

### 開発環境での起動

```bash
# フロントエンドの開発サーバー起動
npm run dev

# Cloudflare Pages Functionsをローカルで実行
wrangler pages dev dist --kv GAME_KV
```

### ビルドとデプロイ

```bash
# ビルド
npm run build

# Cloudflare Pagesにデプロイ
wrangler pages deploy dist
```

## プロジェクト構造

```
Numer0n/
├── src/                    # Reactアプリケーション
│   ├── App.tsx            # メインコンポーネント
│   └── ...
├── functions/             # Cloudflare Pages Functions
│   ├── start.ts          # ゲーム開始API
│   └── guess.ts          # 推測API
├── public/               # 静的ファイル
├── package.json          # 依存関係とスクリプト
├── vite.config.ts        # Viteの設定
├── wrangler.toml         # Cloudflareの設定
└── tsconfig.json         # TypeScriptの設定
```

## 開発

### Linting
```bash
npm run lint
```

### プレビュー
```bash
npm run preview
```