import { Duration } from "luxon";

export function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

export function convertToMillis(interval) {
    return Duration.fromObject(interval)
        .as('milliseconds')
}