<template>
	<div class="daily-view">
		<div class="daily-header">
			<div class="text-wrapper">{{now | headerTime}} - {{upcoming}}</div>
		</div>
		<div class="daily-body">
			<div class="caret" :style="{top: caretPosition + '%'}"></div>
			<ul class="appointments">
				<li 
				class="appointment" 
				:class="{active: check(appointment)}"
				v-for="appointment in appointments" 
				:style="position(appointment)"> <!-- :style="{top: 10%, height:20%}" -->
					<div class="row">
						<div class="col-md-3 column-time">
							<div class="appointment-time">{{appointment.starting_at | getHM}} - {{appointment.ending_at | getHM}}</div>
						</div>
						<div class="col-md-9 column-info">
							<div class="patient-name">{{appointment.patient.name}} {{appointment.patient.lastname}}</div>
							<div class="operation-name">{{appointment.operation_name}}</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	function pad(n){
	    return (n<10) ? '0' + n.toString() : n.toString();
	}
	function phpDate(date){
	    let month = date.getMonth() + 1
	    return date.getFullYear()+"-"+month+"-"+date.getDate();
	}
	export default {
		data() {
			return {
				days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				appointments: '',
				now: new Date(),
				workingTimes: {
					start: 8,
					end: 22
				}
			}
		},
		computed: {
			workingDuration() {
				return (this.workingTimes.end - this.workingTimes.start)*60*60*1000;
			},
			todayStartTime() {
				let start = new Date();
				start.setHours(this.workingTimes.start);
				start.setMinutes(0);
				start.setSeconds(0);
				return start;
			},
			caretPosition() {
				return (((this.now - this.todayStartTime)/this.workingDuration)*100).toFixed(2);
			},
			upcoming() {/*
				let closest = this.appointments[0];
				this.appointments.forEach(appointment => {
					if(this.now - appointment.starting_at) {

					}
				})*/
			}
		},
		methods: {
			getAppointments() {
				let date = phpDate(new Date());
				axios.get(`appointments/${date}`)
					.then(response => this.appointments = response.data)
					.catch(error => console.log(error.data))
			},
			position(appointment) {
				let style = {};
				let start = new Date(appointment.starting_at);
				let end = new Date(appointment.ending_at);
				style.top = (((start - this.todayStartTime)/this.workingDuration)*100).toFixed(2) + '%';
				style.height = (((end - start)/this.workingDuration)*100).toFixed(2) + '%';
				return style;
			},
			check(appointment) {
				let start = new Date(appointment.starting_at);
				let end = new Date(appointment.ending_at);
				if (this.now >= start && this.now <= end) {
					return true;
				} else {
					return false;
				}
			},
			timer() {
				setInterval(() => {
					this.now = new Date();
				},1000)
			}
		},
		filters: {
			getHM(time) {
				time = new Date(time);
	            let hour = pad(time.getHours());
	            let minutes = pad(time.getMinutes());
	            return hour+":"+minutes;
			},
			headerTime(time) {
				let days= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				time = new Date(time);
	            let hour = pad(time.getHours());
	            let minutes = pad(time.getMinutes());
	            let dayName = time.getDay();
	            dayName = days[dayName].toUpperCase();
	            return `${dayName} ${hour}:${minutes}`
			}
		},
		mounted() {
			this.getAppointments();
			this.timer();
		}
	}
</script>

<style lang="sass" scoped>
	@import 'variables.sass'
	.daily-view
		display: flex
		height: 80vh
		.daily-header
			position: relative
			width: 40px
			background-color: $t500
			overflow: hidden
			display: flex
			justify-content: center
			align-items: center
			box-shadow: 0px 1px 10px 0px black
			.text-wrapper
				position: absolute
				width: 80vh
				height: 40px
				left: 0
				font-size: 24px
				padding-left: 40px
				transform: translateX(-48%) rotate(90deg)
				color: $b50
		.daily-body
			position: relative
			overflow: hidden
			flex: 1
			.caret
				position: absolute
				top: 0%
				transform: translateY(-50%)
				left: 0px
				height: 0px
				width: 0px
				transition: 400ms ease-in-out
				border-top: 30px solid transparent
				border-bottom: 30px solid transparent
				border-left: 20px solid $t500
				z-index: 10
			.appointments
				.appointment
					position: absolute
					width: 100%
					overflow: auto
					.column-time
						.appointment-time
							margin-right: 20px
							margin-left: 20px
					.column-info
						.patient-name
						.operation-name
							font-size: 12px
</style>