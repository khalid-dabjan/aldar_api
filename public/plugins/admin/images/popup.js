/*jslint unparam: true */

/*global window, $ */
$(function () {
    'use strict';
    // Change this to the location of your server-side upload handler:
    $('#fileupload').fileupload({
        url: baseURL + 'media/upload',
        dropZone: [$("#dropzonejs-example"), $(".media-grid")],
        drop: function (e, data) {
            $(".media-grid-wrapper").removeClass("dragdrop");
        },
        dragleave: function (e) {
            $(".media-grid-wrapper").removeClass("dragdrop");
        },
        dragover: function (e) {
            $(".media-grid-wrapper").addClass("dragdrop");
        },
        dataType: 'json',
        done: function (e, data) {

            if (data.result.error !== undefined) {
                $(".upload_errors").html(
                    '<div class="alert alert-danger alert-dark">'
                    + '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'
                    + data.result.error
                    + '</div>'
                );
            }

            $.each(data.result.files, function (index, file) {
                $('a[href="#library-area"]').tab('show');
                $('.media-grid').prepend(file.html);
                activate_media(file.id);
                $('.current-uploading-file').text(file.name);
            });

            var progress = parseInt(data.loaded / data.total * 100, 10);
            if (progress == 100) {
                $('#progress .progress-bar').css('width', '0%');
                $('.current-uploading-file').text("Done");
            }
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css('width', progress + '%');
            $('.current-uploading-rate').text(progress + '%');
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');


    $(function () {
        'use strict';
        // Change this to the location of your server-side upload handler:
        $('#add_to_gallery').fileupload({
            url: baseURL + 'media/upload',
            dropZone: [$("#galleries-content")],
            drop: function (e, data) {
                $(".media_rows").removeClass("dragdrop");
            },
            dragleave: function (e) {
                $(".media_rows").removeClass("dragdrop");
            },
            dragover: function (e) {
                $(".media_rows").addClass("dragdrop");
            },
            dataType: 'json',
            done: function (e, data) {


                if (data.result.error !== undefined) {
                    $(".upload_errors").html(
                        '<div class="alert alert-danger alert-dark">'
                        + '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'
                        + data.result.error
                        + '</div>'
                    );
                }

                $.each(data.result.files, function (index, file) {

                    $("#galleries-content .media_rows").prepend('<div class="media_row">'
                        + '<input type="hidden" value="' + file.id + '" name="media_id[]">'
                        + '<a href="#" class="media_row_delete">'
                        + '<i class="fa fa-times"></i>'
                        + '</a>'
                        + '<img src="' + file.thumbnail + '">'
                        + '<label>' + file.title + '</label>'
                        + '</div>');

                    $('.media-grid').prepend(file.html);
                    $('.current-uploading-file').text(file.name);
                });

                var progress = parseInt(data.loaded / data.total * 100, 10);
                if (progress == 100) {
                    $('#progress .progress-bar').css('width', '0%');
                    $('.current-uploading-file').text("Done");
                }

            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css('width', progress + '%');
                $('.current-uploading-rate').text(progress + '%');
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');


    });


    // Media link


    $("#mediaform").submit(function () {
        var base = $(this);

        var button = base.find("input[type=submit]").first();
        var link = base.find("input[name=link]").first().val();

        if (link == "") {
            alert("Please type a media link");
            return false;
        }

        button.button('loading');
        $.post(baseURL + "media/link", base.serialize(), function (file) {

            if (file.error) {
                alert(file.error);
            } else {
                button.button('reset');
                $('a[href="#library-area"]').tab('show');
                $('.media-grid').prepend(file.html);
                activate_media(file.id);
                $('.current-uploading-file').text(file.name);
            }

        }, "json");

        return false;
    });

    // Activate box
    var activate_media = function (id) {

        var base = $(".dz-preview[media-id=" + id + "]");
        // base.addClass("active");

        // send details to form
        var media_id = base.children("[name=media_id]").val();
        var media_path = base.children("[name=media_path]").val();
        var media_url = base.children("[name=media_url]").val();
        var media_type = base.children("[name=media_type]").val();

        var media_provider = base.children("[name=media_provider]").val();
        var media_provider_id = base.children("[name=media_provider_id]").val();
        var media_size = base.children("[name=media_size]").val();
        var media_duration = base.children("[name=media_duration]").val();
        var media_title = base.children("[name=media_title]").val();
        var media_thumbnail = base.children("[name=media_thumbnail]").val();
        var media_description = base.children("[name=media_description]").val();
        var media_created_date = base.children("[name=media_created_date]").val();
        var media_motive = base.children("[name=media_motive]").val();

        $(".media-form [name=file_id]").val(media_id);
        $(".details-box-image img").attr("src", media_thumbnail);

        if (media_provider == "") {
            $(".details-box-name .file_name").text(media_path);
        } else {
            $(".details-box-name .file_name").text(media_title);
        }


        if (media_motive == 1) {

            //$(".motive_switcher").show();


            $("#file_motive").val(1);
            if (!$("#file_motive").parent("div").hasClass("checked")) {
                $("#file_motive").parent("div").addClass("checked");
            }
        } else {
            //$(".motive_switcher").hide();
            $("#file_motive").val(0);
            if ($("#file_motive").parent("div").hasClass("checked")) {
                $("#file_motive").parent("div").removeClass("checked");
            }
        }

        $(".details-box-name .file_date").text(media_created_date);
        $(".details-box-name .file_size").text(media_size);
        $(".details-box-name .file_duration").text(media_duration);


        $("#file_type").val(media_type);
        $("#file_provider").val(media_provider);
        $("#file_provider_id").val(media_provider_id);
        $("#file_url").val(media_url);
        $("#file_title").val(media_title);

        $("#file_description").val(media_description);
        $(".media-wrapper").removeClass("non-editable");

        $('#delete_selected_media').removeClass("disabled");
        $('#select_media').removeClass("disabled");

    }

    $("body").on("click", ".dz-preview", function (e) {
        var base = $(this);

        $(".gallery_row").removeClass("active");

        if (e.ctrlKey) {
            if (base.hasClass("active")) {
                base.removeClass("active");
            } else {
                base.addClass("active")
                //$(".dz-preview").removeClass("active");
            }
        } else {
            if (base.hasClass("active")) {
                $(".dz-preview").removeClass("active");
            } else {
                $(".dz-preview").removeClass("active");
                base.addClass("active");
            }
        }
        //return;

        if ($(".dz-preview.active").length == 1) {
            activate_media(base.attr("media-id"));
        } else {
            $(".media-wrapper").addClass("non-editable");
        }

        if ($(".dz-preview.active").length >= 1) {
            $('#delete_selected_media').removeClass("disabled");
            $('#select_media').removeClass("disabled");
        } else {
            $('#delete_selected_media').addClass("disabled");
            $('#select_media').addClass("disabled");
        }

    });


    // galleries


    $("body").on("click", ".media_row_delete", function (e) {
        var base = $(this);
        if (confirm("Do you want to delete this file from gallery?")) {
            base.button('loading');
            base.parents(".media_row").slideUp(function () {
                base.parents(".media_row").remove();
                base.button('reset');
            })
        }
    });
    $("#save_gallery").click(function () {
        var base = $(".gallery_form");
        $("#save_gallery").button('loading');
        $.post(baseURL + "galleries/save", base.serialize(), function (data) {
            $("#save_gallery").button('reset');
        });


        return false;
    });

    $("body").on("click", "#delete_gallery", function (e) {
        var base = $(this);

        if (confirm("Do you want to delete this gallery?")) {
            var gallery_id = base.attr("gallery-id");

            var next_gallery = null;
            var next = $(".gallery_row.active").next().attr("gallery-id");
            if (next != undefined) {
                next_gallery = next;
            } else {
                var next = $(".gallery_row.active").prev().attr("gallery-id");
                if (next != undefined) {
                    next_gallery = next;
                }
            }

            $(".media_loader").hide();

            $.post(baseURL + "galleries/delete", {id: gallery_id}, function (data) {
                $(".gallery_row.active").remove();
                if (next_gallery != null) {
                    activate_gallery(next_gallery);
                }
            });
        }

    });

    var activate_gallery = function (gallery_id) {

        var base = $(".gallery_row[gallery-id=" + gallery_id + "]");

        //$(".gallery_row").removeClass("active");
        base.addClass("active");

        var gallery_name = base.find(".gallery_details_name").first().text();

        $(".gallery_name").html(gallery_name);
        $("#save_gallery").attr("gallery-id", gallery_id);
        $("#delete_gallery").attr("gallery-id", gallery_id);
        $("#gallery_id").val(gallery_id);
        $.post(baseURL + "galleries/files", {id: gallery_id}, function (data) {
            $("#galleries-content").html(data);
            $(".media_loader").hide();
        });

    }


    $("body").on("click", ".gallery_row", function (e) {
        var base = $(this);

        $(".media_loader").show();

        $(".dz-preview").removeClass("active");
        $(".media-wrapper").addClass("non-editable");

        if (e.ctrlKey) {
            if (base.hasClass("active")) {
                base.removeClass("active");
            } else {
                base.addClass("active")
            }
        } else {
            if (base.hasClass("active")) {
                $(".gallery_row").removeClass("active");
            } else {
                $(".gallery_row").removeClass("active");
                base.addClass("active");
            }
        }


        if ($(".gallery_row.active").length >= 1) {
            $('#select_media').removeClass("disabled");
            $('#delete_selected_media').removeClass("disabled");
        } else {
            $('#delete_selected_media').addClass("disabled");
            //$('#delete_selected_media').addClass("disabled");
            $('#select_media').addClass("disabled");
        }

        var gallery_id = base.attr("gallery-id");
        activate_gallery(gallery_id);

    });


    $(".search_galleries").submit(function () {
        var base = $(this);
        var q = base.find("[name=q]").eq(0).val();
        $(".media_loader").show();
        var page = 1;
        $('#galleries-sidebar').attr("page", page);
        $.post(baseURL + "galleries/get/" + page + "?q=" + q, function (data) {
            if (data != "") {
                $('#galleries-sidebar').html(data);
                $('#galleries-sidebar').attr("page", 2);
            }
            $(".media_loader").hide();

        });

        return false;
    });

    $('#galleries-sidebar').bind('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            var page = parseInt($('#galleries-sidebar').attr("page"));
            var q = $(".search_galleries").find("[name=q]").eq(0).val();
            $(".media_loader").show();
            $.post(baseURL + "galleries/get/" + page + "?=" + q, function (data) {
                if (data != "") {
                    $('#galleries-sidebar').html(data);
                    $('#galleries-sidebar').attr("page", page + 1);
                }
                $(".media_loader").hide();
            });
        }
    });


    $(".search_media").submit(function () {
        var base = $(this);
        var q = base.find("[name=q]").eq(0).val();
        var type = base.find("[name=type]").eq(0).val();
        if (base.find("input[name=motive]").eq(0).parent("div").hasClass("checked")) {
            var motive = 1;
        } else {
            var motive = 0;
        }

        $(".media_loader").show();
        $.get(baseURL + "media/get/1/" + type + "/" + q + "?motive=" + motive, function (data) {
            if (data == "") {
                alert("No result for '" + q + "'");
            } else {
                $('.media-grid').html(data);
                $('a[href="#library-area"]').tab('show');
            }
            $(".media_loader").hide();
        });

        return false;
    });

    $(".media-form").submit(function () {
        var base = $(this);
        $('#save_media').button('loading');

        var media_id = base.find("[name=file_id]").eq(0).val();
        var file_title = base.find("[name=file_title]").eq(0).val();
        var file_description = base.find("[name=file_description]").eq(0).val();

        if ($("#file_motive").parent("div").hasClass("checked")) {
            var file_motive = 1;
            base.find("[name=file_motive]").eq(0).val(1);
        } else {
            var file_motive = 2;
            base.find("[name=file_motive]").eq(0).val(0);
        }

        $.post(baseURL + "media/save", base.serialize(), function (data) {
            $('#save_media').button('reset');
            $(".dz-preview[media-id=" + media_id + "]").children("[name=media_title]").val(file_title);
            $(".dz-preview[media-id=" + media_id + "]").children("[name=media_description]").val(file_description);
            $(".dz-preview[media-id=" + media_id + "]").children("[name=media_motive]").val(file_motive);
        });

        return false;
    });


    $("#download_media").click(function () {
        var base = $(this);
        var url = $("#file_url").val();
        location.href = url;
        return false;
    });

    var delete_media = function (media_id, media_path, func) {
        $.post(baseURL + "media/delete", {media_id: media_id, media_path: media_path}, function (data) {
            func(data);
        });
    }


    $("[href=#upload-area]").click(function () {
        $("#delete_selected_media").hide();
        return true;
    });

    $("[href=#embed-settings]").click(function () {
        $("#delete_selected_media").hide();
        return true;
    });

    $("[href=#library-area]").click(function () {
        $("#delete_selected_media").show();
        return true;
    });
    $("[href=#galleries-area]").click(function () {
        $("#delete_selected_media").show();
        $(".gallery_row").removeClass("active");
        if ($(".gallery_row").first().length) {
            var gallery_id = $(".gallery_row").first().attr("gallery-id");
            activate_gallery(gallery_id);
        }

        return true;
    })

    $("#delete_selected_media").click(function () {
        var base = $(this);
        if (confirm("Are you sure to delete (" + $(".dz-preview.active").length + ") files?")) {
            base.button('loading');
            $(".dz-preview.active").each(function () {
                var media_id = $(this).attr("media-id");
                var media_path = $(this).children("input[name=media_path]").val();
                delete_media(media_id, media_path, function () {
                    $("[media-id=" + media_id + "]").remove();

                    base.addClass("disabled");
                    $(".media-wrapper").addClass("non-editable");
                });
                base.button('reset');
            });


        }
        return false;

    });

    $("#delete_media").click(function () {
        var base = $(this);

        var media_id = $(".media-form").find("[name=file_id]").eq(0).val();
        var media_path = $(".details-box-name .file_name").text();

        if (confirm("Are you sure to delete file?")) {
            $('#delete_media').button('loading');
            delete_media(media_id, media_path, function () {
                $("[media-id=" + media_id + "]").remove();
                $('#delete_media').button('reset');
                $(".media-wrapper").addClass("non-editable");

            });
        }
        return false;
    });

    $('.media-grid-wrapper').bind('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            var page = parseInt($(".media-grid-page").val());
            var type = $(".media-grid-type").val();
            var q = $(".search_media").find("[name=q]").eq(0).val();
            page = page + 1;
            $(".media-grid-page").val(page);
            $(".media_loader").show();
            $.post(baseURL + "media/get/" + page + "/" + type + "/" + q, function (data) {
                $('.media-grid').append(data);
                $(".media_loader").hide();
            });
        }
    });
});

$(".file_manager_close").click(function () {
    $(".file_manager").slideUp(function () {
        $(".cinema").hide();
    });
    return false;
});

$(".cinema").click(function () {
    $(".file_manager").slideUp(function () {
        $(".cinema").hide();
    });
    return false;
});


$(".filter-bar a").click(function () {
    var base = $(this);
    $(".media_loader").show();
    $(".filter-bar a").removeClass("active");
    base.addClass("active");

    var media_type = base.attr("media-type");
    $(".search_media").find("[name=type]").eq(0).val(media_type);
    $(".media-grid-type").val(media_type);


    if (media_type == "image" || media_type == "all") {
        $(".motive_switcher").show();
    } else {
        $(".motive_switcher").hide();
    }


    $.post(baseURL + "media/get/1/" + media_type, function (data) {

        if (data != "") {
            $('.media-grid').html(data);
        } else {
            $('.media-grid').html("<div class='well' style='margin-top: 34px;'>لا توجد ملفات</div>");
        }

        $(".media_loader").hide();

    });

    return false;
});


(function ($) {
    $.fn.filemanager = function (options) {
        var base = this;
        var settings = $.extend({
            types: null,
            done: function (files) {
                console.log(files);
            },
            galleries: function (result) {
                console.log(result);
            },
            error: function (media_path) {
                alert("Invalid file format \n" + media_path + "\n" + "please select a file of these types: " + settings.types);
            }
        }, options);

        this.bind("click", function () {

            if ($('.media-grid').html() == "") {
                $(".media_loader").show();
                $.post(baseURL + "media/get", function (data) {
                    $('.media-grid').html(data);
                    $(".media_loader").hide();
                });
            }

            $(".cinema").show();
            $(".file_manager").slideDown();
            $("#select_media").bind("click", function () {

                if ($(".gallery_row.active").length) {
                    var galleries = []
                    $(".gallery_row.active").each(function (i) {
                        var base = $(this);
                        var gallery = {};
                        gallery.gallery_id = base.attr("gallery-id");
                        gallery.gallery_type = base.attr("gallery-type");
                        galleries[i] = gallery;
                    });
                    settings.galleries(galleries);
                }

                if ($(".dz-preview.active").length) {
                    var files = [];
                    $(".dz-preview.active").each(function (i) {

                        var file = {};
                        var base = $(this);
                        file.media_path = base.children("[name=media_path]").val();
                        file.media_type = base.children("[name=media_type]").val();

                        // check file type
                        var error = false;
                        if (settings.types != null) {
                            var types = settings.types.toLowerCase().split("|");
                            var file_type = file.media_path.toLowerCase().split('.').pop();
                            if (types.indexOf(file_type) == -1 && types.indexOf(file.media_type) == -1) {
                                error = true;
                                settings.error(file.media_path);

                            }
                        }

                        if (!error) {
                            file.media_id = parseInt(base.children("[name=media_id]").val());
                            file.media_provider = base.children("[name=media_provider]").val();
                            file.media_provider_id = base.children("[name=media_provider_id]").val();
                            file.media_provider_image = base.find("img").first().attr("src");
                            file.media_type = base.children("[name=media_type]").val();
                            file.media_url = base.children("[name=media_url]").val();
                            file.media_size = base.children("[name=media_size]").val();
                            file.media_path = base.children("[name=media_path]").val();
                            file.media_duration = base.children("[name=media_duration]").val();
                            file.media_title = base.children("[name=media_title]").val();
                            file.media_thumbnail = base.children("[name=media_thumbnail]").val();
                            file.media_description = base.children("[name=media_description]").val();
                            file.media_created_date = base.children("[name=media_created_date]").val();

                            // get embed settings

                            var embed_form = $(".embed_settings");

                            var embed_width = embed_form.find("[name=embed_width]").first().val();

                            if (embed_width == "") {
                                embed_width = "100%";
                            } else {
                                embed_width = embed_width + "px";
                            }

                            var embed_height = embed_form.find("[name=embed_height]").first().val();

                            if (embed_height == "") {
                                embed_height = "350px";
                            } else {
                                embed_height = embed_height + "px";
                            }

                            if (embed_form.find("[name=embed_autoplay]").first().is(":checked")) {
                                embed_autoplay = true;
                            } else {
                                embed_autoplay = false;
                            }

                            var embed_start = embed_form.find("[name=embed_start]").first().val();

                            if (file.media_provider == "youtube") {

                                var code = '<iframe width="' + embed_width + '" height="' + embed_height + '" ';
                                if (embed_autoplay) {
                                    var url = '//www.youtube.com/embed/' + file.media_provider_id + "?autoplay=1&start=" + embed_start;
                                } else {
                                    var url = '//www.youtube.com/embed/' + file.media_provider_id + "?start=" + embed_start;
                                }
                                code = code + 'src="' + url + '" frameborder="0" allowfullscreen></iframe>';

                                file.media_embed = code;

                            } else if (file.media_provider == "soundcloud") {
                                var code = '<iframe scrolling="no" frameborder="no" width="' + embed_width + '" height="' + embed_height + '" src="https://w.soundcloud.com/player/?url=';

                                if (embed_autoplay) {
                                    var url = "https%3A//api.soundcloud.com/tracks/" + file.media_provider_id + '&amp;auto_play=true';
                                } else {
                                    var url = "https%3A//api.soundcloud.com/tracks/" + file.media_provider_id;
                                }

                                code = code + url + '&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true#t=20s"></iframe>';
                                file.media_embed = code;
                            }

                            if (file.media_type == "image") {
                                file.media_embed = '<img src="' + file.media_url + '" />';
                            }

                            files[i] = file;
                        }
                    });

                    if (files.length) {


                        url = window.location.href;


                        if (files.length > 1) {
                            //console.log(url.indexOf("galleries"));
                            if (url.indexOf("galleries") == -1) {
                                if (confirm("Make a gallery of these (" + files.length + ") files")) {
                                    if (name = prompt("gallery name:")) {
                                        if (name != "") {
                                            var ids = [];
                                            files.forEach(function (file, i) {
                                                ids[i] = file.media_id;
                                            });

                                            $.post(baseURL + "media/save_gallery", {
                                                name: name,
                                                content: ids
                                            }, function (data) {
                                                var galleries = [];
                                                galleries[0] = data;
                                                settings.galleries(galleries);
                                            }, "json");

                                            $(".file_manager").slideUp(function () {
                                                $(".gallery_row").removeClass("active");
                                                $(".dz-preview").removeClass("active");
                                                $(".cinema").hide();
                                                $("#select_media").unbind("click");
                                            });

                                            return true;
                                        }
                                    }
                                }
                            }
                        }

                        settings.done(files, base);
                    }
                }

                $(".file_manager").slideUp(function () {
                    $(".gallery_row").removeClass("active");
                    $(".dz-preview").removeClass("active");
                    $(".cinema").hide();
                    $("#select_media").unbind("click");
                });


            });
        });
    };


}(jQuery));


$("#open_media_popup").filemanager();
