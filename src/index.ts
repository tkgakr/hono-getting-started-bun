import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, '/statics'),
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
    onFound: (_path, c) => {
      c.header('Cache-Control', `public, immutable, max-age=604800`)
    },
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
    precompressed: true,
  })
)
app.get('*', serveStatic({ path: './statics/fallback.txt' }))

export default {
  port: 3001,
  fetch: app.fetch
}
