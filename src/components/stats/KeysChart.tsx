import { useMemo } from 'react'
import { combineClasses, getDateKey } from '~/utils'
import './KeysChart.scss'

export interface KeysChartProps {
    targetDate: Date
    data: { [dateKey: string]: LocalLevelData }
}

export default function KeysChart({ targetDate, data }: KeysChartProps) {
    const bars: { label: string; title?: string; height: number; today: boolean }[] = useMemo(() => {
        const counts: number[] = new Array(6).fill(0)
        Object.values(data).forEach(({ keysUsed }) => {
            if (keysUsed === -1) {
                counts[5]++
            } else {
                counts[keysUsed - 1]++
            }
        })

        const max = Math.max(...counts)
        const todaysDateKey = getDateKey(targetDate)
        const keysUsedToday = data[todaysDateKey]?.keysUsed
        return [
            { label: '1', height: max > 0 ? (counts[0] / max) * 100 : 0, today: keysUsedToday === 1 },
            { label: '2', height: max > 0 ? (counts[1] / max) * 100 : 0, today: keysUsedToday === 2 },
            { label: '3', height: max > 0 ? (counts[2] / max) * 100 : 0, today: keysUsedToday === 3 },
            { label: '4', height: max > 0 ? (counts[3] / max) * 100 : 0, today: keysUsedToday === 4 },
            { label: '5', height: max > 0 ? (counts[4] / max) * 100 : 0, today: keysUsedToday === 5 },
            {
                label: 'NC',
                title: 'Not Completed',
                height: max > 0 ? (counts[5] / max) * 100 : 0,
                today: keysUsedToday === -1,
            },
        ]
    }, [data, targetDate])

    return (
        <>
            <div className="keys-chart-title">Keys Used</div>
            <div className="keys-chart">
                {bars.map(({ label, title, height, today }, index) => {
                    return (
                        <div key={index} className="column">
                            <div className={combineClasses('bar', today && 'today')} style={{ height }} />
                            <div className="label" title={title}>
                                {label}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
