import { useState } from "react";
import FaunaClient from "../Faunadoo";
import styles from "../src/styles/Login.module.css"
import Signup from "./Signup";

export default function Login(props) {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [displaySignupForm, setDisplaySignupForm] = useState(false);

    const emailHandler = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const signinHandler = async (e) => {
        e.preventDefault();
        
        try {
            const result = await db.query(`Login("${email}","${password}")`);
            console.log("login attempt",result);
            if(!result) {
                alert("Username or password is incorrect");
            } else {
                window.localStorage.setItem("employeeManager-loggedInUser", JSON.stringify(result.secret));
                window.location.href = "/";
            }
        } catch (error) {
            console.log(error);
        }
    }

    const signupFormDisplayHandler = (e) => {
        e.preventDefault();
        setDisplaySignupForm(!displaySignupForm);
    }

    const displayLogin = (response) => {
        setDisplaySignupForm(response);
    }

    return(
        <div className={styles.loginFormWrap}>
            {!displaySignupForm ? (
                <>
                    <form className={styles.formWrapper} onSubmit={signinHandler}>
                        <h2>Sign-In</h2>
                        <div className={styles.container}>
                        <label>Email</label>
                        <input className={styles.loginInput} onChange={emailHandler} required value={email} />
                        </div>

                        <div className={styles.container}>
                        <label>Password</label>
                        <input className={styles.loginInput} type="password" onChange={passwordHandler} required value={password} />
                        {invalidPassword ? <div className={styles.redFontText}>Username or password is incorrect</div> : null}
                        </div>

                        <button className={styles.btn} type="submit">
                        sign-in
                        </button>
                    </form>

                    <button className="btn" onClick={signupFormDisplayHandler}>don't have an account?</button>
                </>
            ) : (
                <Signup displayLogin={displayLogin} />
            )}
        </div>
    )
}