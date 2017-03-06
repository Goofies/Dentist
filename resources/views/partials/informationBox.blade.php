<div class="information-box" :class="[{active: info.display}, info.status]" role="alert" 
	v-html="info.message"
	></div>