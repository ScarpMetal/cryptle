import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import './Modal.scss'

export interface ModalProps {
    children: ReactNode | ReactNode[]
    onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [slideOut, setSlideOut] = useState(false)
    const slideOutTimeout = useRef<number | null>(null)

    const handleClose = useCallback(() => {
        setSlideOut(true)
    }, [])

    // const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    //     (event) => {
    //         if (!ref.current?.contains(event.target as Node)) {
    //             handleClose()
    //         }
    //     },
    //     [handleClose],
    // )

    useEffect(() => {
        if (slideOut && !slideOutTimeout.current) {
            slideOutTimeout.current = setTimeout(() => {
                onClose()
            }, 1000)
        }

        return () => {
            if (slideOutTimeout.current) {
                clearTimeout(slideOutTimeout.current)
                slideOutTimeout.current = null
            }
        }
    }, [slideOut, onClose])

    return (
        <div className={`modal-container ${slideOut ? 'out' : ''}`}>
            <div className="modal" ref={ref}>
                <button type="button" className="close-modal-button" onClick={handleClose}>
                    X
                </button>
                {children}
            </div>
        </div>
    )
}
