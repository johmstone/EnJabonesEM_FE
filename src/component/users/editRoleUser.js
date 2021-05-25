/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import PropType from "prop-types";
import { Tooltip, Modal, message } from 'antd';

import { Context } from '../../store/appContext';

import UsersService from '../../services/users';

export const EditRoleUser = (props) => {

    const { store } = useContext(Context);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [NewRole, setNewRole] = useState(props.RoleID);

    const UsersSVC = new UsersService();

    const OnSubmit = () => {
        let NewUser = {...props.User, RoleID: parseInt(NewRole), ActionType: 'Update'}
        console.log(NewUser);
        UsersSVC.Upsert(NewUser,'Update').then(res => {
            if(res){
                window.location.reload();
            } else {
                message.error({
                    content: "Ocurrio un error inesperado, intente de nuevo!!!",
                    style: {
                        marginTop: "30vh"
                    }
                });
            }
        })
    }
    return (
        <div>
            <Tooltip title="Asignar nuevo rol" color="blue">
                <a onClick={() => setIsModalVisible(true)}>
                    <i className="fas fa-user-edit fa-1x" style={{ "verticalAlign": "middle" }}></i>
                </a>
            </Tooltip>
            <Modal
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0"> Editar Rol
                    </h3>
                ]}
                visible={isModalVisible}
                centered
                onCancel={() => setIsModalVisible(false)}
                footer={[]}>
                <article className="card-body p-0 mw-100">
                    <h4 className="m-0 text-font-base mb-3">
                        <i className="fas fa-user-tag"></i>
                        Usuario: <span className="text-primary-color">{props.User.FullName}</span>
                    </h4>
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Nuevo Rol</span>
                        </div>
                        <select className="custom-select"
                            value={props.User.RoleID}
                            onChange={(e) => setNewRole(e.target.value)} >
                            {
                                store.RoleList.map((item,i) => {
                                   return <option value={item.RoleID} key={i}>{item.RoleName}</option>
                                })
                            }
                            
                        </select>
                    </div>

                    <div className="form-group m-0">
                        <div className="col-xs-6">
                            <button className="btn btn-outline-primary btn-block mx-0 mt-0 mb-2 py-2 text-uppercase" onClick={() => OnSubmit()}>
                                Guardar
                            </button>
                        </div>
                    </div>
                    <div className="form-group text-center mt-2 mb-0">
                        <button className="btn btn-outline-danger btn-block mx-0 mt-0 mb-2 py-2 text-uppercase" onClick={() => setIsModalVisible(false)}>
                            Cancelar
						</button>
                    </div>
                </article>
            </Modal>
        </div>
    )
}

EditRoleUser.propTypes = {
    User: PropType.object
    // 2) add here the new properties into the proptypes object
};