import { Application, Context, send } from 'https://deno.land/x/oak@v6.3.0/mod.ts';
import api from './api.ts'

const app: Application = new Application();
const port: number = 8000

app.use(async (ctx: Context, next) => {
    await next()
    const time = ctx.response.headers.get('X-Response-Time')
    console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`)
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
        '/index.html'
    ]

    if (fileWhitelist.includes(filePath)) {
        await send(ctx, filePath, {
            root: `${Deno.cwd()}/public`
        })
    }
});

if (import.meta.main) {
    await app.listen({ port });
}