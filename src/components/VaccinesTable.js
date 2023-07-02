import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import MenuContext from "../contexts/MenuContext/MenuContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import "./cssFiles/DataTable.css";

import DeleteOneVaccine from "./EmergentWindows/DeleteVaccineExistence";

import CreateNewVaccine from "./EmergentWindows/CreateNewVaccine";
import EditVaccineExistence from "./EmergentWindows/EditVaccineExistence";

export default function VaccinesTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");
  const [doses, setdoses] = useState("");

  const dt = useRef(null);

  useEffect(() => {
    menuContext.getAllVaccines(token);
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => menuContext.settingEmergentNewVaccineState()}
        />
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          tooltip="Editar"
          tooltipOptions={{ position: "bottom" }}
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            setcodevar(rowData.id_vaccine);
            setnamevar(rowData.name);
            setdoses(rowData.required_doses);
            menuContext.settingEmergentEditVaccineState();
          }}
        />
        <Button
          icon="pi pi-trash"
          tooltip="Eliminar"
          tooltipOptions={{ position: "bottom" }}
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setnamevar(rowData.name);
            setcodevar(rowData.id_vaccine);
            menuContext.settingEmergentDeleteOneVaccineState();
          }}
        />
      </>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de vacunas</h5>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      {/*
       *User creation emergent window
       */}
      {menuContext.emergentNewVaccineState && <CreateNewVaccine />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditVaccineState && (
        <EditVaccineExistence code={codevar} name={namevar} doses={doses} />
      )}

      {/*
       *User deletion emergent window
       */}
      {menuContext.emergentDeleteOneVaccineState && (
        <DeleteOneVaccine code={codevar} name={namevar} />
      )}

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          showGridlines
          lazy={true}
          ref={dt}
          value={menuContext.vaccinesList}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          totalRecords={menuContext.vaccinesList.length}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} vacunas"
          loading={menuContext.loading}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="name"
            header="Nombre"
            style={{ minWidth: "20rem" }}
          ></Column>
          <Column
            field="required_doses"
            header="Dosis requeridas"
            style={{ minWidth: "20rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
