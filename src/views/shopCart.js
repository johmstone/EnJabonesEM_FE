/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import { Tooltip, Table, Button, Modal } from 'antd';

import { Context } from '../store/appContext';

import AuthenticationService from '../services/authentication';

import { Loading } from '../component/loading';
import { ChangeDeliveryAddress } from '../component/shopCart/changeDeliveryAddress';

export const ShopCart = () => {

    const AuthSVC = new AuthenticationService();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { store, actions } = useContext(Context);
    const [TotalCart, setTotalCart] = useState(0);
    const [Delivery, setDelivery] = useState({});
    const [TotalDelivery, setTotalDelivery] = useState(0);
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let subtotal = 0;
        store.ShopCart.forEach((e) => {
            subtotal += e.ProductDetails.Price * e.Qty
        });
        setTotalCart(subtotal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.ShopCart]);


    const LoadPage = () => {
        let shopcart = JSON.parse(localStorage.getItem('ShopCart'));
        if (store.ShopCart.length === 0 && shopcart !== null) {
            actions.UpdateShopCart();
        }
    }

    const DeliveryAddress = () => {
        if (Delivery.DeliveryAddressID === undefined) {
            return (
                <p className="m-0">Recogida Local</p>
            )
        } else {
            return (
                <>
                    <p className="font-weight-bold m-0 font-italic">{Delivery.ContactName}</p>
                    <p className="m-0">Teléfono: {Delivery.PhoneNumber}</p>
                    <p className="m-0  withoutWhiteSpace">{Delivery.Street}</p>
                    <p className="m-0">{Delivery.Canton}, {Delivery.District}</p>
                    <p className="m-0">{Delivery.Province}, CR {Delivery.CostaRicaID}</p>
                </>
            )
        }
    }

    const handleCallback = (childData) => {
        if (childData) {
            setDelivery(childData);
        }
    }

    const Delete = (item) => {
        //console.log(item);
        const { confirm } = Modal;
        confirm({
            content: 'Esta seguro que quiere eliminar este producto???',
            onOk() {
                actions.RemoveItemShopCart(item.ProductID);
            },
            okText: 'Si',
            cancelText: 'No',
        });
    }

    const columnsAdmin = [
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title="Eliminar" color="red" >
                    <a onClick={() => Delete(e)} className="text-danger">
                        <i className="fas fa-times align-middle"></i>
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Producto',
            // className: 'fomulacolum',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <div className="row">
                    <img alt={e.Name} src={e.PhotoURL} width="100px" className="rounded" />
                    <p className="mx-2 my-auto">
                        {e.Name} - {e.ProductDetails.Qty} {e.ProductDetails.Symbol}
                    </p>
                </div>
            ),
        },
        {
            title: 'Precio',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <CurrencyFormat value={e.ProductDetails.Price} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} />
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
            render: (e) => (
                <CurrencyFormat value={e.ProductDetails.Price * e.Qty} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} />
            ),
        }
    ]

    const ContentPage = () => {
        return (
            <section className="container">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="fas fa-shopping-basket align-middle"></i> Carrito de Compras</h2>
                    <p className="subtitle"></p>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="justify-content-start my-2">
                            <Table
                                columns={columnsAdmin}
                                rowKey={record => record.ProductID}
                                dataSource={store.ShopCart}
                                scroll={{ x: 'max-content' }}
                                pagination={false}
                            />
                            <p className="mx-2 mb-0">Total de Productos: {store.ShopCart.length}</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="justify-content-start my-2 border border-dark">
                            <div className="m-3">
                                <h6 className="text-font-base text-uppercase">Total del Carrito</h6>
                                <hr className="mt-1" />
                                <table className="table table-hover table-borderless">
                                    <tbody>
                                        <tr>
                                            <td className='px-0' colSpan={2}>SubTotal</td>
                                            <td className='px-0 text-right'>
                                                <CurrencyFormat value={TotalCart}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={0}
                                                    className="text-font-base m-0 text-primary" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='px-0' style={{ width: "60px" }}>
                                                <p className="m-0 font-weight-bold">Envío</p>
                                            </td>
                                            <td className='px-0'>
                                                <DeliveryAddress />
                                                <ChangeDeliveryAddress parentCallback={handleCallback} />
                                            </td>
                                            <td className='px-0 text-right'>
                                                <CurrencyFormat value={TotalDelivery}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={0}
                                                    className="text-font-base m-0 text-primary" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='px-0 text-font-base font-weight-bold text-uppercase fa-15x' colSpan={2}>Total</td>
                                            <td className='px-0 text-right'>
                                                <CurrencyFormat value={TotalCart + TotalDelivery}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={0}
                                                    className="text-font-base m-0 text-primary font-weight-bold fa-15x" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="text-center">
                                    <Button type="primary" shape="round" className="mx-2 text-uppercase">
                                        <i className="fas fa-check mr-2"></i> Finalizar Compra
                                    </Button>
                                    <div className='my-2 conditions-txt'>
                                        <p className="m-0">
                                            Al realizar tu pedido, aceptas la política de privacidad y las <Link to='/Policies'>condiciones de uso</Link>.
                                        </p>
                                        <p className="m-0">
                                            Después de hacer el pago, no habrá cargos adicionales.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        )
    }

    if (store.isLoading || isLoading) {
        return <Loading />
    } else {
        return <ContentPage />
    }
};
