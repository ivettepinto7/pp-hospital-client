import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";
import { FilterMatchMode } from "primereact/api";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import "./cssFiles/DataTable.css";

export default function UserPrescriptionTable() {
  const { token } = useContext(UserContext);

  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState([]);
  const dt = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "id_appointment.id_area.name": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    "id_appointment.id_doctor.username": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    try {
      axios
        .get(
          process.env.REACT_APP_API_URL + "patient/expediente/recetas-medicas",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            setPrescriptionsList(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
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

  const header = (
    <div className="table-header flex justify-between">
      <h5 className="mx-0 my-1">Recetas médicas</h5>
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

  //`Medicamento: de laboratorio , activo: ${rowData.id_drug.active} al ${rowData.id_drug.active_percentage} `
  const drugBodyTemplate = (rowData) => {
    return (
      <span>
        <h1>
          Medicamento: <b>{rowData.id_drug.name}</b>
        </h1>
        <h1>
          Del laboratorio: <b>{rowData.id_drug.drug_lab}</b>
        </h1>
        <h1>
          Activo: <b>{rowData.id_drug.active}</b> al{" "}
          <b>{rowData.id_drug.active_percentage}%</b>
        </h1>
        <br />
        <h1>
          Cantidad: <b>{rowData.quantity}</b>
        </h1>
        <h1>
          Cantidad diaria: <b>{rowData.daily_amount}</b>
        </h1>
        <h1>
          Indicación: <b>{rowData.indication}</b>
        </h1>
      </span>
    );
  };

  const shiftBodyTemplate = (rowData) => {
    return (
      <>{`${rowData.id_appointment.id_area.id_shift.start_hour} - ${rowData.id_appointment.id_area.id_shift.finish_hour}`}</>
    );
  };

  const doctorBodyTemplate = (rowData) => {
    return (
      <>{`${rowData.id_appointment.id_doctor.name} ${rowData.id_appointment.id_doctor.last_name} @${rowData.id_appointment.id_doctor.username}`}</>
    );
  };

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="card">
        <DataTable
          showGridlines
          ref={dt}
          value={prescriptionsList}
          loading={loading}
          dataKey="id_prescription"
          header={header}
          responsiveLayout="scroll"
          totalRecords={prescriptionsList.length}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} recetas médicas"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "id_appointment.id_area.name",
            "id_appointment.id_doctor.username",
          ]}
          emptyMessage="Sin recetas médicas."
        >
          <Column
            field="id_appointment.id_area.name"
            filterField="id_appointment.id_area.name"
            header="Área"
            style={{ minWidth: "4rem" }}
          />
          <Column
            field="id_appointment.id_area.id_shift.start_hour"
            header="Turno"
            body={shiftBodyTemplate}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="id_appointment.id_doctor.name"
            header="Atendido por"
            filterField="id_appointment.id_doctor.username"
            body={doctorBodyTemplate}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="id_appointment.appointment_details"
            header="Detalles"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="id_drug"
            header="Medicamento"
            body={drugBodyTemplate}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
