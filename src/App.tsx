import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AppShell } from './components/layout/AppShell'
import Overview from './pages/Overview'
import Incidents from './pages/Incidents'
import Settings from './pages/Settings'

function App() {
  const basename = import.meta.env.PROD ? '/withskill' : ''

  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <SettingsProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppShell>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
