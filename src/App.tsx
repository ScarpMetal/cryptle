import { differenceInDays } from 'date-fns'
import { useMemo } from 'react'
import Level from '~/components/level/Level'
import { releaseDate } from '~/constants/general'
import './App.scss'
import { sixLetterWords } from './constants/words'
import './firebase'

function App() {
    /**
     * Select a target word based on the current day
     */
    const targetWord = useMemo(() => {
        const wordIndex = differenceInDays(new Date(), releaseDate)
        return sixLetterWords[wordIndex]
    }, [])

    return (
        <>
            <h1>cryptle</h1>
            {/* <p>word: {targetWord}</p> */}
            <Level targetWord={targetWord} key={targetWord} />
        </>
    )
}

export default App
