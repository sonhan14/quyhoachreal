import { CloudDownloadOutlined, DeleteFilled, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Pagination, Space, Row, Col, Table, Popconfirm, message, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { current } from '@reduxjs/toolkit';
import { ViewlistPost } from '../../../services/api';
import GroupModalCreate from './PostModalCreate';
import GroupModalUpdate from './PostModalUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { doListBox, doListGroup } from '../../../redux/listForum/lisForumSlice';
import PostModalCreate from './PostModalCreate';
import PostModalUpdate from './PostModalUpdate';

const TablePost = () => {
    const [listPost, setListPost] = useState([]);
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
    const adGroupAdmin = useSelector((state) => state.getid.idPost);
    const idBox = useSelector((state) => state.getid.idGroup);
    console.log("res redux idBox",idBox)
    const dispatch = useDispatch();
    useEffect(()=>{

        getListViewPost();
    },[])

    const listPosts = listPost.filter((post) => post.GroupID === adGroupAdmin);

    const getListViewPost = async() => {
        let res = await ViewlistPost()
        if(res ) {
            setListPost(res.data);
            //dispatch(doListGroup(res.data));
            console.log("res ViewlistGroup",res)
        }
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
        title: 'Title',
        dataIndex: 'Title',
        sorter: true,

    },

    {
        title: 'Content',
        dataIndex: 'Content',
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
                        onConfirm={() => {handleDeleteBook(record._id)}}
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

    const handleDeleteBook = async(id) => {
        // const res = await callDeleteBook(id)
        // if(res && res.data) {
        //     message.success('Xóa thành công book')
        //     fetchBook();
        // }else {
        //     notification.error({
        //         message:'Có lỗi xảy ra',
        //         description: res.message
        //     })
        // }
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
    //     if(listGroup.length > 0) {
    //         const worksheet = XLSX.utils.json_to_sheet(listGroup);
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
                        dataSource={listPosts} 
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
            
            <PostModalCreate
                openModalCreate = {openModalCreate}
                getListViewPost= {getListViewPost}
                setOpenModalCreate = {setOpenModalCreate}
            />
            <PostModalUpdate
                openModalUpdate = {openModalUpdate}
                dataUpdate = {dataUpdate}
                setDataUpdate= {setDataUpdate}
                getListViewPost= {getListViewPost}
                setOpenModalUpdate = {setOpenModalUpdate}
            /> 
        </>
};


export default TablePost;