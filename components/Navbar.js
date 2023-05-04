import styles from "../src/styles/Nav.module.css"
import { useRouter } from "next/router";

export default function Navbar() {

  const router = useRouter();
  
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("employeeManager-loggedInUser");
    window.location.href = "/"
  }

  return (
    <nav className={styles.navbar}>
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
    </nav>
  )
}