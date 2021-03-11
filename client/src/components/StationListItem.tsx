import React from 'react'
import { Card } from 'react-bootstrap'
import { FaWheelchair as AccessibleIcon } from 'react-icons/fa'

import TrainList from './TrainList'
import { Station } from './StationList'

interface Props {
  station: Station
}

const StationListItem = ({ station }: Props) => {
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => setShowModal(!showModal)

  return (
    <Card className='station-card'>
      <Card.Body onClick={toggleModal}>
        <Card.Title className='font-weight-bold'>
          {station.name} {station.accessible && <AccessibleIcon />}
        </Card.Title>
      </Card.Body>
      <TrainList show={showModal} onHide={toggleModal} station={station} />
    </Card>
  )
}

export default StationListItem
