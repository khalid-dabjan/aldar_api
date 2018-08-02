/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var back = false;
var flag_title = true;
var flag_keywords = true;
var flag_description = true;
var flag_fb_title = true;
var flag_fb_description = true;
var flag_tw_description = true;
var flag_focus = true;

$(window).on('beforeunload', function () {
    if (back == true)
        return 'Are you sure you want to leave?';
});

$(function () {
    $('#input-daterange').datetimepicker({
        format: 'yyyy-MM-dd hh:mm:ss',
        language: 'pt-BR'
    });

    $('#newTopic').on('input', function () {
        console.log('t0');
        if ($(this).val() == '' || $(this).val().length <= 2) {
            $('#topics-wrap').hide();
            $("#topics-wrap div").html('');
        } else {

            ajaxData = {
                q: $(this).val(),
            };
            $.ajax({
                type: "GET",
                dataType: 'json',
                url: baseURL + "topics/search",
                data: ajaxData,
                beforeSend: function (res) {
                    $('#topics-wrap').show();
                    $("#topics-wrap div").html('');
                    $("#topics-search").html(search_lang);
                },
                success: function (res) {
                    $("#topics-wrap div").html('');
                    if (res != 'notfound') {
                        $.map(res, function (n, i) {
                            $("#topics-wrap div").prepend('<a href="#" class="topics-one task-title" style="border-top: 1px solid;padding: 8px 0;border-top-color: #e4e4e4; display:block; font-weight:bold" data-id="' + n.id + '">' + n.name + '</a>');
                        });
                    } else {
                        $('#topics-wrap').hide();
                    }
                },
                complete: function () {
                    $("#topics-search").html('');
                }
            });
        }
    });

    $('#topics-wrap').find('div').on('click', '.topics-one', function (e) {
        e.preventDefault();
        appendSelectedTopic($(this).html(), $(this).attr('data-id'));
        $('#topics-wrap').hide();
        $('#newTopic').val('');
    });

    $("#add-topic").click(function (e) {
    });

    $('.embed_poll').on('click', function (ev) {
        ev.preventDefault();
        var editor = $("iframe.cke_wysiwyg_frame").contents().find("body");
        var pollId = $(this).attr('data-id');
        console.log(pollId);
        editor.append($('<p>').html('<div name="poll" class="shortcode" id="' + pollId + '"><img src="' + assetsURL + 'images/polls.png" style="max-width:50px;"></div>'));
        $('#modal_polls').modal('hide')
    });

    $('#quick-new-topic-btn').on('click', function (ev) {
        console.log('ds');
        submitForm($('#quick-new-topic-form'));
    });

    $(document).on('click', '.topic-delete', function () {
        var self = $(this);
        var deleteId = self.attr('data-delete-id');
        var selector = "#topic_" + deleteId;
        console.log(selector);
        $(selector).remove();
    });

    $("#change_topic_photo").filemanager({
        types: "png|jpg|jpeg|gif|bmp",
        done: function (files, base) {

            if (files.length) {
                $('.featured_image').remove();
                var file = files[0];
                $("#topic_photo_preview").attr("src", file.media_thumbnail);
                $('<input>', {
                    name: 'image_id',
                    type: 'hidden',
                    class: 'featured_image',
                    value: file.media_id
                }).appendTo($('#quick-new-topic-form'));
            }
        },
        error: function (media_path) {
            alert(media_path + " is not an image");
        }
    });

    $('.select2-multible').each(function () {
        var fUrl = $(this).attr('data-fetch-url');
        console.log(fUrl)
        $(this).select2({
            minimumInputLength: 1,
            dir: "rtl",
            language: "ar",
            multiple: true,
            ajax: {// instead of writing the function to execute the request we use Select2's convenient helper
                url: fUrl,
                dataType: 'json',
                data: function (term, page) {
                    return {
                        q: term, // search term
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data
                    var results = false;
                    if (typeof data.items != "undefined") {
                        results = data.items;
                    }
                    return {results: results};
                },
            },
            initSelection: function (element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(fUrl, {
                        data: {
                            idStr: id
                        },
                        dataType: "json"
                    }).done(function (data) {
                        callback(data.items);
                    });
                }
            },
            formatResult: userFormatResult, // omitted for brevity, see the source of this page
            formatSelection: userFormatSelection, // omitted for brevity, see the source of this page
            dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
            escapeMarkup: function (m) {
                return m;
            }, // we do not want to escape markup since we are displaying html in results
            inputTooShort: function () {
                return "<?php echo trans('cms::posts__________.s2_too_short') ?>";
            }
        });
    });


    function appendSelectedTopic(name, ID) {
        $("#topics-select2").append("<li class='select2-search-choice'><div>" + name + "</div><a href='#' class='topic-delete select2-search-choice-close' data-delete-id='" + ID + "'></a></li>");
        $("#post-form").append($('<input>', {
            'type': 'hidden',
            'id': 'topic_' + ID,
            'name': 'topics[]',
            'value': ID
        }));
    }

    function userFormatResult(user) {
        var markup = "<table class=''><tr>";
        markup += "<td class='' style='vertical-align: top'><img src='" + user.image + "' style='max-width: 60px; display: inline-block; margin-right: 10px; margin-left: 10px;' /></td>";
        markup += "<td class=''><div class='' style='font-weight: 600; color: #000; margin-bottom: 6px;'>" + user.name + "</div>";
        markup += "</td></tr></table>";
        return markup;
    }

    function userFormatSelection(user) {
        return user.name;
    }

    function submitForm(form) {
        form.submit(function (e) {
            e.preventDefault();
            var postData = $(this).serializeArray();
            var formURL = $(this).attr("action");
            $.ajax({
                url: formURL,
                type: "POST",
                dataType: 'json',
                data: postData,
                beforeSend: function () {
                    $(this).find('input,textarea').prop("disabled", true);
                },
                success: function (res) {
                    if (res == 'found') {
                        $("#found_topic").show();
                    } else {
                        $("#found_topic").hide();
                        console.log(res);
                        appendSelectedTopic(res.name, res.id);
                        $('#modal_new_topic').modal('hide');
                    }

                }
            });
        });
    }

    function appendSelectedTopic(name, ID) {
        $("#topics-select2").append("<li class='select2-search-choice'><div>" + name + "</div><a href='#' class='topic-delete select2-search-choice-close' data-delete-id='" + ID + "'></a></li>");
        $("#post-form").append($('<input>', {
            'type': 'hidden',
            'id': 'topic_' + ID,
            'name': 'topics[]',
            'value': ID
        }));
    }

    if (post_id) {
        $(window).unload(function () {
            $.ajax({
                type: 'POST',
                async: false,
                url: baseURL + "posts__________/leavepost",
                data: {
                    id: post_id
                },
                success: function (a) {
                    console.debug("Ajax call finished");
                },
            });
        });
    }

    // tweet text
    $('#tweet_txt').click(function () {
        var editor = CKEDITOR.instances["pagecontent"];
        var mySelection = editor.getSelection();
        if (CKEDITOR.env.ie) {
            mySelection.unlock(true);
            selectedText = mySelection.getNative().createRange().text;
        } else {
            selectedText = mySelection.getNative();
        }
        var share_url = detailsPage;
        var href = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.cms.com%2Fadmin%2Fposts%2F217%2Fedit%3Fcat_id%3D104&text=" + selectedText + "&tw_p=tweetbutton&url=" + share_url;
        var newtxt = '<a href="' + href + '" class="inner_tweet">' + selectedText + '<i></i></a>';
        var oldtxt = editor.getData();
        var new_whole = oldtxt.replace(selectedText, newtxt);
        editor.setData(new_whole);
    });
    //tweet text

    $('#treeOne').tree({
        collapseUiIcon: 'ui-icon-plus',
        expandUiIcon: 'ui-icon-minus',
        onCheck: {
            ancestors: 'check',
            descendants: null
        },
        onUncheck: {
            ancestors: null,
            descendants: null
        }
    });
    $('#treeTwo').tree({
        collapseUiIcon: 'ui-icon-plus',
        expandUiIcon: 'ui-icon-minus',
        onCheck: {
            ancestors: null,
            descendants: null
        },
        onUncheck: {
            ancestors: null,
            descendants: null
        }
    });
    $('#treeThree').tree({
        collapseUiIcon: 'ui-icon-plus',
        expandUiIcon: 'ui-icon-minus',
        onCheck: {
            ancestors: null,
            descendants: null
        },
        onUncheck: {
            ancestors: null,
            descendants: null
        }
    });
    $("#link-post_tag").click(function (e) {
        e.preventDefault();
        $("#tagcloud-post_tag").toggle();
    });
    $("#category-add-toggle").click(function (e) {
        e.preventDefault();
        $("#category-add").toggle();
        $("input[name=newcategory]").trigger("focus");
    });

    if (post_id) {
        $("#new_comment").click(function (e) {
            e.preventDefault();
            var new_comment = $(this);
            var comment = CKEDITOR.instances['post_comment'].getData();
            if (!strip_tags(comment)) {
                return false;
            }

            ajaxData = {
                comment_content: comment,
                post_id: post_id,
            };
            $.ajax({
                type: "POST",
                /*dataType: 'json',*/
                url: baseURL + "posts__________/addcomment",
                data: ajaxData,
                beforeSend: function (res) {
                    $("#loader").show();
                    new_comment.addClass('disabled');
                },
                success: function (res) {
                    $("#comments").prepend(res);
                },
                complete: function () {
                    CKEDITOR.instances['post_comment'].setData('');
                    $("#cancel_comment").click();
                    $("#loader").hide();
                    $("#recent-comments").show();
                    new_comment.removeClass('disabled');
                    $("#comments_options").show();
                    scroll_height('recent-comments', 300);
                }
            });
        });
        $("#new_note").click(function (e) {
            e.preventDefault();
            var new_note = $(this);
            if (!strip_tags($("#post_note").val())) {
                return false;
            }

            ajaxData = {
                note_content: $("#post_note").val(),
                post_id: post_id
            };
            $.ajax({
                type: "POST",
                url: baseURL + "posts__________/addnote",
                data: ajaxData,
                beforeSend: function (res) {
                    $("#note_loader").show();
                    new_note.addClass('disabled');
                },
                success: function (res) {
                    $("#notes").prepend(res);
                },
                complete: function () {
                    $("#post_note").val('');
                    $("#cancel_note").click();
                    $("#note_loader").hide();
                    $("#recent-notes").show();
                    new_note.removeClass('disabled');
                    scroll_height('recent-notes', 180);
                }
            });
        });
        $('#comments').on('click', '.trash_comment, .spam_comment, .accept_comment, .refuse_comment, .block_comments', function (e) {
            e.preventDefault();
            var link = $(this);
            var comment_id = link.attr('href').substr(1);
            var action = link.attr('data-type');
            status = '';
            if (action == 'trash') {
                status = 4;
            } else if (action == 'spam') {
                status = 3;
            } else if (action == 'block') {
                status = 5;
            } else if (action == 'accept') {
                status = 1;
            } else {
                status = 2;
            }

            ajaxData = {
                comment_id: comment_id,
                status: status,
            };
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseURL + "posts__________/changecomment",
                data: ajaxData,
                beforeSend: function (res) {
                },
                success: function (res) {
                },
                complete: function () {

                    if (action == 'trash' || action == 'spam') {
                        link.closest('.feed-element').remove();
                    } else if (action == 'accept') {
                        link.closest('.feed-element').find('.refuse_comment').show();
                        link.closest('.feed-element').find('.block_comment').show();
                        link.hide();
                    } else if (action == 'refuse') {
                        link.closest('.feed-element').find('.accept_comment').show();
                        link.closest('.feed-element').find('.block_comment').show();
                        link.hide();
                    } else {
                        link.closest('.feed-element').find('.accept_comment').show();
                        link.closest('.feed-element').find('.refuse_comment').show();
                        link.hide();
                    }

                    scroll_height('recent-comments', 300);
                }
            });
        });
    }

    $("#add-new-cat").click(function (e) {
        e.preventDefault();
        if ($("input[name=newcategory]").val() == "") {
            $("input[name=newcategory]").trigger("focus");
        } else {
            ajaxData = {
                name: $("input[name=newcategory]").val(),
                parent: $("#cat_parent").val(),
            };
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseURL + "posts__________/addcat",
                data: ajaxData,
                success: function (res) {
                    id = res['id'];
                    if (!res['found']) {
                        if ($("#cat_parent").val()) {
                            re = /^(\s{3,})/;
                            str = $("#cat_parent option:selected").text();
                            myArray = str.match(re);
                            if (Array.isArray(myArray)) {
                                new_option = myArray[1] + "&nbsp;&nbsp;&nbsp;" + $("input[name=newcategory]").val();
                            } else {
                                new_option = "&nbsp;&nbsp;&nbsp;" + $("input[name=newcategory]").val();
                            }

                            $('option[value="' + $("#cat_parent").val() + '"]', $("#cat_parent")).after('<option value="1">' + new_option + '</option>');
                            if ($("input[name='cats[]'][value='" + $("#cat_parent").val() + "']").closest('li').find('ul').length) {
                                $("input[name='cats[]'][value='" + $("#cat_parent").val() + "']").closest('li').children('ul').prepend('<li class="leaf"><span class="daredevel-tree-anchor"></span><div class="checkbox"><label><input type="checkbox" class="i-checks" name="cats[]" value="' + id + '"> <span class="lbl">' + $("input[name=newcategory]").val() + '</span></label></div></li>');
                            } else {

                                $("input[name='cats[]'][value='" + $("#cat_parent").val() + "']").closest('li').switchClass('leaf', 'expanded');
                                $("input[name='cats[]'][value='" + $("#cat_parent").val() + "']").closest('li').children('span').addClass('ui-icon ui-icon-minus');
                                $("input[name='cats[]'][value='" + $("#cat_parent").val() + "']").closest('li').append('<ul><li class="leaf"><span class="daredevel-tree-anchor"></span><div class="checkbox"><label><input type="checkbox" class="i-checks" name="cats[]" value="' + id + '"> <span class="lbl">' + $("input[name=newcategory]").val() + '</span></label></div></li></ul>');
                            }

                        } else {

                            $('option[value="' + $("#cat_parent").val() + '"]', $("#cat_parent")).after('<option value="1">' + $("input[name=newcategory]").val() + '</option>');
                            $('#treeOne').children('ul').prepend('<li class="leaf"><span class="daredevel-tree-anchor"></span><div class="checkbox"><label><input type="checkbox" class="i-checks" name="cats[]" value="' + id + '"> <span class="lbl">' + $("input[name=newcategory]").val() + '</span></label></div></li>');
                        }
                    }

                    $("input[name='cats[]'][value='" + id + "']").prop("checked", true);
                    $("input[name=newcategory]").val("");
                    $("#cat_parent").val("0");
                },
                complete: function () {

                }
            });
        }

    });

    $("input[name='cats[]']").on('ifChanged', function (event) {
        val = $(this).val();
        if ($(this).is(":checked")) {
            $("input[name='mosts[]'][value='" + val + "']").iCheck('check');
        } else {
            $("input[name='mosts[]'][value='" + val + "']").iCheck('uncheck');
        }

    });

    $("input[name='mosts[]']").on('ifChanged', function (event) {
        val = $(this).val()
        if ($(this).is(":checked")) {
            $("input[name='cats[]'][value='" + val + "']").iCheck('check');
        } else {
            $("input[name='cats[]'][value='" + val + "']").iCheck('uncheck');
        }

    });

    $("input[name='writers']").on('ifChanged', function (event) {
        if ($(this).is(":checked")) {
            $("#post_writers").prop('disabled', false);
        } else {
            $("#post_writers").val('').prop('disabled', true);
        }

    });

    $("#publish-edit").click(function (e) {
        e.preventDefault();
        $("#publish-change").show();
        $("select[name=post_status]").trigger("focus");
    });

    $("#publish-cancel").click(function (e) {
        e.preventDefault();
        $("#publish-change").hide();
    });

    $("#change_schedule").click(function (e) {
        e.preventDefault();
        if ($("#bs-datepicker-example").val() == '') {
            $("#schedule-date").html(immediately_lang);
            $("#schedule-name").html(publish_on_lang);
        } else {
            $("#schedule-date").html($("#bs-datepicker-example").val());
            $("#schedule-name").html(schedule_for_lang);
        }

        $("#schedule-select").hide();
    });

    $("#schedule-edit").click(function (e) {
        e.preventDefault();
        $("#schedule-select").show();
    });

    $("#schedule-cancel").click(function (e) {
        e.preventDefault();
        $("#schedule-select").hide();
    });


    $("#change_status").click(function (e) {
        e.preventDefault();
        $("#status").html($("#post_status option:selected").text());
        $("#publish-change").hide();
        if ($("#post_status").val() == 6)
            $("#schedule-wrap").show();
        else
            $("#schedule-wrap").hide();
    });

    $(".tag-add").click(function (e) {
        e.preventDefault();
        tags = $("#tags").val().split(",");
        new_tag = $(this).html();
        found = $.inArray(new_tag, tags) > -1;
        $("#metakeywords").tagit("createTag", new_tag);
        if (!found) {
            $("#tags").val(new_tag + ',' + $("#tags").val())/*.triggerHandler('change')*/;
            //$("#meta_keywords").val($("#meta_keywords").val() + ',' + new_tag);
            $(".tags-show").show();
            $(".tags-show .tag-list").append("<li><span>" + new_tag + "<i data-tag='" + new_tag + "' class='close-tag fa fa-times'></span></li>");
        } else {
            $("input[name=newtag]").trigger("focus");
        }

    });

    $("#add-tag").click(function (e) {
        e.preventDefault();
        tags = $("#tags").val().split(",");
        new_tags = $("#newtag").val().split(",");
        for (i = 0; i < new_tags.length; i++) {
            new_tag = new_tags[i].trim();
            found = $.inArray(new_tag, tags) > -1;
            $("#metakeywords").tagit("createTag", new_tag);
            if (!found) {
                $("#tags").val(new_tag + ',' + $("#tags").val())/*.triggerHandler('change')*/;
                $(".tags-show").show();
                $(".tags-show .tag-list").append("<li><span>" + new_tag + "<i data-tag='" + new_tag + "' class='close-tag fa fa-times'></span></li>");
            } else {
                $("input[name=newtag]").trigger("focus");
            }
        }

        $("#newtag").val("");
    });

    $('.tag-list').on('click', '.close-tag', function (e) {
        e.preventDefault();
        new_tag = $(this).attr('data-tag');
        $(this).parents('li').remove();
        str = $("#tags").val().replace(new_tag + ",", "");
        $("#tags").val(str).triggerHandler('change');
    });

    $("#add_interactive").filemanager({
        types: "ia",
        done: function (files) {
            if (files.length) {
                files.forEach(function (file) {
                    html = "<iframe src='https://dotemirates.s3-eu-west-1.amazonaws.com/interactive/" + file.media_id + "/index.html' width='100%' height='600px'  /><br>";
                    var element = CKEDITOR.dom.element.createFromHtml(html);
                    CKEDITOR.instances['pagecontent'].insertElement(element);
                });
            }
        },
        error: function (media_path) {
            alert(media_path + " ليس ملف تفاعلى");
        }
    });

    $("#add_galleries_in").filemanager({
        types: "image|video|audio|pdf",
        galleries: function (result) {
            result.forEach(function (row) {
                $.post(baseURL + "/galleries/content", {
                    id: row.gallery_id
                }, function (data) {
                    var element = CKEDITOR.dom.element.createFromHtml('<div class="shortcode" name="gallery" id="' + row.gallery_id + '">' + data + '</div>');
                    CKEDITOR.instances['pagecontent'].insertElement(element);
                    $("#has_media").val(row.gallery_type);
                });
            });
        },
        error: function (media_path) {
            alert(media_path + " is not an image");
        }
    });

    $("#add_files").filemanager({
        types: "image|video|audio|pdf",
        done: function (files) {
            if (files.length) {
                files.forEach(function (file) {
                    var html = "";
                    if (file.media_url.split('.').pop() == 'pdf') {
                        html += "<iframe src='" + file.media_url + "' width='100%' height='300px'  /><br>";
                        html += "<a href='" + file.media_url + "' target='_blank'><img src='" + assetsURL + "images/pdf.png' width='30' height='30'></a>";
                        console.log(html);
                    } else {
                        if (file.media_type == 'image') {
                            html += "<img src='" + AMAZON_URL + file.media_free_path + "' id='" + file.media_id + "'> ";
                        } else {
                            html += file.media_embed;
                        }
                    }
                    if (file.media_type == 'image') {
                        if (confirm("هل تريد وضع علامة مائية لهذه الصورة   \n " + file.media_path)) {
                            var watermark = 1;
                        } else {
                            var watermark = 0;
                        }
                        $.post(check_free, {
                            media_path: file.media_path,
                            watermark: watermark
                        }, function (result) {
                            var element = CKEDITOR.dom.element.createFromHtml(html);
                            CKEDITOR.instances['pagecontent'].insertElement(element);
                        });
                    }
                });
            }
        },
        error: function (media_path) {
            alert(media_path + " is not an image");
        }
    });

    $("input[name='post_desked']").on('ifChanged', function (event) {
        if ($(this).is(":checked")) {
            $(this).parent().next(".lbl").css('text-decoration', 'line-through');
            $("input[name='post_submitted']").parent().next(".lbl").css('text-decoration', 'line-through');
            $("input[name='post_submitted']").parent().iCheck('check');
        } else {
            $(this).parent().next(".lbl").css('text-decoration', 'inherit');
        }

    });

    $("input[name='post_submitted']").on('ifChanged', function (event) {
        if ($(this).is(":checked")) {
            $(this).parent().next(".lbl").css('text-decoration', 'line-through');
        } else {
            $(this).parent().next(".lbl").css('text-decoration', 'inherit');
        }
    });

    var temp = 1;
    $("input[name='scheduled']").on('ifChanged', function (event) {

        if ($(this).is(":checked")) {
//            temp = $('#post_status').val();
//            $('#post_status').val('6');
//            $('#post_status').prop('checked', true)
//            $('.switchery').click();
//            setSwitchery(switchery, true);
            $('#schedule-wrap').show();
            setSwitchery(switchery, false);
        } else {
//            setSwitchery(switchery, false);
//            $('#post_status').val(temp);
//            if (temp != 1) {
//
//            }

            $('#schedule-wrap').hide();
        }

    });

    $("#post_status").change(function () {
        if (this.checked) {
            $("input[name='scheduled']").iCheck('uncheck');
            $('#schedule-wrap').hide();
        }
    });

    $('input[type=radio][name=post_format]').on('ifChecked', function (event) {
        if ($(this).val() == 2) {
            $("#featured-wrapper").removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            $("#gallery-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            $("#media-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            $("#editor_content").hide();
            $("#photo_story").show();
            $("#manshet").hide();
        } else if ($(this).val() == 6) {
            $("#featured-wrapper").removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            $("#gallery-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            $("#media-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            $("#editor_content").show();
            $("#manshet").show();
            $("#photo_story").hide();
        } else {
            if ($(this).val() == 3 || $(this).val() == 4) {
                $("#featured-wrapper").removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-6');
                $("#gallery-wrapper").hide()
                $("#media-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-6');
            } else if ($(this).val() == 5) {
                $("#featured-wrapper").removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-6');
                $("#gallery-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-6');
                $("#media-wrapper").hide();
            } else {
                $("#featured-wrapper").removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
                $("#gallery-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
                $("#media-wrapper").show().removeClass('col-md-4').removeClass('col-md-6').addClass('col-md-4');
            }
            $("#editor_content").show();
            $("#photo_story").hide();
            $("#manshet").hide();
        }
    });

    $('#image-div').on('click', '.image_delete', function (e) {
        e.preventDefault();
        new_photo = $(this).attr('id');
        $(this).parents('.comment').remove();
        $("#image_text_" + new_photo).remove();
        str = $("#photos").val().replace(new_photo + ",", "");
        $("#photos").val(str);

        height = 0;
        $("#image-div .comment").each(function () {
            height += $(this).height();
        });

        if (height >= 300) {
            $("#image-div").css('height', '300');
            $("#image-div").parents(".slimScrollDiv").css('height', '300');
        } else {
            $("#image-div").css('height', 'auto');
            $("#image-div").parents(".slimScrollDiv").css('height', 'auto');
        }

        if ($("#photos").val() == '') {
            $("#photo-wrapper").hide();
        } else {
            $(".photo-text:nth-of-type(1)").show();
        }

    });

    $('#image-div').on('click', '.image-wrap', function (e) {
        id = $(this).attr('id');
        $(".photo-text").hide();
        $("#image_text_" + id).show();
    });
    $("#add_image").filemanager({
        types: "image",
        done: function (files) {
            if (files.length) {
                $.each(files, function (i, file) {
                    photos = $("#photos").val().split(',');
                    found = found = $.inArray(String(file.media_id), photos) > -1;
                    upload = "{{URL::to('/uploads')}}";
                    if (!found) {
                        $(".photo-text").hide();
                        $("#image-div").prepend('<div class="comment" style="border-top:none; padding: 5px 0;"><a href="#" class="image_delete" id="' + file.media_id + '"><i class="fa fa-times"></i></a><span class="image-wrap" id="' + file.media_id + '"><img src="' + AMAZON_URL + file.media_small_path + '" style="width: 100%; height: 150px;"></span></div>');
                        $("#photos").val(file.media_id + ',' + $("#photos").val());
                        $("#image-text-wrap").prepend('<textarea class="form-control photo-text" id="image_text_' + file.media_id + '" rows="10" style="resize:none" name="image_text_' + file.media_id + '" cols="50"></textarea>');
                        $("#photo-wrapper").show();
                        height = 0;
                        $("#image-div .comment").each(function () {
                            height += $(this).height();
                        });

                        if (height >= 300) {
                            $("#image-div").css('height', '300');
                            $("#image-div").parents(".slimScrollDiv").css('height', '300');
                        } else {
                            $("#image-div").css('height', 'auto');
                            $("#image-div").parents(".slimScrollDiv").css('height', 'auto');
                        }
                    }
                });

            }

        },
        error: function (media_path) {
            alert(media_path + " is not an image");
        }
    });

    function ytVidId(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    }

    CKEDITOR.instances['pagecontent'].on('paste', function (evt) {
        var data = evt.data.dataValue;
        var id = ytVidId(data);
        if (id) {
            html = '<p><iframe width="420" height="315" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe></p>'
            CKEDITOR.instances['pagecontent'].insertHtml(html);
        }

    });
    CKEDITOR.instances['pagecontent'].on('change', function (evt) {
        back = true;
        amtUpdateDesc();
        amtTestFocusKw();
//        var data = CKEDITOR.instances['pagecontent'].getData();
//
//        if (meta_description) {
//            flag_description = false;
//        }
//
//
//        if (facebook_description) {
//            flag_fb_description = false;
//        }
//
//
//        if (twitter_description) {
//            flag_tw_description = false;
//        }
//
//        if (flag_description) {
//            $("#meta_description").val(string_sanitize(strip_tags(data)));
//        }
//
//        if (flag_fb_description) {
//            $("#facebook_description").val(string_sanitize(strip_tags(data)));
//        }
//
//        if (flag_tw_description) {
//            $("#twitter_description").val(string_sanitize(strip_tags(data)));
//        }
    });

    $("#remove-post-thumbnail").click(function (e) {
        e.preventDefault();
        $("#featured_image").val("").trigger('change');
        $(this).hide();
        $("#image_wrap").hide();
        $(".set-post-thumbnail").show();
        $("#image_post").attr("src", '');
    });
    $(".set-post-thumbnail").filemanager({
        types: "image",
        media_id: function () {
            return $("#featured_image").val();
        },
        done: function (files) {
            if (files.length) {
                var file = files[0];
                console.log(file);
                $("#image_wrap").show();
                $("#set-post-thumbnail").hide();
                $("#remove-post-thumbnail").show();
                $("#featured_image").val(file.media_id).trigger('change');
                $("#image_post").attr("src", AMAZON_URL + file.media_small_path);
            }
        },
        error: function (media_path) {
            alert(media_path + is_not_an_image_lang);
        }
    });
//    $("#remove-facebook-image").click(function (e) {
//        e.preventDefault();
//        $("#facebook_photo").val("");
//        $(this).hide();
//        $("#facebook_image").hide();
//        $("#remove_fb_image").hide();
//        $("#set-facebook-image").css('display', 'block');
//        $("#facebook_image").attr("src", '');
//    });
//    $("#set-facebook-image").filemanager({
//        types: "image",
//        done: function (files) {
//            if (files.length) {
//                var file = files[0];
//                $("#facebook_image").show();
//                $("#set-facebook-image").hide();
//                $("#remove-facebook-image").css('display', 'block');
//                $("#remove_fb_image").show();
//                $("#facebook_photo").val(file.media_id);
//                $("#facebook_image").attr("src", AMAZON_URL + file.media_small_path);
//            }
//        },
//        error: function (media_path) {
//            alert(media_path + is_not_an_image_lang);
//        }
//    });
//    $("#remove_fb_image").click(function (e) {
//        e.preventDefault();
//        $("#remove-facebook-image").click();
//    });
//    $("#remove-twitter-image").click(function (e) {
//        e.preventDefault();
//        $("#twitter_photo").val("");
//        $(this).hide();
//        $("#twitter_image").hide();
//        $("#remove_tw_image").hide();
//        $("#set-twitter-image").css('display', 'block');
//        $("#twitter_image").attr("src", '');
//    });
//    $("#set-twitter-image").filemanager({
//        types: "image",
//        done: function (files) {
//            if (files.length) {
//                var file = files[0];
//                $("#twitter_image").show();
//                $("#set-twitter-image").hide();
//                $("#remove-twitter-image").css('display', 'block');
//                $("#remove_tw_image").show();
//                $("#twitter_photo").val(file.media_id);
//                $("#twitter_image").attr("src", AMAZON_URL + file.media_small_path);
//            }
//        },
//        error: function (media_path) {
//            alert(media_path + is_not_an_image_lang);
//        }
//    });
//    $("#remove_tw_image").click(function (e) {
//        e.preventDefault();
//        $("#remove-twitter-image").click();
//    });
    $("#remove-post-media").click(function (e) {
        e.preventDefault();
        $("#media_file").val("").trigger('change');
        ;
        $(this).hide();
        $("#media_wrap").hide();
        $(".set-post-media").show();
        $("#media_post").attr("src", '');
    });
    $(".set-post-media").filemanager({
        types: "video|audio",
        done: function (files) {
            if (files.length) {
                var file = files[0];
                $("#media_wrap").show();
                $("#set-post-media").hide();
                $("#remove-post-media").show();
                $("#media_file").val(file.media_id).trigger('change');
                ;
                $("#media_post").attr("src", file.media_thumbnail);
            }
        },
        error: function (media_path) {
            alert(media_path + is_not_an_image_lang);
        }
    });
    // edit gallery
    $("#gallery_edit").filemanager({
        gallery_id: function () {
            return $("#post_gallery").val();
        }
    });
    $("#add_comment").click(function (e) {
        e.preventDefault();
        $("#comments_options").hide();
        $(this).parent().hide();
        $(this).parent().next(".form-group").show();
    });
    $("#cancel_comment").click(function (e) {
        e.preventDefault();
        $("#comments_options").show();
        $(this).closest('.form-group').hide();
        $(this).parent().prev(".form-group").show();
    });
    $("#add_note").click(function (e) {
        e.preventDefault();
        $(this).parent().hide();
        $(this).parent().next(".form-group").show();
    });
    $("#cancel_note").click(function (e) {
        e.preventDefault();
        $(this).closest('.form-group').hide();
        $(this).parent().prev(".form-group").show();
    });


    if (post_id) {
        $("input[name=comment_options][value=" + comment_options + "]").prop('checked', true);
        $("input[name=comment_options]").on('ifChanged', function (event) {
            if ($(this).val() == 1) {
                $("#cancel_comment").trigger('click');
                $("#add_comment").attr('disabled', 'true');
            } else {
                $("#add_comment").removeAttr('disabled');
            }
        });
    }

    // edit post

    function strip_tags(input, allowed) {
        allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '')
            .replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
    }

    function string_sanitize(str) {
        return str.replace(/['"&#39;&#34;quot]/g, "");
    }

    $("#closesave").click(function (e) {
        $("#saveandclose").val('1');
    });
    $("#save").click(function (e) {
        $("#saveandclose").val('0');
    });

    $.validator.addMethod("tagsRequired", function (value, element) {
        tags = $("#tags").val().split(",");
        if (tags.length >= 5) {
            return true;
        } else {
            return false;
        }
    }, 'Password and Confirm Password should be same');


    $("#post-form").submit(function (e) {
        back = false;
    });

    $('[name="cats[]"]').change(function () {
        if ($('[name="cats[]"]:checked').length == 0) {
            $("#collapseCategories").addClass('has-error').find('.jquery-validate-error').show().html(one_cats_lang);
        } else {
            $("#collapseCategories").removeClass('has-error').find('.jquery-validate-error').hide();
        }
    });
    $('#related-text').on('input', function () {
        if ($(this).val() == '' || $(this).val().length <= 2) {
            $('#auto-wrap').hide();
            $("#related-search span").html(more_character_lang);
            $("#related-search").show();
            //$("#auto-wrap .item").html('');
        } else {

            ajaxData = {
                q: $(this).val(),
                id: post_id
            };
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseURL + "posts__________/autocomplete",
                data: ajaxData,
                beforeSend: function (res) {
//                    $('#auto-wrap').show();
//                    $("#auto-wrap .item").html('');
//                    $("#related-search").html(search_lang);

                    $("#related-search span").html(search_lang);
                    $("#auto-wrap .feed-activity-list").html('');

                },
                success: function (res) {
                    //$("#auto-wrap .item").html('');
                    if (res != 'notfound') {
                        $.map(res, function (n, i) {
                            $("#auto-wrap .feed-activity-list").prepend('<div style="margin-top:5px; padding-bottom:5px" class="feed-element"><a href="#' + n.post_id + '" class="related-one task-title" >' + n.post_title + '</a></div>');
                        });
                        $('#auto-wrap').show();
                        $("#related-search").hide();
                    } else {
                        //$("#auto-wrap .item").html(no_results_lang);
                        $('#auto-wrap').hide();
                        $("#related-search").show();
                        $("#related-search span").html(notfound_lang);
                    }
                },
                complete: function () {
                    //$("#related-search").html('');
                    scroll_height('auto-wrap', 300, false, true);
                }
            });
        }
    });
    $('#linked-text').on('input', function () {
        if ($(this).val() == '' || $(this).val().length <= 2) {
            $('#auto-linked').hide();
            $("#linked-search span").html(more_character_lang);
            $("#linked-search").show();
            //$("#auto-linked .item").html('');
        } else {

            ajaxData = {
                q: $(this).val(),
                id: post_id
            };
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseURL + "posts__________/autocomplete",
                data: ajaxData,
                beforeSend: function (res) {
//                    $('#auto-linked').show();
//                    $("#auto-linked .item").html('');
//                    $("#linked-search").html(search_lang);

                    $("#linked-search span").html(search_lang);
                    $("#auto-linked .feed-activity-list").html('');

                },
                success: function (res) {
                    //$("#auto-linked .item").html('');
                    if (res != 'notfound') {
                        $.map(res, function (n, i) {
                            $("#auto-linked .feed-activity-list").prepend('<div style="margin-top:5px; padding-bottom:5px" class="feed-element"><a href="#' + n.post_id + '" class="linked-one task-title" >' + n.post_title + '</a></div>');
                        });
                        $('#auto-linked').show();
                        $("#linked-search").hide();
                    } else {
                        //$("#auto-linked .item").html(no_results_lang);
                        $('#auto-linked').hide();
                        $("#linked-search").show();
                        $("#linked-search span").html(notfound_lang);
                    }
                },
                complete: function () {
                    //$("#linked-search").html('');
                    scroll_height('auto-linked', 300, false, true);
                }
            });
        }
    });
    $('#newtag').on('input', function () {
        if ($(this).val() == '' || $(this).val().length <= 2) {
            $('#tag-wrap').hide();
            $("#tag-search span").html(more_character_lang);
            $("#tag-search").show();
            //$("#tag-wrap div").html('');
        } else {
            ajaxData = {
                q: $(this).val(),
            };
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseURL + "posts__________/tagcomplete",
                data: ajaxData,
                beforeSend: function (res) {

                    $("#tag-search span").html(search_lang);
                    $("#tag-wrap .feed-activity-list").html('');
                },
                success: function (res) {
                    if (res != 'notfound') {
                        $.map(res, function (n, i) {
                            $("#tag-wrap .feed-activity-list").prepend('<div class="feed-element" style="margin-top:5px; padding-bottom:5px"><a href=""><div class="media-body "><strong>' + n.tag_name + '</strong></div>');
                        });

                        $('#tag-wrap').show();
                        $("#tag-search").hide();

                    } else {
                        $('#tag-wrap').hide();
                        $("#tag-search").show();
                        $("#tag-search span").html(notfound_lang);

                    }

                },
                complete: function () {
                    scroll_height('tag-wrap', 300);

                }
            });
        }
    });
    $('body').on('click', function () {
        $('#auto-wrap').hide();
        $('#auto-search').hide();
        $('#tag-wrap').hide();
        $('#tag-search').hide();
        $('#auto-linked').hide();
        $('#linked-search').hide();
    });
    $('#auto-linked').on('click', '.linked-one', function (e) {
        e.preventDefault();
        $('#linked-text').val($(this).html());
        $('#linked-temp').val($(this).attr('href').substr(1));
        $('#auto-wrap').hide();
        $('#add-linked-post').removeClass('disabled');
    });
