import { useEffect, useState, useRef } from 'react'

const TextContainer = ({

    textareaRef, inputState, showScoreboard, 
    onTextAreaClick,
    target,
    currentInputState, completedWordsState,
    ...props
}) => {
    // Store the current word being typed and the list of completed words
    const [currentInput, setCurrentInput] = currentInputState
    const [completedWords, setCompletedWords] = completedWordsState

    const [caretPos, setCaretPos] = useState(0)
    const lastInputRef = useRef("")

    // Update the parent input state with the joined completed words and current input
    useEffect(() => {
        inputState[1]([...completedWords, currentInput].join(" "))
    }, [completedWords, currentInput])

    const handleChange = (e) => {
        const val = e.target.value
        // If user presses space, push currentInput to completedWords and reset currentInput
        if (val.endsWith(" ")) {
            setCompletedWords(prev => [...prev, currentInput.trim()])
            setCurrentInput("")
            setCaretPos(0)
        } else {
            setCurrentInput(val)
            setCaretPos(e.target.selectionStart)
        }
        lastInputRef.current = val
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                const len = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(len, len);
            }
        });
    }

    const handleSelect = (e) => {
        setCaretPos(e.target.selectionStart)
        if (textareaRef.current) {
            const len = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(len, len);
        }
    };

    // Keep caretPos in sync with input length if input changes externally (e.g. on spacebar)
    useEffect(() => {
        if (lastInputRef.current !== currentInput) {
            setCaretPos(currentInput.length)
            lastInputRef.current = currentInput
        }
    }, [currentInput])

    // Render logic for coloring only typed chars in each word, with custom cursor
    const renderColoredText = () => {
        const targetWords = target.split(" ");
        let charIdx = 0;
        let result = [];
        let caretPlaced = false;
        for (let wIdx = 0; wIdx < targetWords.length; wIdx++) {
            const word = targetWords[wIdx];
            let inputWord = "";
            if (wIdx < completedWords.length) {
                inputWord = completedWords[wIdx] || "";
            } else if (wIdx === completedWords.length) {
                inputWord = currentInput;
            }
            let wordSpans = [];
            for (let cIdx = 0; cIdx < word.length; cIdx++) {
                // Place caret at correct char index in current word
                if (!caretPlaced && wIdx === completedWords.length && cIdx === caretPos) {
                    wordSpans.push(
                        <span
                            key={`caret-${wIdx}-${cIdx}`}
                            className="inline-block w-0.5 h-6 align-middle bg-[var(--accent-color)] animate-pulse"
                            style={{ verticalAlign: "middle" }}
                        ></span>
                    );
                    caretPlaced = true;
                }
                let color = "";
                if (inputWord.length > cIdx) {
                    color = inputWord[cIdx] === word[cIdx]
                        ? "text-green-600"
                        : "text-red-600";
                }
                wordSpans.push(
                    <span key={`${wIdx}-${cIdx}`} className={color}>
                        {word[cIdx]}
                    </span>
                );
                charIdx++;
            }
            // Caret at end of word if needed
            if (!caretPlaced && wIdx === completedWords.length && caretPos === word.length) {
                wordSpans.push(
                    <span
                        key={`caret-${wIdx}-end`}
                        className="inline-block w-0.5 h-6 align-middle bg-[var(--accent-color)] animate-pulse"
                        style={{ verticalAlign: "middle" }}
                    ></span>
                );
                caretPlaced = true;
            }
            // Parent span for the word
            result.push(
                <span
                    key={`word-${wIdx}`}
                    className="inline-block align-bottom mr-2"
                    style={{ whiteSpace: "pre" }}
                >
                    {wordSpans}
                </span>
            );
        }
        return result;
    }

    return (
        <div className="relative w-full p-4 break-words overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-0" style={{ zIndex: 2, minHeight: 80 }}>
            <textarea
                ref={textareaRef}
                value={currentInput}
                onChange={handleChange}
                onSelect={handleSelect}
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