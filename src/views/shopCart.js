/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import CurrencyFormat from 'react-currency-format';
import { Tooltip, Table, message } from 'antd';

import { Context } from '../store/appContext';

import AuthenticationService from '../services/authentication';

import { Loading } from '../component/loading';

export const ShopCart = () => {

    const AuthSVC = new AuthenticationService();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { store } = useContext(Context);
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        if (isLogin) {
            LoadPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const LoadPage = () => {


    }

    const Delete = (item) => {
        console.log(item);
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
                    <img alt={e.Name} src={e.PhotoURL} width="100px" className="rounded"/>
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
                <div className="justify-content-start my-2">
                    <p className="mx-2 mb-0">Total de Productos: {7}</p>
                    <Table
                        columns={columnsAdmin}
                        rowKey={record => record.ProductID}
                        dataSource={store.ShopCart}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                        summary={pageData => {
                            let subtotal = 0;

                            pageData.forEach((e) => {
                                subtotal += e.ProductDetails.Price * e.Qty
                            });

                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={3} className="test"></Table.Summary.Cell>
                                        <Table.Summary.Cell>SubTotal</Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <CurrencyFormat value={subtotal} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} />
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )
                        }}
                    />
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
