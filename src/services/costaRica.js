import ConfigurationService from './configuration'

class CostaRicaServices {

    constructor() {
        this.config = new ConfigurationService();
    }

    async Provinces() {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/CostaRica/Provinces";
       
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");       

        var requestOptions = {
            method: 'GET',
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
    
    async Cantons(ProvinceID) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/CostaRica/Provinces/" + ProvinceID;
       
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");       

        var requestOptions = {
            method: 'GET',
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

    async Districts(ProvinceID,CantonID) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/CostaRica/Provinces/" + ProvinceID + "/Canton/" + CantonID;
       
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");       

        var requestOptions = {
            method: 'GET',
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

export default CostaRicaServices;