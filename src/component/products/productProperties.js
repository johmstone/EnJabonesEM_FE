/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import PropType from "prop-types";
import { Tooltip, Modal } from 'antd';

import ProductServices from "../../services/products";
import PropertiesService from "../../services/properties";

import { AddProductProperty } from "./addProductProperty";

export const ProductProperties = props => {

    const ProductSVC = new ProductServices();
    const PropertiesSVC = new PropertiesService();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Properties, setProperties] = useState(props.PrimaryProduct.Properties);

    const RemoveProperty = data => {
        //console.log(data);
        PropertiesSVC.Disable(data.ProductPropertyID).then(res => {
            if(res) {
                ProductSVC.PrimaryProductDetails(props.PrimaryProduct.PrimaryProductID).then(src => {
                    setProperties(src.Properties);
                });
            }
        });
    }

    const HandleCallback = data => {
        console.log(data);
    }

    const ContentPage = () => {
        return (
            <div className="row m-0">
                <div className="col-sm-6 text-center">
                    {
                        props.PrimaryProduct.PhotoURL ?
                            (<img src={props.PrimaryProduct.PhotoURL} alt={props.PrimaryProduct.Name} className="w-100 rounded-lg" />) : null
                    }
                    <h4 className="mx-0 mb-0 mt-2 text-font-base">{props.PrimaryProduct.Name}</h4>
                </div>
                <div className="col-sm-6">
                    <h4 className="mx-0 my-2 text-font-base">Propiedades</h4>
                    {
                        Properties === null ? null :
                            Properties.map((item, i) => {
                                return (
                                    <p key={i} className="text-font-base">
                                        <i className="fas fa-arrow-circle-right fa-15x align-middle mr-2"></i>
                                        {item.PropertyName}
                                        <Tooltip title="Eliminar" color="red">
                                            <a className="float-right text-danger" onClick={() => RemoveProperty(item)}>
                                                <i className="far fa-trash-alt"></i>
                                            </a>
                                        </Tooltip>
                                    </p>
                                )
                            })
                    }
                    <AddProductProperty Properties={Properties} ParentCallback={HandleCallback}/>
                </div>
            </div>

        )
    }

    return (
        <div>
            <Tooltip title="Propiedades" color="blue">
                <a className="mx-2 text-info" onClick={() => setIsModalVisible(true)}>
                    <i className="fas fa-list-alt align-middle"></i>
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
        </div>
    );
}
ProductProperties.propTypes = {
    PrimaryProduct: PropType.object
};