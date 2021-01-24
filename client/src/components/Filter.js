import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

const SearchBar = (props) => {
  // Current value of the text input.
  const [text, setText] = useState('')
  // Timeout for auto-filtering the page on input change.
  const [timeout, setTimeout] = useState(null)

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group>
        <Form.Control
          autoFocus
          type='text'
          className='form-control-lg'
          placeholder='Station Name'
          onChange={(e) => setText(e.target.value)}
          onKeyUp={() => {
            window.clearTimeout(timeout)
            setTimeout(window.setTimeout(() => props.onChange(text), 250))
          }}
        />
      </Form.Group>
    </Form>
  )
}

const Filter = (props) => {
  return (
    <Row className='filter'>
      <Col xs={12}>
        <SearchBar onChange={props.updateFilter} />
      </Col>
    </Row>
  )
}

export default Filter
