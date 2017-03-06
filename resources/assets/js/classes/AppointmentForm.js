function pad(n){
    return (n<10) ? '0' + n.toString() : n.toString();
}
function getHM(time) {
	time = new Date(time);
	let hour = pad(time.getHours());
	let minutes = pad(time.getMinutes());
	return hour+":"+minutes;
}
export default class AppointmentForm {
	constructor(){
		this.date = '';
		this.start = '';
		this.end = '';
		this.endingArray = '';
		this.endingArrayDisplay = '',
		this.patient = '';
		this.operation = '';
		this.notes = '';
	}
	firstStep(date, timestart, cellindex, blockInformation) {
		this.date = date;
		this.start = timestart;
		this.startView = getHM(timestart);
		this.createEndingArray(cellindex, blockInformation);
	}
	secondStep(timeend) {
		this.end = timeend;
	}
	createEndingArray(cellindex, blockInformation) {
		this.endingArray = [];
		for (let i = cellindex; i < blockInformation.length; i++) {
			blockInformation[i]['endView'] = getHM(blockInformation[i]['ending_at']);
			this.endingArray.push(blockInformation[i]);
		}
	}
	clear() {
		if (this.endingArray) {
			let activeOne = this.endingArray.find(item => item.class.active == true);
			if (activeOne) {
				activeOne.class.active = false;
			}
		}
	}
	addAppointment(){
        return new Promise ((resolve,reject) => {
		    axios.post('appointments/store',{
		        patient_id: this.patient.id,
		        date: this.date,
		        starting_at: this.start.getTime(),
		        ending_at: this.end.getTime(),
		        operation_name: this.operation,
		        note: this.notes
		    })
		    .then(response => resolve('Appointment Saved'))
		    .catch(error => console.log(error))
        })
	}
	selectEndingTime(time) {
		this.end = time;
		this.endingArrayDisplay = false;
	}
	editForm(appointment) {
		this.edit = appointment;
		this.edit.startView = getHM(appointment.starting_at);
		this.edit.endView = getHM(appointment.ending_at);
        let duration = new Date(appointment.ending_at).getTime() - new Date(appointment.starting_at).getTime(); // "date".getTime() - "date".getTime()
        let durationHour = pad(Math.floor(duration/1000/60/60));
        let durationMinute = pad(duration/1000/60 % 60);
        this.edit.duration = durationHour+":"+durationMinute;
	}
	deleteAppointment() {
		return new Promise ((resolve,reject) => {
		    axios.delete(`appointments/${this.edit.id}/destroy`)
			    .then(response => resolve('Appointment Deleted'))
			    .catch(error => console.log(error))
        })
	}
}