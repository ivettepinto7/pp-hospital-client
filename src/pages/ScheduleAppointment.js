import React, { useEffect, useContext, useState, useCallback } from 'react'
import axios from 'axios';
import { UserContext } from '../contexts/UserContext/UserContext';
import { useForm } from 'react-hook-form';

//Components imports
import { RadioButton } from 'primereact/radiobutton';

//Helpers imports

//Components imports
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { InputText } from 'primereact/inputtext';


export default function ScheduleAppointment() {
    const { token, role, name, last_name } = useContext(UserContext);
    const appointmentsTypes = [{ name: 'Inmunización', code: 1 }, { name: 'Consulta médica', code: 2 }, { name: 'Examen', code: 3 }];
    const [selectedAppointmentType, setSelectedAppointmentType] = useState(appointmentsTypes[1]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const today = new Date();
    var dateAppointment = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [vaccinesList, setVaccinesList] = useState([]);
    const [shiftsList, setShiftsList] = useState([]);
    const [areasList, setAreasList] = useState([]);
    const [testsList, setTestsList] = useState([]);
    let idVATAppointment = null;

    const getUrl = useCallback(
      (role) => {
        switch (role) {
            case 2:
                return "patient/";
            case 3:
                return "secretary/";
            default:
                return "";
        }
      },
      [],
    );

    useEffect(() => {
        try {
            axios.get(process.env.REACT_APP_API_URL + getUrl(role) + "vaccines", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 200) {
                        return setVaccinesList(res.data);
                    }
                })
                .catch(err => console.error(err));

            axios.get(process.env.REACT_APP_API_URL + getUrl(role) + "areas", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 200) {
                        return setAreasList(res.data);
                    }
                })
                .catch(err => console.error(err));

            axios.get(process.env.REACT_APP_API_URL + getUrl(role) + "tests", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 200) {
                        return setTestsList(res.data);
                    }
                })
                .catch(err => console.error(err));

            axios.get(process.env.REACT_APP_API_URL + getUrl(role) + "shifts", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 200) {
                        return setShiftsList(res.data);
                    }
                })
                .catch(err => console.error(err));
        } catch (error) {
            throw console.error(error);
        }
    }, [getUrl, role, token]);

    const { control, formState: { errors }, handleSubmit, reset, watch } = useForm();
    const inmunization = watch('inmunization', false);
    const test = watch('test', false);
    const area = watch('area', false);
    const appointdate = watch('appointdate', false);
    const shft = watch('shift', false);

    const getIdVAT = () => {
        if (selectedAppointmentType.code === 1 && inmunization !== null) return idVATAppointment = inmunization.id_vaccine;
        else if (selectedAppointmentType.code === 3 && test !== null) return idVATAppointment = test.id_test;
        else if (selectedAppointmentType.code === 2 && area !== null) return idVATAppointment = area.id_area;
    }


    const onSubmit = (data) => {
        try {
            getUrl(role);
            getIdVAT();
            setFormData(data);
            var dd = appointdate.getDate();
            var mm = appointdate.getMonth() + 1;
            var yyyy = appointdate.getFullYear();

            if (dd < 10) {
                dd = "0" + dd;
            }

            if (mm < 10) {
                mm = "0" + mm;
            }

            dateAppointment = yyyy + "-" + mm + "-" + dd + " " + shft;

            if (role === 3) {
                data = {
                    username: data.username,
                    type: selectedAppointmentType.code,
                    idVAT: idVATAppointment,
                    date: dateAppointment.toString(),
                };
            } else {
                data = {
                    type: selectedAppointmentType.code,
                    idVAT: idVATAppointment,
                    date: dateAppointment.toString(),
                };
            }
            axios.post(process.env.REACT_APP_API_URL + getUrl(role) + "schedule-appointment", data, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    if (res.status === 201) {
                        setShowMessage(true);
                        reset();
                    }
                })
                .catch(err => {
                    setError(true);
                    setErrorMessage(err.response.data.message);
                    setShowMessage(true);
                });
        } catch (error) {
            throw console.error(error);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;

    return (
        <div className="flex w-full h-full bg-black text-white">
            {
                ((role === 2 || role === 3) && (error === false)) ?
                    <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '50vw' }}>
                        <div className="flex justify-content-center flex-column pt-6 px-3">
                            <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                            <h1 style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                Cita agendada con éxito.
                                <p>
                                    <b>Tipo: </b>{selectedAppointmentType.name}
                                </p>
                                <p>
                                    <b>Paciente: </b>{
                                        role === 2 ? name + ' ' + last_name
                                            : role === 3 ?
                                                formData.username
                                                : ''
                                    }
                                </p>
                                {
                                    selectedAppointmentType && selectedAppointmentType.code === 1 ?
                                        <p>
                                            <b>Vacuna: </b>{formData.inmunization && formData.inmunization.name}
                                        </p>
                                        :
                                        selectedAppointmentType.code === 2 ?
                                            <p>
                                                <b>Área: </b>{formData.area && formData.area.name}
                                            </p>
                                            : selectedAppointmentType.code === 3 ?
                                                <p>
                                                    <b>Examen: </b>{formData.test && formData.test.name}
                                                </p>
                                                :
                                                ""
                                }
                                <p>
                                    <b>Dia: </b>{formData.appointdate && formData.appointdate.toLocaleDateString()}
                                </p>
                                <p>
                                    <b>Turno: </b>{formData.shift}
                                </p>
                            </h1>
                        </div>
                    </Dialog>
                    :
                    <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '50vw' }}>
                        <div className="flex justify-content-center flex-column pt-6 px-3">
                            <i className="pi pi-exclamation-circle" style={{ fontSize: '5rem', color: 'red' }}></i>
                            <h1 style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                {errorMessage}
                            </h1>
                        </div>
                    </Dialog>
            }



            <div className="flex justify-center lg:mt-auto lg:items-center w-full h-screen">
                <div className='lg:w-2/3 w-full lg:border-2 lg:rounded-lg lg:py-4' style={{ backgroundColor: 'black' }}>
                    <div className='flex items-center justify-center'>
                        <FontAwesomeIcon style={{ color: '#1D4078', fontSize: '2rem' }} icon={faCalendarPlus} />
                        <h1 className='lg:text-3xl mx-3 my-3 text-center'>Agendar una cita para:</h1>
                    </div>
                    <div className='flex justify-center sm:text-xs md:text-xs'>
                        <div className='lg:flex justify-center rounded-lg' style={{ backgroundColor: '#1D4078' }}>
                            {
                                appointmentsTypes.map((appointment) => {
                                    return (
                                        <div key={appointment.code}>
                                            <div key={appointment.code} className="field-radiobutton lg:h-20 sm:h-10 md:h-10 xsm:h-10 text-white lg:text-xl flex mx-2 space-between items-center justify-center sm:text-xs md:text-xs">
                                                <RadioButton className="my-auto" inputId={appointment.code} name="appointment" value={appointment} onChange={(e) => setSelectedAppointmentType(e.value)} checked={selectedAppointmentType.code === appointment.code} />
                                                <label key={appointment.code} className='my-auto text-center lg:text-xl md:text-xs sm:text-xs xsm:text-xs cursor-pointer items-center px-2' htmlFor={appointment.code}>{appointment.name}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className='flex text-sm justify-center items-center'>
                        <form onSubmit={handleSubmit(onSubmit)} className="lg:w-1/2 text-xs pt-10 lg:grid grid-cols-2 flex-col justify-center items-center rounded-md shadow-md">
                            {
                                role === 3 ?
                                    <div className="field mt-6">
                                        <span className="p-float-label">
                                            <Controller defaultValue={""} name="username" control={control} rules={{ required: 'El nombre de usuario es requerido' }} render={({ field, fieldState }) => (
                                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                            )} />
                                            <label htmlFor="name" className={classNames({ 'p-error': errors.username })}>Nombre de usuario*</label>
                                        </span>
                                        {getFormErrorMessage('username')}
                                    </div>
                                    :
                                    ""
                            }
                            {
                                selectedAppointmentType && selectedAppointmentType.code === 1 ?
                                    <div className="field mt-6">
                                        <span className="p-float-label">
                                            <Controller defaultValue={null} name="inmunization" control={control} rules={{ required: 'La vacuna es requerida.' }} render={({ field }) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={vaccinesList} optionLabel='name' />
                                            )} />
                                            <label htmlFor="inmunization" className={classNames({ 'p-error': errors.inmunization })}>Vacuna*</label>
                                        </span>
                                        {getFormErrorMessage('inmunization')}
                                    </div>
                                    :
                                    ""
                            }

                            {
                                selectedAppointmentType && selectedAppointmentType.code === 3 ?
                                    <div className="field mt-6">
                                        <span className="p-float-label">
                                            <Controller defaultValue={null} name="test" control={control} rules={{ required: 'El examen es requerido.' }} render={({ field }) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={testsList} optionLabel='name' />
                                            )} />
                                            <label htmlFor="test" className={classNames({ 'p-error': errors.test })}>Examen*</label>
                                        </span>
                                        {getFormErrorMessage('test')}
                                    </div>
                                    :
                                    ""
                            }

                            {
                                selectedAppointmentType && selectedAppointmentType.code === 2 ?
                                    <div className="field mt-8">
                                        <span className="p-float-label">
                                            <Controller defaultValue={null} name="area" control={control} rules={{ required: 'El área es requerido.' }} render={({ field }) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={areasList} optionLabel='name' />
                                            )} />
                                            <label htmlFor="area" className={classNames({ 'p-error': errors.area })}>Área*</label>
                                        </span>
                                        {getFormErrorMessage('area')}
                                    </div>
                                    :
                                    ""
                            }

                            {
                                selectedAppointmentType && selectedAppointmentType.code === 1 && inmunization &&
                                <div className="field mt-8">
                                    <span className="p-float-label">
                                        <Controller name="appointdate" control={control} rules={{ required: 'La fecha de cita es requerida.' }} render={({ field }) => (
                                            <Calendar minDate={tomorrow} id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="yy/mm/dd" showIcon mask="99/99/9999" />
                                        )} />
                                        <label htmlFor="appointdate" className={classNames({ 'p-error': errors.appointdate })}>Fecha de cita*</label>
                                    </span>
                                    {getFormErrorMessage('appointdate')}
                                </div>
                            }

                            {
                                selectedAppointmentType && selectedAppointmentType.code === 2 && area &&
                                <div className="field mt-8">
                                    <span className="p-float-label">
                                        <Controller name="appointdate" control={control} rules={{ required: 'La fecha de cita es requerida.' }} render={({ field }) => (
                                            <Calendar minDate={tomorrow} id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="yy/mm/dd" showIcon mask="99/99/9999" />
                                        )} />
                                        <label htmlFor="appointdate" className={classNames({ 'p-error': errors.appointdate })}>Fecha de cita*</label>
                                    </span>
                                    {getFormErrorMessage('appointdate')}
                                </div>
                            }

                            {
                                selectedAppointmentType && selectedAppointmentType.code === 3 && test &&
                                <div className="field mt-8">
                                    <span className="p-float-label">
                                        <Controller name="appointdate" control={control} rules={{ required: 'La fecha de cita es requerida.' }} render={({ field }) => (
                                            <Calendar minDate={tomorrow} id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="yy/mm/dd" showIcon mask="99/99/9999" />
                                        )} />
                                        <label htmlFor="appointdate" className={classNames({ 'p-error': errors.appointdate })}>Fecha de cita*</label>
                                    </span>
                                    {getFormErrorMessage('appointdate')}
                                </div>
                            }

                            {
                                appointdate &&
                                <div className="field mt-8">
                                    <span className="p-float-label">
                                        <Controller name="shift" control={control} rules={{ required: 'El turno de cita es requerido.' }} render={({ field }) => (
                                            <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={shiftsList} optionLabel={'start_hour'} optionValue='start_hour' />
                                        )} />
                                        <label htmlFor="shift" className={classNames({ 'p-error': errors.shift })}>Turno*</label>
                                    </span>
                                    {getFormErrorMessage('shift')}
                                </div>
                            }

                            <br />

                            <div className='col-span-2 flex justify-center mt-5'>
                                <button
                                    type="submit"
                                    className="flex lg:text-xl sm:text-xs md:text-xs xsm:text-xs justify-center text-white px-4 py-2 rounded-full tracking-wide font-bold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg bg-blue-800 cursor-pointer transition ease-in duration-300"

                                >
                                    Agendar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}