@include('partials.head')
	<div id="calendar" v-cloak>
		@include('partials.informationBox')
	 	@include('partials.header')
	 	<div class="container">
		 	<div class="row">
			    <div class="col-md-12">
			    	<timeline :appointments="daily"></timeline>
			    </div>	    
			 	<div class="col-md-12">
			      @yield('content')
			    </div>
		    </div>
	    </div>
	</div>
    <script src="js/app.js"></script>
@include('partials.foot')