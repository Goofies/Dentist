function pad(n){
    return (n<10) ? '0' + n.toString() : n.toString();
}
function phpDate(date){
    let month = date.getMonth() + 1
    return date.getFullYear()+"-"+month+"-"+date.getDate();
}
function checkAppointment(date, appointments) {
	return appointments.find(appointment => {
		let starting_at = new Date(appointment.starting_at);
		let ending_at = new Date(appointment.ending_at);
		return (date >= starting_at && date < ending_at);
	})
}
export default class WeeklyView{
	constructor(date = new Date()) {
		this.date = date;
		this.data = '';
		this.workingTimes = '';
		this.loading = true;
		this.createWorkingTimes();
		this.clicked = '';
	}
	createWorkingTimes() {
		let hourS, minuteS, hourE, minuteE, row;
		this.workingTimes = [];
		let workingPeriod = {start: 8, end: 22}
		while (workingPeriod.start < workingPeriod.end) {
			hourS = pad(workingPeriod.start);
			row = hourS + ":00 - " + hourS + ":30";
			this.workingTimes.push(row);
			workingPeriod.start++;
			hourE = pad(workingPeriod.start);
			row = hourS + ":30 - " + hourE + ":00";
			this.workingTimes.push(row); 
		}
	}
	createVariables() {
		let day = this.date.getDay(); // 3 
		let dayDate = this.date.getDate(); // 8
		if (day == 0) {
			let someMath = dayDate - day - 6; // 6
			this.date.setDate(someMath); // 6  
		} else {
			let someMath = dayDate - day + 1; // 6 
			this.date.setDate(someMath); // 6 
		}
		this.currentMonth = this.date.getMonth();
		this.currentYear = this.date.getFullYear();
		this.currentDay = this.date.getDate();
		this.dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	}
	displayView(date = this.date) {
		this.loading = true;
		this.date = new Date(date);
		this.createVariables();
		let querryArray = [];
		for (let i = 0; i < 7; i++) {
			let singleDate = new Date(this.currentYear, this.currentMonth, this.currentDay + i);
			singleDate = phpDate(singleDate);
			querryArray.push(singleDate);
		}
		axios.post('view/calendarInfo', {
			data: querryArray
		})
		.then(response => this.createView(response.data))
		.catch(error => console.log(error))
	}
	createView(data) {
		console.log(data);
		let weeklyInformation = [];
		let singleDate, blockLogic, blockAppointment, blockNumber, timeInformation, checkingStart, checkingEnd, checked, appointments, appointmentId;
		for (let a = 0; a < 7; a++) {
			singleDate = new Date(this.currentYear, this.currentMonth, this.currentDay + a, 8, 0, 0);
			blockNumber = 0;
			blockLogic = 0;
			weeklyInformation[a] = {};
			weeklyInformation[a]['blocks'] = [];
			weeklyInformation[a]['date'] = phpDate(singleDate);
			weeklyInformation[a]['dayName'] = this.dayNames[a];
			appointments = data[a]['appointments'];
			if (appointments == '') {
				//if we dont have any appointments
				weeklyInformation[a]['blocks'][blockNumber] = [];
				blockAppointment = weeklyInformation[a]['blocks'][blockNumber];
				for (let b = 0; b < 28; b++) {
					checkingStart = new Date(this.currentYear, this.currentMonth, this.currentDay + a, 8, b * 30, 0);
					checkingEnd = new Date(this.currentYear, this.currentMonth, this.currentDay + a, 8, (b * 30) + 30, 0);
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
				}
			} else {
				//if we have any appointment
				for (let b = 0; b < 28; b++){
					checkingStart = new Date(this.currentYear, this.currentMonth, this.currentDay + a, 8, b * 30, 0);
					checkingEnd = new Date(this.currentYear, this.currentMonth, this.currentDay + a, 8, (b * 30) + 30, 0);
					checked = checkAppointment(checkingStart, appointments);
					if (!checked) { // if it's free
						if (blockLogic == 0 || blockLogic == 1) {
							blockLogic = -1;
							if (typeof weeklyInformation[a]['blocks'][blockNumber] == 'undefined') {
								weeklyInformation[a]['blocks'][blockNumber] = [];
								blockAppointment = weeklyInformation[a]['blocks'][blockNumber];
							} else {
								blockNumber++;
								weeklyInformation[a]['blocks'][blockNumber] = [];
								blockAppointment = weeklyInformation[a]['blocks'][blockNumber];
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
							if (typeof weeklyInformation[a]['blocks'][blockNumber] == 'undefined') {
								weeklyInformation[a]['blocks'][blockNumber] = [];
								blockAppointment = weeklyInformation[a]['blocks'][blockNumber];
							} else {
								blockNumber++;
								weeklyInformation[a]['blocks'][blockNumber] = [];
								blockAppointment = weeklyInformation[a]['blocks'][blockNumber];
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
		this.data = weeklyInformation;
		this.loading = false;
	}
	nextWeek() {
		let date = this.date.getDate();
		let someMath = date + 7;
		this.date.setDate(someMath);
		this.clicked = '';
		this.displayView();
	}
	previousWeek() {
		let date = this.date.getDate();
		let someMath = date - 7;
		this.date.setDate(someMath);
		this.clicked = '';
		this.displayView();
	}
	checkClicked(date) {
		date = new Date(date);
		date = date.getDay();
		if (date === this.clicked) {
			return true;
		} else {
			return false;
		}
	}
}