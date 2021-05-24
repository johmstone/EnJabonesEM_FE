import React, { useContext, useState } from "react";
import PropType from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Modal, message } from "antd";
import { Context } from "../../store/appContext";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import WebDirectoryService from '../../services/webdirectory';

export const UpsertWebDirectory = (props) => {
    const { actions } = useContext(Context);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const WebDirectorySVC = new WebDirectoryService();
    const { handleSubmit, control, reset } = useForm();

    const onSubmit = data => {
        let model = {
            WebID: props.isNew ? null : props.WD.WebID,
            AppID: data.AppID,
            DisplayName: data.DisplayName,
            Controller: data.Controller,
            Action: data.Action === "" ? 'Index' : data.Action,
            PublicMenu: data.PublicMenu,
            AdminMenu: data.AdminMenu,
            Parameter: data.Parameter === "" ? null : data.Parameter,
            Order: data.Order,
            ActiveFlag: true,
            ActionType: props.isNew ? "AddNew" : "Update"

        }
        //console.log(model);
        WebDirectorySVC.Upsert(props.isNew ? 'AddNew' : 'Update', model).then(res => {
            if (res) {
                actions.uploadWDList();
            } else {
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        });

    };

    const cleanFields = () => {
        setIsModalVisible(false);
        reset({
            AppID: props.isNew ? "" : props.WD.AppID,
            DisplayName: props.isNew ? "" : props.WD.DisplayName,
            Controller: props.isNew ? "" : props.WD.Controller,
            Action: props.isNew ? "" : props.WD.Action,
            PublicMenu: props.isNew ? false : props.WD.PublicMenu,
            AdminMenu: props.isNew ? false : props.WD.AdminMenu,
            Parameter: props.isNew ? "" : props.WD.Parameter,
            Order: props.isNew ? "" : props.WD.Order
        });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = event => {
        cleanFields();
        event.preventDefault();
    };

    const BtnModal = () => {
        if (props.isNew) {
            return (
                <button className="btn btn-outline-secondary text-black m-0" onClick={showModal}>
                    <i className="fas fa-plus-square fa-1x"></i> Agregar un nuevo Web Directory
                </button>
            )
        } else {
            return (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a title="Editar" onClick={showModal}>
                    <i className="far fa-edit"></i>
                </a>
            )
        }
    }

    const ModalContent = () => {
        return (
            <article className="card-body mx-auto py-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="AppID"
                        control={control}
                        defaultValue={props.isNew ? "" : props.WD.AppID}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField
                                    id="directory"
                                    select
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange}
                                    label="Directorio"
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null}>
                                    <MenuItem value={1}>No Autenticado</MenuItem>
                                    <MenuItem value={2}>Autenticado</MenuItem>
                                </TextField>
                            </FormControl>
                        )}
                        rules={{ required: "Debe seleccionar el Directorio" }}
                    />
                    <Controller
                        name="DisplayName"
                        control={control}
                        defaultValue={props.isNew ? "" : props.WD.DisplayName}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="DisplayName"
                                    label="Nombre"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null} />
                            </FormControl>
                        )}
                        rules={{ required: "Por favor ingrese un nombre" }}
                    />
                    <Controller
                        name="Controller"
                        control={control}
                        defaultValue={props.isNew ? "" : props.WD.Controller}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="Controller"
                                    label="Controllador"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null} />
                            </FormControl>
                        )}
                        rules={{
                            required: "Por favor ingrese el nombre del Path Principal",
                            pattern: { value: /^[A-Za-z][A-Za-z0-9]*$/, message: 'No debe contener espacios!' }
                        }}
                    />
                    <Controller
                        name="Action"
                        control={control}
                        defaultValue={props.isNew ? "" : props.WD.Action}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="Action"
                                    label="Acción"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null} />
                            </FormControl>
                        )}
                        rules={{
                            pattern: { value: /^[A-Za-z][A-Za-z0-9]*$/, message: 'No debe contener espacios!' }
                        }}
                    />
                    <div className="m-0 w-100" >
                        <table className="table table-borderless">
                            <thead className="border-0">
                                <tr>
                                    <th scope="col" className="text-center p-0">
                                        <label className="m-0">Público</label>
                                    </th>
                                    <th scope="col" className="text-center p-0">
                                        <label className="m-0">Administrativo</label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-0">
                                    <td className="text-center align-middle pt-0">
                                        <Controller
                                            name="PublicMenu"
                                            control={control}
                                            defaultValue={props.isNew ? false : props.WD.PublicMenu}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <Checkbox checked={value} onChange={onChange} name="PublicMenu" />
                                            )}
                                        />
                                    </td>
                                    <td className="text-center align-middle pt-0">
                                        <Controller
                                            name="AdminMenu"
                                            control={control}
                                            defaultValue={props.isNew ? false : props.WD.AdminMenu}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <Checkbox checked={value} onChange={onChange} name="AdminMenu" />
                                            )}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-0">
                                    <td className="pl-0 py-0 pr-2">
                                        <Controller
                                            name="Parameter"
                                            control={control}
                                            defaultValue={props.isNew ? "" : props.WD.Parameter}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl variant="outlined" className="w-100 my-2">
                                                    <TextField id="Parameter"
                                                        label="Parámetro"
                                                        placeholder="(Si aplica)"
                                                        variant="outlined"
                                                        value={value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error ? (<label className="text-font-base text-danger">
                                                            <i className="fa fa-times-circle"></i> {error.message}
                                                        </label>) : null} />
                                                </FormControl>
                                            )}
                                            rules={{
                                                pattern: { value: /^[A-Za-z][A-Za-z0-9]*$/, message: 'No debe contener espacios!' }
                                            }}
                                        />
                                    </td>
                                    <td className="p-0">
                                        <Controller
                                            name="Order"
                                            control={control}
                                            defaultValue={props.isNew ? "" : props.WD.Order}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl variant="outlined" className="w-100 my-2">
                                                    <TextField id="Order"
                                                        label="Orden"
                                                        type="number"
                                                        variant="outlined"
                                                        InputProps={{ inputProps: { min: 0 } }}
                                                        value={value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error ? (<label className="text-font-base text-danger">
                                                            <i className="fa fa-times-circle"></i> {error.message}
                                                        </label>) : null} />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Este campo es requerido",
                                                min: { value: 0, message: 'El valor mínimo permitido es 0' }
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="form-group m-0">
                        <div className="col-xs-6">
                            <button className="btn btn-outline-primary btn-block mx-0 mt-0 mb-2 py-2 text-uppercase" type="submit">
                                Guardar
                            </button>
                        </div>
                    </div>
                    <div className="form-group text-center mt-2 mb-0">
                        <button className="btn btn-outline-danger btn-block mx-0 mt-0 mb-2 py-2 text-uppercase" onClick={handleCancel}>
                            Cancelar
						</button>
                    </div>
                </form>
            </article>
        )
    }

    return (
        <div>
            <BtnModal />
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">
                        {props.isNew ? "Nuevo Directorio" : "Editar Directorio"}
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={handleCancel}
                footer={[]}>
                <ModalContent />
            </Modal>
        </div>
    );
}
UpsertWebDirectory.propTypes = {
    WD: PropType.object,
    isNew: PropType.bool
    // 2) add here the new properties into the proptypes object
};