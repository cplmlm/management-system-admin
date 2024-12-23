import React, { useRef, useState, useEffect } from 'react';
import { Space, Table, Input, Row, Col, Form, Button, Modal, message, Tag, Select } from 'antd';
import { createIcon, getOrganizations,genderConvertToString } from '@/common/utils';
import { getUsers, deleteUser, resetUserPassword } from "@/api/user";
import userStore from '@/store'


const User = () => {
    const [form] = Form.useForm();
    //定义子组件useRef
    const childrenRef = useRef();
    const [modalContent, setModalContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [modalWidth, setModalWidth] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [organizationData, setOrganizationData] = useState([])
    const [defaultPagination, setDefaultPagination] = useState({ page: 1, pageSize: 10 })//初始分页
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, size: 'small', showSizeChanger: false, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` })//分页 条` })//分页

    useEffect(() => {
        init()
        getDataList(pagination)
        getOrganizationList()
    }, [])
    const init=()=>{
        form.setFieldsValue({organizationId:userStore.userInfo?.organizationId})
    }
    //新增
    const handleAddClick = () => {
        setConfirmLoading(false)
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "用户新增", 800, { id: "" })
    }
    //修改
    const handleEditClick = (record) => {
        const lazyPage = getEditLazyPage();
        modalWindow(lazyPage, "用户修改", 800, record)
    }

    //获取编辑子组件
    const getEditLazyPage = () => {
        const modules = import.meta.glob('./edit.jsx');
        const lazyPage = React.lazy(modules['./edit.jsx']);
        return lazyPage;
    }
    //删除
    const handleDeleteClick = (record) => {
        Modal.confirm({
            title: '确认提示',
            maskClosable: true,
            closable: true,
            icon: createIcon("DeleteOutlined"),
            content: '确定要删除吗？',
            centered: true,
            onOk() {
                handleDeleteUserOk(record.id)
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除
    const handleDeleteUserOk = async (id) => {
        let res = await deleteUser(id)
        if (res?.status === 200) {
            messageApi.success(res.message)
            getDataList(defaultPagination)
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
        const LazyPage = lazyPage;
        const content = <LazyPage onRef={childrenRef} data={data} setLoading={setLoading} closeModal={closeModal} organizationData={organizationData} />
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
        if (type === 2) {
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
        const data = Object.assign({}, values, { page: pagination.current, key: values.realName, organizationId: values.organizationId })
        let res = await getUsers(data)
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
    //获取所有机构列表
    const getOrganizationList = () => {
        const data = getOrganizations()
        setOrganizationData(data)
    }
    const handleChange = (pagination) => {
        getDataList({ current: pagination.current })
    }
    //重置
    const handleResetClick = (record) => {
        Modal.confirm({
            title: '确认提示',
            maskClosable: true,
            closable: true,
            content: '确定要重置密码吗？重置后的密码为123456',
            centered: true,
            onOk() {
                handleResetPasswordOk(record)
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除
    const handleResetPasswordOk = async (data) => {
        let res = await resetUserPassword(data)
        if (res?.status === 200) {
            messageApi.success(res.message)
            getDataList(pagination)
        }
    }
    const columns = [
        {
            title: '姓名',
            dataIndex: 'realName',
            align: "center",
            width: 100
        },
        {
            title: '账号',
            dataIndex: 'loginName',
            align: "center",
            width: 100
        },
        {
            title: '对接编码',
            dataIndex: 'name',
            align: "center",
            width: 120
        },
        {
            title: '角色',
            dataIndex: 'roleNames',
            align: "center",
            width: 200,
            render: (text) => {
                return text?.map(item =>
                    <Tag color="blue">{item}</Tag>
                )
            }
        },
        {
            title: '性别',
            dataIndex: 'gender',
            align: "center",
            width: 80,
            render: (text) => {
                return genderConvertToString(text)
            }
        },
        {
            title: '机构',
            dataIndex: 'organizationName',
            align: "center",
            ellipsis: true,
            width: 200
        },
        {
            title: '状态',
            dataIndex: 'enable',
            align: "center",
            width: 100,
            render: (text) => {
                return <Tag color="blue">{text ? "正常" : "禁用"}</Tag>
            }
        },
        {
            title: "签名",
            dataIndex: 'signature',
            align: "center",
            width: 100,
            render: (text) => {
                return text !== null ? <img style={{ height: 25, width: 100 }} src={text} /> : ""
            }
        },
        // {
        //     title: '出生日期',
        //     dataIndex: 'birth',
        //     align: "center",
        //     width: 200,
        //     render: (text) => {
        //         return <span>{dayjsToDateString(text)}</span>
        //     }
        // },
        {
            title: '操作',
            key: 'action',
            align: "center",
            width: 160,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size='small' icon={createIcon('EditOutlined')} onClick={(e) => handleEditClick(record)}>修改</Button>
                    <Button type="link" size='small' icon={createIcon('LockOutlined')} onClick={(e) => handleResetClick(record)}>重置</Button>
                    <Button type="link" size='small' danger icon={createIcon('DeleteOutlined')} onClick={e => handleDeleteClick(record)}>删除</Button>
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
                            label='机构'
                            name='organizationId'
                        >
                            <Select
                                showSearch
                                placeholder="请选择"
                                optionFilterProp="label"
                                className="select-width"
                                fieldNames={{ label: 'name', value: 'id' }}
                                options={organizationData}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="姓名"
                            name="realName"
                        >
                            <Input placeholder="请输入姓名" className='input-width' />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button type="default" onClick={queryOnClick} icon={createIcon('SearchOutlined')}> 搜索 </Button>&nbsp;&nbsp;
                        <Button type="primary" onClick={handleAddClick} icon={createIcon('PlusOutlined')}>新增</Button>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns}
                onChange={handleChange}
                dataSource={data}
                bordered
                scroll={{ x: 1200 }}
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

export default User;