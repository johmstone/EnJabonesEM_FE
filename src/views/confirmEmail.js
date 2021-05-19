/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Account from '../services/account';

export const ConfirmEmail = () => {
    const params = useParams();
    const AccountSVC = new Account();
    const [ResponseStatus, setResponse] = useState({})

    const LoadPage = () => {
        console.log('Call loadPage')
        AccountSVC.ConfirmEmail(params.EVToken).then(res => {
            setResponse(res);
        })
    };

    useEffect(() => {
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (ResponseStatus.Status === 200) {
        return (
            <div className="card-success">
                <div className="upper-side bg-primary">
                    <i className="far fa-question-circle mb-3"></i>
                    <h3 className="status"> Confirmación de Cuenta </h3>
                </div>
                <div className="lower-side">
                    <p className="card-message">Su cuenta fue confirmada satisfactoriamente!</p>
                    <div className="form-group text-center">
                        <Link to="/Login" className="btn btn-outline-secondary text-font-base btn-block my-3">
                            Ingresar
                   		</Link>
                    </div >
                </div>

            </div>
        )
    } else if (ResponseStatus.Status === 403) {
        return (
            <div className="card-success">
                <div className="upper-side bg-primary">
                    <i className="far fa-question-circle mb-3"></i>
                    <h3 className="status"> Confirmación de Cuenta </h3>
                </div>
                <div className="lower-side">
                    <p className="card-message">Este Código de Verificación es invalido!</p>
                    <div className="form-group text-center">
                        <Link to="/Login" className="btn btn-outline-secondary text-font-base btn-block my-3">
                            Ingresar
                   		</Link>
                    </div >
                </div>

            </div>
        )
    } else {
        return (
            <div className="card-success">
                <div className="upper-side bg-primary">
                    <i className="far fa-question-circle mb-3"></i>
                    <h3 className="status"> Confirmación de Cuenta </h3>
                </div>
                <div className="lower-side">
                    <p className="card-message">Este es un código de verificación invalido!</p>
                    <div className="form-group text-center">
                        <Link to="/Login" className="btn btn-outline-secondary text-font-base btn-block my-3">
                            Ingresar
                   		</Link>
                    </div >
                </div>

            </div>
        )
    }
};
