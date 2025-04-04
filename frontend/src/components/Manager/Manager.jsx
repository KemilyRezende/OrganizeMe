import { useNavigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode";
import { useEffect, useState } from "react"; 
import axios from "axios";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from '../Creator/creator.module.css'

function Manager({id, closeManager}) {

    const navigate = useNavigate();

    const [usersToAdd, setusersToAdd] = useState("");
    const [userToRemove, setUserToRemove] = useState("");


    const addUser = async() =>{
        if (!usersToAdd.trim()) {
            return;
        }
        const splitUsers = usersToAdd.split(";");
        const user = getTokenData();
        for (const email of splitUsers)  {
            try{
                const res = await axios.get(`http://localhost:3000/get-user-by-email/${email}`);
                if(res.status === 200){
                    try {
                        const respo = await axios.post("http://localhost:3000/create-notification", {
                            type: 1,
                            idList: id,
                            idSender: user.id,
                            idRecipient: res.data.user.id,
                            idTask: null,
                        });
                        if (respo.status === 201) {
                            console.log("Notificação enviada para ", user.name);
                            alert("Um usuário foi convidado com sucesso!");
                        }

                    } catch (error) {
                        console.error("Erro ao criar notificação:", error.response || error.message);
                        alert("Erro ao criar convite! Verifique as informações e tente novamente");
                    }
                }
            }
            catch (error){
                if (error.response?.status === 500) {
                    alert("Erro interno do servidor. Tente novamente mais tarde.");
                } else {
                    console.error("Erro ao buscar usuários:", error.response?.data || error.message);
                    alert("Erro ao buscar usuários. Verifique as informações e tente novamente.");
                }
            }
        };

    };

    const removeUser = async() => {
        if (userToRemove === "") {
            return;
        }
        try{
            const user = getTokenData();
            const removed = parseInt(userToRemove, 10);
            const res = await axios.delete(`http://localhost:3000/delete-relation/${id}/${removed}`);
            if(res === 200){
                alert("Usuário removido com sucesso!");
                if (user.id === removed){
                    navigate("/initial");
                }
                else{
                    try{
                        const respo = await axios.post("http://localhost:3000/create-notification", {
                            type: 3,
                            idList: id,
                            idSender: user.id,
                            idRecipient: removed,
                            idTask: null,
                        });
                        if (respo.status === 201) {
                            console.log("Notificação enviada para ", user.name);
                    
                        }
                    } catch(error){
                        console.error("Erro ao criar notificação:", error.response || error.message);
                    }
                }
            }
        } catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao cadastrar o usuário:", error.response?.data || error.message);
                alert("Erro ao cadastrar. Verifique as informações e tente novamente.");
            }
        }
    };

    const changeGroup = async() => {
        await addUser();
        await removeUser();
        closeManager();
    }

    const [users, setUsers] = useState([]);

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

        useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const resp = await axios.get(`http://localhost:3000/list-users/${id}`);
                    if (resp.status === 200) {
                        setUsers(resp.data.users);
                    }
                } catch (error) {
                    console.error("Erro ao recuperar participantes da lista:", error.message);
                }
            };
            fetchUsers();
        }, [id]);

    return (
        <>    
            <div className={styles.box2}>
                <div className={styles.top}>
                    <h1 className={styles.title}>Gerenciar Grupo:</h1>
                </div>
                <div className={styles.boxForm}>
                    <Input 
                        text="Adicionar" 
                        type="text" 
                        id="add"
                        value={usersToAdd}
                        onChange={setusersToAdd}
                        placeholder="email@exemplo.com; ..."
                    ></Input>
                    <div className={styles.remove}>
                        <label htmlFor="remove" className={styles.lbl}>Remover:</label>
                        <select name="remove" id="remove" className={styles.inp} onChange={(event) => setUserToRemove(event.target.value)}>
                            <option value="">Selecione</option>
                            {users.length > 0 &&
                                users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>     
                </div>
                <div className={styles.boxButton}>
                    <Button sizeClass="small" text="Concluir" handleClick={changeGroup} />
                    <a href="" onClick={closeManager} className={styles.link}>Cancelar</a>
                </div>
            </div>
        </>
    );
  }
  
  export default Manager;