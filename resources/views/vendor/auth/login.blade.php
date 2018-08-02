@extends("auth::layouts.auth")

@section("content")

    <div class="loginContainer">
        <div class="tableDis">
            <div class="theCell">
                <div class="LC_theForm">
                    <div class="LC_logo"><img src="{{ url('auth/logo.png') }}" alt=""></div>
                    <div class="LC_title">{{ trans("auth::auth.sign_in_to_account") }}</div>
                    <form action="{{ route("admin.auth.login") }}" method="post">
                        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                        @if(Request::filled("url"))
                            <input type="hidden" name="url" value="{{ Request::get("url") }}"/>
                        @elseif(Session::has("url"))
                            <input type="hidden" name="url" value="{{ Session::get("url") }}"/>
                        @else
                            <input type="hidden" name="url" value="{{ Request::old("url") }}"/>
                        @endif
                        @if (Session::has("message"))
                            <div class="alert alert-success">
                                {!! Session::get("message") !!}
                            </div>
                        @endif
                        @if ($errors->count() > 0)
                            <div class="alert alert-danger alert-dark">
                                {!! implode(' <br /> ', $errors->all()) !!}
                            </div>
                        @endif

                        <input type="text" name="username" placeholder="{{ trans("auth::auth.username") }}"
                               required="required" value="{{ Request::old("username") }}" class="LC_oneInp">
                        <input type="password" name="password" placeholder="{{ trans("auth::auth.password") }}"
                               required="required" class="LC_oneInp">

                        <div class="LC_rememberMe">
                            <label for="remember">
                                <input type="checkbox" id="remember" name="remember" value="1">
                                <span>{{ trans("auth::auth.remember_me") }}</span>
                            </label>
                            <a href="{{ route("admin.auth.forget") }}">{{ trans("auth::auth.forget_password") }}</a>
                        </div>
                        <input type="submit" value="{{ trans("auth::auth.login_in") }}">
                    </form>
                </div>
            </div>
        </div>
    </div>

@endsection

