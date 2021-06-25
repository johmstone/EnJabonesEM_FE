/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

import ProductServices from "../services/products";

import { Loading } from '../component/loading';
import { ProductDetails } from '../component/products/productDetails';

export const Products = () => {

    const ProductSVC = new ProductServices();

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
            //console.log(res);
        });
    }

    const handleChange = (event) => {
        setSearchInput(event.target.value);
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
