import Configuration from './configuration'

class WebDirectory {

    constructor() {
        this.config = new Configuration();
    }

    async Menu(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/WebDirectory/Menu";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

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

export default WebDirectory;