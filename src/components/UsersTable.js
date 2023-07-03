import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import "./cssFiles/DataTable.css";

import CreateNewUser from "./EmergentWindows/CreateNewUser";
import EditUser from "./EmergentWindows/EditUser";
import DeleteOneUser from "./EmergentWindows/DeleteOneUser";
import { InputText } from "primereact/inputtext";

export default function UsersTable() {
  const menuContext = useContext(MenuContext);
  const { token, id_person } = useContext(UserContext);

  const dt = useRef(null);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState("");
  const [currentInfo, setCurrentInfo] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    menuContext.getAllUsers(token);
  }, []);

  const getCurrentUserInfo = (rowData) => {
    try {
      axios
        .get(
          process.env.REACT_APP_API_URL + `admin/users/${rowData.id_person}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setCurrentInfo(res.data);
            setId(rowData.id_person);
            setUsername(rowData.username);
            menuContext.settingEmergentEditUserState();
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
          onClick={() => menuContext.settingEmergentNewUserState()}
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
      <div className="space-x-1">
        <Button
          icon="pi pi-pencil"
          tooltip="Editar"
          tooltipOptions={{ position: "bottom" }}
          className="p-button-rounded p-button-success mr-2 p-tooltip-bottom"
          onClick={() => {
            getCurrentUserInfo(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          tooltipOptions={{ position: "bottom" }}
          tooltip="Eliminar"
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setId(rowData.id_person);
            setUsername(rowData.username);
            menuContext.settingEmergentDeleteOneUserState();
          }}
        />
      </div>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de usuarios</h5>
    </div>
  );

  const statusBodyTemplate = (rowData) => {
    if (rowData.status === true) return <span>Activo</span>;
    else return <span className="text-red-700">Inactivo</span>;
  };

  const nameBodyTemplate = (rowData) => {
    return rowData.name + " " + rowData.last_name;
  };

  const genderBodyTemplate = (rowData) => {
    if (rowData.gender === "F") return "Femenino";
    else return "Masculino";
  };

  const filteredPeople = menuContext.usersList.filter((user) => {
    return id_person !== user.id_person;
  });

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
      {menuContext.emergentNewUserState && <CreateNewUser />}

      {/*
       *User edit emergent window
       */}
      {menuContext.emergentEditUserState && currentInfo && (
        <EditUser id={id} username={username} currentInfo={currentInfo} />
      )}

      {/*
       *User deletion emergent window
       */}
      {menuContext.emergentDeleteOneUserState && (
        <DeleteOneUser i={id} u={username} />
      )}

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          showGridlines
          ref={dt}
          value={filteredPeople}
          loading={menuContext.loading}
          dataKey="id_person"
          header={header}
          responsiveLayout="scroll"
          totalRecords={menuContext.usersList.length}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} usuarios"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "username",
          ]}
          emptyMessage="Usuario no encontrado."
        >
          <Column
            field="name"
            header="Nombre"
            body={nameBodyTemplate}
            style={{ minWidth: "10rem" }}
          ></Column>

          <Column
            field="username"
            header="Nombre de usuaario"
            style={{ minWidth: "6rem" }}
          ></Column>

          <Column
            field="gender"
            body={genderBodyTemplate}
            header="Género"
            style={{ minWidth: "4rem" }}
          ></Column>

          <Column
            field="email"
            header="Correo"
            style={{ minWidth: "8rem" }}
          ></Column>

          <Column
            field="id_role.name"
            header="Rol"
            style={{ minWidth: "2rem" }}
          ></Column>

          <Column
            field="status"
            header="Estado"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "1rem" }}
          ></Column>

          <Column
            field="birthdate"
            header="Fecha de nacimiento"
            style={{ minWidth: "8rem" }}
          ></Column>

          <Column
            header="Acciones"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
