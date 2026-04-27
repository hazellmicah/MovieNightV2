import { Link } from "react-router"

const NavBar = () => {
    return (
        <>
            <div>NavBar</div>
            <Link className="mx-3 underline" to="/">Home</Link>
            <Link className="mx-3 underline" to="/show">Show All Movies</Link>
        </>
    )
}

export default NavBar