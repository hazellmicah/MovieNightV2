import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav className="p-4 bg-slate-800 text-white">
            <Link className="mx-3 hover:underline" to="/">Home</Link>
            <Link className="mx-3 hover:underline" to="/favorites">Faves</Link>
        </nav>
    )
}

export default NavBar