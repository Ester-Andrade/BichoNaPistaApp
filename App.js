import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import Router from './app/routes/Routes'
import { NetworkProvider } from 'react-native-offline'
import { AuthProvider } from './app/context/Auth'
import { MonitoringProvider } from './app/context/Monitoring'
import { RegistrationProvider } from './app/context/Registration'

export default function App() {
  return (
    <NetworkProvider>
      <StatusBar style="auto" />
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
