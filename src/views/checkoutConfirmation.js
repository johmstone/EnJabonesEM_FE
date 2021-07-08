/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Card, Table } from 'antd';
import CurrencyFormat from 'react-currency-format';

import OrdersService from "../services/orders";

export const CheckOutConfirmation = () => {

    const OrderSVC = new OrdersService();

    const [isLoading, setLoading] = useState(false);
    const [OrderID] = useState(localStorage.getItem('LastOrderConfirmed'));
    const [Order, setOrder] = useState({});
    const [OrderDetails, setOrderDetails] = useState({});

    const columnsAdmin = [
        {
            title: '#',
            dataIndex: '',
            key: 'x',
            className: "text-center",
            render: (e, record, index) => (
                <p className="m-0 p-0">{index + 1}</p>
            ),
        },
        {
            title: 'Producto',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <p className="m-0 p-0">
                    {e.Name} - {e.ProductDetails.Qty} {e.ProductDetails.Symbol}
                </p>
            ),
        },
        {
            title: 'Cantidad',
            dataIndex: 'Qty',
            key: 'Qty',
            className: "text-center"
        },
        {
            title: 'Subtotal',
            dataIndex: '',
            key: 'x',
            className: "text-center",
            render: (e) => (
                <CurrencyFormat value={e.ProductDetails.Price * e.Qty} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={2} />
            ),
        }
    ]

    useEffect(() => {
        setLoading(true);
        OrderSVC.OrderDetails(OrderID).then(res => {
            console.log(res);
            console.log(JSON.parse(res.OrderDetails));
            setOrder(res);
            setOrderDetails(JSON.parse(res.OrderDetails));
            setLoading(false);
        });
    }, []);

    const DeliveryAddressComponent = () => {
        if (OrderDetails.DeliveryAddress.ContactName === undefined) {
            return (
                <p className="m-0">Recoger en Tienda</p>
            )
        } else {
            return (
                <>
                    <p className="m-0"><b>Atención:</b> <span className="font-italic">{OrderDetails.DeliveryAddress.ContactName}</span></p>
                    <p className="m-0"><b>Teléfono:</b> {OrderDetails.DeliveryAddress.PhoneNumber}</p>
                    <p className="m-0  withoutWhiteSpace">{OrderDetails.DeliveryAddress.Street}</p>
                    <p className="m-0">{OrderDetails.DeliveryAddress.Canton}, {OrderDetails.DeliveryAddress.District}</p>
                    <p className="m-0">{OrderDetails.DeliveryAddress.Province}, CR {OrderDetails.DeliveryAddress.CostaRicaID}</p>
                </>
            )
        }
    }

    const FacturationInfo = () => {
        return (
            <>
                <h6 className="text-primary">{OrderDetails.FacturationInfo.FullName}</h6>
                <p className="m-0">{OrderDetails.FacturationInfo.IdentityType}: {OrderDetails.FacturationInfo.IdentityID}</p>
                <p className="m-0">Teléfono: {OrderDetails.FacturationInfo.PhoneNumber}</p>
                <p className="m-0">Email: {OrderDetails.FacturationInfo.Email}</p>
                <p className="m-0  withoutWhiteSpace">{OrderDetails.FacturationInfo.Street}</p>
                <p className="m-0">{OrderDetails.FacturationInfo.Canton}, {OrderDetails.FacturationInfo.District}</p>
                <p className="m-0">{OrderDetails.FacturationInfo.Province}, CR {OrderDetails.FacturationInfo.CostaRicaID}</p>
                <p className="m-0">Pago Realizado por: {OrderDetails.PaymentMethod}</p>
                <p className="m-0">Comprobante #: {OrderDetails.ProofPayment}</p>
            </>
        )
    }

    const ContentPage = () => {
        return (
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">CheckOut</h2>
                    <p className="subtitle">Confirmación de Pedido</p>
                </div>
                <hr />

                <div className="card-success mw-100" style={{ width: '500px' }}>
                    <div className="upper-side bg-primary">
                        <i className="fa fa-check fa-2x" />
                        <h4 className="m-0 text-white"> Pedido Exitoso </h4>
                    </div>
                    <Card hoverable>
                        <h2 className="card-message text-font-base">Su pedido fue procesado exitosamente</h2>
                        <div className="my-4">                            
                            <Card hoverable>
                                <h6 className="text-font-base text-uppercase">Orden</h6>
                                <h5 className="text-primary text-font-base">{Order.OrderID}</h5>
                            </Card>
                        </div>
                        <div className="my-4">
                            <h6 className="text-font-base text-uppercase">Detalle del Pedido</h6>
                            <Card hoverable className='Orderdetails'>
                                <Table
                                    columns={columnsAdmin}
                                    rowKey={record => record.ProductID}
                                    dataSource={OrderDetails.Products}
                                    pagination={false}
                                />
                            </Card>
                        </div>
                        <div className="my-4">
                            <h6 className="text-font-base text-uppercase">Total del Carrito</h6>
                            <Card hoverable>
                                <table className="table table-borderless m-0">
                                    <tbody>
                                        <tr>
                                            <td className='p-0 text-font-base'>SubTotal</td>
                                            <td className='p-0'>
                                                <CurrencyFormat value={OrderDetails.TotalCart}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={2}
                                                    className="text-font-base m-0 text-primary" />
                                            </td>
                                        </tr>
                                        <tr className="border-bottom">
                                            <td className='p-0 text-font-base'>Envío</td>
                                            <td className='p-0'>
                                                <CurrencyFormat value={OrderDetails.TotalDelivery}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={2}
                                                    className="text-font-base m-0 text-primary" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='p-0 text-font-base text-uppercase font-weight-bolder'>Total</td>
                                            <td className='p-0'>
                                                <CurrencyFormat value={OrderDetails.TotalCart + OrderDetails.TotalDelivery}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={2}
                                                    className="text-font-base m-0 text-primary font-weight-bolder" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        <div className="justify-content-start my-4">
                            <h6 className="text-font-base text-uppercase">Dirección de Envío</h6>
                            <Card hoverable>
                                <DeliveryAddressComponent />
                            </Card>
                        </div>
                        <div className="justify-content-start my-4">
                            <h6 className="text-font-base text-uppercase">Detalle Facturación y Pago</h6>
                            <Card hoverable>
                                <FacturationInfo />
                            </Card>
                        </div>
                    </Card>
                </div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">CheckOut</h2>
                    <p className="subtitle">Confirmación de Pedido</p>
                </div>
                <hr />
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
