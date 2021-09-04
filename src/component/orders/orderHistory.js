/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import PropType from "prop-types";

import { Modal, Tooltip, Timeline } from 'antd';
import moment from 'moment';

import OrdersService from '../../services/orders';

export const OrderHistory = props => {

    const OrderSVC = new OrdersService();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Activities, setActivities] = useState([]);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        if (isModalVisible) {
            let Model = {
                OrderID: props.OrderID,
                ActivityType: 'Internal'
            }
            //console.log(Model);
            OrderSVC.History(Model).then(res => {
                //console.log(res);
                setActivities(res);
                setLoading(false);
            });
        }
    }, [isModalVisible])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div key="OrderHistory">
            <Tooltip title='Ver Historia de la Orden' color="blue" >
                <a className="text-primary" onClick={showModal}>
                    <i className="fas fa-history"></i>
                </a>
            </Tooltip>
            <Modal key="ModalHistory"
                title={[
                    <h4 className="text-white text-center m-0 text-font-base">
                        Historia
                        <br />
                        <span className="text-primary">Orden #{props.OrderID}</span>
                    </h4>
                ]}
                centered
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={false}
            >
                <div className="py-3" style={{ maxHeight: 400, overflow: 'scroll' }}>
                    {
                        Loading ?
                            <div className="mx-2 text-center">
                                <button class="btn btn-block" type="button" disabled>
                                    <span class="spinner-grow spinner-border-sm align-middle mx-2" role="status" aria-hidden="true"></span>
                                    Cargando...
                                </button>
                            </div > :
                            <Timeline mode="left">
                                {
                                    Activities.map((item, i) => {
                                        return (
                                            <Timeline.Item key={i}>
                                                <p className='m-0'>{moment.parseZone(item.ActivityDate).utcOffset(-360).format('DD/MM/YYYY hh:mm A')}</p>
                                                <p className='m-0'><span className='font-weight-bolder'>Usuario:</span> {item.InsertUser}</p>
                                                <p className='m-0'><span className='font-weight-bolder'>Status:</span> {item.InternalStatus} ({item.StatusID})</p>
                                            </Timeline.Item>
                                        )
                                    })
                                }

                            </Timeline>
                    }

                </div>
            </Modal>
        </div>
    )
}
OrderHistory.propTypes = {
    OrderID: PropType.string
};