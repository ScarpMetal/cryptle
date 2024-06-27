import { format } from 'date-fns'

export function shuffle<T>(array: T[]) {
    let currentIndex = array.length

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

export function constrain(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max))
}

export function formatCount(count: number) {
    if (count >= 10000) return (count / 1000).toFixed(0) + 'K'
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
    return count
}

export function combineClasses(...args: unknown[]) {
    return args.filter(Boolean).join(' ')
}

export function getDateKey(date: Date) {
    return format(date, 'yyyy-MM-dd')
}
