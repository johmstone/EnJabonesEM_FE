/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import PropType from "prop-types";
import { Tooltip, message } from 'antd'
import { Context } from '../../store/appContext';
import { UpsertWebDirectory } from './upsertWebDirectory';
import WebDirectoryService from '../../services/webdirectory';

export const ListWebDirectory = (props) => {
    const { store, actions } = useContext(Context);
    const WebDirectorySVC = new WebDirectoryService();

    const ChangeStatus = (WD) => {
        //console.log(WD)
        let model = {
            WebID: WD.WebID,
            AppID: WD.AppID,
            DisplayName: WD.DisplayName,
            Controller: WD.Controller,
            Action: WD.Action,
            PublicMenu: WD.PublicMenu,
            AdminMenu: WD.AdminMenu,
            Parameter: WD.Parameter,
            Order: WD.Order,
            ActiveFlag: WD.ActiveFlag,
            ActionType: 'CHGST'
        }

        WebDirectorySVC.Upsert('Update', model).then(res => {
            if (res) {
                actions.uploadWDList();
            } else {
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        });
    }

    if (store.isLoading) {
        return (
            <div className="mx-2">
                <div className="spinner-border spinner-border-sm align-middle" role="status">
                    <span className="sr-only"></span>
                </div> Cargando...
            </div >
        )
    } else {
        return (
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
                        {props.WriteRight ? <th className="text-center align-middle py-2" colSpan="2"></th> : ''}
                    </tr>
                </thead>
                <tbody>
                    {
                        store.WDList.filter(src => src.AppID === props.AppID).map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td className="align-middle">{item.Controller}</td>
                                    <td className="text-center align-middle">{item.Action}</td>
                                    <td className="text-center align-middle">{item.PublicMenu ? "X" : ""}</td>
                                    <td className="text-center align-middle">{item.AdminMenu ? "X" : ""}</td>
                                    <td className="text-center align-middle">{item.DisplayName}</td>
                                    <td className="text-center align-middle">{item.Parameter}</td>
                                    <td className="text-center align-middle">{item.Order}</td>
                                    <td className={item.ActiveFlag ? "text-center align-middle font-weight-bolder text-success" : "text-center align-middle font-weight-bolder text-danger"}>{item.ActiveFlag ? "Activo" : "Inactivo"}</td>
                                    { props.WriteRight ?
                                        <td className="text-center align-middle">
                                            <UpsertWebDirectory isNew={false} WD={item} />
                                        </td> : null
                                    }
                                    { props.WriteRight ?
                                        <td className={item.ActiveFlag ? "text-center align-middle text-danger" : "text-center align-middle text-success"}>
                                            <Tooltip title={item.ActiveFlag ? "Desactivar" : "Activar"} color={item.ActiveFlag ? "red" : "green"} >
                                                <a onClick={() => ChangeStatus(item)}>
                                                    <i className="fas fa-repeat-alt"></i>
                                                </a>
                                            </Tooltip>
                                        </td> : null
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}
ListWebDirectory.propTypes = {
    AppID: PropType.number,
    WriteRight: PropType.bool
}