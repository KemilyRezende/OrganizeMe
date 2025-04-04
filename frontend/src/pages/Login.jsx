import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/images/logo/logo.svg";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Header from "../components/Header/Header";
import styles from '../assets/styles/login.module.css'
import '../assets/styles/global.css'
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [email, setUserEmail] = useState("");
    const [pass, setUserPass] = useState("");

    const login = async() => {
        try{
            if (!email.trim() || !pass.trim()) {
                alert("Preencha todos os campos!");
                return;
            }
            const res = await axios.post("http://localhost:3000/login", {
                email, 
                password: pass,
            });
            console.log("Resposta do backend:", res.data);
            console.log("Token recebido:", res.data.token);
            console.log(res.status);
            if(res.status === 200){
                alert("Login realizado com sucesso!");
                localStorage.setItem("token", res.data.token);
                navigate("/initial");
            }
        } catch(error){
            if (error.response?.status === 401) {
                alert("Credenciais inválidas. Verifique seu email e senha.");
            } else if (error.response?.status === 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro ao fazer login:", error.message || error);
                alert("Erro inesperado. Tente novamente.");
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
                <div className={styles.boxForm}>
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
                </div>
                <div className={styles.boxButton}>
                    <Button sizeClass="big" text="Login" handleClick={login}></Button>
                    <a className={styles.link} onClick={() => navigate("/register")}>Criar conta</a>
                </div>
            </div>
        </>
    );
  }
  
  export default Login;
  