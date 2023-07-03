import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../../contexts/MenuContext/MenuContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";

import "../cssFiles/DataTable.css";

export default function UserRecordTable({ loading, userRecordsList }) {
  const { emergentShowRecordState } = useContext(MenuContext);
  const menuContext = useContext(MenuContext);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dt = useRef(null);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(emergentShowRecordState);
  }, [emergentShowRecordState]);

  const dialogFuncMap = {
    display: setDisplay,
  };

  const onHide = (name) => {
    menuContext.settingEmergentShowRecordState();
    dialogFuncMap[`${name}`](false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const header = (
    <div className="table-header flex justify-between">
      <h5 className="mx-0 my-1">Expediente</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar por área o doctor"
        />
      </span>
    </div>
  );

  const detailsBodyTemplate = (rowData) => {
    if (rowData.detallesCita === null)
      return <span className="text-red-800">Sin detalles de cita</span>;
    else return rowData.detallesCita;
  };

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  return (
    <div className="flex flex-col">
      <Dialog
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        header="Expediente paciente"
        visible={display}
        style={{ width: "50vw" }}
        onHide={() => onHide("display")}
      >
        <div className="form-demo w-full">
          <div className="m-1 w-full flex justify-content-center">
            <div className="card w-full">
              <div className="w-full overflow-hidden">
                <div className="card">
                  <DataTable
                    header={header}
                    showGridlines
                    ref={dt}
                    value={userRecordsList}
                    totalRecords={userRecordsList && userRecordsList.length}
                    dataKey="id"
                    paginator
                    paginatorLeft={paginatorLeft}
                    paginatorRight={paginatorRight}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords}"
                    loading={loading}
                    responsiveLayout="scroll"
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={[
                      "tipo",
                    ]}
                    emptyMessage="Sin expediente."
                  >
                    <Column
                      field="fecha"
                      header="Fecha"
                      style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                      field="tipo"
                      header="Tipo"
                      style={{ minWidth: "10rem" }}
                    ></Column>
                    <Column
                      field="detallesCita"
                      header="Detalles de la cita"
                      body={detailsBodyTemplate}
                      style={{ minWidth: "12rem" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
