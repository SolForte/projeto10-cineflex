import styled from "styled-components"
import { Link } from "react-router-dom"

export default function SuccessPage({pedido, setPedido}) {

    function splitIntoArray(num) {
        return Array.from(String(num), Number);
    }

    let converted = undefined;

    if (pedido.cpf.length === 11){
      const transform = splitIntoArray(pedido.cpf)
      transform.splice(3,0,".");
      transform.splice(7,0,".");
      transform.splice(11,0,"-");
      converted = transform; 
    }

    function limpar(){
        setPedido([])
    }

    return (
        <PageContainer>
            <h1>Pedido feito <br /> com sucesso!</h1>

            <TextContainer data-test="movie-info">
                <strong><p>Filme e sessão</p></strong>
                <p>{pedido.filme.movie.title}</p>
                <p>{pedido.filme.day.date} - {pedido.filme.name}</p>
            </TextContainer>

            <TextContainer data-test="seats-info">
                <strong><p>Ingressos</p></strong>
                {pedido.selecionados.map(
                    (elemento)=>(
                        <p key={elemento.id}>Assento {elemento.name}</p>
                    )
                )}
            </TextContainer>
            <TextContainer data-test="client-info">
                <strong><p>Comprador</p></strong>
                <p>Nome: {pedido.nome}</p>
                <p>CPF: {converted ? converted : pedido.cpf}</p>
            </TextContainer>
            <Link data-test="go-home-btn" to="/" onClick={limpar}>
                <button>Voltar para Home</button>
            </Link>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    color: #293845;
    margin: 30px 20px;
    padding-bottom: 120px;
    padding-top: 70px;
    a {
        text-decoration: none;
    }
    button {
        margin-top: 50px;
    }
    h1 {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #247A6B;
    }
`
const TextContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
    strong {
        font-weight: bold;
        margin-bottom: 10px;
    }
`