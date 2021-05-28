import React from "react";
import PropType from "prop-types";
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { message } from 'antd';

import UsersService from '../../services/users';

export const MainInfoUser = (props) => {

    const { handleSubmit, control, reset } = useForm();
    const { isDirty } = useFormState({ control });

    const UsersSVC = new UsersService();

    const onSubmit = data => {
        let UpdateUser = {...props.User, FullName: data.FullName, ActionType: 'Update'}

        UsersSVC.Upsert(UpdateUser,'Update').then(res => {
            if(res){
                window.location.reload();
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
            FullName: props.User.FullName,
            Email: props.User.Email,
            RoleName: props.User.RoleName
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="my-3">
            <Controller
                name="FullName"
                control={control}
                defaultValue={props.User.FullName}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl variant="outlined" className="w-100 my-2">
                        <TextField id="FullName"
                            style={{width: "350px"}}
                            className="mw-100"
                            label="Nombre"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            disabled={!props.WriteRight}
                            error={!!error}
                            helperText={error ? (<label className="text-font-base text-danger">
                                <i className="fa fa-times-circle"></i> {error.message}
                            </label>) : null} />
                    </FormControl>
                )}
                rules={{ required: "Por favor ingrese un nombre" }}
            />
            <Controller
                name="Email"
                control={control}
                defaultValue={props.User.Email}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl variant="outlined" className="w-100 my-2">
                        <TextField id="Email"
                            style={{width: "350px"}}
                            className="mw-100"
                            label="Correo Electrónico"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            disabled/>
                    </FormControl>
                )}
                rules={{ required: "Por favor ingrese el email" }}
            />
            <Controller
                name="RoleName"
                control={control}
                defaultValue={props.User.RoleName}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl variant="outlined" className="w-100 my-2">
                        <TextField id="RoleName"
                            style={{width: "350px"}}
                            className="mw-100"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            label="Rol"
                            defaultValue={props.User.RoleName}
                            disabled>                            
                        </TextField>
                    </FormControl>
                )}
                rules={{ required: "Debe seleccionar un rol" }}
            />
            {
                isDirty ? (
                    <div className="form-group my-2">
                        <div className="col-xs-6">
                            <button type="submit" className="btn btn-outline-primary mt-0 mb-2 mr-1">Guardar</button>
                            <button type="button" className="btn btn-outline-primary mt-0 mb-2 " onClick={() => handleCancel()}>Cancelar</button>
                        </div>
                    </div>
                ) : null
            }

        </form>
    )
}

MainInfoUser.propTypes = {
    User: PropType.object,
    WriteRight: PropType.bool
};