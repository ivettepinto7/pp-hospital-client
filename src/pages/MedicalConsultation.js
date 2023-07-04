import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
//form validations
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import MenuContext from "../contexts/MenuContext/MenuContext";
import { UserContext } from "../contexts/UserContext/UserContext";

//Components imports
import { InputTextarea } from "primereact/inputtextarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCapsules,
  faPenToSquare,
  faPlusCircle,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

import "../components/cssFiles/FormDemo.css";
import UserRecordTable from "../components/EmergentWindows/UserRecordTable";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DrugsSchema = Yup.object().shape({
  list: Yup.array()
    .of(
      Yup.object().shape({
        medicine: Yup.number().min(0, "Requerido").required("Requerido"),
        doses: Yup.number()
          .min(1, "La dosis minima es 1")
          .required("Requerido"),
        quantity: Yup.number()
          .min(1, "La cantidad minima es 1")
          .required("Requerido"),
      })
    )
    .max(9, "Solo puede agregar 9 medicamentos. "),
});

export default function MedicalConsultation() {
  const { token, role, consultationInfo } = useContext(UserContext);
  const { userCode, fullName, age, gender, appointmentId } = consultationInfo;
  const navigate = useNavigate();
  const menuContext = useContext(MenuContext);
  const [description, setDescription] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [drugsList, setDrugsList] = useState([]);
  const [userRecordsList, setUserRecordsList] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    //obtener lista
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "doctor/drugs", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            return setDrugsList(res.data);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  }, [role, token]);

  const CustomInput = (props) => <input type="number" {...props} />;
  const CustomInputText = (props) => (
    <textarea type="text" {...props} rows="3" cols="33" />
  );

  const getUserRecords = (id) => {
    try {
      axios
        .get(
          process.env.REACT_APP_API_URL +
            `doctor/citas-dia/consulta/expediente/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            setUserRecordsList(res.data);
            setLoading2(false);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      throw console.error(error);
    }
  };

  const handleFinishConsultation = () => {
    try {
      axios
        .put(
          process.env.REACT_APP_API_URL +
            `doctor/citas-dia/consulta/finalizar/${parseInt(appointmentId)}`,
          { description },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            setShowMessage(true);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      throw console.error(error);
    }
  };
  const dialogFooter = () => {
    return (
      <div className="flex justify-content-center">
        <Button
          label="OK"
          className="p-button-text"
          autoFocus
          onClick={() => {
            setShowMessage(false);
            navigate("/landing/citas-dia");
          }}
        />
      </div>
    );
  };
  return (
    <div className="h-screen max-h-screen bg-black w-full mt-4">
      {menuContext.emergentShowRecordState && (
        <UserRecordTable loading={loading2} userRecordsList={userRecordsList} />
      )}
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
          <p className="ml-4">
            Cita finalizada con éxito para <b>{fullName}</b>.
          </p>
        </div>
      </Dialog>
      <h1 className="lg:text-4xl md:text-3xl sm:text-2xl xsm:text-xl text-center">
        Consulta
      </h1>
      <div className="text-center grid grid-cols-3 mt-4">
        <h2 className="lg:text-2xl md:text-xl sm:text-xs xsm:text-xs flex flex-col">
          <b>Nombre: </b>
          {fullName}
        </h2>
        <h2 className="lg:text-2xl md:text-xl sm:text-xs xsm:text-xs flex flex-col">
          <b>Edad: </b>
          {age} años
        </h2>
        <h2 className="lg:text-2xl md:text-xl sm:text-xs xsm:text-xs flex flex-col">
          <b>Género: </b>
          {gender === "M" ? "Masculino" : "Femenino"}
        </h2>
      </div>

      <Formik
        initialValues={{
          list: [
            {
              medicine: -1,
              doses: "",
              quantity: "",
              indication: "",
            },
          ],
        }}
        validationSchema={DrugsSchema}
        onSubmit={(values) => {
          try {
            for (let index = 0; index < values.list.length; index++) {
              const element = values.list[index];
              const data = { id_appointment: appointmentId, ...element };
              axios
                .post(
                  process.env.REACT_APP_API_URL +
                    "doctor/citas-dia/consulta/receta/crear",
                  data,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                  if (res.status === 201) {
                    setStatus("Receta creada exitosamente.");
                  }
                })
                .catch((err) => console.log(err));
            }
          } catch (error) {
            throw console.error(error);
          }
        }}
        children={({ values, errors, touched }) => (
          <>
            <div className="lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 m-6">
              <>
                <Form>
                  <FieldArray
                    name="list"
                    render={(arrayHelpers) => (
                      <div className="mx-2 text-center border-2 rounded-lg py-4 my-2 max-h-100">
                        <div className="flex justify-center items-center">
                          <FontAwesomeIcon
                            className="text-blue-800 text-4xl mx-4"
                            icon={faCapsules}
                          />
                          <h2 className="lg:text-2xl md:text-xl sm:text-xs xsm:text-xs">
                            <b>Agregar medicamento</b>
                          </h2>
                        </div>
                        <div>
                          {status !== "" && <h3>{status}</h3>}
                          {values.list && values.list.length > 0 ? (
                            values.list.map((item, index) => (
                              <div
                                className="flex justify-center items-center"
                                key={index}
                              >
                                <Field
                                  placeholder="Seleccionar medicina"
                                  className="bg-gray-700 text-white text-sm w-1/4 mx-2"
                                  as="select"
                                  name={`list.${index}.medicine`}
                                  key={`list.${index}.medicine`}
                                >
                                  <option value={-1} disabled={true}>
                                    Seleccionar medicamento
                                  </option>
                                  {drugsList &&
                                    drugsList.map((drug, index) => (
                                      <option
                                        key={parseInt(drug.id_drug)}
                                        value={parseInt(drug.id_drug)}
                                        defaultValue={undefined}
                                      >
                                        {drug.name.toString()}
                                      </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                  className="text-xs bg-red-600"
                                  name={`list.${index}.medicine`}
                                />
                                <Field
                                  as={CustomInput}
                                  placeholder="Dosis"
                                  min={1}
                                  className="bg-gray-700 text-white text-sm w-1/5 mx-2"
                                  name={`list.${index}.doses`}
                                  key={`list.${index}.doses`}
                                />
                                <ErrorMessage
                                  className="text-xs bg-red-600"
                                  name={`list.${index}.doses`}
                                />
                                <Field
                                  as={CustomInput}
                                  placeholder="Cantidad"
                                  min={1}
                                  className="bg-gray-700 text-white text-sm w-1/5 mx-2"
                                  name={`list.${index}.quantity`}
                                  key={`list.${index}.quantity`}
                                />
                                <ErrorMessage name={`list.${index}.quantity`} />
                                <Field
                                  as={CustomInputText}
                                  placeholder="Indicación"
                                  min={1}
                                  className="bg-gray-700 text-white text-sm w-1/5 mx-2"
                                  name={`list.${index}.indication`}
                                  key={`list.${index}.indication`}
                                />
                                <button
                                  className="mx-2"
                                  type="button"
                                  onClick={() => {
                                    if (values.list.length < 4) {
                                      arrayHelpers.insert(index, "");
                                    }
                                  }}
                                >
                                  <FontAwesomeIcon
                                    className="text-blue-800 text-xl"
                                    icon={faPlusCircle}
                                  />
                                </button>
                                <button
                                  className="mx-2"
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <FontAwesomeIcon
                                    className="text-red-600 text-xl"
                                    icon={faTrashAlt}
                                  />
                                </button>
                              </div>
                            ))
                          ) : (
                            <button
                              className="text-sm underline"
                              type="button"
                              onClick={() => arrayHelpers.push("")}
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <button className="flex justify-center w-full" type="submit">
                    <FontAwesomeIcon
                      className="text-blue-800 text-xl"
                      icon={faUpload}
                    />
                    Crear receta
                  </button>
                </Form>
              </>
              <div className="mx-2 text-center border-2 rounded-lg py-4 my-2">
                <div className="flex justify-center items-center">
                  <FontAwesomeIcon
                    className="text-yellow-500 text-4xl mx-4"
                    icon={faPenToSquare}
                  />
                  <h2 className="lg:text-2xl md:text-xl sm:text-xs xsm:text-xs">
                    <b>Nota adicional de la consulta</b>
                  </h2>
                </div>
                <InputTextarea
                  placeholder="Ej: Regresar a consulta al terminar tratamiento."
                  className="mt-4"
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  cols={50}
                />
              </div>
            </div>
            <div className="lg:flex md:flex lg:justify-around md:justify-around sm:justify-center xsm:justify-center m-6">
              <button
                type="button"
                className="flex justify-center items-center text-white text-xl p-2 rounded-lg tracking-wide font-bold focus:outline-none focus:shadow-outline hover:bg-yellow-600 shadow-lg bg-yellow-700 cursor-pointer transition ease-in duration-300"
                onClick={() => {
                  getUserRecords(userCode.id_person);
                  menuContext.settingEmergentShowRecordState();
                }}
              >
                Abrir expediente
              </button>
              <button
                className="flex justify-center items-center text-white text-xl p-2 rounded-lg tracking-wide font-bold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg bg-blue-800 cursor-pointer transition ease-in duration-300"
                type="button"
                onClick={() => handleFinishConsultation()}
              >
                Finalizar cita
              </button>
            </div>
          </>
        )}
      />
    </div>
  );
}
