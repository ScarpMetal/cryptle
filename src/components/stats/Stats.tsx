import { addDays, differenceInCalendarDays } from 'date-fns'
import { useMemo } from 'react'
import KeysChart from '~/components/stats/KeysChart'
import { releaseDate } from '~/constants/general'
import { getDateKey } from '~/utils'
import './Stats.scss'

export interface StatsProps {
    targetDate: Date
}

export default function Stats({ targetDate }: StatsProps) {
    const data = useMemo(() => {
        const saved: { [dateKey: string]: LocalLevelData } = {}
        const numDays = differenceInCalendarDays(new Date(), releaseDate) + 1
        // Loop through localstorage to find any saved date data
        for (let dayIndex = 0; dayIndex < numDays; dayIndex++) {
            const dateCheck = addDays(releaseDate, dayIndex)
            const dateKey = getDateKey(dateCheck)
            try {
                const dateDataStr = localStorage.getItem(dateKey)
                if (dateDataStr !== null) {
                    const dateData = JSON.parse(dateDataStr)
                    saved[dateKey] = dateData
                }
            } catch (e) {
                console.log(e)
            }
        }
        return saved
    }, [])

    return (
        <div>
            {/* Stats
            <hr /> */}
            <KeysChart targetDate={targetDate} data={data} />
            {/* <Calendar targetDate={targetDate} data={data} /> */}
        </div>
    )
}
