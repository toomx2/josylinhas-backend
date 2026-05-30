import JoseliPicture from "../assets/joseli-picture.png";
import CostumePicture from "../assets/costume-picture-3.png";

const Sobre = () => {
    return (
        <section className="container-fluid">

            <h1 className="display-6 text-center my-5">
                Sobre Mim
            </h1>

            <div className="my-5">
                <div className="container-lg">
                    <div className="row row-cols-md-2 row-cols-sm-1 row-cols-1 mb-lg-5 mb-sm-3">
                        <div className="d-flex justify-content-center mb-3">
                            <img className="img-fluid"
                                 src={JoseliPicture}
                                 width="480"
                                 height="480"
                                 alt="Foto da Joseli" />
                        </div>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <p>
                                Tudo começou com a paixão pela costura e pelo carnaval. Ao longo dos anos, o Josylinhas se consolidou como referência em figurinos criativos e sustentáveis, atendendo um público diverso e consciente. Cada peça carrega dedicação, arte e compromisso com um futuro mais responsável.
                            </p>

                            <p>
                                Descubra peças únicas, feitas à mão com tecidos de qualidade e design exclusivo. Cada figurino é pensado para oferecer conforto, estilo e liberdade de movimento. Explore nossa coleção e encontre o figurino perfeito para sua apresentação ou festa!
                            </p>
                        </div>
                    </div>
                </div>

                <div class="row row-cols-1 mb-5">
                    <div class="d-flex flex-column gap-3 mb-4 px-4">
                        <p>
                            O Josylinhas é muito mais do que um ateliê de costura: é um espaço onde a arte, a criatividade e a responsabilidade caminham juntas. Fundado por Joseli, uma apaixonada pela moda e pelo carnaval, nosso propósito é transformar tecidos em histórias, costuras em sonhos e figurinos em experiências  beleza e inclusão. Nosso público é diverso, formado por pessoas que acreditam que vestir-se é uma forma de expressão e que a moda pode ser consciente e sustentável.
                        </p>

                        <p>
                            Aqui, cada detalhe importa: desde a escolha dos tecidos até o acabamento final, tudo é feito com carinho e respeito ao meio ambiente. Valorizamos o trabalho artesanal, apoiamos pequenos negócios e acreditamos que juntos podemos construir um futuro mais responsável para a moda. Seja para apresentações musicais, festas ou momentos especiais, nossas criações são pensadas para proporcionar liberdade de movimento, bem-estar e estilo. Aqui, você encontra muito mais do que roupas: encontra propósito, cuidado e paixão.
                        </p>
                    </div>

                    <div class="d-flex justify-content-center">
                        <img class="img-fluid" 
                             src={CostumePicture}
                             alt="Foto de um Avô com seu Neto" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sobre;