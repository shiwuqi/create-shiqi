import { Suspense, useEffect } from 'react';
import { Spin } from 'antd';
import { useRoutes } from 'react-router-dom';
import { goLogin, getToken } from '@/utils';
import routes from './routes';

function App() {

  const element = useRoutes(routes);

  useEffect(() => {
    const access_token = getToken();
    if (!access_token) {
      goLogin();
    }
  }, []);

  return (
    <div className='w-full h-full my-0 mx-auto text-center'>
      <Suspense fallback={(<div className="text-center pt-11"><Spin /></div>)}>
        {element}
      </Suspense>
    </div>
  )
}

export default App
