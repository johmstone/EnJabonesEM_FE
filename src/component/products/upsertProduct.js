/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Tooltip, Modal, Button, message } from 'antd';
import { useForm, useFormState } from "react-hook-form";

import IngredientServices from '../../services/ingredients';
import ProductServices from '../../services/products';

export const UpsertProduct = props => {

    const IngredientSVC = new IngredientServices();
    const ProductSVC = new ProductServices();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [UnitList, setUnitList] = useState([]);

    useEffect(() => {
        if (isModalVisible) {
            IngredientSVC.UnitList().then(res => {
                setUnitList(res);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    const { handleSubmit, control, reset, register } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty, errors } = useFormState({ control });

    const handleCancel = (event) => {
        setIsModalVisible(false);
        reset();
        event.preventDefault();
    }

    const handleChange = event => {
        document.getElementById(event.target.id).focus()
    }

    const onSubmit = data => {
        //console.log(data);
        const upsertModel = {
            PrimaryProductID: props.PrimaryProduct.PrimaryProductID,
            ProductID: props.IsAddNew ? 0 : props.Product.ProductID,
            Qty: parseFloat(data.Qty),
            UnitID: parseInt(data.UnitID),
            Price: parseFloat(data.Price),
            IVA: 0,
            Discount: parseFloat(data.Discount),
            ActionType: props.IsAddNew ? null : 'Update',
            visibleFlag: true
        }
        //console.log(upsertModel);
        ProductSVC.UpsertProduct(upsertModel, props.IsAddNew?'AddNew':'Update').then(res => {
            if(res){
                props.parentCallback(res);
                reset();
                setIsModalVisible(false);
            } else {
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        })

    }

    const BtnAction = () => {
        if (props.IsAddNew) {
            return (
                <Tooltip title="Agregar Presentación" color="blue" placement="right">
                    <Button type="dashed" onClick={() => setIsModalVisible(true)} className="mx-2">
                        <i className="fas fa-plus"></i>
                    </Button>
                </Tooltip>
            )
        } else {
            return (
                <Tooltip title="Editar" color="blue">
                    <a onClick={() => setIsModalVisible(true)}>
                        <i className="fas fa-pencil-alt align-middle"></i>
                    </a>
                </Tooltip>
            )
        }
    }
    const ContentPage = () => {
        return (
            <div>
                <h4 className="m-0 text-font-base mb-3">
                    Producto: <span className="text-primary-color">{props.PrimaryProduct.Name}</span>
                </h4>
                <hr className="text-black" />
                <article>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-0 mb-3">
                        <div className="form-row">
                            <div className="col-sm-6 mb-3">
                                <label className="fa-1x text-font-base">Cantidad</label>
                                <input id="Qty" type="number"
                                    className={errors.Qty ? "form-control is-invalid" : "form-control"}
                                    {...register('Qty', {
                                        required: { value: true, message: 'Requerido' }
                                        , min: { value: 1, message: 'Mínimo 1!' }
                                    })}
                                    onChange={handleChange}
                                    tabIndex={1}
                                    defaultValue={props.IsAddNew ? '' : props.Product.Qty}
                                />
                                {
                                    errors.Qty ?
                                        (<div className="invalid-feedback fa-1x">
                                            {errors.Qty?.message}
                                        </div>) : null
                                }
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label className="fa-1x text-font-base">Unidad</label>
                                <select id="UnitID"
                                    className={errors.UnitID ? "form-control is-invalid" : "form-control"}
                                    {...register('UnitID', {
                                        required: { value: true, message: 'Requerido' }
                                    })}
                                    onChange={handleChange}
                                    tabIndex={2}
                                    defaultValue={props.IsAddNew ? 1 : props.Product.Qty}
                                >
                                    {
                                        UnitList.map((item, i) => {
                                            return (
                                                <option value={item.UnitID} key={i}>{item.UnitName} ({item.Symbol})</option>
                                            )
                                        })
                                    }
                                </select>
                                {
                                    errors.UnitID ?
                                        (<div className="invalid-feedback fa-1x">
                                            {errors.UnitID?.message}
                                        </div>) : null
                                }
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-sm-6 mb-3">
                                <label className="fa-1x text-font-base">Precio (₡)</label>
                                <input id="Price" type="number" step="any"
                                    className={errors.Price ? "form-control is-invalid" : "form-control"}
                                    {...register('Price', {
                                        required: { value: true, message: 'Requerido' }
                                        , min: { value: 100, message: 'Mínimo ₡100!' }
                                    })}
                                    onChange={handleChange}
                                    tabIndex={3}
                                    defaultValue={props.IsAddNew ? '' : props.Product.Price}
                                />
                                {
                                    errors.Price ?
                                        (<div className="invalid-feedback fa-1x">
                                            {errors.Price?.message}
                                        </div>) : null
                                }
                            </div>                            
                            <div className="col-sm-6 mb-3">
                                <label className="fa-1x text-font-base">Descuento (%)</label>
                                <input id="Discount" type="number" step="any"
                                    className={errors.Discount ? "form-control is-invalid" : "form-control"}
                                    {...register('Discount', {
                                        required: false
                                        , min: { value: 0, message: 'Mínimo 0%!' }
                                        , max: { value: 90, message: 'Máximo 90%!' }
                                    })}
                                    onChange={handleChange}
                                    tabIndex={5}
                                    defaultValue={props.IsAddNew ? 0 : props.Product.Discount}
                                />
                                {
                                    errors.Discount ?
                                        (<div className="invalid-feedback fa-1x">
                                            {errors.Discount?.message}
                                        </div>) : null
                                }
                            </div>
                        </div>                        
                        <div className="form-group mt-3 mb-0 mx-0 text-center">
                            <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit" disabled={!isDirty}>
                                Guardar
                            </button>

                            <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </article>
            </div>
        )
    }
    return (
        <div>
            <BtnAction />
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">
                        {props.IsAddNew ? 'Agregar Presentación' : 'Editar Presentación'}
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}
                destroyOnClose>
                <ContentPage />
            </Modal>
        </div>
    );
}

UpsertProduct.propTypes = {
    PrimaryProduct: PropType.object,
    Product: PropType.object,
    IsAddNew: PropType.bool,
    parentCallback: PropType.func
};