import { sixLetterWords } from '~/constants/words'

export const letterTree: { [key: string]: string[] }[] = []
for (let i = 0; i < 5; i++) {
    const letterTreeSet: { [key: string]: Set<string> } = {
        a: new Set<string>(),
        b: new Set<string>(),
        c: new Set<string>(),
        d: new Set<string>(),
        e: new Set<string>(),
        f: new Set<string>(),
        g: new Set<string>(),
        h: new Set<string>(),
        i: new Set<string>(),
        j: new Set<string>(),
        k: new Set<string>(),
        l: new Set<string>(),
        m: new Set<string>(),
        n: new Set<string>(),
        o: new Set<string>(),
        p: new Set<string>(),
        q: new Set<string>(),
        r: new Set<string>(),
        s: new Set<string>(),
        t: new Set<string>(),
        u: new Set<string>(),
        v: new Set<string>(),
        w: new Set<string>(),
        x: new Set<string>(),
        y: new Set<string>(),
        z: new Set<string>(),
    }

    for (let j = 0; j < sixLetterWords.length; j++) {
        const word = sixLetterWords[j]
        const letter = word.charAt(i)
        const nextLetter = word.charAt(i + 1)
        letterTreeSet[letter].add(nextLetter)
    }

    const letterTreeItem: { [key: string]: string[] } = {}
    for (const letter in letterTreeSet) {
        letterTreeItem[letter] = [...letterTreeSet[letter]]
    }

    letterTree.push(letterTreeItem)
}
