import { useState } from "react";
import FaunaClient from "../Faunadoo";
import { useRouter } from "next/router";

export default function Signup(props) {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const [company, setCompany] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatingEmail, setRepeatingEmail] = useState(false);
    const [repeatingCompany, setRepeatingCompany] = useState(false);

    const router = useRouter();

    const companyHandler = (e) => {
        e.preventDefault();
        setCompany(e.target.value);
    }

    const firstNameHandler = (e) => {
        e.preventDefault();
        setFirstName(e.target.value);
    }

    const lastNameHandler = (e) => {
        e.preventDefault();
        setLastName(e.target.value);
    }

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
        db.query(`CompanyCreate("${email}", "${password}", "${firstName}", "${lastName}", "${company}")`)
        .then(result => {
            console.log(result);
            alert("Sign-up successful!, please sign-in to continue.");
            router.push("/");
        });
    }

    const redirectToSigninHandler = (e) => {
        e.preventDefault();
        props.displayLogin(false);
    }

    return (
        <>
            <form className="formWrapper" onSubmit={signupHandler}>
                <h2>Sign-Up</h2>

                <div className="container">
                    <label>Company Name</label>
                    <input className="input" onChange={companyHandler} required />
                    {repeatingCompany ? (<div className="redFontText">This company already exists.</div>) : null}   
                </div>

                <div className="container">
                    <label>First Name</label>
                    <input className="input" onChange={firstNameHandler} required />
                </div>

                <div className="container">
                    <label>Last Name</label>
                    <input className="input" onChange={lastNameHandler} required />
                </div>

                <div className="container">
                    <label>E-mail</label>
                    <input className="input" onChange={emailHandler} required/>
                    {repeatingEmail ? (<div className="redFontText">This email is already taken, pick another</div>) : null}         
                </div>

                <div className="container">
                    <label>Password</label>
                    <input  className="input" type="password" onChange={passwordHandler} required/>
                </div>

                <div className="container">
                    <button className="button" type="submit">sign-up</button>
                </div>

            </form>

            <div className="container">
                <a className="signupBtn" onClick={redirectToSigninHandler}>back to sign-in</a>
            </div>
        </>
    )
}