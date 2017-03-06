<div class="box-wrapper">
	<div class="monthly-loader" :class="{active: monthly.loading}"><img src="/img/loading-icon.png" alt=""></div>
	<div class="dayBox" v-for="dayBox in monthly.boxes" :class="dayBox.classes" @click="displayModal(dayBox.date)">
		<span class="date">@{{dayBox.date | calendarDate}}</span>
		<ul class="patient-list">
			<li v-for="appointment in dayBox.appointments">@{{appointment.patient.name+" "+appointment.patient.lastname.charAt(0)+"."}}</li>
		</ul>
	</div>
</div>	