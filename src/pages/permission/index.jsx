import React, { useEffect, useRef, useState } from 'react';
import { Space, Table, Input, Row, Col, Form, Button, Modal, message, Tag } from 'antd';
import { createIcon, dayjsToDateString } from '@/common/utils';
import { getPermissions, deletePermission } from "@/api/permission";


const Permission = () => {
    const [form] = Form.useForm();
    //定义子组件useRef
    const childrenRef = useRef();
    const [modalContent, setModalContent] = useState("")
    const [expandedRowKeys, setExpandedRowKeys] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [modalWidth, setModalWidth] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [defaultPagination, setDefaultPagination] = useState({ page: 1, pageSize: 10 })//初始分页
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, size: 'small', showSizeChanger:false,showQuickJumper: true, showTotal: (total) => `共 ${total} 条` })//分页 条` })//分页

    useEffect(() => {
        getDataList(pagination)
    }, [])
    //新增
    const handleAddClick = (record) => {
        setConfirmLoading(false)
        const lazyPage = getEditLazyPage()
        modalWindow(lazyPage, "接口新增", 800, { id: "", pid: record.id })
    }
    //修改
    const handleEditClick = (record) => {
        const lazyPage = getEditLazyPage()
        modalWindow(lazyPage, "接口修改", 800, record)
    }
    //获取编辑子组件
    const getEditLazyPage = (path) => {
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
            icon: createIcon("DeleteOutlined", "#ff0000"),
            content: '确定要删除吗？',
            centered: true,
            onOk() {
                handleDeletePermissionOk(record.id)
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除
    const handleDeletePermissionOk = async (id) => {
        let res = await deletePermission(id)
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
    //关闭弹出框
    const closeModal = () => {
        setIsModalOpen(false)
        setExpandedRowKeys([0])
        //如果是修改，则重新根据当前页码获取列表，新增时默认获取第一页列表
        if (data.id !== undefined && data.id !== null && data.id !== "") {
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
        setExpandedRowKeys([0])
        let res = await getPermissions({ pid: 0 })
        if (res?.status === 200) {
            // 默认都有children，方便table生成展开功能
            const tableData = res.data;
            tableData?.map((item) => {
                item.children = [];
                return item;
            });
            setData(tableData)
            // setPagination(prevState => ({
            //     ...prevState,
            //     total: res.data.dataCount,
            //     pageSize: res.data.pageSize,
            //     current: res.data.page
            // })
            // )
        }
    }
    //展开事件
    const onExpand = async (expanded, record) => {
        //expanded是否展开  record每一项的值
        const id = record.id;
        const pList = data;
        if (!expanded) return;
        if (record.children?.length > 0) return;
        const parameter = { pid: id, number: record?.key * 10 };
        let res = await getPermissions(parameter)
        if (res?.status !== 200) {
            return;
        }
        if (res.data.length === 0) {
            return;
        }
        let tableData = res.data || [];
        tableData?.map((item) => {
            if (item.hasChildren) {
                item.children = [];
            }
            return item;
        });
        // 递归遍历查找当前项，并将children插入
        const dataMap = (items) => {
            items.find((item) => {
                if (item.id === id) {
                    item.children = tableData;
                    return item;
                }
                if (item.children?.length > 0) {
                    dataMap(item.children);
                }
            });
        };
        dataMap(pList);
        setData([...pList]);
    };
    //展开的行变化时触发
    const handleExpandedRowsChange = (key) => {
        setExpandedRowKeys(key)
    }
    //表格改变事件
    const handleChange = (pagination) => {
        getDataList({ current: pagination.current })
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'orderSort',
            align: "center",
            width: 80
        },
        {
            title: '菜单名称',
            dataIndex: 'name',
            align: "center",
            ellipsis: true,
            width: 120
        },
        {
            title: '路由地址',
            dataIndex: 'code',
            align: "center",
            ellipsis: true,
            width: 130
        },
        {
            title: 'API接口',
            dataIndex: 'mName',
            align: "center",
            width: 180,
            ellipsis: true
        },
        {
            title: '菜单图标',
            dataIndex: 'icon',
            align: "center",
            ellipsis: true,
            width: 130
        },
        {
            title: '是否按钮',
            dataIndex: 'isButton',
            align: "center",
            width: 80,
            render: (text) => {
                return <Tag color="blue">{text ? "是" : "否"}</Tag>
            }
        },
        {
            title: '按钮事件',
            dataIndex: 'func',
            align: "center",
            width: 80
        },
        {
            title: '是否隐藏',
            dataIndex: 'isHide',
            align: "center",
            width: 80,
            render: (text) => {
                return <Tag color="blue">{text ? "是" : "否"}</Tag>
            }
        },
        {
            title: '是否有子级',
            dataIndex: 'iskeepAlive',
            align: "center",
            width: 100,
            render: (text) => {
                return <Tag color="blue">{!text ? "是" : "否"}</Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            align: "center",
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    {!record.iskeepAlive ? <Button type="link" size='small' icon={createIcon('PlusOutlined')} onClick={(e) => handleAddClick(record)}>新增</Button> : null}
                    <Button type="link" size='small' icon={createIcon('EditOutlined')} onClick={(e) => handleEditClick(record)}>修改</Button>
                    <Button type="link" size='small' danger icon={createIcon('DeleteOutlined')} onClick={e => handleDeleteClick(record)}>删除</Button>
                </Space>
            ),
        }
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
                            label="菜单名称"
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
                bordered={true}
                scroll={{ y: 630}}
                expandedRowKeys={expandedRowKeys}
                onExpandedRowsChange={handleExpandedRowsChange}
                onExpand={onExpand}
                pagination={false} />
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

export default Permission;