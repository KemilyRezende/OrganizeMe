import { useNavigate } from "react-router-dom";
import styles from './header.module.css'
import '../../assets/styles/global.css'
import arrow from '../../assets/images/icons/arrow.svg'
import bell from '../../assets/images/icons/bell.svg'
import notification from '../../assets/images/icons/notification.svg'


function Header({type, action}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    alert("Você saiu com sucesso!");
    navigate("/");
  };

  return (
    <>
      {type === 1 ? (
        <header className={styles.header1}>
          <img src={arrow} alt="back" className={styles.arrow} onClick={() => navigate("/")}/>
        </header>
      ) : (
        <header className={styles.header2}>
          {action === "home" ? (
            <img src={arrow} alt="back" className={styles.arrow} onClick={logout}/>
          ): (
            <img src={arrow} alt="back" className={styles.arrow} onClick={() => navigate("/initial")}/>
          )}
          <h1 className={styles.name}>
            Organize<span className={styles.me}>Me</span>
          </h1>
          {type == 2 ? (
            <img src={bell} alt="notifications" className={styles.bell} onClick={() => navigate("/notifications")}/>
          ) : (
            <img src={notification} alt="notifications" className={styles.bell} onClick={() => navigate("/notifications")}/>
          )}
          
        </header>
      )}
    </>
  );
}

export default Header;