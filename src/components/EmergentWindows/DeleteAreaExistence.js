import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import MenuContext from '../../contexts/MenuContext/MenuContext';

//Components imports
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import "../cssFiles/FormDemo.css";

export default function DeleteAreaExistence({code, name}) {
    const { emergentDeleteOneAreaState } = useContext(MenuContext);
    const menuContext = useContext(MenuContext);
    const { token } = useContext(UserContext);

    const toast = useRef(null);

    const [display, setDisplay] = useState(false);

    useEffect(() => {
        setDisplay(emergentDeleteOneAreaState);
    }, [emergentDeleteOneAreaState]);

    const dialogFuncMap = {
        display: setDisplay,
    };

    const onHide = (name) => {
        menuContext.settingEmergentDeleteOneAreaState();
        dialogFuncMap[`${name}`](false);
    };

    const deleteAreaDialogFooter = (
        <>
          <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => onHide("display")} />
          <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={() => deleteArea()} />
        </>
      );
    
      const deleteArea = () => {
        try {
            axios.delete(process.env.REACT_APP_API_URL + `admin/areas/${JSON.stringify(code)}/delete`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    if (res.status === 200) {
                        onHide("display")
                        toast.current.show({
                            severity: 'info',
                            summary: 'Confirmación',
                            detail: res.data.message,
                            life: 3000,
                            style: { marginLeft: '20%' }
                        });
                        menuContext.getAllAreas(token);
                    }
                })
                .catch(err => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Algo salió mal',
                        life: 3000,
                        style: { marginLeft: '20%' }
                    });
                })
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Algo salió mal',
                life: 3000,
                style: { marginLeft: '20%' }
            });
        }
      }
      return (
        <div className="flex flex-col">
            <Toast ref={toast} />
            <Dialog 
                visible={display} style={{ width: '450px' }} 
                header="Confirm" 
                modal 
                footer={deleteAreaDialogFooter} 
                onHide={() => onHide('display')}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    { <span>¿Seguro que desea eliminar el area <b>{name}</b> ?</span>}
                </div>
            </Dialog>
        </div>
    )
    
}