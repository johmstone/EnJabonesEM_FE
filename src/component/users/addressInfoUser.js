/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import PropType from "prop-types";
import Card from '@material-ui/core/Card';
import { CardActions, CardContent } from "@material-ui/core";
import { Tooltip, message } from 'antd';

//import { message } from 'antd';

// import { Context } from '../../store/appContext';

import UsersService from '../../services/users';

import { EditAddressInfoUser } from './editaddressinfoUser';

export const AddressInfoUser = (props) => {

    const UsersSVC = new UsersService();

    // const LoadPage = () => {
    //     UsersSVC.UsersAddress('DeliveryAddress', props.User.UserID).then(res => {
    //         setAddresses(res);
    //         console.log(res);            
    //     });
    // }



    useEffect(() => {
        console.log(props.Addresses)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const MakePrincipal = (Address) => {
        let UpdateAddress = {...Address, ActionType: 'SETPRIMARY' }
        UsersSVC.UpdateDeliveryAddress(UpdateAddress).then(res => {
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
        <div className='Addresses'>
            <h5>Direcciones de Envio</h5>
            <div className="scrolldown-vertical">
                <div className="row m-0">
                    {
                        props.Addresses.map((item, i) => {
                            return (
                                <div className='cardhorizontal mx-2' key={i}>
                                    <Card className="bg-light">
                                        <CardContent className="pt-3 px-3 pb-0">
                                            <div className="row m-0 w-100">
                                                <p className="font-weight-bold m-0 font-italic">{item.ContactName}</p>
                                                <EditAddressInfoUser Address={item} />
                                            </div>
                                            <p className="m-0">Teléfono: {item.PhoneNumber}</p>
                                            <p className="m-0  withoutWhiteSpace">{item.Street}</p>
                                            <p className="m-0">{item.Canton}, {item.District}</p>
                                            <p className="m-0">{item.Province}, CR {item.CostaRicaID}</p>                                            
                                        </CardContent>
                                        <CardActions className="px-3 pt-0">
                                            {
                                                item.PrimaryFlag ?
                                                    (
                                                        <p className="font-size-small p-1 m-0 text-primary">
                                                            <i className="fas fa-tag align-middle"></i> Dirección Principal
                                                        </p>
                                                    ) :
                                                    (
                                                        <Tooltip title="Marcar como Principal" color="red">
                                                            <p className="font-size-small p-1 m-0 text-danger cursor-pointer" onClick={() => MakePrincipal(item)}>
                                                                <i className="fas fa-tag align-middle"></i> Marcar como Principal
                                                        </p>
                                                        </Tooltip>
                                                    )
                                            }

                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

AddressInfoUser.propTypes = {
    Addresses: PropType.array,
    WriteRight: PropType.bool
};