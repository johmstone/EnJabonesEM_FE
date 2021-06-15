/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Card } from 'antd';
import CurrencyFormat from 'react-currency-format';

import { Context } from '../store/appContext';

import AuthenticationService from '../services/authentication';
import WebDirectoryService from '../services/webdirectory';
import ProductServices from "../services/products";

import { Loading } from '../component/loading';
import { ProductDetails } from '../component/products/productDetails';

export const Products = () => {

    const AuthSVC = new AuthenticationService();
    const WebDirectorySVC = new WebDirectoryService();
    const ProductSVC = new ProductServices();

    const [isLogin] = useState(AuthSVC.isAuthenticated());
    const { store, actions } = useContext(Context);
    const [isLoading, setLoading] = useState(false);
    const [SearchInput, setSearchInput] = useState('');
    const [ProductList, setProductList] = useState([]);
    const [SearchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setLoading(true);
        LoadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const results = ProductList.filter(item =>
            item.Name.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.Description.toLowerCase().includes(SearchInput.toLowerCase()) ||
            item.Technique.toLowerCase().includes(SearchInput.toLowerCase())
        );
        setSearchResults(results);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SearchInput, ProductList]);

    const LoadPage = () => {
        ProductSVC.ProductList().then(res => {
            setProductList(res);
            setLoading(false);
            console.log(res);
        });
    }

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const Test = (PProduct) => {
        console.log(PProduct);
    }

    const ContentPage = () => {
        return (
            <section className="container-fluid">
                <div className="text-center text-font-base pt-2">
                    <h2 className="m-0"><i className="fas fa-shopping-basket align-middle"></i> Nuestros Productos</h2>
                    <p className="subtitle">Productos hechos en casa</p>
                </div>
                <div className="mx-2">
                    <div className="input-group mb-3 mw-100" style={{ width: "400px" }}>
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="SearchInput-label"><i className="fas fa-search"></i></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Palabra clave..." aria-label="Palabra clave..." aria-describedby="SearchInput-label"
                            value={SearchInput} onChange={handleChange} autoFocus />
                    </div>
                </div>
                <hr />
                <div className="m-2">
                    <div className="row m-0">
                        {
                            SearchResults.map((item, i) => {
                                return (
                                    // <div className="mx-2" key={i}>
                                    //     <Card size="small"
                                    //         hoverable
                                    //         cover={<img alt="example" src={item.PhotoURL} onClick={() => Test(item)} />}
                                    //         actions={[
                                    //             <i className="far fa-cart-arrow-down"></i>,
                                    //         ]}
                                    //         style={{ width: 300 }}>
                                    //         <h5 className="text-font-base" onClick={() => Test(item)} >{item.Name}</h5>
                                    //         <p className="text-font-base" onClick={() => Test(item)} >{item.Description}</p>
                                    //         <p className="text-font-base m-0" onClick={() => Test(item)}>
                                    //             Desde: 
                                    //             <CurrencyFormat value={Math.min(...item.Products.map(src => src.Price))} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} className="mx-2"/>
                                    //         </p>
                                    //         <p className="text-font-base" onClick={() => Test(item)} >
                                    //             Hasta: 
                                    //             <CurrencyFormat value={Math.max(...item.Products.map(src => src.Price))} displayType={"text"} thousandSeparator={true} prefix={"₡"} decimalScale={0} className="mx-2"/>
                                    //         </p>
                                    //     </Card>
                                    // </div>
                                    <ProductDetails PrimaryProduct={item} key={i}/>
                                )
                            })
                        }
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
