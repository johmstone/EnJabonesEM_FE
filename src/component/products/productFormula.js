/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import CurrencyFormat from 'react-currency-format';
import { Tooltip, Modal } from 'antd';

import ProductServices from '../../services/products';

import { AddProductFormula } from './addProductFormula';
import { EditProductFormula } from './editProductFormula';

export const ProductFormula = props => {

    const ProductSVC = new ProductServices();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [Formula, setFormula] = useState([]);
    const [Total, setTotal] = useState(0);
    const [inputTotal, setinputTotal] = useState(0);
    const [AddFormulaResult, setAddFormulaResult] = useState();


    useEffect(() => {
        setLoading(true);
        if (isModalVisible) {
            LoadPage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible]);

    useEffect(() => {
        if (AddFormulaResult === 'Created') {
            LoadPage()
        }
    }, [AddFormulaResult])


    const LoadPage = () => {
        ProductSVC.Formula(props.PrimaryProduct.PrimaryProductID).then(res => {
            setFormula(res);
            setAddFormulaResult();
            //console.log(res);
            let total = 0;
            if (res !== undefined) {
                res.forEach(element => {
                    total += element.Qty;
                });
                setTotal(total);
                setinputTotal(total);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
    }
    const handleChange = (inputValue) => {
        setinputTotal(inputValue.target.value);
    }

    const handleCallback = (childData) => {
        setAddFormulaResult(childData);
    }

    const ContentPage = () => {
        if (isLoading) {
            return (
                <div className="text-center text-black-50">
                    <h2 className="text-black-50">Cargando...</h2>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            )
        } else if (Formula === undefined || Formula.length === 0) {
            return (
                <div className="text-center text-black-50">
                    <i className="fas fa-align-slash fa-2x"></i>
                    <h4 className="">No hay formula disponible</h4>
                    <div>
                        <AddProductFormula PrimaryProduct={props.PrimaryProduct} parentCallback={handleCallback} />
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <article className="card-body p-0 mw-100">
                        <div className="input-group mb-3 mw-100" style={{ width: "300px" }}>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    Total Requerido:
                                </span>
                            </div>
                            <input type="number" className="form-control" value={inputTotal} onChange={handleChange} autoFocus />
                            <div className="input-group-append">
                                <span className="input-group-text">g</span>
                            </div>
                        </div>
                        <table className="table table-sm table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Ingrediente</th>
                                    <th scope="col" className="text-center">Cantidad</th>
                                    <th scope="col" className="text-center">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Formula.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <th>{item.IngredientName}</th>
                                                <td className="text-center">
                                                    <CurrencyFormat value={inputTotal * item.Qty / Total} displayType={"text"} thousandSeparator={true} decimalScale={2} suffix={" " + item.Symbol} />
                                                </td>
                                                <td className="text-center">
                                                    <CurrencyFormat value={item.Qty / Total * 100} displayType={"text"} thousandSeparator={true} decimalScale={2} suffix="%" />
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="bg-secondary text-white font-weight-bold">
                                    <th className="text-center">Total Aprox.</th>
                                    <th className="text-center">{inputTotal} g</th>
                                    <td className="text-center">100.00%</td>
                                </tr>
                            </tbody>
                        </table>
                    </article>
                    <div className="row text-center mx-0">
                        <EditProductFormula PrimaryProduct={props.PrimaryProduct} Formula={Formula} parentCallback={handleCallback} />
                        <div>
                            <button className="btn btn-outline-primary mx-2">
                                <i className="fas fa-print"></i> Imprimir
                        </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <Tooltip title="Ver Formula" color="blue">
                <a onClick={() => setIsModalVisible(true)}>
                    <i className="far fa-list-alt align-middle"></i>
                </a>
            </Tooltip>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">{props.PrimaryProduct.Name}
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}>
                <ContentPage />
            </Modal>
        </div>
    );
}
ProductFormula.propTypes = {
    PrimaryProduct: PropType.object
};