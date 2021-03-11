import React from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { IoMdAirplane as AirplaneIcon } from 'react-icons/io'

import { lineToStyle } from '../helpers'
import EtaDisplay from './EtaDisplay'
import { Train } from './TrainList'

interface Props {
  train: Train
}

// A specific item for the TrainList
const TrainListItem = ({ train }: Props) => {
  const airports = ["O'Hare", 'Midway']

  return (
    <ListGroup.Item
      className={`${lineToStyle(train.lineName)} train-list-item`}
    >
      <Row>
        <Col xs={12} sm={6} className='train-num'>
          {train.lineName} #{train.trainNumber} to
          <br />
          <span className='train-dest font-weight-bold'>
            {train.destination}
            {airports.includes(train.destination) ? <AirplaneIcon /> : null}
          </span>
        </Col>
        <Col
          sm={6}
          className='d-sm-flex align-items-sm-center justify-content-sm-end'
        >
          <EtaDisplay
            due={train.due}
            eta={train.eta}
            generatedAt={train.generatedAt}
            liveData={!train.scheduled}
          />
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

export default TrainListItem
