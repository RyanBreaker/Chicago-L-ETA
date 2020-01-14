import React from 'react';
import { Card, CardColumns, Row, Col, Spinner } from 'react-bootstrap';
import { FaWheelchair as AccessibleIcon } from 'react-icons/fa';

import axios from 'axios';
import TrainList from './TrainList';
import Filter from './Filter';

const traintrackerUrl =
  'https://www.transitchicago.com/traintracker/arrivaltimes/?sid=';

class StationList extends React.PureComponent {
  state = {
    loading: true,
    stations: [],
    filterName: '',
    filterAccessible: ''
  };

  updateData = () => {
    this.setState({ loading: true }, () => {
      if (!this.state.filterName) {
        axios.get('/api/station/all').then(res => {
          this.setState({ stations: res.data, loading: false });
        });
        return;
      }

      const params = {
        name: this.state.filterName,
        accessible: this.state.filterAccessible
      };

      axios.get('/api/station/search', { params: params }).then(res => {
        this.setState({ stations: res.data, loading: false });
      });
    });
  };

  updateFilter = name => {
    this.setState({ filterName: name }, () => {
      this.updateData();
    });
  };

  componentDidMount() {
    this.updateData();
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Filter updateFilter={this.updateFilter} />
          <Row>
            <Col className="text-center">
              {/*<div className="d-flex justify-content-center align-items-center">*/}
              <Spinner animation={'border'} role={'status'} />
              {/*</div>*/}
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <Filter updateFilter={this.updateFilter} />
        <CardColumns>
          {this.state.stations.map(station => (
            <Card key={station.id} className="station-card">
              <Card.Body>
                <Card.Title className="font-weight-bold">
                  <a
                    href={`${traintrackerUrl}${station.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {station.name} {station.accessible && <AccessibleIcon />}
                  </a>
                </Card.Title>
                <TrainList etas={station.etas} />
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </div>
    );
  }
}

export default StationList;
