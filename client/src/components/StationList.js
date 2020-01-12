import React from 'react';
import { Card, CardColumns, Container } from 'react-bootstrap';
import { FaWheelchair } from 'react-icons/fa';

import TrainList from './TrainList';

class StationList extends React.Component {
  state = { stations: [] };

  componentDidMount() {
    this.setState({ stations: this.props.stations });
  }

  render() {
    return (
      <Container>
        <CardColumns>
          {this.state.stations.map(station => (
            <Card key={station.id} className="station-card">
              <Card.Body>
                <Card.Title
                  className="font-weight-bold"
                  style={{ fontSize: '1.875rem' }}
                >
                  <a
                    href={`https://www.transitchicago.com/traintracker/arrivaltimes/?sid=${station.id}`}
                  >
                    {station.name} {station.wheelchair && <FaWheelchair />}
                  </a>
                </Card.Title>
                <TrainList etas={station.etas} />
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </Container>
    );
  }
}

export default StationList;
