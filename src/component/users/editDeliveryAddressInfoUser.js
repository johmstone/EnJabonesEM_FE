/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Tooltip, Modal, message } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import CostaRicaServices from '../../services/costaRica';
import UsersService from '../../services/users';

export const EditDeliveryAddressInfoUser = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Address, setAddress] = useState(props.Address);
    const [Provinces, setProvinces] = useState([]);
    const [IsEditCanton, setIsEditCanton] = useState(false)
    const [Cantons, setCantons] = useState([]);
    const [Districts, setDistricts] = useState([]);

    const CostaRicaSVC = new CostaRicaServices();
    const UsersSVC = new UsersService();

    const { handleSubmit, control, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });
    const { isDirty } = useFormState({ control });

    const LoadPage = () => {
        CostaRicaSVC.Provinces().then(res => {
            setProvinces(res);
            return props.Address.ProvinceID;
        }).then(src => {
            CostaRicaSVC.Cantons(src).then(can => {
                setCantons(can);
                return src;
            }).then(prov => {
                CostaRicaSVC.Districts(prov, props.Address.CantonID).then(dist => {
                    setDistricts(dist);
                });
            })
        });
    }

    useEffect(() => {
        LoadPage()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    const OnChangeProvince = ProvinceInput => {
        let NewAddress = { ...Address, ProvinceID: ProvinceInput.target.value }
        setAddress(NewAddress);
        CostaRicaSVC.Cantons(ProvinceInput.target.value).then(can => {
            setCantons(can);
            setIsEditCanton(true);
        });
    }

    const OnChangeCanton = CantonInput => {
        let NewAddress = { ...Address, CantonID: CantonInput.target.value }

        CostaRicaSVC.Districts(Address.ProvinceID, CantonInput.target.value).then(res => {
            setDistricts(res);
            setAddress(NewAddress);
            setIsEditCanton(false);
        })
    }

    const onSubmit = data => {
        console.log(data)
        let CostaRicaID = Districts.filter(src => src.DistrictID === data.DistrictID)[0].CostaRicaID
        let UpdateAddress = {
            ...props.Address,
            ...data,
            CostaRicaID: CostaRicaID,
            ActionType: 'Update'
        }
        console.log(UpdateAddress);
        UsersSVC.UpsertDeliveryAddress(UpdateAddress,"Update").then(res => {
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
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        reset({
            ContactName: props.Address.ContactName,
            PhoneNumber: props.Address.PhoneNumber,
            ProvinceID: props.Address.ProvinceID,
            CantonID: props.Address.CantonID,
            DistrictID: props.Address.DistrictID,
            Street: props.Address.Street
        });
    }

    return (
        <div className="float-right ml-auto mr-0 my-0">
            <Tooltip title="Editar" color="blue">
                <a onClick={() => setIsModalVisible(true)}>
                    <i className="far fa-edit"></i>
                </a>
            </Tooltip>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">
                        Editar Dirección
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}>
                <article className="card-body p-0 mw-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="my-3">
                        <Controller
                            name="ContactName"
                            control={control}
                            defaultValue={Address.ContactName}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="ContactName"
                                        label="Nombre del Contacto"
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
                            name="PhoneNumber"
                            control={control}
                            defaultValue={Address.PhoneNumber}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="PhoneNumber"
                                        label="Teléfono"
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
                                required: "Por favor ingrese un nombre",
                                pattern: { value: /^[5-9]\d{3}-?\d{4}$/, message: "Por favor ingrese un número de teléfono válido" }
                            }}
                        />
                        <Controller
                            name="ProvinceID"
                            control={control}
                            defaultValue={Address.ProvinceID}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField
                                        id="ProvinceID"
                                        select
                                        variant="outlined"
                                        value={value}
                                        onChange={e => {
                                            OnChangeProvince(e);
                                            onChange(e);
                                        }}
                                        label="Provincia"
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null}>
                                        {
                                            Provinces.map((item, i) => {
                                                return (
                                                    <MenuItem value={item.ProvinceID} key={i}>{item.Province}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </FormControl>
                            )}
                            //onChange={e => e}
                            rules={{ required: "Debe seleccionar la Provincia" }}
                        />
                        <Controller
                            name="CantonID"
                            control={control}
                            defaultValue={IsEditCanton ? "0" : Address.CantonID}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField
                                        id="CantonID"
                                        select
                                        variant="outlined"
                                        value={value}
                                        onChange={e => {
                                            OnChangeCanton(e);
                                            onChange(e);
                                        }}
                                        label="Canton"
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null}>
                                        {
                                            Cantons.map((item, i) => {
                                                return (
                                                    <MenuItem value={item.CantonID} key={i}>{item.Canton}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </FormControl>
                            )}
                            rules={{ required: "Debe seleccionar el Canton" }}
                        />
                        <Controller
                            name="DistrictID"
                            control={control}
                            defaultValue={Address.DistrictID}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField
                                        id="DistrictID"
                                        select
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                        label="Distrito"
                                        disabled={IsEditCanton}
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null}>
                                        {
                                            Districts.map((item, i) => {
                                                return (
                                                    <MenuItem value={item.DistrictID} key={i}>{item.District}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </FormControl>
                            )}
                            rules={{ required: "Debe seleccionar el Distrito" }}
                        />
                        <Controller
                            name="Street"
                            control={control}
                            defaultValue={Address.Street}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="Street"
                                        label="Barrio y otras señas"
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null} />
                                </FormControl>
                            )}
                            rules={{ required: "Por favor ingrese una ubicación más exacta" }}
                        />
                        <div className="form-group m-0 text-center">
                            <button className="btn btn-outline-primary m-2 py-2 text-uppercase" type="submit" disabled={!isDirty}>
                                Guardar
                            </button>
                            <button className="btn btn-outline-danger m-2 py-2 text-uppercase" type="button" onClick={() => handleCancel()}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </article>
            </Modal>
        </div>
    )
}

EditDeliveryAddressInfoUser.propTypes = {
    Address: PropType.object
};