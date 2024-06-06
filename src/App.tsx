import './App.scss'
import Carousel from './components/carousel'
import { sixLetterWords } from './constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import keyIcon from './assets/key-icon.svg'
import { shuffle } from './utils'
import './firebase'
import Modal from './components/modal/Modal'
import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase'

function App() {
    const [selectedLetters, setSelectedLetters] = useState<string[]>(() => new Array(6).fill(''))
    const [correctRows, setCorrectRows] = useState<string[]>(() => new Array(6).fill(''))
    const [incorrectRows, setIncorrectRows] = useState(() => {
        const rows: string[][] = []
        for (let i = 0; i < 6; i++) {
            rows.push([])
        }
        return rows
    })
    const [remainingKeys, setRemainingKeys] = useState(5)
    const [showModal, setShowModal] = useState(false)
    const [keyHistory, setKeyHistory] = useState(() => new Array(6).fill(''))

    /**
     * Select a few random words
     */
    const randomWords = useMemo(() => {
        const randomWords = []
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * sixLetterWords.length)
            randomWords.push(sixLetterWords[randomIndex])
        }
        return randomWords
    }, [])

    /**
     * Select a target word from the array of random words
     */
    const targetWord = useMemo(() => randomWords[Math.floor(Math.random() * randomWords.length)], [randomWords])

    const letterRows = useMemo(() => {
        /**
         * Create rows from random words (use sets so we can dedupe)
         */
        const rowSets = []
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            const rowSet = new Set<string>()
            randomWords.forEach((word) => {
                const letter = word.charAt(rowIndex)
                rowSet.add(letter)
            })
            rowSets.push(rowSet)
        }

        /**
         * Create row arrays
         */
        const rows = rowSets.map((rowSet) => [...rowSet])
        rows.forEach((row) => shuffle(row))
        return rows
    }, [randomWords])

    const disableTestButton = useMemo(
        () =>
            remainingKeys <= 0 ||
            selectedLetters.some((letter) => !letter) ||
            selectedLetters.filter(
                (letter, index) => correctRows[index] !== letter && !incorrectRows[index].includes(letter),
            ).length === 0,
        [remainingKeys, selectedLetters, correctRows, incorrectRows],
    )

    const roundWon = useMemo(() => {
        const lettersAreSelected = !selectedLetters.some((letter, index) => targetWord.charAt(index) !== letter)
        const lettersAreTested = !correctRows.some((letter) => !letter)
        return lettersAreSelected && lettersAreTested
    }, [selectedLetters, correctRows, targetWord])

    const roundFailed = useMemo(() => {
        return remainingKeys <= 0
    }, [remainingKeys])

    const roundComplete = useMemo(() => roundWon || roundFailed, [roundWon, roundFailed])

    useEffect(() => {
        if (roundComplete) {
            logEvent(analytics, 'round_complete')
            setTimeout(() => {
                setShowModal(true)
            }, 1000)
        }
    }, [roundComplete])

    useEffect

    const handleLetterChange = useCallback((row: number, letter: string) => {
        setSelectedLetters((prev) => {
            const nextSelectedLetters: string[] = []
            for (let i = 0; i < 6; i++) {
                if (row === i) {
                    nextSelectedLetters.push(letter)
                } else {
                    nextSelectedLetters.push(prev[i])
                }
            }
            return nextSelectedLetters
        })
    }, [])

    const handleTestClick = useCallback(() => {
        if (disableTestButton && roundComplete) {
            setShowModal(true)
            logEvent(analytics, 'reopen_modal')
        }
        if (disableTestButton) return
        logEvent(analytics, 'test_button_click')
        const guessHistoryRows: string[] = []
        selectedLetters.forEach((letter, i) => {
            if (letter === targetWord.charAt(i)) {
                guessHistoryRows.push('🟩')
                setCorrectRows((prev) => prev.map((existingLetter, index) => (i === index ? letter : existingLetter)))
            } else {
                guessHistoryRows.push('⬛️')
                setIncorrectRows((prev) => {
                    const nextIncorrectRows: string[][] = []
                    for (let index = 0; index < 6; index++) {
                        if (i === index) {
                            const nextIncorrectRow: string[] = [...new Set([...prev[index], letter])]
                            nextIncorrectRows.push(nextIncorrectRow)
                        } else {
                            nextIncorrectRows.push(prev[index])
                        }
                    }
                    return nextIncorrectRows
                })
            }
        })

        setKeyHistory((prev) => prev.map((row, index) => row + guessHistoryRows[index]))
        setRemainingKeys((prev) => Math.max(0, prev - 1))
    }, [selectedLetters, targetWord, disableTestButton, roundComplete])

    return (
        <>
            <h1>cryptle</h1>
            {/* <p>word: {targetWord}</p> */}
            {/* <p>
                selected:{' '}
                {selectedLetters
                    .map((letter) => (letter === '' ? '?' : letter))
                    .join(' ')}
            </p> */}
            <div className="carousels">
                <Carousel
                    rowIndex={0}
                    letters={letterRows[0]}
                    correct={correctRows[0]}
                    incorrect={incorrectRows[0]}
                    onChangeLetter={handleLetterChange}
                />
                <Carousel
                    rowIndex={1}
                    letters={letterRows[1]}
                    correct={correctRows[1]}
                    incorrect={incorrectRows[1]}
                    onChangeLetter={handleLetterChange}
                />
                <Carousel
                    rowIndex={2}
                    letters={letterRows[2]}
                    correct={correctRows[2]}
                    incorrect={incorrectRows[2]}
                    onChangeLetter={handleLetterChange}
                />
                <Carousel
                    rowIndex={3}
                    letters={letterRows[3]}
                    correct={correctRows[3]}
                    incorrect={incorrectRows[3]}
                    onChangeLetter={handleLetterChange}
                />
                <Carousel
                    rowIndex={4}
                    letters={letterRows[4]}
                    correct={correctRows[4]}
                    incorrect={incorrectRows[4]}
                    onChangeLetter={handleLetterChange}
                />
                <Carousel
                    rowIndex={5}
                    letters={letterRows[5]}
                    correct={correctRows[5]}
                    incorrect={incorrectRows[5]}
                    onChangeLetter={handleLetterChange}
                />
                <div className="center" />
            </div>
            <div className="test-row">
                <button
                    className="test-button"
                    type="button"
                    onClick={handleTestClick}
                    data-disabled={disableTestButton}
                >
                    <img src={keyIcon} alt="key" />
                </button>
                <div className="remaining-keys">x{remainingKeys}</div>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2>{roundWon ? 'Success' : 'Failed'}</h2>
                    <div className="key-history">
                        {keyHistory.map((row, index) => (
                            <div className="key-history-row" key={index}>
                                {row}
                            </div>
                        ))}
                    </div>
                    <h3>The word was "{targetWord}"</h3>
                </Modal>
            )}
        </>
    )
}

export default App
