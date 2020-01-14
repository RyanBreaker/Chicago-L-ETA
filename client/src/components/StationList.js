import React from 'react';
import { Card, CardColumns, Spinner } from 'react-bootstrap';
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
    filters: { name: '', accessible: false },
    filteredStations: []
  };

  filters = { name: '', accessible: false };

  componentDidMount() {
    this.updateData();
  }

  updateData = () => {
    axios.get('/api/station/all').then(res => {
      this.setState({
        stations: res.data,
        loading: false
      });

      this.filterStations();
    });
  };

  filterStations = () => {
    const { stations, filters } = this.state;

    let filteredStations = stations;
    if (filters.name.length > 0)
      filteredStations = filteredStations.filter(sta =>
        sta.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    if (filters.accessible)
      filteredStations = filteredStations.filter(sta => sta.accessible);

    this.setState({ filteredStations: filteredStations });
  };

  setFilters = filters => {
    this.setState({ filters: filters });
    this.filterStations();
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation={'border'} role={'status'} />
        </div>
      );
    }

    return (
      <div>
        <Filter onChange={this.setFilters} />
        <CardColumns>
          {this.state.filteredStations.map(station => (
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
