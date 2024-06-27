import { format } from 'date-fns'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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

    if (!data) return null
    if (!show) return null

    return (
        <Modal animate={!dataExistsOnFirstRender.current} onClose={modalOnClose}>
            <h4>{format(targetDate, 'MMMM do, yyyy')}</h4>
            <h2>{data.keysUsed !== -1 ? 'Success' : 'Failed'}</h2>
            <p>The word was "{targetWord}"</p>
            <p style={{ fontSize: '.8em' }}>
                <i>Visit tomorrow for a new word</i>
            </p>
        </Modal>
    )
})

export default LevelModal
