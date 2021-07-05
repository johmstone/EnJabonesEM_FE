/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import PropType from "prop-types";

export const PayPalButtons = (props) => {

    const paypalRef = useRef();

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // useEffect(() => {
    //     console.log(props.OrderDetails);
    // }, [])

    // To show PayPal buttons once the component loads
    useEffect(() => {
        (async () => {
            await sleep(1000)
            if (paypalRef.current) {
                window.paypal
                    .Buttons({
                        createOrder: (data, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        description: "Orden: " + props.StageOrderID,
                                        soft_descriptor: "MasQueaJabones.com",
                                        amount: {
                                            currency_code: "USD",
                                            value: props.TotalCart,
                                        },
                                        shipping: {
                                            method: "Correos de Costa Rica",
                                            address: {
                                                name: {
                                                    give_name: props.OrderDetails.DeliveryAddress.ContactName
                                                },
                                                address_line_1: props.OrderDetails.DeliveryAddress.Street + ', ' + props.OrderDetails.DeliveryAddress.District,
                                                admin_area_2: props.OrderDetails.DeliveryAddress.Province,
                                                admin_area_1: props.OrderDetails.DeliveryAddress.Canton,
                                                postal_code: props.OrderDetails.DeliveryAddress.CostaRicaID,
                                                country_code: "CR"
                                            }
                                        },
                                    }
                                ],
                            });
                        },
                        onApprove: async (data, actions) => {
                            const order = await actions.order.capture();
                            // console.log(order);
                            // console.log(order.purchase_units[0].payments.captures[0].id);
                            if (order.status === 'COMPLETED') {
                                props.parentCallback(order.purchase_units[0].payments.captures[0].id);
                            }
                        },
                        onError: (err) => {
                            console.error(err);
                        },
                    })
                    .render(paypalRef.current);
            }
        })();
    }, [window.paypal]);

    return (
        <div>
            <div ref={paypalRef} />
        </div>
    );
}
PayPalButtons.propTypes = {
    TotalCart: PropType.number,
    StageOrderID: PropType.string,
    parentCallback: PropType.func,
    OrderDetails: PropType.object,
    ExchangeRate: PropType.number
};