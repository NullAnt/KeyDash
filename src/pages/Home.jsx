import Navbar from "../components/Navbar"
import ModesButton from "../components/ModesButton"
import { useState } from "react"
import Timed from "../modes/Timed"
import Sentence from "../modes/Sentence"

const modes = ["Sentence", "Timed"]

const Home = () => {
  const [selectedMode, setSelectedMode] = useState("Sentence")

  let ModeComponent = null
  if (selectedMode === "Timed") ModeComponent = <Timed />
  if (selectedMode === "Sentence") ModeComponent = <Sentence />

  return (
    <>
    <section>
      
      <h1>Home Page</h1>
    </section>


    {/* Mode Selector */}
    <div className='flex flex-row'>
      <ModesButton key={Sentence} onClick={() => setSelectedMode("Sentence")}>Sentence</ModesButton>
      <ModesButton key={Timed} onClick={() => setSelectedMode("Timed")}>Timed</ModesButton>
    </div>

    {/* Load the selected mode: */}
    <div>
      {ModeComponent}
    </div>
    </>
  )
}

export default Home