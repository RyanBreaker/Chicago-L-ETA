import React from 'react'

const Footer = () => (
  <footer className='footer'>
    Copyright &copy; {new Date().getFullYear()}{' '}
    <a
      href={'https://github.com/RyanBreaker'}
      target='_blank'
      rel='noopener noreferrer'
    >
      Ryan Breaker
    </a>
  </footer>
)

export default Footer
