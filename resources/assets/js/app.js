require('./bootstrap');
function pad(n){
    return (n<10) ? '0' + n.toString() : n.toString();
}
function phpDate(date) {
    let month = date.getMonth() + 1;
    return date.getFullYear()+"-"+month+"-"+date.getDate();
}
import Form from "./classes/Form";
import MonthlyView from "./classes/MonthlyView";
import WeeklyView from "./classes/WeeklyView";
import PatientList from "./classes/PatientList";
import PatientProfile from "./classes/PatientProfile";
import AppointmentForm from "./classes/AppointmentForm";
import DailyView from "./classes/DailyView";
import InfoMessage from "./classes/InfoMessage";
import Multiselect from "vue-multiselect";
import inputTemplate from "./components/inputTemplate";
import buttonTemplate from "./components/buttonTemplate";
import timeline from "./components/timeline";

var calendar = new Vue({
    el: '#calendar',
    components: {
        Multiselect,
        buttonTemplate,
        inputTemplate,
        timeline
    },
    data() {
        return {   
            info: new InfoMessage(),
            patients: new PatientList(),
            profile: new PatientProfile(),
            monthly: new MonthlyView(),
            weekly: new WeeklyView(),
            daily: [],
            appointmentForm: new AppointmentForm(),
            patientForm: new Form({
                name: 'text',
                lastname: 'text',
                email: 'email',
                phone: 'number',
                mobilephone: 'number',
                address: 'textarea'
            }),
            modals: {
                main: {
                    display: '',
                    weekly: '',
                    profile: ''
                },
                sideModal: '',
                weekly: '',
                appointmentForm: {
                    first: '',
                    second: '',
                    edit: ''
                },
                editPatient: ''
            }
        }
    },
    computed: {
        appointmentDuration() {
            let duration = this.appointmentForm.end.getTime() - this.appointmentForm.start.getTime();
            let durationHour = pad(Math.floor(duration/1000/60/60));
            let durationMinute = pad(duration/1000/60 % 60);
            return durationHour+":"+durationMinute;
        }
    },
    methods:{
        /*
        * Daily Things
        */
        getDailyAppointments(){
            let now = new Date();
            now = phpDate(now);
            axios.get(`appointments/${now}`)
                .then(response => this.daily = response.data)
                .catch(error => console.log(error.response.data))
        },
        /*
        * Profile Things
        */
        displayProfile(patient) {
            this.profile.display(patient);
            this.modals.main.display = true;
            this.modals.main.profile = true;
            this.patients.closeSearch();
        },
        updateProfile() {
            this.profile.submitEdit()
                .then(() => this.patients.getPatients())
        },
        updateNote: _.debounce(function(id, body) {
            this.profile.history.updateNote(id, body)
                .then(message => this.info.success(message))
        },3000),
        addNewNote() {
            this.profile.history.addNote()
                .then((message) => {
                    this.info.success(message);
                })
                .catch((message) => this.info.danger(message))
        },
        payIt() {
            this.profile.history.payIt()
                .then(message => this.info.danger(message))
                .catch(error => this.info.danger(error))
        },
        deleteEvent(event) {
            if(confirm('Are you sure you want to delete?')) {
                this.profile.history.deleteEvent(event)
                    .then(message => this.info.success(message))
                    .catch(message => this.info.danger(message))
            }
        },
        deletePatient(patient) {
            if(confirm('Are you sure you want to delete?')) {
                this.profile.deletePatient(patient)
                    .then(message => this.info.danger(message))
                    .catch(message => this.info.danger(message))
            }
        },
        deleteNote(note) {
            if(confirm('Are you sure you want to delete?')) {
                this.profile.history.deleteNote(note)
                    .then(message => this.info.danger(message))
                    .catch(message => this.info.danger(message))
            }
        },
        /*
        *  Add Patient Things
        */
        addPatient() {
            this.patientForm.post('/patients/store')
                .then(data => {
                    this.patients.getPatients();
                    this.info.success(data);
                })
                .catch(errors => console.log(errors))
        },
        /*
        * Weekly Modal Things
        */
        displayModal(date) {
            this.weekly.displayView(date);
            this.weekly.clicked = new Date(date);
            this.weekly.clicked = this.weekly.clicked.getDay();
            this.modals.main.display = true;
            this.modals.main.weekly = true;
        },
        /*
        * Appointment Things
        */
        createAppointmentForm(date, timestart, timeend, dayindex, blockindex, cellindex, appointment) {
            if (appointment != '' && this.modals.appointmentForm.first == false) {
                this.appointmentForm.editForm(appointment);
                this.modals.sideModal = true;
                this.modals.appointmentForm.edit = true;
            } else {
                if (this.modals.appointmentForm.first == false) {
                    let blockInformation = this.weekly.data[dayindex]['blocks'][blockindex];
                    blockInformation[cellindex].class.active = true;
                    this.appointmentForm.firstStep(date, timestart, cellindex, blockInformation);
                    this.modals.appointmentForm.first = true;
                    } else if (this.modals.appointmentForm.first == true && timeend > this.appointmentForm.start && date == this.appointmentForm.date && timeend <= this.appointmentForm.endingArray[this.appointmentForm.endingArray.length - 1].ending_at) {
                        this.appointmentForm.secondStep(timeend);
                        this.modals.appointmentForm.second = true;
                        this.modals.sideModal = true;
                    } else {
                        this.info.danger('You suck! try again');
                        this.closeAppointmentForm();
                }
            }
        },
        addAppointment(){
            this.appointmentForm.addAppointment()
                .then(message => {
                    this.info.success(message);
                    this.patients.getPatients();
                    this.weekly.displayView();
                    this.closeAppointmentForm();
                    this.monthly.getView();
                    this.getDailyAppointments();
                })
        },
        deleteAppointment(){
            if(confirm('Are you sure you want to delete?')) {
                this.appointmentForm.deleteAppointment()
                    .then(message => {
                        this.info.danger(message);
                        this.weekly.displayView();
                        this.closeAppointmentForm();
                        this.monthly.getView();
                        this.getDailyAppointments();
                    })
            }
        },
        closeAppointmentForm(){
            this.modals.sideModal = false;
            this.modals.appointmentForm.first = false;
            this.modals.appointmentForm.second = false;
            this.modals.appointmentForm.edit = false;
            this.appointmentForm.clear();
        },
        /*
        * General Things
        */
        closeModal(){
            if (this.modals.sideModal == true) {
                this.closeAppointmentForm();
            } else if (this.modals.main.display == true) {
                this.modals.main.display = false;
                this.closeAppointmentForm();
                this.modals.main.profile = false;
                this.modals.main.weekly = false;
            } else if (this.patients.inputDisplay == true) {
                this.patients.closeSearch();
            } else if (this.patientForm.display == true) {
                this.patientForm.display = false;
            } 
        },
        keyHandle(e){
            e.keyCode == 27 && this.closeModal();
        }
    },
    filters: {
        calendarDate(date) {
            let string = new Date(date);
            string = pad(string.getDate());
            return string;
        },
        weeklyDateFilter(date) {
            date = new Date(date);
            let day = date.getDate();
            let month = date.getMonth();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = months[month];
            return day+" "+month.substr(0, 3);
        },
        getHM(time) {
            time = new Date(time);
            let hour = pad(time.getHours());
            let minutes = pad(time.getMinutes());
            return hour+":"+minutes;
        },
        fullDate(date) {
            date = new Date(date);
            let day = date.getDate();
            let month = date.getMonth();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = months[month];
            let year = date.getFullYear();
            return day+" "+month.substr(0, 3)+" "+year;
        }
    },
    mounted(){
        this.getDailyAppointments();
        this.patients.getPatients();
        this.monthly.getView();
    },
    created(){
        window.addEventListener('keyup', this.keyHandle)
    }
});
