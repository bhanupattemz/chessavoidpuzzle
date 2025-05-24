import { Fragment } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Puzzle from "./Puzzle"
export default function App() {
  return (
    <Fragment>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/puzzle/:level" element={<Puzzle />} />
        </Routes>
      </Router>
    </Fragment>
  )
}