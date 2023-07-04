import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./cssFiles/DataTable.css";
import { Button } from "primereact/button";

export default function InmunizationsTable() {
  const { token } = useContext(UserContext);

  const dt = useRef(null);
  const [loading, setLoading] = useState(true);
  const [inmunizationsList, setInmunizationsList] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(
          process.env.REACT_APP_API_URL + "patient/expediente/inmunizaciones",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            setInmunizationsList(res.data);
          }
          setLoading(false);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      setLoading(false);
      throw console.error(error);
    }
  }, []);

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Vacunas aplicados</h5>
    </div>
  );

  function getAge(dateString, timestamp) {
    var t = new Date(timestamp);
    let birthDate = new Date(dateString);
    let age = t.getFullYear() - birthDate.getFullYear();
    let m = t.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  const ageBodyTemplate = (rowData) => {
    return getAge(rowData.id_patient.birthdate, rowData.timestamp);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="card">
        <DataTable
          showGridlines
          ref={dt}
          value={inmunizationsList || []}
          dataKey="id_inmunization"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          totalRecords={inmunizationsList.length}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} inmunizaciones"
          header={header}
          responsiveLayout="scroll"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          emptyMessage="Sin inmunizaciones."
        >
          <Column
            field="id_vaccine.name"
            header="Nombre de vacuna"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="id_patient.birthdate"
            header="Edad de aplicación"
            body={ageBodyTemplate}
            loading={loading}
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="timestamp"
            header="fecha"
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
