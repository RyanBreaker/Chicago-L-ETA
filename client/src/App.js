import React from 'react';
import { Container } from 'react-bootstrap';

import './style/ctaColors.css';
import Header from './components/Header';
import StationList from './components/StationList';
import Footer from './components/Footer';
import ScrollUpButton from 'react-scroll-up-button';

function App() {
  return (
    <div>
      <Container fluid>
        <Header />
        <StationList />
      </Container>
      <Footer />
      <ScrollUpButton ToggledStyle={{ bottom: 75 }} />
    </div>
  );
}

export default App;
