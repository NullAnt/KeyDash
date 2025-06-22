import React from 'react'

const ModesButton = ({ children, ...props }) => {
  return (
    <button
      className='m-4 p-2 rounded bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)]'
      {...props}
    >
      {children}
    </button>
  )
}

export default ModesButton