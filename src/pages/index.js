// This is MANAGE ACCOUNTS PAGE
import { useRouter } from "next/router";
import FaunaClient from "../../Faunadoo";
import { useState, useEffect } from "react";
import styles from "../styles/ManageAccounts.module.css"; 
import EditEmployeeInfo from "../../components/EditEmployeeInfo";
import Login from "../../components/Login";
import Search from "../../components/Search";

export default function Home() {
  const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
  const router = useRouter();
  const [searchResult, setSearchResult] = useState([]);

  const [loggedin, setLoggedin] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const localStorageExists = JSON.parse(localStorage.getItem("employeeManager-loggedInUser"));
    
    if (localStorageExists == null) {
          setLoggedin(false);
       } else {
           setLoggedin(true);
       }
  }

  const redirectHandler = (e) => {
    e.preventDefault();
    router.push("/add-employee");
  }

  useEffect(() => {
    getAllData();
  }, [])

  const getAllData = () => {
    db.query(`Employee.all() {
      id,
      firstName,
      lastName,
      salary,
      dateJoined,
      directReport {
        firstName,
        lastName
      },
      employeeId,
      phoneNum,
      position,
      company {
        name
      },
      privilege
    }`).then(result => {
      console.log(result);
      setSearchResult(result?.data);
    })
  }

  const confirmLogin = (message) => {
    checkLoginStatus();
  }

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("employeeManager-loggedInUser");
    window.location.href = "/"
  }

  const searchResponse = (result) => {
    setSearchResult(result);
  }
  
  return (
    <div>
      <>
        {
          loggedin ? (
            <>
              <div>
                <button onClick={logoutHandler}>Log-out</button>
              </div>
              <div>
                <button onClick={redirectHandler}>Add Employee</button>
              </div>

          <Search searchResponse = {searchResponse}/>

          <div>
            <table className={styles.table}>
              {/* Visualizing the keys from the collection */}
              <thead>
                <tr className={styles.tr}>
                  <th className={styles.th}>First Name</th>
                  <th className={styles.th}>Last Name</th>
                  <th className={styles.th}>Position</th>
                  <th className={styles.th}>Salary</th>
                  <th className={styles.th}>Date Joined</th>
                  <th className={styles.th}>Phone #</th>
                  <th className={styles.th}>Employee Id</th>
                  <th className={styles.th}>Direct Report</th>
                  <th className={styles.th}>Edit Info</th>
                </tr>
              </thead>

              {/* Visualizing the information based on the search */}
              <tbody>
                {searchResult.map(info => {
                  console.log(info.directReport);
                  return (
                    <tr className={styles.tr}>
                      <td className={styles.td}>{info.firstName}</td>
                      <td className={styles.td}>{info.lastName}</td>
                      <td className={styles.td}>{info.position}</td>
                      <td className={styles.td}>{info.salary}</td>
                      <td className={styles.td}>{info.dateJoined}</td>
                      <td className={styles.td}>{info.phoneNum}</td>
                      <td className={styles.td}>{info.employeeId}</td>
                      <td className={styles.td}>{info.directReport.firstName} {info.directReport.lastName}</td>
                      <EditEmployeeInfo info={info}/>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
          </div>                       
            </>
          ) : (
          <Login confirmLogin = {confirmLogin}/>                      
          )
        }
      </>
    </div>
  )
}
