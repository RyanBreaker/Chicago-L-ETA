import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

interface Props {
  onUpdateFilter: (s: string) => void
}

const Filter = ({ onUpdateFilter }: Props) => {
  // Current value of the text input.
  const [text, setText] = useState('')
  // Timeout for auto-filtering the page on input change.
  const [timeout, setTimeout] = useState<number|undefined>(undefined)

  return (
    <Row className='filter'>
      <Col xs={12}>
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
                setTimeout(window.setTimeout(() => onUpdateFilter(text), 250))
              }}
            />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  )
}

export default Filter
