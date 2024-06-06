import { ReactNode, useCallback, useRef } from 'react'
import './Modal.scss'

export interface ModalProps {
    children: ReactNode | ReactNode[]
    onClose?: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
    const ref = useRef<HTMLDivElement>(null)

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose()
        }
    }, [onClose])

    const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            if (!ref.current?.contains(event.target as Node)) {
                handleClose()
            }
        },
        [handleClose],
    )

    return (
        <div className="modal-container" onClick={handleBackgroundClick}>
            <div className="modal" ref={ref}>
                <button type="button" className="close-modal-button" onClick={handleClose}>
                    X
                </button>
                {children}
            </div>
        </div>
    )
}
