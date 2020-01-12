import React from 'react';
import { Card, CardColumns, Container, Row } from 'react-bootstrap';
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
        <Row>
          <CardColumns>
            {this.state.stations.map(station => (
              <Card key={station.id} className={'station-card'}>
                <Card.Body>
                  <Card.Title>{station.name}</Card.Title>
                  {station.wheelchair && (
                    <Card.Subtitle>
                      <FaWheelchair />
                    </Card.Subtitle>
                  )}
                  <TrainList etas={station.etas} />
                </Card.Body>
              </Card>
            ))}
          </CardColumns>
        </Row>
      </Container>
    );
  }
}

export default StationList;
