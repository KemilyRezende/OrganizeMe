import * as jwtDecode from "jwt-decode";
import { useEffect, useState } from "react"; 
import axios from "axios";
import styles from '../Notification/notif.module.css'
import check from '../../assets/images/icons/check.svg'

function Task ({id, idList, name, description, deadline, done}){


    const formatDeadline = (deadline) => {
        console.log("Deadline recebido:", deadline);
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
    
    const finishTask = async() => {
        try{
            const action = "conclude";
            const res = await axios.put(`http://localhost:3000/conclude-task/${id}/${action}`);
            if(res.status === 200){
                alert("Tarefa concluída com sucesso");
                const u = getTokenData();
                if(users && users.length > 1){
                    for (const user of users) {
                        if (u.id !== user.id) {
                            try {
                                const respo = await axios.post("http://localhost:3000/create-notification", {
                                    type: 6,
                                    idList: idList,
                                    idSender: u.id,
                                    idRecipient: user.id,
                                    idTask: id,
                                });
                                if (respo.status === 201) {
                                    console.log("Notificação enviada para ", user.name);
                            
                                }

                            } catch (error) {
                                console.error("Erro ao criar notificação:", error.response || error.message);
                            }
                        }
                    }
                } 
                try{
                    const res3 = await axios.put(`http://localhost:3000/update-task-counter/${idList}/${action}`);
                    if(res.status === 200){
                        alert("Pendências atualizadas na lista");
                        window.location.reload();
                    }
                } catch (error){
                    if (error.response?.status === 500) {
                        alert("Erro interno do servidor. Tente novamente mais tarde.");
                    } else {
                        console.error("Erro ao atualizar pendências na lista:", error.response?.data || error.message);
                        alert("Erro ao apagar lista. Verifique as informações e tente novamente.");
                    }
                }  
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

    const deleteTask = async() => {
        try{
            const action = "delete";
            const res = await axios.delete(`http://localhost:3000/delete-task/${id}`);
            if(res.status === 200){
                alert("Tarefa apagada com sucesso");
                const u = getTokenData();
                if(users && users.length > 1){
                    for (const user of users) {
                        if (u.id !== user.id) {
                            try {
                                const respo = await axios.post("http://localhost:3000/create-notification", {
                                    type: 7,
                                    idList: idList,
                                    idSender: u.id,
                                    idRecipient: user.id,
                                    idTask: id,
                                });
                                if (respo.status === 201) {
                                    console.log("Notificação enviada para ", user.name);
                            
                                }

                            } catch (error) {
                                console.error("Erro ao criar notificação:", error.response || error.message);
                            }
                        }
                    }
                } 
                try{
                    const res3 = await axios.put(`http://localhost:3000/update-task-counter/${idList}/${action}`);
                    if(res.status === 200){
                        alert("Tarefas e pendências atualizadas na lista");
                        window.location.reload();
                    }
                } catch (error){
                    if (error.response?.status === 500) {
                        alert("Erro interno do servidor. Tente novamente mais tarde.");
                    } else {
                        console.error("Erro ao atualizar pendências na lista:", error.response?.data || error.message);
                        alert("Erro ao apagar lista. Verifique as informações e tente novamente.");
                    }
                }  
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

    const reopenTask = async() => {
        try{
            const action = "reopen";
            const res = await axios.put(`http://localhost:3000/conclude-task/${id}/${action}`);
            if(res.status === 200){
                alert("Tarefa reaberta com sucesso");
        
                try{
                    const res3 = await axios.put(`http://localhost:3000/update-task-counter/${idList}/${action}`);
                    if(res.status === 200){
                        alert("Pendências atualizadas na lista");
                        window.location.reload();
                    }
                } catch (error){
                    if (error.response?.status === 500) {
                        alert("Erro interno do servidor. Tente novamente mais tarde.");
                    } else {
                        console.error("Erro ao atualizar pendências na lista:", error.response?.data || error.message);
                        alert("Erro ao apagar lista. Verifique as informações e tente novamente.");
                    }
                }  
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

    const [users, setUsers] = useState([]);

    useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const resp = await axios.get(`http://localhost:3000/list-users/${idList}`);
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
                    <h1 className={styles.title} >{name}</h1>
                        {done && (
                            <img src={check} alt="" className={styles.check}/>
                        )}
                </div>
                <div className={styles.boxText}>
                    <p className={styles.message}><span className={styles.bold}>Descrição: </span>{description}</p>
                    <p className={styles.message}><span className={styles.bold}>Data limite: </span>{formatDeadline(deadline)}</p>
                </div>
                <div className={styles.boxButton}>
                    {done ? (
                        <a href="" onClick={(event) => { event.preventDefault(); reopenTask(); }} className={styles.link}>Reabrir</a>
                        ) : (
                        <a href="" onClick={(event) => { event.preventDefault(); finishTask(); }} className={styles.link}>Finalizar</a>
                    )}
                    <a href="" onClick={(event) => { event.preventDefault(); deleteTask(); }} className={styles.link}>Excluir</a>
                </div>
            </div>
        </>
    );
}

export default Task;