/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect, useRef, Component } from "react";
import { Table, Input, Button, Popconfirm, Form, Modal } from "antd";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex]
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`
                    }
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

class AddProductFormula extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "Ingrediente",
                dataIndex: "IngredientID",
                width: "30%",
                editable: true
            },
            {
                title: "Qty",
                dataIndex: "Qty",
                editable: true
            },
            {
                title: "Unidad",
                dataIndex: "UnitID",
                editable: true
            },
            {
                title: "",
                dataIndex: "operation",
                render: (_, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.key)}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null
            }
        ];
        this.state = {
            visible: false,
            dataSource: [],
            count: 0
        };
    }


    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key)
        });
    };
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            IngredientID: 'Seleccione Ingrediente',
            Qty: 0,
            UnitID: 0
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData
        });
    };

    SubmitData = () => {
        console.log(this.state.dataSource);
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {

        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell
            }
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave
                })
            };
        });

        return (
            <div>
                <button onClick={this.showModal} className="btn btn-outline-primary">
                    <i className="far fa-money-check-edit"></i> Agregar Formula
                </button>
                <Modal
                    title={[
                        <h3 key="title" className="text-center text-primary-color text-font-base m-0">Nueva Formula
                        </h3>
                    ]}
                    visible={this.state.visible}
                    centered
                    onCancel={this.handleCancel}
                    footer={[]}>
                    <div>
                        <Button
                            onClick={this.handleAdd}
                            type="primary"
                            style={{ marginBottom: 16 }}>
                            Add a row
                        </Button>
                        <Table
                            components={components}
                            rowClassName={() => "editable-row"}
                            dataSource={dataSource}
                            columns={columns}
                        />
                        <Button
                            onClick={this.SubmitData}
                            type="primary"
                            style={{ marginBottom: 16 }}>
                            Submit Data
                        </Button>
                    </div>
                </Modal>
            </div>

        );
    }
}

export default AddProductFormula;