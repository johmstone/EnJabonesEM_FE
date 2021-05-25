/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";

import { Context } from '../store/appContext';

import WebDirectoryService from '../services/webdirectory';

import { Error } from '../component/error';
import { Loading } from '../component/loading';
import { AddNewRole } from '../component/roles/addnewrole';
import { RightsRole } from '../component/roles/rightsrole';

export const Roles = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
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
                actions.UploadRoleList();
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
                    <h2 className="m-0">Roles</h2>
                    <p className="subtitle">Módulo de Gestión de Roles</p>
                </div>
                <hr />
                <div className="mx-2">
                    {Rights.WriteRight ? <AddNewRole /> : null}
                </div>
                <div className="justify-content-start my-2">
                    <table className="table table-hover table-responsive-xl align-content-center p-0 mx-2">
                        <thead className="thead-dark">
                            <tr className="align-middle">
                                <th className="align-middle py-2">Rol</th>
                                <th className="text-center align-middle py-2">Descripción</th>
                                {Rights.WriteRight ? <th className="text-center align-middle py-2"></th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                store.RoleList.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td className="align-middle">{item.RoleName}</td>
                                            <td className="align-middle">{item.RoleDescription}</td>
                                            {Rights.WriteRight ?
                                                <td className="text-center align-middle" style={{ width: "160px" }}>
                                                    <RightsRole Role={item} />
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
