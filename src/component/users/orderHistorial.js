/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import PropType from "prop-types";

import { Timeline } from 'antd';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';

import { OrdersDetails } from "../orders/orderDetails";

export const OrderHistorial = props => {

    const [Orders] = useState(props.Orders);

    if (Orders.length > 0) {
        return (
            <div className="py-3">
                <Timeline>
                    {
                        Orders.map((item, i) => {
                            return (
                                <Timeline.Item key={i} className="text-font-base">
                                    <p className="m-0">{moment(item.OrderDate).format('DD/MM/YYYY hh:mm A')}</p>
                                    <p className='m-0'><span className='font-weight-bolder'>Orden:</span> {item.OrderID}</p>
                                    <p className='m-0'><span className='font-weight-bolder'>Status:</span> {item.ExternalStatus}</p>
                                    <p className='m-0'>
                                        <span className='font-weight-bolder'>Total de la Orden:</span> <CurrencyFormat value={item.TotalCart + item.TotalDelivery} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={2} />
                                    </p>
                                    <OrdersDetails Order={item} BtnType="a" BtnLabel="Ver detalles..." />
                                </Timeline.Item>
                            )
                        })
                    }
                </Timeline>
            </div>
        )
    } else {
        return (
            <p>No hay ordenes procesadas</p>
        )
    }
}
OrderHistorial.propTypes = {
    Orders: PropType.array
};