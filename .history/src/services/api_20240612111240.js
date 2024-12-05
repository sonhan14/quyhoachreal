import instance from "../utils/axios-customize";

export const callLogin = (Username, Password) => {
    return instance.post('/api/login',{Username, Password})
}

export const callRegister = (Username, FullName, Gender, Latitude, Longitude, avatarLink, Email, LastLoginIP) => {
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