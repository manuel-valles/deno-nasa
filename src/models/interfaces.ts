export interface Launch {
    flightNumber: number
    mission: string
    rocket: string
    customers: string[]
    launchDate: number
    upcoming: boolean
    success?: boolean
    target?: string
}

export interface Payload {
    customers: string[]
}