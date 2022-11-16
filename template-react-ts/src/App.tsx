import { Suspense } from 'react'
import { Spin } from 'antd'
import { useRoutes } from 'react-router-dom'
import routes from './routes'

function App() {

  const element = useRoutes(routes)

  return (
    <div className='w-full h-full my-0 mx-auto pt-8 text-center'>
      <Suspense fallback={(<div className="text-center pt-11"><Spin /></div>)}>
        {element}
      </Suspense>
    </div>
  )
}

export default App
