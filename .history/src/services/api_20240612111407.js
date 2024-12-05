import instance from "../utils/axios-customize";

export const callLogin = (Username, Password) => {
    return instance.post('/api/login',{Username:Username, Password:Password})
}

export const callRegister = (registerUsername, registerFullName, registerPassword, registerGender, registerLatitude, registerLongitude, registeravatarLink, registerEmail, registerLastLoginIP) => {
    return instance.post('/api/register',{
        Username:registerUsername,
        FullName:registerFullName,
        Password:registerPassword,
        Gender:registerGender,
        Latitude:registerLatitude,
        Longitude:registerLongitude,
        avatarLink: registeravatarLink,
        Email:registerEmail,
        LastLoginIP:registerLastLoginIP
      })
}