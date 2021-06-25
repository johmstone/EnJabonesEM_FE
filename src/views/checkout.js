/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Card } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import AuthenticationService from '../services/authentication';
import CostaRicaServices from '../services/costaRica';
import OrdersService from "../services/orders";
import UsersService from '../services/users';

import { Context } from '../store/appContext';
import { Loading } from "../component/loading";
import { CheckOutOrderDetails } from "../component/shopCart/checkOutOrderDetails";
import { returnTrue } from "react-currency-format/lib/utils";

export const CheckOut = () => {

    const CostaRicaSVC = new CostaRicaServices();
    const AuthSVC = new AuthenticationService();
    const UsersSVC = new UsersService();
    const OrderSVC = new OrdersService();
    const history = useHistory();

    const IdentityTypes = ['Cédula Jurídica', 'Cédula de Identidad', 'Cédula de Residencia', 'Pasaporte'];
    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [StageOrder, setStageOrder] = useState('');
    const [OrderDetails, setOrderDetails] = useState({});
    const [FacturationInfo, setFacturationInfo] = useState({});
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

    useEffect(() => {
        setLoading(true);
        const StagingOrder = localStorage.getItem('StagingOrder');
        LoadPage(StagingOrder);        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const LoadPage = (orderid) => {
        if (orderid === null) {
            history.push("/ShopCart");
        } else {
            setStageOrder(orderid);
            OrderSVC.SearchStagingOrder(orderid).then(res => {
                setOrderDetails(JSON.parse(res.OrderDetails));
                localStorage.setItem('ShopCart',JSON.stringify(JSON.parse(res.OrderDetails).Products));
                actions.UpdateShopCart();
                if (isLogin) {
                    let currentUser = JSON.parse(localStorage.getItem('User'));
                    UsersSVC.UsersFacturationInfo(currentUser.UserID).then(res => {
                        const PrimaryFactInfo = res.filter(src => src.PrimaryFlag === true)[0];
                        setFacturationInfo(PrimaryFactInfo);
                        //console.log(PrimaryFactInfo);
                        return PrimaryFactInfo;                         
                    }).then(PFI => {
                        CostaRicaSVC.Provinces().then(res => {
                            setProvinces(res);
                            return PFI;
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
                                    setLoading(false);
                                });
                            });
                        })
                    });
                    
                } else {
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
                                setLoading(false);
                            });
                        })
                    });   
                    
                }
            });  
                   
        }
        
    }

    const OnChangeProvince = ProvinceInput => {
        let NewFactInfo = { ...FacturationInfo, ProvinceID: ProvinceInput}
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
        console.log(data)
        let province = Provinces.filter(src => src.ProvinceID === data.ProvinceID)[0].Province;
        let canton = Cantons.filter(src => src.CantonID === data.CantonID)[0].Canton;
        let district = Districts.filter(src => src.DistrictID === data.DistrictID)[0].District;
        let CostaRicaID = Districts.filter(src => src.DistrictID === data.DistrictID)[0].CostaRicaID
        const NewFactInfo = {
            UserID: 0,
            FullName: data.FullName,
            IdentityType: data.IdentityType,
            IdentityID: data.IdentityID.replaceAll("-", ""),
            Email: data.Email,
            PhoneNumber: parseInt(data.PhoneNumber.replace(/[^A-Z0-9]+/ig, "")),
            CostaRicaID: CostaRicaID,
            ProvinceID: data.ProvinceID,
            Province: province,
            CantonID: data.CantonID,
            Canton: canton,
            DistrictID: data.DistrictID,
            District: district,
            StageOrderID: StageOrder
        }
        console.log(NewFactInfo);
    }

    const handleCancel = () => {
        reset({
            FullName: "",
            IdentityType: "",
            IdentityID: "",
            Email: "",
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

    const ContentPage = () => {
        return (
            <section className="container-lg">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0">CheckOut</h2>
                    <p className="subtitle">Confirmación de Pedido</p>
                </div>
                <hr />
                <div className="row m-0">
                    <div className="col-md-6">
                        <CheckOutOrderDetails OrderDetails={OrderDetails} />
                    </div>
                    <div className="col-md-6">
                        <h6 className="text-font-base text-uppercase">Datos de Facturación</h6>
                        <Card hoverable>
                        <form onSubmit={handleSubmit(onSubmit)} className="inviteFacturationInfo">
                            <Controller
                                name="FullName"
                                control={control}
                                defaultValue={ isLogin? FacturationInfo.FullName: ""}
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
                                rules={{ 
                                    required: "Por favor ingrese un nombre", 
                                    minLength: { value: 2, message: 'Debe ser de al menos 2 caractéres!' }
                                }}
                            />
                            <div className="row row-cols-2">
                                <div className="col">
                                    <Controller name="IdentityType"
                                        control={control}
                                        defaultValue={ isLogin? FacturationInfo.IdentityType: ""}
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
                                        defaultValue={ isLogin? FacturationInfo.IdentityID: ""}
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
                                name="Email"
                                control={control}
                                defaultValue={ isLogin? FacturationInfo.Email: ""}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <FormControl variant="outlined" className="w-100 my-2">
                                        <TextField id="Email"
                                            label="Correo Electrónico*"
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
                                    required: { value: true, message: "Por favor ingrese un email."},
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Cuenta de correo Invalida!' }
                                }}
                            />
                            <Controller
                                name="PhoneNumber"
                                control={control}
                                defaultValue={ isLogin? FacturationInfo.PhoneNumber: ""}
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
                                defaultValue={ isLogin? FacturationInfo.ProvinceID: ""}
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
                                    defaultValue={ isLogin? FacturationInfo.CantonID: ""}
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
                                    defaultValue={ isLogin? FacturationInfo.DistrictID: ""}
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
                                    defaultValue={ isLogin? FacturationInfo.Street: ""}
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
                                    Procesar Orden
                                </button>
                            </div>
                        </form>
                    </Card>
                    </div>
                </div>
            </section>
        )
    }
    if (isLoading) {
        return <Loading />
    } else {
        return <ContentPage />
    }

};
