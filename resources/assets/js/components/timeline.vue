<template>
	<div class="timeline-wrapper">
		<span class="timeline">
			<span class="time-bubble-wrapper" :style="{left: clockPosition + '%'}">
				<span class="time-bubble">
					<i class="material-icons">&#xE855;</i>
				</span>
			</span>
			<span class="time-dot day-start">
				<span class="moment">
					{{startingTime | getHM}}
				</span>
			</span>
			<span class="appointment" v-for="appointment in appointments" :style="appointmentPosition(appointment)" :class="statusCheck(appointment)">
				<span class="starting-at">
					<span class="moment">
						{{appointment.starting_at | getHM}}
					</span>
				</span>
				<span class="bubble-wrapper">
					<span class="patient-bubble" @click="noteWindow.display=appointment.id">
						<span class="patient-name">
							{{appointment.patient.name | getFirstLetter}}
						</span>
					</span>
					<div class="patient-info" v-if="displayAppointment(appointment)">
						<span class="info-close" @click="noteWindow.display=false"><i class="material-icons">&#xE14A;</i></span>
						<div class="info-header">
							<span class="info-name">{{appointment.patient.name}}  {{appointment.patient.lastname}}</span>
							<span class="info-operation" v-if="appointment.operation_name">{{appointment.operation_name}}</span>
						</div>
						<div class="info-body">
							<div class="note-date"><span>17 Feb</span></div>
							<div class="info-note">
								<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
							</div>	
						</div>
						<div class="info-new-note">
						<form action="">
							<input-template :data="noteWindow.note"></input-template>
							<button-template Blabel="Add Note" Bclass="btn-success btn-block"></button-template>
						</form>
						</div>
					</div>
				</span>
				<span class="ending-at">
					<span class="moment">
						{{appointment.ending_at | getHM}}
					</span>
				</span>
			</span>
			<span class="time-dot day-end">
				<span class="moment">
					{{endingTime | getHM}}
				</span>
			</span>
		</span>
	</div>
