import { UserRoles } from "./Roles";

export function convertRoutes(navigator) {
    return [
        {
            label: 'Usuarios',
            command: (event) => {
                navigator('/landing/usuarios');
            },
            path: '/landing/usuarios',
            roles: [UserRoles.ADMINISTRADOR],
        },
        {
            label: 'Expediente',
            path: '/landing/expediente',
            roles: [UserRoles.PACIENTE],
            items: [
                {
                    label: 'Inmunizaciones',
                    rolesi: [UserRoles.PACIENTE],
                    command: (event) => {
                        navigator('/landing/expediente/inmunizaciones');
                    },
                    pathi: '/landing/expediente/inmunizaciones',
                },
                {
                    label: 'Exámenes realizados',
                    rolesi: [UserRoles.PACIENTE],
                    command: (event) => {
                        navigator('/landing/expediente/examenes-realizados');
                    },
                    pathi: '/landing/expediente/examenes-realizados',
                },
                {
                    label: 'Recetas médicas',
                    rolesi: [UserRoles.PACIENTE],
                    command: (event) => {
                        navigator('/landing/expediente/recetas-medicas');
                    },
                    pathi: '/landing/expediente/recetas-medicas',
                },
                {
                    label: 'Citas previas',
                    rolesi: [UserRoles.PACIENTE],
                    command: (event) => {
                        navigator('/landing/expediente/citas-previas');
                    },
                    pathi: '/landing/expediente/citas-previas',
                },
            ]
        },
        {
            label: 'Agendar cita',
            roles: [UserRoles.PACIENTE,UserRoles.SECRETARIA],
            command: (event) => {
                navigator('/landing/citas');
            },
            path: '/landing/citas',
        },
        {
            label: 'Citas del dia',
            roles: [UserRoles.SECRETARIA, UserRoles.MEDICO],
            command: (event) => {
                navigator('/landing/citas-dia')
            },
            path: '/landing/citas-dia',
            
        },
        {
            label: 'Consulta',
            roles: [UserRoles.MEDICO, UserRoles.SECRETARIA],
            command: (event) => {
                navigator('/landing/citas-dia/consulta')
            },
            path: '/landing/citas-dia/consulta',
            
        },
        {
            label: 'Exámenes',
            roles: [UserRoles.ADMINISTRADOR],
            command: (event) => {
                navigator('/landing/examenes');
            },
            path: '/landing/examenes',
        },
        {
            label: 'Vacunas',
            roles: [UserRoles.ADMINISTRADOR],
            command: (event) => {
                navigator('/landing/vacunas');
            },
            path: '/landing/vacunas',
        },
        {
            label: 'Áreas',
            roles: [UserRoles.ADMINISTRADOR],
            command: (event) => {
                navigator('/landing/areas');
            },
            path: '/landing/areas',
        },
        {
            label: 'Medicamentos',
            roles: [UserRoles.ADMINISTRADOR],
            command: (event) => {
                navigator('/landing/medicamentos');
            },
            path: '/landing/medicamentos',
        },
    ]
}