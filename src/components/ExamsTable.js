import React, { useState, useEffect, useContext, useRef } from "react";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";

import EditExamExistence from "./EmergentWindows/EditExamExistence";
import DeleteOneExam from "./EmergentWindows/DeleteExamExistence";

import CreateNewExam from "./EmergentWindows/CreateNewExam";
import axios from "axios";
import "./cssFiles/DataTable.css";
import { InputText } from "primereact/inputtext";

export default function ExamsTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);
  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");
  const [currentInfo, setCurrentInfo] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dt = useRef(null);

  useEffect(() => {
    menuContext.getAllTests(token);
  }, []);

  const getCurrentInfo = (rowData) => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + `admin/tests/${rowData.id_test}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("data actual ", res.data);
            setCurrentInfo(res.data);
            setcodevar(rowData.id_test);
            setnamevar(rowData.name);
            menuContext.settingEmergentEditExamState();
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="w-full flex justify-around">
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => menuContext.settingEmergentNewExamState()}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar"
          />
        </span>
      </div>
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
            getCurrentInfo(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          tooltip="Eliminar"
          tooltipOptions={{ position: "bottom" }}
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setnamevar(rowData.name);
            setcodevar(rowData.id_test);
            menuContext.settingEmergentDeleteOneExamState();
          }}
        />
      </>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de examenes</h5>
    </div>
  );

  const genderBodyTemplate = (rowData) => {
    if (rowData.gender.toUpperCase() === "F") return "Femenino";
    else if (rowData.gender.toUpperCase() === "M") return "Masculino";
    else return "Indiferente";
  };

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  return (
    <div className="w-full overflow-hidden">
      {/*
       *User creation emergent window
       */}
      {menuContext.emergentNewExamState && <CreateNewExam />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditExamState && currentInfo && (
        <EditExamExistence
          id={codevar}
          name={namevar}
          currentInfo={currentInfo}
        />
      )}

      {/*
       *User deletion emergent window
       */}
      {menuContext.emergentDeleteOneExamState && (
        <DeleteOneExam id={codevar} name={namevar} />
      )}

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          showGridlines
          ref={dt}
          value={menuContext.testsList}
          loading={menuContext.loading}
          dataKey="id_test"
          header={header}
          responsiveLayout="scroll"
          totalRecords={menuContext.testsList.length}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} exámenes"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name"]}
          emptyMessage="Sin examenes."
        >
          <Column
            field="name"
            header="Nombre"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="gender"
            header="Género"
            body={genderBodyTemplate}
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="start_age"
            header="Edad inicial"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="frequency"
            header="Frecuencia (días)"
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
