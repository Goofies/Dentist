@include('partials.head')
	@include('partials.informationBox')
 	@include('partials.header')
 	<div class="container">
	 	<div class="row">
		    <div class="col-md-12">
		    	<timeline></timeline>
		    </div>	    
		 	<div class="col-md-12">
		      @yield('content')
		    </div>
	    </div>
    </div>
@include('partials.foot')