//    $('#auto-linked').find('.item').on('click', '.linked-one', function (e) {
//        e.preventDefault();
//        $('#linked-text').val($(this).html());
//        $('#linked-temp').val($(this).attr('href').substr(1));
//        $('#auto-linked').hide();
//        $('#add-linked-post').removeClass('disabled');
//    });
    $('#tag-wrap .feed-activity-list').on('click', '.feed-element', function (e) {
        e.preventDefault();
        $('#newtag').val($(this).find('strong').html());
        $('#tag-wrap').hide();
    });

    $('#auto-wrap').on('click', '.related-one', function (e) {
        e.preventDefault();
        $('#related-text').val($(this).html());
        $('#related-temp').val($(this).attr('href').substr(1));
        $('#auto-wrap').hide();
        $('#add-related-post').removeClass('disabled');
    });
    $('.todo-list').on('click', '.delete-related-post', function (e) {
        e.preventDefault();
        delete_post = $(this).attr('href').substr(1);
        str = $("#related-posts__________").val().replace(delete_post + ",", "");
        $("#related-posts__________").val(str);
        $(this).parent().remove();
        posts = $("#related-posts__________").val().split(",");
        if (posts.length - 1 == 10) {
            $('#related-text').prop("disabled", true);
        } else {
            $('#related-text').prop("disabled", false);
        }

        scroll_height('related-add', 300, true);
    });
    $('.todo-list').on('click', '.check-link', function (e) {
        e.preventDefault();
        if ($(this).find('.fa').hasClass('fa-square-o')) {
            $(this).find('.fa').removeClass('fa-square-o').addClass('fa-check-square');
            $(this).next('span').addClass('todo-completed');
        } else {
            $(this).find('.fa').removeClass('fa-check-square').addClass('fa-square-o');
            $(this).next('span').removeClass('todo-completed');
        }

    });
    $('#add-related-post').click(function (e) {
        e.preventDefault();
        posts = $("#related-posts__________").val().split(",");
        new_post = $('#related-temp').val();
        found = $.inArray(new_post, posts) > -1;
        if (!found) {

            $("#related-posts__________").val(new_post + ',' + $("#related-posts__________").val());
            $('#related-add').find('ul').prepend('<li class="feed-element" style="margin-top:5px"><a class="check-link" href="#"><i data-id="' + new_post + '" class="fa fa-square-o"></i> </a><span class="m-l-xs">' + $('#related-text').val() + '</span><a class="label label-danger pull-right delete-related-post" href="#' + new_post + '"><i class="fa fa-times"></i></a></li>');
        } else {
            $("#related-text").trigger("focus");
        }

        posts = $("#related-posts__________").val().split(",");
        if (posts.length - 1 == 10) {
            $('#related-text').prop("disabled", true);
        }

        $(this).addClass('disabled');
        $('#related-text').val('');
        $('#related-add').next().show();
        $('#related-add').show();
        scroll_height('related-add', 300);
    });
    $('#clear-completed-tasks').click(function (e) {
        e.preventDefault();
        $('.todo-list li').find('.check-link').find('.fa').each(function () {
            if ($(this).hasClass("fa-check-square")) {
                delete_post = $(this).attr('data-id');
                str = $("#related-posts__________").val().replace(delete_post + ",", "");
                $("#related-posts__________").val(str);
                posts = $("#related-posts__________").val().split(",");
                if (posts.length - 1 == 10) {
                    $('#related-text').prop("disabled", true);
                } else {
                    $('#related-text').prop("disabled", false);
                }
                $(this).parents('li').remove();
                scroll_height('related-add', 300, true);
            }
        });
    });

    $('.todo-list').on('click', '.delete-linked-post', function (e) {
        e.preventDefault();
        delete_post = $(this).attr('href').substr(1);
        str = $("#linked-posts__________").val().replace(delete_post + ",", "");
        $("#linked-posts__________").val(str);
        $(this).parent().remove();
        posts = $("#linked-posts__________").val().split(",");
        if (posts.length - 1 == 10) {
            $('#linked-text').prop("disabled", true);
        } else {
            $('#linked-text').prop("disabled", false);
        }

        scroll_height('linked-add', 300, true);
    });
    $('#add-linked-post').click(function (e) {
        e.preventDefault();
        posts = $("#linked-posts__________").val().split(",");
        new_post = $('#linked-temp').val();
        found = $.inArray(new_post, posts) > -1;
        if (!found) {

            $("#linked-posts__________").val(new_post + ',' + $("#linked-posts__________").val());
            $('#linked-add').find('.todo-list').prepend('<li class="feed-element" style="margin-top:5px"><a class="check-link feed-element" href="#"><i data-id="' + new_post + '" class="fa fa-square-o"></i> </a><span class="m-l-xs">' + $('#linked-text').val() + '</span><a class="label label-danger pull-right delete-linked-post" href="#' + new_post + '"><i class="fa fa-times"></i></a></li>');
        } else {
            $("#linked-text").trigger("focus");
        }

        posts = $("#linked-posts__________").val().split(",");
        if (posts.length - 1 == 10) {
            $('#linked-text').prop("disabled", true);
        }

        $(this).addClass('disabled');
        $('#linked-text').val('');
        $('#linked-add').next().show();
        $('#linked-add').show();
        scroll_height('linked-add', 300);
    });
    $('#clear-linked-tasks').click(function (e) {
        e.preventDefault();
        $('.todo-list li').find('.check-link').find('.fa').each(function () {
            if ($(this).hasClass("fa-check-square")) {
                delete_post = $(this).attr('data-id');
                str = $("#linked-posts__________").val().replace(delete_post + ",", "");
                $("#linked-posts__________").val(str);
                posts = $("#linked-posts__________").val().split(",");
                if (posts.length - 1 == 10) {
                    $('#linked-text').prop("disabled", true);
                } else {
                    $('#linked-text').prop("disabled", false);
                }
                $(this).parents('li').remove();
                scroll_height('linked-add', 300, true);
            }
        });
    });
