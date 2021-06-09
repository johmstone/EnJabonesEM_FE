/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, Fragment } from "react";
import PropType from "prop-types";
import { Tooltip, Modal, Button, message } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

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

    const handleCancel = () => {
        setIsModalVisible(false);
        reset();
    }

    const onSubmit = data => {
        console.log(data);
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
                <article>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-0 mb-3">
                        <div className="row row-cols-2 m-0">
                            <div className="col">
                                <Controller
                                    name="Qty"
                                    className="col"
                                    control={control}
                                    defaultValue={props.IsAddNew ? '' : props.Product.Qty}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="Qty"
                                                label="Cantidad"
                                                variant="outlined"
                                                size="small"
                                                value={value}
                                                type="number"
                                                onChange={onChange}
                                                autoFocus
                                                error={!!error}
                                                helperText={error ? (<label className="text-font-base text-danger">
                                                    {error.message}
                                                </label>) : null} />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: { value: true, message: 'Requerido' },
                                        min: { value: 1, message: "Mínimo 1" }
                                    }}
                                />

                                {/* <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="Qty"
                                        label="Precio"
                                        variant="outlined"
                                        size="small"
                                        type="number"

                                        {
                                        ...register('Qty', {
                                            required: {value: true, message: 'test'}
                                            , min: {value: 5, message: "Mínimo 1"}
                                        })
                                        }
                                        error={!!errors.Qty}
                                        helperText={errors.Qty ? (<label className="text-font-base text-danger">
                                            {errors.Qty.message}
                                        </label>) : null} />
                                </FormControl> */}
                            </div>
                            {/* <div className="col">
                                <Controller
                                    name="UnitID"
                                    className="col"
                                    control={control}
                                    defaultValue={props.IsAddNew ? 1 : props.Product.UnitID}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="UnitID"
                                                label="Unidad"
                                                select
                                                variant="outlined"
                                                size="small"
                                                value={value}
                                                type="number"
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error ? (<label className="text-font-base text-danger">
                                                    {error.message}
                                                </label>) : null}>
                                                {
                                                    UnitList.map((item, i) => {
                                                        return (
                                                            <MenuItem value={item.UnitID} key={i}>{item.UnitName}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </TextField>
                                        </FormControl>
                                    )}
                                    rules={{ required: true }}
                                />
                            </div> */}
                        </div>
                        {/* <div className='row row-cols-3 m-0'>
                            <div className="col pr-1">
                                <Controller
                                    name="Price"
                                    control={control}
                                    defaultValue={ props.IsAddNew? '': props.Product.Price}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="Price"
                                                label="Precio"
                                                variant="outlined"
                                                size="small"
                                                value={value}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                                                  }}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error ? (<label className="text-font-base text-danger">
                                                    {error.message}
                                                </label>) : null} />
                                        </FormControl>
                                    )}
                                    rules={{ 
                                        required: {value: true, message: 'test'}, 
                                        min: {value:100, message:"Debe ser al menos ₡100"}
                                    }}
                                />
                                
                            </div>
                            <div className="col px-1">
                                <Controller
                                    name="IVA"
                                    control={control}
                                    defaultValue={props.IsAddNew ? '' : props.Product.IVA}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="IVA"
                                                label="IVA"
                                                variant="outlined"
                                                size="small"
                                                value={value}
                                                type="number"
                                                onChange={onChange}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }} />
                                        </FormControl>
                                    )}
                                />
                            </div>
                            <div className="col pl-1">
                                <Controller
                                    name="Discount"
                                    control={control}
                                    defaultValue={props.IsAddNew ? '' : props.Product.Discount}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="Discount"
                                                label="Descuento"
                                                variant="outlined"
                                                size="small"
                                                value={value}
                                                type="number"
                                                onChange={onChange}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }} />
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div> */}
                        <div className="form-group mt-3 mb-0 mx-0 text-center">
                            {/* <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit" disabled={!isDirty}> */}
                            {/* <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit">
                                Guardar
                            </button> */}
                            <input type='submit' />
                            <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={() => handleCancel()}>
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