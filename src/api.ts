import { Context, Router } from 'https://deno.land/x/oak@v6.3.0/mod.ts';
import * as planets from './models/planets.ts'

const router: Router = new Router()

router.get('/', (ctx: Context) => {
    ctx.response.body = 'Hello Oak!'
})

router.get('/planets', (ctx: Context) => {
    // Example specific error - Oak won't show the message as body for 500 statuses
    // ctx.throw(501, "Sorry planets aren't available!")
    ctx.response.body = planets.getAllPlanets()
})

export default router