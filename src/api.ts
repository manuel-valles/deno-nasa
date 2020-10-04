import { Context, Router } from 'https://deno.land/x/oak@v6.3.0/mod.ts';

const router: Router = new Router()

router.get('/', (ctx: Context) => {
    ctx.response.body = 'Hello Oak!'
})

export default router