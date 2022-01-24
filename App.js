import React from 'react'
import { AuthProvider } from './context/AuthProvider'
import Root from './Root'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import GlobalProvider from './context/GlobalProvider';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#30aeed',
    accent: '#faee38',
  },
};


export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <PaperProvider theme={theme}>
          <Root theme={theme}/>
        </PaperProvider>
      </GlobalProvider>
    </AuthProvider>
  )
}
