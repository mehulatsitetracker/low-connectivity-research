// Unified dev server: serves the landing page and all apps on one port,
// mirroring the GitHub Pages URL layout (/low-connectivity-research/<app>/).
// Each app runs as a Vite instance in middleware mode, so HMR still works.
import http from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer as createViteServer } from 'vite'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const BASE = '/low-connectivity-research/'
const PORT = 5173
const APPS = [
  'connectivity',
  'auth-messages',
  'adhoc-job',
  'chatter',
  'forms-improvement',
  'sparkle-help-agent',
  'search-filtering',
]

const viteServers = await Promise.all(
  APPS.map((name, i) =>
    createViteServer({
      root: path.join(ROOT, 'apps', name),
      server: {
        middlewareMode: true,
        // each instance needs its own HMR websocket port; the browser is
        // pointed at it automatically by the injected Vite client
        hmr: { port: 24700 + i },
      },
    })
  )
)

const server = http.createServer((req, res) => {
  const url = req.url ?? '/'

  const appIndex = APPS.findIndex((name) => url.startsWith(BASE + name + '/'))
  if (appIndex !== -1) {
    viteServers[appIndex].middlewares(req, res, () => {
      res.statusCode = 404
      res.end('Not found')
    })
    return
  }

  // /low-connectivity-research/<app> without trailing slash
  const bare = APPS.find((name) => url === BASE + name)
  if (bare) {
    res.writeHead(302, { Location: BASE + bare + '/' })
    res.end()
    return
  }

  if (url === '/' || url === BASE.slice(0, -1)) {
    res.writeHead(302, { Location: BASE })
    res.end()
    return
  }

  if (url === BASE || url === BASE + 'index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(readFileSync(path.join(ROOT, 'index.html')))
    return
  }

  res.statusCode = 404
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`\n  Hub running at http://localhost:${PORT}${BASE}\n`)
  for (const name of APPS) {
    console.log(`  - http://localhost:${PORT}${BASE}${name}/`)
  }
  console.log()
})
