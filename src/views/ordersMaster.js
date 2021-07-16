/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Context } from '../store/appContext';
import { useForm, Controller, useFormState } from "react-hook-form";

import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { Card } from "antd";


import AuthenticationService from '../services/authentication';
import WebDirectoryService from '../services/webdirectory';
import OrdersService from "../services/orders";

import { Loading } from '../component/loading';
import { Error } from '../component/error';

export const OrdersMaster = () => {

    const AuthSVC = new AuthenticationService();
    const WebDirectorySVC = new WebDirectoryService();
    const OrdersSVC = new OrdersService();
    const location = useLocation();
    const StartDate = '2021-06-01';
    const EndDate = '2021-07-15';
    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { store } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [Statuses, setStatuses] = useState([]);

    useEffect(() => {
        if (isLogin) {
            LoadPage();
            setLoading(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const LoadPage = () => {
        const pathname = location.pathname.slice(1).split('/');
        let model = {
            Controller: pathname[0],
            Action: pathname[1] === undefined ? "Index" : pathname[1]
        }
        WebDirectorySVC.RightsValidation(model).then(res => {
            //console.log(res);
            setRights(res);
            return res;
        }).then(src => {
            OrdersSVC.Statuses("Internal").then(res => {
                console.log(res);
                setStatuses(res);
                setLoading(false);
            });
        });

    }

    const { handleSubmit, control } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty } = useFormState({ control });

    const onSubmit = data => {
        console.log(data);
    }

    const ContentPage = () => {
        return (
            <section className="container-lg mb-3">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="far fa-bags-shopping m-2"></i>Ordenes</h2>
                    <p className="subtitle">Módulo de Gestión de Pedidos</p>
                </div>
                <hr className="hr-div" />
                <div className="container-md">
                    <Card hoverable>
                        <form onSubmit={handleSubmit(onSubmit)} className="m-0">
                            <div className="row m-0">
                                <Controller name="StatusID"
                                    control={control}
                                    defaultValue={20200}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField
                                                id="StatusID"
                                                select
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                label="Status de la Orden"
                                                error={!!error}
                                                helperText={error ? (<label className="text-font-base text-danger">
                                                    <i className="fa fa-times-circle"></i> {error.message}
                                                </label>) : null}>
                                                {
                                                    Statuses.map((item, i) => {
                                                        return (
                                                            <MenuItem value={item.StatusID} key={i}>{item.ExternalStatus} - {item.InternalStatus} ({item.StatusID})</MenuItem>
                                                        )
                                                    })
                                                }
                                            </TextField>
                                        </FormControl>
                                    )}
                                    //onChange={e => e}
                                    rules={{ required: "Debe seleccionar alguna opción" }}
                                />
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <Controller name="StartDate"
                                        control={control}
                                        defaultValue={StartDate}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <FormControl variant="outlined" className="w-100 my-2">
                                                <TextField
                                                    id="StartDate"
                                                    type="date"
                                                    variant="outlined"
                                                    value={value}
                                                    onChange={onChange}
                                                    label="Inicio"
                                                    error={!!error}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                      }}                                                  
                                                    helperText={error ? (<label className="text-font-base text-danger">
                                                        <i className="fa fa-times-circle"></i> {error.message}
                                                    </label>) : null}>
                                                </TextField>
                                            </FormControl>
                                        )}
                                        //onChange={e => e}
                                        rules={{ required: "Debe seleccionar una fecha valida" }}
                                    />
                                </div>
                                <div className="col-sm-6">
                                <Controller name="EndDate"
                                        control={control}
                                        defaultValue={EndDate}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <FormControl variant="outlined" className="w-100 my-2">
                                                <TextField
                                                    id="EndDate"
                                                    type="date"
                                                    variant="outlined"
                                                    value={value}
                                                    onChange={onChange}
                                                    label="Fin"
                                                    error={!!error}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                      }}                                                  
                                                    helperText={error ? (<label className="text-font-base text-danger">
                                                        <i className="fa fa-times-circle"></i> {error.message}
                                                    </label>) : null}>
                                                </TextField>
                                            </FormControl>
                                        )}
                                        //onChange={e => e}
                                        rules={{ required: "Debe seleccionar una fecha valida" }}
                                    />
                                </div>
                            </div>
                            <div className="form-group mt-3 mb-0 mx-0 text-center">
                                <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit">
                                    <i className="fas fa-search"></i> Buscar
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </section>
        )
    }

    if (store.isLoading || isLoading) {
        return <Loading />
    } else {
        if (isLogin) {
            if (Rights.ReadRight) {
                return <ContentPage />
            } else {
                return <Error Message='Usted no esta autorizado para ingresar a esta seccion, si necesita acceso contacte con un administrador.' />
            }
        } else {
            return <Redirect to={{ pathname: "/Login" }} />;
        }
    }
};
