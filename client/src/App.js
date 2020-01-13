import React from 'react';
import StationList from './components/StationList';
import { Container } from 'react-bootstrap';

import './style/ctaColors.css';
import Header from './components/Header';
import Filter from './components/Filter';

const App = () => (
  <Container fluid={true}>
    <Header />
    <Filter />
    <StationList />
  </Container>
);

export default App;
