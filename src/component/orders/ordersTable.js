import React from "react";
import PropType from "prop-types";

import { Table } from 'antd';
import moment from 'moment';
import { OrdersDetails } from "./orderDetails";
import { OrderChangeStatus } from "./orderChangeStatus";

export const OrdersTable = props => {

    const HandleCallback = (data) => {
        props.ParentCallback(data);
    }

    const columns = [
        { title: 'OrderID', dataIndex: 'OrderID', key: 'OrderID', fixed: 'left' },
        { title: 'A nombre de', dataIndex: 'FullName', key: 'FullName' },
        {
            title: (<p className="text-center m-0">Status</p>),
            colSpan: 2,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <p className="text-center align-middle m-0">
                    {e.InternalStatus}
                </p>
            ),
            onFilter: (value, record) => record.InternalStatus.indexOf(value) === 0,
            filters: props.Orders.map(item => item.InternalStatus)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(item => {
                    return {
                        text: item,
                        value: item
                    }
                })
        },
        {
            title: 'Cambiar Status',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <OrderChangeStatus OrderID={e.OrderID} StatusID={e.StatusID} ParentCallback={HandleCallback}/>
            ),
        },
        {
            title: (<p className="text-center m-0">Pago Validado</p>),
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
            sorter: (a, b) => moment(a.OrderDate).unix() - moment(b.OrderDate).unix(),
            defaultSortOrder: 'descend',
            render: (e) => (
                <p className="text-center align-middle m-0 text-capitalize">
                    {moment(e.OrderDate).format('DD/MMM YYYY hh:mm A')}
                </p>
            ),
        },
    ]

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }

    

    return (
        <div className="">
                <Table columns={columns}
                    dataSource={props.Orders}
                    rowKey={record => record.OrderID}
                    onChange={onChange}
                    scroll={{ x: 'max-content' }}
                    expandable={{
                        expandedRowRender: record => (
                            <div className="row m-0">
                                <div className="col-sm-6">
                                    <p className="m-0 font-weight-bold">Status: <span className="font-weight-normal">{record.StatusID} - {record.InternalStatus}</span></p>
                                    <p className="m-0 font-weight-bold">Tipo de Pago: <span className="font-weight-normal">{record.OrderType}</span></p>
                                    <p className="m-0 font-weight-bold">Comprobante: <span className="font-weight-normal">{record.ProofPayment}</span></p>
                                </div>
                                <div className="col-sm-6">
                                    <OrdersDetails Order={record}/>
                                </div>
                            </div>
                        ),
                        rowExpandable: record => record.FullName !== 'Not Expandable',
                    }}
                    pagination={false} />
            </div>
        
    )
}


OrdersTable.propTypes = {
    Orders: PropType.array,
    ParentCallback: PropType.func
};