//    $('#meta_title').on('input', function () {
//        back = true;
//        flag_title = false;
//    });
    $('#meta_keywords').on('input', function () {
        back = true;
        flag_keywords = false;
    });
//    $('#meta_description').on('input', function () {
//        back = true;
//        flag_description = false;
//    });
//    $('#facebook_title').on('input', function () {
//        back = true;
//        flag_fb_title = false;
//    });
//    $('#facebook_description').on('input', function () {
//        back = true;
//        flag_fb_description = false;
//    });
//    $('#twitter_description').on('input', function () {
//        back = true;
//        flag_tw_description = false;
//    });
    $('#save_draft').click(function (e) {
        e.preventDefault();
        $('#draft_status').val('4');
        $('#post_status').prop('checked', false)
        $('#post_status').parent().removeClass('checked');
        $("#post-form").submit();
    });

    if (!post_id) {

        $('#post_title').focusout(function () {
            $this = $(this);
            if ($this.val() != '' && flag_focus) {
                ajaxData = {
                    post_title: $this.val(),
                    post_type: $("#post_type").val(),
//                    meta_title: $("#meta_title").val(),
//                    facebook_title: $("#facebook_title").val(),
                    cat_id: $("#curr_cat").val()
                };
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: baseURL + "posts__________/addpost",
                    data: ajaxData,
                    beforeSend: function (res) {
                        $("#save_load").show();
                        $("#save").addClass('disabled');
                        $("#closesave").addClass('disabled');
                    },
                    success: function (res) {
                        if (res == 'found') {
                            $("#post_title").parent().next().html(repeated_lang).show();
                        } else {
                            $('#post-form').attr('action', baseURL + "posts__________/" + res.id);
                            $('#post-form').append('<input name="_method" type="hidden" value="PUT">');
                            console.log(res.id);
                            flag_focus = false;
                            $("#post_id").val(res.id);
                            $("input[name=post_format][value=6]").iCheck('enable');
                            $(".inside").show();
                            $('#new-post-slug').val(res.slug);
                            $('#editable-post-name-full').html(res.slug);
                            $('#slug_name').html(res.slug);
                            $('#wpseosnippet_slug').html(res.slug);
                            $('#wpseosnippet_title').html(sitename);
                        }
                    },
                    complete: function () {
                        $("#save_load").hide();
                        $("#save").removeClass('disabled');
                        $("#closesave").removeClass('disabled');
                    }
                });
            }
        });
    }

    $('#post_title').on('input', function () {
        back = true;

        $('#title_count').html($('#post_title').val().length);
//        if (meta_title) {
//            flag_title = false;
//        }
//
//        if (facebook_title) {
//            flag_fb_title = false;
//        }
//
//        if (flag_title) {
//            $("#meta_title").val(string_sanitize($(this).val()));
//        }
//
//        if (flag_fb_title) {
//            $("#facebook_title").val(string_sanitize($(this).val()));
//        }
    });
    $('#post_excerpt').on('input', function () {
        back = true;
        $('#excerpt_count').html($('#post_excerpt').val().length);
        amtUpdateDesc();
    });
    $('#featured_image').on('change', function () {
        back = true;
    });


    $('#tags').on('change', function () {
        str = $(this).val();
        str = str.substring(0, str.length - 1);
        if (meta_keywords) {
            flag_keywords = false;
        }

        if (flag_keywords) {
            $("#meta_keywords").val(str);
        }
    });

    $("#manshet-wrapper").on('mouseover', '.manshet', function (e) {
        $(".save_manshet").hide();
        $(this).find('.save_manshet').show();
    });

    $("#manshet-wrapper").on('click', '.remove-manshet', function (e) {

        manshet = $(this).parents('.manshet');
        id = $(this).parents('.manshet').attr('data-id');
        if (id) {
            ajaxData = {
                id: id,
            };
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseURL + "posts__________/deletemanshet",
                data: ajaxData,
                beforeSend: function (res) {

                },
                success: function (res) {

                },
                complete: function () {

                }
            });
        }
        manshet.remove();
        scroll_height('manshet-wrapper', 330);

    });

    $("#manshet-wrapper").on('click', '.save_manshet', function (e) {
        title = $(this).parents('.manshet').find('.manshet_title').val();
        link = $(this).parents('.manshet').find('.manshet_link').val();
        id = $(this).parents('.manshet').attr('data-id');
        manshet = $(this).parents('.manshet');
        save_click = $(this);

        if (title == '') {
            $(this).parents('.manshet').find('.manshet_title').parent().next().html(required_lang).show();
            return false;
        } else {
            $(this).parents('.manshet').find('.manshet_title').parent().next().hide();
        }
        var filter = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if (!filter.test(link) && link != '') {
            $(this).parents('.manshet').find('.manshet_link').parent().next().html(invalid_lang).show();
            return false;
        } else {
            $(this).parents('.manshet').find('.manshet_link').parent().next().hide();
        }

        ajaxData = {
            post_id: $('#post_id').val(),
            title: title,
            link: link,
            id: id,
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: baseURL + "posts__________/addmanshet",
            data: ajaxData,
            beforeSend: function (res) {
                save_click.addClass('disabled');
                save_click.next().show();
            },
            success: function (res) {
                manshet.attr('data-id', res[0]);
                if (!id) {
                    manshet.find('.time-div').html(res[1]).show();
                }
                save_click.removeClass('disabled');
                save_click.next().hide();
            },
            complete: function () {

            }
        });
    });

    $("#manshet-wrapper").on('input', '.manshet_link', function (e) {
        value = decodeURIComponent($(this).val());
        $(this).val(value);
    });

    $("#add_manshet").click(function (e) {
        e.preventDefault();
        $("#manshet-wrapper").show();
        $(".manshets").prepend('<div class="manshet row feed-element" style="border-bottom: 1px solid #e7eaec; margin:10px 0" data-id="">' +
            '<div class="row">' +
            '<div class="panel-group col-md-10" style="margin:0">' +
            '<div class="form-group input-group">' +
            '<span class="input-group-addon"><i class="fa fa-newspaper-o"></i></span>' +
            '<textarea style="resize: vertical;" name="manshet_title" class="form-control manshet_title" placeholder="' + title_lang + '" rows="3"></textarea>' +
            '</div>' +
            '<label class="error" for="manshet_title" style="display:none">' + required_lang + '</label>' +
            '</div>' +
            '<div class="panel-group col-md-2" style="margin:0">' +
            '<span class="label label-pa-purple time-div" style="display:none"></span>' +
            '<a class="remove-manshet" style="margin: 10px">' +
            '<i class="fa fa-times"></i>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="panel-group col-md-10" style="margin:0">' +
            '<div class="form-group input-group">' +
            '<span class="input-group-addon"><i class="fa fa-link"></i></span>' +
            '<input name="manshet_link" value="" class="form-control manshet_link" placeholder="' + link_lang + '">' +
            '</div>' +
            '<label class="error" for="manshet_link" style="display:none">' + invalid_lang + '</label>' +
            '</div>' +
            '<div class="panel-group col-md-2" style="margin:0">' +
            '<div>' +
            '<a class="btn btn-primary save_manshet" style="display: none;">' + save_lang + '</a>' +
            '<img src="' + assetsURL + 'images/loader.gif" class="manshet_load" style="display:none">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        scroll_height('manshet-wrapper', 330);
    });

    //scroll_manshet('manshet-wrapper', 330);
    function scroll_manshet(id, max) {
        height = 0;
        //console.log(max);
        $("#" + id + " .manshets").find('.manshet').each(function () {
            height += $(this).outerHeight();
        });
        console.log(height);
        if (height >= max) {
            $("#" + id).css('height', max);
        } else if (height == 0) {
            $("#" + id).hide();
        } else {
            $("#" + id).css('height', 'auto');
        }
    }


//    slimscroll_height('linked-add');
//    slimscroll_height('related-add');

    function slimscroll_height(id) {
        height = 0;
        $("#" + id + " ul").find('li').each(function () {
            height += $(this).outerHeight();
            console.log(height);
        });
        console.log(height);
        if (height >= 300) {
            $("#" + id).css('height', '300');
        } else if (height == 0) {
            $("#" + id).hide();
            $("#" + id).next('.panel-footer').hide();
        } else {
            $("#" + id).css('height', 'auto');
        }
    }

    scroll_height('recent-updates', 180)
    scroll_height('recent-notes', 180);
    scroll_height('recent-comments', 300);
    scroll_height('related-add', 300);
    scroll_height('linked-add', 300);
    scroll_height('manshet-wrapper', 330);
    if (mongo_id) {
        scroll_height('note_content', 400)
    }

    function scroll_height(id, max, footer, auto) {
        height = 0;
        //console.log(max);
        $("#" + id + " .full-height-scroll").find('.feed-element').each(function () {
            height += $(this).outerHeight();
            //console.log(height);
        });
        //console.log(height);
        if (height >= max) {
            $("#" + id).css('height', max);
        } else if (height == 0) {
            $("#" + id).hide();
            if (footer) {
                $("#" + id).next('.panel-footer').hide();
            }
        } else {
            if (auto) {
                $("#" + id).css('height', 'auto');
            } else {
                $("#" + id).css('height', height + 10);
            }
        }
    }

    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {
            allow_single_deselect: true
        },
        '.chosen-select-no-single': {
            disable_search_threshold: 10
        },
        '.chosen-select-no-results': {
            no_results_text: notfound_lang
        },
        '.chosen-select-width': {
            width: "95%"
        }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem);

    function setSwitchery(switchElement, checkedBool) {
        if ((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
            switchElement.setPosition(true);
            switchElement.handleOnchange(true);
        }
    }

});

