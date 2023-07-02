import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios';
import MenuContext from '../../contexts/MenuContext/MenuContext';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { useForm, Controller } from 'react-hook-form';

//Components imports
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';

import "../cssFiles/FormDemo.css";


export default function EditVaccineExistence({code,name,doses}) {
    const { emergentEditVaccineState } = useContext(MenuContext);
    const menuContext = useContext(MenuContext);
    const { token } = useContext(UserContext);

    const toast = useRef(null);

    const [display, setDisplay] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const { control, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        try {
            data = {
                id: code,
                name: data.name,
                required_doses: data.required_doses
            }
            axios.put(process.env.REACT_APP_API_URL + 'admin/vaccines/update', data, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 200) {
                        reset();
                        setShowMessage(true);
                        menuContext.getAllVaccines(token);
                    }
                })
                .catch((err) => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.response.data.message,
                        life: 3000,
                        style: { marginLeft: '20%' }
                    });
                });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Algo salió mal',
                life: 3000,
                style: { marginLeft: '20%' }
            });
        }
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => {setShowMessage(false); onHide('display')}} /></div>;


    useEffect(() => {
        setDisplay(emergentEditVaccineState); 
    }, [emergentEditVaccineState]);

    const dialogFuncMap = {
        display: setDisplay,
    };

    const onHide = (name) => {
        menuContext.settingEmergentEditVaccineState();
        dialogFuncMap[`${name}`](false);
    };

    const renderFooter = (name) => {
        return (
            <div>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={() => onHide(name)}
                    className="p-button-text"
                />
                <Button
                    label="Guardar"
                    type='submit'
                    onClick={handleSubmit(onSubmit)}
                    icon="pi pi-check" />
            </div>
        );
    };
    return (
        <div className="flex flex-col">
            <Toast ref={toast} />
            <Dialog
                breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                header="Editar Vacuna"
                visible={display}
                style={{ width: '50vw' }}
                footer={renderFooter('display')}
                onHide={() => onHide('display')}
            >
                <div className="form-demo w-full">
                    <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                        <div className="flex justify-content-center flex-column pt-6 px-3">
                            <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                <b>{name}</b> modificado con éxito.
                            </p>
                        </div>
                    </Dialog>

                    <div className="m-1 w-full flex justify-content-center">

                        <div className="card w-full">

                            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 p-fluid w-full">


                                <div className="field">
                                    <span className="p-float-label">
                                        <Controller defaultValue={name} name="name" control={control}  render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        )} />
                                        <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Nombre</label>
                                    </span>
                                </div>



                                <div className="field">
                                    <span className="p-float-label">
                                        <Controller defaultValue={doses} name="required_doses" control={control} render={({ field, fieldState }) => (
                                            <InputNumber id={field.name} {...field} mode="decimal" onChange={(e) => field.onChange(e.value)} />
                                        )} />
                                        <label htmlFor="required_doses" >Dosis requeridas</label>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </Dialog>
        </div>
    )
}
