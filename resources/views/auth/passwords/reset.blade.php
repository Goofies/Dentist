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
                <form method="POST" action="{{ route('password.request') }}">
                    {{ csrf_field() }}
                    <input type="hidden" name="token" value="{{ $token }}">
                    <input-template :data='resetPassword.email' :required = true></input-template>
                    <input-template :data='resetPassword.password' :required = true></input-template>
                    <input-template :data='resetPassword.password_confirmation' :required = true></input-template>
                    <button-template Blabel='Reset Password' Bclass='btn-success btn-block'></button-template>
                </form>
            </div>
        </div>
    </div>
    <script src="/js/login.js"></script>
@include('/partials.foot')