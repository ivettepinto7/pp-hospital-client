import React, { useState, useEffect, useContext, useRef } from "react";
import MenuContext from "../../contexts/MenuContext/MenuContext";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { useForm, Controller } from "react-hook-form";

//Components imports
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

import "../cssFiles/FormDemo.css";

export default function CreateNewArea() {
  const { emergentNewAreaState } = useContext(MenuContext);
  const menuContext = useContext(MenuContext);
  const { token } = useContext(UserContext);

  const toast = useRef(null);

  const [display, setDisplay] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [shiftsList, setShiftsList] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "patient/shifts", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            setShiftsList(res.data);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }, []);

  const defaultValues = {
    name: "",
    id_shift: null,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "admin/areas/create", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 201) {
            setShowMessage(true);
            reset();
            menuContext.getAllAreas(token);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: res.data.message,
              life: 3000,
              style: { marginLeft: "20%" },
            });
          }
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.response.data.message,
            life: 3000,
            style: { marginLeft: "20%" },
          });
        });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
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

  useEffect(() => {
    setDisplay(emergentNewAreaState);
  }, [emergentNewAreaState]);

  const dialogFuncMap = {
    display: setDisplay,
  };

  const onHide = (name) => {
    menuContext.settingEmergentNewAreaState();
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
        header="Crear Area"
        visible={display}
        style={{ width: "50vw" }}
        footer={renderFooter("display")}
        onHide={() => onHide("display")}
      >
        <div className="form-demo w-full">
          <Dialog
            visible={showMessage}
            onHide={() => setShowMessage(false)}
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
                <b>{formData.name}</b> Agregado con éxito.
              </p>
            </div>
          </Dialog>

          <div className="m-1 w-full flex justify-content-center">
            <div className="card w-full">
              <form
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 p-fluid w-full"
              >
                <div className="field">
                  <span className="p-float-label">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "El nombre es requerido" }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          autoFocus
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    <label
                      htmlFor="name"
                      className={classNames({ "p-error": errors.name })}
                    >
                      Nombre*
                    </label>
                  </span>
                  {getFormErrorMessage("name")}
                </div>

                <div className="field">
                  <span className="p-float-label">
                    <Controller
                      name="id_shift"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          optionValue="id_shift"
                          id={field.name}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          options={shiftsList}
                          optionLabel={"start_hour"}
                        />
                      )}
                    />
                    <label
                      htmlFor="id_shift"
                      className={classNames({ "p-error": errors.id_shift })}
                    >
                      Turno*
                    </label>
                  </span>
                  {getFormErrorMessage("gender")}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
