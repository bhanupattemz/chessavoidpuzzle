import "./App.css"
import { useNavigate } from "react-router-dom"
export default function Home() {
    const navigate = useNavigate()
    return (
        <main className="home-page-main">
            <img src="/vite.svg" alt="img" />
            <div className="home-page-btns">
                <button onClick={() => navigate("/puzzle/1")}>Play Now</button>
                <button onClick={() => navigate("/generate")}>Generate Own</button>
            </div>
        </main>
    )
}