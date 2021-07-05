/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import { Tooltip, Table, Button, Modal } from 'antd';
import { DebounceInput } from 'react-debounce-input';
import { Context } from '../store/appContext';

import { Loading } from '../component/loading';
import { ChangeDeliveryAddress } from '../component/shopCart/changeDeliveryAddress';

import AuthenticationService from '../services/authentication';
import OrdersService from '../services/orders';
import HelperServices from '../services/helpers';

export const ShopCart = () => {

    const AuthSVC = new AuthenticationService();
    const OrderSVC = new OrdersService();
    const HelperSVC = new HelperServices();
    const history = useHistory();

    const { store, actions } = useContext(Context);
    const [TotalCart, setTotalCart] = useState(0);
    const [Delivery, setDelivery] = useState({});
    const [TotalDelivery, setTotalDelivery] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [ExchangeRate, setExchangeRate] = useState();

    useEffect(() => {
        setLoading(true);
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (store.ShopCart.length > 0) {
            //console.log(store.ShopCart);
            let subtotal = 0;
            store.ShopCart.forEach((e) => {
                subtotal += e.ProductDetails.Price * e.Qty
            });
            setTotalCart(subtotal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.ShopCart]);

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
        let shopcart = JSON.parse(localStorage.getItem('ShopCart'));
        if (store.ShopCart.length === 0 && shopcart !== null) {
            actions.UpdateShopCart();
            HelperSVC.ExchangeRate().then(res => {
                var doc = new DOMParser().parseFromString(res.result, 'text/html')
                var exchangerateHTML = doc.getElementsByTagName("b")[0]
                setExchangeRate(exchangerateHTML.outerHTML);
                setLoading(false);                
            });
        } else {
            setLoading(false);
        }
    }

    const DeliveryAddressComponent = () => {
        if (Delivery.DeliveryAddressID === undefined) {
            return (
                <p className="m-0">Recoger en Tienda</p>
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
        //console.log(childData);
        if (childData) {
            setDelivery(childData);
            if (childData.DeliveryAddressID === undefined) {
                setTotalDelivery(0);
            } else if (childData.GAMFlag) {
                setTotalDelivery(3000);
            } else {
                setTotalDelivery(5000);
            }
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

    const handleMinusPlus = (item, value) => {
        let shopcart = JSON.parse(localStorage.getItem('ShopCart'));

        shopcart.forEach(src => {
            if (src.ProductID === item.ProductID) {
                if (src.Qty > 1 && parseInt(value) === -1) {
                    src.Qty = src.Qty + parseInt(value)
                } else if (src.Qty >= 1 && parseInt(value) === 1) {
                    src.Qty = src.Qty + parseInt(value)
                }
            }
        });
        localStorage.removeItem('ShopCart');
        localStorage.setItem('ShopCart', JSON.stringify(shopcart));
        actions.UpdateShopCart();
    }

    const SetQtyProduct = (item, value) => {
        let shopcart = JSON.parse(localStorage.getItem('ShopCart'));

        shopcart.forEach(src => {
            if (src.ProductID === item.ProductID) {
                src.Qty = parseInt(value);
            }
        });
        localStorage.removeItem('ShopCart');
        localStorage.setItem('ShopCart', JSON.stringify(shopcart));
        actions.UpdateShopCart();
    }

    const ShopCartCheckOut = () => {
        const NewOrder = {
            Products: JSON.parse(localStorage.getItem('ShopCart')),
            DeliveryAddress: Delivery,
            TotalCart: TotalCart,
            TotalDelivery: TotalDelivery
        }

        let UserID = 0;
        if (AuthSVC.isAuthenticated()) {
            let user = JSON.parse(localStorage.getItem('User'));
            UserID = user.UserID;
        }

        const StagingOrder = {
            UserID: UserID,
            DeliveryID: Delivery.DeliveryAddressID === undefined ? 1 : 2,
            OrderDetails: JSON.stringify(NewOrder)
        }
        //console.log(StagingOrder);        
        OrderSVC.AddStagingOrder(StagingOrder).then(res => {
            //console.log(res);
            if (res.length > 0) {
                localStorage.removeItem('ShopCart');
                localStorage.removeItem('DeliveryAddress');
                localStorage.setItem('StagingOrder', res);
                history.push("/ShopCart/CheckOut");
            }
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
                <CurrencyFormat value={e.ProductDetails.Price} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={2} />
            ),
        },
        {
            title: 'Cantidad',
            dataIndex: '',
            key: 'Qty',
            className: "text-center",
            render: (e) => (
                <div className="input-group input-group-sm m-auto" style={{ width: "100px" }}>
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleMinusPlus(e, -1)}>
                            <i className="fas fa-minus"></i>
                        </button>
                    </div>
                    <DebounceInput
                        className="form-control input-NumberText"
                        type="number"
                        value={e.Qty}
                        debounceTimeout={500}
                        onChange={event => SetQtyProduct(e, event.target.value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleMinusPlus(e, +1)}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            )
        },
        {
            title: 'Subtotal',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <CurrencyFormat value={e.ProductDetails.Price * e.Qty} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={2} />
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
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td className='px-0' colSpan={2}>SubTotal</td>
                                            <td className='px-0 text-right'>
                                                <CurrencyFormat value={TotalCart}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={2}
                                                    className="text-font-base m-0 text-primary" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='px-0' style={{ width: "60px" }}>
                                                <p className="m-0 font-weight-bold">Envío</p>
                                            </td>
                                            <td className='px-0'>
                                                <DeliveryAddressComponent />
                                                <ChangeDeliveryAddress parentCallback={handleCallback} />
                                            </td>
                                            <td className='px-0 text-right'>
                                                <CurrencyFormat value={TotalDelivery}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₡"}
                                                    decimalScale={2}
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
                                                    decimalScale={2}
                                                    className="text-font-base m-0 text-primary font-weight-bold fa-15x" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='px-0' colSpan={2}></td>
                                            <td className='px-0 text-right'>
                                                <p className="float-left m-0">Tipo de Cambio</p>
                                                <p className="text-font-base m-0 text-primary"
                                                    dangerouslySetInnerHTML={{
                                                        __html: ExchangeRate
                                                    }}></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="text-center">
                                    <Button type="primary" shape="round" className="mx-2 text-uppercase" onClick={() => ShopCartCheckOut()}>
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

    if (isLoading) {
        return <Loading />
    } else {
        return <ContentPage />
    }
};
