/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Card } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import AuthenticationService from '../../services/authentication';
import CostaRicaServices from '../../services/costaRica';

export const CheckOutFactInfo = (props) => {

    const CostaRicaSVC = new CostaRicaServices();
    const AuthSVC = new AuthenticationService();
    const IdentityTypes = ['Cédula Jurídica', 'Cédula de Identidad', 'Cédula de Residencia', 'Pasaporte'];
    const [isLogin] = useState(AuthSVC.isAuthenticated());
    //const [isLoading, setLoading] = useState(false);
    const [DisableFields, setDisableFields] = useState(AuthSVC.isAuthenticated());
    const [FacturationInfo, setFacturationInfo] = useState(props.FacturationInfo);
    const [Provinces, setProvinces] = useState([]);
    const [EnableCanton, setEnableCanton] = useState(false)
    const [EnableDistrict, setEnableDistrict] = useState(false)
    const [EnableStreet, setEnableStreet] = useState(false)
    const [Cantons, setCantons] = useState([]);
    const [Districts, setDistricts] = useState([]);
    const [Validated, setValidated] = useState(false);

    const { handleSubmit, control } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const { isDirty } = useFormState({ control });

    useEffect(() => {
        LoadPage();
    }, [])

    const LoadPage = () => {
        if (isLogin) {
            CostaRicaSVC.Provinces().then(res => {
                setProvinces(res);
                return FacturationInfo;
            }).then(src => {
                CostaRicaSVC.Cantons(src.ProvinceID).then(can => {
                    setCantons(can);
                    setEnableCanton(true);
                    return src;
                }).then(ct => {
                    CostaRicaSVC.Districts(ct.ProvinceID, ct.CantonID).then(res => {
                        setDistricts(res);
                        setEnableDistrict(true);
                        return true;
                    }).then(dist => {
                        setEnableStreet(dist);
                    });
                });
            });
        } else {
            CostaRicaSVC.Provinces().then(res => {
                setProvinces(res);
                if (FacturationInfo.ProvinceID) {
                    setEnableCanton(true);
                    return FacturationInfo.ProvinceID;
                } else {
                    return 1;
                }
            }).then(src => {
                CostaRicaSVC.Cantons(src).then(can => {
                    setCantons(can);
                    if (FacturationInfo.ProvinceID) {
                        setEnableDistrict(true);
                        return FacturationInfo;
                    } else {
                        return { ProvinceID: src, CantonID: 1 };
                    }
                }).then(prov => {
                    CostaRicaSVC.Districts(prov.ProvinceID, prov.CantonID).then(dist => {
                        setDistricts(dist);
                        if (FacturationInfo.ProvinceID) {
                            setEnableStreet(true);
                            setValidated(true);
                            //console.log(props.EditFlag);
                            setDisableFields(!props.EditFlag);
                        }
                    });
                })
            });
        }
    }

    const OnChangeProvince = ProvinceInput => {
        let NewFactInfo = { ...FacturationInfo, ProvinceID: ProvinceInput }
        setFacturationInfo(NewFactInfo);
        CostaRicaSVC.Cantons(ProvinceInput).then(can => {
            setCantons(can);
            setEnableCanton(true);
        });
    }

    const OnChangeCanton = CantonInput => {
        let NewFactInfo = { ...FacturationInfo, CantonID: CantonInput }

        CostaRicaSVC.Districts(FacturationInfo.ProvinceID, CantonInput).then(res => {
            setDistricts(res);
            setFacturationInfo(NewFactInfo);
            setEnableDistrict(true);
        });
    }

    const onChangeDistrict = DistrictInput => {
        let NewFactInfo = { ...FacturationInfo, DistrictID: DistrictInput }
        setFacturationInfo(NewFactInfo);
        setEnableStreet(true);
    }

    const onSubmit = data => {
        //console.log(data);
        //console.log(FacturationInfo);
        let province = Provinces.filter(src => src.ProvinceID === data.ProvinceID)[0].Province;
        //console.log(province);
        let canton = Cantons.filter(src => src.CantonID === data.CantonID)[0].Canton;
        // console.log(canton);
        let district = Districts.filter(src => src.DistrictID === data.DistrictID)[0].District;
        // console.log(district);
        let CostaRicaID = Districts.filter(src => src.DistrictID === data.DistrictID)[0].CostaRicaID
        //console.log(CostaRicaID);
        //console.log(data.PhoneNumber.replace(/[^A-Z0-9]+/ig, ""));
        const NewFactInfo = {
            UserID: FacturationInfo.UserID ? FacturationInfo.UserID : 0,
            FacturationInfoID: FacturationInfo.FacturationInfoID ? FacturationInfo.FacturationInfoID : 0,
            FullName: data.FullName,
            IdentityType: data.IdentityType,
            IdentityID: data.IdentityID.replaceAll("-", ""),
            Email: data.Email,
            PhoneNumber: FacturationInfo.PhoneNumber ? FacturationInfo.PhoneNumber : parseInt(data.PhoneNumber.replace(/[^A-Z0-9]+/ig, "")),
            CostaRicaID: CostaRicaID,
            ProvinceID: data.ProvinceID,
            Province: province,
            CantonID: data.CantonID,
            Canton: canton,
            DistrictID: data.DistrictID,
            District: district,
            Street: data.Street
        }
        setFacturationInfo(NewFactInfo);
        setValidated(true);
        setDisableFields(true);
        props.parentCallback(NewFactInfo, true);
    }

    const CancelTaks = () => {
        setValidated(true);
        setDisableFields(true);
        props.parentCallback(undefined, true);
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="inviteFacturationInfo">
            <Card hoverable>
                <Controller
                    name="FullName"
                    control={control}
                    defaultValue={FacturationInfo.FullName}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField id="FullName"
                                label="Nombre*"
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={onChange}
                                disabled={DisableFields}
                                error={!!error}
                                helperText={error ? (<label className="text-font-base text-danger">
                                    <i className="fa fa-times-circle"></i> {error.message}
                                </label>) : null} />
                        </FormControl>
                    )}
                    rules={{
                        required: "Por favor ingrese un nombre",
                        minLength: { value: 2, message: 'Debe ser de al menos 2 caractéres!' }
                    }}
                />
                <div className="row row-cols-2">
                    <div className="col">
                        <Controller name="IdentityType"
                            control={control}
                            defaultValue={FacturationInfo.IdentityType}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField
                                        id="IdentityType"
                                        select
                                        variant="outlined"
                                        size="small"
                                        value={value}
                                        onChange={onChange}
                                        disabled={DisableFields}
                                        label="Tipo de Identidad*"
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null}>
                                        {
                                            IdentityTypes.map((item, i) => {
                                                return (
                                                    <MenuItem value={item} key={i}>{item}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </FormControl>
                            )}
                            //onChange={e => e}
                            rules={{ required: "Debe seleccionar alguna opción" }}
                        />
                    </div>
                    <div className="col">
                        <Controller name="IdentityID"
                            control={control}
                            defaultValue={FacturationInfo.IdentityID}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="IdentityID"
                                        label="Número de Identidad*"
                                        variant="outlined"
                                        size="small"
                                        value={value}
                                        onChange={onChange}
                                        disabled={DisableFields}
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null} />
                                </FormControl>
                            )}
                            rules={{ required: { value: true, message: "Por favor ingrese su identificación" } }}
                        />
                    </div>
                </div>
                <Controller
                    name="Email"
                    control={control}
                    defaultValue={FacturationInfo.Email}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField id="Email"
                                label="Correo Electrónico*"
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={onChange}
                                disabled={DisableFields}
                                error={!!error}
                                helperText={error ? (<label className="text-font-base text-danger">
                                    <i className="fa fa-times-circle"></i> {error.message}
                                </label>) : null} />
                        </FormControl>
                    )}
                    rules={{
                        required: { value: true, message: "Por favor ingrese un email." },
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Cuenta de correo Invalida!' }
                    }}
                />
                <Controller
                    name="PhoneNumber"
                    control={control}
                    defaultValue={FacturationInfo.PhoneNumber}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField id="PhoneNumber"
                                label="Teléfono*"
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={onChange}
                                disabled={DisableFields}
                                error={!!error}
                                helperText={error ? (<label className="text-font-base text-danger">
                                    <i className="fa fa-times-circle"></i> {error.message}
                                </label>) : null} />
                        </FormControl>
                    )}
                    rules={{
                        required: { value: true, message: "Por favor ingrese un número de teléfono" },
                        pattern: { value: /^[5-9]\d{3}-?\d{4}$/, message: "Por favor ingrese un número de teléfono válido" }
                    }}
                />
                <Controller
                    name="ProvinceID"
                    control={control}
                    defaultValue={FacturationInfo.ProvinceID}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField
                                id="ProvinceID"
                                select
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={e => {
                                    OnChangeProvince(e.target.value);
                                    onChange(e);
                                }}
                                disabled={DisableFields}
                                label="Provincia*"
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
                        defaultValue={FacturationInfo.CantonID}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField
                                    id="CantonID"
                                    select
                                    variant="outlined"
                                    size="small"
                                    value={value}
                                    onChange={e => {
                                        OnChangeCanton(e.target.value);
                                        onChange(e);
                                    }}
                                    disabled={DisableFields}
                                    label="Canton*"
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
                        defaultValue={FacturationInfo.DistrictID}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField
                                    id="DistrictID"
                                    select
                                    variant="outlined"
                                    size="small"
                                    value={value}
                                    onChange={e => {
                                        onChangeDistrict(e.target.value);
                                        onChange(e)
                                    }}
                                    disabled={DisableFields}
                                    label="Distrito*"
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
                        defaultValue={FacturationInfo.Street}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="Street"
                                    label="Barrio y otras señas*"
                                    variant="outlined"
                                    size="small"
                                    value={value}
                                    onChange={onChange}
                                    disabled={DisableFields}
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
                    {
                        DisableFields ? null :
                            (
                                <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit" disabled={!isDirty}>
                                    {Validated ? 'Confirmar' : 'Confirmar Información'}
                                </button>
                            )
                    }
                    {
                        Validated ?
                            DisableFields ? null :
                                (
                                    <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={() => CancelTaks()}>
                                        Cancelar
                                    </button>
                                )
                            : null
                    }
                </div>


            </Card>
        </form>
    )
}

CheckOutFactInfo.propTypes = {
    parentCallback: PropType.func,
    FacturationInfo: PropType.object,
    EditFlag: PropType.bool
};