/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Context } from '../store/appContext';
import { useForm, Controller } from "react-hook-form";

import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { Card } from "antd";
import { Pie } from 'react-chartjs-2';
import randomColor from 'randomcolor';
import moment from 'moment';
import { OrdersTable } from "../component/orders/ordersTable";

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

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { store } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [Statuses, setStatuses] = useState([]);
    const [SearchOrder, setSearchOrder] = useState({
        ExternalStatusID: 10000,
        StartDate: moment().add(-1, 'month').format("YYYY-MM-DD"),
        EndDate: moment().format("YYYY-MM-DD")
    })
    const [OrderList, setOrderList] = useState({Orders: [], Summary:[]});
    const [ChartData, setChartData] = useState({});
    const [SearchInput, setSearchInput] = useState('');
    const [SearchResults, setSearchResults] = useState([]);

    //#region Formart Chart Data 
    // const data = {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [
    //       {
    //         label: '# of Votes',
    //         data: [12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)',
    //           'rgba(54, 162, 235, 0.2)',
    //           'rgba(255, 206, 86, 0.2)',
    //           'rgba(75, 192, 192, 0.2)',
    //           'rgba(153, 102, 255, 0.2)',
    //           'rgba(255, 159, 64, 0.2)',
    //         ],
    //         borderColor: [
    //           'rgba(255, 99, 132, 1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)',
    //         ],
    //         borderWidth: 1,
    //       },
    //     ],
    //   };
    //#endregion

    useEffect(() => {
        if (isLogin) {
            LoadPage();
        }
    }, []);

    useEffect(() => {
        if (isLogin) {
            LoadData();
        }
    }, [SearchOrder])

    useEffect(() => {
        const results = OrderList.Orders.filter(item =>
            item.OrderID.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.FullName.toLowerCase().includes(SearchInput.toLowerCase())
        );
        setSearchResults(results);
    }, [SearchInput, OrderList]);

    const LoadPage = () => {
        setLoading(true);
        const pathname = location.pathname.slice(1).split('/');
        let model = {
            Controller: pathname[0],
            Action: pathname[1] === undefined ? "Index" : pathname[1]
        }
        WebDirectorySVC.RightsValidation(model).then(res => {
            //console.log(res);
            setRights(res);
            if (res) {
                OrdersSVC.Statuses("External").then(res => {
                    //console.log(res);
                    setStatuses(res);
                });

                LoadData();
            } else {
                setLoading(false);
            }
        });
    }

    const LoadData = () => {
        OrdersSVC.OrderList(SearchOrder).then(res => {
            //console.log(res);
            setOrderList(res);
            const labels = res.Summary.filter(fil => fil.QtyOrders > 0).map(item => {
                return item.ExternalStatus + " (" + item.QtyOrders.toString() + ")";
            });

            const data = res.Summary.filter(fil => fil.QtyOrders > 0).map(item => {
                return item.QtyOrders;
            });

            const backgroundColor = res.Summary.filter(fil => fil.QtyOrders > 0).map(item => {
                return randomColor({
                    luminosity: 'dark',
                    format: "rgba",
                    alpha: 0.2
                });
            });

            const borderColor = backgroundColor.map(item => {
                return item.replace("0.2)", "1)");
            });

            const Finaldata = {
                labels: labels,
                datasets: [
                    {
                        label: 'Cantidad de Ordenes',
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1,
                    },
                ],
            };
            //console.log(Finaldata);
            setChartData(Finaldata);

            setLoading(false);
        });
    }

    const { handleSubmit, control } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onSubmit = data => {
        setSearchOrder(data);
    }

    const HandleCallback = (data) => {
        if (data) {
            LoadData();
        }
    }

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const ContentPage = () => {
        return (
            <section className="container-lg mb-3">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="far fa-bags-shopping m-2"></i>Ordenes</h2>
                    <p className="subtitle">Módulo de Gestión de Pedidos</p>
                </div>
                <hr className="hr-div" />
                <div className="container-xl">
                    <div className="row m-0">
                        <div className="col-sm-7">
                            <Card hoverable>
                                <form onSubmit={handleSubmit(onSubmit)} className="m-0">
                                    <div className="row m-0">
                                        <Controller name="ExternalStatusID"
                                            control={control}
                                            defaultValue={SearchOrder.ExternalStatusID}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl variant="outlined" className="w-100 my-2">
                                                    <TextField
                                                        id="ExternalStatusID"
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
                                                                    <MenuItem value={item.ExternalStatusID} key={i}>{item.ExternalStatus}</MenuItem>
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
                                                defaultValue={SearchOrder.StartDate}
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
                                                defaultValue={SearchOrder.EndDate}
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
                        <div className="col-sm-5">
                            <h6 className="text-center">Distribución de Todas las Ordenes</h6>
                            <div className="mx-auto" style={{ maxWidth: "225px" }}>
                                <Pie data={ChartData} className="mh-100" width={75} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 mx-3">
                        <div className="">
                            <div className="input-group mb-3 mw-100" style={{ width: "300px" }}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="SearchInput-label"><i className="fas fa-search"></i></span>
                                </div>
                                <input type="text" className="form-control" placeholder="Palabra clave..." aria-label="Palabra clave..." aria-describedby="SearchInput-label"
                                    value={SearchInput} onChange={handleChange} autoFocus />
                            </div>
                        </div>
                        <OrdersTable Orders={SearchResults} ParentCallback={HandleCallback} />
                    </div>
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
