import { useCallback, useEffect, useState } from 'react'
import './Carousel.scss'

export interface CarouselProps {
    rowIndex: number
    letters: string[]
    correct: string
    incorrect: string[]
    onChangeLetter: (row: number, letter: string) => void
}

const letterSize = 64
const numLettersInContainerViewport = 10

export default function Carousel({
    rowIndex,
    letters,
    correct,
    incorrect,
    onChangeLetter,
}: CarouselProps) {
    const [ref, setRef] = useState<HTMLDivElement | null>(null)

    const handleCarouselUnsettled = useCallback(() => {
        console.log('unsettled')
        onChangeLetter(rowIndex, '')
    }, [onChangeLetter, rowIndex])

    const handleCarouselSettled = useCallback(
        (x: number) => {
            console.log('settled')
            const letterIndex = Math.floor(
                -x / letterSize + numLettersInContainerViewport / 2,
            )
            const letter = letters[letterIndex]
            console.log('letterIndex=', letterIndex)
            console.log('letter=', letter)
            onChangeLetter(rowIndex, letter)
        },
        [onChangeLetter, rowIndex, ref, letters],
    )

    useEffect(() => {
        if (!ref) return // Make sure ref exists

        /**
         * Init variables
         */
        const letterMiddle = letterSize / 2
        const drag = 0.9
        const centerForce = 0.1
        let holding = false
        let posX =
            (numLettersInContainerViewport * letterSize - ref.clientWidth) / 2
        let velX = 0
        let mouseX = 0
        let lastMouseX = 0
        let settled = false

        /*
         * Create listener functions
         */
        const mouseDown = (event: MouseEvent) => {
            holding = true
            mouseX = event.pageX
            if (settled) {
                settled = false
                handleCarouselUnsettled()
            }
        }
        const mouseMove = (event: MouseEvent) => {
            mouseX = event.pageX
        }
        const mouseUp = () => {
            holding = false
        }

        /*
         * Attach listeners
         */
        ref.addEventListener('mousedown', mouseDown)
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)

        /*
         * Loop
         */
        let frame: number
        function loop() {
            frame = requestAnimationFrame(loop)

            if (!ref) return // For type safety

            const deltaMouseX = mouseX - lastMouseX
            const deltaLetterMiddle =
                letterMiddle -
                (posX > 0
                    ? posX % letterSize
                    : letterSize + (posX % letterSize))
            if (holding) {
                velX = deltaMouseX
            } else {
                if (Math.abs(deltaLetterMiddle) > 1) {
                    velX +=
                        (deltaLetterMiddle / Math.abs(deltaLetterMiddle)) *
                        centerForce
                }

                velX *= drag
            }

            if (!settled && !holding && Math.abs(velX) < 0.01) {
                settled = true
                handleCarouselSettled(posX)
            }

            posX += velX // Apply velocity
            const maxPosX = Math.floor(
                (numLettersInContainerViewport / 2) * letterSize - 0.01,
            )
            const minPosX =
                -ref.clientWidth +
                (numLettersInContainerViewport / 2) * letterSize +
                0.01
            posX = Math.min(maxPosX, Math.max(posX, minPosX)) // clamp position to bounds

            ref.style.left = `${posX}px`

            // Setup for next loop iteration
            lastMouseX = mouseX
        }
        loop()

        return () => {
            ref.removeEventListener('mousedown', mouseDown)
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('mouseup', mouseUp)
            cancelAnimationFrame(frame)
        }
    }, [ref, handleCarouselSettled, handleCarouselUnsettled])

    return (
        <div
            className="carousel-container"
            style={{
                fontSize: letterSize,
                width: `${numLettersInContainerViewport}em`,
            }}
        >
            <div className="carousel" ref={setRef}>
                {letters.map((letter, index) => {
                    let status = 'unknown'
                    if (letter === correct) {
                        status = 'correct'
                    } else if (incorrect.includes(letter)) {
                        status = 'incorrect'
                    }
                    return (
                        <div
                            className="letter"
                            key={index}
                            data-status={status}
                            data-row-index={rowIndex}
                        >
                            <div className="inner">{letter}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
