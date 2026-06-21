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
  })
)
app.get('*', serveStatic({ path: './statics/fallback.txt' }))

export default {
  port: 3001,
  fetch: app.fetch
}
