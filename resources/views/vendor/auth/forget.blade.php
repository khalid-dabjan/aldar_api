@extends("auth::layouts.auth")

@section("content")


    <div class="loginContainer">
        <div class="tableDis">
            <div class="theCell">
                <div class="LC_theForm">
                    <div class="LC_logo"><img src="{{ url("auth/logo.png") }}" alt=""></div>
                    <div class="LC_title">{{ trans("auth::auth.password_reset") }}</div>
                    <form action="{{ route("admin.auth.forget") }}" method="post">

                        @if ($errors->first("not_registed"))
                            <div class="alert alert-danger">{{ $errors->first("not_registed") }}</div>
                        @endif

                        @if($errors->first("email_sent"))
                            <div class="alert alert-success">{{ $errors->first("email_sent") }}</div>
                        @endif

                        <input type="hidden" name="_token" value="{{ csrf_token() }}">

                            <input type="email" name="email" placeholder="{{ trans("auth::auth.email") }}"
                               value="{{ Request::old("email") }}" required="required" class="LC_oneInp">

                        <div class="LC_rememberMe">
                            <label for="remember">
                                <span></span>
                            </label>
                            <a href="{{ route("admin.auth.login") }}">{{ trans("auth::auth.back_to_login") }}</a>
                        </div>
                        <input type="submit" value="{{ trans("auth::auth.send_reset_link") }}">
                    </form>
                </div>
            </div>
        </div>
    </div>

@stop
