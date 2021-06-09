/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, Fragment } from "react";
import PropType from "prop-types";
import { Modal, Table, Tooltip, message, Popconfirm } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import IngredientServices from '../../services/ingredients';
import ProductServices from '../../services/products';

import { AddIngredient } from '../ingredients/addIngredient';

export const EditProductFormula = props => {

    const IngredientSVC = new IngredientServices();
    const ProductSVC = new ProductServices();

    const [isLoading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Touched, setTouched] = useState(false);
    const [AddIngredientFormula, setAddIngredientFormula] = useState(false);
    const [Ingredients, setIngredients] = useState([]);
    const [UnitList, setUnitList] = useState([]);    
    const [Formula, setFormula] = useState([]);
    const [AddIngResult, setAddIngResult] = useState();
    const [EditableRow, setEditableRow] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (isModalVisible) {
            setTouched(false);
            ProductSVC.Formula(props.PrimaryProduct.PrimaryProductID).then(res => {
                setFormula(res);
                setAddIngredientFormula(false);
                setLoading(false);
            });
        } else {
            setLoading(false);
            setIngredients([]);
            setUnitList([]);
            setFormula([]);
            setAddIngResult();
            setEditableRow([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    useEffect(() => {
        setLoading(true);
        if (AddIngredientFormula) {
            LoadData();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddIngredientFormula]);

    useEffect(() => {
        if (AddIngResult === "Created") {
            LoadData();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddIngResult]);

    const LoadData = () => {
        IngredientSVC.List().then(res => {
            ExcludeCommonElements(res, Formula);
            IngredientSVC.UnitList().then(src => {
                let newUnits = src.filter(item => item.Symbol === 'g' || item.Symbol === 'ml')
                setUnitList(newUnits);
                setAddIngResult();
                setLoading(false);
            });
        });
    }

    const ExcludeCommonElements = (arr1, arr2) => {
        let newArr = []
        arr1.forEach(item => {
            if (arr2.length > 0) {
                if (arr2.find(el => el.IngredientID === item.IngredientID) === undefined) {
                    newArr = [...newArr, item];
                }
            } else {
                newArr = [...newArr, item];
            }
        });
        setIngredients(newArr);
    }


    const handleDelete = (item) => {
        const NewData = Formula.filter(src => src.IngredientID !== item.IngredientID)
        setFormula(NewData);
        setTouched(true);
    }

    const SaveFormula = () => {
        let model = {
            ...props.PrimaryProduct,
            Formula: Formula
        };
        //console.log(model);
        ProductSVC.UpsertFormula(model, "Update").then(res => {
            if (res) {
                props.parentCallback('Created');
                handleCancel();
                setFormula([]);
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

    const handleTotalCancel = () => {
        setIsModalVisible(false)
        setTouched(false);
        handleCancel();
        setIngredients([]);
        setUnitList([]);
        setFormula([]);
        setAddIngResult();
        setEditableRow([]);
    }

    const handleCallback = (childData) => {
        setAddIngResult(childData);
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
            FormulaID: 0,
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
        const newIngredients = Ingredients.filter(src => src.IngredientID !== data.Ingredient.IngredientID);
        setIngredients(newIngredients);
        handleCancel();
        LoadData();
        setTouched(true);
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
        setAddIngredientFormula(false);
    }

    const removeEditableRow = (item) => {
        var x = document.getElementById("ing" + item.IngredientID);
        x.value = item.Qty;
        const newdata = EditableRow.filter(x => x !== item.IngredientID)
        setEditableRow(newdata);
    }

    const updateIngredientRow = (item) => {
        var x = document.getElementById("ing" + item.IngredientID);
        // console.log(x.value);
        // console.log(item);
        const newdata = Formula.map(src => {
            if (src.IngredientID === item.IngredientID && src.Qty !== parseFloat(x.value)) {
                src.Qty = parseFloat(x.value);
                setTouched(true);
                return src;                
            } else {
                return src;
            }
        });
        setFormula(newdata);
        const newEditdata = EditableRow.filter(x => x !== item.IngredientID)
        setEditableRow(newEditdata);
    }

    const columnsAdmin = [
        {
            title: (
                <Fragment>
                    Ingrediente
                    <Tooltip title="Agregar Ingrediente" color="green">
                        <a className="mx-2" onClick={() => setAddIngredientFormula(true)}>
                            <i className="far fa-plus-square"></i>
                        </a>
                    </Tooltip>
                </Fragment>
            ),
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
                <div className="input-group input-group-sm mx-auto" style={{ width: "150px" }}>
                    <div className="input-group-prepend">
                        <Tooltip title="Editar" color="blue">
                            <a className="input-group-text"
                                onClick={() => setEditableRow([...EditableRow, e.IngredientID])}
                                style={{ display: EditableRow.indexOf(e.IngredientID) >= 0 ? "none" : "block" }}>
                                <i className="far fa-pencil-alt"></i>
                            </a>
                        </Tooltip>
                        <Tooltip title="Guardar" color="green">
                            <a className="input-group-text"
                                onClick={() => updateIngredientRow(e)}
                                style={{ display: EditableRow.indexOf(e.IngredientID) >= 0 ? "block" : "none" }}>
                                <i className="far fa-check text-success"></i>
                            </a>
                        </Tooltip>
                        <Tooltip title="Cancelar" color="red">
                            <a className="input-group-text"
                                onClick={() => removeEditableRow(e)}
                                style={{ display: EditableRow.indexOf(e.IngredientID) >= 0 ? "block" : "none" }}>
                                <i className="far fa-times text-danger"></i>
                            </a>
                        </Tooltip>
                    </div>
                    <input id={"ing" + e.IngredientID} type="number" className="form-control" defaultValue={e.Qty}
                        readOnly={EditableRow.indexOf(e.IngredientID) >= 0 ? false : true} />
                    <div className="input-group-append">
                        <span className="input-group-text">{e.Symbol}</span>
                    </div>
                </div>
            )
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <Tooltip title="Eliminar" color="red" placement="left">
                    <Popconfirm
                        title="Esta seguro que quiere eliminar este ingrediente?"
                        onConfirm={() => handleDelete(e)}
                        okText="Si"
                        cancelText="No">
                        <a className="text-danger">
                            <i className="far fa-times-circle"></i>
                        </a>
                    </Popconfirm>
                </Tooltip>
            ),
        },
    ]

    const ContentPage = () => {
        if (isLoading) {
            return (
                <div className="text-center text-black-50">
                    <h2 className="text-black-50">Cargando...</h2>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            )
        } else {
            return (
                <div>
                    <h4 className="m-0 text-font-base mb-3">
                        Producto: <span className="text-primary-color">{props.PrimaryProduct.Name}</span>
                    </h4>
                    <div style={{ display: AddIngredientFormula ? 'block' : 'none' }}>
                        <AddIngredient parentCallback={handleCallback} />
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
                                        <FormControl variant="outlined" className="w-100 my-2 mx-1">
                                            <Autocomplete
                                                id="ingredient"
                                                options={Ingredients}
                                                value={value}
                                                size="small"
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
                                                    size="small"
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
                                                    size="small"
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
                                    <div className="row mx-0 my-2">
                                        <Button variant="outlined" color="primary" size="small" className="mx-1 btn-saveIngredient" disabled={!isDirty} type="submit">
                                            <i className="fas fa-check"></i>
                                        </Button>
                                        <Button variant="outlined" color="secondary" size="small" className="mx-1 btn-saveIngredient" onClick={() => handleCancel()}>
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Table className="productTable"
                        columns={columnsAdmin}
                        rowKey={record => record.IngredientID}
                        dataSource={Formula}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                    />

                    <div className="text-center">
                        <Popconfirm
                            title="Esta seguro que quiere guardar?"
                            onConfirm={() => SaveFormula()}
                            okText="Si"
                            cancelText="No">
                            <Button variant="outlined" color="primary" className="mt-2 mx-1 p-2" disabled={!Touched}>
                                Guardar Formula
                            </Button>
                        </Popconfirm>

                        <Button variant="outlined" color="secondary" className="mt-2 mx-1 p-2" onClick={() => handleTotalCancel()}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            )
        }
    }
    return (
        <div>
            <button className="btn btn-outline-primary" onClick={() => setIsModalVisible(true)}>
                <i className="far fa-money-check-edit"></i> Editar Formula
            </button>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">Editar Formula
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

EditProductFormula.propTypes = {
    PrimaryProduct: PropType.object,
    Formula: PropType.array,
    OriginalFormula: PropType.array,
    parentCallback: PropType.func
};