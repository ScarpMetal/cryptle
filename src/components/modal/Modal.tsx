import { ReactNode, useCallback } from 'react'
import './Modal.scss'

export interface ModalProps {
    children: ReactNode | ReactNode[]
    onClose?: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
    const handleClose = useCallback(() => onClose?.(), [onClose])
    return (
        <div className="modal-container" onClick={handleClose}>
            <div className="modal">
                <button type="button" className="close-modal-button" onClick={handleClose}>
                    X
                </button>
                {children}
            </div>
        </div>
    )
}
