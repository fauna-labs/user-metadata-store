import { useState, useEffect } from 'react';
import FaunaClient from "../../Faunadoo";

export default function useCheckLogin() {
  const [loggedin, setLoggedin] = useState(false);
  const [db, setDb] = useState(null);
  
  useEffect(() => {
    const secrect = JSON.parse(localStorage.getItem("employeeManager-loggedInUser"));
    if (!secrect) {
      setLoggedin(false);
    } else {
      setDb(new FaunaClient(secrect))
      setLoggedin(true);
    }
  }, []);

  return { loggedin, db };
}
