import { Link } from "react-router-dom";

export default function Nav() {

  return (
    <header className='main__header'>
      <nav>
        <Link className="main__header__site" to={"/"}><h1>game-of-life|HTML-CSS-JS</h1></Link>
      </nav>
    </header>
  )
}
