import React from 'react'
import { GiRss as LiveIcon } from 'react-icons/gi'
import { FaRegClock as ClockIcon } from 'react-icons/fa'

const EtaDisplay = (props) => (
  <div className='eta-display'>
    {/* If the train is flagged as Due, insert "Due" instead of the difference in time. */}
    {props.due ? (
      <span className='font-weight-bold'>Due</span>
    ) : (
      <span className='font-weight-bolder'>
        {/* Difference in time in minutes. */}
        {Math.round(
          (new Date(props.eta) - new Date(props.generatedAt)) / 1000 / 60
        )}
        <span className='font-weight-normal'> min</span>
      </span>
    )}
    {props.liveData ? <LiveIcon /> : <ClockIcon />}
  </div>
)

export default EtaDisplay
