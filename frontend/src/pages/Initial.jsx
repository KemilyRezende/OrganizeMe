import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import Button from "../components/Button/Button";
import Header from "../components/Header/Header";
import Creator from "../components/Creator/Creator";
import ListComp from "../components/List/ListComp";
import styles from '../assets/styles/initial.module.css'
import '../assets/styles/global.css'
import * as jwtDecode from "jwt-decode";
import axios from "axios";

function Initial() {

    const navigate = useNavigate();

    const getTokenData = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token não encontrado.");
            return null;
        }
    
        try {
            const decoded = jwtDecode.jwtDecode(token);
            console.log("Dados do token:", decoded);
            return decoded;
        } catch (error) {
            console.error("Erro ao decodificar o token:", error.message);
            return null;
        }
    }

    const [listName, setListName] = useState("");
    const [listDescription, setListDescription] = useState("");
    const [listDeadline, setListDeadline] = useState("");

    const [lists, setLists] = useState([]);

    const createList = async() => {
        try{
            if (!listName.trim()) {
                alert("O campo nome é obrigatório!");
                return;
            }
            const res = await axios.post("http://localhost:3000/create-list", {
                name: listName,
                description: listDescription, 
                deadline: listDeadline ? new Date(listDeadline) : null,
            });
            if(res.status === 201){
                try{
                    const user = getTokenData();
                    const resp = await axios.post("http://localhost:3000/relate-user-list/", {
                        idList: res.data.list.id,
                        idUser: user.id,
                    });
                    if(resp.status === 201){
                        alert("Lista criada com sucesso!");
                        setCreatorVisible(false);
                        window.location.reload();
                    }
                }
                catch(error){
                    if (error.response?.status === 500) {
                        alert("Erro interno do servidor. Tente novamente mais tarde.");
                    } else {
                        console.error("Erro ao relacionar o usuário à lista:", error.response?.data || error.message);
                        alert("Erro ao criar lista. Verifique as informações e tente novamente.");
                    }
                }
            }
        }catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao criar lista:", error.response?.data || error.message);
                alert("Erro ao criar lista. Verifique as informações e tente novamente.");
            }
        }
    };

    const loadLists = async() => {
        try{
            const user = getTokenData();
            if(user){
                const res = await axios.get(`http://localhost:3000/user-lists/${user.id}`);
                if(res.status === 200){
                    const lists = res.data.lists;
                    return lists;
                }
                else if(res.status === 204){
                    const lists = [];
                    return lists;
                }
            }
            else{
                alert("Erro inesperado! Por favor, refaça o login.");
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro carregar listas:", error.response?.data || error.message);
                alert("Erro ao carregar listas.");
            }
        }
    };

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const loadedLists = await loadLists();
                setLists(loadedLists || []);
            } catch (error) {
                console.error("Erro ao carregar listas:", error.message);
            }
        };
    
        fetchLists();
    }, []);

    const [isCreatorVisible, setCreatorVisible] = useState(false);

    const showCreator = () => {
        console.log("Botão clicado!");
        console.log(isCreatorVisible);
        setCreatorVisible(true);
    };

    const closeCreator = () => {
        setCreatorVisible(false);
        window.location.reload();
    };


    return (
        <>
            <Header type={2} action="home"></Header>
            <div className={styles.boxPage}>
                <div className={styles.box}>
                    <div className={styles.boxTitle}>
                        <h1 className={styles.title}>Minhas Listas</h1>
                    </div>
                    <div className={styles.boxLists}>
                        {lists && lists.length > 0 ? (
                            lists.map((list) => (
                                <ListComp
                                    key={list.id}
                                    id={list.id}
                                    name={list.name}
                                    description={list.description}
                                    deadline={list.deadline}
                                    tasks={list.tasks}
                                    pendencies={list.pendencies}
                                    done={list.done}
                                />
                            ))
                        ) : (
                            <p className={styles.advice}>Você ainda não tem listas. Clique em "Criar" para adicionar uma nova.</p>
                        )}
                    </div>
                    <Button sizeClass="big" text="Criar" handleClick={showCreator} />
                </div>

                {isCreatorVisible && (
                <div className={styles.creator}>
                    <Creator 
                        text="Lista" 
                        handleClick={createList}
                        closer={closeCreator}
                        name={listName}
                        setName={setListName}
                        description={listDescription}
                        setDescription={setListDescription}
                        deadline={listDeadline}
                        setDeadline={setListDeadline} />
                </div>
            )}
            </div>
        </>
    );
  }
  
  export default Initial;
  