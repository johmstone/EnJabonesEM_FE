/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Modal, message } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import CostaRicaServices from '../../services/costaRica';
import UsersService from '../../services/users';

export const AddDeliveryAddressUser = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Address, setAddress] = useState(props.Address);
    const [Provinces, setProvinces] = useState([]);
    const [EnableCanton, setEnableCanton] = useState(false)
    const [EnableDistrict, setEnableDistrict] = useState(false)
    const [EnableStreet, setEnableStreet] = useState(false)
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
            return 1;
        }).then(src => {
            CostaRicaSVC.Cantons(src).then(can => {
                setCantons(can);
                return src;
            }).then(prov => {
                CostaRicaSVC.Districts(prov, 1).then(dist => {
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
            setEnableCanton(true);
        });
    }

    const OnChangeCanton = CantonInput => {
        let NewAddress = { ...Address, CantonID: CantonInput.target.value }

        CostaRicaSVC.Districts(Address.ProvinceID, CantonInput.target.value).then(res => {
            setDistricts(res);
            setAddress(NewAddress);
            setEnableDistrict(true);
        });
    }

    const onChangeDistrict = DistrictInput => {
        let NewAddress = { ...Address, DistrictID: DistrictInput.target.value }
        setAddress(NewAddress);
        setEnableStreet(true);
    }

    const onSubmit = data => {
        //console.log(data)
        let CostaRicaID = Districts.filter(src => src.DistrictID === data.DistrictID)[0].CostaRicaID
        let NewAddress = {
            UserID: props.UserID,
            ContactName: data.ContactName,
            PhoneNumber: parseInt(data.PhoneNumber.replace(/[^A-Z0-9]+/ig,"")),
            CostaRicaID: CostaRicaID,
            Street: data.Street
        }
        UsersSVC.UpsertDeliveryAddress(NewAddress,"AddNew").then(res => {
            if (res) {
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
            ContactName: "",
            PhoneNumber: "",
            ProvinceID: "",
            CantonID: "",
            DistrictID: "",
            Street: ""
        });
        setEnableCanton(false);
        setEnableDistrict(false);
        setEnableStreet(false);
    }

    return (
        <div>
            <button className="btn btn-sm btn-link mx-0 px-0 vertical-center" onClick={() => setIsModalVisible(true)}>
                <i className="far fa-map-marker-plus"></i> Agregar dirección
            </button>
            <Modal className="custom-form"
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">
                        Agregar Dirección
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                        <div style={{ display: EnableCanton ? 'block' : 'none' }}>
                            <Controller
                                name="CantonID"
                                control={control}
                                defaultValue=""
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
                        </div>
                        <div style={{ display: EnableDistrict ? 'block' : 'none' }}>
                            <Controller
                                name="DistrictID"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <FormControl variant="outlined" className="w-100 my-2">
                                        <TextField
                                            id="DistrictID"
                                            select
                                            variant="outlined"
                                            value={value}
                                            onChange={e => {
                                                onChangeDistrict(e);
                                                onChange(e)
                                            }}
                                            label="Distrito"
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
                        </div>
                        <div style={{ display: EnableStreet ? 'block' : 'none' }}>
                            <Controller
                                name="Street"
                                control={control}
                                defaultValue=""
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
                        </div>
                        <div className="form-group m-0 text-center">
                            <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit" disabled={!isDirty}>
                                Guardar
                            </button>
                            <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={() => handleCancel()}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </article>
            </Modal>
        </div>
    )
}

AddDeliveryAddressUser.propTypes = {
    UserID: PropType.number
};