$(window).load(function () {
//    $('#robots_advanced_chosen').css('width', 'inherit');
//    $('#robots_advanced_chosen input').css('width', 'inherit');
//    $('#metafocus li.tagit-new').css("cssText", "width: inherit !important;");
//    $('#metakeywords li.tagit-new').css("cssText", "width: inherit !important;");

    // slug
    $('.edit_slug').click(function (e) {
        e.preventDefault();
        $('.edit_slug').hide();
        $('#permalink_ok').show();
        $('#permalink_cancel').show();
        $('#slug_name').hide();
        $('#new-post-slug').show();
    });

    $('#permalink_cancel').click(function (e) {
        e.preventDefault();
        $(this).hide();
        $('#permalink_ok').hide();
        $('.edit_slug').show();
        $('#new-post-slug').hide();
    });

    $('#permalink_ok').click(function (e) {
        e.preventDefault();
        ajaxData = {
            slug: $("#new-post-slug").val(),
            id: post_id
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: baseURL + "posts__________/newSlug",
            data: ajaxData,
            beforeSend: function (res) {

            },
            success: function (res) {
                $("#slug_name").html(res);
                $("#editable-post-name-full").html(res);
                //$("#wpseosnippet_slug").html(res);
                $("#new-post-slug").val(res).hide();
                $('#permalink_ok').hide();
                $('#permalink_cancel').hide();
                $('.edit_slug').show();
                postURL = baseURL2 + "/details/" + res;
                amtUpdateURL();
            },
            complete: function () {

            }
        });
    });
});

