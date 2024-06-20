import { useCallback, useEffect, useState } from 'react'
import './Carousel.scss'

export interface CarouselProps {
    rowIndex: number
    letters: string[]
    correct: string
    incorrect: string[]
    disabled: boolean
    onChangeLetter: (row: number, letter: string) => void
}

const letterSize = 64
const numLettersInContainerViewport = 10

export default function Carousel({ rowIndex, letters, correct, incorrect, disabled, onChangeLetter }: CarouselProps) {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
    const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>(null)

    const handleCarouselUnsettled = useCallback(() => {
        onChangeLetter(rowIndex, '')
    }, [onChangeLetter, rowIndex])

    const handleCarouselSettled = useCallback(
        (x: number) => {
            const letterIndex = Math.floor(-x / letterSize + numLettersInContainerViewport / 2)
            const letter = letters[letterIndex]
            onChangeLetter(rowIndex, letter)
        },
        [onChangeLetter, rowIndex, carouselRef, letters],
    )

    useEffect(() => {
        if (!carouselRef || !containerRef) return // Make sure refs exists

        /**
         * Init variables
         */
        const letterMiddle = letterSize / 2
        const drag = 0.9
        const centerForce = 0.1
        const moveTowardsSpeed = 0.1
        const carouselWidth = carouselRef.clientWidth
        // const containerWidth = containerRef.clientWidth
        // const containerPageX = containerRef.getBoundingClientRect().x
        // const containerCenterPageX = containerPageX + containerWidth / 2
        const maxPosX = Math.floor((numLettersInContainerViewport / 2) * letterSize - 0.01)
        const minPosX = -carouselRef.clientWidth + (numLettersInContainerViewport / 2) * letterSize + 0.01
        let holding = false
        let posX = (numLettersInContainerViewport * letterSize - carouselWidth) / 2 // Container space
        let velX = 0
        let mouseX = 0
        let wheelX = 0
        let targetX: number | null = null // Container space
        let lastMouseX = 0
        let settled = false

        /**
         * Helper functions
         */
        // const toContainerSpaceX = (pageX: number) => pageX - containerPageX
        // const getCarouselPageX = () => containerPageX + posX
        // const getCarouselCenterPageX = () => getCarouselPageX() + carouselWidth / 2

        // const moveTargetBy = (moveBy: number) => {
        //     if (targetX) {
        //         targetX += moveBy
        //     } else {
        //         targetX = posX + moveBy
        //     }
        //     targetX = constrain(targetX, minPosX, maxPosX)
        //     if (settled) {
        //         settled = false
        //         handleCarouselUnsettled()
        //     }
        // }

        // const setPageTarget = (pageX: number) => {
        //     const deltaX = pageX - containerCenterPageX
        //     const rawTargetX = posX - deltaX
        //     targetX = constrain(Math.floor(rawTargetX / letterSize) * letterSize + letterSize / 2, minPosX, maxPosX)
        // }

        const moveTowards = (targetPosX: number, speed: number) => {
            if (!carouselRef || !containerRef) return // For type safety
            const deltaX = targetPosX - posX
            const isClose = Math.abs(deltaX) <= Math.abs(velX) + speed

            if (isClose) {
                velX = 0
            } else {
                const moveByX = (deltaX / Math.abs(deltaX)) * speed
                velX += moveByX
            }

            return isClose
        }

        /*
         * Create listener functions
         */
        const handleScroll = (event: WheelEvent) => {
            wheelX = event.deltaX
            if (settled) {
                settled = false
                handleCarouselUnsettled()
            }
        }
        const handleMouseDown = (event: MouseEvent | TouchEvent) => {
            event.preventDefault()

            holding = true

            if ('pageX' in event) {
                mouseX = event.pageX
            }
            if ('changedTouches' in event) {
                const touchEvent = event.touches.item(0)
                if (touchEvent) {
                    mouseX = touchEvent.pageX
                }
            }
            lastMouseX = mouseX

            if (settled) {
                settled = false
                handleCarouselUnsettled()
            }
        }
        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if ('pageX' in event) {
                mouseX = event.pageX
            }
            if ('changedTouches' in event) {
                const touchEvent = event.touches.item(0)
                if (touchEvent) {
                    mouseX = touchEvent.pageX
                }
            }
        }
        const handleMouseUp = () => {
            holding = false
        }
        // const handleKeyDown = (event: KeyboardEvent) => {
        //     if (event.key === 'ArrowDown') {
        //     }
        //     if (event.key === 'ArrowUp') {
        //     }
        //     if (event.key === 'ArrowLeft') {
        //         // moveTargetBy(letterSize)
        //     }
        //     if (event.key === 'ArrowRight') {
        //         // moveTargetBy(-letterSize)
        //     }
        //     if (event.key === ' ') {
        //     }
        // }

        /*
         * Attach listeners
         */
        containerRef.addEventListener('wheel', handleScroll)
        // document.addEventListener('keydown', handleKeyDown)

        carouselRef.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        carouselRef.addEventListener('touchstart', handleMouseDown)
        document.addEventListener('touchmove', handleMouseMove)
        document.addEventListener('touchend', handleMouseUp)

        /*
         * Loop
         */
        let frame: number
        function loop() {
            frame = requestAnimationFrame(loop)

            if (!carouselRef || !containerRef) return // For type safety

            if (holding) {
                // Move with mouse
                velX = mouseX - lastMouseX
            } else if (wheelX) {
                // Move with mouse wheel
                velX = -wheelX
                wheelX *= drag
                if (wheelX < 1) {
                    wheelX = 0
                }
            } else if (targetX) {
                // Move towards target
                const isClose = moveTowards(targetX, moveTowardsSpeed)
                if (isClose) targetX = null
            } else {
                // Move to the center of a letter
                const deltaLetterMiddle =
                    letterMiddle - (posX > 0 ? posX % letterSize : letterSize + (posX % letterSize))

                if (Math.abs(deltaLetterMiddle) > 1) {
                    velX += (deltaLetterMiddle / Math.abs(deltaLetterMiddle)) * centerForce
                }

                // TODO - use moveTowards

                velX *= drag
            }

            // Determine whether to call the settled function
            if (!settled && !holding && !targetX && Math.abs(velX) < 0.03) {
                settled = true
                handleCarouselSettled(posX)
            }

            // Apply velocity
            posX += velX

            // Clamp positions to bounds

            posX = Math.min(maxPosX, Math.max(posX, minPosX))

            // Apply style
            carouselRef.style.left = `${posX}px`

            // Setup for next loop iteration
            lastMouseX = mouseX
        }
        loop()

        return () => {
            containerRef.removeEventListener('wheel', handleScroll)
            // document.removeEventListener('keydown', handleKeyDown)

            carouselRef.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)

            carouselRef.removeEventListener('touchstart', handleMouseDown)
            document.removeEventListener('touchmove', handleMouseMove)
            document.removeEventListener('touchend', handleMouseUp)

            cancelAnimationFrame(frame)
        }
    }, [containerRef, carouselRef, handleCarouselSettled, handleCarouselUnsettled])

    return (
        <div
            className="carousel-container"
            style={{
                fontSize: letterSize,
                width: `${numLettersInContainerViewport}em`,
                pointerEvents: disabled ? 'none' : 'initial',
            }}
            ref={setContainerRef}
        >
            <div className="carousel" ref={setCarouselRef}>
                {letters.map((letter, index) => {
                    let status = 'unknown'
                    if (letter === correct) {
                        status = 'correct'
                    } else if (incorrect.includes(letter)) {
                        status = 'incorrect'
                    }
                    return (
                        <div className="letter" key={index} data-status={status} data-row-index={rowIndex}>
                            <div className="inner">{letter}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
