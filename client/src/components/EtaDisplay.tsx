import React from 'react'
import { GiRss as LiveIcon } from 'react-icons/gi'
import { FaRegClock as ClockIcon } from 'react-icons/fa'

interface Props {
  due: any
  eta: any
  generatedAt: any
  liveData: any
}

const EtaDisplay = ({ due, eta, generatedAt, liveData }: Props) => (
  <div className='eta-display'>
    {/* If the train is flagged as Due, insert "Due" instead of the difference in time. */}
    {due ? (
      <span className='font-weight-bold'>Due</span>
    ) : (
      <span className='font-weight-bolder'>
        {/* Difference in time in minutes. */}
        {Math.round(
          (new Date(eta).getTime() - new Date(generatedAt).getTime()) / 1000 / 60
        )}
        <span className='font-weight-normal'> min</span>
      </span>
    )}
    {liveData ? <LiveIcon /> : <ClockIcon />}
  </div>
)

export default EtaDisplay
