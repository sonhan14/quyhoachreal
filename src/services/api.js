import instance from '../utils/axios-customize';
import removeAccents from 'remove-accents';

// api login, logout
export const callLogin = (Username, Password) => {
    const params = {
        Username: Username,
        Password: Password,
    };
    return instance.post('/api/login', params);
};
export const callLogout = (Username, Password) => {
    const params = {
        Username: Username,
        Password: Password,
    };
    return instance.post('/api/logout', params);
};

// api register
export const callRegister = (
    Username,
    Fullname,
    Password,
    Gender,
    Latitude,
    Longitude,
    AvatarLink,
    ipAddress,
    Email,
) => {
    const payload = {
        Username: Username,
        FullName: Fullname,
        Password: Password,
        Gender: Gender,
        Latitude: Latitude,
        Longitude: Longitude,
        avatarLink: AvatarLink,
        Email: Email,
        LastLoginIP: ipAddress,
    };

    return instance
        .post('/api/register', payload)
        .then((response) => response.data)
        .catch((error) => {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
            }
            throw error;
        });
};

// api token
export const callRefeshToken = () => {
    return instance.post('/refresh_token');
};

export const callforgotPassword = (email) => {
    return instance.post('/api/forgotPassword', {
        Email: email,
    });
};

//api search quy hoạch

export const searchQueryAPI = (query) => {
    return instance.get(`/api/zonings/view?name=${encodeURIComponent(query)}`);
};

// api box
export const ViewlistBox = () => {
    return instance.get('/api/box/viewlist_box');
};
export const CreateBox = (BoxName, Description, avatarLink) => {
    return instance.post('/api/box/add_box', { BoxName, Description, avatarLink });
};

export const UpdateBox = (BoxID, BoxName, Description, avatarLink) => {
    return instance.patch(`/api/box/update_box/${BoxID}`, { BoxName, Description, avatarLink });
};

// API Map

