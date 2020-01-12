import React from 'react';
import StationList from './components/StationList';
import { Container } from 'react-bootstrap';

import './style/ctaColors.css';
import Header from './components/Header';

import testData from './testData';

function App() {
  return (
    <Container>
      <Header />
      <StationList stations={testData} />
    </Container>
  );
}

export default App;
