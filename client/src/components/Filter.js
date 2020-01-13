import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import { lines, lineToStyle } from '../helpers';

class Filter extends React.Component {
  render() {
    return (
      <DropdownButton className="cta-dropdown" title={'Filter by Line'}>
        {lines.map((line, i) => (
          <Dropdown.Item key={i} className={lineToStyle(line)}>
            {line}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }
}

export default Filter;
