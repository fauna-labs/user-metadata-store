import { useState, useEffect } from "react";
import styles from "../src/styles/ManageAccounts.module.css";
import FaunaClient from "../Faunadoo";

export default function Search(props) {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchByFirstName, setSearchByFirstName] = useState(false);
    const [searchByLastName, setSearchByLastName] = useState(false);
    const [searchBySalary, setSearchBySalary] = useState(false);
    const [searchByReport, setSearchByReport] = useState(false);
    const [inputOne, setInputOne] = useState("");
    const [inputTwo, setInpuTwo] = useState("");

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

      const searchHandler = (e) => {
        e.preventDefault();
        const localStorageContent = JSON.parse(localStorage.getItem("employeeManager-loggedInUser"));
        if (inputOne == "") {
            db.query(`
                let company = Company.byId("${localStorageContent.companyId}")
                Employee.byCompany(company)`).then(result => {
                console.log(result);
                props.searchResponse(result?.data);
            })
        } else {
            if(e.target.name == "firstName") {
                db.query(`Employee.byFirstName("${inputOne}")`).then(result => {
                    props.searchResponse(result.data)
                  });
            } else if (e.target.name == "lastName") {
                db.query(`Employee.byLastName("${inputOne}")`).then(result => {
                    props.searchResponse(result.data)
                });
            } else if (e.target.name == "salary") {
                db.query(`
                    let company = Company.byId("${localStorageContent.companyId}")
                    Employee.byCompany(company).where(.salary >= ${inputOne} && .salary <= ${inputTwo})`).then(result => {
                    props.searchResponse(result.data)
                });
            } else {
                let separatedInput = inputOne.split(' ');
                console.log(separatedInput);
                db.query(`
                   let foundDirectReport = Employee.byFirstName("${separatedInput[0]}").where(.lastName == "${separatedInput[1]}").first()

                   Employee.byDirectReport(foundDirectReport)
                `).then(result => {
                    // console.log(result);
                    props.searchResponse(result.data)
                });
            }}
        }

    return (
        <>
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
                <button onClick={searchHandler} name="firstName">Search</button>
            </div>
            ) : null}
            {searchByLastName ? (
            <div>
                <h3>search by last name</h3>
                <input onChange={handleInputOne}/>
                <button onClick={searchHandler} name="lastName">Search</button>
            </div>
            ) : null}
            {searchBySalary ? (
            <div>
                <h3>search by salary range</h3>
                range from <input onChange={handleInputOne}/> to <input onChange={handleInputTwo} />
                <button onClick={searchHandler} name="salary">Search</button>
            </div>
            ) : null}
            {searchByReport ? (
            <div>
                <h3>search by direct report, use full name</h3>
                <input onChange={handleInputOne}/>
                <button onClick={searchHandler} name="directReport">Search</button>
            </div>
            ) : null}
            </div>        
        </>

    )
}