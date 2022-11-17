import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'
import App from './App'
import './index.css'
import 'antd/dist/antd.css'

const queryClient = new QueryClient()

let root: ReactDOM.Root | null = null

const render = (props: { container?: HTMLElement } = {}): void => {
  const { container } = props

  root = ReactDOM.createRoot(container ? container.querySelector('#container') as HTMLElement : document.querySelector('#container') as HTMLElement)

  root.render(
    <React.StrictMode>
      <Router
        basename={
          qiankunWindow.__POWERED_BY_QIANKUN__
            ? '/qiankun-test'
            : import.meta.env.BASE_URL
        }>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Router>
    </React.StrictMode>
  )
}


renderWithQiankun({
  mount(props) {
    console.log('mount props:', props)
    render(props)
  },
  bootstrap() {
    console.log('bootstrap')
  },
  update() {
    console.log('update')
  },
  unmount() {
    root && root.unmount()
  },
})

if (
  qiankunWindow.__POWERED_BY_QIANKUN__ === false ||
  qiankunWindow.__POWERED_BY_QIANKUN__ == null
) {
  render();
}
