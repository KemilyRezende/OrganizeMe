import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from './creator.module.css'

function Creator({text, handleClick, closer, name, setName, description, setDescription, deadline, setDeadline}) {

    return (
        <>    
            <div className={styles.box}>
                <div className={styles.top}>
                    <h1 className={styles.title}>Nova {text}:</h1>
                </div>
                <div className={styles.boxForm}>
                    {text === "Lista" ? (
                        <>
                            <Input 
                                text="Nome" 
                                type="text" 
                                id="listName"
                                value={name}
                                onChange={setName}
                                placeholder={"Lista 1"}>
                            </Input>
                            <Input 
                                text="Descrição" 
                                type="text" 
                                id="listDescription"
                                value={description}
                                onChange={setDescription}
                                placeholder={"..."}>    
                            </Input>
                            <Input 
                                text="Data Limite" 
                                type="date" 
                                id="listDeadline"
                                value={deadline}
                                onChange={setDeadline}
                                placeholder={""}>
                            </Input>
                        </>
                    ) : (
                        <>
                            <Input 
                                text="Nome" 
                                type="text" 
                                id="taskName"
                                value={name}
                                onChange={setName}
                                placeholder={"Tarefa"}>
                            </Input>
                            <Input 
                                text="Descrição" 
                                type="text" 
                                id="taskDescription"
                                value={description}
                                onChange={setDescription}
                                placeholder={"..."}>
                            </Input>
                            <Input 
                                text="Data Limite" 
                                type="date" 
                                id="taskDeadline"
                                value={deadline}
                                onChange={setDeadline}
                                placeholder={""}>
                            </Input>
                        </>
                    )}
                    <div className={styles.boxButton}>
                        <Button sizeClass="small" text="Criar" handleClick={handleClick} />
                        <a className={styles.link} href="" onClick={closer}>Cancelar</a>
                    </div>
                </div>
            </div>
        </>
    );
  }
  
  export default Creator;