import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import "./cssFiles/DataTable.css";

import CreateNewDrug from "./EmergentWindows/CreateNewDrug";
import EditDrugExistence from "./EmergentWindows/EditDrugExistence";
import DeleteOneDrugExistence from "./EmergentWindows/DeleteDrugExistence";

export default function DrugsTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);
  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");

  useEffect(() => {
    menuContext.getAllDrugs(token);
  }, []);

  const dt = useRef(null);

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => menuContext.settingEmergentNewDrugState()}
        />
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            setcodevar(rowData.id_drug);
            setnamevar(rowData.active);
            menuContext.settingEmergentEditDrugState();
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setnamevar(rowData.active);
            setcodevar(rowData.id_drug);
            menuContext.settingEmergentDeleteOneDrugState();
          }}
        />
      </>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de medicamentos</h5>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      {/*
       *User creation emergent window
       */}
      {menuContext.emergentNewDrugState && <CreateNewDrug />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditDrugState && (
        <EditDrugExistence code={codevar} active={namevar} />
      )}

      {/*
       *User deletion emergent window
       */}
      {menuContext.emergentDeleteOneDrugState && (
        <DeleteOneDrugExistence code={codevar} name={namevar} />
      )}

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          showGridlines
          lazy={true}
          ref={dt}
          value={menuContext.drugsList}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          totalRecords={menuContext.drugsList.length}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} medicamentos"
          loading={menuContext.loading}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="name"
            header="Nombre"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="drug_lab"
            header="Laboratorio"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="active"
            header="Activo"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="active_percentage"
            header="Porcentaje activo"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
