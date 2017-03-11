require('./bootstrap');

import Input from './classes/Input';
import inputTemplate from "./components/inputTemplate";
import buttonTemplate from "./components/buttonTemplate";

var singIn = new Vue({
	el: '#signIn',
	components: {
		inputTemplate,
		buttonTemplate
	},
	data() {
		return {
			loginInputs: {
				email: new Input('Email', 'email'),
				password: new Input('Password', 'password')
			},
			registerInputs: {
				name: new Input('Name'),
				email: new Input('Email', 'email'),
				password: new Input('Password', 'password'),
				password_confirmation: new Input('Confirm Your Password', 'password', 'password_confirmation')
			},
			resetPassword: {
				email: new Input('Email', 'email')
			}
		}
	}
})