export const fetchAllQuyHoach = async () => {
    try {
        const { data } = await instance.get('/all_quyhoach');
        return data;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchProvinces = async () => {
    try {
        const response = await instance.get('/api/provinces/view/');
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces: ', error);
        return [];
    }
};

export const fetchListInfo = async (idDistrict) => {
    try {
        const { data } = await instance.get(`/api/location/list_info_by_district/${idDistrict}`);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchAllProvince = async () => {
    try {
        const { data } = await instance.get('/api/provinces/view/');
        return data;
    } catch (error) {
        console.error('Error fetching provinces: ', error);
        return [];
    }
};

export const fetchDistrictsByProvinces = async (ProvinceID) => {
    try {
        const { data } = await instance.get(`/api/districts/Byprovince/${ProvinceID}`);
        return data;
    } catch (error) {
        console.error('Error fetching districts', error);
        return;
    }
};

export const fetQuyHoachByIdDistrict = async (districtId) => {
    try {
        const { data } = await instance.get(`/quyhoach1quan/${districtId}`);
        return data;
    } catch (error) {
        console.error('Error fetching quy hoach by district:', error);
        return [];
    }
};

export const searchLocation = async (districtName) => {
    try {
        let apiName = removeAccents(districtName?.toLowerCase());
        if (apiName === 'south tu liem') {
            apiName = 'nam tu liem';
        } else if (apiName === 'north tu liem') {
            apiName = 'bac tu liem';
        }

        const { data } = await instance.get(`/quyhoach/search/${apiName}`);
        return data?.Posts[0];
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
    }
};

//Api Auction

export const fetchListHighestLocation = async (districtId) => {
    try {
        const response = await instance.get(`/api/location/list_info_highest/${districtId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching districts', error);
        return;
    }
};

export const fetchFilteredAuctions = async (startTime, endTime, startPrice, endPrice, province, district) => {
    const params = {
        StartTime: startTime,
        EndTime: endTime,
        Province: province,
        District: district,
        StartPrice: startPrice,
        EndPrice: endPrice,
    };
    const response = await instance.post('/api/landauctions/filter_auction', params);
    return response.data;
};

export const fetchAuctionInfor = async (LandAuctionID) => {
    const response = await instance.get(`/api/landauctions/view/${LandAuctionID}`);
    return response.data;
};

export const fetchOrganization = async () => {
    const response = await instance.get('/api/list_organizers');
    return response.data;
};

export const fetchCreateComment = async (IDAuction, comment, userId) => {
    const params = {
        idUser: userId,
        content: comment,
    };
    const response = await instance.post(`/api/landauctions/create_comment/${IDAuction}`, params);
    return response.data;
};

//api list comment
export const fetchListComment = async (IDAuction) => {
    const response = await instance.get(`/api/landauctions/list_comment/${IDAuction}`);
    return response.data;
};

//api edit comment
export const EditCommentAuction = async (IDComment, EditComment) => {
    const params = {
        content: EditComment,
    };
    const response = await instance.patch(`/api/landauctions/edit_comment/${IDComment}`, params);
    return response.data;
};
//api delete comment
export const DeleteCommentAuction = async (IDComment) => {
    const response = await instance.delete(`/api/landauctions/delete_comment/${IDComment}`);
    return response.data;
};

//forums post

export const ViewlistPost = () => {
    return instance.get('/api/forum/view_allpost');
};

export const CreatePost = (GroupID, Title, Content, PostLatitude, PostLongitude, base64Images, isHastags) => {
    const params = {
        GroupID: GroupID,
        Title: Title,
        Content: Content,
        PostLatitude: PostLatitude,
        PostLongitude: PostLongitude,
        Images: base64Images,
        Hastags: isHastags,
    };
    return instance.post('/api/forum/add_post', params);
};
export const UpdatePost = (PostID, Title, Content) => {
    return instance.patch(`/api/forum/update_post/${PostID}`, { Title, Content });
};
export const callFetchPostById = (PostID) => {
    return instance.get(`/api/forum/view_post/${PostID}`);
};

export const DeletePost = (PostID) => {
    return instance.delete(`/api/forum/delete_post/${PostID}`);
};

// api like, comment, share

export const LikePost = (idUser, idPost) => {
    return instance.post(`/api/forum/like_post/${idUser}/${idPost}`);
};

export const ListUserLike = (idPost) => {
    return instance.get(`/api/forum/list_user_like_post/${idPost}`);
};
export const numberInteractions = (idPost) => {
    return instance.get(`/api/forum/number_info_post/${idPost}`);
};
export const AllPostInfor = () => {
    return instance.get('/api/forum/all_post_info');
};

// api comment post
export const ViewlistComment = (PostID) => {
    return instance.get(`/api/post/comments/${PostID}`);
};
export const CreateComment = (PostID, Content, Images) => {
    return instance.post(`/api/post/add_comment/${PostID}`, { Content, Images });
};
export const UpdateComment = (CommentID, Content, PhotoURL) => {
    return instance.patch(`/api/post/comment/update/${CommentID}`, { Content, PhotoURL });
};
export const DeleteComment = (CommentID) => {
    return instance.delete(`/api/post/comment/remove/${CommentID}`);
};

// api group
export const CreateGroup = (BoxID, GroupName, avatarLink) => {
    return instance.post('/api/group/add_group', { BoxID, GroupName, avatarLink });
};

export const UpdateGroup = (GroupID, GroupName) => {
    return instance.patch(`/api/group/update_group/${GroupID}`, { GroupName });
};
export const DeleteGroup = (GroupID) => {
    return instance.delete(`/api/group/remove_group/${GroupID}`);
};
export const ViewlistGroup = (BoxID) => {
    return instance.get(`/api/group/all_group/${BoxID}`);
};

// api user, checkonline
export const callGetAllUsers = () => {
    return instance.get(`/api/listalluser`);
};
export const ViewProfileUser = (USERID) => {
    return instance.get(`/api/private/profile/${USERID}`);
};
export const CheckUserOnline = (USERID) => {
    return instance.get(`/api/checkOnline/${USERID}`);
};
export const BlockUserPost = (USERID) => {
    return instance.patch(`/api/forum/block_user/${USERID}`);
};
export const UpdateProfileUser = (updatedUserData) => {
    return instance.patch('/api/profile/updateprofile', updatedUserData);
};

//api account
export const fetchAccount = async () => {
    const response = await instance.get('/api/listalluser');
    return response.data;
};
export const getALLPlansByProvince = async () => {
    const response = await instance.get('/all_tinh_quyhoach');
    return response.data;
};
export const getAllPlansDetails = async () => {
    const response = await instance.get('/sap_xep_tinh_quan_huyen');
    return response.data;
};
export const getAllPlansDetailsByProvineId = async (id) => {
    const response = await instance.get(`/sap_xep_cac_huyen/${id}`);
    return response.data;
};

// this route can be use to get image and get marker in boudingbox
export const getAllImageInBoundingBox = async (southwest, northeast) => {
    const sLat = southwest.lat.toFixed(6);
    const sLng = southwest.lng.toFixed(6);
    const nLat = northeast.lat.toFixed(6);
    const nLng = northeast.lng.toFixed(6);

    const res = await instance.get(`/get_list_image_bound/${sLng}/${sLat}/${nLng}/${nLat}`);
    return res.data;
};
