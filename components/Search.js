import { useState } from "react";
import useCheckLogin from "../src/hooks/useCheckLogin";

export default function Search(props) {
  const { loggedin, db } = useCheckLogin();

  const [searchOptions, setSearchOptions] = useState({
    firstName: false,
    lastName: false,
    salary: false,
    report: false,
  });

  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    minSalary: "",
    maxSalary: "",
    report: "",
  });

  const handleOptionSelection = (e) => {
    setSearchOptions({ ...searchOptions, [e.target.name]: e.target.checked });
  };

  const handleInputChange = (e) => {
    if(e.target.name == "salary") {
      setInputValues({...inputValues, [e.target.name]: e.target.value})
    } else {
      setInputValues({ ...inputValues, [e.target.name]: e.target.value });
    }
  };  

  const searchHandler = (e) => {
    e.preventDefault();
  
    let separatedInput = inputValues.report.split(' ');

    console.log(separatedInput);
  
    let query = `
    let company = Query.identity().company
    let foundDirectReport = Employee.where(.firstName == "${separatedInput[0]}" && .lastName == "${separatedInput[1]}").first()
  
    Employee.byCompany(company)`;
  
    const conditions = [];
  
    if (searchOptions.firstName) {
      conditions.push(`.firstName.includes("${inputValues.firstName}")`);
    }
  
    if (searchOptions.lastName) {
      conditions.push(`.lastName.includes("${inputValues.lastName}")`);
    }
  
    if (searchOptions.salary) {
      conditions.push(
        `.salary >= ${inputValues.minSalary} && .salary <= ${inputValues.maxSalary}`
      );
    }
  
    if (searchOptions.report) {
      conditions.push(`.directReport == foundDirectReport`);
    }
  
    if (conditions.length > 0) {
      query += `.where(${conditions.join(" && ")})`;
    }

    query += `{
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
        privilege
    }`

    console.log(query);
  
    db.query(`${query}`).then((result) => {
      console.log("first result",result);
      props.searchResponse(result?.data);
    });
  };  


  const clearSearchHandler = (e) => {
    e.preventDefault();
    setSearchOptions({
      firstName: false,
      lastName: false,
      salary: false,
      report: false,
    });
  
    setInputValues({
      firstName: "",
      lastName: "",
      minSalary: "",
      maxSalary: "",
      report: "",
    });

    db.query(`
    let company = Query.identity().company
    Employee.byCompany(company){
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
        privilege
    }`).then(result => {
        console.log("second result", result);
        props.searchResponse(result?.data);
    })
  }

  return (
    <>
      <div>
        <h3>Search options</h3>
        <label>
          <input
            type="checkbox"
            name="firstName"
            checked={searchOptions.firstName}
            onChange={handleOptionSelection}
          />{" "}
          First Name
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="lastName"
            checked={searchOptions.lastName}
            onChange={handleOptionSelection}
          />{" "}
          Last Name
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="salary"
            checked={searchOptions.salary}
            onChange={handleOptionSelection}
          />{" "}
          Salary
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="report"
            checked={searchOptions.report}
            onChange={handleOptionSelection}
          />{" "}
          Direct Report
        </label>
      </div>

      <div>
      <h3>Enter search query</h3>
        {searchOptions.firstName && (
          <div>
            <label>First Name: </label>
            <input
              name="firstName"
              value={inputValues.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
          </div>
        )}
        {searchOptions.lastName && (
          <div>
            <label>Last Name: </label>
            <input
              name="lastName"
              value={inputValues.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </div>
        )}
        {searchOptions.salary && (
          <div>
            <label>Salary Range: </label>
            <input
              name="minSalary"
              value={inputValues.minSalary}
              onChange={handleInputChange}
              placeholder="Min Salary"
            />
            <input
              name="maxSalary"
              value={inputValues.maxSalary}
              onChange={handleInputChange}
              placeholder="Max Salary"
            />
          </div>
        )}
        {searchOptions.report && (
          <div>
            <label>Direct Report: </label>
            <input
              name="report"
              value={inputValues.report}
              onChange={handleInputChange}
              placeholder="Full Name"
            />
          </div>
        )}
        <div className="container">
          <button className="button" onClick={searchHandler}>Search</button>
          <button className="button" onClick={clearSearchHandler}>Clear</button>
        </div>
      </div>
    </>
  );
}