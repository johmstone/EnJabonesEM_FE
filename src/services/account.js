import Configuration from './configuration'

class AccountService {

    constructor() {
        this.config = new Configuration();
    }

    async CheckEmailAvailability(Email) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/CheckEmailAvailability";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(Email),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async Register(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/Register";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(model),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async ConfirmEmailRequest(email) {

        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/ConfirmEmailRequest";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(email),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => { 
                if(res.status === 200) {
                    return true;
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async ConfirmEmail(EVToken) {

        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/ConfirmEmail";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(EVToken),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => { 
                let result = {
                    Status: res.status
                }
                return result; 
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async ForgotPassword(Email) {

        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/ForgotPassword";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(Email),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => { 
                let result = {
                    Status: res.status
                }
                return result; 
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async CheckGUID(GUID) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/CheckGUID";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(GUID),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => { 
                if(res.status === 200) {
                    return res.json();
                }                
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async ResetPassword(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/ResetPassword";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(model),
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => { 
                if(res.status === 200) {
                    return res.json();
                }                
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

}

export default AccountService;