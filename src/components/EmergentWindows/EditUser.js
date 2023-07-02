import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import MenuContext from "../../contexts/MenuContext/MenuContext";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { useForm, Controller } from "react-hook-form";

//Components imports
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { SelectButton } from "primereact/selectbutton";

import "../cssFiles/FormDemo.css";

export default function EditUser({ id, username, currentInfo }) {
  const { emergentEditUserState } = useContext(MenuContext);
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const toast = useRef(null);

  const [display, setDisplay] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setDisplay(emergentEditUserState);
  }, [emergentEditUserState]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();
  let stat = watch("status", false);

  const onSubmit = (data) => {
    try {
      data = {
        id: id,
        email: data.email !== undefined ? data.email : null,
        status: stat === "Activo" ? true : false,
      };
      axios
        .put(process.env.REACT_APP_API_URL + "admin/users/update", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            reset();
            setShowMessage(true);
            menuContext.getAllUsers(token);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      throw console.error(error);
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => {
          setShowMessage(false);
          onHide("display");
        }}
      />
    </div>
  );

  /**
   * Upload New User Emergent logic section code
   */
  const dialogFuncMap = {
    display: setDisplay,
  };

  const onHide = (name) => {
    menuContext.settingEmergentEditUserState();
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
          type="submit"
          onClick={handleSubmit(onSubmit)}
          icon="pi pi-check"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <Toast ref={toast} />
      <Dialog
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        header="Editar usuario"
        visible={display}
        style={{ width: "50vw" }}
        footer={renderFooter("display")}
        onHide={() => onHide("display")}
      >
        <div className="form-demo w-full">
          <Dialog
            visible={showMessage}
            onHide={() => {
              setShowMessage(false);
              onHide("display");
            }}
            position="top"
            footer={dialogFooter}
            showHeader={false}
            breakpoints={{ "960px": "80vw" }}
            style={{ width: "30vw" }}
          >
            <div className="flex justify-content-center flex-column pt-6 px-3">
              <i
                className="pi pi-check-circle"
                style={{ fontSize: "5rem", color: "var(--green-500)" }}
              ></i>
              <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
                <b>{username}</b> actualizado con éxito.
              </p>
            </div>
          </Dialog>

          <div className="m-1 w-full flex justify-content-center">
            <div className="card w-full">
              <form
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className="p-fluid w-full"
              >
                <div className="field">
                  <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope" />
                    <Controller
                      defaultValue={currentInfo.email}
                      name="email"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message:
                            "Dirección de correo electrónico incorrecta. E.g. ejemplo@email.com",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    <label
                      htmlFor="email"
                      className={classNames({ "p-error": !!errors.email })}
                    >
                      Correo electrónico
                    </label>
                  </span>
                  {getFormErrorMessage("email")}
                </div>

                <div className="field">
                  <span className="p-inline-label">
                    <label
                      htmlFor="status"
                      className={classNames({ "p-error": !!errors.status })}
                    >
                      Estado
                    </label>
                    <Controller
                      defaultValue={
                        currentInfo.status === true ? "Activo" : "Inactivo"
                      }
                      name="status"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectButton
                          id={field.name}
                          {...field}
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
                          options={["Activo", "Inactivo"]}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage("status")}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
