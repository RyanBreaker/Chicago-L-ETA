import React from 'react'
import { Container } from 'react-bootstrap'

import Header from './components/Header'
import StationList from './components/StationList'
import Footer from './components/Footer'

import './style/ctaColors.scss'

function App() {
  return (
    <div>
      <Container fluid>
        <Header />
        <StationList />
      </Container>
      <Footer />
    </div>
  )
}

export default App
