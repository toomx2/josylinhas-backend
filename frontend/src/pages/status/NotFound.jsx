import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="status-section">
            <h1 className="status-code">
                404
            </h1>

            <p className="status-text">
                Página Não Encontrada.
            </p>

            <Link className="josylinhas-btn btn-secondary px-5 py-2 mt-5" to="/">
                Home
            </Link>
        </div>
    );
};

export default NotFound;