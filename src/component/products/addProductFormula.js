/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Modal, Table, message } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import IngredientServices from '../../services/ingredients';
import ProductServices from '../../services/products';

import { AddIngredient } from '../ingredients/addIngredient';

export const AddProductFormula = props => {

    const IngredientSVC = new IngredientServices();
    const ProductSVC = new ProductServices();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Ingredients, setIngredients] = useState([]);
    const [IngredientsAdded, setIngredientsAdded] = useState([]);
    const [UnitList, setUnitList] = useState([]);
    const [Formula, setFormula] = useState([]);
    const [AddIngResult, setAddIngResult] = useState();

    useEffect(() => {
        if (isModalVisible) {
            LoadPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    useEffect(() => {
        if (AddIngResult === "Created") {
            LoadPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddIngResult]);

    const ExcludeCommonElements = (arr1, arr2) => {
        let newArr = []

        arr1.forEach(item => {
            if (arr2.length > 0) {
                arr2.forEach(el => {
                    if (el.IngredientID !== item.IngredientID) {
                        newArr = [...newArr, item];
                    }
                })
            } else {
                newArr = [...newArr, item];
            }
        });

        setIngredients(newArr);
    }

    const LoadPage = () => {
        IngredientSVC.List().then(res => {
            ExcludeCommonElements(res, IngredientsAdded);
            IngredientSVC.UnitList().then(src => {
                let newUnits = src.filter(item => item.Symbol === 'g' || item.Symbol === 'ml')
                setUnitList(newUnits);
            });
        });

    }

    const handleCallback = (childData) => {
        setAddIngResult(childData);
    }

    const handleDelete = (item) => {
        const NewData = Formula.filter(src => src.IngredientID !== item.IngredientID)
        setFormula(NewData);
    }

    const { handleSubmit, control, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty } = useFormState({ control });

    const onSubmit = data => {
        //console.log(data);
        const UnitData = UnitList.filter(src => src.UnitID === data.UnitID)[0];

        const newIngredient = {
            PrimaryProductID: props.PrimaryProduct.PrimaryProductID,
            IngredientID: data.Ingredient.IngredientID,
            IngredientName: data.Ingredient.IngredientName,
            TypeName: data.Ingredient.TypeName,
            Qty: data.Qty,
            UnitID: data.UnitID,
            UnitName: UnitData.UnitName,
            Symbol: UnitData.Symbol
        }
        const newData = [...Formula, newIngredient];
        setFormula(newData);

        const newIngAdded = [...IngredientsAdded, data.Ingredient];
        setIngredientsAdded(newIngAdded);
        const newIngredients = Ingredients.filter(src => src.IngredientID !== data.Ingredient.IngredientID);
        setIngredients(newIngredients);
        handleCancel();
    }

    const handleCancel = () => {
        reset({
            Ingredient: {
                IngredientID: null,
                IngredientName: "",
                TypeID: null,
                TypeName: "",
                PhotoURL: "",
                ActionType: ""
            },
            Qty: "",
            Unit: {
                UnitID: null,
                UnitName: "",
                Symbol: "",
                ActionType: ""
            }
        });
        //reset();
    }

    const handleTotalCancel = () => {
        handleCancel();
        setFormula([]);
        setIsModalVisible(false);
        setIngredientsAdded([]);        
        props.parentCallback('Cancel');
    }

    const SaveFormula = () => {
        let model = {
            ...props.PrimaryProduct,
            Formula: Formula
        };
        //console.log(model);
        ProductSVC.UpsertFormula(model, "AddNew").then(res => {
            if (res) {
                props.parentCallback('Created');
                handleCancel();
                setFormula([]);
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

    const columnsAdmin = [
        {
            title: 'Ingrediente',
            dataIndex: 'IngredientName',
            key: 'x',
            className: 'text-center'
        },
        {
            title: 'Cantidad',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <span>{e.Qty + " " + e.Symbol}</span>
            )
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <a onClick={() => handleDelete(e)}>
                    Eliminar
                </a>
            ),
        },
    ]
    return (
        <div>
            <button onClick={() => setIsModalVisible(true)} className="btn btn-outline-primary">
                <i className="far fa-money-check-edit"></i> Agregar Formula
            </button>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">Nueva Formula
                        </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}>
                <div>
                    <h4 className="m-0 text-font-base mb-3">
                        Producto: <span className="text-primary-color">{props.PrimaryProduct.Name}</span>
                    </h4>
                    <AddIngredient parentCallback={handleCallback}/>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-0 mb-3">
                        <div className="row m-0">
                            <Controller
                                name="Ingredient"
                                defaultValue={{
                                    "IngredientID": "",
                                    "IngredientName": "",
                                    "TypeID": "",
                                    "TypeName": "",
                                    "PhotoURL": "",
                                    "ActionType": ""
                                }}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <FormControl variant="outlined" className="w-100 my-2">
                                        <Autocomplete
                                            id="ingredient"
                                            options={Ingredients}
                                            value={value}
                                            onChange={(_, data) => onChange(data)}
                                            // onChange={onChange}
                                            getOptionLabel={(option) => option.IngredientName}
                                            groupBy={(option) => option.TypeName}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Ingrediente"
                                                    variant="outlined"
                                                    helperText={error ? (<label className="text-font-base text-danger">
                                                        {error.message}
                                                    </label>) : null}
                                                />
                                            )}
                                        // onChange={(event, newValue) => {
                                        //     console.log(JSON.stringify(newValue, null, ' '));
                                        // }}
                                        />
                                    </FormControl>
                                )}
                                rules={{ required: "Requerido" }}
                            />
                        </div>
                        <div className="row row-cols-3 m-0">
                            <div className="col-sm-3 px-1">
                                <Controller
                                    name="Qty"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="Qty"
                                                label="Cantidad"
                                                variant="outlined"
                                                value={value}
                                                type="number"
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error ? (<label className="text-font-base text-danger">
                                                    {error.message}
                                                </label>) : null} />
                                        </FormControl>
                                    )}
                                    rules={{ required: "Requerido" }}
                                />
                            </div>
                            <div className="col-sm-4 px-1">
                                <Controller name="UnitID"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField
                                                id="UnitID"
                                                select
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                // onChange={(_, data) => onChange(data)}
                                                label="Unidad"
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
                                    //onChange={e => e}
                                    rules={{ required: "Requerido" }}
                                />
                            </div>
                            <div className="col-sm-5 px-1">
                                <div className="row mx-0 my-1">
                                    <Button variant="outlined" color="primary" className="mt-2 mx-1 py-3 px-1" disabled={!isDirty} type="submit">
                                        <i className="fas fa-check"></i>
                                    </Button>
                                    <Button variant="outlined" color="secondary" className="mt-2 mx-1 py-3 px-1" onClick={() => handleCancel()}>
                                        <i className="fas fa-times"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <Table className="productTable"
                        columns={columnsAdmin}
                        rowKey={record => record.IngredientID}
                        dataSource={Formula}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                    />
                    <div className="text-center">
                        <Button variant="outlined" color="primary" className="mt-2 mx-1 p-2" onClick={() => SaveFormula()} disabled={Formula.length > 0 ? false : true}>
                            Guardar Formula
                        </Button>
                        <Button variant="outlined" color="secondary" className="mt-2 mx-1 p-2" onClick={() => handleTotalCancel()}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

AddProductFormula.propTypes = {
    PrimaryProduct: PropType.object,
    parentCallback: PropType.func
};