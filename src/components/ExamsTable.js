import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import './cssFiles/DataTable.css';

import EditExamExistence from "./EmergentWindows/EditExamExistence";
import DeleteOneExam from "./EmergentWindows/DeleteExamExistence";

import CreateNewExam from "./EmergentWindows/CreateNewExam";

export default function ExamsTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);
  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");

  const dt = useRef(null);

  const [loading, setLoading] = useState(false);
  const [testsList, setTestsList] = useState([]);

  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_API_URL + "admin/tests", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.status === 200) {
            setTestsList(res.data);
            setLoading(false);
          }
        }).catch(err => {
          console.error(err);
        });
    } catch (error) {
      throw console.error(error);
    }
  }, [])

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => menuContext.settingEmergentNewExamState()}
        />
      </>
    )
  }


  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          tooltip="Editar"
          tooltipOptions={{ position: 'bottom' }}
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            setcodevar(rowData.id_test);
            setnamevar(rowData.name);
            menuContext.settingEmergentEditExamState();
          }}
        />
        <Button
          icon="pi pi-trash"
          tooltip="Eliminar"
          tooltipOptions={{ position: 'bottom' }}
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setnamevar(rowData.name);
            setcodevar(rowData.id_test);
            menuContext.settingEmergentDeleteOneExamState();
          }}
        />
      </>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de examenes</h5>
    </div>
  );

  const genderBodyTemplate = (rowData) => {
    if (rowData.gender === 'f')
      return 'Femenino';
    else if (rowData.gender === 'm')
      return 'Masculino';
    else
      return 'Indiferente';
  }

  return (
    <div className="w-full overflow-hidden">
      {/*
        *User creation emergent window 
      */}
      {menuContext.emergentNewExamState && <CreateNewExam />}

      {/*
          *User edit emergent window 
        */}
      {menuContext.emergentEditExamState && <EditExamExistence id={codevar} name={namevar} />}

      {/*
          *User deletion emergent window 
        */}
      {menuContext.emergentDeleteOneExamState && <DeleteOneExam id={codevar} name={namevar} />}

      <div className="card">

        <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

        <DataTable loading={loading} showGridlines ref={dt} value={testsList}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} exámenes"
          header={header} responsiveLayout="scroll">
          <Column field="name" header="Nombre" style={{ minWidth: '12rem' }}></Column>
          <Column field="gender" header="Género" body={genderBodyTemplate} style={{ minWidth: '12rem' }}></Column>
          <Column field="start_age" header="Edad inicial" style={{ minWidth: '12rem' }}></Column>
          <Column field="frequency" header="Frecuencia (días)" style={{ minWidth: '8rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>
    </div>
  )
}