import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="main__footer">
        <nav>
            <Link to={"/"}>game-of-life|santiWeb</Link>
        </nav>
    </footer>
  )
}
