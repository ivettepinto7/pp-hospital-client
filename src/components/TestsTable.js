import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import './cssFiles/DataTable.css';


export default function TestsTable() {
  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState([]);
  const [doneTestsList, setDoneTestsList] = useState([]);
  const dt = useRef(null);

  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_API_URL + "patient/expediente/examenes-realizados", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.status === 200) {
            setDoneTestsList(res.data);
            setLoading(false);
          }
        }).catch(err => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  })
  