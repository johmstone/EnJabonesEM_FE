import ConfigurationService from './configuration'

class CostaRicaServices {

    constructor() {
        this.config = new ConfigurationService();
    }

    async CostaRicaData(Type) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/CostaRica/" + Type;
       
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