import ConfigurationService from './configuration'

class PropertiesService {

    constructor() {
        this.config = new ConfigurationService();
    }

    async List() {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Properties";
        let User = JSON.parse(localStorage.getItem('User'));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + User.Token);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
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

    async Disable(PrimaryProductID) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Properties/Update/" + PrimaryProductID;
        let User = JSON.parse(localStorage.getItem('User'));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + User.Token);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
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
}

export default PropertiesService;