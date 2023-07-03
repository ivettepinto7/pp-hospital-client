import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";
import MenuContext from "../contexts/MenuContext/MenuContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";

import CreateNewArea from "./EmergentWindows/CreateNewArea";
import EditAreaExistence from "./EmergentWindows/EditAreaExistence";
import DeleteOneArea from "./EmergentWindows/DeleteAreaExistence";
import { InputText } from "primereact/inputtext";
import "./cssFiles/DataTable.css";

export default function AreasTable() {
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const [codevar, setcodevar] = useState("");
  const [namevar, setnamevar] = useState("");
  const [currentInfo, setCurrentInfo] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dt = useRef(null);

  useEffect(() => {
    menuContext.getAllAreas(token);
  }, []);

  const getCurrentInfo = (rowData) => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + `admin/areas/${rowData.id_area}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setCurrentInfo(res.data);
            setcodevar(rowData.id_area);
            setnamevar(rowData.name);
            menuContext.settingEmergentEditAreaState();
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
          onClick={() => menuContext.settingEmergentNewAreaState()}
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
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            getCurrentInfo(rowData);
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
      {menuContext.emergentNewAreaState && <CreateNewArea />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditAreaState && currentInfo && (
        <EditAreaExistence
          code={codevar}
          name={namevar}
          currentInfo={currentInfo}
        />
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
          ref={dt}
          value={menuContext.areasList}
          loading={menuContext.loading}
          dataKey="id_area"
          header={header}
          responsiveLayout="scroll"
          totalRecords={menuContext.areasList.length}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} áreas"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name"]}
          emptyMessage="Área no encontrada."
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
