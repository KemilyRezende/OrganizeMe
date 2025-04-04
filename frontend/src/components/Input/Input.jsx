import styles from './input.module.css'
import '../../assets/styles/global.css'


function Input({text, type, id, value, onChange, placeholder}) {

  const handleOnChange = (e) =>{
    onChange(e.target.value);
  }
  return (
    <>
      {text === "Descrição" ? (
        <div className={styles.box}>
          <label htmlFor={id} className={styles.lbl}>{text}:</label>
          <textarea name={id} id={id} className={styles.inpText} value={value} onChange={handleOnChange} placeholder={placeholder}></textarea>
        </div>
      ) : (
        <div className={styles.box}>
          <label htmlFor={id} className={styles.lbl}>{text}:</label>
          <input type={type} id={id} autoComplete="off" className={styles.inp} value={value} onChange={handleOnChange} placeholder={placeholder}/>
        </div>
      )}

    </>
  );
}

export default Input;