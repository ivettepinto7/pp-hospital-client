import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import './cssFiles/DataTable.css';


export default function InmunizationsTable() {
  const { token } = useContext(UserContext);

  const dt = useRef(null);
  const [loading, setLoading] = useState(true);
  const [inmunizationsList, setInmunizationsList] = useState([]);

  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_API_URL + "patient/expediente/inmunizaciones", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.status === 200) {
            setInmunizationsList(res.data);
            setLoading(false);
          }
        }).catch(err => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  })