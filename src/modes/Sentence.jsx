import React, { useEffect, useRef, useState } from "react"
import sentenceData from "../assets/english/sentence.json"
import ScoreBoard from "../components/ScoreBoard"
import TextContainer from "../components/TextContainer"

const getRandomSentence = () => {
  const arr = sentenceData.sentence
  return arr[Math.floor(Math.random() * arr.length)].text
}

const Sentence = () => {
  const [target, setTarget] = useState("")
  const [input, setInput] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const textareaRef = useRef(null)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [restartKey, setRestartKey] = useState(0)

  const [currentInput, setCurrentInput] = useState("")
  const [completedWords, setCompletedWords] = useState([])

  // Track current word index for highlighting
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [currentCharIdx, setCurrentCharIdx] = useState(0)

  useEffect(() => {
    setTarget(getRandomSentence())
  }, [])

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now())
    

    // Split words to remove leading and trailing spaces, return a list of words and filter out empty strings
    const inputWords = input.trim().split(/\s+/).filter(Boolean)
    const targetWords = target.trim().split(/\s+/).filter(Boolean)

    // Stop condition
    const finished =
      (input.length > target.length) ||
      (input.trimEnd().endsWith(".") && input.trim().split(/\s+/).length >= target.trim().split(/\s+/).length) ||
      (target && completedWords.length >= targetWords.length && currentInput.length == targetWords[targetWords.length - 1].length)||
      (completedWords.length > targetWords.length);

    if (finished) {
      setShowScoreboard(true);
    }

    setCurrentWordIdx(input.split(/\s+/).length - 1)
    textareaRef.current.setSelectionRange(input.length, input.length)
    setCurrentCharIdx(input.length)
  }, [input, target, startTime])

  // Update stats every 500ms, but stop when finished
  useEffect(() => {
    if (!startTime) return;
    const finished =
      (input.length > target.length) ||
      (input.trimEnd().endsWith(".") && input.trim().split(/\s+/).length >= target.trim().split(/\s+/).length);
    if (finished) return; // Stop updating stats
    const interval = setInterval(() => {
      const correctChars = input
        .split("")
        .filter((ch, i) => ch === target[i]).length
      const totalErrors = input.length - correctChars
      setErrors(totalErrors)
      setAccuracy(input.length ? (correctChars / input.length) * 100 : 100)
      const wordsTyped = input.trim().split(/\s+/).length
      const elapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 1
      setWpm(startTime && input.length ? Math.round(wordsTyped / elapsed) : 0)
    }, 500)
    return () => clearInterval(interval)
  }, [input, target, startTime])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current && textareaRef.current.focus()
  }, [target])


  // Add a restart handler
  const handleRestart = () => {
    setInput("")
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCurrentWordIdx(0)
    setCurrentCharIdx(0)
    setCurrentInput("")
    setCompletedWords([])
    setShowScoreboard(false)
    setRestartKey(prev => prev + 1)
    setTarget(getRandomSentence())

  }


  // For debug, REMOVE IN PRODUCTION
  const inputWords = input.trim().split(/\s+/).filter(Boolean);
  const targetWords = target.trim().split(/\s+/).filter(Boolean);

  return (
    <div key={restartKey} className="relative w-full max-w-7xl mx-auto mt-8">

      {/* container for The text area */}
      <TextContainer 
        textareaRef={textareaRef}
        inputState={[input, showScoreboard ? () => {} : setInput]} // prevent input if showScoreboard
        showScoreboard={showScoreboard}
        onTextAreaClick={() => textareaRef.current && textareaRef.current.focus()}
        target={target}
        currentInputState={[currentInput, setCurrentInput]}
        completedWordsState={[completedWords, setCompletedWords]}
      />

      {/* Stats */}
      <div className="mt-6 justify-center items-center flex gap-8 text-lg">
        <div>
          WPM:{" "}
          <span className="font-bold">{wpm}</span>
        </div>
        <div>
          Accuracy:{" "}
          <span className="font-bold">{accuracy.toFixed(1)}%</span>
        </div>
        <div>
          Errors: <span className="font-bold">{errors}</span>
        </div>
      </div>


      {/* Scoreboard */}
      <div>
        {showScoreboard ? (
          <ScoreBoard
            wpm={wpm}
            accuracy={accuracy}
            errors={errors}
            mode="Sentence"
            onRestart={handleRestart}
          />
        ) : null}
      </div>

      {/* Debug Button */}
      <button className="absolute bg-blue-600 z-50" onClick={() => {
        console.log(inputWords)
        console.log(inputWords.length > targetWords.length)
        console.log(inputWords.length >= targetWords.length)
        console.log(target.length > 0)
        console.log(inputWords.length > 0)
        console.log(inputWords[inputWords.length - 1] == targetWords[targetWords.length - 1])
        console.log(inputWords[inputWords.length - 1][(inputWords[inputWords.length - 1]).length - 1])
        console.log(targetWords[targetWords.length - 1][(targetWords[targetWords.length - 1]).length - 1])
        console.log(textareaRef.current.value)
        console.log(completedWords)

        textareaRef.current && textareaRef.current.focus()

      }}>Debug</button>
    </div>
  )
}

export default Sentence
