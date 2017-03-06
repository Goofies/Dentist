<div class="side-modal-wrapper" v-if="modals.sideModal">
	<div class="side-modal-bg" @click="closeAppointmentForm()"></div>
	<form class="appointment-form"  @submit.prevent="addAppointment" v-if="modals.appointmentForm.second">
		<h1 class="form-title">Add Appointment</h1>
		<label class="form-label active" for="patient name">Patient Full Name</label>
		<multiselect
			v-model="appointmentForm.patient"
			:options="patients.list"
			placeholder="Select Patient..."
			label="fullname"
			track-by="id"
		></multiselect>
		<div class="form-group disabled">
			<label class="form-label disabled" for="appointment date">Appointment Date</label>
			<input type="text" class="form-control" v-model="appointmentForm.date" disabled>
		</div>
		<div class="time-group">
			<div class="form-group disabled">
				<label class="form-label disabled" for="starting_at">Starting Time:</label>
				<input 
					class="form-control" 
					type="text" 
					v-model="appointmentForm.startView" 
					disabled>
				<input type="hidden" name="starting_at" class="form-control" v-model="appointmentForm.start" disabled>
			</div>
			<div class="form-group active">
				<label class="form-label active" for="ending_at">Ending Time:</label>
				<span class="end-time-view" 
				@click="appointmentForm.endingArrayDisplay = !appointmentForm.endingArrayDisplay">
					@{{appointmentForm.end | getHM}}
				</span>
				<ul class="end-time-array" :class="{active: appointmentForm.endingArrayDisplay}">
					<li 
						v-for="time in appointmentForm.endingArray" 
						@click="appointmentForm.selectEndingTime(time.ending_at)">
							@{{time.endView}}
					</li>
				</ul>
			</div>
			<div class="form-group disabled">
				<label class="form-label disabled" for="duration">Duration:</label>
				<input type="text" class="form-control" :value="appointmentDuration" disabled>
			</div>
		</div>
		<div class="form-group active">
			<label class="form-label active" for="operation">Operation Name:</label>
			<input type="text" class="form-control" name="operation" v-model="appointmentForm.operation">
		</div>
		<div class="form-group active">
			<label class="form-label active" for="notes">Notes:</label>
			<textarea name="" id="" class="form-control" v-model="appointmentForm.notes"></textarea>
		</div>
		<button-template Blabel="Add Appointment" Bclass="btn-success btn-block"></button-template>
	</form>
	<form class="appointment-form"  @submit.prevent="deleteAppointment" v-if="modals.appointmentForm.edit">
		<h1 class="form-title">Delete Appointment</h1>
		<div class="form-group disabled">
			<label class="form-label disabled" for="patient name">Patient Full Name</label>
			<input type="text" class="form-control" :value="appointmentForm.edit.patient.name+' '+appointmentForm.edit.patient.lastname" disabled>
		</div>
		<div class="form-group disabled">
			<label class="form-label disabled" for="appointment date">Appointment Date</label>
			<input type="text" class="form-control" v-model="appointmentForm.edit.date" disabled>
		</div>
		<div class="time-group disabled">
			<div class="form-group disabled">
				<label class="form-label disabled" for="starting_at">Starting Time:</label>
				<input 
					type="text" 
					class="form-control" 
					v-model="appointmentForm.edit.startView" 
					disabled>
			</div>
			<div class="form-group disabled">
				<label class="form-label disabled" for="ending_at">Ending Time:</label>
				<input 
					type="text" 
					class="form-control" 
					v-model="appointmentForm.edit.endView" 
					disabled>
			</div>
			<div class="form-group disabled">
				<label class="form-label disabled" for="duration">Duration:</label>
				<input type="text" class="form-control" :value="appointmentForm.edit.duration" disabled>
			</div>
		</div>
		<div class="form-group disabled">
			<label class="form-label disabled" for="operation">Operation Name:</label>
			<input type="text" class="form-control" name="operation" placeholder="Operation" v-model="appointmentForm.edit.operation">
		</div>
		<div class="form-group disabled">
			<label class="form-label disabled" for="notes active">Notes:</label>
			<textarea name="" id="" class="form-control" cols="30" rows="10" v-model="appointmentForm.edit.notes"></textarea>
		</div>
		<button-template Blabel="Delete" Bclass="btn-danger btn-block"></button-template>
	</form>
</div>