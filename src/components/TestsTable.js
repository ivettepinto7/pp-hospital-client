import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./cssFiles/DataTable.css";
import { Button } from "primereact/button";

export default function TestsTable() {
  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [doneTestsList, setDoneTestsList] = useState([]);
  const dt = useRef(null);

  useEffect(() => {
    try {
      axios
        .get(
          process.env.REACT_APP_API_URL +
            "patient/expediente/examenes-realizados",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            setDoneTestsList(res.data);
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
      <h5 className="mx-0 my-1">Examenes realizados</h5>
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
      <div className="card">
        <DataTable
          showGridlines
          ref={dt}
          value={doneTestsList}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} exámenes"
          header={header}
          responsiveLayout="scroll"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          emptyMessage="Sin examenes."
        >
          <Column
            field="id_test.name"
            header="Nombre del examen"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="timestamp"
            header="Fecha de toma"
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
