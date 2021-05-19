import Configuration from './configuration'

class Account {

    constructor() {
        this.config = new Configuration();
    }

    async CheckEmailAvailability(Email) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/CheckEmailAvailability?Email=" + Email;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(baseURL, requestOptions)
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

        return fetch(baseURL, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async ConfirmEmailRequest(email) {

        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/ConfirmEmailRequest?id=" + email;
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(baseURL, requestOptions)
            .then(res => { 
                if(res.status === 200) {
                    return true;
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

    async ConfirmEmail(EVToken) {

        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Account/ConfirmEmail?id=" + EVToken;
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(baseURL, requestOptions)
            .then(res => { 
                let result = {
                    Status: res.status
                }
                return result; 
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

}

export default Account;