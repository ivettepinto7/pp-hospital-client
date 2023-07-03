import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import MenuContext from "../contexts/MenuContext/MenuContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";

import DeleteOneVaccine from "./EmergentWindows/DeleteVaccineExistence";

import CreateNewVaccine from "./EmergentWindows/CreateNewVaccine";
import EditVaccineExistence from "./EmergentWindows/EditVaccineExistence";
import { InputText } from "primereact/inputtext";
import "./cssFiles/DataTable.css";

export default function VaccinesTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");
  const [doses, setdoses] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dt = useRef(null);

  useEffect(() => {
    menuContext.getAllVaccines(token);
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <div className="w-full flex justify-around">
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => menuContext.settingEmergentNewVaccineState()}
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
          ref={dt}
          value={menuContext.vaccinesList}
          loading={menuContext.loading}
          dataKey="id_vaccine"
          header={header}
          responsiveLayout="scroll"
          totalRecords={menuContext.vaccinesList.length}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} vacunas"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name"]}
          emptyMessage="Vacuna no encontrada."
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
