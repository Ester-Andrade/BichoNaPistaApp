import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import Router from './app/routes/Routes'
import { NetworkProvider } from 'react-native-offline'
import { AuthProvider } from './app/context/Auth'
import { MonitoringProvider } from './app/context/Monitoring'
import { RegistrationProvider } from './app/context/Registration'

export default function App() {
  return (
    <NetworkProvider>
      <AuthProvider>
        <RegistrationProvider>
          <MonitoringProvider>
            <Router />
          </MonitoringProvider>
        </RegistrationProvider>
      </AuthProvider>
    </NetworkProvider>
  )
}
