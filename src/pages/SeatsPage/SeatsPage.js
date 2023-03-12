import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

export default function SeatsPage({setPedido}) {
    const idSessao = useParams();
    const [filme,setFilme] = useState([]);
    const [movie, setMovie] = useState([]);
    const [day, setDay] = useState([]);
    const [seats,setSeats] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [nome, setNome] = useState([]);
    const [cpf, setCpf] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{  
        const requisicao = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao["idSessao"]}/seats`);
        requisicao.then(resposta => {
            setFilme(resposta.data);
            setMovie(resposta.data.movie);
            setDay(resposta.data.day);
            setSeats(resposta.data.seats)
        });
        requisicao.catch(erro => {
            console.log(erro)
        })
    },[idSessao])

    function selecionar(seat){
        if(seat.isAvailable === false ){
            return
        } else if (!selecionados.includes(seat)){
            setSelecionados([...selecionados, seat]);
        } else {
            setSelecionados([...selecionados.filter(elemento=>(elemento.id !== seat.id))])
        }
    }

    function reservar(event){
        event.preventDefault();
        if (selecionados.length === 0){
            alert("Selecione pelo menos 1 assento.");
            return;
        }
     
        const corpo = {ids: selecionados.map((elemento) => elemento.id), name:nome, cpf:cpf} 
        const requisicao = axios.post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many", corpo)
        requisicao.then(resposta => {
            setPedido({filme, selecionados, nome, cpf});
            navigate("/sucesso");;
		});
        requisicao.catch(erro => {
            console.log(erro)
            alert("Atualize a página e tente de novo.")
        })

        setPedido({filme, selecionados, nome, cpf});
        navigate("/sucesso");;
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map(
                    seat => (
                        <SeatItem
                        key={seat.id}
                        onClick={()=> selecionar(seat)}
                        color={selecionados.includes(seat) ? "#1AAE9E" : (seat.isAvailable ? "#C3CFD9" : "#FBE192")}
                        border={selecionados.includes(seat) ? "#0E7D71" : ((seat.isAvailable ? "#7B8B99" : "#F7C52B"))}
                        cursor={seat.isAvailable ? "pointer" : "not-allowed"}
                        >
                            {seat.name}
                        </SeatItem>
                    )
                )}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem cursor="default">
                    <CaptionCircle border="#0E7D71" color="#1AAE9E"/>
                    Selecionado
                </CaptionItem>
                <CaptionItem cursor="default">
                    <CaptionCircle border="#7B8B99" color="#C3CFD9"/>
                    Disponível
                </CaptionItem>
                <CaptionItem cursor="default">
                    <CaptionCircle border="#F7C52B" color="#FBE192"/>
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                <form onSubmit={reservar}>
                    Nome do Comprador:
                    <input
                        placeholder="Digite seu nome..."
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        required
                        />

                    CPF do Comprador:
                    <input 
                        placeholder="Digite seu CPF..."
                        type="number"
                        pettern="[0-9]{11}"
                        value={cpf}
                        onChange={(event) => setCpf(event.target.value)}
                        required
                        />
                    <button type="submit">Reservar Assento(s)</button>
                </form>
            </FormContainer>

            <FooterContainer>
                <div>
                    <img src={movie.posterURL} alt={`Poster do filme ${movie.title}`} />
                </div>
                <div>
                    <p>{movie.title}</p>
                    <p>{day.weekday} - {filme.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${(props) => props.border};
    background-color: ${(props) => props.color};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    cursor: ${props => props.cursor};
`
const SeatItem = styled.div`
    border: 1px solid ${(props) => props.border};
    background-color: ${(props) => props.color};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
    cursor: ${props => props.cursor};
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`