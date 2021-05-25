/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";

import { Context } from '../store/appContext';
import WebDirectoryService from '../services/webdirectory';
import { Error } from '../component/error';
import { Loading } from '../component/loading';
import { UpsertWebDirectory } from '../component/webdirectory/upsertWebDirectory';
import { ListWebDirectory } from '../component/webdirectory/listwebdirectory';

export const WebDirectory = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [AppID, setAppID] = useState(1);
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
            return res;
        }).then(src => {
            if (src.ReadRight) {
                actions.uploadWDList();
                setLoading(false);
            }
        });

    }

    useEffect(() => {
        setLoading(true);
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ContentPage = () => {
        return (
            <section className="container">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">Web Directory</h2>
                    <p className="subtitle">Módulo de Gestión de Páginas</p>
                </div>
                <hr />
                <div className="d-flex justify-content-start my-2">
                    <form className="mx-2">
                        <div className="form-group input-group p-0 m-0 mw-100" style={{ width: "300px" }}>
                            <div className="input-group-prepend">
                                <label className="input-group-text">Directorio</label>
                            </div>
                            <select className="custom-select" value={AppID} onChange={(e) => setAppID(e.target.value)}>
                                <option value={1}>No Autenticado</option>
                                <option value={2}>Autenticado</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="mx-2">
                    {Rights.WriteRight ? <UpsertWebDirectory isNew={true} /> : ''}
                </div>
                <div className="justify-content-start my-2">
                    <ListWebDirectory AppID={parseInt(AppID)} WriteRight={Rights.WriteRight} />
                </div>
            </section>
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
