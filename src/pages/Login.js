import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UserContext,
  SetUserContext,
} from "../contexts/UserContext/UserContext";

//Components imports
import { Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

//Helpers imports
import logo from "../logo.png";
import LeftLoginSection from "../components/LeftLoginSection";
import { useForm } from "react-hook-form";

export default function Login() {
  const { getUserStorage } = useContext(UserContext);
  const { token, status } = getUserStorage();
  const { setUser } = useContext(SetUserContext);
  const navigate = useNavigate();
  const toast = useRef(null);

  const isLogged = token !== "";

  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: "",
    password: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setLoading(true);
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "auth/signin", data)
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            reset();
            setUser({
              token: res.data.token,
              id_person: res.data.id_person,
              name: res.data.name,
              username: res.data.username,
              last_name: res.data.last_name,
              email: res.data.email,
              role: res.data.role.id_role,
              status: res.data.status,
              isLogged: true,
            });
            navigate("/landing");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error al iniciar sesión",
            detail: "Verifique los datos ingresados",
            life: 3000,
            style: { marginLeft: "20%" },
          });
        });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error al iniciar sesión",
        detail: "Algo salió mal",
        life: 3000,
        style: { marginLeft: "20%" },
      });
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  useEffect(() => {
    if (isLogged && status === true) navigate("/landing");
  }, [isLogged, status, navigate]);

  return (
    <div>
      <div className="relative min-h-screen grid bg-black w-full">
        <Toast ref={toast} />
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 ">
          <LeftLoginSection />
          <div className="md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none ">
            <div className="max-w-xl w-full space-y-12">
              <div className="lg:text-left text-center">
                <h2 className="font-bold text-gray-100">
                  <img src={logo} alt="logo" style={{ height: "10vmin" }} />
                </h2>
                <h2 className="mt-2 text-7xl font-bold text-gray-100">
                  Holistic Hospital
                </h2>
              </div>
              <div className="flex flex-row justify-center items-center space-x-2"></div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center items-center w-full h-3/4 rounded-md shadow-md"
              >
                <div className="field">
                  <span className="p-float-label">
                    <Controller
                      name="username"
                      control={control}
                      rules={{ required: "El nombre de usuario es requerido." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          autoComplete="off"
                          id={field.name}
                          {...field}
                          autoFocus
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                    <label
                      htmlFor="username"
                      className={classNames({ "p-error": errors.username })}
                    >
                      Nombre de usuario*
                    </label>
                  </span>
                  {getFormErrorMessage("username")}
                </div>

                <div className="field mt-8">
                  <span className="p-float-label">
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: "La contraseña es requerida." }}
                      render={({ field, fieldState }) => (
                        <Password
                          feedback={false}
                          autoComplete="off"
                          id={field.name}
                          {...field}
                          toggleMask
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    <label
                      htmlFor="password"
                      className={classNames({ "p-error": errors.password })}
                    >
                      Contraseña*
                    </label>
                  </span>
                  {getFormErrorMessage("password")}
                </div>

                <br />

                {loading === true ? (
                  <i className="pi pi-spinner text-white animate-spin"></i>
                ) : (
                  <button
                    type="submit"
                    className="lg:w-1/2 w-full flex justify-center text-white p-2 rounded-full tracking-wide font-bold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg bg-blue-800 cursor-pointer transition ease-in duration-300"
                  >
                    Iniciar sesión
                  </button>
                )}

                <p
                  className="underline bottom-0 text-white text-xs p-2 cursor-pointer"
                  onClick={() => navigate("/recuperar")}
                >
                  ¿Olvidaste tu contraseña?, haz clic aquí.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
