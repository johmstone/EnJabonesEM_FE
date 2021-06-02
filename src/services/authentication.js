import Configuration from './configuration'
import { isExpired } from 'react-jwt';

class AuthenticationService {

    constructor() {
        this.config = new Configuration();
    }

    async GetIP() {
        let baseURL = "https://api.ipify.org?format=json";
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(baseURL, requestOptions)
            .then(res => {
                return res.json();
            })
            .then(result => { return result; })
            .catch(err => console.log(err));
    }

    async Login(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/Login";
        var myHeaders = new Headers();
        let AuthHeader = "Basic " + window.btoa(model.Email + ":" + model.Password);

        myHeaders.append("Authorization", AuthHeader);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("IP", model.IP);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(baseURL, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    let data = {
                        status: res.status,
                        message: res.status === 401 ? 'Contraseña Incorrecta' : 'Usuario no registrado'
                    }
                    return data;
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    isAuthenticated() {
        let CurrentUser = JSON.parse(localStorage.getItem('User'));
        //console.log(CurrentUser);
        if (CurrentUser === null) {
            return false;
        } else if (isExpired(CurrentUser.Token)) {
            return false;
        } else {
            return true;
        }
    }
}

export default AuthenticationService;