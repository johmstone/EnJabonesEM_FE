/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Modal, Button, Tooltip } from 'antd';
import Card from '@material-ui/core/Card';
import { CardActions, CardContent } from "@material-ui/core";

import UsersService from '../../services/users';

import { AddFacturationInfo } from '../users/addFacturationInfo';

export const ChangeFacturationInfo = (props) => {

    const UserSVC = new UsersService();

    const [isLoading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [UserID, setUserID] = useState(0);
    const [FactInfos, setFactInfos] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (isModalVisible) {
            LoadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    const LoadData = () => {
        let User = JSON.parse(localStorage.getItem('User'));
        setUserID(User.UserID);
        UserSVC.UsersAddress('FacturationInfo', User.UserID).then(res => {
            setFactInfos(res);
            setLoading(false);
        });
    }

    const CHGFactInfo = () => {
        setIsModalVisible(true)
    }

    const SelectAddress = (Address) => {
        props.parentCallback(Address);
        setIsModalVisible(false);
    }

    const HandleCallback = (ChildData) => {
        if (ChildData) {
            setLoading(true);
            LoadData();
        }
    }

    const ContentPage = () => {
        if (isLoading) {
            return (
                <div className="text-center text-black-50">
                    <h2 className="text-black-50">Cargando...</h2>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            )
        } else {
            if (FactInfos.length > 0) {
                return (
                    <>
                        <div className="scrolldown-vertical">
                            <div className="row m-0">
                                {
                                    FactInfos.map((item, i) => {
                                        return (
                                            <div className='cardhorizontal m-2' key={i}>
                                                <Card className="bg-light">
                                                    <CardContent className="pt-3 px-3 pb-0">
                                                        <div className="row m-0 w-100">
                                                            <p className="font-weight-bold m-0 font-italic">{item.FullName}</p>
                                                            <div className="float-right ml-auto mr-0 my-0">
                                                                {
                                                                    item.PrimaryFlag ?
                                                                        (
                                                                            <p className="font-size-small p-1 m-0 text-primary">
                                                                                <i className="fas fa-tag align-middle"></i> Principal
                                                                            </p>
                                                                        ) : null
                                                                }
                                                            </div>
                                                        </div>
                                                        <p className="m-0">{item.IdentityType}: {item.IdentityID}</p>
                                                        <p className="m-0">Teléfono: {item.PhoneNumber}</p>
                                                        <p className="m-0">Email: {item.Email}</p>
                                                        <p className="m-0  withoutWhiteSpace">{item.Street}</p>
                                                        <p className="m-0">{item.Canton}, {item.District}</p>
                                                        <p className="m-0">{item.Province}, CR {item.CostaRicaID}</p>

                                                    </CardContent>
                                                    <CardActions className="px-3 pt-0 text-center">
                                                        <Button type="dashed" shape="round" className="mx-auto text-uppercase" onClick={() => SelectAddress(item)}>
                                                            Seleccionar
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="my-2">
                                <AddFacturationInfo UserID={UserID} btnLegend='Agregar Información' NeedResult={true} parentCallback={HandleCallback} />
                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <div className="row m-0">
                        <div className="my-2">
                            <AddFacturationInfo UserID={UserID} btnLegend='Agregar Información' NeedResult={true} parentCallback={HandleCallback} />
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <div>
            <Tooltip title="Cambiar Información" color="blue" placement="right">
                <u>
                    <a onClick={() => CHGFactInfo()} className="cursor-pointer">
                        Cambiar
                    </a>
                </u>
            </Tooltip>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">Opciones de Facturación
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}
                destroyOnClose>
                <ContentPage />
            </Modal>
        </div>
    );
}

ChangeFacturationInfo.propTypes = {
    parentCallback: PropType.func
};