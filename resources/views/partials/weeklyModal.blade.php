<div class="my-modal" v-if="modals.main.display">
	<div class="my-modal-bg" @click="closeModal()"></div>
	<div class="my-modal-wrapper" v-if="modals.main.weekly">
		<div class="weekly-loader" :class="{active: weekly.loading}"><img src="/img/loading-icon.png" alt=""></div>
		<i class="material-icons previous-week" @click="weekly.previousWeek()">&#xE314;</i>
		<i class="material-icons next-week" @click="weekly.nextWeek()">&#xE315;</i>
		<div class="my-modal-header">
			<div class="logo">
				<img src="/img/tooth.png" alt="">
			</div>
			<div class="day-headers">
				<div class="day-header" v-for="day in weekly.data">
					<div class="day-date">@{{day.date | weeklyDateFilter}}</div>
					<div class="day-title" :class="{clicked: weekly.checkClicked(day.date)}">@{{day.dayName}}</div>
				</div>
			</div>
		</div>
		<div class="my-modal-body">
			<div class="weekly-view">
				<div class="week-days">
					<ul class="day-times">
						<li v-for="times in weekly.workingTimes">@{{times}}</li>
					</ul>
				</div>
				<div class="week-days" v-for="(day, dayindex) in weekly.data">
					<ul class="day-times">
						<ul v-for="(block, blockindex) in day.blocks"> 
							<li v-for="(time, cellindex) in block" 
								:class="{active: time.class.active, busy: time.class.busy}" 
								@click="createAppointmentForm(day.date, time.starting_at, time.ending_at, dayindex, blockindex, cellindex,
								time.appointment)">
									@{{time.appointment.patient ? (cellindex == 0 ? time.appointment.patient.name : "") : ""}}
							</li> 
						</ul>
					</ul>
				</div>
			</div>
		</div>
		<div class="my-modal-footer">
		</div>
	</div>
	<div class="my-profile-wrapper" v-if="modals.main.profile">
		<div class="header-section">
			<div class="profile-image">
				<img :src="profile.patient.gravatar" alt="">
			</div>
			<div class="patient-information">
				<div class="button-group" v-if="profile.edit">
					<div class="accept-button" @click="updateProfile()"><i class="material-icons">&#xE5CA;</i></div>
					<div class="cancel-button" @click="profile.cancelEdit()"><i class="material-icons">&#xE5CD;</i></div>
				</div>
				<div class="edit-button" v-else>
					<i class="material-icons" @click="profile.editProfile()">&#xE3C9;</i>
				</div>
				<div class="row">
					<div class="column-full-name" :class="{active: profile.edit}" >
						<div class="delete-patient">
							<i class="material-icons" @click="deletePatient(profile.patient)" v-if="profile.edit">&#xE87C;</i>
						</div>
						<div>
							<input type="text" :size="profile.inputLength(profile.data.name)" v-model="profile.data.name" :disabled="!profile.edit">
						</div>
						<div>
							<input type="text" :size="profile.inputLength(profile.data.lastname)" v-model="profile.data.lastname" :disabled="!profile.edit">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="column" :class="{active: profile.edit}" >
						<span class="title">Mobile: </span>
						<input type="text" v-model="profile.data.mobilephone" :disabled="!profile.edit">
					</div>
					<div class="column" :class="{active: profile.edit}">
					<span class="title">Home: </span>
						<input type="text" v-model="profile.data.phone" :disabled="!profile.edit">
					</div>
				</div>
				<div class="row">
					<div class="column" :class="{active: profile.edit}">
						<span class="title">Email: </span>
						<input type="text" v-model="profile.data.email" :disabled="!profile.edit">
					</div>
					<div class="column" :class="{active: profile.edit}">
						<span class="title">Address: </span>
						<input type="text" v-model="profile.data.address" :disabled="!profile.edit">
					</div>
				</div>
			</div>
		</div>
		<div class="body-section">
			<div class="row">
				<div class="col-md-6">
					<h3 class="body-title">Notes</h3>
					<div class="notes">
						<div class="history-loader" :class="{active: profile.history.loading.notes}"><img src="/img/loading-icon.png" alt=""></div>
						<div class="note" v-for="note in profile.history.notes">
							<div class="panel-header">
								<span class="date">@{{note.created_at | fullDate}}</span>
								<i class="material-icons" @click="deleteNote(note)" v-if="profile.edit">&#xE92B;</i> <!-- ass tray -->
							</div>
							<div class="panel-body">
								<textarea v-model="note.body" @keyup="updateNote(note.id, note.body)" :disabled="!profile.edit"></textarea>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<h3 class="body-title">Timeline</h3>
					<div class="appointments">
						<div class="history-loader" :class="{active: profile.history.loading.timeLine}"><img src="/img/loading-icon.png" alt=""></div>
						<div class="panel-header" v-if="!profile.history.loading.timeLine">
							<div class="input-group">
								€<input type="number" v-model="profile.history.paymentData.amount" class="payment-input" placeholder="Insert Amount">
							</div>
							<select class="payment-type" v-model="profile.history.paymentData.type">
								<option value="1">Owns</option>
								<option value="2">Paid</option>
							</select>
							<div class="pay-it">
								<span class="total">
									@{{profile.history.getTotal()}}€
								</span>
								<i class="material-icons" @click="payIt">&#xE8B0;</i>
							</div>
						</div>
						<div class="panel-body" v-if="!profile.history.loading.timeLine">
							<ul class="operations">
								<li v-for="event in profile.history.timeLine">
									<div class="operation-row">
										<div class="list-style" v-if="!profile.edit">		
											<i class="material-icons" v-if="event.starting_at">&#xE85D;</i> <!-- Appointment -->
											<i class="material-icons owned" v-else-if="event.amount < 0">&#xE85F;</i> <!-- owned -->
											<i class="material-icons paid" v-else>&#xE862;</i> <!-- paid -->
										</div>
										<div class="list-style" v-if="profile.edit">
											<i class="material-icons" @click="deleteEvent(event)">&#xE92B;</i> <!-- ass tray -->
										</div>
										<div class="operation-name">@{{event.label}}</div>
										<div class="operation-time" :title="event.starting_at ? event.starting_at : event.created_at | fullDate">@{{event.starting_at ? event.starting_at : event.created_at | weeklyDateFilter}}</div>
										<div class="operation-value">@{{event.amount ? event.amount+'€' : '-'}}</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="footer-section">
			<form @submit.prevent="addNewNote">
				<input-template :data="profile.history.newNote"></input-template>
				<button-template Bclass="btn-success" Blabel="Add New Note"></button-template>
			</form>
		</div>
	</div>
</div>