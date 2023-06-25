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
import { Button } from "primereact/button";

import "../components/cssFiles/FormDemo.css";
import { PatientInConsult } from "../helpers/PatientInConsult";
import UserRecordTable from "../components/EmergentWindows/UserRecordTable";
import CreatePrescription from "../components/EmergentWindows/CreatePrescription";

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
  const getUserRecords = (id) => {
    useEffect(() => {
      //obtener lista
      try {
        axios.get(process.env.REACT_APP_API_URL + "doctor/drugs", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            if (res.status === 200) {
              return setDrugsList(res.data);
            }
          })
          .catch(err => console.error(err));
      } catch (error) {
        throw console.error(error)
      }
    }, [role,token]);
    try {
      axios
        .get(
          process.env.REACT_APP_API_URL +
            `doctor/citas-dia/consulta/expediente/${userCode}`,
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

  return (
    <div className="flex flex-col  items-center justify-center h-screen ">
      {/*
       *User creation emergent window
       */}

      <UserRecordTable loading={loading2} userRecordsList={userRecordsList} />
      <CreatePrescription code={userCode} />
      <h1 className="text-3xl">Consulta</h1>
      <h2 className="lg:text-xl">
        <b>Nombre: </b>
        {fullname}
      </h2>
      <h2 className="lg:text-xl">
        <b>Edad: </b>
        {age}
      </h2>
      <h2 className="lg:text-xl">
        <b>Género: </b>
        {gender === "F" ? "Femenino" : "Masculino"}
      </h2>
      <h2 className="lg:text-xl">
        <b>Discutido en cita:</b>
      </h2>
      <InputTextarea
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        cols={50}
      />
      <br />
      <div className="lg:flex lg:flex-row lg:justify-evenly xsm:flex-col xsm:justify-center lg:w-1/2">
        <div className="xsm:m-1 lg:justify-evenly lg:flex">
          <Button
            label="Abrir Expediente"
            className="p-button-info"
            onClick={() => {
              getUserRecords(userCode);
              menuContext.settingEmergentShowRecordState();
            }}
          />
        </div>
        <div className="xsm:m-1 lg:justify-evenly lg:flex">
          <Button
            label="Agregar prescripción"
            className="p-button-secondary"
            onClick={() => {
              menuContext.settingEmergentPrescriptionState();
            }}
          />
        </div>
        <div className="xsm:m-1 lg:justify-evenly lg:flex">
          <Button
            label="Finalizar cita"
            className="p-button-warning"
            onClick={() => {
              navigate("/landing/citas-dia");
            }}
          />
        </div>
      </div>
    </div>
  );
}
