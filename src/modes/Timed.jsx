import React, { useEffect, useRef, useState } from "react"
import timedData from "../assets/english/timed.json"
import ScoreBoard from "../components/ScoreBoard"
import TextContainer from "../components/TextContainer"
import ModesButton from "../components/ModesButton"

const getRandomWords = (count = 30) => {
  const arr = timedData.word
  let words = []
  for (let i = 0; i < count; i++) {
    words.push(arr[Math.floor(Math.random() * arr.length)])
  }
  return words.join(" ")
}

const Timed = () => {

  const [target, setTarget] = useState("")
  const [input, setInput] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [fixedTimeGiven, setFixedTimeGiven] = useState(15)
  const [timeLeft, setTimeLeft] = useState(fixedTimeGiven)
  const textareaRef = useRef(null)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [restartKey, setRestartKey] = useState(0)

  const [currentInput, setCurrentInput] = useState("")
  const [completedWords, setCompletedWords] = useState([])

  useEffect(() => {
    setTimeLeft(fixedTimeGiven)
  }, [fixedTimeGiven])

  useEffect(() => {
    setTarget(getRandomWords(20))
    setTimeLeft(fixedTimeGiven)
    setShowScoreboard(false)
  }, [restartKey])

  // Start timer on first input
  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now())
  }, [input, startTime])

  // Timer countdown
  useEffect(() => {
    if (!startTime || showScoreboard) return
    if (timeLeft <= 0) {
      setShowScoreboard(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [startTime, timeLeft, showScoreboard])

  // Stats update every 500ms, stop when time is up
  useEffect(() => {
    if (!startTime || showScoreboard) return
    const interval = setInterval(() => {
      const correctChars = input
        .split("")
        .filter((ch, i) => ch === target[i]).length
      const totalErrors = input.length - correctChars
      setErrors(totalErrors)
      setAccuracy(input.length ? (correctChars / input.length) * 100 : 100)
      const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length
      const elapsed = (fixedTimeGiven - timeLeft) / 60 || 1 / 60
      setWpm(input.length ? Math.round(wordsTyped / elapsed) : 0)
    }, 500)
    return () => clearInterval(interval)
  }, [input, target, startTime, timeLeft, showScoreboard])

  // Show scoreboard when time is up
  useEffect(() => {
    if (timeLeft <= 0 && !showScoreboard) setShowScoreboard(true)
  }, [timeLeft, showScoreboard])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current && textareaRef.current.focus()
  }, [target])

  // Restart handler
  const handleRestart = () => {
    setShowScoreboard(false) // Hide scoreboard first
    setInput("")
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setRestartKey(prev => prev + 1)
    setTimeLeft(fixedTimeGiven)
  }

  return (
    <div key={restartKey} className="relative w-full max-w-7xl mx-auto mt-8">
      <div>
        <ModesButton key={"secondMode"} onClick={() => setFixedTimeGiven(15)}>15s</ModesButton>
        <ModesButton key={"secondMode"} onClick={() => setFixedTimeGiven(30)}>30s</ModesButton>
        <ModesButton key={"secondMode"} onClick={() => setFixedTimeGiven(60)}>60s</ModesButton>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Timed Mode</h2>
        <div className="text-xl font-mono">
          Time Left: <span className="font-bold">{timeLeft}s</span>
        </div>
      </div>
      <TextContainer
        textareaRef={textareaRef}
        inputState={[input, showScoreboard || timeLeft <= 0 ? () => {} : setInput]}
        showScoreboard={showScoreboard || timeLeft <= 0}
        onTextAreaClick={() => textareaRef.current && textareaRef.current.focus()}
        target={target}
        currentInputState={[currentInput, setCurrentInput]}
        completedWordsState={[completedWords, setCompletedWords]}
      />
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
      <div>
        {showScoreboard ? (
          <ScoreBoard
            wpm={wpm}
            accuracy={accuracy}
            errors={errors}
            mode="Timed"
            onRestart={handleRestart}
          />
        ) : null}
      </div>
    </div>
  )
}

export default Timed
