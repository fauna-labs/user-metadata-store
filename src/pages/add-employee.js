import { useState } from "react";
import  styles from "../styles/AddEmployee.module.css";
import FaunaClient from "../../Faunadoo";
import { useRouter } from "next/router"; 


export default function AddEmployee() {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [salary, setSalary] = useState(0);
    const [dateJoined, setDateJoined] = useState(null);
    const [phoneNum, setPhoneNum] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [directReport, setDirectReport] = useState([]);

    const firstNameHandler = (e) => {
        setFirstName(e.target.value);
    }

    const lastNameHandler = (e) => {
        setLastName(e.target.value);
    }

    const roleHandler = (e) => {
        setRole(e.target.value);
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
        console.log(directReport);
        db.query(`
            let reportTo = Employee.byFirstName("${directReport[0]}").where(.lastName == "${directReport[1]}").first();

            Employee.create({
                firstName: "${firstName}",
                lastName: "${lastName}",
                role: "${role}",
                salary: ${salary},
                dateJoined: "${dateJoined}",
                phoneNum: "${phoneNum}",
                employeeId: "${employeeId}",
                directReport: reportTo
            })
        `).then(response => {
            console.log(response);
            router.push("/");
        });
    }

    const redirect = (e) => {
        e.preventDefault();
        router.push("/")
    }

    return (
        <div>
            <button onClick={redirect}>Go To Employee Manager</button>
            <form onSubmit={employeeSubmitHandler}>
                <h1> Add A New Employee</h1>

                <div className={styles.wrapper}>
                <label>First Name</label>
                <input onChange={firstNameHandler} />
                </div>

                <div className={styles.wrapper}>                
                    <label>Last Name</label>
                    <input onChange={lastNameHandler}/>
                </div>

                <div className={styles.wrapper}>
                    <label>Role</label>
                    <input onChange={roleHandler}/>       
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
                    <input onChange={directReportHandler}/>
                </div>

                <div className={styles.wrapper}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}