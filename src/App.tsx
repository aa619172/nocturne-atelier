import { useEffect } from 'react'
import { Starfield } from './components/Starfield'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Manifesto } from './components/Manifesto'
import { Arcanum } from './components/Arcanum'
import { Works } from './components/Works'
import { Services } from './components/Services'
import { Merchandise } from './components/Merchandise'
import { Listen } from './components/Listen'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { AudioPlayer } from './components/AudioPlayer'
import { AccessibilityPanel } from './components/AccessibilityPanel'
import { GateKeeperChat } from './components/GateKeeperChat'
import { ContentProtection } from './components/ContentProtection'
import { AuthModal } from './components/AuthModal'

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get('checkout')
    if (checkout === 'success' || checkout === 'cancelled') {
      const message =
        checkout === 'success'
          ? 'Your acquisition is recorded in the secure ledger. Fulfillment proceeds by candlelight.'
          : 'Checkout was abandoned at the threshold.'
      window.setTimeout(() => {
        window.alert(message)
        params.delete('checkout')
        params.delete('session_id')
        const next = `${window.location.pathname}${params.toString() ? `?${params}` : ''}#reliquary`
        window.history.replaceState({}, '', next)
      }, 400)
    }
  }, [])

  return (
    <>
      <ContentProtection />
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Starfield />
      <Header />
      <main id="main">
        <Hero />
        <Manifesto />
        <Arcanum />
        <Works />
        <Services />
        <Merchandise />
        <Listen />
        <Contact />
      </main>
      <Footer />
      <AudioPlayer />
      <GateKeeperChat />
      <AccessibilityPanel />
      <AuthModal />
    </>
  )
}

export default App
