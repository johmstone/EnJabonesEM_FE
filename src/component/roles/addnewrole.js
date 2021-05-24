import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, message } from "antd";
import { Context } from "../../store/appContext";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import RolesService from '../../services/roles';

export const AddNewRole = () => {
    const { actions } = useContext(Context);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const RolesSVC = new RolesService();
    const { handleSubmit, control, reset } = useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = event => {
        cleanFields();
        event.preventDefault();
    };
    const cleanFields = () => {
        setIsModalVisible(false);
        reset({
            RoleName: "",
            RoleDescription: ""
        });
    };

    const onSubmit = data => {
        //console.log(data);
        RolesSVC.AddNew(data).then(res => {
            if(res){
                actions.UploadRoleList()
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
    const ModalContent = () => {
        return (
            <article className="card-body mx-auto py-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="RoleName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField
                                    id="RoleName"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange}
                                    label="Nombre del Rol"
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null}>
                                </TextField>
                            </FormControl>
                        )}
                        rules={{ required: "Este campo es obligatorio" }}
                    />
                    <Controller
                        name="RoleDescription"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField
                                    id="RoleDescription"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChange}
                                    label="Descripción"
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null}>
                                </TextField>
                            </FormControl>
                        )}
                        rules={{ required: "Este campo es obligatorio" }}
                    />
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
            <button className="btn btn-outline-dark text-black m-0" onClick={showModal}>
                <i className="fas fa-plus-square fa-1x"></i> Crear Nuevo Rol
            </button>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0"> Crear Nuevo Rol
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={handleCancel}
                footer={[]}>
                <ModalContent />
            </Modal>
        </div>
    )
}

