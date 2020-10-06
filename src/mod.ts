import { Application, Context, send } from 'https://deno.land/x/oak@v6.3.0/mod.ts';
import api from './api.ts'
import * as log from 'https://deno.land/std/log/mod.ts';
import * as flags from 'https://deno.land/std/flags/mod.ts';

const { args, exit } = Deno
const DEFAULT_PORT: number = 8000
const argPort = flags.parse(args).port
const port = argPort ? Number(argPort) : DEFAULT_PORT

if (isNaN(port)) {
    console.error('This is not a port number')
    exit(1)
}

const app: Application = new Application()

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler('INFO')
    },
    loggers: {
        defatult: {
            level: 'INFO',
            handlers: ['console']
        }
    }
})

app.addEventListener('error', event => {
    log.error(event.error)
})

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        ctx.response.body = 'Internal server error'
        throw error
    }
})

app.use(async (ctx: Context, next) => {
    await next()
    const time = ctx.response.headers.get('X-Response-Time')
    log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`)
});

app.use(async (ctx: Context, next) => {
    const start = Date.now()
    await next()
    const delta = Date.now() - start
    ctx.response.headers.set('X-Response-Time', `${delta}ms`)
});

app.use(api.routes());
app.use(api.allowedMethods())

app.use(async (ctx: Context) => {
    const filePath = ctx.request.url.pathname
    const fileWhitelist = [
        '/index.html',
        '/styles/style.css',
        '/scripts/script.js',
        '/images/favicon.ico'
    ]

    if (fileWhitelist.includes(filePath)) {
        await send(ctx, filePath, {
            root: `${Deno.cwd()}/public`
        })
    }
});

if (import.meta.main) {
    log.info(`Starting server on port ${port}...`)
    await app.listen({ port });
}