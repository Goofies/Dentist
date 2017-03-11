@include('/partials.head')
	<div class="form-container" id="signIn">
		<div class="form-wrapper">
			<div class="form-header">
				<h2>Reset Password</h2>
			</div>
			@if(count($errors))
				<div class="form-error">
					<ul class="errors-list">
						@foreach ($errors->all() as $error)
							<li class="error">{{$error}}</li>
						@endforeach
					</ul>	
				</div>
			@endif
			<div class="form-body">
				<form method="POST" action="/user">
					{{ csrf_field() }}
					<input-template :data='resetPassword.email' :required = true></input-template>
					<button-template Blabel='Send Reset Mail' Bclass='btn-success btn-block'></button-template>
				</form>
			</div>
		</div>
	</div>
    <script src="/js/login.js"></script>
@include('/partials.foot')