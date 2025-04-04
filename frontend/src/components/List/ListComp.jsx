import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import * as jwtDecode from "jwt-decode";
import styles from '../Notification/notif.module.css'
import check from '../../assets/images/icons/check.svg'
import axios from "axios";

function ListComp ({id, name, description, deadline, tasks, pendencies, done}){

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const formatDeadline = (deadline) => {
        if (!deadline) return "";
        const date = new Date(deadline);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

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
    };
    
    const acessList = () => {
        navigate(`/list/${id}/${name}`);
    };

    const finishList = async() => {
        console.log(id);
        try{
            const action = "conclude";
            const res = await axios.put(`http://localhost:3000/conclude-list/${id}/${action}`);
            if(res.status === 200){
                alert("Lista concluída com sucesso");
                const u = getTokenData();
                if(users && users.length > 1){
                    for (const user of users) {
                        if (u.id !== user.id) {
                            try {
                                const respo = await axios.post("http://localhost:3000/create-notification", {
                                    type: 4,
                                    idList: id,
                                    idSender: u.id,
                                    idRecipient: user.id,
                                    idTask: null,
                                });
                                if (respo.status === 201) {
                                    console.log("Notificação enviada para ", user.name);
                                    window.location.reload();
                                }
                            } catch (error) {
                                console.error("Erro ao criar notificação:", error.response || error.message);
                            }
                        }
                    }
                }   
            } 
            else{
                window.location.reload();
            }
        } catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao recuperar finalizar lista:", error.response || error.message);
                alert("Erro ao finalizar lista. Verifique as informações e tente novamente.");
            }
        }
    };

    const deleteList = async() => {
        try{

            const user = getTokenData();
            const res1 = await axios.delete(`http://localhost:3000/delete-relation/${id}/${user.id}`);
            if(res1.status === 200){
                try{
                    const res = await axios.delete(`http://localhost:3000/delete-list/${id}`);
                    if(res.status === 400){
                        alert("Ainda há usuários associados a essa lista, seu vínculo a ela foi apagado com sucesso.");
                        window.location.reload();
                    }
                    if(res.status === 200){
                        alert("Lista apagada com sucesso!");
                        window.location.reload();
                    }
                }catch(error){
                    if (error.response?.status === 500) {
                        alert("Erro interno do servidor. Tente novamente mais tarde.");
                    } else {
                        console.error("Erro ao apagar lista:", error.response?.data || error.message);
                        alert("Erro ao apagar lista. Verifique as informações e tente novamente.");
                    }
                }
            }

        } catch(error){

        }
    };

    const reopenList = async() => {
        try{
            const action = "reopen";
            const res = await axios.put(`http://localhost:3000/conclude-list/${id}/${action}`);
            if(res.status === 200){
                alert("Lista reaberta com sucesso");
                window.location.reload();
            }
        }catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao recuperar finalizar lista:", error.response?.data || error.message);
                alert("Erro ao finalizar lista. Verifique as informações e tente novamente.");
            }
        }
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resp = await axios.get(`http://localhost:3000/list-users/${id}`);
                if (resp.status === 200) {
                    setUsers(resp.data.users || []);
                }
            } catch (error) {
                console.error("Erro ao recuperar participantes da lista:", error.message);
            }
        };
        fetchUsers();
    }, [id]);

    return (
    <>
        <div className={styles.box}>
            <div className={styles.boxTop}>
                <h1 className={styles.titleInterative} onClick={acessList}>{name}</h1>
                {done && (
                    <img src={check} alt="" className={styles.check}/>
                )}
            </div>
            <div className={styles.boxText}>
                <p className={styles.message}><span className={styles.bold}>Descrição: </span>{description}</p>
                <p className={styles.message}><span className={styles.bold}>Atividades: </span>{tasks}</p>
                <p className={styles.message}><span className={styles.bold}>Pendências: </span>{pendencies}</p>
                <p className={styles.message}><span className={styles.bold}>Participantes: </span>
                    {users.length > 0 ? users.map((user) => user.name).join(", ") : ""} 
                </p>
                <p className={styles.message}><span className={styles.bold}>Data limite: </span>{formatDeadline(deadline)}</p>
            </div>
            <div className={styles.boxButton}>
                {done ? (
                    <a href="" onClick={(event) => { event.preventDefault(); reopenList(); }} className={styles.link}>Reabrir</a>
                ) : (
                    <a href="" onClick={(event) => { event.preventDefault(); finishList(); }} className={styles.link}>Finalizar</a>
                )}
                <a href="" onClick={(event) => { event.preventDefault(); deleteList(); }} className={styles.link}>Excluir</a>
            </div>
        </div>
    </>
    );
}

export default ListComp;