/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import * as moment from 'moment';
import "moment/locale/es";
import { TabContent, TabPane, Nav, NavItem, NavLink, Fade } from 'reactstrap';
import classnames from 'classnames'
import { isExpired } from 'react-jwt';

import { Context } from '../store/appContext';

import WebDirectoryService from '../services/webdirectory';
import UsersService from '../services/users';

import { Error } from '../component/error';
import { Loading } from '../component/loading';
import { MainInfoUser } from '../component/users/mainInfoUser';
import { DeliveryAddressInfoUser } from '../component/users/deliveryAddressInfoUser';

moment.locale("es");

export const UsersProfile = () => {

    const { store, actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [User, setUser] = useState({});
    const [DeliveryAddresses, setDeliveryAddress] = useState([]);
    const [SaveOptions, setSaveOptions] = useState(false);
    const [srcAvatar, setsrcAvatar] = useState("");
    const [activeTab, setActiveTab] = useState('1');

    const WebDirectorySVC = new WebDirectoryService();
    const UsersSVC = new UsersService();
    const params = useParams();

    const LoadData = (UserID) => {
        UsersSVC.Details(UserID).then(res => {
            //console.log(res);
            setUser(res);
            if(res.PhotoPath === "") {
                setsrcAvatar("http://ssl.gstatic.com/accounts/ui/avatar_2x.png");
            } else {
                setsrcAvatar(res.PhotoPath);
            }
            return UserID;
        }).then(src => {
            UsersSVC.UsersAddress('DeliveryAddress',src).then(res => {
                //console.log(res)
                setDeliveryAddress(res)
                setLoading(false);
            });
        });
    }

    const LoadPage = () => {
        setLoading(true);
        setSaveOptions(false);
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
                if (src.ReadRight) {
                    LoadData(params.UserID);                    
                }
            });
        }
    }


    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('User'));
        if(!isExpired(user.Token))  {
            actions.Login();
            LoadPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.UserID]);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const processPhoto = imageInput => {
        console.log(imageInput);

        const file = imageInput.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
            setsrcAvatar(event.target.result);
            setSaveOptions(true);
        });
        reader.readAsDataURL(file);
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
                                            <button type="button" className="btn-saveoptions btn btn-outline-success w-40">
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
                                            <strong>Principal</strong>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: activeTab === '2' })}
                                            onClick={() => { toggle('2'); }} >
                                            <strong>Pedidos</strong>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                        <Fade in={true}>
                                            <MainInfoUser User={User} WriteRight={Rights.WriteRight}/>
                                            <DeliveryAddressInfoUser Addresses={DeliveryAddresses} 
                                                WriteRight={Rights.WriteRight} UserID={User.UserID}/>                                            
                                        </Fade>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Fade in={true}>
                                            <DeliveryAddressInfoUser Addresses={DeliveryAddresses} 
                                                WriteRight={Rights.WriteRight} UserID={User.UserID}/>
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
        if (store.isLogged) {
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
