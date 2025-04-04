import axios from "axios";
import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode";
import styles from './notif.module.css'

function Notif({id, type, idList, idSender, idRecipient, idTask}) {

    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [taskName, setTaskName] = useState("");
    const [listName, setListName] = useState("");


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

    const acceptInvite = async() => {
        try{
            const user = getTokenData();
            const resp = await axios.post("http://localhost:3000/relate-user-list/", {
                idList: idList,
                idUser: user.id,
            });
            if(resp.status === 201){
                alert("Convite aceito com sucesso!");
                goToListPage();
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
    };

    const deleteNotification = async() => {
        try{
            const res = await axios.delete(`http://localhost:3000/delete-notification/${id}`);
            if(res.status === 200){
                alert("Notificação apagada com sucesso!");
            }
        } catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao apagar notificação:", error.response?.data || error.message);
                alert("Erro ao apagar notificação. Verifique as informações e tente novamente.");
            }
        }

    };

    const goToListPage = () =>{
        navigate(`/list/${idList}/${listName}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            let nameUser = "";
            let nameList = "";
            let nameTask = "";
    
            if (idSender) {
                const res = await axios.get(`http://localhost:3000/get-user-by-id/${idSender}`);
                if (res.status === 200) nameUser = res.data.user.name;
            }
    
            if (idList) {
                const res = await axios.get(`http://localhost:3000/get-list-by-id/${idList}`);
                if (res.status === 200) nameList = res.data.list.name;
            }
    
            if (idTask) {
                const res = await axios.get(`http://localhost:3000/get-task-by-id/${idTask}`);
                if (res.status === 200) nameTask = res.data.task.name;
            }
    
            setUserName(nameUser);
            setListName(nameList);
            setTaskName(nameTask);
    
            console.log(nameUser, nameList, nameTask);
            console.log(type);
        };
    
        fetchData();
    }, [idSender, idTask, idList]);
    

    return (
        <>
            <div className={styles.box}>
            {type === 1 && (
                <>
                    <h1 className={styles.title}>Nova lista</h1>
                    <p className={styles.message}>O usuário <span className={styles.bold}>{userName}</span> quer sua ajuda na lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); acceptInvite(); }}>Confirmar</a>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )} 
            {type === 2 && (
                <>
                    <h1 className={styles.title}>Novo usuário</h1>
                    <p className={styles.message}>O usuário <span className={styles.bold}>{userName}</span> se juntou a lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); goToListPage(); }}>Ver lista</a>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )}
            {type === 3 && (
                <>
                    <h1 className={styles.title}>Remoção</h1>
                    <p className={styles.message}>Você foi removido da lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )} 
            {type === 4 && (
                <>
                    <h1 className={styles.title}>Lista concluída</h1>
                    <p className={styles.message}>O usuário <span className={styles.bold}>{userName}</span> concluiu a lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); goToListPage(); }}>Ver lista</a>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )}
            {type === 5 && (
                <>
                    <h1 className={styles.title}>Nova tarefa</h1>
                    <p className={styles.message}>O usuário <span className={styles.bold}>{userName}</span> adicionou a tarefa <span className={styles.bold}>{taskName}</span> na lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); goToListPage(); }}>Ver lista</a>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )}
            {type === 6 && (
                <>
                    <h1 className={styles.title}>Tarefa concluída</h1>
                    <p className={styles.message}>O usuário <span className={styles.bold}>{userName}</span> concluiu a tarefa <span className={styles.bold}>{taskName}</span> da lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); goToListPage(); }}>Ver lista</a>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )}
            {type === 7 && (
                <>
                    <h1 className={styles.title}>Tarefa removida</h1>
                    <p className={styles.message}>O usuário <span className={styles.bold}>{userName}</span> removeu uma tarefa da lista <span className={styles.bold}>{listName}</span>.</p>
                    <div className={styles.boxButton}>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); goToListPage(); }}>Ver lista</a>
                        <a href="" className={styles.link} onClick={(event) => { event.preventDefault(); deleteNotification(); }}>Excluir</a>
                    </div>
                </>
            )}
            </div>
        </>
    );
  }
  
  export default Notif;
  