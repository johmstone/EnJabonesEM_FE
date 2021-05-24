/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import { Link } from "react-router-dom";

import Account from '../services/account';

export const ForgotPassword = () => {
    const [Loading, setLoading] = useState(false);
    const [Submitted, setSubmitted] = useState(false);
    const AccountSVC = new Account();

    const { register, handleSubmit, formState, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty, isValid } = formState;

    const onSubmit = data => {
        setLoading(true);
        AccountSVC.ForgotPassword(data.Email).then(res => {
            setLoading(false);
            if (res.Status === 200) {
                setSubmitted(true);
                reset();
            } else {
                message.error({
                    content: "Esta cuenta de correo no se encuentra registrada!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        })
    }

    if (Submitted) {
        return (
            <div className="card-success">
                <div className="upper-side bg-primary">
                    <i className="far fa-question-circle mb-3"></i>
                    <h3 className="status"> Confirmación</h3>
                </div>
                <div className="lower-side">
                    <p className="card-message">Su solicitud para restablecer su contraseña ha sido enviada, por favor revise su correo....</p>
                    <div className="form-group text-center">
                        <Link to="/Login" className="btn btn-outline-primary text-font-base btn-block my-3">
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
                    <h3 className="status"> Olvidó su Contraseña</h3>
                </div>
                <div className="lower-side">
                    <p className="card-message">Por favor ingrese el correo electrónico con el cual se registro</p>
                    <div className="form-group text-center">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className="form-group input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                </div>
                                <input type="email" className="form-control" placeholder="Correo Electrónico" maxLength="30"
                                    {...register('Email', { required: true })} />
                            </div>
                            <div className="form-group text-center">
                                <button className="btn btn-outline-primary text-font-base btn-block" disabled={!isDirty || !isValid || Loading}>
                                    {Loading ? (
                                        <div className="spinner-border spinner-border-sm align-middle" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>) : ''
                                    }
								Enviar Solicitud
                     		</button >
                            </div >
                        </form>
                    </div >
                </div>
            </div>
        )
    }
};
