import { format } from 'date-fns'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import Modal from '~/components/modal'
import './LevelModal.scss'

export interface LevelModalHandle {
    show: () => void
    hide: () => void
}

export interface LevelModalProps {
    data: LocalLevelData | null
    targetDate: Date
    targetWord: string
}

const LevelModal = forwardRef<LevelModalHandle, LevelModalProps>(({ data, targetDate, targetWord }, ref) => {
    const dataExistsOnFirstRender = useRef(!!data)
    const [show, setShow] = useState(() => !!data)
    const [revealWord, setRevealWord] = useState(false)

    useImperativeHandle(
        ref,
        () => ({
            show() {
                setShow(true)
            },
            hide() {
                setShow(false)
            },
        }),
        [],
    )

    const modalOnClose = useMemo(() => {
        if (dataExistsOnFirstRender.current) {
            return undefined
        }
        return () => {
            setShow(false)
        }
    }, [])

    // Show modal if data exists
    useEffect(() => {
        if (!dataExistsOnFirstRender.current && data) {
            setShow(true)
        }
    }, [data])

    const toggleWordReveal = useCallback(() => {
        setRevealWord((prev) => !prev)
    }, [])

    if (!data) return null
    if (!show) return null

    return (
        <Modal animate={!dataExistsOnFirstRender.current} onClose={modalOnClose}>
            <h4>{format(targetDate, 'MMMM do, yyyy')}</h4>
            <h2>{data.keysUsed !== -1 ? 'Success' : 'Failed'}</h2>
            <p>
                {!revealWord && (
                    <button className="click-to-reveal" type="button" onClick={toggleWordReveal}>
                        Click to reveal word
                    </button>
                )}
                {revealWord && <span className="revealed-word">{targetWord}</span>}
            </p>
            {revealWord && (
                <p className="visit-tomorrow">
                    <i>Visit tomorrow for a new word</i>
                </p>
            )}
        </Modal>
    )
})

export default LevelModal
