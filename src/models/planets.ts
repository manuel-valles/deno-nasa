import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from 'https://deno.land/std/io/mod.ts';
import { parse } from 'https://deno.land/std/encoding/csv.ts';

import * as _ from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

type Planet = Record<string, string>

let planets: Planet[]

const loadPlanetsData = async (): Promise<Planet[]> => {
    const path: string = join('src/data', 'kepler_exoplanets_nasa.csv')

    const file: Deno.File = await Deno.open(path)
    const bufReader: BufReader = new BufReader(file)
    const result = await parse(bufReader, {
        skipFirstRow: true,
        comment: '#'
    })

    Deno.close(file.rid)

    const planets: Planet[] = (result as Planet[]).filter((planet: Planet) => {
        const planetaryRadius = Number(planet.koi_prad)
        const stellarRadius = Number(planet.koi_srad)

        return planet.koi_disposition === 'CONFIRMED'
            && planetaryRadius > 0.5 && planetaryRadius < 1.5
            && stellarRadius > 0.99 && stellarRadius < 1.01
    })

    return planets.map(planet => _.pick(planet, [
        'koi_prad',
        'koi_srad',
        'kepler_name',
        'koi_steff'
    ]))
}

planets = await loadPlanetsData()
console.log(`${planets.length} habitable planets found!`)

export const getAllPlanets = () => planets