/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { message } from 'antd';
import * as moment from 'moment';
import "moment/locale/es";
import { TabContent, TabPane, Nav, NavItem, NavLink, Fade } from 'reactstrap';
import classnames from 'classnames'
import { generate } from 'shortid';
import Resizer from 'react-image-file-resizer';

import { Context } from '../store/appContext';

import WebDirectoryService from '../services/webdirectory';
import ConfigurationService from '../services/configuration';
import AuthenticationService from '../services/authentication';
import UsersService from '../services/users';
import AzureServices from '../services/azure';

import { Error } from '../component/error';
import { Loading } from '../component/loading';
import { MainInfoUser } from '../component/users/mainInfoUser';
import { DeliveryAddressInfoUser } from '../component/users/deliveryAddressInfoUser';
import { FacturationInfoUser } from '../component/users/facturationInfoUser';
import { OrderHistorial } from '../component/users/orderHistorial';

moment.locale("es");

export const UsersProfile = () => {

    const AuthSVC = new AuthenticationService();
    const WebDirectorySVC = new WebDirectoryService();
    const ConfigSVC = new ConfigurationService();
    const UsersSVC = new UsersService();
    const AzureSVC = new AzureServices();
    const params = useParams();

    const { store } = useContext(Context);
    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [User, setUser] = useState({});
    const [SaveOptions, setSaveOptions] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [srcAvatar, setsrcAvatar] = useState("");
    const [activeTab, setActiveTab] = useState('1');
    const ValidFileExt = ['image/jpeg', 'image/png', 'image/jpg'];

    const LoadData = (UserID) => {
        UsersSVC.Details(UserID).then(res => {
            console.log(res);
            setUser(res);
            if (res.PhotoPath === undefined || res.PhotoPath === "") {
                setsrcAvatar("http://ssl.gstatic.com/accounts/ui/avatar_2x.png");
            } else {
                setsrcAvatar(res.PhotoPath);
            }
            setLoading(false);
        });
    }

    const LoadPage = () => {
        setLoading(true);
        setSaveOptions(false);
        setImageFile();
        let CurrentUser = JSON.parse(localStorage.getItem('User'));
        if (parseInt(params.UserID) === CurrentUser.UserID || params.UserID === undefined) {
            setRights({
                ReadRight: true,
                WriteRight: true
            });
            //Fill UserData
            LoadData(CurrentUser.UserID);
        } else {
            //console.log("test")
            let model = {
                Controller: "Users",
                Action: "Index"
            }
            WebDirectorySVC.RightsValidation(model).then(res => {
                //console.log(res);
                setRights(res);
                return res;
            }).then(src => {
                if (src.WriteRight) {
                    LoadData(params.UserID);
                } else {
                    setLoading(false);
                }
            });
        }
    }


    useEffect(() => {
        if (isLogin) {
            LoadPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.UserID]);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const processPhoto = imageInput => {
        //console.log(imageInput);

        const file = imageInput.target.files[0];
        const reader = new FileReader();

        if (!ValidFileExt.includes(file.type)) {
            message.error({
                content: "El formato de la foto seleccionada no es soportado.",
                style: {
                    marginTop: "30vh"
                }
            });
        } else {
            reader.onload = (event) => {
                setsrcAvatar(event.target.result);
                setSaveOptions(true);
                //setImageFile(file);
                var img = new Image();
                img.onload = () => {
                    //console.log(img.height, img.width);
                    var scalefactor = img.height / img.width;
                    var newHeight = Math.round(350 * scalefactor);

                    Resizer.imageFileResizer(
                        file
                        , 350
                        , newHeight
                        , "JPG"
                        , 100
                        , 0
                        , (uri) => {
                            //console.log(uri);
                            setImageFile(uri);
                        }
                        , "blob");
                }
                img.src = reader.result;
            }
        }

        reader.readAsDataURL(file);
    }


    const SaveNewImage = () => {
        const fileName = "IMG_Profile_" + User.UserID + "_" + generate() + ".JPG";
        AzureSVC.UploadImages(imageFile, fileName).then(res => {
            const NewUser = {
                ...User,
                PhotoPath: ConfigSVC.AzureHostName + '/images/' + fileName,
                ActionType: "Update"
            }
            UsersSVC.Upsert(NewUser, 'Update').then(res => {
                if (res) {
                    LoadPage();

                } else {
                    message.error({
                        content: "Ocurrio un error inesperado, intente de nuevo!!!",
                        style: {
                            marginTop: "30vh"
                        }
                    });
                }
            });
            setsrcAvatar(res.url)
            setSaveOptions(false)
        });
    }

    const ContentPage = () => {
        return (
            <section className="container w-90 mw-100">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="far fa-address-card align-middle"></i> Perfil</h2>
                    <p className="subtitle">{User.FullName}</p>
                </div>
                <hr />
                <div className="d-block my-2">
                    <div className="container mw-100">
                        <div className="row">
                            <div className="col-sm-3 text-center">
                                <div className="profile-img">
                                    <img src={srcAvatar} className="avatar img-thumbnail w-100" alt="avatar" />
                                    {
                                        Rights.WriteRight ? (
                                            <div className="file btn btn-lg btn-primary w-100">
                                                Cambiar Foto
                                                <input id="file" type="file" name="file" className="file-upload" accept="image/*" onChange={(e) => processPhoto(e)} />
                                            </div>
                                        ) : null
                                    }
                                </div>
                                {
                                    SaveOptions ? (
                                        <div>
                                            <button className="btn-saveoptions btn btn-outline-success w-40" onClick={() => SaveNewImage()}>
                                                <i className="fas fa-check fa-2x"></i>
                                            </button>
                                            <button type="button" className="btn-saveoptions btn btn-outline-danger w-40" onClick={() => LoadPage()}>
                                                <i className="fas fa-times fa-2x"></i>
                                            </button>
                                        </div>
                                    ) : null
                                }
                                <div className="mt-2">
                                    <ul className="list-group">
                                        <li className="list-group-item text-center" style={{ backgroundColor: "lightgrey" }}>
                                            <strong>ACTIVIDAD</strong>
                                        </li>
                                        <li className="list-group-item text-center text-capitalize">
                                            <strong>Registro</strong>
                                            <br /> {moment(User.CreationDate).format('DD-MMM-yyyy')}
                                        </li>
                                        <li className="list-group-item text-center text-capitalize">
                                            <strong>Más Reciente</strong>
                                            <br />
                                            {moment(User.CreationDate).format('DD-MMM-yyyy')}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-9 mt-2">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink className={classnames({ active: activeTab === '1' })}
                                            onClick={() => { toggle('1'); }}>
                                            <span className="text-font-base font-weight-bolder">Principal</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: activeTab === '2' })}
                                            onClick={() => { toggle('2'); }} >
                                            <span className="text-font-base font-weight-bolder">Historial de Pedidos</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                        <Fade in={true}>
                                            <MainInfoUser User={User} WriteRight={Rights.WriteRight} />                                            
                                            <DeliveryAddressInfoUser WriteRight={Rights.WriteRight} UserID={User.UserID} Addresses={User.DeliveryAddresses}/>
                                            <FacturationInfoUser WriteRight={Rights.WriteRight} UserID={User.UserID} FactInfo={User.FacturatioInfos}/>
                                        </Fade>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Fade in={true}>
                                            <OrderHistorial Orders={User.OrderList}/>
                                        </Fade>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
    if (store.isLoading || isLoading) {
        return <Loading />
    } else {
        if (isLogin) {
            if (Rights.ReadRight) {
                return <ContentPage />
            } else {
                return <Error Message='Usted no esta autorizado para ingresar a esta seccion, si necesita acceso contacte con un administrador.' />
            }
        } else {
            return <Redirect to={{ pathname: "/Login" }} />;
        }
    }
};
