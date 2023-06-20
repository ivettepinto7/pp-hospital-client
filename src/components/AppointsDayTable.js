import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "./cssFiles/DataTable.css";

//Helpers imports
import { useNavigate } from "react-router-dom";
import UserRecordTable from "./EmergentWindows/UserRecordTable";

export default function AppointsDayTable() {
  const menuContext = useContext(MenuContext);
  const {
    role,
    token,
    settingFullname,
    settingAge,
    settingGender,
    settingIdAppointment,
    settingUserCode,
  } = useContext(UserContext);
  const navigate = useNavigate();

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

  const actionBodyTemplate = (rowData) => {
    if (role === 4) {
      return (
        <>
          <Button
            icon="pi pi-book"
            tooltip="Atender"
            tooltipOptions={{ position: "bottom" }}
            className="p-button-rounded p-button-success mr-2"
            onClick={() => {
              settingUserCode(rowData.id_patient.id_person);
              settingIdAppointment(rowData.id_appointment);
              settingFullname(
                rowData.id_patient.name,
                rowData.id_patient.last_name
              );
              settingAge(getAge(rowData.id_patient.birthdate));
              settingGender(rowData.id_patient.gender);
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
    <div className="table-header">
      <h5 className="mx-0 my-1">Manejo de citas</h5>
    </div>
  );

  const nameBodyTemplate = (rowData) => {
    return rowData.id_patient.name + " " + rowData.id_patient.last_name;
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

  return (
    <div className="w-full overflow-hidden">
      <UserRecordTable loading={loading2} userRecordsList={userRecordsList} />
      <div className="card">
        <DataTable
          showGridlines
          ref={dt}
          value={dayAppointments}
          dataKey="id_appointment"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} usuarios para atender"
          loading={loading}
          header={header}
          responsiveLayout="scroll"
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
