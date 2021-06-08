/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Modal, message } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import IngredientServices from '../../services/ingredients';

export const AddIngredient = props => {

    const IngredientSVC = new IngredientServices();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Types, setTypes] = useState([]);

    const { handleSubmit, control, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (isModalVisible) {
            LoadPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    const LoadPage = () => {
        IngredientSVC.TypesList().then(res => {
            setTypes(res);
        });
    }

    const onSubmit = data => {
        IngredientSVC.UpsertIngredient(data,'AddNew').then(res => {
            if(res) {
                handleCancel();
                props.parentCallback('Created');
            } else {
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        });        
    }

    const handleCancel = () => {
        reset({
            TypeID: "",
            IngredientName: ""
        });
        setIsModalVisible(false);
    }

    return (
        <div>
            <a className="mx-1" onClick={() => setIsModalVisible(true)}>
                <i className="far fa-plus-square align-middle"></i> Agregar Ingrediente
            </a>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">Nuevo Ingrediente
                        </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="m-0">
                        <div className="row row-cols-2 m-0">
                            <div className="col-sm-6 px-1">
                                <Controller name="TypeID"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField
                                                id="TypeID"
                                                select
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                label="Tipo de Ingrediente"
                                                error={!!error}
                                                helperText={error ? (<label className="text-font-base text-danger">
                                                    {error.message}
                                                </label>) : null}>
                                                {
                                                    Types.map((item, i) => {
                                                        return (
                                                            <MenuItem value={item.TypeID} key={i}>{item.TypeName}</MenuItem>
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
                            <div className="col-sm-6 px-1">
                                <Controller
                                    name="IngredientName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl variant="outlined" className="w-100 my-2">
                                            <TextField id="IngredientName"
                                                label="Ingrediente"
                                                variant="outlined"
                                                value={value}
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
                        </div>
                        <div className="text-center">
                            <Button variant="outlined" color="primary" className="mx-2" disabled={!isDirty} type="submit">
                                Guardar Ingrediente
                            </Button>
                            <Button variant="outlined" color="secondary" className="" onClick={() => handleCancel()}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div >
    );
}

AddIngredient.propTypes = {
    parentCallback: PropType.func
};