import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";

import CreateNewDrug from "./EmergentWindows/CreateNewDrug";
import EditDrugExistence from "./EmergentWindows/EditDrugExistence";
import DeleteOneDrugExistence from "./EmergentWindows/DeleteDrugExistence";
import { InputText } from "primereact/inputtext";
import "./cssFiles/DataTable.css";

export default function DrugsTable() {
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

  useEffect(() => {
    menuContext.getAllDrugs(token);
  }, []);

  const dt = useRef(null);

  const getCurrentInfo = (rowData) => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + `admin/drugs/${rowData.id_drug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setCurrentInfo(res.data);
            setnamevar(rowData.active);
            menuContext.settingEmergentEditDrugState();
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="w-full flex justify-around">
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => menuContext.settingEmergentNewDrugState()}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar"
          />
        </span>
        F
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            setcodevar(rowData.id_drug);
            getCurrentInfo(rowData);
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
      {menuContext.emergentNewDrugState && <CreateNewDrug />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditDrugState && currentInfo && (
        <EditDrugExistence
          code={codevar}
          active={namevar}
          currentInfo={currentInfo}
        />
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
          ref={dt}
          value={menuContext.drugsList}
          loading={menuContext.loading}
          dataKey="id_drug"
          header={header}
          responsiveLayout="scroll"
          totalRecords={menuContext.drugsList.length}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} medicamentos"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name"]}
          emptyMessage="Medicamento no encontrada."
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
