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

  // Track current word index for highlighting
  const [currentWordIdx, setCurrentWordIdx] = useState(0)

  useEffect(() => {
    setTarget(getRandomSentence())
  }, [])

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now())
    

    // Split words to remove leading and trailing spaces, return a list of words and filter out empty strings
    const inputWords = input.trim().split(/\s+/).filter(Boolean)
    const targetWords = target.trim().split(/\s+/).filter(Boolean)


    
    // If input has more words than target, or if input matches target and ends with a period, display scoreboard
    // Completed the text:
    if (
      (inputWords.length > targetWords.length) ||
      (inputWords.length >= targetWords.length &&
      target.length > 0 &&
      inputWords.length > 0 &&
      inputWords[inputWords.length - 1][(inputWords[inputWords.length - 1]).length - 1] == targetWords[targetWords.length - 1][(targetWords[targetWords.length - 1]).length - 1] //Check if the last character of the last word matches
    ))
    {
      setShowScoreboard(true);

    }


    // Calculate stats
    const correctChars = input
      .split("")
      .filter((ch, i) => ch === target[i]).length
    const totalErrors = input.length - correctChars
    setErrors(totalErrors)
    setAccuracy(input.length ? (correctChars / input.length) * 100 : 100)
    const wordsTyped = input.trim().split(/\s+/).length
    const elapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 1
    setWpm(startTime && input.length ? Math.round(wordsTyped / elapsed) : 0)

    // Update current word index
    setCurrentWordIdx(input.split(/\s+/).length - 1)

  }, [input, target, startTime, navigate])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current && textareaRef.current.focus()
  }, [target])

  const handleInput = (e) => {
    // Move to next word on spacebar (allow input to continue)
    setInput(e.target.value)
  }

  // Add a restart handler
  const handleRestart = () => {
    setInput("")
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCurrentWordIdx(0)
    setShowScoreboard(false)
    setRestartKey(prev => prev + 1)
    setTarget(getRandomSentence())

  }


  // For debug, REMOVE IN PRODUCTION
  const inputWords = input.trim().split(/\s+/).filter(Boolean);
  const targetWords = target.trim().split(/\s+/).filter(Boolean);

  return (
    <div key={restartKey} className="relative w-full max-w-5xl mx-auto mt-8">

      {/* container for The text area */}
      <TextContainer 
        textareaRef={textareaRef} input={input} handleInput={handleInput} showScoreboard={showScoreboard} // for textarea tag
        onTextAreaClick={() => textareaRef.current && textareaRef.current.focus()} // for textarea click 
        target={target}  // for renderColoredText()
      />

      {/* Stats */}
      <div className="mt-6 flex gap-8 text-lg">
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
      <button className="bg-blue-600 z-50" onClick={() => {
        console.log(inputWords)
        console.log(inputWords.length > targetWords.length)
        console.log(inputWords.length >= targetWords.length)
        console.log(target.length > 0)
        console.log(inputWords.length > 0)
        console.log(inputWords[inputWords.length - 1] == targetWords[targetWords.length - 1])
        console.log(inputWords[inputWords.length - 1][(inputWords[inputWords.length - 1]).length - 1])
        console.log(targetWords[targetWords.length - 1][(targetWords[targetWords.length - 1]).length - 1])
        console.log(textareaRef.current.value)
      }}>Debug</button>
    </div>
  )
}

export default Sentence
