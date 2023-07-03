import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuState from "./contexts/MenuContext/MenuState";
import UserState from "./contexts/UserContext/UserState";

import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

//Components imports
const Login = lazy(() => import("./pages/Login"));
const RecoverPassword = lazy(() => import("./pages/RequestPassword"));
const Welcome = lazy(() => import("./pages/Welcome"));
const RestorePassword = lazy(() => import("./pages/RestorePassword"));
const Landing = lazy(() => import("./pages/Landing"));
const Users = lazy(() => import("./pages/Users"));
const Tests = lazy(() => import("./pages/Tests"));
const Inmunizations = lazy(() => import("./pages/Inmunizations"));
const PrevAppointments = lazy(() => import("./pages/PrevAppointments"));
const Exams = lazy(() => import("./pages/Exams"));
const Vaccines = lazy(() => import("./pages/Vaccines"));
const AppointsDay = lazy(() => import("./pages/AppointsDay"));
const MedicalConsultation = lazy(() => import("./pages/MedicalConsultation"));
const ScheduleAppointment = lazy(() => import("./pages/ScheduleAppointment"));
const UserPrescriptions = lazy(() => import("./pages/UserPrescriptions"));
const Areas = lazy(() => import("./pages/Areas"));
const Drugs = lazy(() => import("./pages/Drugs"));

function App() {
  return (
    <MenuState>
      <UserState>
        <Suspense fallback={<div></div>}>
          <Router>
            <Routes>
              <Route index path="" element={<Login />} />
              <Route exact path="recuperar" element={<RecoverPassword />} />
              <Route
                exact
                path="restablecer/:p"
                element={<RestorePassword />}
              />

              <Route path="landing" element={<Landing />}>
                <Route index element={<Welcome />} />
                <Route exact path="usuarios" element={<Users />} />
                <Route exact path="examenes" element={<Exams />} />
                <Route exact path="vacunas" element={<Vaccines />} />
                <Route exact path="areas" element={<Areas />} />
                <Route exact path="citas-dia" element={<AppointsDay />} />
                <Route exact path="medicamentos" element={<Drugs />} />

                <Route
                  exact
                  path="/landing/citas-dia/consulta"
                  element={<MedicalConsultation />}
                />

                <Route exact path="expediente">
                  <Route
                    index
                    exact
                    path="inmunizaciones"
                    element={<Inmunizations />}
                  />
                  <Route exact path="examenes-realizados" element={<Tests />} />
                  <Route
                    exact
                    path="citas-previas"
                    element={<PrevAppointments />}
                  />
                  <Route
                    exact
                    path="recetas-medicas"
                    element={<UserPrescriptions />}
                  />
                </Route>

                <Route exact path="citas" element={<ScheduleAppointment />} />
              </Route>
              <Route path="*" element={<h1>Page not found: 404!</h1>} />
            </Routes>
          </Router>
        </Suspense>
      </UserState>
    </MenuState>
  );
}

export default App;
