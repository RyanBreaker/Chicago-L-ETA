import React, { useEffect, useState } from 'react'
import { CardColumns, Col, Row, Spinner } from 'react-bootstrap'
import axios from 'axios'

import Filter from './Filter'
import StationListItem from './StationListItem'

export interface Station {
  id: string
  name: string
  accessible: boolean
  etas: never[]
}

const StationList = () => {
  const [loading, setLoading] = useState(false)
  const [stations, setStations] = useState<Station[]>([])
  const [filterName, setFilterName] = useState('')

  const updateFilter = (name: string) => setFilterName(name)

  useEffect(() => {
    const updateData = async () => {
      setLoading(true)

      const response = await axios.get('/api/stations', {
        params: { name: filterName }
      })
      setStations(response.data ?? [])
      setLoading(false)
    }

    updateData().then().catch(console.error)
  }, [filterName])

  if (loading) {
    return (
      <>
        <Filter onUpdateFilter={updateFilter} />
        <Row>
          <Col className='text-center'>
            <Spinner animation={'border'} role={'status'} />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Filter onUpdateFilter={updateFilter} />
      <CardColumns>
        {stations.map((station) => (
          <StationListItem key={station.id} station={station} />
        ))}
      </CardColumns>
    </>
  )
}

export default StationList
