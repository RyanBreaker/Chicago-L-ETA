import React from 'react';
import { Col, Jumbotron, Row } from 'react-bootstrap';
import { ReactComponent as TrainIcon } from '../assets/trainicon.svg';

const Header = () => (
  <Jumbotron className="cta-header">
    <Row className="justify-content-between">
      <Col xs={12} sm={9} className="text-center text-sm-left">
        <h1 className="font-weight-bold">"L"oop</h1>
        <h2 className="font-italic">Chicago Train ETAs</h2>
      </Col>
      <Col xs={12} sm={3} className="text-center text-sm-right">
        <TrainIcon />
      </Col>
    </Row>
  </Jumbotron>
);

export default Header;
