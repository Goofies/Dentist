function phpDate(date) {
	let month = date.getMonth() + 1;
	return date.getFullYear()+"-"+month+"-"+date.getDate();
}
export default class MontlyView {
	constructor(date = new Date()) {
		this.date = date;
		this.currentMonth = date.getMonth();
		this.currentYear = date.getFullYear();
		this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		this.monthView = this.months[this.currentMonth];
		this.monthListView = '';
		this.yearListView = '';
		this.boxes = '';
		this.loading = true;
	}
	currentFirstDay() {
		let firstDay = new Date(this.currentYear, this.currentMonth, 1);
		let position = firstDay.getDay();
		if (position == 0) {
			return 7;
		} else {
			return position;
		}
	}
	getView() {
		this.loading = true;
		let queryArray = [];
		let myFirstDay = 1 - this.currentFirstDay();
		for (let i = 1; i <= 42; i++) {
			let push = new Date(this.currentYear, this.currentMonth, myFirstDay + i);
			queryArray.push(phpDate(push));
		}
		axios.post('view/calendarInfo', {
			data: queryArray
		})
		.then(response => {
			let boxes = response.data
			boxes.forEach((box) => {
				box['classes'] = this.defineClass(box.date, box.appointments);
			})
			this.loading = false;
			this.boxes = boxes;
		})
		.catch(error => console.log(error.response.data))		
	}
	previousMonth() {
		if(this.currentMonth == 0 && this.currentYear == 2015) {
			return;
		} else {
			if (this.currentMonth == 0){
				this.currentMonth = 11;
				this.currentYear--;
			} else {
				this.currentMonth--;
			}
			this.monthView = this.months[this.currentMonth];
			this.getView();
		}
	}
	nextMonth() {
		if(this.currentMonth == 11 && this.currentYear == 2024) {
			return;
		} else {
			if (this.currentMonth == 11){
				this.currentMonth = 0;
				this.currentYear++;
			} else {
				this.currentMonth++;
			}
			this.monthView = this.months[this.currentMonth];
			this.getView();
		}
	}
	changeMonth(n) {
		this.currentMonth = n;
		this.monthView = this.months[n];
		this.monthListView = false;
		this.getView();
	}
	changeYear(n) {
		this.currentYear = n;
		this.yearListView = false;
		this.getView();
	}
	openMonths() {
		this.monthListView = !this.monthListView;
		this.yearListView = false;
	}
	openYears() {
		this.monthListView = false;
		this.yearListView = !this.yearListView;
	}
	defineClass(date, appointments) {
		let classes = [];
		let now = new Date();
		let checkDate = new Date(date);
		if (now.getMonth() == checkDate.getMonth() && now.getDate() == checkDate.getDate()) {
			classes.push('today');
		}
		if (checkDate.getMonth() > this.currentMonth && checkDate.getFullYear() == this.currentYear) {
			classes.push('next-month');
		} else if (checkDate.getFullYear() > this.currentYear) {
			classes.push('next-month');
		}
		if (checkDate.getMonth() < this.currentMonth && checkDate.getFullYear() == this.currentYear) {
			classes.push('previous-month');
		} else if (checkDate.getFullYear() < this.currentYear) {
			classes.push('previous-month');
		}
		if (checkDate.getDay() == 0) {
			classes.push('sunday')
		}
		let busyMeter = appointments.length;
		if (busyMeter == 0) {
			classes.push('free');
		} else if (busyMeter <= 2) {
			classes.push('busy-meter-1');
		} else if (busyMeter <= 4) {
			classes.push('busy-meter-2');
		} else if (busyMeter > 4) {
			classes.push('busy-meter-3');
		}
		let someMath = now.getDate();
		someMath = someMath - 1;
		now.setDate(someMath);
		if (checkDate < now) {
			classes.push('disabled');
		}
		return classes;
	}
}