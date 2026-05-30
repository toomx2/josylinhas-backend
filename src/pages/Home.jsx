import "./Home.css";

import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="josylinhas-hero">
            <div className="d-flex flex-column justify-content-center flex-wrap vh-100">

                <div className="container hero-background shadow-lg">

                    <h1 className="display-4 font-semibold text-center">
                        Boas-Vindas à Josylinhas!
                    </h1>

                    <p className="lead text-center">
                        Aqui, cada costura conta uma história e cada peça é feita com amor, criatividade e consciência
                    </p>

                    <div className="d-grid justify-content-center mt-5">
                        <Link className="josylinhas-btn btn-secondary" to="/produtos">
                            Nossos Produtos
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Home;