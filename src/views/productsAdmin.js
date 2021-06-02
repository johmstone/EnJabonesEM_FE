/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Tooltip, Table, Modal, message } from 'antd';
import { Context } from '../store/appContext';

import AuthenticationService from '../services/authentication';
import WebDirectoryService from '../services/webdirectory';
import ProductsServices from '../services/products';

import { Loading } from '../component/loading';
import { Error } from '../component/error';
import { Presentations } from '../component/products/presentations';
import { EditPrimaryProduct } from '../component/products/editPrimaryProduct';

export const ProductsAdmin = () => {

    const AuthSVC = new AuthenticationService();
    const WebDirectorySVC = new WebDirectoryService();
    const ProductSVC = new ProductsServices();
    const location = useLocation();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { store } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [Rights, setRights] = useState({});
    const [SearchInput, setSearchInput] = useState('');
    const [ProductList, setProductList] = useState([]);
    const [SearchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (isLogin) {
            LoadPage();
            setLoading(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const results = ProductList.filter(item =>
            item.Name.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.Technique.toLowerCase().includes(SearchInput.toLowerCase())
        );
        setSearchResults(results);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SearchInput, ProductList]);

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
                ProductSVC.PrimaryProductList().then(res => {
                    setProductList(res);
                    console.log(res);
                    setLoading(false);
                });
            }
        });

    }

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const ChangeStatus = (Product) => {
        console.log(Product);
    }

    const ChangeVisibility = (Product) => {
        console.log(Product);
    }

    const columnsAdmin = [
        { title: 'Nombre', dataIndex: 'Name', key: 'Name', fixed: 'left' },
        { title: 'Técnica', dataIndex: 'Technique', key: 'Technique'},
        {
            title: 'Status',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <p className={e.ActiveFlag ? "align-middle font-weight-bolder text-success m-0" : "align-middle font-weight-bolder text-danger m-0"}>
                    {e.ActiveFlag ? "Activo" : "Inactivo"}
                </p>
            ),
        },
        {
            title: 'Visibilidad',
            dataIndex: '',
            key: 'x',
            className: "text-center",
            render: (e) => (
                <Tooltip title={e.VisibleFlag ? "Visible" : 'Oculto'} color={e.VisibleFlag ? 'green' : 'red'}>
                    <p className={e.VisibleFlag ? "text-center align-middle font-weight-bolder text-success m-0" : "text-center align-middle font-weight-bolder text-danger m-0"}>
                        {e.VisibleFlag ? (<i className="fas fa-eye mx-2"></i>) : (<i className="fas fa-eye-slash mx-2"></i>)}
                    </p>
                </Tooltip>
            ),
        },
        {
            title: 'Acción',
            colSpan: 3,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title={e.ActiveFlag ? "Desactivar" : "Activar"} color={e.ActiveFlag ? "red" : "green"} >
                    <a onClick={() => ChangeStatus(e)}>
                        <i className="fas fa-repeat-alt align-middle"></i>
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Visibility',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <Tooltip title={e.ActiveFlag ? "Ocultar" : "Mostrar"} color={e.ActiveFlag ? "green" : "red"} >
                    <a onClick={() => ChangeVisibility(e)}>
                        <i className="fas fa-low-vision align-middle"></i>
                    </a>
                </Tooltip>
            ),
        },
        {
            title: 'Edit',
            colSpan: 0,
            dataIndex: '',
            key: 'x',
            render: (e) => (<EditPrimaryProduct PrimaryProduct={e} />),
        }
    ]

    const ContentPage = () => {
        return (
            <section className="container">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="fas fa-shopping-basket align-middle"></i> Productos</h2>
                    <p className="subtitle">Módulo de Gestión de Productos</p>
                </div>
                <hr />
                <div className="mx-2">
                    <div className="input-group mb-3 mw-100" style={{ width: "300px" }}>
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="SearchInput-label"><i className="fas fa-search"></i></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Palabra clave..." aria-label="Palabra clave..." aria-describedby="SearchInput-label"
                            value={SearchInput} onChange={handleChange} autoFocus />
                        <div className="input-group-append">
                            <Tooltip title="Agregar Producto" color="blue">
                                <button className="btn">
                                    <i className="far fa-plus-square"></i>
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                </div>
                <div className="justify-content-start my-2">
                    <p className="mx-2 mb-0">Total de Productos: {SearchResults.length}</p>
                    <Table
                        columns={columnsAdmin}
                        rowKey={record => record.PrimaryProductID}
                        expandable={{
                            expandedRowRender: record => (
                                <Presentations PrimaryProduct={record} />
                            ),
                            rowExpandable: record => record.Name !== 'Not Expandable',
                        }}
                        dataSource={SearchResults}
                        scroll={{ x: 'max-content' }}
                        pagination={{ position: ['bottomLeft'], pageSize: 10 }}

                    />
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
