import ConfigurationService from './configuration';

class HelperService {

    constructor() {
        this.config = new ConfigurationService();
    }

    async ExchangeRate() {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        //return await fetch("https://www.paypal.com/smarthelp/currency-conversion?fromCountry=CR&fromPaymentCurrency=CRC&toTransCurrency=USD&tType=FX_ON_SENDER&transAmount=1", requestOptions)
        return await fetch("https://www.bancobcr.com/wps/proxy/http/bcrrestgen-app:24000/rest/api/v1/bcr-informativo/tipo-cambio/obtener/2", requestOptions)
            .then(res => res.json())
            .then(data => { return data; })
            .catch(err => console.log(err));
    }

    // async ExchangeRate() {
    //     var myHeaders = new Headers();

    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         redirect: 'follow'
    //     };

    //     return fetch("https://www.sucursalelectronica.com/exchangerate/showXmlExchangeRate.do", requestOptions)
    //         .then(res => res.text())
    //         .then(data => {
    //             return this.ConvertXMLtoJSON(data).then(result => {return result});
    //         })
    //         .catch(err => console.log(err));
    // }

    // async ConvertXMLtoJSON(data) {
    //     var myHeaders2 = new Headers();
    //     myHeaders2.append("Content-Type", "application/x-www-form-urlencoded");

    //     var urlencoded = new URLSearchParams();
    //     urlencoded.append("forceInNewWindow", "true");
    //     urlencoded.append("xmlString", data);

    //     var requestOptions2 = {
    //         method: 'POST',
    //         headers: myHeaders2,
    //         body: urlencoded,
    //         redirect: 'follow'
    //     };

    //     return fetch("https://www.freeformatter.com/xml-to-json-converter.html", requestOptions2)
    //         .then(response => response.json())
    //         .then(result => {
    //             return result;
    //         })
    //         .catch(err => console.log(err));
    // }
}

export default HelperService;