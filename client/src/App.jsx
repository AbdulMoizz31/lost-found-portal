import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import { allRoutes } from './routes/allRoutes'
import { Layout } from './components/common/layout'
import { nonAuthRoutes } from './routes/allRoutes'
import './App.css'
function App() {
  const user = 'user'

  return (
    <>
      <Routes>
        {allRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<Layout>{route.component}</Layout>}
            key={idx}
          />
        ))}
        {user?<>
        {nonAuthRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={route.component}
            key={idx}
          />
        ))}
        </>:
        <>login to the account</>}
        
      </Routes>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
