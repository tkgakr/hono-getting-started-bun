To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3001

---

## 各項目の確認方法

[Hono ドキュメント (Bun)](https://hono-ja.pages.dev/docs/getting-started/bun) の項目ごとに、`src/index.ts` の実装に合わせた確認方法をまとめます。

まずサーバーを起動しておきます（以下はすべて別ターミナルから実行）。

```sh
bun run dev
```

### Hello World

`/` へアクセスするとテキストを返します。

```sh
curl http://localhost:3001/
# => You can access: /static/hello.txt
```

### ポート変更 (Change port number)

`export default` で `port: 3001` を指定しています。`3001` で待ち受けていることを確認します。

```sh
curl -sI http://localhost:3001/ | head -1
# => HTTP/1.1 200 OK
```

### 静的ファイルの配信 (Serve static files) / rewriteRequestPath

URL の `/static/*` を `rewriteRequestPath` でフォルダ `./statics` にマップしています。

```sh
curl http://localhost:3001/static/hello.txt
# => こんにちは。Hono！  (statics/hello.txt の内容)
```

### favicon

`/favicon.ico` はプロジェクトルートの `./favicon.ico` を返します。

```sh
curl -sI http://localhost:3001/favicon.ico | grep -i content-type
# => content-type: image/x-icon  など
```

### mimes (カスタム MIME タイプ)

`m3u8` → `application/vnd.apple.mpegurl`、`ts` → `video/mp2t` を設定しています。

```sh
curl -sI http://localhost:3001/static/playlist.m3u8 | grep -i content-type
# => content-type: application/vnd.apple.mpegurl

curl -sI http://localhost:3001/static/segment0.ts | grep -i content-type
# => content-type: video/mp2t
```

### onFound

ファイルが見つかったとき `Cache-Control` ヘッダー（1週間 = `max-age=604800`）を付与します。

```sh
curl -sI http://localhost:3001/static/hello.txt | grep -i cache-control
# => cache-control: public, immutable, max-age=604800
```

### onNotFound

ファイルが見つからないとき、サーバー側のコンソールにログを出力します。

```sh
curl -s http://localhost:3001/static/no-such-file.txt
```

→ `bun run dev` を実行しているターミナルに次のようなログが出力されます。

```
./statics/no-such-file.txt is not found, you access /static/no-such-file.txt
```

### precompressed (事前圧縮ファイルの配信)

`Accept-Encoding` に応じて `.br` > `.zst` > `.gz` の優先順位で圧縮済みファイルを返します（`statics/hello.txt.gz` を用意済み）。

```sh
# gzip 版が返る
curl -sI -H "Accept-Encoding: gzip" http://localhost:3001/static/hello.txt | grep -i content-encoding
# => content-encoding: gzip

# ヘッダー無しなら非圧縮の元ファイルが返る
curl -sI http://localhost:3001/static/hello.txt | grep -i content-encoding
# => (出力なし)
```

### フォールバック

上記いずれにも該当しないパスは `./statics/fallback.txt` を返します。

```sh
curl http://localhost:3001/any/other/path
# => statics/fallback.txt の内容
```

### テスト (Testing)

`bun:test` でアプリの `fetch` をテストできます。

```sh
bun test
# => 1 pass / 0 fail
```
