import "./Blog.css";

import { useState } from 'react';
import { Link } from "react-router-dom";

import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import imgExample from "../assets/image-example.png";

import imgSustainableFashion from "../assets/sustainable-fashion.png";
import imgInclusiveFashion from "../assets/inclusive-fashion.png";
import imgCarnivalCostumes from "../assets/carnival-costumes.png";

const Blog = () => {

    const articles = [
        {
            id: 1,
            title: "Tendência Sustentável: Moda Reciclada em Alta",
            caption: "Peças feitas com tecidos reaproveitados conquistam passarelas e mostram que estilo e consciência podem andar juntos.",
            image: imgSustainableFashion,
            imgAlt: "Ilustração de Moda Sustentável",
            link: null,
        },

        {
            id: 2,
            title: null,
            caption: null,
            image: null,
            imgAlt: null,
            link: null,
        },

        {
            id: 3,
            title: null,
            caption: null,
            image: null,
            imgAlt: null,
            link: null,
        },
    ];

    const slides = [
        {
            id: 1,
            title: "Tendência Sustentável: Moda Reciclada em Alta",
            caption: "Peças feitas com tecidos reaproveitados conquistam passarelas e mostram que estilo e consciência podem andar juntos.",
            image: imgSustainableFashion,
            imgAlt: "Ilustração de Moda Sustentável",
            link: null,
        },

        {
            id: 2,
            title: "Diversidade nas Passarelas: Moda Inclusiva Ganha Espaço",
            caption: "Marcas apostam em coleções que celebram todos os corpos, reforçando a beleza da pluralidade.",
            image: imgInclusiveFashion,
            imgAlt: "Ilustração de Moda Inclusiva",
            link: null,
        },

        {
            id: 3,
            title: "Figurinos Criativos Transformam o Carnaval em Arte",
            caption: "Cores vibrantes, brilho e conforto definem as novas tendências de figurinos carnavalescos, unindo expressão cultural e liberdade de movimento.",
            image: imgCarnivalCostumes,
            imgAlt: "Ilustração de Figurinos Criativos de Carnaval",
            link: null,
        },
    ];

    if (!slides || slides.length === 0) {
        return (
            <div className="text-center p-3">
                Nenhum Slide Encontrado.
            </div>
        );
    }

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    return (
        <section className="container-fluid p-3">

            <h1 className="display-6 fw-normal text-center border-bottom py-3 my-5">
                Josylinhas Blog
            </h1>

            <section>

                <h2 className="fs-3 fw-normal my-5">
                    Destaques
                </h2>

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

                    {slides.map((slide, index) => {
                        return (
                            <Carousel.Item key={index}>
                                <div className="d-flex flex-column align-items-center">
                                    <div className="text-center">
                                        <h3 className="fs-4 fw-normal mb-2">
                                            {slide.title || "Título"}
                                        </h3>

                                        <p className="text-muted mb-3">
                                            {slide.caption || "Legenda"}
                                        </p>
                                    </div>

                                    <div className="image-section my-3">
                                        <img className="carousel-img" src={slide.image || ImageExample} alt={slide.imgAlt || "Texto Alternativo"} />
                                    </div>

                                    <div>
                                        <Link className="josylinhas-btn btn-card" to={slide.link || "#"}>
                                            Ler Mais
                                        </Link>
                                    </div>
                                </div>
                            </Carousel.Item>
                        );
                    })}

                </Carousel>
            </section>

            <section>

                <h2 className="fs-3 fw-normal my-5">
                    Mais Artigos
                </h2>

                <ul>
                    {articles.map((article, index) => (
                        <li key={index}>
                            <Card className="card-background p-3 mb-3" as={"article"}>
                                <Row className="justify-content-center align-items-center flex-grow-1 gap-3">
                                    <Col xs="auto">
                                        <Card.Img className="card-img-custom" src={article.image || imgExample} alt={article.imgAlt || "Texto Alternativo"} />
                                    </Col>

                                    <Col className="flex-grow-1 p-0" xs="auto" lg={8}>
                                        <Card.Body>

                                            <Card.Title>
                                                {article.title || "Título"}
                                            </Card.Title>

                                            <Card.Text>
                                                {article.caption || "Legenda"}
                                            </Card.Text>

                                        </Card.Body>
                                    </Col>

                                    <Col xs="auto">
                                        <Link className="josylinhas-btn btn-card" to={article.link || "#"}>
                                            Ler Mais
                                        </Link>
                                    </Col>
                                </Row>
                            </Card>
                        </li>
                    ))}
                </ul>

            </section>

        </section>
    );
};

export default Blog;