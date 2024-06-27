import { format } from 'date-fns'
import { useState } from 'react'
import Level from '~/components/level/Level'
import './App.scss'
import './firebase'

function App() {
    const [targetDate] = useState(() => new Date())

    return (
        <>
            <nav className="navbar">
                <div className="title-container">
                    <a className="title" href="/">
                        cryptle
                    </a>
                    <div className="date">{format(targetDate, 'MMMM do, yyyy')}</div>
                </div>
            </nav>
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
