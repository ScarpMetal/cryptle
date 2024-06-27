import './Calendar.scss'

export interface CalendarProps {
    targetDate: Date
    data: { [dateKey: string]: LocalLevelData }
}

export default function Calendar() {
    return <div>Calendar</div>
}
