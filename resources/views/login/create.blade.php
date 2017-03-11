@include('/partials.head')
	<div class="form-container" id="signIn">
		<div class="form-wrapper">
			<div class="form-header">
				<h2>Sign in</h2>
			</div>
			@if(count($errors))
			<div class="form-error">
				<ul class="error-list">
					@foreach ($errors->all() as $error)
						<li class="error">{{$error}}</li>
					@endforeach
				</ul>
			</div>
			@endif
			<div class="form-body">
				<form method="POST" action="/login">
					{{ csrf_field() }}
					<input-template :data='loginInputs.email' :required=true></input-template>
					<input-template :data='loginInputs.password' :required=true></input-template>
					<a href="/password/reset" class="forgot-password">Forgot Your Password?</a>
					<button-template Blabel='Sign in!' Bclass='btn-success btn-block'></button-template>
				</form>
			</div>
		</div>
	</div>
    <script src="js/login.js"></script>
@include('/partials.foot')