import { Outlet } from "react-router"
import Navbar from "../components/Navbar"

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-[var(--background-color)] text-[var(--text-color)]">
          <Outlet/>
        </div>
    </div>
   
  // Assuming Outlet is imported from 'react-router-dom'
  )
}

export default MainLayout