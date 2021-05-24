import React, { useContext, useState } from "react";
import PropType from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Modal, message } from "antd";
import { Context } from "../store/appContext";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

export const UpsertWebDirectory = (props) => {
    const { store, actions } = useContext(Context);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [SuccessMsg, setMsg] = useState("");

    const { register, handleSubmit, control, formState, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });
    const { isDirty, isValid } = formState

    const onSubmit = data => {
        console.log(data);
        console.log(formState)
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
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <InputLabel id="directory-label">Directorio</InputLabel>
                                <Select labelId="directory-label"
                                    id="directory"
                                    value={value}
                                    onChange={onChange}
                                    label="Directorio">
                                    <MenuItem value={1}>No Autenticado</MenuItem>
                                    <MenuItem value={2}>Autenticado</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        rules={{ required: "Debe seleccionar el Directorio" }}
                    />
                    <Controller
                        name="DisplayName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="DisplayName"
                                    label="Nombre"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange} />
                            </FormControl>
                        )}
                        rules={{ required: "Por favor ingrese un nombre" }}
                    />
                    <Controller
                        name="Controller"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="Controller"
                                    label="Controllador"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange} />
                            </FormControl>
                        )}
                        rules={{ required: "Por favor ingrese el nombre del Path Principal" }}
                    />
                    <Controller
                        name="Action"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="Action"
                                    label="Acción"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange} />
                            </FormControl>
                        )}
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
                                            defaultValue={false}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <Checkbox checked={value} onChange={onChange} name="PublicMenu" />
                                            )}
                                        />
                                    </td>
                                    <td className="text-center align-middle pt-0">
                                        <Controller
                                            name="AdminMenu"
                                            control={control}
                                            defaultValue={false}
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
                                            defaultValue=""
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl variant="outlined" className="w-100 my-2">
                                                    <TextField id="Parameter"
                                                        label="Parámetro"
                                                        placeholder="(Si aplica)"
                                                        variant="outlined"
                                                        value={value}
                                                        onChange={onChange} />
                                                </FormControl>
                                            )}
                                        />
                                    </td>
                                    <td className="p-0">
                                        <Controller
                                            name="Order"
                                            control={control}
                                            defaultValue=""
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl variant="outlined" className="w-100 my-2">
                                                    <TextField id="Order"
                                                        label="Orden"
                                                        type="number"
                                                        variant="outlined"
                                                        value={value}
                                                        onChange={onChange} />
                                                </FormControl>
                                            )}
                                            rules={{required: "Este campo es requerido"}}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="form-group m-0">
                        <div className="col-xs-6">
                            <button className="button btn btn-block mx-0 mt-0 mb-2 py-2 rounded border border-secondary text-uppercase" type="submit" disabled={!isDirty || !isValid}>
                                Guardar
                            </button>
                        </div>
                    </div>
                    <div className="form-group text-center mt-2 mb-0">
                        <button className="btn btn-outline-danger text-font-base btn-block" onClick={handleCancel}>
                            Cancelar
						</button>
                    </div>
                </form>
            </article>
        )
    }

    const cleanFields = () => {
        setIsModalVisible(false);
        reset();
        setMsg("");
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = event => {
        cleanFields();
        event.preventDefault();
    };

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
Error.propTypes = {
    WD: PropType.object,
    isNew: PropType.bool
    // 2) add here the new properties into the proptypes object
};