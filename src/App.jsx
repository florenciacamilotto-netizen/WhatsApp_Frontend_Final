import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import './Styles/App.css'
import './Styles/Chat.css'
import './Styles/Loading.css'
import './Styles/Login.css'
import './Styles/Menu.css'
import './Styles/Profile.css'
import './Styles/Sidebar.css'

import Login from './Screens/Login/Login.jsx'
import Loading from './Screens/Loading/Loading.jsx'
import Home from './Screens/Home/Home.jsx'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen.jsx'
import { RegisterSuccess } from './Screens/RegisterSuccess/RegisterSuccess.jsx'
import { VerifySuccess } from './Screens/VerifySuccess/VerifySuccess.jsx'
import { VerifyError } from './Screens/VerifyError/VerifyError.jsx'

import { AuthContextProvider } from './context/AuthContext'
import { WorkspacesContextProvider } from './context/WorkspacesContext'
import AuthMiddleware from './middlewares/AuthMiddleware'
import AlreadyAuthMiddleware from './middlewares/AlreadyAuthMiddleware'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <AuthContextProvider>
      <div className={darkMode ? 'app dark-mode' : 'app'}>
        <Routes>

          <Route element={<AlreadyAuthMiddleware />}>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/register-success' element={<RegisterSuccess />} />
            <Route path='/verify-success' element={<VerifySuccess />} />
            <Route path='/verify-error' element={<VerifyError />} />
            <Route path='/loading' element={<Loading />} />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<AuthMiddleware />}>
            <Route element={<WorkspacesContextProvider />}>
              <Route
                path='/home'
                element={
                  <Home
                    darkMode={darkMode}
                    onToggleDarkMode={() => setDarkMode(!darkMode)}
                  />
                }
              />
            </Route>
          </Route>

          <Route path='/*' element={<Navigate to='/login' />} />

        </Routes>
      </div>
    </AuthContextProvider>
  )
}

export default App