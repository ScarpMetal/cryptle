import { differenceInDays, format } from 'date-fns'
import { useMemo, useState } from 'react'
import Level from '~/components/level/Level'
import { releaseDate } from '~/constants/general'
import './App.scss'
import { sixLetterWords } from './constants/words'
import './firebase'

function App() {
    const [targetDate] = useState(() => new Date())
    /**
     * Select a target word based on the current day
     */
    const targetWord = useMemo(() => {
        const wordIndex = differenceInDays(targetDate, releaseDate)
        return sixLetterWords[wordIndex]
    }, [targetDate])

    return (
        <>
            <div>
                <h1>cryptle</h1>
                <h4>{format(targetDate, 'MMMM do, yyyy')}</h4>
            </div>
            <Level targetDate={targetDate} targetWord={targetWord} key={targetWord} />
            <p className="copyright">Matthew Graham © {new Date().getFullYear()}</p>
        </>
    )
}

export default App
