import React, { useEffect, useState, useMemo } from "react";

import { UserContext, SetUserContext } from "./UserContext";

const UserState = (props) => {
    const initialState = getUserStorage() ?? {
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
        consultationInfo: {
            userCode: null,
            appointmentId: null,
            fullName: '',
            age: null,
            gender: '',
        }
    };

    const [userState, setUserState] = useState(initialState);
    const values = useMemo(() => (
            {
                ...userState,
                
                getUserStorage,
            }
        ),
        [userState]);

    useEffect(() => {
        setUserStorage(userState);
    }, [userState])

    function setUserStorage(args) {
        localStorage.setItem('userState', JSON.stringify(args));
    };

    function getUserStorage() {
        return JSON.parse(localStorage.getItem('userState'));
    }

    const setUser = (args) => {
        setUserState(currentState => {
            return {
                ...currentState,
                ...args
            }
        })
    }

    const setConsultationInfo = (args) => {
        setUserState(currentState => {
            return {
                ...currentState,
                consultationInfo: {
                    ...currentState.userInfo,
                    ...args
                }
            }
        })
    }

    return (
        <UserContext.Provider
            value={values}
        >
            <SetUserContext.Provider
                value={{
                    setUser,
                    setConsultationInfo
                }}
            >
                {props.children}
            </SetUserContext.Provider>
        </UserContext.Provider>
    );
}

export default UserState;