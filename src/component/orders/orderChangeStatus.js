/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import PropType from "prop-types";

import { Modal, Tooltip } from 'antd';
import { useForm, Controller } from "react-hook-form";

import OrdersService from '../../services/orders';

export const OrderChangeStatus = props => {

    const OrderSVC = new OrdersService();

    const { handleSubmit, control, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Statuses, setStatuses] = useState([]);
    const [StatusID, setStatusID] = useState(props.StatusID);

    useEffect(() => {
        if (isModalVisible) {
            OrderSVC.Statuses('Internal').then(res => {
                setStatuses(res);
                setStatusID(props.StatusID);                
            });
        } else {
            reset({
                StatusID: props.StatusID
            });
        }
    }, [isModalVisible])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onSubmit = data => {
        const Model = {
            OrderID: props.OrderID,
            ActionType: 'CHGST',
            StatusID: parseInt(data.StatusID)
        };
        //console.log(Model);
        OrderSVC.Update(Model).then(res => {
            props.ParentCallback(res);
        });
    };

    return (
        <div key="ChangeStatus">
            <Tooltip title='Asignar nuevo Status' color="blue" >
                <a onClick={showModal}>
                    <i className="fas fa-repeat-alt"></i>
                </a>
            </Tooltip>
            <Modal
                title={[
                    <h4 className="text-white text-center m-0 font-weight-bolder">Asignar nuevo Status</h4>
                ]}
                centered
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={false}
                className="custom-form"
            >
                <div className="py-2">
                    <h5 className="text-center">Orden: <span className="text-primary">{props.OrderID}</span></h5>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Estado Actual</span>
                            </div>                           
                            <Controller name="StatusID"
                                    control={control}
                                    defaultValue={StatusID} 
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <select className="custom-select" 
                                                defaultValue={StatusID} 
                                                value={value}
                                                onChange={onChange}
                                                >
                                            {
                                                Statuses.filter(src => src.StatusID !== 10000).map((item, i) => {
                                                   return <option value={item.StatusID} key={i}>{item.InternalStatus}</option>
                                                })
                                            }
                                        </select>

                                        // <FormControl variant="outlined" className="w-100 my-2">
                                        //     <TextField
                                        //         id="TypeID"
                                        //         select
                                        //         variant="outlined"
                                        //         value={value}
                                        //         onChange={onChange}
                                        //         label="Tipo de Ingrediente"
                                        //         error={!!error}
                                        //         helperText={error ? (<label className="text-font-base text-danger">
                                        //             {error.message}
                                        //         </label>) : null}>
                                        //         {
                                        //             Types.map((item, i) => {
                                        //                 return (
                                        //                     <MenuItem value={item.TypeID} key={i}>{item.TypeName}</MenuItem>
                                        //                 )
                                        //             })
                                        //         }
                                        //     </TextField>
                                        // </FormControl>
                                    )}
                                    //onChange={e => e}
                                    rules={{ required: "Requerido" }}
                                />
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" type="submit" >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}
OrderChangeStatus.propTypes = {
    OrderID: PropType.string,
    StatusID: PropType.number,
    ParentCallback: PropType.func
};