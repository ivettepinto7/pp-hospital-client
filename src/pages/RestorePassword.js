import React, { lazy, useState, useRef } from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


//Components imports
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils';

//Helpers imports
import logo from '../logo.png';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';

const LeftLoginSection = lazy(() => import('../components/LeftLoginSection'));


export default function RestorePassword() {
    const navigate = useNavigate();
    const toast = useRef(null);
    let { p } = useParams();
    
    const [loading, setLoading] = useState(false);

    const defaultValues = {
        id: p,
        new_password: '',
        confirm_password: ''
    }

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = (data) => {
        setLoading(true);
        try {
            axios.post(process.env.REACT_APP_API_URL + "auth/restore-password", data)
            .then((res) => {
                if(res.status === 200){
                    setLoading(false);
                    reset();
                    toast.current.show({
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: res.data.message,
                        life: 3000,
                        style: { marginLeft: '20%' }
                    });
                    setTimeout(() => { navigate("/") }, 3000);
                }
            })
            .catch(err => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Verifique los datos ingresados',
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

    return (
        <div>
            <div className="relative min-h-screen  grid bg-black ">
                <Toast ref={toast} />
                <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 ">
                    <LeftLoginSection />
                    <div
                        className="md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none "
                    >
                        <div className="max-w-xl w-full space-y-12">
                            <div className="lg:text-left text-center">
                                <h2 className="font-bold text-gray-100">
                                    <img src={logo} alt='logo' style={{ height: '10vmin' }} />
                                </h2>
                                <h2 className="mt-2 text-6xl font-bold text-gray-100">
                                    Restablecer contraseña
                                </h2>
                            </div>
                            <div className="flex flex-row justify-center items-center space-x-2"></div>

                            <div className="m-1 w-full flex justify-content-center">
                                <div className="card w-full"></div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col block justify-center items-center p-5 w-full h-3/4 rounded-md shadow-md">
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Controller name="new_password" control={control} rules={{ required: 'La contraseña es requerida.' }} render={({ field, fieldState }) => (
                                                <Password autoFocus autoComplete='off' id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
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

                                    {
                                        loading && loading === true ?
                                        <i className="pi pi-spinner text-white animate-spin"></i>
                                        :
                                        <button type="submit" className="lg:w-1/2 w-full flex justify-center text-white p-2 rounded-full tracking-wide font-bold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg bg-blue-800 cursor-pointer transition ease-in duration-300">Restablecer</button>

                                    }
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
