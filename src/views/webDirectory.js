/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";

import { Context } from '../store/appContext';
import WebDirectoryService from '../services/webdirectory';
import { Error } from '../component/error';
import { Loading } from '../component/loading';
import { UpsertWebDirectory } from '../component/upsertWebDirectory';

export const WebDirectory = (props) => {
    const { store, actions } = useContext(Context);
    const [Rights, setRights] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [AppID, setAppID] = useState(1);
    const [WDList, setWD] = useState([]);
    const WebDirectorySVC = new WebDirectoryService();
    const location = useLocation();

    const LoadPage = () => {
        const pathname = location.pathname.slice(1).split('/');
        let model = {
            Controller: pathname[0],
            Action: pathname[1] === undefined ? "Index" : pathname[1]
        }
        WebDirectorySVC.RightsValidation(model).then(res => {
            //console.log(res);
            setRights(res);
        });
        WebDirectorySVC.List(AppID).then(res => {
            setWD(res);
            setLoading(false);
        });
    }

    useEffect(() => {
        setLoading(true);
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const UpdateApp = e => {
        setAppID(e.target.value);
        setLoading(true);
        WebDirectorySVC.List(e.target.value).then(res => {
            setWD(res);
            setLoading(false);
        });
    }

    const handleSubmit = event => {
        event.preventDefault();
    }
    const ContentPage = () => {
        return (
            <section className="container">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">Web Directory</h2>
                    <p className="subtitle">Módulo de Gestion de Páginas</p>
                </div>
                <hr />
                <div className="d-flex justify-content-start my-2">
                    <form className="mx-2" onSubmit={handleSubmit}>
                        <div className="form-group input-group p-0 m-0 mw-100" style={{ width: "300px" }}>
                            <div className="input-group-prepend">
                                <label className="input-group-text">Directorio</label>
                            </div>
                            <select className="custom-select" value={AppID} onChange={(e) => UpdateApp(e)}>
                                <option value="1">No Autenticado</option>
                                <option value="2">Autenticado</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="mx-2">
                    {/* <a title="Agregar un nuevo Web Directory" className="btn btn-outline-secondary text-black m-0">
                        <i className="fas fa-plus-square fa-1x"></i> Agregar un nuevo Web Directory
                    </a> */}
                    <UpsertWebDirectory isNew={true} />
                </div>
                <div className="justify-content-start my-2">
                    <table className="table table-hover table-responsive-xl align-content-center p-0 mx-2">
                        <thead className="thead-dark">
                            <tr className="align-middle">
                                <th className="align-middle py-2">Controlador</th>
                                <th className="text-center align-middle py-2">Acción</th>
                                <th className="text-center align-middle py-2">Público</th>
                                <th className="text-center align-middle py-2">Administrativo</th>
                                <th className="text-center align-middle py-2">Display Name</th>
                                <th className="text-center align-middle py-2">Parametro</th>
                                <th className="text-center align-middle py-2">Orden</th>
                                <th className="text-center align-middle py-2">Status</th>
                                <th className="text-center align-middle py-2" colSpan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                WDList.map((item,i) => {
                                    return (
                                        <tr key={i}>
                                            <td className="align-middle">{ item.Controller }</td>
                                            <td className="text-center align-middle">{ item.Action }</td>
                                            <td className="text-center align-middle">{ item.PublicMenu ? "X" : "" }</td>
                                            <td className="text-center align-middle">{ item.AdminMenu ? "X" : "" }</td>
                                            <td className="text-center align-middle">{ item.DisplayName }</td>
                                            <td className="text-center align-middle">{ item.Parameter }</td>
                                            <td className="text-center align-middle">{ item.Order }</td>
                                            <td className={item.ActiveFlag ? "text-center align-middle font-weight-bolder text-success": "text-center align-middle font-weight-bolder text-danger"}>{ item.ActiveFlag ? "Activo" : "Inactivo" }</td>
                                            <td className="text-center align-middle">
                                                <UpsertWebDirectory isNew={false} />
                                            </td>
                                            <td className={item.ActiveFlag ? "text-center align-middle text-danger": "text-center align-middle text-success"}>
                                                <a title={item.ActiveFlag ? "Desactivar": "Activar"}>
                                                    <i className={item.ActiveFlag ? "fas fa-times": "fas fa-check"}></i>
                                                </a>                                                
                                            </td>
                                        </tr>
                                    )
                                })
                            }                            
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }

    if (store.isLogged) {
        if (isLoading) {
            return <Loading />
        } else if (Rights.ReadRight) {
            return <ContentPage />
        } else {
            return <Error Message='Usted no esta autorizado para ingresar a esta seccion, si necesita acceso contacte con un administrador.' />
        }
    } else {
        return <Redirect to={{ pathname: "/Login" }} />;
    }
};
