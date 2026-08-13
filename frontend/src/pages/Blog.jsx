import "./Blog.css";

import api from "../services/api";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import imgExample from "../assets/image-example.png";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

const Blog = () => {

    const [articles, setArticles] = useState([]);
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    async function loadArticles() {
        try {

            const res = await api.get("/artigos");

            const data = res.data.articles || [];

            const shuffledArticles = shuffleArray(data);
            const featured = shuffledArticles.slice(0, 3);

            const remainingArticles = data.filter(
                (article) =>
                    !featured.some(
                        (featuredArticle) =>
                            featuredArticle.id === article.id
                    )
            );

            setFeaturedArticles(featured);
            setArticles(remainingArticles);

        } catch (error) {
            console.error("Erro ao carregar artigos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadArticles();
    }, []);

    function handleSelect(selectedIndex) {
        setActiveIndex(selectedIndex);
    }

    function getThumbnailUrl(thumbnail) {
        if (!thumbnail) {
            return imgExample;
        }
        return `${backendUrl}/uploads/articles/thumbnails/${thumbnail}`;
    }

    return (
        <section className="container-fluid p-3">

            <h1 className="display-6 fw-normal text-center border-bottom py-3 my-5">
                Josylinhas Blog
            </h1>

            <section>

                <h2 className="fs-3 fw-normal my-5">
                    Destaques
                </h2>

                {
                    loading ? (
                        <p className="text-center p-3">
                            Carregando Destaques...
                        </p>
                    ) : featuredArticles.length > 0 ? (
                        <Carousel activeIndex={activeIndex}
                                  onSelect={handleSelect}
                                  prevIcon={
                                    <span className="bi bi-chevron-left carousel-arrow" aria-hidden="true" />
                                  }
                                  prevLabel="Anterior"
                                  nextIcon={
                                    <span className="bi bi-chevron-right carousel-arrow" aria-hidden="true" />
                                  }
                                  nextLabel="Próximo"
                                  indicators={false}
                                  interval={null}>
                            {featuredArticles.map((article) => {
                                return (
                                    <Carousel.Item key={article.id}>
                                        <div className="d-flex flex-column flex-grow-1 align-items-center">
                                            <div className="text-center">
                                                <h3 className="fs-3 fw-normal mb-2">
                                                    {article.title || "Título"}
                                                </h3>

                                                <p className="text-muted mb-3">
                                                    {article.resume || "Legenda"}
                                                </p>
                                            </div>

                                            <div className="image-section my-3">
                                                <img className="carousel-img shadow" src={getThumbnailUrl(article.thumbnail)} alt={`Imagem do artigo ${article.title}`} />
                                            </div>

                                            <div>
                                                <Link className="josylinhas-btn btn-card" to="#">
                                                    Ler Mais
                                                </Link>
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel>
                    ) : (
                        <p className="text-center text-muted py-4">
                            Nenhum artigo publicado em destaque no momento.
                        </p>
                    )
                }
            </section>

            <section>

                <h2 className="fs-3 fw-normal my-5">
                    Mais Artigos
                </h2>

                <ul>
                    {
                        loading ? (
                            <p className="text-center py-4">
                                Carregando Artigos...
                            </p>
                        ) : articles.length > 0 ? (
                            <ul className="list-unstyled">
                                {articles.map((article) => (
                                    <li key={article.id}>
                                        <Card className="card-background p-3 mb-3" as={"article"}>
                                            <Row className="justify-content-center align-items-center flex-grow-1 gap-3">
                                                <Col xs="auto">
                                                    <Card.Img className="card-img-custom"
                                                              src={getThumbnailUrl(article.thumbnail)}
                                                              alt={`Imagem do artigo ${article.title}`} />
                                                </Col>

                                                <Col className="flex-grow-1 p-0" xs="auto" lg={8}>
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {article.title}
                                                        </Card.Title>

                                                        <Card.Text>
                                                            {article.resume}
                                                        </Card.Text>

                                                    </Card.Body>
                                                </Col>

                                                <Col xs="auto">
                                                    <Link className="josylinhas-btn btn-card" to="#">
                                                        Ler Mais
                                                    </Link>
                                                </Col>
                                            </Row>

                                            <Row>
                                                {
                                                    article.author && 
                                                    <Card.Text className="d-flex justify-content-center justify-content-md-end gap-1 text-muted small pt-3">
                                                        Por<strong>{article.author}</strong>
                                                    </Card.Text>
                                                }
                                            </Row>
                                        </Card>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <p className="alert alert-secondary text-center text-muted py-4">
                                Nenhum artigo publicado no momento.
                            </p>
                        )
                    }
                </ul>

            </section>

        </section>
    );
};

export default Blog;