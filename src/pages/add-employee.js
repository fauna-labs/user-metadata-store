import { useState, useEffect } from "react";
import  styles from "../styles/AddEmployee.module.css";
import FaunaClient from "../../Faunadoo";
import { useRouter } from "next/router"; 

export default function AddEmployee() {
    const [db, setDb] = useState(null);
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState(0);
    const [dateJoined, setDateJoined] = useState(null);
    const [phoneNum, setPhoneNum] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [directReport, setDirectReport] = useState([]);
    const [directReportPersonnel, setDirecReportPersonnel] = useState([]);
    const [privilege, setPrivilege] = useState("EMPLOYEE");


    useEffect(() => {
        if(!db) {
            const secrect = JSON.parse(
                localStorage.getItem("employeeManager-loggedInUser")
            );

            if(!secrect) {
                router.push("/");
            }

            setDb(new FaunaClient(secrect));
        }
        getDirectReportPersonnel();
    }, [db])

    const getDirectReportPersonnel = () => {
        if (!db) return;
        db.query(`
            let company = Query.identity().company
            Employee.byCompany(company).where(.privilege == "MANAGER" || .privilege == "ADMIN")
        `).then(result => {
            setDirecReportPersonnel(result?.data);
        })
    }

    const firstNameHandler = (e) => {
        setFirstName(e.target.value);
    }

    const lastNameHandler = (e) => {
        setLastName(e.target.value);
    }

    const positionHandler = (e) => {
        setPosition(e.target.value);
    }

    const salaryHandler = (e) => {
        setSalary(e.target.value);
    }

    const dateHandler = (e) => {
        setDateJoined(e.target.value);
    }

    const phoneHandler = (e) => {
        setPhoneNum(e.target.value);
    }

    const idHandler = (e) => {
        setEmployeeId(e.target.value);
    }

    const directReportHandler = (e) => {
        let fullName = e.target.value;
        let arrayOfName = fullName.split(" ");
        console.log(arrayOfName);
        setDirectReport(arrayOfName);
    }

    const employeeSubmitHandler = (e) => {
        e.preventDefault();
        db.query(`
        let company = Query.identity().company
        let reportTo = Employee.byFirstName("${directReport[0]}").where(.lastName == "${directReport[1]}").first();
        
        Signup(
            "${email}", 
            "${password}", 
            "${firstName}", 
            "${lastName}", 
            ${salary}, 
            "${dateJoined}", 
            reportTo, 
            "${employeeId}", 
            "${phoneNum}", 
            "${position}", 
            company, 
            "${privilege}"
        )
        `).then(response => {
            console.log(response);
            router.push("/");
        });
    }

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const privilegeHandler = (e) => {
        setPrivilege(e.target.value);
    }

    return (
        <div>
            <form onSubmit={employeeSubmitHandler}>
                <h1> Add A New Employee</h1>

                <div className={styles.wrapper}>
                <label>Email</label>
                <input onChange={emailHandler} />
                </div>

                <div className={styles.wrapper}>
                    <label>Password</label>
                    <input type="password" onChange={passwordHandler}/>
                </div>

                <div className={styles.wrapper}>
                <label>First Name</label>
                <input onChange={firstNameHandler} />
                </div>

                <div className={styles.wrapper}>                
                    <label>Last Name</label>
                    <input onChange={lastNameHandler}/>
                </div>

                <div className={styles.wrapper}>
                    <label>Position</label>
                    <input onChange={positionHandler}/>       
                </div>

                <div className={styles.wrapper}>
                    <label>Salary</label>
                    <input onChange={salaryHandler}/>    
                </div>

                <div className={styles.wrapper}>                
                    <label>Date Joined Company</label>
                    <input type="date" onChange={dateHandler}/>
                </div>

                <div className={styles.wrapper}>                
                    <label>Phone Number</label>
                    <input onChange={phoneHandler} />
                </div>

                <div className={styles.wrapper}>                
                    <label>Employee ID</label>
                    <input onChange={idHandler}/>
                </div>

                <div className={styles.wrapper}>
                    <label>Direct Report</label>
                    <select onChange={directReportHandler}>
                        <option value="">Select a direct report</option>
                        {directReportPersonnel.map((person) => (
                        <option
                            key={person.id}
                            value={`${person.firstName} ${person.lastName}`}
                        >
                            {person.firstName} {person.lastName}
                        </option>
                        ))}
                    </select>
                </div>

                <div className={styles.wrapper}>
                    <label>Privilege</label>
                    <select onChange={privilegeHandler}>
                        <option value="">Select privilege status</option>
                        <option value="EMPLOYEE"> Employee</option>
                        <option value="MANAGER"> Manager</option>
                        <option value="ADMIN"> Admin</option>
                    </select>
                </div>

                <div className={styles.wrapper}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}