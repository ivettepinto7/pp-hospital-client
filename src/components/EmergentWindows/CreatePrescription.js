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
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';

import "../cssFiles/FormDemo.css";

export default function CreatePrescription() {
    const { token } = useContext(UserContext);
    
    const { emergentPrescriptionState } = useContext(MenuContext);
    const menuContext = useContext(MenuContext);

    const toast = useRef(null);

    const [display, setDisplay] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const defaultValues = {
        name: '',
        daily_amount: null,
        total_amount: null,
        indication: '',
    }

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    const onSubmit = (data) => {
        setFormData(data);
        setShowMessage(true);

        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;


    useEffect(() => {
        setDisplay(emergentPrescriptionState);
    }, [emergentPrescriptionState]);

    const dialogFuncMap = {
        display: setDisplay,
    };

    const onHide = (name) => {
        menuContext.settingEmergentPrescriptionState();
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
                    label="Crear"
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
                header="Crear receta"
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
                                <b>{formData.name}</b> registrado con éxito.
                            </p>
                        </div>
                    </Dialog>

                    <div className="m-1 w-full flex justify-content-center">

                        <div className="card w-full">

                            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 p-fluid w-full">


                                <div className="field">
                                    <span className="p-float-label">
                                        <Controller name="name" control={control} rules={{ required: 'El nombre es requerido' }} render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        )} />
                                        <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Nombre*</label>
                                    </span>
                                    {getFormErrorMessage('name')}
                                </div>


                                <div className="field">
                                    <span className="p-float-label">
                                        <Controller name="daily_amount" control={control} rules={{ required: 'La cantidad diaria es requerido' }} render={({ field, fieldState }) => (
                                            <InputNumber id={field.name} {...field} mode="decimal" className={classNames({ 'p-invalid': fieldState.invalid })} onChange={(e) => field.onChange(e.value)} />
                                        )} />
                                        <label htmlFor="daily_amount" className={classNames({ 'p-error': errors.name })}>Cantidad diaria*</label>
                                    </span>
                                    {getFormErrorMessage('daily_amount')}
                                </div>

                                <div className="field">
                                    <span className="p-float-label">
                                        <Controller name="total_amount" control={control}  rules={{ required: 'La cantidad total es requerido' }} render={({ field, fieldState }) => (
                                            <InputNumber id={field.name} {...field} mode="decimal" className={classNames({ 'p-invalid': fieldState.invalid })} onChange={(e) => field.onChange(e.value)} />
                                        )} />
                                        <label htmlFor="total_amount" className={classNames({ 'p-error': errors.name })}>Cantidad*</label>
                                    </span>
                                    {getFormErrorMessage('total_amount')}
                                </div>
                                <div className="field">
                                    <span className="p-float-label">
                                        <Controller name="indication" control={control} rules={{ required: 'La indicación es requerida' }} render={({ field, fieldState }) => (
                                            <InputTextarea id={field.name} {...field} autoResize className={classNames({ 'p-invalid': fieldState.invalid })} onChange={(e) => field.onChange(e.target.value)} rows={1} cols={1} />
                                        )} />
                                        <label htmlFor="indication" className={classNames({ 'p-error': errors.name })}>Indicación*</label>
                                    </span>
                                    {getFormErrorMessage('indication')}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </Dialog>
        </div>
    )
}
