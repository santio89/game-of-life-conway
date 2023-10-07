import { Link } from "react-router-dom";

export default function Nav() {

  return (
    <header className='mainHeader'>
      <nav>
        <Link className="mainHeader__site" to={"/"}><h1>Game of Life | Cellular Automaton</h1></Link>
      </nav>
    </header>
  )
}
