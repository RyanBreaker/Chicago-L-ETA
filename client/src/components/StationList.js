import React from 'react';
import { Card, CardColumns, Spinner } from 'react-bootstrap';
import { FaWheelchair } from 'react-icons/fa';

import TrainList from './TrainList';
import axios from 'axios';

const traintrackerUrl =
  'https://www.transitchicago.com/traintracker/arrivaltimes/?sid=';

class StationList extends React.Component {
  state = { loading: true, stations: [] };

  updateData() {
    axios
      .get('/api/station/all')
      .then(res => {
        this.setState({ stations: res.data });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    this.updateData();
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation={'border'} role={'status'} />
        </div>
      );
    }

    return (
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
                  {station.name} {station.wheelchair && <FaWheelchair />}
                </a>
              </Card.Title>
              <TrainList etas={station.etas} />
            </Card.Body>
          </Card>
        ))}
      </CardColumns>
    );
  }
}

export default StationList;
