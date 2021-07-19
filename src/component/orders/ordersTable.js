import React, { useState, useEffect } from "react";
import PropType from "prop-types";


import { Tooltip, Table, message } from 'antd';
import moment from 'moment';

export const OrdersTable = props => {

    const [SearchInput, setSearchInput] = useState('');
    const [SearchResults, setSearchResults] = useState(props.Orders);

    useEffect(() => {
        var Statues = SearchResults.map(item => item.InternalStatus)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(item => {
                return {
                    text: item,
                    value: item
                }
            })
        console.log(Statues)
    })

    const columns = [
        { title: 'OrderID', dataIndex: 'OrderID', key: 'OrderID', fixed: 'left' },
        { title: 'A nombre de', dataIndex: 'FullName', key: 'FullName', fixed: 'left' },
        { title: 'StatusID', dataIndex: 'StatusID', key: 'StatusID' },
        {
            title: 'Status',
            dataIndex: 'InternalStatus',
            key: 'InternalStatus',            
            onFilter:(value, record) => record.InternalStatus.indexOf(value) === 0,
            filters: SearchResults.map(item => item.InternalStatus)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(item => {
                    return {
                        text: item,
                        value: item
                    }
                })
        },
        {
            title: 'Validado',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <p className={e.OrderVerified ? "text-center align-middle font-weight-bolder text-success m-0" : "text-center align-middle font-weight-bolder text-danger m-0"}>
                    {e.OrderVerified ? "Validado" : "Pendiente"}
                </p>
            ),
        },
        {
            title: 'Fecha',
            dataIndex: '',
            key: 'x',
            sorter: (a, b) => a.OrderDate.length - b.OrderDate.length,
            render: (e) => (
                <p className="text-center align-middle m-0 text-capitalize">
                    {moment(e.OrderDate).format('DD MMM YYYY hh:mm A')}
                </p>
            ),
        },
    ]

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    return (
        <>
            <div className="">
                <div className="input-group mb-3 mw-100" style={{ width: "300px" }}>
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="SearchInput-label"><i className="fas fa-search"></i></span>
                    </div>
                    <input type="text" className="form-control" placeholder="Palabra clave..." aria-label="Palabra clave..." aria-describedby="SearchInput-label"
                        value={SearchInput} onChange={handleChange} autoFocus />
                </div>
            </div>
            <div className="">
                <Table columns={columns}
                    dataSource={SearchResults}
                    onChange={onChange}
                    expandable={{
                        expandedRowRender: record => (
                            <div>
                                <p className="m-0 font-weight-bold">Tipo de Pago: <span className="font-weight-normal">{record.OrderType}</span></p>
                                <p className="m-0 font-weight-bold">Comprobante: <span className="font-weight-normal">{record.ProofPayment}</span></p>
                            </div>
                        ),
                        rowExpandable: record => record.FullName !== 'Not Expandable',
                    }}
                    pagination={false} />
            </div>
        </>
    )
}


OrdersTable.propTypes = {
    Orders: PropType.array
};