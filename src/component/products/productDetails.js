/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Modal, Table, message, Card, Button } from 'antd';
import CurrencyFormat from 'react-currency-format';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

export const ProductDetails = props => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [AddIngResult, setAddIngResult] = useState();
    const [QtyValue, setQtyValue] = useState(1);

    useEffect(() => {
        if (!isModalVisible) {
            handleCancel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    const handleCallback = (childData) => {
        setAddIngResult(childData);
    }

    const { handleSubmit, control, reset, register } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty, errors } = useFormState({ control });

    const handleChange = event => {
        document.getElementById(event.target.id).focus()
    }

    const handleMinusPlus = (value) => {
        var x = document.getElementById("Qty");
        if(parseInt(x.value) === 1 && value === -1) {
            
        } else {
            var y = parseInt(x.value) + value;
            x.value = y;
        }
        
    }
    const handleCancel = () => {
        setQtyValue(1);
        reset({
            Qty: 1,
            ProductID: ""
        });
        setIsModalVisible(false);
    }

    const onSubmit = data => {
        console.log(data);
    }

    return (
        <div className="mx-2">
            <Card size="small"
                hoverable
                cover={<img alt="example" src={props.PrimaryProduct.PhotoURL} onClick={() => setIsModalVisible(true)} />}
                actions={[
                    <i className="far fa-cart-arrow-down"></i>,
                ]}
                style={{ width: 300 }}>
                <h5 className="text-font-base" onClick={() => setIsModalVisible(true)} >{props.PrimaryProduct.Name}</h5>
                <p className="text-font-base" onClick={() => setIsModalVisible(true)} >{props.PrimaryProduct.Description}</p>
                <p className="text-font-base m-0" onClick={() => setIsModalVisible(true)}>
                    Desde:
                    <CurrencyFormat value={Math.min(...props.PrimaryProduct.Products.map(src => src.Price))} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} className="mx-2" />
                </p>
                <p className="text-font-base" onClick={() => setIsModalVisible(true)} >
                    Hasta:
                    <CurrencyFormat value={Math.max(...props.PrimaryProduct.Products.map(src => src.Price))} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} className="mx-2" />
                </p>
            </Card>
            <Modal
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={false}
                width="80%">
                <div className="">
                    <h4 className="m-0 text-font-base mb-3">
                        {props.PrimaryProduct.Name}
                    </h4>
                    <hr />
                    <div className="row row-cols-2 m-0">
                        <div className="col-sm-6">
                            <img alt={props.PrimaryProduct.Name} src={props.PrimaryProduct.PhotoURL} className="w-100 rounded" />
                        </div>
                        <div className="col-sm-6">
                            <p className="text-font-base">{props.PrimaryProduct.Description}</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-0 mb-3">
                                <div className="row m-0">
                                    <Controller name="ProductID"
                                        control={control}
                                        defaultValue=""
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <FormControl variant="outlined" className="w-100 my-2">
                                                <TextField
                                                    id="ProductID"
                                                    select
                                                    variant="outlined"
                                                    value={value}
                                                    size="small"
                                                    onChange={onChange}
                                                    label="Tamaño"
                                                    error={!!error}
                                                    helperText={error ? (<label className="text-font-base text-danger">
                                                        {error.message}
                                                    </label>) : null}>
                                                    {
                                                        props.PrimaryProduct.Products.map((item, i) => {
                                                            return (
                                                                <MenuItem value={item.ProductID} key={i}>
                                                                    {item.Qty} {item.Symbol} (<CurrencyFormat value={item.Price} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} />)
                                                                </MenuItem>
                                                            )
                                                        })
                                                    }
                                                </TextField>
                                            </FormControl>
                                        )}
                                        //onChange={e => e}
                                        rules={{ required: "Requerido" }}
                                    />
                                </div>
                                <label className="fa-1x text-font-base">Cantidad</label>
                                <div className="row m-0">
                                    <div className="input-group input-group-sm mb-3" style={{ width: "125px" }}>
                                        <div className="input-group-prepend">
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleMinusPlus(-1)}>
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                        <input id='Qty' type="number" className="form-control input-NumberText"
                                            {...register('Qty', {
                                                required: { value: true, message: 'Requerido' }
                                                , min: { value: 1, message: 'Mínimo 1' }
                                            })}
                                            onChange={handleChange}
                                            defaultValue={QtyValue}
                                            min={0}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleMinusPlus(+1)}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <Button htmlType="submit" type="primary" shape="round" disabled={!isDirty} className="mx-2">
                                        <i className="far fa-cart-arrow-down"></i> Añadir al Carrito
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )

}

ProductDetails.propTypes = {
    PrimaryProduct: PropType.object,
    parentCallback: PropType.func
};