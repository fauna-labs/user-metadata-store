import FaunaClient from "../Faunadoo";
import {useState} from "react";
import styles from "../src/styles/EditEmployeeInfo.module.css"

export default function EditEmployeeInfo(props) {
    const db = new FaunaClient(process.env.NEXT_PUBLIC_FAUNA_KEY);
    const [modal, setModal] = useState(false);

    const [employeeInfo, setEmployeeInfo] = useState({...props.info}) 

    console.log(employeeInfo);

    const setModalVisible = (e) => {
        e.preventDefault();
        setModal(true);
    }

    const closeModal = (e) => {
        e.preventDefault();
        setModal(false);
    }

    /** 💍 One Ringg to Rule em All 🧙‍♂️*/
    const handleChange = (e) => {
        setEmployeeInfo({
            ...employeeInfo,
            [e.target.name]: e.target.value
        })
    }

    const updateEmployeeData = (e) => {
        e.preventDefault();
        const updatedValues = {...employeeInfo}
        delete updatedValues.id;
        db.query(`
            let employeeToUpdate = Employee.byId("${props.info.id}");

            employeeToUpdate.update(${JSON.stringify(updatedValues)})
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
                                        <th className={styles.th}>Salary</th>
                                        <th className={styles.th}>Date Joined</th>
                                        <th className={styles.th}>Direct Report</th>
                                        <th className={styles.th}>Employee Id</th>
                                        <th className={styles.th}>Phone #</th>
                                        <th className={styles.th}>Position</th>
                                        <th className={styles.th}>Privilege</th>
                                    </tr>
                                    </thead>

                                    {/* Visualizing the information based on the search */}
                                    <tbody>
                                        <tr className={styles.tr}>
                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.firstName} name="firstName"/>
                                        </td>
                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.lastName} name="lastName"/>
                                        </td>
                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.salary} name="salary"/>
                                        </td>
                                        <td className={styles.td}>{props.info.dateJoined}</td>

                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.directReport} name="directReport"/>
                                        </td>

                                        <td className={styles.td}>{props.info.employeeId}</td>

                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.phoneNum} name="phoneNum"/>
                                        </td>
                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.position} name="position"/>
                                        </td>
                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.privilege} name="privilege"/>
                                        </td>
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