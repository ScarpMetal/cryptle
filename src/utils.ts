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
