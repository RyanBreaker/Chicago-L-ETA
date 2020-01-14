import React from 'react';
import { Container } from 'react-bootstrap';

import './style/ctaColors.css';
import Header from './components/Header';
import StationList from './components/StationList';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Container fluid={true}>
        <Header />
        <StationList />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
