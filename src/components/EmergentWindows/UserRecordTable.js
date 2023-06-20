import React, { useState,useEffect, useContext, useRef } from "react";
import axios from "axios";
import MenuContext from "../../contexts/MenuContext/MenuContext";
import { UserContext } from "../../contexts/UserContext/UserContext";

//Components imports
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext"
import { Dialog } from 'primereact/dialog';
import '../cssFiles/DataTable.css';

//Helpers imports
import { UserRecord } from "../../helpers/UserRecord";

export default function UserRecordTable({loading, userRecordsList}) {
  const { role, token, userCode } = useContext(UserContext);
  const { emergentShowRecordState } = useContext(MenuContext);
  const menuContext = useContext(MenuContext);
  
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

  const header = (
    <div className="table-header">
    </div>
  );

  const detailsBodyTemplate = (rowData) => {
    if(rowData.detallesCita === null) return <span className="text-red-800">Sin detalles de cita</span>
    else return rowData.detallesCita;
  }

  return (
    <div className="flex flex-col">
      <Dialog
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        header="Expediente paciente"
        visible={display}
        style={{ width: '50vw' }}
        
        onHide={() => onHide('display')}
      >
        <div className="form-demo w-full">
          

          <div className="m-1 w-full flex justify-content-center">

            <div className="card w-full">
              <div className="w-full overflow-hidden">
                <div className="card">
                  <DataTable showGridlines ref={dt} value={userRecordsList} totalRecords={userRecordsList && userRecordsList.length}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords}"
                    loading={loading} header={header} responsiveLayout="scroll">
                    <Column field="fecha" header="Fecha" style={{ minWidth: '12rem' }}></Column>
                    <Column field="tipo" header="Tipo" style={{ minWidth: '10rem' }}></Column>
                    <Column field="detallesCita" header="Detalles de la cita" body={detailsBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Dialog>
    </div>



  )
}