/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

jQuery(function ($) {
    var i = 1;
    var color = getRandomColor();
    $('#small-chat').click(function (e) {
        i = 1;
        $('#chat-counter').html('');
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
    });
    // open a socket connection
    var socket = new io.connect('http://localhost:8080', {
        'reconnection': true,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax': 5000,
        'reconnectionAttempts': 5
    });
    // when user connect, store the user id and name
    socket.on('connect', function (user) {
        socket.emit('join', {id: userId, name: username, room: 'room1'});
    });
    $('#chat-message').keypress(function (event) {

        if (event.keyCode == 13) {
            if ($(this).val().trim()) {
//e.preventDefault();
                socket.emit('chat.send.message', {msg: $(this).val(), nickname: username, color: color, room: 'room1'});
                $(this).val('');
            }
        }
    });
    // get connected users and display to all conected
    socket.on('chat.users', function (nicknames) {
//        var html = '';
//        $.each(nicknames, function (index, value) {
//            html += '<li><a href="' + value.socketId + '">' + value.nickname + '</a></li>';
//        });
//        $chatUsers.html(html);
    });
    // wait for a new message and append into each connection chat window
    socket.on('chat.message', function (romm, data) {

        data = JSON.parse(data);
        if (data.hasOwnProperty('system')) {
            //toastr["success"](data.msg);
            alert(data.msg);
        } else {
            if (data.nickname == username) {
                $('#chat-log').append('<div class="left"><div class="author-name">me</div><div class="chat-message active" style="background:' + color + '">' + data.msg + '</div></div>');
            } else {
                $('#chat-log').append('<div class="right"><div class="author-name">' + data.nickname + '</div><div class="chat-message active" style="background:' + data.color + '">' + data.msg + '</div></div>');
                if (!$('.small-chat-box').is(":visible")) {
                    $('#chat-counter').html(i);
                    i = i + 1;
                }
            }

            $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
        }
    });

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $('#chat-hide').on('click', '.chat-room', function (e) {
        lastElem = $('div.chat-room:visible').last();
        lastElem.hide();
        $('div.chat-room[data-name="' + $(this).attr('data-name') + '"]').show().find('.toggle').click();
        $(this).attr('data-name', lastElem.attr('data-name'));
        $(this).find('.room-notify').html(lastElem.find('.room-notify').html());
        $(this).find('.room-name').html(lastElem.find('h3').html());
        $(this).parent().prev('.toggle').click();
    });
    $("#hidden-chat .toggle").click(function (e) {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $("#chat-hide").hide();
        } else {
            $(this).addClass('open');
            $("#chat-hide").show();
        }
        hide_offset();
    });
    $(".chat-room .toggle").click(function (e) {
        $(this).hide().find('.room-notify').html('');
        $(this).next('.small-chat-box').show().find('.chat-message').focus();
    });
    $(".small-chat-box .heading").click(function (e) {
        $(this).parents('.chat-room').find('.toggle').show();
        $(this).parent('.small-chat-box').hide();
    });
    $(".chat-message").keyup(function (e) {
//console.log($(this)[0].clientHeight + ' ' +$(this)[0].scrollHeight);
        //elem = $(this).parent().prev();
//        console.log($(this)[0].clientHeight + ' ' + $(this)[0].scrollHeight + ' ' + $(this).outerHeight());
//        if (($(this)[0].scrollHeight > $(this).outerHeight() - 1) && elem.height() > 200) {
//            elem.css('height', elem.height() - 30);
//            rows = parseInt($(this).attr('rows')) + 1;
//            $(this).attr('rows', rows);
//        } else if (($(this)[0].scrollHeight == $(this).outerHeight() - 11) && elem.height() < 234) {
//            elem.css('height', elem.height() + 30);
//            rows = parseInt($(this).attr('rows')) - 1;
//            $(this).attr('rows', rows);
//        }


    });
    check_width();
    $(window).resize(function () {
        check_width();
    });

    function check_width() {
        $("div.chat-room").show();
        $("#hidden-chat").hide();
        $("#chat-hide").html('');
        counter = 0;
        width = ($("#hidden-chat").is(":visible")) ? $("#hidden-chat").outerWidth(true) : 0;
        $("div.chat-room:visible").each(function (index, element) {
            width += $(this).outerWidth(true);
        });
        //width += ($('div.chat-room:visible').length - 1) * 3;

        hide_offset();
        console.log(width + ' ' + $('.chat_wrap').outerWidth(true));
        while (((width >= $('div.chat_wrap').outerWidth(true)) || (($('div.chat_wrap').outerHeight(true) > 50) && ($('div.chat_wrap').outerHeight(true) < 340)) || $('div.chat_wrap').outerHeight(true) > 360) && $('div.chat-room:visible').length) {
            lastElem = $('div.chat-room:visible').last();
            //console.log(lastElem.attr('data-name'));
            lastElem.hide();
            $("#hidden-chat").css('display', 'inline-block');
            $("#chat-hide").append('<li class="list-group-item fist-item chat-room" data-name="' + lastElem.attr('data-name') + '"><span class="label label-success pull-right room-notify">' + lastElem.find('.room-notify').html() + '</span><span class="room-name">' + lastElem.find('h3').html() + '</span></li>');
            counter++;
            $("#hidden-chat").find('.counter').html(counter);
            width = ($("#hidden-chat").is(":visible")) ? $("#hidden-chat").outerWidth(true) : 0;
            $("div.chat-room:visible").each(function (index, element) {
                width += $(this).outerWidth(true);
            });
            //width += ($('div.chat-room:visible').length - 1) * 3;

            console.log(width + ' ' + $('.chat_wrap').outerWidth(true));
            hide_offset();
        }
    }

    function hide_offset() {
        offset = $("#chat-hide").offset();
        if (offset.left < 0) {
            $("#chat-hide").css('right', 'inherit').css('left', 0);
        } else {
            $("#chat-hide").css('left', 'inherit').css('right', 0);
        }
    }
});
