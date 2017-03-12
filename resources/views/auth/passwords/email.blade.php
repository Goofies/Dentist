@include('/partials.head')
    <div class="form-container" id="signIn">
        <div class="form-wrapper">
            <div class="form-header">
                <h2>Reset Password</h2>
            </div>
            @if (session('status'))
                <div class="alert alert-success">
                    {{ session('status') }}
                </div>
            @endif
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
                <form method="POST" action="{{ route('password.email') }}">
                    {{ csrf_field() }}
                    <input-template :data='sendEmail.email' :required=true></input-template>
                    <button-template Blabel='Send Reset Email' Bclass='btn-success btn-block'></button-template>
                </form>
            </div>
        </div>
    </div>
    <script src="/js/login.js"></script>
@include('/partials.foot')