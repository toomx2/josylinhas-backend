import "./ErrorBoundary.css";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

const ErrorBoundary = () => {

    const error = useRouteError();

    if (isRouteErrorResponse(error)) {

        return (
            <div className="status-section">
                <h1 className="status-code">
                    { error.status }
                </h1>

                <p className="status-text">
                    { error.statusText || "Ocorreu um Erro" }
                </p>

                <Link className="josylinhas-btn btn-secondary px-5 py-2 mt-5" to={"/"}>
                    Home
                </Link>
            </div>
        );

    }

    return (
        <div className="status-section">
            <h1 className="status-title">
                Ops!
            </h1>

            <p className="status-text mt-2">
                Ocorreu um Erro
            </p>

            <p className="status-message my-5">
                { error instanceof Error ? error.message : "Erro Desconhecido." }
            </p>

            <Link className="float-end josylinhas-btn btn-secondary px-5 py-2" to={"/"}>
                Home
            </Link>
        </div>
    );

};

export default ErrorBoundary;