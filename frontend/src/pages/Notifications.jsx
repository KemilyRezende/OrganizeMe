import * as jwtDecode from "jwt-decode";
import { useEffect, useState } from "react"; 
import axios from "axios";
import Header from '../components/Header/Header'
import Notif from '../components/Notification/Notif';
import styles from '../assets/styles/initial.module.css'
import '../assets/styles/global.css'

function Notifications() {

    const [notifications, setNotifications] = useState([]);

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

    const loadNotifications = async() => {
        try{
            const user = getTokenData();
            if(user){
                const res = await axios.get(`http://localhost:3000/user-notifications/${user.id}`);
                if(res.status === 200){
                    const lists = res.data.notifications;
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
                const loadedNotifications = await loadNotifications();
                setNotifications(loadedNotifications || []);
            } catch (error) {
                console.error("Erro ao carregar listas:", error.message);
            }
        };
    
        fetchLists();
    }, []);

    return (
        <>
            <Header type={3} action="init"></Header>
            <div className={styles.boxPage}>
                <div className={styles.box}>
                    <div className={styles.boxTitle}>
                        <h1 className={styles.title}>Notificações</h1>
                    </div>
                    <div className={styles.boxNotification}>
                    {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <Notif
                                    key={notification.id}
                                    id={notification.id}
                                    type={notification.type}
                                    idList={notification.idList}
                                    idSender={notification.idSender}
                                    idRecipient={notification.idRecipient}
                                    idTask={notification.idTask}
                                />
                            ))
                        ) : (
                            <p className={styles.advice}>Você ainda não tem listas. Clique em "Criar" para adicionar uma nova.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
  }
  
  export default Notifications;
  