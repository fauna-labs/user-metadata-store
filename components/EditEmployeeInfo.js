import FaunaClient from "../Faunadoo";
import {useState} from "react";
import styles from "../src/styles/EditEmployeeInfo.module.css"

export default function EditEmployeeInfo(props) {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const [modal, setModal] = useState(false);
    const [copyOfRole, setCopyOfRole] = useState("");
    const [copyOfSalary, setCopyOfSalary] = useState(0);
    const [editSalary, setEditSalary] = useState(false);
    const [editRole, setEditRole] = useState(false);

    const setModalVisible = (e) => {
        e.preventDefault();
        setModal(true);
    }

    const closeModal = (e) => {
        e.preventDefault();
        setModal(false);
    }

    const allowEditPosition = (e) => {
        e.preventDefault();
        setEditRole(true);
        setCopyOfRole(props.role)
    }

    const allowEditSalary = (e) => {
        e.preventDefault();
        setEditSalary(true);
        setCopyOfSalary(props.salary)
    }

    const changePositionHandler = (e) => {
        setCopyOfRole(e.target.value);
    }

    const changeSalaryHandler = (e) => {
        setCopyOfSalary(e.target.value);
    }

    const updateEmployeeData = (e) => {
        e.preventDefault();
        db.query(`
            let employeeToEdit = Employee.byId("${props.id}");

            if(${copyOfSalary} != 0) {
                employeeToEdit.update({"salary" : ${copyOfSalary} })
            }

            if("${copyOfRole}" != "") {
                employeeToEdit.update({"role" : "${copyOfRole}" })
            }
        `).then(result => {
            console.log(result);
            setModal(false);
        });
    }

    return (
        <div>
            <button onClick={setModalVisible}>edit</button>

            { modal? (
                          <div className={styles.modal}>
                          <div className={styles.modalContent}>
                            <button className={styles.close} onClick={closeModal}>
                              ✖️
                            </button>

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
                                    </tr>
                                    </thead>

                                    {/* Visualizing the information based on the search */}
                                    <tbody>
                                        <tr className={styles.tr}>
                                            <td className={styles.td}>{props.firstName}</td>
                                            <td className={styles.td}>{props.lastName}</td>


                                            {editRole ? (<td  className={styles.editableTd}><input onChange={changePositionHandler} value={copyOfRole}/></td>) : (<td onClick={allowEditPosition} className={styles.editableTd}>{props.role}</td>)}
                                            
                                            {editSalary ? (<td className={styles.editableTd}><input onChange={changeSalaryHandler} value={copyOfSalary}/></td>) : (<td onClick={allowEditSalary} className={styles.editableTd}>{props.salary}</td>)}
                                            
                                            <td className={styles.td}>{props.dateJoined}</td>
                                            <td className={styles.td}>{props.phoneNum}</td>
                                            <td className={styles.td}>{props.employeeId}</td>
                                            <td className={styles.td}>{props.directReport}</td>
                                        </tr>
                                    </tbody>

                                </table>
                                <button onClick={updateEmployeeData}>Save Changes</button>
                            </div>
                          </div>
                        </div>
            ) : null}
        </div>
    )
}