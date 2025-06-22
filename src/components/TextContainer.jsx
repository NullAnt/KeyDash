import React, { useState } from 'react'

const TextContainer = ({

    textareaRef, inputState, showScoreboard, 
    onTextAreaClick,
    target,
    ...props
}) => {
    const [input, setInput] = inputState
    const [caretPos, setCaretPos] = useState(0)

    const handleChange = (e) => {
        setInput(e.target.value)

        // Lock caret position
        setCaretPos(e.target.selectionStart)
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                const len = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(len, len);
            }
        });
    }

    const handleSelect = (e) => {
        // Prevent caret position from changing when selecting text
        setCaretPos(e.target.selectionStart)
        if (textareaRef.current) {
            const len = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(len, len);
        }
    };

    // Render logic for coloring only typed chars in each word, with custom cursor
    const renderColoredText = () => {
        const chars = target.split("");
        const inputChars = input.split("");
        let result = [];
        for (let i = 0; i <= chars.length; i++) {
            if (i === caretPos) {
                result.push(
                    <span
                        key="caret"
                        className="inline-block w-0.5 h-6 align-middle bg-[var(--accent-color)] animate-pulse"
                        style={{ verticalAlign: "middle" }}
                    ></span>
                );
            }
            if (i < chars.length) {
                let color = "";
                if (inputChars[i]) {
                    color = inputChars[i] === chars[i] ?
                        "text-green-600" : // Color for correct chars
                        (chars[i] === " " ?
                            "text-red-600 rounded bg-red-200/20": // Color for incorrect chars instead of space
                            "text-red-600"); // Color for incorrect chars
                }
                result.push(
                    <span key={i} className={color}>
                        {chars[i]}
                    </span>
                );
            }
        }
        return result;
    }
    


    return (
        <div className="relative w-full p-4 break-words overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-0" style={{ zIndex: 2, minHeight: 80 }}>
            <textarea
                ref={textareaRef}
                value={input}
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