import { format } from 'date-fns'
import { useState } from 'react'
import Level from '~/components/level/Level'
import './App.scss'
import './firebase'

function App() {
    const [targetDate] = useState(() => new Date())

    return (
        <>
            <div>
                <h1>cryptle</h1>
                <h4>{format(targetDate, 'MMMM do, yyyy')}</h4>
            </div>
            <Level targetDate={targetDate} />
            <p className="copyright">
                <a href="https://matthewgraham.me/" target="_blank">
                    Matthew Graham
                </a>{' '}
                © {new Date().getFullYear()}
            </p>
        </>
    )
}

export default App
