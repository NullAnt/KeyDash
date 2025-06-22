import React from 'react'

const ScoreBoard = ({ wpm, accuracy, errors, mode, onRestart, ...props }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 w-screen h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Score Board</h2>
        <div className="mb-2">WPM: <span className="font-bold">{wpm}</span></div>
        <div className="mb-2">Accuracy: <span className="font-bold">{accuracy?.toFixed(1)}%</span></div>
        <div className="mb-4">Errors: <span className="font-bold">{errors}</span></div>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onRestart}
        >
          Restart {mode}
        </button>
      </div>
    </div>
  )
}

export default ScoreBoard