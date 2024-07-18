import './App.css'
import { Route, Routes } from 'react-router-dom'
import { routes } from "./router.jsx"
import { ToastProvider } from './ToastContext.jsx';


function App() {
  return (
    <>
      <ToastProvider>
        <Routes>
          {Object.keys(routes).map((route) => {
            return (
              <Route
                element={routes[route].element}
                path={routes[route].path}
              />
            );
          })}
        </Routes>
      </ToastProvider>
    </>
  )
}

export default App
