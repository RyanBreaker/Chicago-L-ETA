import React from 'react';
import { Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';

import { lines, lineToStyle } from '../helpers';

function SearchBar(props) {
  return (
    <Form
      inline={true}
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Station Name"
          onChange={e => {
            props.onChange({ name: e.target.value.trim(), accessible: false });
          }}
        />
      </Form.Group>
    </Form>
  );
}

class Filter extends React.Component {
  render() {
    return (
      <Row>
        <Col>
          <DropdownButton className="cta-dropdown" title={'Filter by Line'}>
            {lines.map((line, i) => (
              <Dropdown.Item key={i} className={lineToStyle(line)}>
                {line}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col>
          <SearchBar onChange={this.props.onChange} />
        </Col>
      </Row>
    );
  }
}

export default Filter;
