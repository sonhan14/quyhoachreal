import React, { useState,useEffect } from 'react'
import './ListComment.scss'
import { Container } from 'react-bootstrap'
import { DeleteCommentAuction, EditCommentAuction, fetchListComment } from '../../../services/api'
import { useSelector } from 'react-redux'
import { notification } from 'antd'
import { IoEllipsisVerticalCircleSharp } from 'react-icons/io5'

const ListComment = ({IDAuction}) => {
    const [dataListComment, setDataListComment] = useState([])
    const [editing, setEditing] = useState(null) //id comment
    const [EditComment, setEditComment] = useState('') // edit comment
    const [openModal, setOpenModal] = useState(null)
    const dataUserID = useSelector((state) => state.account.dataUser.UserID);
    // call api list comment
    useEffect(() => {
      const fetchDataList = async () =>{
        const dataList = await fetchListComment(IDAuction)
        setDataListComment(dataList.data)
      }
      fetchDataList()
    },[IDAuction])

    // handle delete

    const handleDelete = async (idComment) => {
      try{
        await DeleteCommentAuction(idComment)
        setDataListComment(dataListComment.filter(commnet => commnet.idComment !== idComment))
        notification.success({
          message: "Success",
          description: "Comment deleted successfully"
        })
      }catch(error){
        console.error("Error deleting comment", error);
        notification.error({
          message: "Error",
          description: 'Failed to delete comment'
        })
      }
    }

    // handle modal sua xoa
    const handleOpenModal = (idComment) => {
      setOpenModal(openModal === idComment ? null : idComment)
    }

    // handle edit 
    const handleEdit = (comment) =>{
      setEditing(comment.idComment)
      setEditComment(comment.comment)
      setOpenModal(null)
    }

    const handleSaveEdit = async (idComment) => {
      try{
        await EditCommentAuction(idComment,EditComment)
        setDataListComment(dataListComment.filter(commnet => commnet.idComment !== idComment ))
        notification.success({
          message: "Success",
          description : "Comment updated seccessfully"
        })
      }catch(error){
        console.error('Error updating comment', error)
        notification.error({
          message: "Error",
          description : "Failed to update comment"
        })
      }
    }



  return (
    <Container>
        {
          dataListComment && dataListComment.length > 0 && (
            dataListComment.map((e,index)=>(
              <div className='container-cmt'>
                  <div className='cmt-header'>
                      <img src={e.avatar}  alt='Avatar icon' className='avatar'/>
                      <span className='cmt-name'>{e.fullname}</span>
                  </div>
                      {e.idUser === dataUserID && (
                        <div className='cmt-actions'>
                            <IoEllipsisVerticalCircleSharp  onClick={()=>handleOpenModal(e.idComment)}/>
                            {
                              openModal === e.idComment && (
                                <div className='modal-actions'>
                                    <p onClick={()=> handleEdit(e)}>Sửa</p>
                                    <p onClick={() => handleDelete(e.idComment)}>Xóa</p>
                                </div>
                              )
                            }
                        </div>
                      )}
                  <div className='cmt-body'>
                      {editing === e.idComment  ? (
                            <>
                            <textarea
                                className='cmt-textarea'
                                value={EditComment}
                                onChange={(e) => setEditComment(e.target.value)}
                            />
                            <button className='btn-save' onClick={() => handleSaveEdit(e.idComment)}>Save</button>
                            </>
                            ) : (
                                <textarea
                                    className='cmt-textarea'
                                    value={e.comment}
                                    readOnly
                                >
                                {e.content}
                                </textarea>
                            )}
                  </div>
              </div>
            ))
          )
        }
    </Container>
  )
}

export default ListComment
