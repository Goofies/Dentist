import Input from './Input'
export default class PatientHistory {
	constructor(patient) {
		this.loading = {
			notes: true,
			timeLine: true
		};
		this.patient = patient;
		this.notes = '';
		this.newNote = new Input('New Note', 'textarea');
		this.getNotes();
		this.timeLine = '';
		this.getTimeLine();
		this.payments = [];
		this.paymentData = {
			amount: '',
			type: 1
		};
	}
	getNotes() {
		this.loading.notes = true;
		axios.get(`notes/${this.patient.id}`) 
			.then(response => {
				this.notes = response.data;
				this.loading.notes = false;
			})
			.catch(error => console.log(error.data))
	}
	updateNote(id, body) {
		return new Promise((resolve, reject) => {
			axios.put('/notes/update', {id: id, body: body})
				.then(response => resolve('Updated!'))
				.catch(error => console.log(error.data))
		})
	}
	addNote() {
		let body = this.newNote.value;
		let patient_id = this.patient.id;
		return new Promise((resolve, reject) => {
			axios.post('/notes/store', {
				body: body, 
				patient_id: patient_id
			})
				.then(response => {
					resolve('Note Added!');
					this.getNotes();
					this.newNote.value = "";
				})
				.catch(error => reject('Try Again'))
		})
	}
	deleteNote(note) {
		return new Promise((resolve, reject) => {
		    axios.delete(`notes/${note.id}/destroy`)
			    .then(response => {
			    	this.getNotes();
			    	resolve('Note Deleted')
			    })
			    .catch(error => reject(error))
		})
	}
	getTimeLine() {
		this.loading.timeLine = true;
		axios.get(`patients/timeline/${this.patient.id}`)
			.then(response => {
				this.orderTimeLine(response.data);
				this.payments = response.data.payments;
			})
			.catch(error => console.log(error.data))
	}
	orderTimeLine(data) {
		let timeLine = data.appointments.concat(data.payments);
		timeLine.sort((a,b) => {
			if(a.starting_at) {
				a= new Date(a.starting_at);
			} else {
				a = new Date(a.created_at);
			}
			if(b.starting_at) {
				b= new Date(b.starting_at);
			} else {
				b = new Date(b.created_at);
			}
			return b-a;
		})
		this.createLabels(timeLine);
	}
	createLabels(data) {
		data.forEach(item => {
			if(item.starting_at) {
				if(item.operation_name) {
					item.label = item.operation_name;
				} else {
					item.label = 'Appointment';
				}
			} else {
				if(item.amount > 0) {
					item.label = 'Paid'
				} else {
					item.label = 'Owns'
				}
			}
		})
		this.timeLine = data;
		this.loading.timeLine = false;
	}
	getTotal() {
		let total = 0;
		this.payments.forEach(payment => {
			total += payment.amount;
		})
		total = Math.abs(total);
		return total;
	}
	payIt() {
		return new Promise((resolve, reject) => {
			let amount;
			if (this.paymentData.type == 1 && this.paymentData.amount) {
				amount = -1 * this.paymentData.amount;
			} else {
				if(this.paymentData.amount > this.getTotal()) {
					reject('You put a lot there!')
				} else {
					amount = this.paymentData.amount;
				}
			}
			axios.post('payments/store', {
				patient_id: this.patient.id,
				amount: amount
			})
				.then(response => {
					this.paymentData.amount = '';
					this.getTimeLine();
					resolve('Done!');
				})
				.catch(error => {
					let errors = error.response.data;
					let message = '';
					for (let property in errors) {
						message += errors[property][0];
					}
					reject(message);
				})
		})
	}
	deleteEvent(event) {
		return new Promise((resolve, reject) => {
			if(event.starting_at) {
			    axios.delete(`appointments/${event.id}/destroy`)
				    .then(response => {
				    	this.getTimeLine();
				    	resolve('Appointment Deleted')
				    })
				    .catch(error => reject(error))
			} else {
			    axios.delete(`payments/${event.id}/destroy`)
				    .then(response => {
				    	this.getTimeLine();
				    	resolve('Payment Deleted')
				    })
				    .catch(error => reject(error))
			}
		})
	}
}