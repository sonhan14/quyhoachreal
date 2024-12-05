import instance from "../utils/axios-customize";

export const callLogin = (userName, password) => {
    return instance.post('/api/login',
    {
        Username:userName, 
        Password:password
    })
}

// export const callRegister = (registerUsername, registerFullName, registerPassword, registerGender, registerLatitude, registerLongitude, registeravatarLink, registerEmail, registerLastLoginIP) => {
//     return instance.post('/api/register',
//     {
//         Username:registerUsername,
//         FullName:registerFullName,
//         Password:registerPassword,
//         Gender:registerGender,
//         Latitude:registerLatitude,
//         Longitude:registerLongitude,
//         avatarLink: registeravatarLink,
//         Email:registerEmail,
//         LastLoginIP:registerLastLoginIP
//     })
// }

export const callRegister = (registerUsername, registerFullName, registerPassword, registerGender, registerLatitude, registerLongitude, registeravatarLink, registerEmail, registerLastLoginIP) => {
    const payload = {
        Username:registerUsername,
        FullName:registerFullName,
        Password:registerPassword,
        Gender:registerGender,
        Latitude:registerLatitude,
        Longitude:registerLongitude,
        avatarLink: registeravatarLink,
        Email:registerEmail,
        LastLoginIP:registerLastLoginIP
    };

    console.log('Payload:', payload);

    return instance.post('/api/register', payload)
        .then(response => response.data)
        .catch(error => {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
            }
            throw error;
        });
};

export const callLogout = () => {
    return instance.post('/api/logout')
}

// export const logoutUser = async () => {
//     try {
//         await instance.post('/api/logout');
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         console.log('Logout successful');
//     } catch (error) {
//         console.error('Logout error:', error);
//         if (error.response) {
//             console.error('Response error:', error.response.data);
//         } else if (error.request) {
//             console.error('Request error:', error.request);
//         } else {
//             console.error('Error:', error.message);
//         }
//         throw error;
//     }
// };

export const callRefeshToken = () => {
    return instance.post('/refresh_token')
}

export const callforgotPassword = (email) => {
    return instance.post('/api/forgotPassword',
    {
        Email:email, 

    })
}



export const searchQueryAPI = (query) => {
    return instance.get(`/api/zonings/view?name=${encodeURIComponent(query)}`);
}


export const ViewlistBox = () => {
    return instance.get(`/api/box/viewlist_box`);
}

export const ViewlistPost = () => {
    return instance.get(`/api/forum/view_allpost`);
}

export const UpdateBox = (BoxID, BoxName, Description, avatarLink) => {
    return instance.patch(`/api/box/update_box/${BoxID}`,{BoxName, Description, avatarLink});
}

export const CreateBox = (BoxName, Description, avatarLink) => {
    return instance.post('/api/box/add_box',{BoxName, Description, avatarLink});
}

// export const callCreateUser = (fullName, email, password, phone) => {
//     return axios.post('/api/v1/user',{fullName, email, password, phone})
// }
export const ViewlistGroup = (BoxID) => {
    return instance.get(`/api/group/all_group/${BoxID}`);
}

export const CreateGroup = ( BoxID, GroupName, avatarLink) => {
    return instance.post(`/api/group/add_group/`,{BoxID, GroupName, avatarLink});
}

export const UpdateGroup = (GroupID, GroupName) => {
    return instance.patch(`/api/group/update_group/${GroupID}`,{GroupName});
}