import { useCallback, useMemo, useState } from 'react'
import { getDateKey } from '~/utils'

export default function useExistingLevelData(date: Date) {
    const dateKey = useMemo(() => getDateKey(date), [date])
    const [levelData, _setLevelData] = useState(() => {
        const dataStr = localStorage.getItem(dateKey)
        if (dataStr === null) {
            return null
        }

        try {
            return JSON.parse(dataStr) as LocalLevelData
        } catch (e) {
            console.log(e)
            return null
        }
    })

    const setLevelData = useCallback(
        (data: LocalLevelData) => {
            // We should only set the data if there is no existing level data to
            // prevent unintentional overwriting of save data
            if (!levelData) {
                // update the react data
                _setLevelData(data)

                // Update local storage
                localStorage.setItem(dateKey, JSON.stringify(data))
            }
        },
        [dateKey, levelData],
    )

    return [levelData, setLevelData] as const
}
