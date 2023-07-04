import React, { useState } from "react";

import MenuContext from "./MenuContext";
import axios from "axios";

const MenuState = (props) => {
  //State for create new user window
  const [emergentNewUserState, setEmergentNewUserState] = useState(false);

  //State for edit user window
  const [emergentEditUserState, setEmergentEditUserState] = useState(false);

  //State for edit logged user
  const [emergentEditOwnUserState, setEmergentEditOwnUserState] =
    useState(false);

  //State for delete One users window
  const [emergentDeleteOneUserState, setEmergentDeleteOneUserState] =
    useState(false);

  //State for create new exam
  const [emergentNewExamState, setEmergentNewExamState] = useState(false);

  //State for edit  exam
  const [emergentEditExamState, setEmergentEditExamState] = useState(false);

  //State for delete one exam window
  const [emergentDeleteOneExamState, setEmergentDeleteOneExamState] =
    useState(false);

  //State for create new vaccine
  const [emergentNewVaccineState, setEmergentNewVaccineState] = useState(false);

  //State for edit  vaccine
  const [emergentEditVaccineState, setEmergentEditVaccineState] =
    useState(false);

  //State for delete one vaccine window
  const [emergentDeleteOneVaccineState, setEmergentDeleteOneVaccineState] =
    useState(false);

  //State for create new area
  const [emergentNewAreaState, setemergentNewAreaState] = useState(false);

  //State for edit  area
  const [emergentEditAreaState, setemergentEditAreaState] = useState(false);

  //State for delete  area
  const [emergentDeleteOneAreaState, setemergentDeleteOneAreaState] =
    useState(false);

  //State for new drug
  const [emergentNewDrugState, setemergentNewDrugaState] = useState(false);

  //State for edit  drug
  const [emergentEditDrugState, setemergentEditDrugState] = useState(false);

  //State for delete  drug
  const [emergentDeleteOneDrugState, setemergentDeleteOneDrugState] =
    useState(false);

  //Function for emergent create drug state
  function settingEmergentNewDrugState() {
    if (emergentNewDrugState) setemergentNewDrugaState(false);
    else setemergentNewDrugaState(true);
  }

  //Function for emergent edit drug state
  function settingEmergentEditDrugState() {
    if (emergentEditDrugState) setemergentEditDrugState(false);
    else setemergentEditDrugState(true);
  }

  //Function for emergent delete drug state
  function settingEmergentDeleteOneDrugState() {
    if (emergentDeleteOneDrugState) setemergentDeleteOneDrugState(false);
    else setemergentDeleteOneDrugState(true);
  }

  //Function for emergent new user state
  function settingEmergentNewAreaState() {
    if (emergentNewAreaState) setemergentNewAreaState(false);
    else setemergentNewAreaState(true);
  }

  //Function for emergent edit area state
  function settingEmergentEditAreaState() {
    if (emergentEditAreaState) setemergentEditAreaState(false);
    else setemergentEditAreaState(true);
  }

  //Function for emergent delete area state
  function settingEmergentDeleteOneAreaState() {
    if (emergentDeleteOneAreaState) setemergentDeleteOneAreaState(false);
    else setemergentDeleteOneAreaState(true);
  }

  //State for user record windows
  const [emergentShowRecordState, setEmergentShowRecordState] = useState(false);

  //State for prescription windows
  const [emergentPrescriptionState, setPrescriptionState] = useState(false);

  //Function for emergent new user state
  function settingEmergentNewUserState() {
    if (emergentNewUserState) setEmergentNewUserState(false);
    else setEmergentNewUserState(true);
  }

  //Function for emergent edit user state
  function settingEmergentEditUserState() {
    if (emergentEditUserState) setEmergentEditUserState(false);
    else setEmergentEditUserState(true);
  }

  //Function for emergent edit logged user state
  function settingEmergentEditOwnUserState() {
    if (emergentEditOwnUserState) setEmergentEditOwnUserState(false);
    else setEmergentEditOwnUserState(true);
  }

  //Function for emergent delete one user state
  function settingEmergentDeleteOneUserState() {
    if (emergentDeleteOneUserState) setEmergentDeleteOneUserState(false);
    else setEmergentDeleteOneUserState(true);
  }

  //Function for emergent new exam xistence state
  function settingEmergentNewExamState() {
    if (emergentNewExamState) setEmergentNewExamState(false);
    else setEmergentNewExamState(true);
  }

  //Function for emergent edit exam xistence state
  function settingEmergentEditExamState() {
    if (emergentEditExamState) setEmergentEditExamState(false);
    else setEmergentEditExamState(true);
  }

  //Function for emergent delete one exam state
  function settingEmergentDeleteOneExamState() {
    if (emergentDeleteOneExamState) setEmergentDeleteOneExamState(false);
    else setEmergentDeleteOneExamState(true);
  }

  //Function for emergent new vaccine xistence state
  function settingEmergentNewVaccineState() {
    if (emergentNewVaccineState) setEmergentNewVaccineState(false);
    else setEmergentNewVaccineState(true);
  }

  //Function for emergent edit vaccine xistence state
  function settingEmergentEditVaccineState() {
    if (emergentEditVaccineState) setEmergentEditVaccineState(false);
    else setEmergentEditVaccineState(true);
  }

  //Function for emergent delete vaccine exam state
  function settingEmergentDeleteOneVaccineState() {
    if (emergentDeleteOneVaccineState) setEmergentDeleteOneVaccineState(false);
    else setEmergentDeleteOneVaccineState(true);
  }

  //Function for emergent show user record state
  function settingEmergentShowRecordState() {
    if (emergentShowRecordState) setEmergentShowRecordState(false);
    else setEmergentShowRecordState(true);
  }

  //Function for emergent prescription state
  function settingEmergentPrescriptionState() {
    if (emergentPrescriptionState) setPrescriptionState(false);
    else setPrescriptionState(true);
  }

  //State for all users
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  //Function to egt all users
  function getAllUsers(token) {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setUsersList(res.data);
            setLoading(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }

  //State for all exams
  const [testsList, setTestsList] = useState([]);

  function getAllTests(token) {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "admin/tests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setTestsList(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      throw console.error(error);
    }
  }

  const [vaccinesList, setVaccinesList] = useState([]);

  function getAllVaccines(token) {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "admin/vaccines", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setVaccinesList(res.data);
            setLoading(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }

  const [areasList, setAreasList] = useState([]);

  function getAllAreas(token) {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "admin/areas", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setAreasList(res.data);
            setLoading(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }

  const [drugsList, setDrugsList] = useState([]);

  function getAllDrugs(token) {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "admin/drugs", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setDrugsList(res.data);
            setLoading(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }

  const [consultationInfo, setConsultationInfo] = useState({
    userCode: null,
    appointmentId: null,
    fullName: "",
    age: null,
    gender: "",
  });

  const values = {
    emergentNewUserState,
    emergentEditUserState,
    emergentEditOwnUserState,
    emergentDeleteOneUserState,
    emergentNewExamState,
    emergentEditExamState,
    emergentDeleteOneExamState,
    emergentNewVaccineState,
    emergentEditVaccineState,
    emergentDeleteOneVaccineState,
    emergentNewAreaState,
    emergentEditAreaState,
    emergentDeleteOneAreaState,
    emergentShowRecordState,
    emergentPrescriptionState,
    emergentNewDrugState,
    emergentEditDrugState,
    emergentDeleteOneDrugState,
    usersList,
    loading,
    testsList,
    vaccinesList,
    areasList,
    drugsList,
    consultationInfo,

    settingEmergentNewUserState,
    settingEmergentEditUserState,
    settingEmergentEditOwnUserState,
    settingEmergentDeleteOneUserState,
    settingEmergentNewExamState,
    settingEmergentEditExamState,
    settingEmergentDeleteOneExamState,
    settingEmergentNewVaccineState,
    settingEmergentEditVaccineState,
    settingEmergentDeleteOneVaccineState,
    settingEmergentNewAreaState,
    settingEmergentEditAreaState,
    settingEmergentDeleteOneAreaState,
    settingEmergentShowRecordState,
    settingEmergentPrescriptionState,
    settingEmergentNewDrugState,
    settingEmergentEditDrugState,
    settingEmergentDeleteOneDrugState,
    getAllUsers,
    getAllTests,
    getAllVaccines,
    getAllAreas,
    getAllDrugs,
    setConsultationInfo,
  };

  return (
    <MenuContext.Provider value={values}>{props.children}</MenuContext.Provider>
  );
};

export default MenuState;
