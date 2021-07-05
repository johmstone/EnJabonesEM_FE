/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import PropType from "prop-types";
import CurrencyFormat from 'react-currency-format';
import { Card, Table } from 'antd';

import { Context } from '../../store/appContext';

export const CheckOutOrderDetails = (props) => {

    const { store } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [TotalCart, setTotalCart] = useState(0);
    const [Delivery, setDelivery] = useState({});
    const [TotalDelivery, setTotalDelivery] = useState(0);

    useEffect(() => {
        setLoading(true);
        if (props.OrderDetails.TotalCart !== undefined) {
            LoadPage();
        }
    }, [props.OrderDetails]);

    useEffect(() => {
        if (Delivery.DeliveryAddressID === undefined) {
            setTotalDelivery(0);
        } else {
            if (Delivery.GAMFlag) {
                setTotalDelivery(3000)
            } else {
                setTotalDelivery(5000)
            }
        }

    }, [Delivery]);

    const LoadPage = () => {
        setTotalCart(props.OrderDetails.TotalCart);
        setDelivery(props.OrderDetails.DeliveryAddress);
        setTotalDelivery(props.OrderDetails.TotalDelivery);
        setLoading(false);               
    }
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

    const DeliveryAddressComponent = () => {
        if (Delivery.DeliveryAddressID === undefined) {
            return (
                <p className="m-0">Recoger en Tienda</p>
            )
        } else {
            return (
                <>
                    <p className="m-0"><b>Atención:</b> <span className="font-italic">{Delivery.ContactName}</span></p>
                    <p className="m-0"><b>Teléfono:</b> {Delivery.PhoneNumber}</p>
                    <p className="m-0  withoutWhiteSpace">{Delivery.Street}</p>
                    <p className="m-0">{Delivery.Canton}, {Delivery.District}</p>
                    <p className="m-0">{Delivery.Province}, CR {Delivery.CostaRicaID}</p>
                </>
            )
        }
    }

    const ContentPage = () => {
        return (
            <>
                <h6 className="text-font-base text-uppercase">Detalle del Pedido</h6>
                <Card hoverable className='Orderdetails'>
                    <Table
                        columns={columnsAdmin}
                        rowKey={record => record.ProductID}
                        dataSource={store.ShopCart}
                        pagination={false}
                    />
                </Card>
                <div className="my-4">
                    <h6 className="text-font-base text-uppercase">Total del Carrito</h6>
                    <Card hoverable>
                        <table className="table table-borderless m-0">
                            <tbody>
                                <tr>
                                    <td className='p-0'>SubTotal</td>
                                    <td className='p-0 text-right'>
                                        <CurrencyFormat value={TotalCart}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₡"}
                                            decimalScale={2}
                                            className="text-font-base m-0 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='p-0'>Envío</td>
                                    <td className='p-0 text-right'>
                                        <CurrencyFormat value={TotalDelivery}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₡"}
                                            decimalScale={2}
                                            className="text-font-base m-0 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='p-0 text-font-base font-weight-bold text-uppercase fa-15x'>Total</td>
                                    <td className='p-0 text-right'>
                                        <CurrencyFormat value={TotalCart + TotalDelivery}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₡"}
                                            decimalScale={2}
                                            className="text-font-base m-0 text-primary font-weight-bold fa-15x" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='p-0'>Tipo de Cambio</td>
                                    <td className='p-0 text-right'>
                                         <p className="text-font-base m-0 text-primary">
                                             <b>1.00 USD = {props.ExchangeRate} CRC</b>
                                         </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='p-0'>Total Aprox. $</td>
                                    <td className='p-0 text-right'>
                                        <CurrencyFormat value={(TotalCart + TotalDelivery)/props.ExchangeRate}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"$"}
                                            decimalScale={2}
                                            className="text-font-base m-0 text-primary" />
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
            </>
        )
    }

    if (isLoading) {
        return (
            <>
                <h6 className="text-font-base text-uppercase">Detalle del Pedido</h6>
                <Card hoverable>
                    <div className="text-center text-black-50">
                        <h2 className="text-black-50">Cargando...</h2>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                </Card>
            </>
        )
    } else {
        return <ContentPage />
    }

}
CheckOutOrderDetails.propTypes = {
    OrderDetails: PropType.object,
    ExchangeRate: PropType.number
};