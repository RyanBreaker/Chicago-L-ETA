import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const SearchBar = props => {
  const [text, setText] = useState('');

  return (
    <Form
      inline={true}
      onSubmit={e => {
        e.preventDefault();
        props.onSubmit(text);
      }}
    >
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Station Name"
          onChange={e => {
            setText(e.target.value);
          }}
        />
      </Form.Group>
    </Form>
  );
};

const Filter = props => {
  return (
    <Row className="filter">
      {/*<Col>*/}
      {/*  <DropdownButton className="cta-dropdown" title={'Filter by Line'}>*/}
      {/*    {lines.map((line, i) => (*/}
      {/*      <Dropdown.Item key={i} className={lineToStyle(line)}>*/}
      {/*        {line}*/}
      {/*      </Dropdown.Item>*/}
      {/*    ))}*/}
      {/*  </DropdownButton>*/}
      {/*</Col>*/}
      <Col xs={12}>
        <SearchBar onSubmit={props.updateFilter} />
      </Col>
    </Row>
  );
};

export default Filter;
