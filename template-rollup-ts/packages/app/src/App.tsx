import { useEffect } from 'react'
import { test } from '@shiqi/sdk'
import './App.css'

function App() {

  useEffect(() => {
    test();
  }, []);

  return (
    <div className="App">
      <div>
        <h1>Vite + React</h1>
      </div>
    </div>
  )
}

export default App
