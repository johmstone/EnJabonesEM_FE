import ConfigurationService from './configuration'

class OrdersService {

    constructor() {
        this.config = new ConfigurationService();
    }

    async AddStagingOrder(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Orders/StagingOrders/AddNew";
        
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

    async SearchStagingOrder(StagingOrderID) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Orders/StagingOrders/" + StagingOrderID;
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

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

    async AddNewOrder(model) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Orders/AddNew";
        
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

    async OrderDetails(OrderID) {
        let baseURL = this.config.BackEnd_API_BaseURL + "/api/Orders/" + OrderID;
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
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
}

export default OrdersService;