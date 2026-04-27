import { Link } from 'react-router-dom';

interface MovieProps {
    show: {
        _id: string;
        title: string;
        poster: string;
        year: number;
    }
}

const MovieCard = ({ show }: MovieProps) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden bg-white">
            {/* Clicking the card takes you to the detailed view page */}
            <Link to={`/show/${show._id}`}>
                <img 
                    src={show.poster} 
                    alt={show.title} 
                    className="w-full h-96 object-cover hover:opacity-80 transition-opacity" 
                />
                <div className="p-4">
                    <h3 className="text-xl font-bold truncate">{show.title}</h3>
                    <p className="text-gray-600">{show.year}</p>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;