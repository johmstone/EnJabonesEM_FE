/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropType from "prop-types";
import { Modal, Button, Tooltip } from 'antd';
import Card from '@material-ui/core/Card';
import { CardActions, CardContent } from "@material-ui/core";

import AuthenticationService from '../../services/authentication';
import UsersService from '../../services/users';

import { AddDeliveryAddressUser } from '../users/addDeliveryAddressUser';

export const ChangeDeliveryAddress = (props) => {

    const AuthSVC = new AuthenticationService();
    const UserSVC = new UsersService();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const [isLoading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [UserID, setUserID] = useState(0);
    const [DeliveryAddresses, setDeliveryAddresses] = useState([]);


    useEffect(() => {
        setLoading(true);
        if (isLogin && isModalVisible) {
            LoadData();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    const LoadData = () => {
        let User = JSON.parse(localStorage.getItem('User'));
        setUserID(User.UserID);
        UserSVC.UsersAddress('DeliveryAddress', User.UserID).then(res => {
            setDeliveryAddresses(res);
        });
        setLoading(false);
    }

    const ChangeDeliveryAddress = () => {
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

    const SetLocalPickUp = () => {
        props.parentCallback({});
        setIsModalVisible(false);
    }
    const InviteUser = () => {

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
            if (isLogin && DeliveryAddresses.length > 0) {
                return (
                    <>
                        <div className="scrolldown-vertical">
                            <div className="row m-0">
                                {
                                    DeliveryAddresses.map((item, i) => {
                                        return (
                                            <div className='cardhorizontal m-2' key={i}>
                                                <Card className="bg-light">
                                                    <CardContent className="pt-3 px-3 pb-0">
                                                        <div className="row m-0 w-100">
                                                            <p className="font-weight-bold m-0 font-italic">{item.ContactName}</p>
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
                                                        <p className="m-0">Teléfono: {item.PhoneNumber}</p>
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
                            <div className="my-2 mr-3">
                                <button className="btn btn-sm btn-link mx-0 px-0 vertical-center" onClick={() => SetLocalPickUp()}>
                                    <i className="far fa-map-marker-plus"></i> Recoger en Tienda
                                </button>
                            </div>
                            <div className="my-2">
                                <AddDeliveryAddressUser UserID={UserID} NeedResult={true} parentCallback={HandleCallback} />
                            </div>
                        </div>
                    </>
                )
            } else if (isLogin && DeliveryAddresses.length === 0) {
                return (
                    <div className="row m-0">
                        <div className="my-2 mr-3">
                            <button className="btn btn-sm btn-link mx-0 px-0 vertical-center" onClick={() => SetLocalPickUp()}>
                                <i className="far fa-map-marker-plus"></i> Recoger en Tienda
                            </button>
                        </div>
                        <div className="my-2">
                            <AddDeliveryAddressUser UserID={UserID} NeedResult={true} parentCallback={HandleCallback} />
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className='Addresses'>
                        <div className="row row-cols-2 m-0">
                            <div className="col">
                                <Card variant="outlined">
                                    <CardContent className="text-center">
                                        <Link to="/Login" className="text-font-base mx-auto">
                                            <div className="my-5">
                                                <i className="fas fa-sign-in-alt fa-2x"></i>
                                                <br />
                                                <span>Ingresar</span>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col">
                                <Card variant="outlined" className="col">
                                    <CardContent className="text-center">
                                        <a className="text-font-base mx-auto" onClick={() => InviteUser()}>
                                            <div className="my-5">
                                                <i className="far fa-user fa-2x"></i>
                                                <br />
                                                <span>Seguir de Invitado</span>
                                            </div>
                                        </a>
                                    </CardContent>
                                </Card>
                            </div>
                            {/* <AddDeliveryAddressUser UserID={props.UserID} NeedResult={true} parentCallback={HandleCallback}/> */}
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <div>
            <Tooltip title="Cambiar Dirección" color="blue" placement="right">
                <u>
                    <a onClick={() => ChangeDeliveryAddress()} className="cursor-pointer">
                        Cambiar
                    </a>
                </u>
            </Tooltip>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">Dirección de Envío
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

ChangeDeliveryAddress.propTypes = {
    parentCallback: PropType.func
};