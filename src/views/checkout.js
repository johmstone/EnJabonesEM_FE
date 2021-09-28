/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from 'react-router-dom';
import { Steps, Card, message } from 'antd';
import CurrencyFormat from 'react-currency-format';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import moment from "moment";
import { generate } from 'shortid';

import AuthenticationService from '../services/authentication';
import OrdersService from "../services/orders";
import UsersService from '../services/users';

import { Context } from '../store/appContext';
import { Loading } from "../component/loading";
import { CheckOutOrderDetails } from "../component/shopCart/checkOutOrderDetails";
import { CheckOutFacturationInfo } from "../component/shopCart/CheckOutFacturationInfo";
import { PayPalButtons } from "../component/shopCart/paypalbuttons";

export const CheckOut = () => {
    const { Step } = Steps;
    const AuthSVC = new AuthenticationService();
    const history = useHistory();
    const UsersSVC = new UsersService();
    const OrderSVC = new OrdersService();

    const FI = {
        UserID: 0,
        FacturationInfoID: 0,
        FullName: null,
        IdentityType: null,
        IdentityID: null,
        Email: null,
        PhoneNumber: null,
        CostaRicaID: null,
        ProvinceID: 0,
        Province: null,
        CantonID: 0,
        Canton: null,
        DistrictID: 0,
        District: null,
        Street: null
    }

    const { store, actions } = useContext(Context);
    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const [isLoading, setLoading] = useState(true);
    const [SuccessOrder, setSuccessOrder] = useState(false);
    const [current, setCurrent] = useState(0);
    const [FacturationInfo, setFacturationInfo] = useState(FI);
    const [FacturationInfoVerified, setFacturationInfoVerified] = useState(false);
    const [PaymentOption, setPaymentOption] = useState();
    const [ProofPayment, setProofPayment] = useState('');

    const [StageOrder, setStageOrder] = useState('');
    const [OrderDetails, setOrderDetails] = useState({});
    const [ExchangeRate, setExchangeRate] = useState(store.ExchangeRate);

    useEffect(() => {
        //console.log("test");
        const StagingOrder = localStorage.getItem('StagingOrder');
        LoadPage(StagingOrder);
    }, []);

    useEffect(() => {
        setExchangeRate(store.ExchangeRate);
    }, [store.ExchangeRate]);

    const round = (number, decimalPlaces) => {
        const factorOfTen = Math.pow(10, decimalPlaces);
        return Math.round(number * factorOfTen) / factorOfTen
    }

    const LoadPage = (orderid) => {
        //console.log(orderid);
        if (orderid === null) {
            history.push("/ShopCart");
        } else {
            setStageOrder(orderid);
            OrderSVC.SearchStagingOrder(orderid).then(res => {
                console.log(res);
                setOrderDetails(JSON.parse(res.OrderDetails));
                localStorage.setItem('ShopCart', JSON.stringify(JSON.parse(res.OrderDetails).Products));
                actions.UpdateShopCart();
                if (isLogin) {
                    let currentUser = JSON.parse(localStorage.getItem('User'));
                    UsersSVC.UsersFacturationInfo(currentUser.UserID).then(res => {
                        console.log(res);
                        if (res.length > 0) {
                            const PrimaryFactInfo = res.filter(src => src.PrimaryFlag === true)[0];
                            setFacturationInfo(PrimaryFactInfo);
                            setFacturationInfoVerified(true);
                        } else {
                            FI.UserID = currentUser.UserID;
                            setFacturationInfo(FI);
                        }
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            });
        }
    }

    const HandleCallbackFactInfo = (data, VerifyFlag) => {
        //console.log(data, VerifyFlag);
        // setFacturationInfoVerified(Verified);
        // setEditFactInfoFlag(false);
        if (data !== undefined) {
            setLoading(true);
            setFacturationInfo(data);
            setLoading(false);
            //setEditFactInfoFlag(false);
            setFacturationInfoVerified(VerifyFlag);
        }
    }

    const RevisionStep = () => {
        return (
            <>
                <CheckOutOrderDetails OrderDetails={OrderDetails} ExchangeRate={ExchangeRate} />
            </>
        );
    }

    const FactInfoStep = () => {
        return (
            <>
                <CheckOutFacturationInfo parentCallback={HandleCallbackFactInfo} FacturationInfo={FacturationInfo} EditFlag={FacturationInfoVerified} />
            </>
        );
    }

    const ConfirmStep = () => {
        return (
            <>
                <div className="my-3">
                    <h6 className="text-font-base text-uppercase">Datos de Pago</h6>
                </div>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="gender" name="gender1" value={PaymentOption} onChange={(e) => handleChange(e)}>
                        <FormControlLabel value="Deposit" control={<Radio />} label="Depósito Bancario" />
                        <FormControlLabel value="SINPE" control={<Radio />} label="SINPE Móvil" />
                        <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
                    </RadioGroup>
                </FormControl>
                <PaymentOptions />
            </>
        );
    }

    const HandleCallbackPaypal = (data) => {
        setProofPayment(data);
        GenerateOrden(data);
    }

    const PaymentOptions = () => {
        if (PaymentOption === 'PayPal') {
            return (
                <>
                    <PayPalButtons parentCallback={HandleCallbackPaypal} TotalCart={round(((OrderDetails.TotalCart + OrderDetails.TotalDelivery) / ExchangeRate), 2)} StageOrderID={StageOrder} ShippingAddress={FacturationInfo} ExchangeRate={ExchangeRate} />
                </>
            )
        } else if (PaymentOption === 'SINPE' || PaymentOption === 'Deposit') {
            return (
                <div className="text-center">
                    <TextField id="ProofPayment"
                        label={PaymentOption === 'Deposit' ? "Número de Transacción (Depósito)" : "Número de Transacción (SINPE)"}
                        variant="outlined"
                        value={ProofPayment}
                        className="w-100 mb-2"
                        autoFocus
                        onChange={(e) => setProofPayment(e.target.value)} />
                    <button className="btn btn-outline-primary mx-auto py-2 text-uppercase"
                        type="button"
                        disabled={ProofPayment === '' ? true : false}
                        onClick={() => GenerateOrden(ProofPayment)}>
                        Generar Orden
                    </button>
                </div>
            )
        } else {
            return null;
        }
    }

    const handleChange = (event) => {
        setPaymentOption(event.target.value);
    };

    const GenerateOrden = (Proof) => {
        //setGeneringOrder(true);
        // console.log(StageOrder);
        //console.log(OrderDetails);        
        // console.log(FacturationInfo);
        //console.log(ProofPayment);
        //console.log(moment().format());
        const NewOrderDetails = {
            OrderDate: moment().format("YYYY-MM-DD hh:mm:ss"),
            StageOrder: StageOrder,
            Products: OrderDetails.Products,
            DeliveryAddress: OrderDetails.DeliveryAddress,
            FacturationInfo: FacturationInfo,
            PaymentMethod: PaymentOption,
            ProofPayment: Proof,
            TotalCart: OrderDetails.TotalCart,
            TotalDelivery: OrderDetails.TotalDelivery
        }

        const NewOrder = {
            OrderID: moment().format("YYYYMMDD") + generate(),
            OrderDetails: JSON.stringify(NewOrderDetails),
            EmailNotification: FacturationInfo.Email,
            PaymentMethod: PaymentOption,
            ProofPayment: Proof,
        }
        //console.log(NewOrder);
        OrderSVC.AddNewOrder(NewOrder).then(res => {
            //console.log(res);
            if (res) {
                localStorage.removeItem('ShopCart');
                localStorage.removeItem('StagingOrder');
                return res;
            } else {
                setLoading(false);
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
                return false;
            }
        }).then(src => {
            console.log(src);
            if (src) {
                actions.UpdateShopCart();
            }
            return src;
        }).then(result => {
            //console.log(result);
            if (result) {   
                localStorage.removeItem('LastOrderConfirmed');
                localStorage.setItem('LastOrderConfirmed',NewOrder.OrderID);
                setSuccessOrder(result);                
            }
        });
    }

    const steps = [
        {
            title: (<b className="text-font-base m-0 text-uppercase">Revisión</b>),
            description: 'Detalles de la Orden',
            content: RevisionStep(),
        },
        {
            title: (<b className="text-font-base m-0 text-uppercase">Facturación</b>),
            description: 'Información de Facturación',
            content: FactInfoStep(),
        },
        {
            title: (<b className="text-font-base m-0 text-uppercase">Confirmar</b>),
            description: 'Datos de Pago y Confirmación',
            content: ConfirmStep(),
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const DeliveryAddressComponent = () => {
        if (OrderDetails.DeliveryAddress.DeliveryAddressID === undefined) {
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

    const ContentPage = () => {
        //console.log('contentPage');
        return (
            // <p>test</p>
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">CheckOut</h2>
                    <p className="subtitle">Confirmación de Pedido</p>
                </div>
                <hr />
                <div className="row px-3 mb-2">
                    <div className="steps-action w-100 text-center mb-3">
                        {current > 0 && (
                            <button type="button"
                                className="btn btn-outline-primary btn-sm py-2 mx-1"
                                onClick={() => prev()}>
                                <i className="far fa-chevron-double-left"></i> Anterior
                            </button>
                        )}
                        {current < steps.length - 1 && (
                            <button type="button"
                                disabled={current === 1 && !FacturationInfoVerified ? true : false}
                                className="btn btn-outline-primary btn-sm py-2 mx-1"
                                onClick={() => next()}>
                                Siguiente <i className="far fa-chevron-double-right"></i>
                            </button>
                        )}
                    </div>
                    <Steps current={current} progressDot>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} description={item.description} />
                        ))}
                    </Steps>

                </div>
                <div className="row mb-3">
                    <div className="col-md-5">
                        <Card hoverable>
                            <h6 className="text-font-base text-uppercase m-0 text-primary-color">Resumen</h6>
                            <p className="m-0 p-0">Cantidad de Artículos: <span className="font-weight-bold"> {OrderDetails.Products.length} </span></p>
                            <p className="m-0 p-0">Total: <CurrencyFormat value={OrderDetails.TotalCart + OrderDetails.TotalDelivery}
                                displayType={"text"}
                                thousandSeparator={true} prefix={"₡"}
                                decimalScale={2}
                                className="font-weight-bold" /></p>
                            <p className="m-0 p-0">Total Aprox $: <CurrencyFormat value={(OrderDetails.TotalCart + OrderDetails.TotalDelivery) / ExchangeRate}
                                displayType={"text"}
                                thousandSeparator={true} prefix={"$"}
                                decimalScale={2}
                                className="font-weight-bold" /></p>
                            <h6 className="text-font-base text-uppercase mt-2 mb-0 text-primary-color">Envío</h6>
                            <DeliveryAddressComponent />
                            {
                                FacturationInfoVerified ?
                                    (
                                        <>
                                            <h6 className="text-font-base text-uppercase mt-2 mb-0 text-primary-color">Facturación</h6>
                                            <p className="m-0">{FacturationInfo.IdentityType}: {FacturationInfo.IdentityID}</p>
                                            <p className="m-0">Teléfono: {FacturationInfo.PhoneNumber}</p>
                                            <p className="m-0">Email: {FacturationInfo.Email}</p>
                                            <p className="m-0 withoutWhiteSpace">{FacturationInfo.Street}</p>
                                            <p className="m-0">{FacturationInfo.Canton}, {FacturationInfo.District}</p>
                                            <p className="m-0">{FacturationInfo.Province}, CR {FacturationInfo.CostaRicaID}</p>
                                        </>
                                    ) : null
                            }
                        </Card>
                    </div>
                    <div className="col-md-7">
                        <Card hoverable className="mb-2">
                            <div className="steps-content">
                                {steps[current].content}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        )
    }
    if (isLoading) {
        return <Loading />
    } else if (SuccessOrder) {
        return <Redirect to={{ pathname: "/CheckOut/Confirmation" }} />;
    } else {
        return <ContentPage />
    }
};
