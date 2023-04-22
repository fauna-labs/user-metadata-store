import { useState} from "react";
import FaunaClient from "../Faunadoo";
import styles from "../src/styles/Login.module.css"

export default function Signup(props) {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatingEmail, setRepeatingEmail] = useState(false);

    const emailHandler = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const signupHandler = (e) => {
        e.preventDefault();
        db.query(`User.byEmail("${email}")`).then(result => {
            if (result?.data.length > 0) {
                setRepeatingEmail(true);
            } else {
                db.query(
                `Signup("${email}", "${password}")`
                ).then( result => {
                    setEmail("");
                    setPassword("");
                    props.displayLogin(false);
                })
            }
        });
    }

    const redirectToSigninHandler = (e) => {
        e.preventDefault();
        props.displayLogin(false);
    }

    return (
        <>
            <form className={styles.formWrapper} onSubmit={signupHandler}>
                <h2>Sign-Up</h2>
                <div className={styles.container}>
                    <label>Email</label>
                    <input className={styles.input} onChange={emailHandler} required />
                    {repeatingEmail ? (
                    <div className={styles.redFontText}>This email is already taken, contant your direct report.</div>
                    ) : null}
                </div>

                <div className={styles.container}>
                    <label>Password</label>
                    <input className={styles.input} type="password" onChange={passwordHandler} required />
                </div>

                <button className={styles.btn} type="submit">
                    sign-up
                </button>

                <div>
                    <button className={styles.btn} onClick={redirectToSigninHandler}>
                    sign-in
                    </button>
                </div>
            </form>

        </>
    )
}