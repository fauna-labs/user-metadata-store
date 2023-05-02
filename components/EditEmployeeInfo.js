import FaunaClient from "../Faunadoo";
import {useState} from "react";
import styles from "../src/styles/EditEmployeeInfo.module.css"

export default function EditEmployeeInfo(props) {
    const localStorageContent = JSON.parse(localStorage.getItem("employeeManager-loggedInUser"));
    const db = new FaunaClient(localStorageContent.key);
    const [modal, setModal] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState({...props.info});
    const [directReportPersonnel, setDirecReportPersonnel] = useState([]); 

    const setModalVisible = (e) => {
        e.preventDefault();
        getDirectReportPersonnel();
        setModal(true);
    }

    const closeModal = (e) => {
        e.preventDefault();
        setModal(false);
    }

    /** 💍 One Ringg to Rule em All 🧙‍♂️*/
    const handleChange = (e) => {
        if (e.target.name === "directReport") {
            const selectedDirectReport = directReportPersonnel.find(person => person.id === e.target.value);
            setEmployeeInfo({
                ...employeeInfo,
                directReport: selectedDirectReport,
            });
        } else {
            setEmployeeInfo({
                ...employeeInfo,
                [e.target.name]: e.target.value
            });
        }
    }

    const getDirectReportPersonnel = () => {
        const localStorageContent = JSON.parse(
            localStorage.getItem("employeeManager-loggedInUser")
          );

          if(!localStorageContent) {
            router.push("/");
          }
        
        db.query(`
            let company = Company.byId("${localStorageContent.company}")
            Employee.byCompany(company).where(.privilege == "MANAGER" || .privilege == "ADMIN")
        `).then(result => {
            setDirecReportPersonnel(result?.data);
        })
    }

    const updateEmployeeData = (e) => {
        e.preventDefault();
        const updatedValues = {...employeeInfo}
        delete updatedValues.id;
        const localStorageContent = JSON.parse(localStorage.getItem("employeeManager-loggedInUser"));

        db.query(`
            let employeeToUpdate = Employee.byId("${props.info.id}")
            let company = Company.byId("${localStorageContent.company}")

            employeeToUpdate.update({
                "firstName" : "${employeeInfo.firstName}",
                "lastName" : "${employeeInfo.lastName}",
                "salary" : ${employeeInfo.salary},
                "position" : "${employeeInfo.position}",
                "phoneNum" : "${employeeInfo.phoneNum}",
                "privilege" : "${employeeInfo.privilege}",
            })
        `).then(result => {
            props.updateResponse();
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

                                        <td className={styles.editableTd}>
                                            <select onChange={handleChange} name="directReport" value={employeeInfo.directReport.id}>
                                                <option value={employeeInfo.directReport.id}>{employeeInfo.directReport.firstName + " " + employeeInfo.directReport.lastName}</option>
                                                {directReportPersonnel.map((person, index) => (
                                                    <option key={index} value={person.id}>
                                                        {person.firstName + " " + person.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className={styles.td}>{props.info.employeeId}</td>

                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.phoneNum} name="phoneNum"/>
                                        </td>
                                        <td  className={styles.editableTd}>
                                            <input onChange={handleChange} value={employeeInfo.position} name="position"/>
                                        </td>

                                        <td className={styles.editableTd}>
                                            <select onChange={handleChange} name="privilege" value={employeeInfo.privilege}>
                                                <option value="EMPLOYEE">EMPLOYEE</option>
                                                <option value="MANAGER">MANAGER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>                                            
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