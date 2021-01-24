import React from 'react'
import { CardColumns, Col, Row, Spinner } from 'react-bootstrap'

import axios from 'axios'
import Filter from './Filter'
import StationListItem from './StationListItem'

class StationList extends React.PureComponent {
  state = {
    loading: true,
    stations: [],
    filterName: '',
    filterAccessible: ''
  }

  updateData = () => {
    this.setState({ loading: true }, () => {
      const params = {
        name: this.state.filterName,
        accessible: this.state.filterAccessible
      }

      return axios
        .get('/api/station', { params: params })
        .then((res) => this.setState({ stations: res.data, loading: false }))
    })
  }

  updateFilter = (name) => {
    this.setState({ filterName: name }, () => this.updateData())
  }

  componentDidMount() {
    this.updateData()
  }

  render() {
    if (this.state.loading) {
      return (
        <>
          <Filter updateFilter={this.updateFilter} />
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
        <Filter updateFilter={this.updateFilter} />
        <CardColumns>
          {this.state.stations.map((station) => (
            <StationListItem key={station.id} stationData={station} />
          ))}
        </CardColumns>
      </>
    )
  }
}

export default StationList
