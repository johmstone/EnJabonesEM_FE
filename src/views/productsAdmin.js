/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Tooltip, Table, message } from 'antd';

import AuthenticationService from '../services/authentication';
import WebDirectoryService from '../services/webdirectory';
import ProductsServices from '../services/products';

import { Loading } from '../component/loading';
import { Error } from '../component/error';
import { Presentations } from '../component/products/presentations';
import { UpsertPrimaryProduct } from '../component/products/upsertPrimaryProduct';
import { ProductFormula } from '../component/products/productFormula';
import { ProductProperties } from "../component/products/productProperties";

export const ProductsAdmin = () => {

    const AuthSVC = new AuthenticationService();
    const WebDirectorySVC = new WebDirectoryService();
    const ProductSVC = new ProductsServices();
    const location = useLocation();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
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
    }, []);

    useEffect(() => {
        const results = ProductList.filter(item =>
            item.Name.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.Description.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.Technique.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.StrProperties.toLowerCase().includes(SearchInput.toLowerCase())
        );
        setSearchResults(results);
    }, [SearchInput, ProductList]);

    const LoadPage = () => {
        const pathname = location.pathname.slice(1).split('/');
        let model = {
            Controller: pathname[0],
            Action: pathname[1] === undefined ? "Index" : pathname[1]
        }
        WebDirectorySVC.RightsValidation(model).then(res => {
            setRights(res);
            return res;
        }).then(src => {
            if (src.ReadRight) {
                LoadData()
            }
        });

    }

    const LoadData = () => {
        ProductSVC.PrimaryProductList().then(items => {
            //console.log(items);
            setProductList(items);
            setSearchResults(items);
            setLoading(false);
        });
    }

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const Change = (Product, Type) => {
        setLoading(true);
        let UpdateProduct = { ...Product, ActionType: Type }
        //console.log(UpdateProduct);
        ProductSVC.UpsertPrimaryProduct(UpdateProduct, 'Update').then(res => {
            if (res) {
                LoadPage()
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

    const handleCallback = (childData) => {
        LoadData();
        setSearchInput(childData);

    }

    const columnsAdmin = [
        { title: 'Nombre', dataIndex: 'Name', key: 'Name', fixed: 'left' },
        {
            title: '',
            className: 'fomulacolum',
            dataIndex: '',
            key: 'x',
            render: (e) => (
                <div className="d-flex">
                    <ProductFormula PrimaryProduct={e} />
                    <ProductProperties PrimaryProduct={e} />
                </div>
            ),
        },
        { title: 'Técnica', dataIndex: 'Technique', key: 'Technique' },
        {
            title: 'Productos',
            dataIndex: '',
            key: 'x',
            className: 'text-center',
            render: (e) => (
                <p className="m-0">
                    {e.Products !== null ? e.Products.filter(src => src.ProductID > 0 && src.ActiveFlag).length : 0}
                </p>
            ),
        },
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
                    <a onClick={() => Change(e, 'CHGST')}>
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
                    <a onClick={() => Change(e, 'CHGVS')}>
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
            render: (e) => (<UpsertPrimaryProduct PrimaryProduct={e} />),
        }
    ]

    const ContentPage = () => {
        return (
            <section className="container-fluid">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="fas fa-shopping-basket align-middle"></i> Productos</h2>
                    <p className="subtitle">Módulo de Gestión de Productos</p>
                </div>
                <hr />
                <div className="row m-0">
                    <div className="mx-2">
                        <div className="input-group mb-3 mw-100" style={{ width: "250px" }}>
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="SearchInput-label"><i className="fas fa-search"></i></span>
                            </div>
                            <input type="text" className="form-control" placeholder="Palabra clave..." aria-label="Palabra clave..." aria-describedby="SearchInput-label"
                                value={SearchInput} onChange={handleChange} autoFocus />
                        </div>
                    </div>
                    <UpsertPrimaryProduct parentCallback={handleCallback} />
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
                        pagination={{ position: ['bottomLeft'], pageSize: 5 }}

                    />
                </div>
            </section >
        )
    }

    if (isLoading) {
        return <Loading />
    } else {
        if (isLogin) {
            if (Rights.WriteRight) {
                return <ContentPage />
            } else {
                return <Error Message='Usted no esta autorizado para ingresar a esta seccion, si necesita acceso contacte con un administrador.' />
            }
        } else {
            return <Redirect to={{ pathname: "/Login" }} />;
        }
    }
};
