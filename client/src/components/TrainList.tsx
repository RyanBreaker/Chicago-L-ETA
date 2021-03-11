import React, { useState } from 'react'
import axios from 'axios'

import { Col, ListGroup, Modal, Row, Spinner } from 'react-bootstrap'
import { FaWheelchair as AccessibleIcon } from 'react-icons/fa'
import { FiExternalLink as LinkIcon } from 'react-icons/fi'

import TrainListItem from './TrainListItem'
import { Station } from './StationList'

const traintrackerUrl =
  'https://www.transitchicago.com/traintracker/arrivaltimes/?sid='

export interface Train {
  id: string
  trainNumber: string
  destination: string
  generatedAt: string
  eta: string
  lineName: string
  due: boolean
  scheduled: boolean
  delayed: boolean
}

interface Props {
  station: Station
  show: boolean
  onHide: () => any
}

const TrainList = ({ station, show, onHide }: Props) => {
  const [loading, setLoading] = useState(true)
  const [trains, setTrains] = useState<Train[]>([])
  const doRefresh = true

  // 15 seconds for the auto-refresh;
  const refreshTime = 15
  const [refreshInterval, setRefreshInterval] = useState<number | undefined>(
    undefined
  )

  /**
   * Loads the ETA data into the state.
   */
  const getEtas = async () => {
    setLoading(true)
    const response = await axios.get('/api/stations', {
      params: { id: station.id }
    })
    setTrains(response.data[0]?.etas ?? [])
    setLoading(false)
  }

  /**
   * Sets up the auto-refresh call on the modal's onEnter and make sure to clear the interval on its onExit.
   */
  const refreshData = async () => {
    await getEtas()
    if (doRefresh) {
      setRefreshInterval(window.setInterval(getEtas, refreshTime * 1000)) // Convert from seconds
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      onEnter={refreshData}
      onExit={() => window.clearInterval(refreshInterval)}
      centered
      className='station-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title className='font-weight-bold' style={{ width: '100%' }}>
          <Row>
            <Col xs={9}>
              <a
                href={`${traintrackerUrl}${station.id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {station.name} {station.accessible && <AccessibleIcon />}{' '}
                {<LinkIcon />}
              </a>
            </Col>
            <Col
              xs={3}
              className='d-flex justify-content-center align-items-center'
            >
              {loading ? <Spinner animation='grow' role='status' /> : null}
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ListGroup variant={'flush'}>
          {/* Only show the message if content also isn't being loaded. */}
          {trains.length === 0 && !loading ? (
            <Row className='justify-content-center'>
              <Col
                className='text-center center-col'
                style={{ padding: '1rem 0' }}
              >
                <h4 className='font-weight-bold' style={{ margin: 0 }}>
                  No trains were received for this station at this time.
                </h4>
              </Col>
            </Row>
          ) : (
            trains.map((train) => (
              <TrainListItem key={train.id} train={train} />
            ))
          )}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer className='justify-content-center font-italic'>
        Content auto-refreshes every {refreshTime} seconds.
      </Modal.Footer>
    </Modal>
  )
}

export default TrainList
