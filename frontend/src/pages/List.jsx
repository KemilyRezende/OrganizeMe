import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import * as jwtDecode from "jwt-decode";
import axios from "axios";
import Button from "../components/Button/Button";
import Header from "../components/Header/Header";
import Creator from "../components/Creator/Creator";
import Manager from "../components/Manager/Manager"
import Task from "../components/Task/Task";
import person from '../assets/images/icons/person.svg'
import styles from '../assets/styles/initial.module.css'
import '../assets/styles/global.css'

function List() {

    const { id, name } = useParams();

    const [users, setUsers] = useState([]);

    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDeadline, setTaskDeadline] = useState("");
    
    const [tasks, setTasks] = useState([]);

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

    const createTask = async() => {
        try{
            if (!taskName.trim()) {
                alert("O campo nome é obrigatório!");
                return;
            }
            const res = await axios.post("http://localhost:3000/create-task", {
                idList: id,
                name: taskName,
                description: taskDescription, 
                deadline: taskDeadline ? new Date(taskDeadline) : null,
            });
            if(res.status === 201){
                alert("Tarefa criada com sucesso!");
                const u = getTokenData();
                if(users && users.length > 1){
                    for (const user of users) {
                        if (u.id !== user.id) {
                            try {
                                const respo = await axios.post("http://localhost:3000/create-notification", {
                                    type: 5,
                                    idList: id,
                                    idSender: u.id,
                                    idRecipient: user.id,
                                    idTask: res.data.task.id,
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
                try{
                    const action = "create";
                    const res3 = await axios.put(`http://localhost:3000/update-task-counter/${id}/${action}`);
                    if(res.status === 200){
                        alert("Tarefas e pendências atualizadas na lista");
                        setCreatorVisible(false);
                        await loadTasks();
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
            setCreatorVisible(false);
            setTimeout(() => {
                loadTasks();
            }, 500);
        } catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else if (error.response?.status === 404) {
                alert("Lista não encontrada.");
            } else {
                console.error("Erro ao criar a tarefa:", error.response?.data || error.message);
                alert("Erro ao criar a tarefa. Verifique as informações e tente novamente.");
            }
        }
    };

    const loadTasks = async() =>{
        try{
            console.log(id);
            const res = await axios.get(`http://localhost:3000/list-tasks/${id}`);
            if(res.status === 200){
                setTasks(res.data.tasks);
                console.log(res.data.tasks);
            }
            else if(res.status === 204){
                setTasks([]);
            }
        }
        catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao carregar tarefas:", error.response?.data || error.message);
                alert("Erro ao carregar tarefas. Verifique as informações e tente novamente.");
            }
        }
    };

    useEffect(() => {
            const fetchTasks = async () => {
                try {
                    await loadTasks();
                } catch (error) {
                    console.error("Erro ao carregar tarefas:", error.message);
                }
            };
        
            fetchTasks();
        }, [id]);

    const [isCreatorVisible, setCreatorVisible] = useState(false);
    
        const showCreator = () => {
            setCreatorVisible(true);
        };
    
        const closeCreator = () => {
            setCreatorVisible(false);
            loadTasks();
        };
    
        const [isManagerVisible, setManagerVisible] = useState(false);
    
        const showManager = () => {
            setManagerVisible(true);
        };
    
        const closeManager = () => {
            loadTasks();
            setManagerVisible(false);
        };
    

    return (
        <>
            <Header type={2} action="init"></Header>
            <div className={styles.boxPage}>
                <div className={styles.box}>
                    <div className={styles.boxTitle}>
                        <h1 className={styles.title}>{name}</h1>
                    </div>
                    <div className={styles.boxLists}>
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <Task
                                    key={task.id}
                                    id={task.id}
                                    idList={id}
                                    name={task.name}
                                    description={task.description}
                                    deadline={task.deadline}
                                    done={task.done}
                                />
                            ))
                        ) : (
                            <p className={styles.advice}>Essa Lista ainda não tem tarefas. Clique em "Criar" para adicionar uma nova.</p>
                        )}
                    </div>
                    <div className={styles.boxButton}>
                        <Button sizeClass="big" text="Criar" handleClick={showCreator} />
                        <button className={styles.but} onClick={showManager}>
                            <img src={person} alt="" />
                        </button>
                    </div>
                </div>

                {isCreatorVisible && (
                <div className={styles.creator}>
                    <Creator 
                        text="Tarefa" 
                        handleClick={createTask}
                        closer={closeCreator}
                        name={taskName}
                        setName={setTaskName}
                        description={taskDescription}
                        setDescription={setTaskDescription}
                        deadline={taskDeadline}
                        setDeadline={setTaskDeadline} />
                </div>
                )}
                {isManagerVisible && (
                    <div className={styles.group}>
                        <Manager
                            id={id}
                            closeManager={closeManager}
                        ></Manager>
                    </div>
                )}
            </div>
        </>
    );
  }
  
  export default List;
  