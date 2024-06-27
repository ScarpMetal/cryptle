import { logEvent } from 'firebase/analytics'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import keyIcon from '~/assets/key-icon.svg'
import Carousel from '~/components/carousel'
import LevelModal, { LevelModalHandle } from '~/components/level-modal'
import { NUM_STARTING_KEYS } from '~/constants/general'
import { analytics } from '~/firebase'
import useExistingLevelData from '~/hooks/useExistingLevelData'
import useLevel from '~/hooks/useLevel'
import './Level.scss'

export interface LevelProps {
    targetDate: Date
}

export default function Level({ targetDate }: LevelProps) {
    const levelModalRef = useRef<LevelModalHandle>(null)
    const [selectedLetters, setSelectedLetters] = useState<string[]>(() => new Array(6).fill(''))
    const [correctRows, setCorrectRows] = useState<string[]>(() => new Array(6).fill(''))
    const [incorrectRows, setIncorrectRows] = useState(() => {
        const rows: string[][] = []
        for (let i = 0; i < 6; i++) {
            rows.push([])
        }
        return rows
    })
    const [remainingKeys, setRemainingKeys] = useState(NUM_STARTING_KEYS)
    const [existingLevelData, setExistingLevelData] = useExistingLevelData(targetDate)

    const { targetWord, letterRows } = useLevel(targetDate)

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
        return remainingKeys <= 0 && !roundWon
    }, [remainingKeys, roundWon])

    const roundComplete = useMemo(
        () => roundWon || roundFailed || existingLevelData !== null,
        [roundWon, roundFailed, existingLevelData],
    )

    // Register a round win
    useEffect(() => {
        let timeout: number
        if (existingLevelData === null && roundWon) {
            logEvent(analytics, 'round_won')
            const keysUsed = NUM_STARTING_KEYS - remainingKeys
            timeout = setTimeout(() => {
                setExistingLevelData({ keysUsed })
            }, 2000)
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [existingLevelData, roundWon, remainingKeys, setExistingLevelData])

    // Register a round loss
    useEffect(() => {
        let timeout: number
        if (existingLevelData === null && roundFailed) {
            logEvent(analytics, 'round_failed')
            timeout = setTimeout(() => {
                setExistingLevelData({ keysUsed: -1 })
            }, 2000)
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [existingLevelData, roundFailed, setExistingLevelData])

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
            levelModalRef.current?.show()
            logEvent(analytics, 'reopen_modal')
        }

        if (disableTestButton) return
        logEvent(analytics, 'test_button_click')
        selectedLetters.forEach((letter, i) => {
            if (letter === targetWord.charAt(i)) {
                setCorrectRows((prev) => prev.map((existingLetter, index) => (i === index ? letter : existingLetter)))
            } else {
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

        setRemainingKeys((prev) => Math.max(0, prev - 1))
    }, [disableTestButton, roundComplete, selectedLetters, targetWord])

    return (
        <>
            <div className="carousels">
                <Carousel
                    rowIndex={0}
                    letters={letterRows[0]}
                    correct={correctRows[0]}
                    incorrect={incorrectRows[0]}
                    onChangeLetter={handleLetterChange}
                    disabled={roundComplete}
                />
                <Carousel
                    rowIndex={1}
                    letters={letterRows[1]}
                    correct={correctRows[1]}
                    incorrect={incorrectRows[1]}
                    onChangeLetter={handleLetterChange}
                    disabled={roundComplete}
                />
                <Carousel
                    rowIndex={2}
                    letters={letterRows[2]}
                    correct={correctRows[2]}
                    incorrect={incorrectRows[2]}
                    onChangeLetter={handleLetterChange}
                    disabled={roundComplete}
                />
                <Carousel
                    rowIndex={3}
                    letters={letterRows[3]}
                    correct={correctRows[3]}
                    incorrect={incorrectRows[3]}
                    onChangeLetter={handleLetterChange}
                    disabled={roundComplete}
                />
                <Carousel
                    rowIndex={4}
                    letters={letterRows[4]}
                    correct={correctRows[4]}
                    incorrect={incorrectRows[4]}
                    onChangeLetter={handleLetterChange}
                    disabled={roundComplete}
                />
                <Carousel
                    rowIndex={5}
                    letters={letterRows[5]}
                    correct={correctRows[5]}
                    incorrect={incorrectRows[5]}
                    onChangeLetter={handleLetterChange}
                    disabled={roundComplete}
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

            <LevelModal ref={levelModalRef} data={existingLevelData} targetDate={targetDate} targetWord={targetWord} />
        </>
    )
}
