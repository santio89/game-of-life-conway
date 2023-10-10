import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className='notFound'>
            <div className="notFound__inner">
                <h1>404-NOT-FOUND</h1>
                <p>The route you're trying to access doesn't exist or isn't available right now.</p>
                <Link className="" to={"/"}>
                    <span>game-of-life</span>
                </Link>
            </div>
        </div>
    )
}
