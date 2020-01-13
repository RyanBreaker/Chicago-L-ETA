import React from 'react';
import { Card, CardColumns } from 'react-bootstrap';
import { FaWheelchair } from 'react-icons/fa';

import TrainList from './TrainList';

const traintrackerUrl =
  'https://www.transitchicago.com/traintracker/arrivaltimes/?sid=';

class StationList extends React.Component {
  state = { stations: [] };

  componentDidMount() {
    this.setState({ stations: this.props.stations });
  }

  render() {
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
