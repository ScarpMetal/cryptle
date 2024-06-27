import { ReactNode, useCallback, useEffect, useState } from 'react'
import { combineClasses } from '~/utils'
import './Modal.scss'

export interface ModalProps {
    className?: string
    children: ReactNode | ReactNode[]
    onClose?: () => void
    animate?: boolean
}

export default function Modal({ className, children, onClose, animate = false }: ModalProps) {
    const [animClass, setAnimClass] = useState<'slide-in' | 'slide-out' | null>(() =>
        animate === true ? 'slide-in' : null,
    )

    const handleClose = useCallback(() => {
        if (animate) {
            setAnimClass('slide-out')
        } else {
            onClose?.()
        }
    }, [animate, onClose])

    useEffect(() => {
        if (animClass === 'slide-out') {
            const timeout = setTimeout(() => {
                onClose?.()
            }, 1000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [animClass, onClose])

    console.log('animClass', animClass)

    return (
        <div className={combineClasses('modal-container', animClass)}>
            <div className={combineClasses('modal', className)}>
                {!!onClose && (
                    <button type="button" className="close-modal-button" onClick={handleClose}>
                        X
                    </button>
                )}
                {children}
            </div>
        </div>
    )
}
