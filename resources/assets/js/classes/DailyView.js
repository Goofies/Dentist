function phpDate(date) {
	let month = date.getMonth() + 1;
	return date.getFullYear()+"-"+month+"-"+date.getDate();
}
function checkAppointment(date, appointments) {
	return appointments.find(appointment => {
		let starting_at = new Date(appointment.starting_at);
		let ending_at = new Date(appointment.ending_at);
		return (date >= starting_at && date < ending_at);
	})
}
export default class DailyView {
	constructor() {
		this.date = new Date();
		this.getInfo(this.date);
	}
	getInfo() {
		let date = phpDate(this.date);
		axios.get(`appointments/${date}`)
			.then(response => this.createView(response.data))
			.catch(errors => console.log(errors))
	}
	createView(data) {
		let blockAppointment, checkingStart, checkingEnd, checked, timeInformation, appointmentId;
		let start = 8;
		let end = 22;
		let moment = new Date();
		let mYear = moment.getFullYear();
		let mMonth = moment.getMonth();
		let mDay = moment.getDate();
		let dailyView = [];
		dailyView['appointments'][blockNumber] = [];
		dailyView['date'] = moment;
		let blockNumber = 0;
		let blockLogic = 0;
		for (let b = 0; b < 28; b++){
			checkingStart = new Date(mYear, mMonth, mDay, 8, b * 30, 0);
			checkingEnd = new Date(mYear, mMonth, mDay, 8, (b * 30) + 30, 0);
			checked = checkAppointment(checkingStart, data);
			if (!checked) { // if it's free
				if (blockLogic == 0 || blockLogic == 1) {
					blockLogic = -1;
					if (typeof dailyView['appointments'][blockNumber] == 'undefined') {
						dailyView['appointments'][blockNumber] = [];
						blockAppointment = dailyView['appointments'][blockNumber];
					} else {
						blockNumber++;
						dailyView['appointments'][blockNumber] = [];
						blockAppointment = dailyView['appointments'][blockNumber];
					}
				}
				timeInformation = {
					appointment: '',
					starting_at: checkingStart,
					ending_at: checkingEnd,
					status: 'free',
					class: {
						active: false,
						busy: false
					}
				}
				blockAppointment.push(timeInformation);
			} else { //if it's busy false = true 0 1 
				if (blockLogic == 0 || blockLogic == -1 || checked.id != appointmentId) { //if the patient changed?
					blockLogic = 1;
					if (typeof dailyView['appointments'][blockNumber] == 'undefined') {
						dailyView['appointments'][blockNumber] = [];
						blockAppointment = dailyView['appointments'][blockNumber];
					} else {
						blockNumber++;
						dailyView['appointments'][blockNumber] = [];
						blockAppointment = dailyView['appointments'][blockNumber];
					}
				}
				timeInformation = {
					appointment: checked,
					starting_at: checkingStart,
					ending_at: checkingEnd,
					status: 'busy',
					class: {
						active: false,
						busy: true
					}
				}
				blockAppointment.push(timeInformation);
				appointmentId = (blockAppointment[blockAppointment.length - 1].appointment.id);
			}
		}	
	}
}