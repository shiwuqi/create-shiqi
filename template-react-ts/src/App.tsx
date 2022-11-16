import { Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import './App.css'

function App() {

  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: () => Promise.resolve(5)
  })

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <h2>useQuery response {data}</h2>
      <Button type='primary'>primary</Button>
    </div>
  )
}

export default App
