import * as log from 'https://deno.land/std/log/mod.ts';
import * as _ from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';
import { Launch, Payload } from './interfaces.ts'

const launches = new Map<number, Launch>()

export const downloadLaunchData = async (): Promise<void> => {
    log.info('Downloading launch data...')
    const response: Response = await fetch('https://api.spacexdata.com/v3/launches', {
        method: 'GET'
    })

    if (!response.ok) {
        log.warning('Problem downloading launch data')
        throw new Error('Launch data download failed.')
    }

    const launchData = await response.json()
    for (const launch of launchData) {
        const payloads: Payload[] = launch.rocket.second_stage.payloads
        const customers: string[] = _.flatMap(payloads, (payload: Payload) => payload.customers)
        const flightData: Launch = {
            flightNumber: launch.flight_number,
            mission: launch.mission_name,
            rocket: launch.rocket.rocket_name,
            customers,
            launchDate: launch.launch_date_unix,
            upcoming: launch.upcoming,
            success: launch.launch_success
        }

        launches.set(flightData.flightNumber, flightData)
        log.info(JSON.stringify(flightData))
    }
}


await downloadLaunchData()
log.info(`Downloaded data for ${launches.size} SpaceX launches.`)

export const getAll = (): Launch[] => Array.from(launches.values())

export const getOne = (id: number): Launch | undefined => {
    if (launches.has(id)) return launches.get(id)
}

export const addOne = (data: Launch): void => {
    const newLaunch: Launch = Object.assign(data, {
        customers: ['Deno', 'NASA'],
        upcoming: true
    })

    launches.set(data.flightNumber, newLaunch)
}