import { useState, useEffect } from "react";
import styles from "../styles/ManageAccounts.module.css"; 
import EditEmployeeInfo from "../../components/EditEmployeeInfo";
import Login from "../../components/Login";
import Search from "../../components/Search";
import useCheckLogin from "../hooks/useCheckLogin";

export default function Home() {
  const [searchResult, setSearchResult] = useState([]);
  const { loggedin, db } = useCheckLogin();

  useEffect(() => {
    if(db) {
      getAllData();
    }
  }, [db]);

  const getAllData = () => {
    db.query(`
    let company = Query.identity().company
    Employee.byCompany(company) {
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
      setSearchResult(result?.data);
    })
  }

  const confirmLogin = (message) => {
    checkLoginStatus();
  }

  const searchResponse = (result) => {
    setSearchResult(result);
  }

  const updateResponse = (result) => {
    getAllData();
  }
  
  return (
    <>
    {
      loggedin ? (
      <div className={styles.container}>
      <Search searchResponse = {searchResponse}/>
      <div className={styles.tableContainer}>
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
              <th className={styles.th}>Privilege</th>
              <th className={styles.th}>Edit Info</th>
            </tr>
          </thead>

          {/* Visualizing the information based on the search */}
          <tbody>
            {searchResult.map(info => {
              return (
                <tr className={styles.tr}>
                  <td className={styles.td}>{info.firstName}</td>
                  <td className={styles.td}>{info.lastName}</td>
                  <td className={styles.td}>{info.position}</td>
                  <td className={styles.td}>{info.salary}</td>
                  <td className={styles.td}>{info.dateJoined}</td>
                  <td className={styles.td}>{info.phoneNum}</td>
                  <td className={styles.td}>{info.employeeId}</td>
                  <td className={styles.td}>{info.directReport?.firstName} {info.directReport?.lastName}</td>
                  <td className={styles.td}>{info.privilege}</td>
                  <EditEmployeeInfo info={info} updateResponse={updateResponse}/>
                </tr>
              )
            })
            }
          </tbody>
        </table>
      </div>                       
      </div>
      ) : (
      <Login confirmLogin = {confirmLogin}/>                      
      )
    }
    </>
  )
}
