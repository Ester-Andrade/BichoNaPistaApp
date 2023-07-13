import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import Router from './app/routes/Routes'
import { NetworkProvider } from 'react-native-offline'
import { AuthProvider } from './app/context/Auth'
import { MonitoringProvider } from './app/context/Monitoring'

export default function App() {
  return (
    <NetworkProvider>
      <AuthProvider>
        <MonitoringProvider>
          <Router />
        </MonitoringProvider>
      </AuthProvider>
    </NetworkProvider>
  )
}
