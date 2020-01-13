import React from 'react';
import StationList from './components/StationList';
import { Container } from 'react-bootstrap';

import './style/ctaColors.css';
import Header from './components/Header';
import Filter from './components/Filter';
import Footer from './components/Footer';

const App = () => (
  <div>
    <Container fluid={true}>
      <Header />
      <Filter />
      <StationList />
    </Container>
    <Footer />
  </div>
);

export default App;
