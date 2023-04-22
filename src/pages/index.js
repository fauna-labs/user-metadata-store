// This is MANAGE ACCOUNTS PAGE
import { useRouter } from "next/router";
import FaunaClient from "../../Faunadoo";
import { useState, useEffect } from "react";
import styles from "../styles/ManageAccounts.module.css"; 
import EditEmployeeInfo from "../../components/EditEmployeeInfo";
import Login from "../../components/Login";

export default function Home() {
  const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchByFirstName, setSearchByFirstName] = useState(false);
  const [searchByLastName, setSearchByLastName] = useState(false);
  const [searchBySalary, setSearchBySalary] = useState(false);
  const [searchByReport, setSearchByReport] = useState(false);
  const [inputOne, setInputOne] = useState("");
  const [inputTwo, setInpuTwo] = useState("");
  const [extractedKeys, setExtractedKeys] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isManager, setIsManager] = useState(true)

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
    db.query(`Employee.all()`).then(result => {
      setSearchResult(result.data)
    })
  }

  const handleOptionSelection = (e) => {
    e.preventDefault();
    setSelectedOption(e.target.innerText);
  }

  useEffect(() => {
    if(selectedOption == "First Name") {
      setSearchByFirstName(true);
      setSearchByLastName(false);
      setSearchBySalary(false);
      setSearchByReport(false);
    } else if (selectedOption == "Last Name") {
      setSearchByFirstName(false);
      setSearchByLastName(true);
      setSearchBySalary(false);
      setSearchByReport(false);
    } else if (selectedOption == "Salary") {
      setSearchByFirstName(false);
      setSearchByLastName(false);
      setSearchBySalary(true);
      setSearchByReport(false);
    } else if (selectedOption == "Direct Report") {
      setSearchByFirstName(false);
      setSearchByLastName(false);
      setSearchBySalary(false);
      setSearchByReport(true);
    }
  }, [selectedOption]);

  const handleInputOne = (e) => {
    setInputOne(e.target.value);
  }

  const handleInputTwo = (e) => {
    setInpuTwo(e.target.value);
  }

  const firstNameSearch = (e) => {
    e.preventDefault();
    db.query(`Employee.byFirstName("${inputOne}")`).then(result => {
      setSearchResult(result.data)
      setExtractedKeys(Object.keys(result.data[0]));
    });
  }

  const lastNameSearch = (e) => {
    e.preventDefault();
    db.query(`Employee.byLastName("${inputOne}")`).then(result => {
      setSearchResult(result.data)
      setExtractedKeys(Object.keys(response.data[0]));
    });
  }

  const salarySearch = (e) => {
    e.preventDefault();
    db.query(`Employee.all.where(.salary >= ${inputOne} && .salary <= ${inputTwo})`).then(result => {
      setSearchResult(result.data)
      setExtractedKeys(Object.keys(response.data[0]));
    });
  }

  const reportSearch = (e) => {
    e.preventDefault();
    db.query(`Employee.byDirectReport("${inputOne}")`).then(result => {
      setSearchResult(result.data)
      setExtractedKeys(Object.keys(response.data[0]));
    });
  }

  const enableEditModal = (e, id) => {
    e.preventDefault();
    setSavedId(id);
    setEditModal(true);
  }

  const confirmLogin = (message) => {
    // setLoggedin(message);
    const checkLoginStatus = () => {
      const localStorageExists = JSON.parse(localStorage.getItem("employeeManager-loggedInUser"));
      
      if (localStorageExists == null) {
            setLoggedin(false);
         } else {
             setLoggedin(true);
         }
    }
  
  }

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("employeeManager-loggedInUser");
    window.location.href = "/"
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

                  {/* Search By... Selector */}
                    <div className={styles.dropDown}>
                      <button className={styles.dropBtn}>Search by...</button>
                      <div className={styles.dropDownContent}>
                        <div className={styles.option} onClick={handleOptionSelection}>First Name</div>
                        <div className={styles.option} onClick={handleOptionSelection}>Last Name</div>
                        <div className={styles.option} onClick={handleOptionSelection}>Salary</div>
                        <div className={styles.option} onClick={handleOptionSelection}>Direct Report</div>
                      </div>
                    </div>

                    {/* Search selector displayed below based on above selection */}
                    <div>
                      {searchByFirstName ? (
                        <div>
                          <h3>search by first name</h3>
                          <input onChange={handleInputOne}/>
                          <button onClick={firstNameSearch}>Search</button>
                        </div>
                      ) : null}
                      {searchByLastName ? (
                        <div>
                          <h3>search by last name</h3>
                          <input onChange={handleInputOne}/>
                          <button onClick={lastNameSearch}>Search</button>
                        </div>
                      ) : null}
                      {searchBySalary ? (
                        <div>
                          <h3>search by salary range</h3>
                          range from <input onChange={handleInputOne}/> to <input onChange={handleInputTwo} />
                          <button onClick={salarySearch}>Search</button>
                        </div>
                      ) : null}
                      {searchByReport ? (
                        <div>
                          <h3>search by direct report, use full name</h3>
                          <input onChange={handleInputOne}/>
                          <button onClick={reportSearch}>Search</button>
                        </div>
                      ) : null}
                    </div>

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
                            {isManager ? (
                              <th className={styles.th}>Edit Info</th>
                            ) : null}
                          </tr>
                        </thead>

                        {/* Visualizing the information based on the search */}
                        <tbody>
                          {searchResult.map(info => {
                            return (
                              <tr className={styles.tr}>
                                <td className={styles.td}>{info.firstName}</td>
                                <td className={styles.td}>{info.lastName}</td>
                                <td className={styles.td}>{info.role}</td>
                                <td className={styles.td}>{info.salary}</td>
                                <td className={styles.td}>{info.dateJoined}</td>
                                <td className={styles.td}>{info.phoneNum}</td>
                                <td className={styles.td}>{info.employeeId}</td>
                                <td className={styles.td}>{info.directReport}</td>
                                {isManager ? (
                                  <EditEmployeeInfo 
                                    id={info._id} 
                                    firstName={info.firstName} 
                                    lastName={info.lastName} 
                                    role={info.role} 
                                    salary={info.salary} 
                                    dateJoined={info.dateJoined} 
                                    phoneNum={info.phoneNum}
                                    employeeId={info.employeeId}
                                    directReport={info.directReport} />
                                ) : null}
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
