import { useEffect, useState } from 'react'
import { registerMicroApps, start } from 'qiankun'
import { Spin } from 'antd'

const App = () => {

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    registerMicroApps([
      {
        name: 'qiankun-test',
        entry: `${window.location.protocol}//${window.location.hostname}:5173/qiankun/?_t=${Date.now()}`,
        container: '#subApp',
        activeRule: '/qiankun-test',
        loader: (loading: boolean) => {
          setLoading(loading);
        },
      },
    ])
    start()
  }, []);

  return (
    <>
      {
        loading && (
          <div className='text-center pt-11'>
            <Spin spinning={loading} />
          </div>
        )
      }

      <div className='h-full' id='subApp' />
    </>
  )
}

export default App
