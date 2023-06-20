import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import MenuContext from '../../contexts/MenuContext/MenuContext';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { useForm, Controller } from 'react-hook-form';

//Components imports
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';

import "../cssFiles/FormDemo.css";

//Icons imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export default function EditOwnUser() {
    const { emergentEditOwnUserState } = useContext(MenuContext);
    const menuContext = useContext(MenuContext);
    const userContext = useContext(UserContext);
    const { role, token } = userContext.getUserStorage();
    const toast = useRef(null);

    const [display, setDisplay] = useState(false);

    const [loading, setLoading] = useState(false);
    const [newPass, setNewPass] = useState(false);
    let url = "";

    const getUrl = (role) => {
        switch (role) {
            case 1:
                return url = "admin/my-info/updatepassword";
            case 2:
                return url = "patient/my-info/updatepassword";
            case 3:
                return url = "secretary/my-info/updatepassword";
            case 4:
                return url = "doctor/my-info/updatepassword";
            default:
                return url = "";
        }
    }
    useEffect(() => {
        setDisplay(emergentEditOwnUserState);
    }, [emergentEditOwnUserState]);

    const defaultValues = {
        current_password: '',
        new_password: '',
        confirm_password: ''
    }

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = (data) => {
        try {
            setLoading(true);
            getUrl(role);
            axios.put(process.env.REACT_APP_API_URL + url, data, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        reset();
                        toast.current.show({
                            severity: 'info',
                            summary: 'Confirmación',
                            detail: res.data.message,
                            life: 3000,
                            style: { marginLeft: '20%' }
                        });
                        setTimeout(() => { onHide() }, 3000);
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: res.data.message,
                            life: 3000,
                            style: { marginLeft: '20%' }
                        });
                    }
                })
                .catch(err => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Contraseña actual incorrecta o las contraseñas nuevas no coinciden.',
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
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const passwordHeader = <h6>Escribe una contraseña</h6>;
    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Sugerencias</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>Al menos una minuscula</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Minimo 4 caracteres</li>
            </ul>
        </>
    );

    /**
* Upload Edit Own User Emergent logic section code
*/
    const dialogFuncMap = {
        display: setDisplay,
    };

    const onHide = (name) => {
        menuContext.settingEmergentEditOwnUserState();
        dialogFuncMap[`${name}`](false);
    };

    return (
        <div className="flex flex-col">
            <Dialog
                breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                header="Editar perfil"
                visible={display}
                style={{ width: '70vw' }}
                onHide={() => onHide('display')}
            >
                <div className="form-demo w-full">
                    <Toast ref={toast} />
                    <div className="m-1 w-full flex justify-center animate">
                        <div className="flex justify-center items-center">
                            <div>
                                <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: '5rem', color: 'var(--green-500)' }} />
                            </div>
                            <div className='text-left ml-4'>
                                <h1 className='lg:text-2xl'><b>Nombre: </b>{userContext.name}</h1>
                                <h1 className='lg:text-2xl'><b>Apellido: </b>{userContext.last_name}</h1>
                                <h1 className='lg:text-2xl'><b>Correo electrónico: </b>{userContext.email}</h1>
                                <p className='text-blue-800 cursor-pointer underline' onClick={() => setNewPass(!newPass)}><b>Cambiar contraseña</b></p>
                            </div>
                        </div>
                    </div>
                    <div className='card w-full animate'>
                        {
                            newPass && newPass === true
                                ?
                                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 p-fluid w-full">
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Controller name="current_password" control={control} rules={{ required: 'La contraseña actual es requerida.' }} render={({ field, fieldState }) => (
                                                <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} />
                                            )} />
                                            <label htmlFor="current_password" className={classNames({ 'p-error': errors.current_password })}>Contraseña actual*</label>
                                        </span>
                                        {getFormErrorMessage('current_password')}
                                    </div>

                                    <div className="field">
                                        <span className="p-float-label">
                                            <Controller name="new_password" control={control} rules={{ required: 'La contraseña es requerida.' }} render={({ field, fieldState }) => (
                                                <Password autoComplete='off' id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                            )} />
                                            <label htmlFor="new_password" className={classNames({ 'p-error': errors.new_password })}>Nueva contraseña*</label>
                                        </span>
                                        {getFormErrorMessage('new_password')}
                                    </div>

                                    <br />

                                    <div className="field m-3">
                                        <span className="p-float-label">
                                            <Controller name="confirm_password" control={control} rules={{ required: 'La nueva contraseña es requerida.' }} render={({ field, fieldState }) => (
                                                <Password autoComplete='off' id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} />
                                            )} />
                                            <label htmlFor="confirm_password" className={classNames({ 'p-error': errors.confirm_password })}>Repetir contraseña*</label>
                                        </span>
                                        {getFormErrorMessage('confirm_password')}
                                    </div>

                                    <div className='col-span-2 flex justify-center mt-5'>
                                        {
                                            loading && loading === true ?
                                                <i className="pi pi-spinner text-white animate-spin"></i>
                                                :
                                                <button
                                                    type="submit"
                                                    className="w-1/2 flex justify-center text-white p-2 rounded-full tracking-wide font-bold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg bg-blue-800 cursor-pointer transition ease-in duration-300"

                                                >
                                                    Actualizar
                                                </button>
                                        }
                                    </div>
                                </form>
                                :
                                ""
                        }
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
