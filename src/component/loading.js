import React from "react";

export const Loading = () => (
    <div className="container-fluid">
        <div className="loading-screen-wrapper">
            <div className="loading-screen-icon text-center text-white">
                <h2 className="text-white">Cargando...</h2>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            </div>
        </div>
    </div>
);
