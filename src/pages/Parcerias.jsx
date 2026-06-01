import "./Parcerias.css";

import imgSewingCostume from '../assets/sewing-costume.jpeg';

const Parcerias = () => {
    return (
        <section className="container-fluid">

            <h1 className="display-6 text-center my-5">
                Apoie-Nos
            </h1>

            <div className="d-flex flex-column mb-5">
                <div className="container-lg d-flex justify-content-center">
                    <img className="partnerships-image" src={imgSewingCostume} alt="Foto de Uma Máquina de Costura" />
                </div>

                <div className="container-fluid text-section">
                    <p>
                        Nosso ateliê acredita na força da colaboração e na beleza de dar novos significados às coisas. Por isso, buscamos parcerias com brechós que compartilham da mesma visão: unir criatividade, sustentabilidade e estilo. Ao apoiar nosso ateliê, você contribui para:
                    </p>

                    <ul className="support-list">
                        <li>
                            Moda consciente: peças e materiais ganham nova vida em criações artísticas e exclusivas;
                        </li>

                        <li>
                            Valorização local: fortalecemos a rede de pequenos negócios e iniciativas independentes;
                        </li>

                        <li>
                            Impacto positivo: juntos, promovemos consumo responsável e incentivamos práticas sustentáveis.
                        </li>
                    </ul>
                </div>
            </div>

        </section>
    );
};

export default Parcerias;