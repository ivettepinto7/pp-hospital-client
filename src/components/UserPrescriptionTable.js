import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import './cssFiles/DataTable.css';

export default function UserPrescriptionTable() {
  const { token } = useContext(UserContext);

  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState([]);
  const dt = useRef(null);

  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_API_URL + "patient/expediente/recetas-medicas", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.status === 200) {
            setPrescriptionsList(res.data);
            setLoading(false);
          }
        }).catch(err => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  })
  
  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Recetas médicas</h5>
    </div>
  );

  //`Medicamento: de laboratorio , activo: ${rowData.id_drug.active} al ${rowData.id_drug.active_percentage} `
  const drugBodyTemplate = (rowData) => {
    return <span>
      <h1>Medicamento: <b>{rowData.id_drug.name}</b></h1>
      <h1>Del laboratorio: <b>{rowData.id_drug.drug_lab}</b></h1>
      <h1>Activo: <b>{rowData.id_drug.active}</b> al <b>{rowData.id_drug.active_percentage}%</b></h1>
    </span>
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="card">
        <DataTable showGridlines lazy={true} ref={dt} value={prescriptionsList}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} totalRecords={prescriptionsList.length}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          loading={loading} currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} recetas médicas"
          header={header} responsiveLayout="scroll">
          <Column field="indication" header="Indicación" style={{ minWidth: '12rem' }}></Column>
          <Column field="daily_amount" header="Cantidad diaria" style={{ minWidth: '12rem' }}></Column>
          <Column field="quantity" header="Cantidad" style={{ minWidth: '10rem' }}></Column>
          <Column field="id_drug" header="Medicamento" body={drugBodyTemplate} style={{ minWidth: '10rem' }}></Column>
        </DataTable>
      </div>
    </div>
  )
}