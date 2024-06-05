// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDiH0AAO9-rnblkucgmp0RmVtbRjFZ5CIk',
    authDomain: 'cryptle-2beb2.firebaseapp.com',
    projectId: 'cryptle-2beb2',
    storageBucket: 'cryptle-2beb2.appspot.com',
    messagingSenderId: '325566894815',
    appId: '1:325566894815:web:49a3615aef5693f2aa4f6a',
    measurementId: 'G-6K1LJ1ZGY1',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
