import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo/logo.svg";
import Button from "../components/Button/Button";
import styles from '../assets/styles/home.module.css'

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.box}>
        <img src={logo} alt="OrganizeMe Logo" className={styles.logo}/>
        <h1 className={styles.name}>Organize<span className={styles.me}>Me</span></h1>
        <div className={styles.buttonBox}>
          <Button sizeClass="big" text="Login" handleClick={() => navigate("/login")} />
          <Button sizeClass="big" text="Criar conta" handleClick={() => navigate("/register")} />
        </div>
      </div>
    </>
  );
}

export default Home;
