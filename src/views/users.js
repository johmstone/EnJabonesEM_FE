/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Tooltip } from 'antd';

import { Context } from '../store/appContext';

import WebDirectoryService from '../services/webdirectory';

import { Error } from '../component/error';
import { Loading } from '../component/loading';

export const Users = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const WebDirectorySVC = new WebDirectoryService();
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        LoadPage();
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
            if (src.ReadRight) {
                actions.UploadUsersList();
                setLoading(false);
            }
        });

    }

    const ChangeStatus = (model) => {
        console.log(model);
    }


    const ContentPage = () => {
        return (
            <section className="container">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="far fa-users"></i> Usuarios</h2>
                    <p className="subtitle">Módulo de Gestión de Usuarios</p>
                </div>
                <hr />
                <div className="mx-2">

                </div>
                <div className="justify-content-start my-2">
                    <table className="table table-hover table-responsive-xl align-content-center p-0 mx-2">
                        <thead className="thead-dark">
                            <tr className="align-middle">
                                <th className="align-middle py-2">Nombre</th>
                                <th className="align-middle py-2">Rol</th>
                                <th className="text-center align-middle py-2">Status</th>
                                <th className="text-center align-middle py-2">Validado</th>
                                {Rights.WriteRight ? <th className="text-center align-middle py-2" colSpan={4}>Acción</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                store.UsersList.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td className="align-middle">{item.FullName}</td>
                                            <td className="align-middle">{item.RoleName}</td>
                                            <td className={item.ActiveFlag ? "text-center align-middle font-weight-bolder text-success" : "text-center align-middle font-weight-bolder text-danger"}>{item.ActiveFlag ? "Activo" : "Inactivo"}</td>
                                            <td className={item.EmailValidated ? "text-center align-middle font-weight-bolder text-success" : "text-center align-middle font-weight-bolder text-danger"}>{item.EmailValidated ? "Validado" : "Pendiente"}</td>
                                            {Rights.WriteRight ?
                                                <td className="text-center align-middle">
                                                    <Tooltip title={item.ActiveFlag ? "Desactivar" : "Activar"} color={item.ActiveFlag ? "red" : "green"} >
                                                        <a onClick={() => ChangeStatus(item)}>
                                                            <i className="fas fa-repeat-alt"></i>
                                                        </a>
                                                    </Tooltip>
                                                </td> : null
                                            }
                                            {Rights.WriteRight ?
                                                <td className="text-center align-middle">
                                                    <Tooltip title="Perfil" color="blue">
                                                        <a>
                                                            <i class="fas fa-user-circle fa-1x" style={{ "vertical-align": "middle" }}></i>
                                                        </a>
                                                    </Tooltip>
                                                </td> : null
                                            }
                                            {Rights.WriteRight ?
                                                <td className="text-center align-middle">
                                                    <Tooltip title="Asignar nuevo rol" color="blue">
                                                        <a>
                                                            <i class="fas fa-user-edit fa-1x" style={{ "vertical-align": "middle" }}></i>
                                                        </a>
                                                    </Tooltip>
                                                </td> : null
                                            }
                                            {Rights.WriteRight ?
                                                <td className="text-center align-middle">
                                                    <Tooltip title="Restablecer Contraseña" color="green">
                                                        <a>
                                                            <i class="fas fa-key fa-1x" style={{ "vertical-align": "middle" }}></i>
                                                        </a>
                                                    </Tooltip>
                                                </td> : null
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody >
                    </table >
                </div >
            </section >
        )
    }
    if (store.isLoading || isLoading) {
        return <Loading />
    } else {
        if (store.isLogged) {
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
