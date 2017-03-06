export default class PatientList {
	constructor() {
		this.list = {};
		this.filtered = {};
        this.inputDisplay = "";
		this.search = "";
		this.display = false;
		this.getPatients();
	}
    getPatients() {
        axios.get('/patients/index')
            .then(response => {
                response.data.forEach(patient => {
                    patient['fullname'] = `${patient.name} ${patient.lastname}`;
                })
                this.list = response.data;
                this.filterPatients();
            })
            .catch(error => console.log(error.response.data))
    }
    filterPatients() {
        let patients = this.list,
            search = this.search;
        if(!search){
            this.filtered = patients;
        } else {
	        search = search.trim().toLowerCase(); // a
	        patients = patients.filter((patient) => {
	            let fullname = (patient.fullname).trim().toLowerCase(); // Nadia Vatidi -> nadiavatidi
	            if(fullname.indexOf(search) !== -1){
	                return patient;
	            }
	        });
	        this.filtered = patients;
	    }
    }
    closeSearch() {
        this.display = false;
        this.inputDisplay = false;
    }
    showSearch() {
        this.inputDisplay = true;
        this.search = '';
        document.getElementById("patient-search-input").focus();
    }
}