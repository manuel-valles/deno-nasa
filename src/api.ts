import { Router, RouterContext } from 'https://deno.land/x/oak@v6.3.0/mod.ts';
import * as planets from './models/planets.ts'
import * as launches from './models/launches.ts'
import { Launch } from './models/interfaces.ts'

const router: Router = new Router()

router.get('/', (ctx: RouterContext): void => {
    ctx.response.body = 'Hello Oak!'
})

router.get('/planets', (ctx: RouterContext): void => {
    // Example specific error - Oak won't show the message as body for 500 statuses
    // ctx.throw(501, "Sorry planets aren't available!")
    ctx.response.body = planets.getAllPlanets()
})

router.get('/launches', (ctx: RouterContext): void => {
    ctx.response.body = launches.getAll()
})

router.get('/launches/:id', (ctx: RouterContext): void => {
    const id = ctx.params?.id
    if (id) {
        const launchesList = launches.getOne(Number(id))
        if (launchesList) {
            ctx.response.body = launchesList
        } else {
            ctx.throw(400, "Launch with that ID doesn't exist")
        }
    }
})

router.post('/launches', async (ctx: RouterContext): Promise<void> => {
    const newLaunch: Launch = await ctx.request.body().value
    launches.addOne(newLaunch)

    ctx.response.body = { success: true }
    ctx.response.status = 201
})

export default router