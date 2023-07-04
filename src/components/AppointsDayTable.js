import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../contexts/MenuContext/MenuContext";
import {
  SetUserContext,
  UserContext,
} from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

//Helpers imports
import { useNavigate } from "react-router-dom";
import UserRecordTable from "./EmergentWindows/UserRecordTable";
import "./cssFiles/DataTable.css";

export default function AppointsDayTable() {
  const menuContext = useContext(MenuContext);
  const { role, token } = useContext(UserContext);
  const { setConsultationInfo } = useContext(SetUserContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "id_patient.username": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const dt = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [dayAppointments, setDayAppointments] = useState([]);
  const [userRecordsList, setUserRecordsList] = useState([]);
  let url = "";

  const getUrl = (role) => {
    switch (role) {
      case 3:
        return (url = "secretary/");
      case 4:
        return (url = "doctor/");
      default:
        return (url = "");
    }
  };

  useEffect(() => {
    getUrl(role);
    try {
      axios
        .get(process.env.REACT_APP_API_URL + url + "appointments/today", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setDayAppointments(res.data);
            setLoading(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const actionBodyTemplate = (rowData) => {
    if (role === 4) {
      return (
        <>
          <Button
            icon="pi pi-book"
            tooltip="Atender"
            disabled={rowData.status === true ? true : false}
            tooltipOptions={{ position: "bottom" }}
            className="p-button-rounded p-button-success mr-2"
            onClick={() => {
              setConsultationInfo({
                userCode: rowData.id_patient,
                appointmentId: rowData.id_appointment,
                fullName:
                  rowData.id_patient.name + " " + rowData.id_patient.last_name,
                age: getAge(rowData.id_patient.birthdate),
                gender: rowData.id_patient.gender,
              });
              getUserRecords(rowData.id_patient.id_person);
              navigate("/landing/citas-dia/consulta");
            }}
          />
        </>
      );
    } else if (role === 3) {
      return (
        <>
          <Button
            icon="pi pi-book"
            tooltip="Expediente"
            tooltipOptions={{ position: "bottom" }}
            className="p-button-rounded p-button-success mr-2"
            onClick={() => {
              getUserRecords(rowData.id_patient.id_person);
              menuContext.settingEmergentShowRecordState();
            }}
          />
        </>
      );
    }
  };

  const getUserRecords = (id) => {
    try {
      getUrl(role);
      axios
        .get(
          process.env.REACT_APP_API_URL +
            url +
            `citas-dia/consulta/expediente/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            setUserRecordsList(res.data);
            setLoading2(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  };

  const header = (
    <div className="table-header flex justify-between">
      <h5 className="mx-0 my-1">Manejo de citas del día</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar por nombre de usuario"
        />
      </span>
    </div>
  );

  const nameBodyTemplate = (rowData) => {
    return `${rowData.id_patient.name} ${rowData.id_patient.last_name} @${rowData.id_patient.username}`;
  };

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const ageBodyTemplate = (rowData) => {
    return getAge(rowData.id_patient.birthdate);
  };

  const genderBodyTemplate = (rowData) => {
    if (rowData.id_patient.gender === "F") return "Femenino";
    else if (rowData.id_patient.gender === "M") return "Masculino";
  };

  const statusBodyTemplate = (rowData) => {
    if (rowData.status === false)
      return <span className="text-red-800">Pendiente</span>;
    else return <span className="text-green-800">Atendido</span>;
  };

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  return (
    <div className="w-full overflow-hidden">
      {menuContext.emergentShowRecordState && (
        <UserRecordTable loading={loading2} userRecordsList={userRecordsList} />
      )}
      <div className="card">
        <DataTable
          showGridlines
          ref={dt}
          value={dayAppointments}
          dataKey="id_appointment"
          paginator
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} usuarios para atender"
          loading={loading}
          header={header}
          responsiveLayout="scroll"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["id_patient.username"]}
          emptyMessage="Sin citas."
        >
          <Column
            field="id_patient.name"
            header="Nombre"
            body={nameBodyTemplate}
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="id_patient.birthdate"
            header="Edad"
            body={ageBodyTemplate}
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="id_patient.gender"
            header="Género"
            body={genderBodyTemplate}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="status"
            header="Estado"
            body={statusBodyTemplate}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            header="Atender/Expediente"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
