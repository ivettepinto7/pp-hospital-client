import React, { useState, useEffect, useRef, useContext } from "react";

//Components imports
import { DataTable } from "primereact/datatable";
import axios from "axios";
import { Column } from 'primereact/column';
import { UserContext } from "../contexts/UserContext/UserContext";
import './cssFiles/DataTable.css';


export function PrevAppointmentsTable() {
  const { token } = useContext(UserContext);

  const dt = useRef(null);
  const [loading, setLoading] = useState(true);
  const [prevAppointmentsList, setPrevAppointmentsList] = useState([]);

  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_API_URL + "patient/expediente/citas-previas", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.status === 200) {
            setPrevAppointmentsList(res.data);
            setLoading(false);
          }
        }).catch(err => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }, [])
  
  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Citas previas</h5>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="card">
        <DataTable showGridlines ref={dt} value={prevAppointmentsList}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          loading={loading} header={header} responsiveLayout="scroll">
          <Column field="timestamp" header="Fecha de la cita" style={{ minWidth: '12rem' }}></Column>
          <Column field="appointment_details" header="Descripción" style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>
    </div>
  )
}