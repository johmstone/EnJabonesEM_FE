import ConfigurationService from './configuration'

class AzureServices {

    constructor() {
        this.config = new ConfigurationService();
    }

    async UploadImages(imageInput, fileName) {
        let baseURL = this.config.AzureHostName + "/images/" + fileName + this.config.AzureSASToken;

        var myHeaders = new Headers();
        myHeaders.append("content-type", "image/jpeg");
        myHeaders.append("x-ms-date", new Date().toUTCString());
        myHeaders.append("x-ms-version", "2020-02-10");
        myHeaders.append("x-ms-blob-type", "BlockBlob");
        myHeaders.append("Access-Control-Allow-Origin", "*");

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: imageInput,
            redirect: 'follow'
        };

        return await fetch(baseURL, requestOptions)
            .then(res => {
                if (res.status === 201) {
                    return res;
                }
            })
            .then(json => { return json; })
            .catch(err => console.log(err));
    }

}

export default AzureServices;