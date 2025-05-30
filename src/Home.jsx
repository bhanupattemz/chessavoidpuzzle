import "./App.css"
import { useNavigate } from "react-router-dom"
export default function Home() {
    const navigate = useNavigate()
    const level = localStorage.getItem("level")
    return (
        <main className="home-page-main">
            <img src="/chess.png" alt="img" />
            <div className="home-page-btns">
                <button onClick={() => navigate(`/puzzle/${level ? level : 1}`)}>Play Now</button>
                <button onClick={() => navigate("/generate")}>Generate Own</button>
            </div>
        </main>
    )
}