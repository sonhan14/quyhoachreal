import { CloudDownloadOutlined, DeleteFilled, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Pagination, Space, Row, Col, Table, Popconfirm, message, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { current } from '@reduxjs/toolkit';

const AdminPage = () => {
    const [listUser, setListUser] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('sort=-updateAt');
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState('');
    const [dataUpdate, setDataUpdate] = useState([]);
    
    

   
  const columns = [
    {
        title: 'Id',
        dataIndex: '_id',
        render: (text, record, index) => {
            return (
                <a href='#' onClick={() => {
                setDataViewDetail(record);
                setOpenViewDetail(true);
                }}>{record._id}</a>
            )
        }
    },
    {
        title: 'Tên bản đồ',
        dataIndex: 'mainText',
        sorter: true,

    },
    {
        title: 'Tỉnh',
        dataIndex: 'category',
        sorter: true,

    },
    {
        title: 'Huyện',
        dataIndex: 'author',
        sorter: true,
    },

    {
        title: 'Giá tiền',
        dataIndex: 'price',
        sorter: true,
    },

    {
        title: 'Xã',
        dataIndex: 'price',
        sorter: true,
    },

    {
        title: 'Ghi chú',
        dataIndex: 'price',
        sorter: true,
    },
    {
        title: 'Thời gian',
        dataIndex: 'price',
        sorter: true,
    },

    {
        title: 'Trạng thái',
        dataIndex: 'updatedAt',
        sorter: true,
    },

    {
        title: 'Kích thước',
        dataIndex: 'updatedAt',
        sorter: true,
    },

    {
        title: 'Người đăng',
        dataIndex: 'updatedAt',
        sorter: true,
    },
    {
        title: 'Action',
        render: (text, record, index) => {
            return (
                <>
                    <Popconfirm
                        placement='leftTop'
                        title={'Xác nhận xóa bản đồ'}
                        description={'Bạn có chắc muốn xóa bản đồ này?'}
                        onConfirm={() => {}}
                        okText='Xác nhận'
                        cancelText='Hủy'
                    >
                        <span style={{cursor:'pointer'}}>
                            <DeleteTwoTone twoToneColor='#ff4d4f'/>
                        </span>    

                    </Popconfirm>
                    <EditTwoTone
                        twoToneColor='#f57800' style={{cursor: 'pointer'}}
                        onClick={()=>{
                             setOpenModalUpdate(true)
                             setDataUpdate(record)
                        }}

                    />
                </>
            )
        }
    }
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
            // fetchBook()
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize (pagination. pageSize)
            setCurrent(1);
        }
        
        if (sorter && sorter.field) {
            const q = sorter.order === "ascend" ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);

        }
    }

    const renderHeader = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Danh sách bản đồ</span>
                <span style={{display: 'flex', gap: 15}}>
                    <Button
                        icon={<ExportOutlined/>}
                        type='primary'
                        onClick={()=> {
                            // handleExportData();
                        }}
                    >
                        Export
                    </Button>
    
                    <Button
                        icon={<CloudDownloadOutlined/>}
                        type='primary'
                        onClick={()=> {
                            // setOpenModalImport(true);
                        }}
                    >
                        Import
                    </Button>
    
                    <Button
                        icon={<PlusOutlined/>}
                        type='primary'
                        onClick={()=> {
                            // setOpenModalCreate(true);
                        }}
                    >
                        Thêm mới
                    </Button>
    
                    <Button
                        type='ghost'
                        onClick={()=> {
                            setFilter('');
                            setSortQuery('');
                        }}
                    >
                        <ReloadOutlined/>
                    </Button>
                </span>
            </div>
        )
    }
    
    const handlesearch = (query) => {
        setFilter(query);
        setCurrent(1);
    }
    
    // const handleExportData = () => {
    //     if(listUser.length > 0) {
    //         const worksheet = XLSX.utils.json_to_sheet(listUser);
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
    //         XLSX.writeFile(workbook,'ExportUser.csv');
    //     }
        
    // }

  
  return <>

            <Row gutter={[20,20]} style={{margin:'28px 10px'}}>
                <Col span={24}></Col>
                <Col span={24} style={{marginTop:'-30px'}}>
                    <Table 
                        title={renderHeader}
                        loading={isLoading}
                        rowKey='_id'
                        columns={columns} 
                        dataSource={listUser} 
                        onChange={onChange}
                        pagination= {
                            {   
                                current: current, 
                                pageSize: pageSize, 
                                showSizeChanger: true, 
                                total: total,
                                showTotal: (total, range) => {return (
                                    <div>
                                        {range[0]}-{range[1]} trên {total} rows
                                    </div>
                                )}
                            }
                        }
                    />
                </Col>
            </Row>
            
            
        </>
};


export default AdminPage;