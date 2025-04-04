import styles from './button.module.css'
import '../../assets/styles/global.css'


function Button({sizeClass, text, handleClick}) {

  return (
    <>
      <button className={`${styles.button} ${sizeClass}`}  onClick={() => handleClick()}>
        <p className={styles.text}>{text}</p>
      </button>
    </>
  );
}

export default Button;