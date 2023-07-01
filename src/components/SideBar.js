import React, { useState, useContext, lazy } from 'react'
import { useNavigate } from 'react-router-dom';
import MenuContext from '../contexts/MenuContext/MenuContext';
import { UserContext, SetUserContext } from '../contexts/UserContext/UserContext';

//Components imports
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import "./cssFiles/PanelMenu.css";

//Resources imports
import logo from '../logo.png';
import { convertRoutes } from '../helpers/Routes';
import { Roles } from '../helpers/Roles';

const EditOwnUser = lazy(() => import('./EmergentWindows/EditOwnUser'));

export default function SideBar() {
    const navigate = useNavigate();
    const [active, setActive] = useState(false);
    const { name, username, last_name, getUserStorage } = useContext(UserContext);
    const { setUser } = useContext(SetUserContext);
    const { role } = getUserStorage();
    const menuContext = useContext(MenuContext);
    const routes = convertRoutes(navigate);

    const castRol = Roles.find((r) => {
        return r.code === role;
    });

    const modulatedRoutes = routes.filter(({ roles, label }) => {
        if (castRol)
            return label !== "Consulta" && roles.some((role) => role.includes(castRol.name));
        return "";
    })

    return (
        <>
            {menuContext.emergentEditOwnUserState && <EditOwnUser />}
            <div className='w-full p-4 flex items-center justify-between' style={{ backgroundColor: '#1D4078' }}>
                <button onClick={() => setActive(true)} className=" p-sidebar-icon p-link mr-1">
                    <span style={{ color: 'white', 'fontSize': '2em' }} className="pi pi-bars" />
                </button>
                <h1 className='lg:text-4xl sm:text-3xl text-white'><b>Holistic Hospital</b></h1>
                <img src={logo} alt='logo' className='mr-2' style={{ height: '10vmin' }} />
                <Sidebar visible={active} onHide={() => setActive(false)} style={{ color: 'white', backgroundColor: 'black' }}>
                    <div className="w-full flex flex-row items-center">
                        <img src={logo} alt='logo' className='mr-2' style={{ height: '10vmin' }} />
                        <div className="w-full flex-colitems-center">
                            <h1 className="text-bold text-center w-full"><b> {name + ' ' + last_name} </b></h1>
                            <h1 className="text-center w-full">{"@" + username}</h1>
                        </div>
                    </div>
                    <div className='flex justify-around align-middle m-4'>
                        <h1
                            className="text-blue-500 cursor-pointer"
                            onClick={() => {
                                setActive(false)
                                menuContext.settingEmergentEditOwnUserState()
                            }}
                        >
                            Editar perfil
                        </h1>
                        <h1
                            className="text-red-500 cursor-pointer"
                            onClick={() => {
                                setUser({
                                    token: '',
                                    id_person: null,
                                    name: '',
                                    username: '',
                                    last_name: '',
                                    email: '',
                                    role: null,
                                    area: null,
                                    status: null,
                                    isLogged: false,
                                })
                                localStorage.clear();
                                navigate("/")
                                window.location.replace('');
                            }}>
                            Cerrar sesión
                        </h1>
                    </div>
                    <ul className="w-full text-white lg:mt-4">
                        <PanelMenu model={modulatedRoutes} />
                    </ul>
                </Sidebar>
            </div>
        </>
    )
}