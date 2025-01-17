/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import PropType from "prop-types";
import { Tooltip, Modal, message, Transfer } from 'antd';
import { useForm, Controller, useFormState } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Resizer from 'react-image-file-resizer';
import { generate } from 'shortid';

import ConfigurationService from '../../services/configuration';
import AzureServices from '../../services/azure';
import ProductServices from '../../services/products';
import PropertiesService from "../../services/properties";


export const UpsertPrimaryProduct = props => {
    let MaxLengthDescription = 1000;
    let ValidFileExt = ['image/jpeg', 'image/png', 'image/jpg'];
    let MaxWidthImage = 1000;

    const ConfigSVC = new ConfigurationService();
    const AzureSVC = new AzureServices();
    const ProductsSVC = new ProductServices();
    const PropertiesSVC = new PropertiesService();

    const [isEdit] = useState(props.PrimaryProduct ? true : false)
    const [isLoading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [LeftCharacters, setLeftCharacters] = useState(props.PrimaryProduct ? (MaxLengthDescription - props.PrimaryProduct.Description.length) : MaxLengthDescription);
    const [srcAvatar, setsrcAvatar] = useState(props.PrimaryProduct ? props.PrimaryProduct.PhotoURL : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png");
    const [PhotoProccesed, setPhotoProccesed] = useState(props.PrimaryProduct ? true : false);
    const [SomethingChanged, setChanged] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [Properties, setProperties] = useState([]);
    const [ProductPropeties, setProductPropeties] = useState([]);

    const { handleSubmit, control, reset } = useForm({
        mode: 'onChange',
        criteriaMode: 'all'
    });
    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (isModalVisible) {
            setLoading(true);
            //console.log(props.PrimaryProduct)
            PropertiesSVC.List().then(res => {
                //console.log(res)
                setProperties(res);
            });
            if (isEdit) {
                let PropsPropeties = []
                props.PrimaryProduct.Properties.forEach(element => {
                    PropsPropeties = [...PropsPropeties, element.PropertyID]
                });
                setProductPropeties(PropsPropeties);
                //console.log(ProductPropeties);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [isModalVisible]);

    const processPhoto = imageInput => {
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
                setPhotoProccesed(true);
                //setImageFile(file);
                var img = new Image();
                img.onload = () => {
                    //console.log(img.height, img.width);
                    var scalefactor = img.height / img.width;
                    var newHeight = Math.round(MaxWidthImage * scalefactor);

                    if (img.width <= MaxWidthImage) {
                        setImageFile(file);
                        setChanged(true);
                    } else {
                        Resizer.imageFileResizer(
                            file
                            , 350
                            , newHeight
                            , "JPG"
                            , 100
                            , 0
                            , (uri) => {
                                setImageFile(uri);
                                setChanged(true);
                            }
                            , "blob");
                    }
                }
                img.src = reader.result;
            }
        }
        reader.readAsDataURL(file);
    }

    const onSubmit = data => {
        //console.log(data);
        if (isEdit && !isDirty && !SomethingChanged) {
            handleCancel()
            //console.log('cancel');
        } else {
            //console.log('Ok');
            //actions.Loading(true);
            const fileName = "IMG_Product_" + generate() + ".JPG";

            if (SomethingChanged) {
                //console.log('some changed');
                AzureSVC.UploadImages(imageFile, fileName).then(res => {
                    //console.log(res);
                    let PhotoPath = ConfigSVC.AzureHostName + '/images/' + fileName;

                    if (isEdit) {
                        let UpdateModel = {
                            ...props.PrimaryProduct,
                            ActiveFlag: true,
                            VisibleFlag: true,
                            Name: data.Name,
                            Technique: data.Technique,
                            Description: data.Description,
                            PhotoURL: PhotoPath,
                            StrProperties: data.Properties.toString(),
                            ActionType: 'Update'
                        }
                        UploadData(UpdateModel, "Update");
                    } else {
                        let UpdateModel = {
                            Name: data.Name,
                            Technique: data.Technique,
                            Description: data.Description,
                            PhotoURL: PhotoPath,
                            StrProperties: data.Properties.toString(),
                            ActionType: 'AddNew'
                        }
                        console.log(UpdateModel)
                        UploadData(UpdateModel, "AddNew");
                    }
                });
            } else {
                //console.log('no change');
                let UpdateModel = {
                    ...props.PrimaryProduct,
                    ActiveFlag: true,
                    VisibleFlag: true,
                    Name: data.Name,
                    Technique: data.Technique,
                    Description: data.Description,
                    PhotoURL: props.PrimaryProduct.PhotoURL,
                    StrProperties: data.Properties.toString(),
                    ActionType: 'Update'
                }
                UploadData(UpdateModel, "Update");
            }
        }
    }

    const UploadData = (model, Type) => {
        console.log(model, Type);
        ProductsSVC.UpsertPrimaryProduct(model, Type).then(res => {
            if (res) {
                if (Type === 'AddNew') {
                    props.parentCallback(model.Name);
                }
                //actions.UploadProductList();
                handleCancel();
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

    const handleCancel = () => {
        setIsModalVisible(false);
        reset({
            Name: isEdit ? props.PrimaryProduct.Name : "",
            Technique: isEdit ? props.PrimaryProduct.Technique : "",
            Description: isEdit ? props.PrimaryProduct.Description : ""
        });
        setImageFile();
        setsrcAvatar(props.PrimaryProduct ? props.PrimaryProduct.PhotoURL : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png");
        setPhotoProccesed(props.PrimaryProduct ? true : false)
        setChanged(false);
    }

    const mockData = Properties.map(item => {
        return ({
            key: item.PropertyID,
            Title: item.PropertyName
        })
    })

    const ContentPage = () => {
        if (isLoading) {
            return (
                <div className="text-center text-black-50">
                    <h2 className="text-black-50">Cargando...</h2>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            );
        } else {
            return (
                <article className="card-body p-0 mw-100" style={isEdit ? null : ({ height: 500, overflow: 'scroll' })}>
                    <form onSubmit={handleSubmit(onSubmit)} className="my-3">
                        <Controller
                            name="Name"
                            control={control}
                            defaultValue={isEdit ? props.PrimaryProduct.Name : ""}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="Name"
                                        label="Nombre*"
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null} />
                                </FormControl>
                            )}
                            rules={{ required: "Por favor ingrese un nombre" }}
                        />
                        <Controller
                            name="Description"
                            control={control}
                            defaultValue={isEdit ? props.PrimaryProduct.Description : ""}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="Description"
                                        label="Description*"
                                        multiline
                                        rowsMax={5}
                                        rows={3}
                                        inputProps={{ maxLength: 1000 }}
                                        variant="outlined"
                                        value={value}
                                        onChange={(e) => {
                                            setLeftCharacters(MaxLengthDescription - e.target.value.length)
                                            onChange(e)
                                        }}
                                        error={!!error}
                                        helperText={(
                                            <label className="text-font-base text-muted m-0">Quedan {LeftCharacters} carácteres</label>
                                        )} />
                                    <FormHelperText id="component-helper-text">
                                        {error ? (<label className="text-font-base text-danger">
                                            <i className="fa fa-times-circle"></i> {error.message}
                                        </label>) : null}
                                    </FormHelperText>
                                </FormControl>
                            )}
                            rules={{ required: "Por favor ingrese una descripción" }}
                        />
                        <Controller
                            name="Technique"
                            control={control}
                            defaultValue={isEdit ? props.PrimaryProduct.Technique : ""}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl variant="outlined" className="w-100 my-2">
                                    <TextField id="Technique"
                                        label="Técnica"
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                    />
                                </FormControl>
                            )}
                        />
                        {isEdit ? null :
                            (<Controller
                                name="Properties"
                                control={control}
                                defaultValue={isEdit ? ProductPropeties : []}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <FormControl variant="outlined" className="w-100 my-2">
                                        <Transfer
                                            className="mx-auto mw-100"
                                            dataSource={mockData}
                                            //rowKey={record => record.PropertyID}
                                            titles={false}
                                            showSearch
                                            targetKeys={value}
                                            ///selectedKeys={value}
                                            onChange={onChange}
                                            //onSelectChange={this.handleSelectChange}
                                            render={item => item.Title}
                                            oneWay
                                        //style={{ marginBottom: 16 }}
                                        />
                                    </FormControl>
                                )}
                            />)
                        }
                        <div className="profile-img mw-100 mx-auto" style={{ width: "225px" }}>
                            <img src={srcAvatar} className="avatar img-thumbnail w-100" alt="avatar" />
                            <div className="file btn btn-lg btn-primary w-100">
                                Cambiar Foto
                                <input id="file" type="file" name="file" className="file-upload" accept="image/*" onChange={(e) => processPhoto(e)} />
                            </div>
                            <FormHelperText style={{ marginTop: "-20px" }}>
                                {
                                    PhotoProccesed ? null : (<label className="text-font-base text-danger">
                                        <i className="fa fa-times-circle"></i> Por favor ingrese una foto
                                    </label>)
                                }
                            </FormHelperText>
                        </div>
                        <div className="form-group mt-3 mb-0 mx-0 text-center">
                            <button className="btn btn-outline-primary mx-2 py-2 text-uppercase" type="submit" disabled={!PhotoProccesed}>
                                Guardar
                            </button>
                            <button className="btn btn-outline-danger mx-2 py-2 text-uppercase" type="button" onClick={() => handleCancel()}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </article>
            );
        }
    }
    return (
        <div>
            <Tooltip title={isEdit ? "Editar" : "Agregar Producto"} color="blue">
                <a onClick={() => setIsModalVisible(true)}>
                    {isEdit ?
                        (<i className="fas fa-pencil-alt align-middle"></i>) :
                        (<button className="btn"><i className="far fa-plus-square"></i> Agregar Producto</button>)
                    }
                </a>
            </Tooltip>
            <Modal className="custom-form"
                title={[
                    <h3 key="title" className="text-center text-primary-color text-font-base m-0">
                        {isEdit ? "Editar Información Principal" : "Agregar Producto Principal"}
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

UpsertPrimaryProduct.propTypes = {
    PrimaryProduct: PropType.object,
    parentCallback: PropType.func
    // 2) add here the new properties into the proptypes object
};