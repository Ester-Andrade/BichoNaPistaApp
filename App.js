import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import Router from './app/routes/Routes'
import { NetworkProvider } from 'react-native-offline'
import { AuthProvider } from './app/context/Auth'

export default function App() {
  useEffect(() => {
    console.log('Abriu o app')
  }, [])

  return (
    <NetworkProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NetworkProvider>
  )
}
