@extends("admin::layouts.message")

@section("content")

    <div class="text-center animated fadeInDown">

        <h2>Site Offline</h2>

        <h3 class="font-bold"></h3>

        <div class="error-desc">
            {{ option("site_offline_message") }}
        </div>

    </div>

@stop
