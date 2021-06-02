import React, { useEffect, useState } from "react";
import PropType from "prop-types";
import Card from '@material-ui/core/Card';
import { CardActions, CardContent } from "@material-ui/core";
import { Tooltip, message, Modal } from 'antd';

import UsersService from '../../services/users';

import { AddFacturationInfo } from './addFacturationInfo';

export const FacturationInfoUser = (props) => {

    const UsersSVC = new UsersService();

    const [ChangeState, setChangeState] = useState(0);
    const [FactInfo, setFactInfo] = useState([]);

    useEffect(() => {
        LoadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ChangeState]);

    const LoadData = () => {
        UsersSVC.UsersFacturationInfo(props.UserID).then(res => {
            //console.log(res)
            setFactInfo(res);
        });
    }

    const MakePrincipal = (item) => {
        let UpdateInfo = { ...item, ActionType: 'SETPRIMARY' }
        UsersSVC.UpsertFacturationInfo(UpdateInfo, "Update").then(res => {
            if (res) {
                setChangeState(2);
            } else {
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        })
    }

    const DisableAddres = (item) => {
        console.log(item);
        const { confirm } = Modal;
        confirm({
            content: 'Esta seguro que quiere eliminar estos datos de facturación???',
            onOk() {
                let UpdateInfo = { ...item, ActionType: 'DISABLE' }
                UsersSVC.UpsertFacturationInfo(UpdateInfo, "Update").then(res => {
                    if (res) {
                        setChangeState(1);
                    } else {
                        message.error({
                            content: "Ocurrio un error inesperado, intente de nuevo!!!",
                            style: {
                                marginTop: "30vh"
                            }
                        });
                    }
                });
            },
            okText: 'Si',
            cancelText: 'No',
        });
    }

    if (FactInfo.length > 0) {
        return (
            <div className='Addresses'>
                <h5 className="mt-3 mx-3 mb-0">Información de Facturación</h5>
                <div className="scrolldown-vertical">
                    <div className="row m-0">
                        {
                            FactInfo.map((item, i) => {
                                return (
                                    <div className='cardhorizontal m-2' key={i}>
                                        <Card className="bg-light">
                                            <CardContent className="pt-3 px-3 pb-0">
                                                <div className="row m-0 w-100">
                                                    <p className="font-weight-bold m-0 font-italic">{item.FullName}</p>
                                                    {/* <EditDeliveryAddressInfoUser Address={item} /> */}
                                                </div>
                                                <p className="m-0">{item.IdentityType}: {item.IdentityID}</p>
                                                <p className="m-0">Teléfono: {item.PhoneNumber}</p>
                                                <p className="m-0 withoutWhiteSpace">Dirección: {item.Street}, {item.District}, {item.Canton}, {item.Province}, CR {item.CostaRicaID}</p>
                                            </CardContent>
                                            <CardActions className="px-3 pt-0">
                                                {
                                                    item.PrimaryFlag ?
                                                        (
                                                            <p className="font-size-small p-1 m-0 text-primary">
                                                                <i className="fas fa-tag align-middle"></i> Facturación Principal
                                                            </p>
                                                        ) :
                                                        (
                                                            <Tooltip title="Marcar como Principal" color="red">
                                                                <p className="font-size-small p-1 m-0 text-danger cursor-pointer" onClick={() => MakePrincipal(item)}>
                                                                    <i className="fas fa-tag align-middle"></i> Marcar como Principal
                                                                </p>
                                                            </Tooltip>
                                                        )
                                                }
                                                <Tooltip title="Eliminar" color="red">
                                                    <p className="font-size-small p-1 m-0 text-danger cursor-pointer float-right ml-auto mr-0" onClick={() => DisableAddres(item)}>
                                                        <i className="far fa-trash-alt"></i>
                                                    </p>
                                                </Tooltip>
                                            </CardActions>
                                        </Card>
                                    </div>
                                )
                            })
                        }

                        <div className='cardhorizontal m-2 AddNewAddress'>
                            <Card className="bg-light">
                                <CardContent className="p-3">
                                    <AddFacturationInfo UserID={props.UserID} btnLegend="Agregar Info"/>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='Addresses'>
                <h5>Direcciones de Envio</h5>
                <div className="scrolldown-vertical">
                    <div className="row m-0">
                        <AddFacturationInfo UserID={props.UserID} btnLegend="Agregar Información de Facturación" />                        
                    </div>
                </div>
            </div>
        )
    }


}
FacturationInfoUser.propTypes = {
    UserID: PropType.number,
    WriteRight: PropType.bool
};