import React from 'react'

const TextContainer = ({

    textareaRef, input, handleInput, showScoreboard, 
    onTextAreaClick,
    target,
    ...props
}) => {


    // Render logic for coloring only typed chars in each word
    const renderColoredText = () => {
        const targetWords = target.split(" ")
        const inputWords = input.split(" ")

        return targetWords.map((word, wIdx) => {
            const inputWord = inputWords[wIdx] || ""
            return (
                <span
                key={wIdx}
                className="mr-2 inline-block align-bottom"
                style={{ whiteSpace: "pre" }} // Prevent word break
                >
                {word.split("").map((char, cIdx) => {
                    if (inputWord.length > cIdx) {
                    return (
                        <span
                        key={cIdx}
                        className={
                            inputWord[cIdx] === char
                            ? "text-green-600"
                            : "text-red-600"
                        }
                        >
                        {char}
                        </span>
                    )
                    } else {
                    return (
                        <span key={cIdx} className="">
                        {char}
                        </span>
                    )
                    }
                })}
                </span>
            )
        })
    }
    


    return (
        <div className="relative w-full p-4 break-words overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-0" style={{ zIndex: 2, minHeight: 80 }}>
            <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                className="w-full h-full resize-none pointer-events-auto"
                style={{ minHeight: 80 }}
                spellCheck={false}
                autoFocus
                disabled={showScoreboard}
            />
            </div>
            <div
            className="text-lg font-mono select-none"
            style={{ position: "relative", zIndex: 1, minHeight: 80, wordBreak: "normal", overflowWrap: "normal" }}
            onClick={onTextAreaClick}
            >
            {renderColoredText()}
            </div>
        </div>
    )
}

export default TextContainer