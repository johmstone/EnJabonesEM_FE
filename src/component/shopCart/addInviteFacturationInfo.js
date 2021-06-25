import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import CostaRicaServices from '../../services/costaRica';

export const AddInviteFacturationInfo = (props) => {

    const IdentityTypes = ['Cédula Jurídica','Cédula de Identidad', 'Cédula de Residencia', 'Pasaporte'];
    const CostaRicaSVC = new CostaRicaServices();

    const [FacturationInfo, setFacturationInfo] = useState({ UserID: 0 });
    const [Provinces, setProvinces] = useState([]);
    const [EnableCanton, setEnableCanton] = useState(false)
    const [EnableDistrict, setEnableDistrict] = useState(false)
    const [EnableStreet, setEnableStreet] = useState(false)
    const [Cantons, setCantons] = useState([]);
    const [Districts, setDistricts] = useState([]);

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
    }, []);

    const OnChangeProvince = ProvinceInput => {
        let NewFactInfo = { ...FacturationInfo, ProvinceID: ProvinceInput.target.value }
        setFacturationInfo(NewFactInfo);
        CostaRicaSVC.Cantons(ProvinceInput.target.value).then(can => {
            setCantons(can);
            setEnableCanton(true);
        });
    }

    const OnChangeCanton = CantonInput => {
        let NewFactInfo = { ...FacturationInfo, CantonID: CantonInput.target.value }

        CostaRicaSVC.Districts(FacturationInfo.ProvinceID, CantonInput.target.value).then(res => {
            setDistricts(res);
            setFacturationInfo(NewFactInfo);
            setEnableDistrict(true);
        });
    }

    const onChangeDistrict = DistrictInput => {
        let NewFactInfo = { ...FacturationInfo, DistrictID: DistrictInput.target.value }
        setFacturationInfo(NewFactInfo);
        setEnableStreet(true);
    }

    const onSubmit = data => {
        console.log(data)
        let province = Provinces.filter(src => src.ProvinceID === data.ProvinceID)[0].Province;
        let canton = Cantons.filter(src => src.CantonID === data.CantonID)[0].Canton;
        let district = Districts.filter(src => src.DistrictID === data.DistrictID)[0].District;
        let CostaRicaID = Districts.filter(src => src.DistrictID === data.DistrictID)[0].CostaRicaID
        const NewFactInfo = {
            UserID: 0,
            FullName: data.FullName,
            IdentityType: data.IdentityType,
            IdentityID: data.IdentityID.replaceAll("-",""),
            PhoneNumber: parseInt(data.PhoneNumber.replace(/[^A-Z0-9]+/ig, "")),
            CostaRicaID: CostaRicaID,
            ProvinceID: data.ProvinceID,
            Province: province,
            CantonID: data.CantonID,
            Canton: canton,
            DistrictID: data.DistrictID,
            District: district
        }
        console.log(NewFactInfo);
    }

    const handleCancel = () => {
        reset({
            FullName: "",
            IdentityType: "",
            IdentityID: "",
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
        <form onSubmit={handleSubmit(onSubmit)} className="inviteFacturationInfo">
            <Controller
                name="FullName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl variant="outlined" className="w-100 my-2">
                        <TextField id="FullName"
                            label="Nombre*"
                            variant="outlined"
                            size="small"
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
            <div className="row row-cols-2">
                <div className="col">
                    <Controller name="IdentityType"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField
                                    id="IdentityType"
                                    select
                                    variant="outlined"
                                    size="small"
                                    value={value}
                                    onChange={onChange}
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
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl variant="outlined" className="w-100 my-2">
                                <TextField id="IdentityID"
                                    label="Número de Identidad*"
                                    variant="outlined"
                                    size="small"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> {error.message}
                                    </label>) : null} />
                            </FormControl>
                        )}
                        rules={{ required: "Por favor ingrese su identificación" }}
                    />
                </div>
            </div>
            <Controller
                name="PhoneNumber"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl variant="outlined" className="w-100 my-2">
                        <TextField id="PhoneNumber"
                            label="Teléfono"
                            variant="outlined"
                            size="small"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? (<label className="text-font-base text-danger">
                                <i className="fa fa-times-circle"></i> {error.message}
                            </label>) : null} />
                    </FormControl>
                )}
                rules={{
                    required: false,
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
                            size="small"
                            value={value}
                            onChange={e => {
                                OnChangeProvince(e);
                                onChange(e);
                            }}
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
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField
                                id="CantonID"
                                select
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={e => {
                                    OnChangeCanton(e);
                                    onChange(e);
                                }}
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
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField
                                id="DistrictID"
                                select
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={e => {
                                    onChangeDistrict(e);
                                    onChange(e)
                                }}
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
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl variant="outlined" className="w-100 my-2">
                            <TextField id="Street"
                                label="Barrio y otras señas*"
                                variant="outlined"
                                size="small"
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
                    Agregar
                </button>
                <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={() => handleCancel()}>
                    Limpiar
                </button>
            </div>
        </form>
    )

}
AddInviteFacturationInfo.propTypes = {
    parentCallback: PropType.func
};