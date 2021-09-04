/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Modal } from 'antd';

import OrdersService from "../services/orders";

export const OrderPaidConfirmation = () => {

    const OrderSVC = new OrdersService();
    const params = useParams();

    const [isLoading, setLoading] = useState(true);
    const [Order, setOrder] = useState({});
    const [Confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        setLoading(true);
        OrderSVC.OrderDetails(params.OrderID).then(res => {
            console.log(res);
            console.log(JSON.parse(res.OrderDetails));
            setConfirmed(res.OrderVerified);
            setOrder(res);
            setLoading(false);
        });
    }, [])


    const confirm = () => {
        Modal.confirm({
            icon: <i className="fas fa-exclamation-circle fa-3x text-warning text-center" />,
            content: 'Esta seguro que desea validar esta información???',
            okText: 'Confirmar',
            cancelText: 'Cancelar',
            className: 'modal-text-center',
            onOk() {
                OrderSVC.PaidConfirmation(params.APIKey).then(res => {
                    setConfirmed(res);
                });
            }
        });
    }

    const ConfirmedContent = () => {
        if (Confirmed) {
            return (
                <div className="text-center mb-4">
                    <h3 className="text-success">
                        Gracias!!! Informacion validada...
                    </h3>
                </div>
            )
        } else {
            return (
                <div className="text-center mb-4">
                    <button className="btn card-btn-success btn-outline-primary mx-auto py-2"
                        type="button"
                        onClick={confirm} style={{ top: "0" }}>
                        Validar Información
                    </button>
                </div>
            )
        }
    }

    const ContentPage = () => {
        return (
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">Confirmación de Orden</h2>
                    <p className="subtitle">Validación de Información</p>
                </div>
                <hr className="hr-div" />
                <div className="container text-font-base table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>
                                    <h4 className="m-0 text-white">Descripción</h4>
                                </th>
                                <th align="center">
                                    <h4 className="m-0 text-center text-white">Valor</h4>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p className="m-0 font-weight-bold">OrdenID:</p>
                                </td>
                                <td align="center">
                                    <p className="m-0">{params.OrderID}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="m-0">Método de Pago:</p>
                                </td>
                                <td align="center">
                                    <p className="m-0">{Order.OrderType}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="m-0">Comprobante:</p>
                                </td>
                                <td align="center">
                                    <p className="m-0">{Order.ProofPayment}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ConfirmedContent />

            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">Confirmación de Orden</h2>
                    <p className="subtitle">Validación de Información</p>
                </div>
                <hr className="hr-div" />
                <div className="text-center text-black-50">
                    <h2 className="text-black-50">Cargando...</h2>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            </section>
        )
    } else {
        return <ContentPage />
    }
};
