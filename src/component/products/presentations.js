/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PropType from "prop-types";
import CurrencyFormat from 'react-currency-format';
import { Tooltip, Table } from 'antd';

import { EditProduct } from './editProduct';

export const Presentations = props => {

    const ChangeStatus = (item) => {
        console.log(item);
    }
    const ChangeVisibility = (item) => {
        console.log(item);
    }
    
    const columnsAdmin = [
        {
            title: 'Código',
            dataIndex: '',
            key: 'x',
            fixed: 'left',
            className: 'text-center',
            render: (item) => (<p className="m-0">{props.PrimaryProduct.PrimaryProductID}{item.ProductID}</p>),
        },
        {
            title: 'Qty',
            dataIndex: '',
            key: 'x',
            fixed: 'left',
            className: 'text-center',
            render: (item) => (
                <p className="m-0">
                    {item.Qty} {item.Unit[0].Symbol}
                </p>
            ),
        },
        {
            title: 'Status',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <p className={e.ActiveFlag ? "font-weight-bolder text-success m-0" : "font-weight-bolder text-danger m-0"}>
                    {e.ActiveFlag ? "Activo" : "Inactivo"}
                </p>
            ),
        },
        {
            title: 'Visibilidad',
            dataIndex: '',
            key: 'x',
            className: "text-center",
            render: (e) => (
                <Tooltip title={e.VisibleFlag ? "Visible" : 'Oculto'} color={e.VisibleFlag ? 'green' : 'red'}>
                    <p className={e.VisibleFlag ? "text-center align-middle font-weight-bolder text-success m-0" : "text-center align-middle font-weight-bolder text-danger m-0"}>
                        {e.VisibleFlag ? (<i className="fas fa-eye mx-2"></i>) : (<i className="fas fa-eye-slash mx-2"></i>)}
                    </p>
                </Tooltip>
            ),
        },
        {
            title: 'Precio',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (item) => (
                <CurrencyFormat value={item.Price} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} />
            ),
        },
        {
            title: 'IVA',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (item) => (
                <CurrencyFormat value={item.IVA} displayType={"text"} thousandSeparator={true} decimalScale={2} suffix="%" />
            ),
        },
        {
            title: 'Desc.',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (item) => (
                <CurrencyFormat value={item.Discount} displayType={"text"} thousandSeparator={true} decimalScale={2} suffix="%" />
            ),
        },
        {
            title: 'Acción',
            colSpan: 3,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title={e.ActiveFlag ? "Desactivar" : "Activar"} color={e.ActiveFlag ? "red" : "green"} >
                    <a onClick={() => ChangeStatus(e)}>
                        <i className="fas fa-repeat-alt align-middle"></i>
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Visibility',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title={e.ActiveFlag ? "Ocultar" : "Mostrar"} color={e.ActiveFlag ? "green" : "red"} >
                    <a onClick={() => ChangeVisibility(e)}>
                        <i className="fas fa-low-vision align-middle"></i>
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Edit',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (<EditProduct Product={e} />),
        }
    ]

    return (
        <div className="row m-0">
            <div className="col-sm-4">
                {
                    props.PrimaryProduct.PhotoURL ?
                        (<img src={props.PrimaryProduct.PhotoURL} alt={props.PrimaryProduct.Name} className="w-100 rounded-lg" />) : null
                }
                <p className="m-0 text-font-base my-2">
                    {props.PrimaryProduct.Description}
                </p>
            </div>
            <div className="col-sm-8">
                <h5>Presentaciones</h5>
                <Table className="productTable"
                        columns={columnsAdmin}
                        rowKey={record => record.ProductID}                        
                        dataSource={props.PrimaryProduct.Products.filter(src => src.ProductID > 0)}
                        scroll={{ x: 'max-content' }}
                        pagination={false}

                    />                
            </div>
        </div>
    );
}

Presentations.propTypes = {
    PrimaryProduct: PropType.object
    // 2) add here the new properties into the proptypes object
};