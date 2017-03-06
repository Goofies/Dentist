<div class="container-fluid header-group">
	<ul class="nav-ul">
		<li class="nav-item nav-item-1">
			<div class="nav-title">
				<div class="search-group" :class="{active: patients.inputDisplay}">
					<i class="material-icons" @click="patients.closeSearch()">&#xE5CD;</i>
					<input 
						id="patient-search-input"
						placeholder="Search Your Patients" 
						v-model="patients.search" 
						@keyup="patients.filterPatients()"
						@keydown="{patients.inputDisplay == true ? patients.display = true : ''}">
				</div>
				<i class="material-icons" @click="patients.showSearch()">&#xE8B6;</i>
			</div>
			<div class="nav-drop" :class="{active: patients.display}">
				<ul class="list-group">
				  <li class="list-group-item" v-for="patient in patients.filtered" @click="displayProfile(patient)">
					<img :src="patient.gravatar">
				  	<span>@{{patient.fullname}}</span>
				  </li>
				</ul>
			</div>
		</li>
		<li class="nav-item nav-item-2">
		<div class="nav-title"  @click="patientForm.display = !patientForm.display"><i class="material-icons">&#xE7F0;</i></div>
		<div class="nav-drop" :class="{active: patientForm.display}">
			<form action="POST" @submit.prevent="addPatient">
				<input-template v-for="input in patientForm.inputs" :data="input"></input-template>
				<textarea-template v-for="input in patientForm.textareas" :data="input"></textarea-template>
				<button-template Blabel="Register" Bclass="btn-success btn-block"></button-template>
			</form>
		</div>
		</li>
	</ul>
</div>