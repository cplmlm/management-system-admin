import React, { useEffect, useRef, useState } from 'react';
import { Space, Table, Input, Row, Col, Form, Button, Modal, message, Tag } from 'antd';
import { createIcon, dayjsToDateString } from '@/common/utils';
import { getModules, deleteModule } from "@/api/module";


const Module = () => {
    const [form] = Form.useForm();
    //定义子组件useRef
    const childrenRef = useRef();
    const [modalContent, setModalContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [modalWidth, setModalWidth] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [defaultPagination, setDefaultPagination] = useState({ page: 1, pageSize: 10 })//初始分页
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, size: 'small',showSizeChanger:false,showSizeChanger:false,showQuickJumper: true, showTotal: (total) => `共 ${total} 条` })//分页 条` })//分页

    useEffect(() => {
        getDataList(pagination)
    }, [])
    //新增
    const handleAddClick = () => {
        setConfirmLoading(false)
        const lazyPage = getEditLazyPage()
        modalWindow(lazyPage, "接口新增", 400, { id: "" })
    }
    //修改
    const handleEditClick = (record) => {
        const lazyPage = getEditLazyPage()
        modalWindow(lazyPage, "接口修改", 400, record)
    }
    //获取编辑子组件
    const getEditLazyPage = (path) => {
        const modules =import.meta.glob('./edit.jsx');
        const lazyPage = React.lazy(modules['./edit.jsx']);
        return lazyPage;
    }
    //删除
    const handleDeleteClick = (record) => {
        Modal.confirm({
            title: '确认提示',
            maskClosable: true,
            closable: true,
            icon: createIcon("DeleteOutlined", "#ff0000"),
            content: '确定要删除吗？',
            centered: true,
            onOk() {
                handleDeleteModuleOk(record.id)
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除
    const handleDeleteModuleOk = async (id) => {
        let res = await deleteModule(id)
        if (res?.status === 200) {
            messageApi.success(res.message)
            getDataList(pagination)
        }
    }
    //查询条件表单提交
        const queryOnClick = () => {
        getDataList(defaultPagination)
    }
    /**
     * Modal 窗口弹出框
     * @param {string} path 
     * @param {string} title 
     * @param {number} width 
     * @param {*} data 
     */
    const modalWindow = (lazyPage, title, width, data) => {
        const LazyPage = lazyPage;
        const content = <LazyPage onRef={childrenRef} data={data} setLoading={setLoading} closeModal={closeModal} />
        setTitle(title)
        setModalWidth(width)
        setModalContent(content)
        setIsModalOpen(true)
    }
     /**
     * 关闭弹出框
     * @param {number} type 1-新增 2-修改
     */
    const closeModal = (type) => {
        setIsModalOpen(false)
        //如果是修改，则重新根据当前页码获取列表，新增时默认获取第一页列表
        if (type===2) {
            getDataList(pagination)
        } else {
            getDataList(defaultPagination)
        }
    }
    //弹出框确定按钮事件
    const handleOk = () => {
        childrenRef.current.confirm()//调用子组件的confirm方法
    }
    //设置提交确认按钮状态
    const setLoading = (state) => {
        setConfirmLoading(state)
    }
    //获取数据列表
    const getDataList = async (pagination) => {
        const values = form.getFieldsValue();
        const data = Object.assign({}, values, { page: pagination.current, key: values.name })
        let res = await getModules(data)
        if (res?.status === 200) {
            setData(res.data.data)
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
    const columns = [
        {
            title: '接口地址',
            dataIndex: 'linkUrl',
            align: "center",
            width: 200
        },
        {
            title: '接口名称',
            dataIndex: 'name',
            align: "center",
            width: 250
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: "center",
            width: 200,
            render: (text) => {
                return <span>{dayjsToDateString(text)}</span>
            }
        },
        {
            title: '创建者',
            dataIndex: 'createBy',
            align: "center",
            width: 200
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            align: "center",
            width: 200,
            render: (text) => {
                return <Tag color="blue">{text ? "正常" : "禁用"}</Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size='small' icon={createIcon('EditOutlined')} onClick={(e) => handleEditClick(record)}>修改</Button>
                    <Button type="link"  size='small' danger  icon={createIcon('DeleteOutlined')} onClick={e => handleDeleteClick(record)}>删除</Button>
                </Space>
            ),
        },
    ];
    return (
         <div className='main-content'>
            {contextHolder}
            <Form
                form={form}

            >
                <Row>
                    <Col span={6}>
                        <Form.Item
                            label="接口名称"
                            name="name"
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={18} style={{ textAlign: 'right' }}>
                        <Button type="default"  onClick={queryOnClick} icon={createIcon('SearchOutlined')}> 搜索 </Button>&nbsp;&nbsp;
                        <Button type="primary" onClick={handleAddClick} icon={createIcon('PlusOutlined')}>新增</Button>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns}
                onChange={handleChange}
                dataSource={data}
                bordered
                pagination={pagination} />
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

export default Module;