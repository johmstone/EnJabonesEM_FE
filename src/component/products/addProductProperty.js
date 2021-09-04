/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Tooltip, Modal, Transfer } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';

import PropertiesService from "../../services/properties";

export const AddProductProperty = props => {

    const PropertiesSVC = new PropertiesService();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Properties, setProperties] = useState([])
    const [AvailableProperties, setAvailableProperties] = useState([])

    const { handleSubmit, control, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    useEffect(() => {
        if (isModalVisible) {
            console.log(props.Properties);
            PropertiesSVC.List().then(res => {
                setProperties(res);
                const arr = res.filter(elm => {
                    return !props.Properties.some(el => el.PropertyID === elm.PropertyID)
                })
                setAvailableProperties(arr);
            });
        }
    }, [isModalVisible])

    const onSubmit = data => {
        console.log(data);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const mockData = Properties.map(item => {
        return ({
            key: item.PropertyID,
            Title: item.PropertyName
        })
    })
    const ContentPage = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className="my-3">
                <Controller
                    name="Properties"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <Transfer
                                className="mx-auto mw-100"
                                dataSource={mockData}
                                //rowKey={record => record.PropertyID}
                                titles={false}
                                showSearch
                                targetKeys={value}
                                ///selectedKeys={value}
                                onChange={onChange}
                                //onSelectChange={this.handleSelectChange}
                                render={item => item.Title}
                                oneWay
                            //style={{ marginBottom: 16 }}
                            />
                        </FormControl>
                    )}
                />
                <div className="form-group mt-3 mb-0 mx-0 text-center">
                    <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit">
                        Guardar
                    </button>
                    <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={() => handleCancel()}>
                        Cancelar
                    </button>
                </div>
            </form>
        )
    }
    return (
        <>
            <Tooltip title="Agregar Propiedad" color="blue">
                <a className="text-font-base float-right" onClick={() => setIsModalVisible(true)}>
                    Agregar <i className="fas fa-plus-circle align-middle"></i>
                </a>
            </Tooltip>
            <Modal
                title={false}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={false}>
                <ContentPage />
            </Modal>
        </>
    )
}

AddProductProperty.propTypes = {
    Properties: PropType.array,
    ParentCallback: PropType.func
};