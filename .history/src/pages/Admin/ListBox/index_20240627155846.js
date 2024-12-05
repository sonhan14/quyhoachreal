import { CloudDownloadOutlined, DeleteFilled, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Pagination, Space, Row, Col, Table, Popconfirm, message, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { current } from '@reduxjs/toolkit';
import { ViewlistBox } from '../../../services/api';
import BoxModalCreate from './BoxModalCreate';
import BoxModalUpdate from './BoxModalUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { doListBox } from '../../../redux/listForum/lisForumSlice ';

const TableBox = () => {
    const [listBox, setListBox] = useState([]);
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
   
    
    const dispatch = useDispatch();
    useEffect(()=>{
        getListViewBox();
    },[])

    const getListViewBox = async() => {
        let res = await ViewlistBox()
        if(res && res?.data) {
            setListBox(res.data);
            dispatch(doListBox(res.data));
        }
        console.log("res viewBox",res)
    }
   
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
        title: 'Tên Box',
        dataIndex: 'BoxName',
        sorter: true,

    },
    {
        title: 'Mô tả',
        dataIndex: 'Description',
        sorter: true,

    },
    {
        title: 'Avtart',
        dataIndex: 'avatarLink',
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
                            setOpenModalCreate(true);
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
    //     if(listBox.length > 0) {
    //         const worksheet = XLSX.utils.json_to_sheet(listBox);
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
                        dataSource={listBox} 
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
            
            <BoxModalCreate
                openModalCreate = {openModalCreate}
                getListViewBox= {getListViewBox}
                setOpenModalCreate = {setOpenModalCreate}
            />
            <BoxModalUpdate
                openModalUpdate = {openModalUpdate}
                dataUpdate = {dataUpdate}
                setDataUpdate= {setDataUpdate}
                getListViewBox= {getListViewBox}
                setOpenModalUpdate = {setOpenModalUpdate}
            /> 
        </>
};


export default TableBox;