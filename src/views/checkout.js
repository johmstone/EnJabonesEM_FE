/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Card, Tooltip } from 'antd';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import AuthenticationService from '../services/authentication';
import OrdersService from "../services/orders";
import UsersService from '../services/users';
import HelperService from "../services/helpers";

import { Context } from '../store/appContext';
import { Loading } from "../component/loading";
import { CheckOutOrderDetails } from "../component/shopCart/checkOutOrderDetails";
import { ChangeFacturationInfo } from "../component/shopCart/changeFacturationInfo";

import { PayPalButtons } from "../component/shopCart/paypalbuttons";
import { CheckOutFactInfo } from "../component/shopCart/CheckOutFactInfo";

export const CheckOut = () => {

    const AuthSVC = new AuthenticationService();
    const UsersSVC = new UsersService();
    const OrderSVC = new OrdersService();
    const HelperSVC = new HelperService();
    const history = useHistory();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [StageOrder, setStageOrder] = useState('');
    const [OrderDetails, setOrderDetails] = useState({});
    const [FacturationInfo, setFacturationInfo] = useState({});
    const [FacturationInfoVerified, setFacturationInfoVerified] = useState(false);
    const [EditFactInfoFlag, setEditFactInfoFlag] = useState(true);
    const [ExchangeRate, setExchangeRate] = useState(0);
    const [PaymentOption, setPaymentOption] = useState();
    const [ProofPayment, setProofPayment] = useState('');

    useEffect(() => {
        setLoading(true);
        const StagingOrder = localStorage.getItem('StagingOrder');
        LoadPage(StagingOrder);
    }, []);

    const round = (number, decimalPlaces) => {
        const factorOfTen = Math.pow(10, decimalPlaces);
        return Math.round(number * factorOfTen) / factorOfTen
    }

    const LoadPage = (orderid) => {
        if (orderid === null) {
            history.push("/ShopCart");
        } else {
            setStageOrder(orderid);
            HelperSVC.ExchangeRate().then(res => {
                var doc = new DOMParser().parseFromString(res.result, 'text/html')
                var exchangerateHTML = doc.getElementsByTagName("b")[0]
                var exchangerate = parseFloat(exchangerateHTML.outerHTML.split(" = ")[1].replace(" CRC</b>", ""));
                setExchangeRate(exchangerate);
            });
            OrderSVC.SearchStagingOrder(orderid).then(res => {
                setOrderDetails(JSON.parse(res.OrderDetails));
                localStorage.setItem('ShopCart', JSON.stringify(JSON.parse(res.OrderDetails).Products));
                actions.UpdateShopCart();
                if (isLogin) {
                    let currentUser = JSON.parse(localStorage.getItem('User'));
                    UsersSVC.UsersFacturationInfo(currentUser.UserID).then(res => {
                        const PrimaryFactInfo = res.filter(src => src.PrimaryFlag === true)[0];
                        setFacturationInfo(PrimaryFactInfo);
                        setFacturationInfoVerified(true);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            });

        }

    }

    const HandleCallback = (ChildData) => {
        setLoading(true);
        //console.log(FacturationInfo);
        setFacturationInfo(ChildData);
        setLoading(false);
        setFacturationInfoVerified(true);
    }

    const HandleCallbackFactInfo = (data, Verified) => {
        setFacturationInfoVerified(Verified);
        setEditFactInfoFlag(false);
        if (data !== undefined) {
            setFacturationInfo(data);
        }
    }

    const HandleCallbackPaypal = (data) => {
        setProofPayment(data);
    }

    const PaymentOptions = () => {
        if (PaymentOption === 'PayPal') {
            return (
                <>
                    <PayPalButtons parentCallback={HandleCallbackPaypal} TotalCart={round(((OrderDetails.TotalCart + OrderDetails.TotalDelivery) / ExchangeRate), 2)} StageOrderID={StageOrder} OrderDetails={OrderDetails} ExchangeRate={ExchangeRate} />
                </>
            )
        } else if (PaymentOption === 'SINPE' || PaymentOption === 'Deposit') {
            return (
                <TextField id="ProofPayment" label={PaymentOption === 'Deposit' ? "Número de Transacción (Depósito)" : "Número de Transacción (SINPE)"} variant="outlined" className="w-100" />
            )
        } else {
            return null;
        }
    }
    const handleChange = (event) => {
        setPaymentOption(event.target.value);
    };

    const ContentPage = () => {
        return (
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">CheckOut</h2>
                    <p className="subtitle">Confirmación de Pedido</p>
                </div>
                <hr />
                <div className="row m-0">
                    <div className="col-md-6">
                        <CheckOutOrderDetails OrderDetails={OrderDetails} ExchangeRate={ExchangeRate} />
                    </div>
                    <div className="col-md-6">
                        <div className="row m-0">
                            <h6 className="text-font-base text-uppercase">Datos de Facturación</h6>
                            {
                                isLogin ?
                                    (
                                        <div className="float-right ml-auto">
                                            <ChangeFacturationInfo parentCallback={HandleCallback} />
                                        </div>
                                    ) :
                                    (
                                        EditFactInfoFlag ? null :
                                            (
                                                <div className="float-right ml-auto">
                                                    <Tooltip title="Cambiar Información" color="blue" placement="right">
                                                        <u>
                                                            <a onClick={() => {
                                                                setEditFactInfoFlag(true);
                                                                setFacturationInfoVerified(false);
                                                            }} className="cursor-pointer">
                                                                Cambiar
                                                            </a>
                                                        </u>
                                                    </Tooltip>
                                                </div>
                                            )
                                    )
                            }

                        </div>
                        <CheckOutFactInfo parentCallback={HandleCallbackFactInfo} FacturationInfo={FacturationInfo} EditFlag={EditFactInfoFlag} />
                        {
                            FacturationInfoVerified ?
                                (
                                    <>
                                        <div className="my-3">
                                            <h6 className="text-font-base text-uppercase">Datos de Pago</h6>
                                        </div>
                                        <Card>
                                            <FormControl component="fieldset">
                                                <RadioGroup aria-label="gender" name="gender1" value={PaymentOption} onChange={handleChange}>
                                                    <FormControlLabel value="Deposit" control={<Radio />} label="Depósito Bancario" />
                                                    <FormControlLabel value="SINPE" control={<Radio />} label="SINPE Móvil" />
                                                    <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
                                                </RadioGroup>
                                            </FormControl>
                                            <PaymentOptions />
                                        </Card>
                                    </>
                                )
                                : null
                        }
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
