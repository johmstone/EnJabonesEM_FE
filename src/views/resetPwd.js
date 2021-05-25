/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from 'react-hook-form';

import Account from '../services/account';

export const ResetPwd = (props) => {
    const params = useParams();
    const AccountSVC = new Account();
    const [UserID, setUserID] = useState(0)
    const [Loading, setLoading] = useState(false);
    const [Submitted, setSubmitted] = useState(false);

    const LoadPage = () => {
        // AccountSVC.CheckGUID(params.GUID).then(res => {
        //     if(res !== undefined) {
        //         setUserID(res);
        //     }
        // })
    };

    const { register, handleSubmit, formState, getValues } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { dirtyFields, errors, isDirty, isValid } = formState

    const onSubmit = data => {
        setLoading(true);
        // let model = {
        //     GUID: params.GUID,
        //     Password: data.Password
        // }

        // AccountSVC.ResetPassword(model).then(res => {
        //      setSubmitted(res);
        //      setLoading(false);
        // });
    }

    useEffect(() => {
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (Submitted) {
        return (
            <div className="card-success">
                <div className="upper-side bg-success">
                    <i className="far fa-question-circle mb-3"></i>
                    <h3 className="status"> Restablecer Contraseña </h3>
                </div>
                <div className="lower-side">
                    <p className="card-message">Su contraseña fue cambiada satisfactoriamente!</p>
                    <div className="form-group text-center">
                        <Link to="/Login" className="btn btn-outline-success text-font-base btn-block my-3">
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
                    <h3 className="status"> Restablecer Constraseña </h3>
                </div>
                <div className="lower-side text-left">
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="form-group input-group m-0">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                            </div>
                            <input type="Password" className="form-control" placeholder="Contraseña"
                                {...register('Password', {
                                    required: true
                                    , minLength: 8
                                    , maxLength: 15
                                    , validate: {
                                        HasLowerCase: (value) => value && /[a-z]/.test(value)
                                        , HasUpperCase: (value) => value && /[A-Z]/.test(value)
                                        , HasNumbers: (value) => value && /[0-9]/.test(value)
                                    }
                                })}
                            />
                        </div>
                        <div className="form-group mb-1">
                            <label className={errors.Password?.types?.required && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.Password?.types?.required && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Campo requerido!
                   			</label>
                            <label className={errors.Password?.types?.minLength && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.Password?.types?.minLength && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener mínimo 8 caractéres!
                   			</label>
                            <label className={errors.Password?.types?.maxLength && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.Password?.types?.maxLength && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener máximo 15 caractéres!
                   			</label>
                            <label className={errors.Password?.types?.HasLowerCase && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.Password?.types?.HasLowerCase && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener al menos 1 minúscula!
                   			</label>
                            <label className={errors.Password?.types?.HasUpperCase && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.Password?.types?.HasUpperCase && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener al menos 1 MAYUSCULA!
                   			</label>
                            <label className={errors.Password?.types?.HasNumbers && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.Password?.types?.HasNumbers && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener al menos 1 número!
                   			</label>
                        </div>
                        <div className="form-group input-group m-0">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                            </div>
                            <input type="Password" id="ConfirmPwd" className="form-control" placeholder="Repetir Contraseña"
                                {...register('ConfirmPwd', {
                                    required: true
                                    , validate: {
                                        matchesPreviousPassword: (value) => {
                                            const { Password } = getValues();
                                            return Password === value || "Deben coincidir las contraseñas!";
                                        }
                                    }
                                })} />
                        </div>
                        <div className="form-group mb-1">
                            <label className={errors.ConfirmPwd?.type === 'matchesPreviousPassword' ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
                                <i className={errors.ConfirmPwd?.type === 'matchesPreviousPassword' ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Deben coincidir las contraseñas!
                   			</label>
                        </div>
                        <div className="form-group text-center mt-3">
                            <button className="btn btn-outline-primary text-font-base btn-block" disabled={!isDirty || !isValid}>
                                {Loading ? (
                                    <div className="spinner-border spinner-border-sm align-middle" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>) : ''
                                }
								Restablecer
                     		</button >
                        </div >
                    </form>
                </div>

            </div>
        )
    }
};
