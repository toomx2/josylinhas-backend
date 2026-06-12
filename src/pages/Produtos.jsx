import "./Produtos.css";

import { useEffect, useRef } from "react";

import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import imgCostumePicture01 from "../assets/costume-picture-1.png";
import imgCostumePicture02 from "../assets/costume-picture-2.png";
import imgCostumePicture03 from "../assets/costume-picture-4.png";
import imgCostumeBackground from "../assets/background-costume.png";

const Produtos = () => {

    const products = [
        {
            id: 1,
            title: "Estilo Único",
            subtitle: "Design",
            description: "Descubra a arte da costura em nosso ateliê, celebrando a diversidade através de looks únicos",
            image: imgCostumePicture02,
            imgAlt: "Estilo Único",
            link: null,
        },

        {
            id: 2,
            title: "Moda Inclusiva",
            subtitle: "Conceito",
            description: "Moda inclusiva é vestir diversidade com elegância no Ateliê Josylinhas, cada corpo é bem-vindo",
            image: imgCostumePicture03,
            imgAlt: "Moda Inclusiva",
            link: null,
        },
    ];

    const scrollContainerReference = useRef();
    const scrollTopicsReference = useRef([]);

    useEffect(() => {

        const scrollSection = document.querySelector(".scroll-section");
        const scrollContainer = scrollContainerReference.current;
        const scrollItem = scrollTopicsReference.current;

        const resetTopics = () => {
            scrollItem.forEach(topic => {
                if (topic) topic.classList.remove("active");
            });

            if (scrollContainer) {
                scrollContainer.className = "scroll-container";
            }
        };

        const activateTopic = (index, themeClass) => {
            if (scrollItem[index]) {
                scrollItem[index].classList.add("active");
            }

            if (scrollContainer) {
                scrollContainer.classList.add(themeClass);
            }
        };

        const getScrollProgress = () => {

            if (!scrollSection) return 0;

            const scrollY = window.scrollY;
            const sectionTop = scrollSection.offsetTop;
            const sectionHeight = scrollSection.offsetHeight;
            const windowHeight = window.innerHeight;

            return (scrollY - sectionTop) / (sectionHeight - windowHeight);

        };

        const handleScroll = () => {

            if (!scrollSection) return;

            const progress = getScrollProgress();

            resetTopics();

            if (progress < 0.33) {
                activateTopic(0, "theme-light");
            } else if (progress < 0.66) {
                activateTopic(1, "theme-purple");
            } else {
                activateTopic(2, "theme-blue");
            }

        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    });

    return (
        <div>
            <section className="container-fluid mt-5">

                <h1 className="display-6 fw-normal text-center border-bottom py-3 mb-5">
                    Nossos Produtos
                </h1>

                <div className="d-flex flex-column">
                    <h2 className="fs-5 text-center mb-3">
                        Onde a Moda Ganha Vida
                    </h2>

                    <p className="text-muted">
                        Bem-vindo ao nosso santuário de tecidos e ideias! Aqui, cada ponto conta uma história, celebrando a beleza em todas as suas formas. Criamos peças que fogem do comum, pensadas para quem valoriza a originalidade e a expressão pessoal. Venha sentir a magia da alta costura feita com paixão e um toque de rebeldia.
                    </p>
                </div>

                <div className="d-flex justify-content-center mt-5">
                    <img className="josylinhas-image shadow-lg" src={imgCostumePicture01} alt="Look Vibrante Josylinhas" />
                </div>

            </section>

            <div className="container-fluid my-5">

                <div className="container">
                    <ul>
                        <Row xs={1} sm={1} md={2}>
                            {products.map((product, index) => (
                                <li className="d-flex" key={index}>
                                    <Col className="d-flex mb-3">
                                        <Card as={"article"}>
                                            <Card.Header>
                                                <Card.Title>
                                                    {product.title}
                                                </Card.Title>

                                                <Card.Subtitle className="text-muted">
                                                    {product.subtitle}
                                                </Card.Subtitle>
                                            </Card.Header>

                                            <Card.Body className="d-flex flex-column gap-3">
                                                <Card.Img className="flex-grow-1" src={product.image} alt={product.imgAlt} />
                                                <Card.Text className="text-muted">
                                                    {product.description}
                                                </Card.Text>
                                            </Card.Body>

                                            <Card.Footer className="d-flex justify-content-center">
                                                <Card.Link className="josylinhas-btn btn-card" to={product.link}>
                                                    Ler Mais
                                                </Card.Link>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </li>
                            ))}
                        </Row>
                    </ul>
                </div>

            </div>

            <div className="scroll-section">

                <div className="scroll-container" ref={scrollContainerReference}>
                    <div className="scroll-image">
                        <img className="img-fluid shadow-lg" src={imgCostumeBackground} alt="Look Vibrante" />
                    </div>

                    <div className="scroll-topics">

                        <div className="scroll-item" ref={(el) => (scrollTopicsReference.current[0] = el)}>
                            <h2 className="fs-5 mb-3">
                                <span className="bi bi-scissors me-3"></span>
                                Manufatura
                            </h2>

                            <p>
                                Cada peça é concebida com atenção aos detalhes, resultando em vestuários que são verdadeiras obras de arte.
                            </p>
                        </div>

                        <div className="scroll-item" ref={(el) => (scrollTopicsReference.current[1] = el)}>
                            <h2 className="fs-5 mb-3">
                                <span className="bi bi-leaf me-3"></span>
                                Conforto
                            </h2>

                            <p>
                                Usamos materiais selecionados para garantir que você se sinta tão bem quanto aparenta.
                            </p>
                        </div>

                        <div className="scroll-item" ref={(el) => (scrollTopicsReference.current[2] = el)}>
                            <h2 className="fs-5 mb-3">
                                <span className="bi bi-palette me-3"></span>
                                Identidade
                            </h2>

                            <p>
                                Celebramos a individualidade, oferecendo looks que permitem que sua personalidade brilhe intensamente.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Produtos;