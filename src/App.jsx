import { Fragment } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Generate from "./Generate"
import Puzzle from "./Puzzle"
import Home from "./Home"
import PlayOwn from "./PlayOwn"
export default function App() {
  return (
    <Fragment>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/puzzle/own" element={<PlayOwn />} />
          <Route path="/puzzle/:level" element={<Puzzle />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </Router>
    </Fragment>
  )
}