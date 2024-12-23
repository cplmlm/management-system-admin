import React, { useEffect, useRef, useState } from 'react';
import { Table, Input, Row, Col, Form, Button, Modal, message, Space, Dropdown } from 'antd';
import { createIcon } from '@/common/utils';
import { getDictionaryTypes, deleteDictionaryType, getDictionaryItems, deleteDictionaryItem } from "@/api/dictionary";
import styles from './index.module.less'
import { useLocation } from 'react-router-dom';

const Dictionary = () => {
    const [form] = Form.useForm();
    //定义子组件useRef
    const childrenRef = useRef();
    const { pathname } = useLocation();
    const [dictionaryItems, setDictionaryItems] = useState([])
    const [id, setId] = useState('')
    const [name,setName]=useState("")
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalContent, setModalContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [modalWidth, setModalWidth] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [defaultPagination, setDefaultPagination] = useState({ page: 1, pageSize: 10 })//初始分页
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, size: 'small', showSizeChanger: false, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` })//分页 条` })//分页
    const [path, setPath] = useState("")
    const [record, setRecord] = useState({})

    useEffect(() => {
        init()
    }, [])
    const init = () => {
        const path = pathname.split("/").pop();
        //体检结论模板共用自动维护界面
        if (path === "conclusionTemplate") {
            const id="1819213824625086464"//体检结论id
            getDictionaryItemList(id)
            setId(id)
        }
        getDataList(pagination)
        setPath(path)
    }
    //新增字典类型
    const handleAddClick = async () => {
        setConfirmLoading(false)
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "字典类型新增", 400, { id: "" })
    }
    //修改字典类型
    const handleEditClick = (record) => {
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "字典类型修改", 400, record)
    }
    //获取编辑子组件
    const getEditLazyPage = () => {
        const modules = import.meta.glob('./components/DictionaryTypeEdit.jsx');
        const lazyPage = React.lazy(modules['./components/DictionaryTypeEdit.jsx']);
        return lazyPage;
    }
    /**
     * 删除字典类型
     * @param {*} record 
     * @param {*} type 1-删除字典类型 2-删除字典项目
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
                    handleDeleteDictionaryOk(record.id)
                } else {
                    handleDeleteItemOk(record.id)
                }
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除字典类型提交
    const handleDeleteDictionaryOk = async (id) => {
        let res = await deleteDictionaryType(id)
        if (res?.status === 200) {
            messageApi.success(res.message)
            getDataList(pagination)
        }
    }
    //新增字典类型子项
    const handleItemAddClick = async () => {
        if (id === undefined || id === null || id === "") {
            messageApi.error("请选择字典类型")
            return
        }
        setConfirmLoading(false)
        const lazyPage = getItemEditLazyPage();
        modalWindow(lazyPage, "字典项目新增", 400, { id: "", dictionaryTypeId: id,serialNumber:dictionaryItems.length+1 })
    }
    //字典项目修改
    const handleItemEditClick = (record) => {
        const lazyPage = getItemEditLazyPage();
        modalWindow(lazyPage, "字典项目修改", 400, record)
    }
    //获取编辑子组件
    const getItemEditLazyPage = () => {
        const modules = import.meta.glob('./components/DictionaryItemEdit.jsx');
        const lazyPage = React.lazy(modules['./components/DictionaryItemEdit.jsx']);
        return lazyPage;
    }
    //字典项目删除
    const handleDeleteItemOk = async (itemId) => {
        let res = await deleteDictionaryItem(itemId)
        if (res?.status === 200) {
            messageApi.success(res.message)
            getDictionaryItemList(id)
        }
    }
    //查询条件表单提交
    const queryOnClick = () => {
        getDataList(defaultPagination)
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
     * @param {int} type 1-字典类型 2-字典项目
     */
    const closeModal = (type) => {
        setIsModalOpen(false)
        if (type === 1) {
            //如果是修改，则重新根据当前页码获取列表，新增时默认获取第一页列表
            if (data.id !== undefined && data.id !== null && data.id !== "") {
                getDataList(pagination)
            } else {
                getDataList(defaultPagination)
            }
        } else {
            getDictionaryItemList(id)
        }
    }
    //弹出框确定按钮事件
    const handleOk = () => {
        childrenRef.current.confirm()//调用新增子组件的confirm方法
    }
    //设置提交确认按钮状态
    const setLoading = (state) => {
        setConfirmLoading(state)
    }
    //获取数据列表
    const getDataList = async (pagination) => {
        const values = form.getFieldsValue();
        const data = Object.assign({}, { page: pagination.current, key:values.name })
        let res = await getDictionaryTypes(data)
        if (res?.status === 200) {
            setData(res.data?.data)
            //默认选中第一行
            const record = res.data.data?.length>0?res.data?.data[0]:null
            handleRowClick(record)
            setPagination(prevState => ({
                ...prevState,
                total: res.data.dataCount,
                pageSize: res.data.pageSize,
                current: res.data.page
            })
            )
        }
    }
    //表格改变事件
    const handleChange = (pagination) => {
        getDataList({ current: pagination.current })
    }
    //点击表格行
    const handleRowClick = (record) => {
        setSelectedRowKeys([record.id])
        setId(record.id)
        setName(record.name)
        getDictionaryItemList(record.id)
    }
    //获取字典项目列表
    const getDictionaryItemList = async (dictionaryTypeId) => {
        const res = await getDictionaryItems({ key: dictionaryTypeId })
        if (res?.status === 200) {
            setDictionaryItems(res.data)
        }
    }
    //点击字典类型名称
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
            title: '类型名称',
            dataIndex: 'name',
            align: "center",
            ellipsis: true,
           render: (text, record) => (
                <Dropdown
                    menu={{ items }}
                    trigger="contextMenu"
                    onOpenChange={() => handleNameOpenChange(record)}
                >
              <span>{record.name}</span>
                </Dropdown>
            )
        }
    ];
    const dictionaryItemColumns = [
        {
            title: '序号',
            dataIndex: 'serialNumber',
            align: "center",
            width: 100
        },
        {
            title: '名称',
            dataIndex: 'name',
            align: "center",
            width: 500
        },
        {
            title: '编码',
            dataIndex: 'code',
            align: "center",
            width: 100
        },
        {
            title: '字典说明',
            dataIndex: 'description',
            align: "center",
            width: 100
        },
        {
            title: '操作',
            key: 'action',
            width: 140,
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size='small' icon={createIcon('EditOutlined')} onClick={(e) => handleItemEditClick(record)}>修改</Button>
                    <Button type="link" size='small' danger icon={createIcon('DeleteOutlined')} onClick={e => handleDeleteClick(record, 2)}>删除</Button>
                </Space>
            ),
        }
    ]
    return (
        <div className='left-right-container'>
            {contextHolder}
            <div className="left"   style={{ display: path === "conclusionTemplate" ? "none" : "flex" }}>
                <Table
                    pagination={pagination}
                    columns={columns}
                    onChange={handleChange}
                    dataSource={data}
                    size='middle'
                    scroll={{ x: 100, y: 620 }}
                    onRow={(record, rowIndex) => ({
                        onClick: () => handleRowClick(record),
                        style: {
                            background: selectedRowKeys.includes(record.id) ? "#E8E8E8" : '',
                        },
                    })
                    }
                />
            </div>
            {/* <div style={ border:"solid #f1f1f1 1px" }></div> */}
            <div className="right">
                <Form
                    form={form}
                >
                    <Row className={styles.row}>
                        <Col span={6}>
                            <Form.Item
                                label="类型名称"
                                name="name"
                                style={{ display: path === "conclusionTemplate" ? "none" : "flex" }}
                            >
                                <Input
                                    style={{ display: path === "conclusionTemplate" ? "none" : "flex" }}
                                    allowClear={true}
                                    className='input-width'
                                    placeholder="请输入" />
                            </Form.Item>
                        </Col>
                        <Col span={18} style={{ textAlign: 'right' }}>
                            <Button type="default" style={{ display: path === "conclusionTemplate" ? "none" : "inline" }}  onClick={queryOnClick} icon={createIcon('SearchOutlined')}> 搜索 </Button>&nbsp;&nbsp;
                            <Button type="primary" style={{ display: path === "conclusionTemplate" ? "none" : "inline" }} onClick={handleAddClick} icon={createIcon('FileAddOutlined')}>新增类型</Button>&nbsp;&nbsp;
                            <Button type="primary" onClick={handleItemAddClick} icon={createIcon('AppstoreAddOutlined')}>新增项目</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                                    //title={() => name+"（"+id+"）"}
                                     footer={() => name+"（"+id+"）"}
                    columns={dictionaryItemColumns}
                    scroll={{ y: 550 }}
                    bordered={true}
                    pagination={false}
                    dataSource={dictionaryItems} />
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

export default Dictionary;