</template>
<script>
import Input from '../classes/Input'
import inputTemplate from '../components/inputTemplate'
import buttonTemplate from '../components/buttonTemplate'
	function pad(n){
	    return (n<10) ? '0' + n.toString() : n.toString();
	}
	function phpDate(date){
	    let month = date.getMonth() + 1
	    return date.getFullYear()+"-"+month+"-"+date.getDate();
	}
	export default {
		components: {
			inputTemplate,
			buttonTemplate
		},
		data() {
			return {
				noteWindow: {
					display: 0,
					note: new Input('New Note', 'textarea')
				},
				now: new Date(),
				appointments: [],
				workingTimes : {
					dayStart: 8, 
					dayEnd: 22
				},
				style: {
					width: '',
					left: ''
				}
			}
		},
		computed: {
			startingTime() {
				let start = new Date();
				start.setHours(this.workingTimes.dayStart);
				start.setMinutes(0);
				start.setSeconds(0);
				return start;
			},
			endingTime() {
				let end = new Date();
				end.setHours(this.workingTimes.dayEnd);
				end.setMinutes(0);
				end.setSeconds(0);
				return end;
			},
			timelineLength() {
				return this.endingTime - this.startingTime;
			},
			clockPosition() {
				return (((this.now - this.startingTime) / this.timelineLength)*100).toFixed(2);
			}
		},
		methods: {
			timer() {
				setInterval(() => {
					this.now = new Date();
				},1000)
			},
			getAppointments() {
				let date = phpDate(new Date());
				axios.get(`appointments/${date}`)
					.then(response => this.appointments = response.data)
					.catch(error => console.log(error.data))
			},
			appointmentDuration(appointment) {
				let start = new Date(appointment.starting_at);
				let end = new Date(appointment.ending_at);
				return end - start;
			},
			appointmentPosition(appointment) {
				let style = {};
				let start = new Date(appointment.starting_at);
				style.width = ((this.appointmentDuration(appointment) / this.timelineLength)*100).toFixed(2) + "%";
				style.left = (((start - this.startingTime) / this.timelineLength)*100).toFixed(2) + "%";
				return style;
			},
			displayAppointment(appointment) {
				if (appointment.id == this.noteWindow.display) {
					return true;
				} else {
					return false;
				}
			},
			statusCheck(appointment) {
				let start = new Date(appointment.starting_at);
				let end = new Date(appointment.ending_at);
				if (this.now >= start && this.now <= end) {
					return "active";
				} else if (this.now < start){
					return "upcoming";
				} else {
					return "completed";
				}
			},
			getNotes() {
				axios.get(`notes/${id}`)
					.then(response => this.notes = response.data)
					.catch(error => console.log(error.data))
			}
		},
		filters: {
			getHM(time) {
				time = new Date(time);
				let hours = pad(time.getHours());
				let minutes = pad(time.getMinutes());
				return hours+":"+minutes;
			},
			getFirstLetter(name) {
				return name.substr(0, 1)+".";
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
	.timeline-wrapper
		display: flex
		justify-content: center
		align-items: center
		position: relative
		margin: 40px 40px
		z-index: 5
		.timeline
			display: flex
			justify-content: center
			align-items: center
			width: 100%
			border: 2px dashed $t500
			.time-bubble-wrapper
				display: flex
				justify-content: center
				align-items: center
				position: absolute
				top: 12px
				transform-origin: 50% -10px
				left: 0%
				transform: translateX(-50%)
				z-index: 1
				.time-bubble
					display: flex
					justify-content: center
					align-items: center
					height: 40px
					width: 40px
					position: relative
					border: 1px solid $b800
					background: $b500
					color: $b50
					border-radius: 0% 50% 50% 50%
					transform: rotate(45deg)
					.material-icons
						transform: rotate(-45deg)
			.day-start, .day-end
				display: flex
				justify-content: center
				align-items: center
				position: absolute
				left: 0
				transform: translateX(-50%)
				height: 10px
				width: 10px
				border-radius: 50%
				background: $b50
				border: 3px solid $t500
			.day-end
				left: 100%
			.time-dot 
				.moment
					position: absolute
					bottom: 100%
			.appointment
				display: flex
				justify-content: center
				align-items: center
				position: absolute
				left: 30%
				border: 2px solid $t500
				.starting-at, .ending-at
					display: flex
					justify-content: center
					align-items: center
					position: absolute
					left: 0
					transform: translateX(-50%)
					height: 10px
					width: 10px
					border-radius: 50%
					background: $b50
					border: 3px solid $t500
					.moment
						position: absolute
						bottom: 100%
				.ending-at
					left: 100%
				.bubble-wrapper
					display: flex
					justify-content: center
					align-items: center
					position: absolute
					top: 10px
					transform-origin: 50% -10px
					left: 0%
					transform: translateX(-50%)
					z-index: 1
					.patient-bubble
						display: flex
						justify-content: center
						align-items: center
						height: 40px
						width: 40px
						position: relative
						border: 1px solid $t500
						background: $t50
						border-radius: 0% 50% 50% 50%
						transform: rotate(45deg)
						transition: 300ms ease-in-out
						&:hover
							cursor: pointer
							background: $t500
							color: $b50
						.patient-name
							font-size: 24px
							font-weight: bold
							transform: rotate(-45deg)
					.patient-info
						position: absolute
						width: 300px
						background: $t100
						left: 120%
						top: 20%
						border-radius: 5px
						.info-close
							position: absolute
							left: 100%
							color: $b500
							transition: 300ms ease-in-out
							&:hover
								cursor: pointer
								color: $t500
						.info-header
							display: flex
							justify-content: space-between
							align-items: center
							background: $t500
							border-radius: 5px 5px 0px 0px
							padding: 2px 5px
							color: $b50
							.info-name
								font-weight: bold
							.info-operation
								font-size: 12px
								font-weight: lighter
								font-style: italic
						.info-body
							.note-date
								display: flex
								align-items: center
								justify-content: center
								position: relative
								span
									background-color: $t100
									z-index: 2
									padding: 0px 10px
									font-size: 14px
									font-weight: lighter
									font-style: italic
								&:before
									content: ''
									position: absolute
									height: 1px
									border-bottom: 1px solid $b500
									left: 0
									right: 0
							.info-note
								border-bottom: 1px solid $b500
								padding: 0px 4px 7px
						.info-new-note

</style>