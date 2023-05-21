import styles from "../src/styles/Nav.module.css"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("employeeManager-loggedInUser");
    if (loggedInUser) {
      setLoggedInUser(JSON.parse(loggedInUser));
    }
  }, [loggedInUser]);
  
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("employeeManager-loggedInUser");
    window.location.href = "/"
  }

  return (
    <nav className={styles.navbar}>
      {
        loggedInUser ? (
          <>
            <a className={styles.navLink} onClick={() => {
              router.push("/");
            }}>
              All Employees
            </a>
            <a className={styles.navLink} onClick={() => {
              router.push("/add-employee");
            }}>
              Add Employee
            </a>
            <a className={`${styles.navLink} ${styles.logout}`} onClick={logoutHandler}>
              Log-out
            </a>
          </>
        ) : (
          <>
            <h1 >
              Please Login or Register
            </h1>
          </>
        )
      }
    </nav>
  )
}