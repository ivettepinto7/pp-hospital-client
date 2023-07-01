import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";
import MenuContext from "../contexts/MenuContext/MenuContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import "./cssFiles/DataTable.css";

import CreateNewArea from "./EmergentWindows/CreateNewArea";
import EditAreaExistence from "./EmergentWindows/EditAreaExistence";
import DeleteOneArea from "./EmergentWindows/DeleteAreaExistence";

export default function AreasTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");

  const dt = useRef(null);

  useEffect(() => {
    menuContext.getAllAreas(token);
  }, []);

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
    );
  };

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
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de areas</h5>
    </div>
  );

  const shiftBodyTemplate = (rowData) => {
    return `${rowData.id_shift.start_hour} - ${rowData.id_shift.finish_hour}`;
  };

  return (
    <div className="w-full overflow-hidden">
      {/*
       *User creation emergent window
       */}
      {menuContext.emergentNewAreaState && <CreateNewArea />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditAreaState && (
        <EditAreaExistence code={codevar} name={namevar} />
      )}

      {/*
       *User deletion emergent window
       */}
      {menuContext.emergentDeleteOneAreaState && (
        <DeleteOneArea code={codevar} name={namevar} />
      )}

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          showGridlines
          lazy={true}
          ref={dt}
          value={menuContext.areasList}
          dataKey="id_area"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          totalRecords={menuContext.areasList.length}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} áreas"
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
            field="id_shift"
            body={shiftBodyTemplate}
            header="Turno"
            style={{ minWidth: "12rem" }}
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
