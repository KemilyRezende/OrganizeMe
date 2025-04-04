import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/images/logo/logo.svg";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Header from "../components/Header/Header";
import styles from '../assets/styles/login.module.css'
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [name, setUserName] = useState("");
    const [email, setUserEmail] = useState("");
    const [pass, setUserPass] = useState("");

    const register = async() => {
        try{
            if (!name.trim() || !email.trim() || !pass.trim()) {
                alert("Preencha todos os campos!");
                return;
            }
            
            const res = await axios.post("http://localhost:3000/register", {
                name,
                email, 
                password: pass,
            });
            console.log(res.status);
            if(res.status === 201){
                alert("Usuário cadastrado com sucesso!");
                localStorage.setItem("token", res.data.token);
                navigate("/initial");
            }
        }
        catch(error){
            if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao cadastrar o usuário:", error.response?.data || error.message);
                alert("Erro ao cadastrar. Verifique as informações e tente novamente.");
            }
        }
    }
    
    return (
        <>
            <Header type={1}></Header>
            <div className={styles.box}>
                <div className={styles.boxLogo}>
                    <img src={logo} alt="OrganizeMe Logo" className={styles.logo}/>
                    <h1 className={styles.name}>Organize<span className={styles.me}>Me</span></h1>
                </div>
                <form className={styles.boxForm}>
                    <Input 
                        text="Nome" 
                        type="text" 
                        id="name"
                        value={name}
                        onChange={setUserName}
                        placeholder={"Nome"}
                        ></Input>
                    <Input 
                        text="Email" 
                        type="email" 
                        id="email"
                        value={email}
                        onChange={setUserEmail}
                        placeholder={"email@exemplo.com"}>
                    </Input>
                    <Input 
                        text="Senha" 
                        type="password"
                        id="pass"
                        value={pass}
                        onChange={setUserPass}
                        placeholder={""}>
                    </Input>
                </form>
                <div className={styles.boxButton}>
                    <Button sizeClass="big" text="Criar conta" handleClick={register}></Button>
                    <a className={styles.link} onClick={() => navigate("/login")}>Login</a>
                </div>
            </div>
        </>
    );
  }
  
  export default Register;
  