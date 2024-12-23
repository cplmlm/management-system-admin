import React, { useEffect, useRef, useState } from 'react';
import { Table, Input, Row, Col, Form, Button, Modal, message, Space,Dropdown } from 'antd';
import { createIcon } from '@/common/utils';
import { getSystemConfigs, deleteSystemConfig } from "@/api/systemConfig";
import styles from './index.module.less'

const SystemConfig = () => {
    const [form] = Form.useForm();
    //定义子组件useRef
    const childrenRef = useRef();
    const [dictionaryItems, setItems] = useState([])
    const [id, setId] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalContent, setModalContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [modalWidth, setModalWidth] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [systemConfigs, setSystemConfigs] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [record,setRecord]=useState({})

    useEffect(() => {
        init()
    }, [])
    const init = () => {
        getDataList("0", 1)
    }
    //新增系统模块
    const handleAddClick = async () => {
        setConfirmLoading(false)
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "系统模块新增", 400, { id: "", parentId: "0" })
    }
    //修改系统模块
    const handleEditClick = (record) => {
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "系统模块修改", 400, record)
    }
    //获取编辑子组件
    const getEditLazyPage = () => {
        const modules = import.meta.glob('./components/SystemConfigEdit.jsx');
        const lazyPage = React.lazy(modules['./components/SystemConfigEdit.jsx']);
        return lazyPage;
    }
    /**
     * 删除系统模块
     * @param {*} record 
     * @param {*} type 1-删除系统模块 2-删除系统配置
     */
    const handleDeleteClick = (record, type) => {
        Modal.confirm({
            title: '确认提示',
            maskClosable: true,
            closable: true,
            icon: createIcon("DeleteOutlined", "#ff0000"),
            content: '确定要删除吗？',
            centered: true,
            onOk() {
                if (type === 1) {
                    handleDeleteOk(record.id, type)
                } else {
                    handleDeleteItemOk(record.id, type)
                }
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除系统模块提交
    const handleDeleteOk = async (id, type) => {
        let res = await deleteSystemConfig(id)
        if (res?.status === 200) {
            messageApi.success(res.message)
            type === 1 ? getDataList("0", type) : getDataList(id, type)
        }
    }
    //新增系统配置
    const handleItemAddClick = async () => {
        if (id === undefined || id === null || id === "") {
            messageApi.error("请选择系统模块")
            return
        }
        setConfirmLoading(false)
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "系统配置新增", 400, { id: "", parentId: id })
    }
    //系统配置修改
    const handleItemEditClick = (record) => {
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "系统配置修改", 400, record)
    }
    //查询条件表单提交
    const queryOnClick = () => {
        getDataList(id, 2)
    }
    /**
     * Modal 窗口弹出框
     * @param {string} lazyPage 
     * @param {string} title 
     * @param {number} width 
     * @param {*} data 
     */
    const modalWindow = (lazyPage, title, width, data) => {
        const LazyPage = lazyPage
        const content = <LazyPage onRef={childrenRef} data={data} setLoading={setLoading} closeModal={closeModal} />
        setTitle(title)
        setModalWidth(width)
        setModalContent(content)
        setIsModalOpen(true)
    }
    /**
     * 关闭弹出框
     * @param {number} type 1-系统模块 2-系统参数
     */
    const closeModal = (type) => {
        setIsModalOpen(false)
        type === 1 ? getDataList("0", type) : getDataList(id, type)
    }
    //弹出框确定按钮事件
    const handleOk = () => {
        childrenRef.current.confirm()//调用新增子组件的confirm方法
    }
    //设置提交确认按钮状态
    const setLoading = (state) => {
        setConfirmLoading(state)
    }
    /**
     * 获取数据列表
     * @param {string} parentId 父类id
     * @param {number} type 1-系统模块 2-系统配置
     */
    const getDataList = async (parentId, type) => {
        const values = form.getFieldsValue()
        const data = { parentId: parentId, key: values.name }
        let res = await getSystemConfigs(data)
        if (res?.status === 200) {
            type === 1 ? setData(res.data) : setSystemConfigs(res.data)
        }
    }
    //点击表格行
    const handleRowClick = (record) => {
        setSelectedRowKeys([record.id])
        setId(record.id)
        getDataList(record.id, 2)
    }
    //点击系统模块名称
    const handleNameOpenChange = (record) => {
        setRecord(record)
    }
    const items = [
        {
            key: '1',
            label: <span onClick={() => handleEditClick(record)}>{createIcon("EditOutlined")}&nbsp;&nbsp;&nbsp;&nbsp;修改&nbsp;&nbsp;&nbsp;&nbsp; </span>
        },
        {
            key: '2',
            label: <span onClick={() => handleDeleteClick(record, 1)}>{createIcon('DeleteOutlined')}&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;</span>
        }
    ];
    const columns = [
        {
            title: '系统模块',
            dataIndex: 'name',
            align: "center",
            ellipsis: true,
            render: (text, record) => (
                <Dropdown
                    menu={{ items }}
                    trigger="contextMenu"
                    onOpenChange={() => handleNameOpenChange(record)}
                >
                      <span>  {text}</span>
                </Dropdown>
            )
        }
    ];
    const systemConfigColumns = [
        {
            title: '参数名称',
            dataIndex: 'name',
            align: "center",
            ellipsis: true,
            width: 200
        },
        {
            title: '参数编码',
            dataIndex: 'code',
            align: "center",
            ellipsis: true,
            width: 100
        },
        {
            title: '参数值',
            dataIndex: 'value',
            align: "center",
            width: 100,
            ellipsis: true,
            width: 150
        },
        {
            title: '参数说明',
            dataIndex: 'description',
            align: "center",
            ellipsis: true,
            width: 150
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size='small' icon={createIcon('EditOutlined')} onClick={(e) => handleItemEditClick(record)}>修改</Button>
                    <Button type="link" size='small' danger icon={createIcon('DeleteOutlined')} onClick={e => handleDeleteClick(record, 2)}>删除</Button>
                </Space>
            ),
        }
    ]
    return (
        <div className="left-right-container">
            {contextHolder}
            <div className="left">
                <Table
                    pagination={false}
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 100, y: 600 }}
                    onRow={(record, rowIndex) => ({
                        onClick: () => handleRowClick(record),
                        style: {
                            background: selectedRowKeys.includes(record.id) ? "#f7f7f7" : '',
                        },
                    })
                    }
                />
            </div>
            <div className="right">
                <Form
                    form={form}
                >
                    <Row className={styles.row}>
                        <Col span={6}>
                            <Form.Item
                                label="参数名称"
                                name="name"
                            >
                                <Input
                                    allowClear={true}
                                    className='input-width'
                                    placeholder="请输入" />
                            </Form.Item>
                        </Col>
                        <Col span={18} style={{ textAlign: 'right' }}>
                            <Button type="default"  onClick={queryOnClick} icon={createIcon('SearchOutlined')}> 搜索 </Button>&nbsp;&nbsp;
                            <Button type="primary" onClick={handleAddClick} icon={createIcon('FileAddOutlined')}>新增模块</Button>&nbsp;&nbsp;
                            <Button type="primary" onClick={handleItemAddClick} icon={createIcon('AppstoreAddOutlined')}>新增参数</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    columns={systemConfigColumns}
                    scroll={{ y: 550 }}
                    bordered={true}
                    pagination={false}
                    dataSource={systemConfigs} />
            </div>
            {/*弹出窗口 */}
            <Modal
                title={title}
                width={modalWidth}
                okText="提交"
                open={isModalOpen}
                confirmLoading={confirmLoading}
                centered
                onOk={handleOk}
                destroyOnClose
                onCancel={() => setIsModalOpen(false)}>
                {modalContent}
            </Modal>
        </div>
    );
};

export default SystemConfig;