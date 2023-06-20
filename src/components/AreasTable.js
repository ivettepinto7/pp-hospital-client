import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";
import MenuContext from "../contexts/MenuContext/MenuContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import './cssFiles/DataTable.css';

import CreateNewArea from "./EmergentWindows/CreateNewArea";
import EditAreaExistence from "./EmergentWindows/EditAreaExistence";
import DeleteOneArea from "./EmergentWindows/DeleteAreaExistence";

export default function AreasTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");
  const [loading, setLoading] = useState(true);
  const [areasList, setAreasList] = useState([]);

  const dt = useRef(null);

  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_API_URL + "admin/areas", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.status === 200) {
            setAreasList(res.data);
            setLoading(false);
          }
        }).catch(err => console.error(err));
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
          onClick={() => menuContext.settingEmergentNewAreaState()}
        />
      </>
    )
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            setcodevar(rowData.id_area);
            setnamevar(rowData.name);
            menuContext.settingEmergentEditAreaState();
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setnamevar(rowData.name);
            setcodevar(rowData.id_area);
            menuContext.settingEmergentDeleteOneAreaState();
          }}
        />
      </>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de areas</h5>
    </div>
  );

  const genderBodyTemplate = (rowData) => {
    if(rowData.gender === 'F') return 'Femenino';
    else if(rowData.gender === 'M') return 'Masculino';
    else return 'Indiferente';
  }

  return (
    <div className="w-full overflow-hidden">
      {/*
            *User creation emergent window 
          */}
      <CreateNewArea />

      {/*
              *User edit emergent window 
            */}
      <EditAreaExistence code={codevar} name={namevar} />

      {/*
              *User deletion emergent window 
            */}
      <DeleteOneArea code={codevar} name={namevar} />

      <div className="card">

        <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

        <DataTable showGridlines lazy={true} ref={dt} value={areasList}
          dataKey="id_area" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} totalRecords={areasList.length}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} áreas"
          loading={loading} header={header} responsiveLayout="scroll">

          <Column field="name" header="Nombre" style={{ minWidth: '12rem' }}></Column>
          <Column field="gender" body={genderBodyTemplate} header="Género" style={{ minWidth: '12rem' }}></Column>
          <Column field="start_age" header="Edad de inicio" style={{ minWidth: '12rem' }}></Column>
          <Column field="frequency" header="Frecuencia (días)" style={{ minWidth: '8rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>

        </DataTable>
      </div>
    </div>
  )
}