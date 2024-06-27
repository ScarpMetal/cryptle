import './Calendar.scss'

export interface CalendarProps {
    targetDate: Date
    data: { [dateKey: string]: LocalLevelData }
}

export default function Calendar({ targetDate, data }: CalendarProps) {
    return <div>Calendar</div>
}
