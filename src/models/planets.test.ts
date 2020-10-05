import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { filterHabitablePlanets } from './planets.ts'

const HABITABLE_PLANET = {
    koi_disposition: 'CONFIRMED',
    koi_prad: '1',
    koi_srad: '1'
}

const NOT_CONFIRMED = {
    koi_disposition: 'FALSE POSITIVE'
}

const TOO_LARGE_PLANETARY_RADIUS = {
    koi_disposition: 'CONFIRMED',
    koi_prad: '1.5',
    koi_srad: '1'
}

const TOO_LARGE_STELLAR_RADIUS = {
    koi_disposition: 'CONFIRMED',
    koi_prad: '1',
    koi_srad: '1.01'
}

Deno.test('filter only habitable planets', () => {
    const filtered = filterHabitablePlanets([
        HABITABLE_PLANET,
        NOT_CONFIRMED,
        TOO_LARGE_PLANETARY_RADIUS,
        TOO_LARGE_STELLAR_RADIUS
    ])
    assertEquals(filtered, [
        HABITABLE_PLANET
    ])
})