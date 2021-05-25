import ConfigurationService from './configuration'

class RolesService {

    constructor() {
        this.config = new ConfigurationService();
    }

    async List() {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Roles";
        let User = JSON.parse(localStorage.getItem('User'));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + User.Token);

        var requestOptions = {
            method: 'POST',
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

    async AddNew(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Roles/AddNew";
        let User = JSON.parse(localStorage.getItem('User'));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + User.Token);

        var raw = JSON.stringify(model);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
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

    async Rights(Role) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Roles/Rights?id=" + Role;
        let User = JSON.parse(localStorage.getItem('User'));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + User.Token);

        var requestOptions = {
            method: 'POST',
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

    async UpdateRight(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Roles/UpdateRight";
        let User = JSON.parse(localStorage.getItem('User'));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + User.Token);

        var raw = JSON.stringify(model);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
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
}

export default RolesService;