export default function Navbar({ searchResult, setSearchResult, db, setDb, loggedin, setLoggedin }) {
  
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("employeeManager-loggedInUser");
    window.location.href = "/"
  }

  const addEmployeeHandler = (e) => {
    e.preventDefault();
    router.push("/add-employee");
  }

  return (
    <nav>
      <div>
        <button onClick={logoutHandler}>Log-out</button>
      </div>
      <div>
        <button onClick={addEmployeeHandler}>Add Employee</button>
      </div>
    </nav>
  )
}