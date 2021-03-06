<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">

    <title>{{ trans("auth::auth.sign_in_to_account") }} - {{ option("site_name") }} - {{ trans("auth::auth.cms") }}</title>
    <link rel="icon" type="image/png" href="{{ assets("admin::favicon.png") }}"/>
    <style>
        @font-face {
            font-family: 'bold';
            src:  url('{{ url("auth/fonts/BahijTheSansArabic-Bold.eot?#iefix") }}') format('embedded-opentype'),
            url('{{ url("auth/fonts/BahijTheSansArabic-Bold.woff") }}') format('woff'),
            url('{{ url("auth/fonts/BahijTheSansArabic-Bold.ttf") }}')  format('truetype'),
            url('{{ url("auth/fonts/BahijTheSansArabic-Bold.svg#BahijTheSansArabic-Bold") }}') format('svg');
            font-weight: normal;
            font-style: normal;
        }
        body{margin: 0;direction: rtl;}
        .loginContainer{position: fixed;top: 0;right: 0;bottom: 0;left: 0;background: url({{ url("auth/bg.png") }}) center center;}
        .tableDis{width: 100%;height: 100%;display: table;}
        .tableDis .theCell{display: table-cell;vertical-align: middle;}
        .LC_logo{text-align: center;margin: 0 0 50px;}
        .LC_logo img{width: 84px;}
        .LC_title{font-size: 24px;color: #C73133;margin: 0 0 20px;padding: 0 0 15px;position: relative;}
        .LC_title:before{content: '';position: absolute;bottom: 0;left: 50%;width: 45px;height: 2px;margin: 0 0 0 -22px;background: #C73133;}
        .LC_theForm{width: 392px;margin: 0 auto;font-family: 'bold';text-align: center;font-size: 16px;color: #444;}
        .LC_oneInp{width: 100%;border: 1px solid rgba(112, 112, 112, 0.25);padding: 0 20px;box-sizing: border-box;height: 50px;font: 16px 'bold';margin: 0 0 20px;color: #444;}
        .LC_oneInp::placeholder{color: #444;}
        .LC_rememberMe{overflow: hidden;font-size: 14px;margin: 0 0 40px;}
        .LC_rememberMe label{float: right;}
        .LC_rememberMe a{float: left;color: #444;text-decoration: none;}
        .LC_theForm form input[type='submit']{width: 186px;height: 50px;background: #C73133;color: #fff;font: 16px 'bold';}
        .alert-danger { color: red; margin: 10px 0}
    </style>

</head>
<body class="">
    @yield("content")
</body>
</html>




