import Errors from './Errors'
import Input from './Input'
export default class Form {
    constructor(data) {
        this.display = false;
        this.inputs = {};
        for (let property in data) {
            this.inputs[property] = new Input(property, data[property]);
        } 
        this.errors = new Errors();
    }

    data () {
         let data = {};

            for (let property in this.inputs){
                data[property] = this.inputs[property].value;
            }

         return data
    }

    reset () {
        for (let field in this.inputs){
            this.inputs[field].value = '';
        }
        this.errors.clear();
    }

    post(url) {
        return this.submit('post', url);
    }

    delete(form) {
        return this.submit('delete', url);
    }

    submit (requestType, url) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, this.data())
                .then(response => {
                    this.onSuccess();
                    let patient = response.data;
                    let message = `${patient.name} ${patient.lastname} Saved!`;
                    resolve(message);
                })
                .catch(error => {
                    this.onFail(error.response.data);
                    reject(error.response.data);
                })
        });
    }

    onSuccess(data) {
        this.reset();
    }

    onFail(errors) {
        for (let property in errors) {
            this.inputs[property].error = errors[property][0];
        }
    }
}