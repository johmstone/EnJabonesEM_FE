/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Redirect, useLocation, Link } from "react-router-dom";
import { Tooltip, Table, Modal, message } from 'antd';
import * as moment from 'moment';
import "moment/locale/es";

import { Context } from '../store/appContext';

import WebDirectoryService from '../services/webdirectory';
import UsersService from '../services/users';

import { Error } from '../component/error';
import { Loading } from '../component/loading';
import { EditRoleUser } from '../component/users/editRoleUser';

moment.locale("es");

export const Users = () => {
    const { store } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [SearchInput, setSearchInput] = useState('');
    const [UserList, setUserList] = useState([]);
    const [SearchResults, setSearchResults] = useState([]);

    const WebDirectorySVC = new WebDirectoryService();
    const UsersSVC = new UsersService();
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const results = UserList.filter(item =>
            item.FullName.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.Email.toLowerCase().includes(SearchInput.toLowerCase())
        );
        setSearchResults(results);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SearchInput, UserList]);

    const LoadPage = () => {
        const pathname = location.pathname.slice(1).split('/');
        let model = {
            Controller: pathname[0],
            Action: pathname[1] === undefined ? "Index" : pathname[1]
        }
        WebDirectorySVC.RightsValidation(model).then(res => {
            //console.log(res);
            setRights(res);
            return res;
        }).then(src => {
            if (src.ReadRight) {
                UsersSVC.List().then(items => {
                    //console.log(items)
                    setUserList(items);
                    setLoading(false);
                })
            }
        });

    }


    const ChangeStatus = (model) => {
        let NewModel = { ...model, ActionType: 'CHGST' }
        //console.log(NewModel);
        const { confirm } = Modal;
        if (model.ActiveFlag) {
            confirm({
                content: 'Esta seguro que quiere deshabilitar este usuario???',
                onOk() {
                    //console.log("OK")
                    UsersSVC.Upsert(NewModel, 'Update').then(res => {
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
                },
                okText: 'Si',
                cancelText: 'No',
            })
        } else {
            UsersSVC.Upsert(NewModel, 'Update').then(res => {
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
        }
    }

    const ResetPwd = (UserID) => {
        //console.log(UserID);
        const { confirm } = Modal;
        confirm({
            content: 'Esta seguro que quiere Restablecer esta contraseña???',
            onOk() {
                //console.log("OK")
                setLoading(true);
                UsersSVC.AdminResetPwd(UserID).then(res => {
                    if (res) {
                        setLoading(false);
                        message.success({
                            content: "La contraseña se genero exitosamente!!!",
                            style: {
                                marginTop: "30vh"
                            }
                        });
                    } else {
                        setLoading(false);
                        message.error({
                            content: "Ocurrio un error inesperado, intente de nuevo!!!",
                            style: {
                                marginTop: "30vh"
                            }
                        });
                    }
                });
            },
            okText: 'Si',
            cancelText: 'No',
        });
    }
    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const columnsAdmin = [
        { title: 'Nombre', dataIndex: 'FullName', key: 'FullName', fixed: 'left' },
        { title: 'Rol', dataIndex: 'RoleName', key: 'RoleName' },
        {
            title: 'Status',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <p className={e.ActiveFlag ? "text-center align-middle font-weight-bolder text-success m-0" : "text-center align-middle font-weight-bolder text-danger m-0"}>
                    {e.ActiveFlag ? "Activo" : "Inactivo"}
                </p>
            ),
        },
        {
            title: 'Validado',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <p className={e.EmailValidated ? "text-center align-middle font-weight-bolder text-success m-0" : "text-center align-middle font-weight-bolder text-danger m-0"}>
                    {e.EmailValidated ? "Validado" : "Pendiente"}
                </p>
            ),
        },
        {
            title: 'Acción',
            colSpan: 4,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title={e.ActiveFlag ? "Desactivar" : "Activar"} color={e.Email ? "red" : "green"} >
                    <a onClick={() => ChangeStatus(e)}>
                        <i className="fas fa-repeat-alt"></i>
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Perfil',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title="Perfil" color="blue">
                    <Link to={ "/User/Profile/" + e.UserID} target="_blank" rel="noopener noreferrer" >
                        <i className="fas fa-user-circle fa-1x" style={{ "verticalAlign": "middle" }}></i>
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: 'Edit',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (<EditRoleUser User={e} />),
        },
        {
            title: 'ResetPwd',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title="Restablecer Contraseña" color="green">
                    <a onClick={() => ResetPwd(e.UserID)}>
                        <i className="fas fa-key fa-1x" style={{ "verticalAlign": "middle" }}></i>
                    </a>
                </Tooltip>
            ),
        }
    ]

    const ContentPage = () => {
        return (
            <section className="container">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="far fa-users"></i> Usuarios</h2>
                    <p className="subtitle">Módulo de Gestión de Usuarios</p>
                </div>
                <hr />
                <div className="mx-2">
                    <div className="input-group mb-3 mw-100" style={{ width: "300px" }}>
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="SearchInput-label"><i className="fas fa-search"></i></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Palabra clave..." aria-label="Palabra clave..." aria-describedby="SearchInput-label"
                            value={SearchInput} onChange={handleChange} autoFocus />
                    </div>
                </div>
                <div className="justify-content-start my-2">
                    <p className="mx-2 mb-0">Total de Usuarios: {SearchResults.length}</p>
                    <Table
                        columns={columnsAdmin}
                        rowKey={record => record.UserID}
                        expandable={{
                            expandedRowRender: record => (
                                <div>
                                    <p className="m-0 font-weight-bold">Correo: <span className="font-weight-normal">{record.Email}</span></p>
                                    <p className="m-0 font-weight-bold">Rol: <span className="font-weight-normal">{record.RoleName}</span></p>
                                    <p className="m-0 font-weight-bold">Ultima Actividad: <span className="font-weight-normal text-capitalize">{moment(record.LastActivityDate).format('MMMM Do YYYY, h:mm:ss A')}</span></p>
                                </div>
                            ),
                            rowExpandable: record => record.FullName !== 'Not Expandable',
                        }}
                        dataSource={SearchResults}
                        scroll={{ x: 'max-content' }}
                        pagination={{ position: ['bottomLeft'], pageSize: 10 }}

                    />
                </div >
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
