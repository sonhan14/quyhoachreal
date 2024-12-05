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