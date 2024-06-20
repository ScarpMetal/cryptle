import { differenceInDays } from 'date-fns'
import { useMemo } from 'react'
import { releaseDate } from '~/constants/general'
import { sixLetterWords } from '~/constants/words'
import { shuffle } from '~/utils'

export default function useLevel(targetDate: Date) {
    /**
     * Select a target word based on the current day
     */
    const targetWord = useMemo(() => {
        const wordIndex = differenceInDays(targetDate, releaseDate)
        return sixLetterWords[wordIndex]
    }, [targetDate])

    const letterRows = useMemo(() => {
        // Score each word based on how close it is to the target word
        const scores: { word: string; score: number }[] = sixLetterWords.map((word) => {
            if (word === targetWord) return { word, score: -1 }
            let score = 0
            for (let i = 0; i < 6; i++) {
                if (word.charAt(i) === targetWord.charAt(i)) {
                    score++
                }
            }
            return { word, score }
        })

        // Select most similar words to target word
        scores.sort((a, b) => b.score - a.score)
        const selectedWords = [targetWord, ...scores.slice(0, 20).map(({ word }) => word)]

        // Create row sets (for deduping letters) based off of selected words
        const rowSets = []
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            const rowSet = new Set<string>()
            selectedWords.forEach((word) => {
                const letter = word.charAt(rowIndex)
                rowSet.add(letter)
            })
            rowSets.push(rowSet)
        }

        // Create row arrays and shuffle letters
        const rows = rowSets.map((rowSet) => [...rowSet])
        rows.forEach((row) => shuffle(row))
        return rows
    }, [targetWord])

    return { targetWord, letterRows }
}
