import React from 'react'

const RealTimeStats = ({wpm, accuracy, errors}) => {
    return (
        <div className="mt-6 justify-center items-center flex gap-8 text-lg">
            <div>
            WPM: <span className="font-bold">{wpm}</span>
            </div>
            <div>
            Accuracy: <span className="font-bold">{accuracy.toFixed(1)}%</span>
            </div>
            <div>
            Errors: <span className="font-bold">{errors}</span>
            </div>
        </div>
    )
}

export default RealTimeStats