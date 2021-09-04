/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import PropType from "prop-types";


import { Card, Table, Modal } from 'antd';
import CurrencyFormat from 'react-currency-format';

export const OrdersDetails = props => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [OrderDetails] = useState(JSON.parse(props.Order.OrderDetails))

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
            key: 'y',
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
            key: 'w',
            className: "text-center",
            render: (e) => (
                <CurrencyFormat value={e.ProductDetails.Price * e.Qty} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={2} />
            ),
        }
    ]

    const DeliveryAddressComponent = () => {
        if (OrderDetails.DeliveryAddress.ContactName === undefined) {
            return (
                <p className="m-0"><i className="fas fa-map-marker-alt"></i> Recoger en Tienda</p>
            )
        } else {
            return (
                <div key="DelAddress">
                    <p className="m-0"><i className="fas fa-user"></i> <span className="font-italic">{OrderDetails.DeliveryAddress.ContactName}</span></p>
                    <p className="m-0"><i className="fas fa-phone-alt"></i> {OrderDetails.DeliveryAddress.PhoneNumber}</p>
                    <p className="m-0  withoutWhiteSpace"><i className="fas fa-map-marker-alt"></i> {OrderDetails.DeliveryAddress.Street}</p>
                    <p className="m-0">{OrderDetails.DeliveryAddress.Canton}, {OrderDetails.DeliveryAddress.District}</p>
                    <p className="m-0">{OrderDetails.DeliveryAddress.Province}, CR {OrderDetails.DeliveryAddress.CostaRicaID}</p>
                </div>
            )
        }
    }

    const FacturationInfo = () => {
        return (
            <div key="factInfo">
                <h6 className="text-primary">{OrderDetails.FacturationInfo.FullName}</h6>
                <p className="m-0"><i className="fas fa-user"></i> {OrderDetails.FacturationInfo.IdentityType}</p>
                <p className="m-0"><i className="fas fa-user"></i> {OrderDetails.FacturationInfo.IdentityID}</p>
                <p className="m-0"><i className="fas fa-phone-alt"></i> {OrderDetails.FacturationInfo.PhoneNumber}</p>
                <p className="m-0"><i className="fas fa-envelope"></i> {OrderDetails.FacturationInfo.Email}</p>
                <p className="m-0  withoutWhiteSpace"><i className="fas fa-map-marker-alt"></i> {OrderDetails.FacturationInfo.Street}</p>
                <p className="m-0">{OrderDetails.FacturationInfo.Canton}, {OrderDetails.FacturationInfo.District}</p>
                <p className="m-0">{OrderDetails.FacturationInfo.Province}, CR {OrderDetails.FacturationInfo.CostaRicaID}</p>

            </div>
        )
    }

    const BtnExec = () => {
        if (props.BtnType === 'Button') {
            return (
                <button className="btn card-btn-success btn-outline-primary mx-auto py-2"
                    type="button"
                    onClick={showModal}
                    style={{ top: "0" }}>
                    {props.BtnLabel}
                </button>
            )
        } else {
            return (
                <a className="text-primary" onClick={showModal}>
                    {props.BtnLabel}
                </a>
            )
        }

    }

    return (
        <div key="OrderDetails">
            <BtnExec />
            <Modal
                title={[
                    <>
                        <h2 className="text-white text-center m-0 font-weight-bolder">Orden #</h2>
                        <h2 className="text-white text-center m-0">{props.Order.OrderID}</h2>
                    </>
                ]}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={false}
                className='mw-90 ModalOrderdetails'
            >
                <div className="">
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
                <div className="mt-4 mb-0">
                    <div className="row m-0">
                        <div className="col-md-6 col-Address-Facturation">
                            <div className="">
                                <h6 className="text-font-base text-uppercase">Total del Carrito</h6>
                                <Card hoverable>
                                    <table className="table table-borderless m-0">
                                        <tbody>
                                            <tr data-row-key="subtotal">
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
                                            <tr data-row-key="delivery" className="border-bottom">
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
                                            <tr data-row-key="total">
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
                                            <tr data-row-key="empty">
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr data-row-key="paymentmethod">
                                                <td className='p-0 text-font-base'>Método de Pago</td>
                                                <td className='p-0'>
                                                    <span className="text-font-base m-0 text-primary">
                                                        {OrderDetails.PaymentMethod}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr data-row-key="proofpayment">
                                                <td className='p-0 text-font-base'>Comprobante</td>
                                                <td className='p-0'>
                                                    <span className="text-font-base m-0 text-primary">
                                                        {OrderDetails.ProofPayment}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card>
                            </div>
                            <div className="mt-3 mb-0">
                                <h6 className="text-font-base text-uppercase">Dirección de Envío</h6>
                                <Card hoverable>
                                    <DeliveryAddressComponent />
                                </Card>
                            </div>
                        </div>
                        <div className="col-md-6 col-Address-Facturation">
                            <h6 className="text-font-base text-uppercase">Datos Facturación</h6>
                            <Card hoverable>
                                <FacturationInfo />
                            </Card>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
OrdersDetails.propTypes = {
    Order: PropType.object,
    BtnType: PropType.string,
    BtnLabel: PropType.string
};