import React from "react";

//Components imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faBriefcaseMedical } from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-solid-svg-icons";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

export default function Welcome() {
    return (
        <section className="flex justify-center my-20">
            <div className="bg-black text-white rounded-lg">
                <div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
                    <div className="flex flex-col w-full lg:w-1/3 justify-center items-start p-8">
                        <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose"><b>¡Bienvenido/a!</b></h1>
                        <p className="text-sm text-center md:text-base text-gray-50 mb-4">
                            Toma el control de tu salud
                        </p>
                    </div>
                    <div className="p-8 mt-12 mb-6 md:mb-0 md:mt-0 ml-0 md:ml-12 lg:w-2/3 justify-center">
                        <div className="content-center justify-center">
                            <div className="flex justify-center">
                                <FontAwesomeIcon className="mt-4 xl:block text-7xl" style={{ color: 'white' }} icon={faHospital} />
                                <FontAwesomeIcon className="mt-4 ml-4 xl:block text-7xl" style={{ color: 'red' }} icon={faHeartCircleCheck} />
                            </div>
                            <div className="flex justify-center">
                                <FontAwesomeIcon className="mt-4 xl:block text-7xl" style={{ color: 'blue' }} icon={faScaleBalanced} />
                                <FontAwesomeIcon className="mt-4 ml-4 xl:block text-7xl" style={{ color: 'white' }} icon={faBriefcaseMedical} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}