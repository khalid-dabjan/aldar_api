/*jslint unparam: true */

// Cropper init

var $image = $(".cropper");
$image.cropper({

    center: true,
    // movable: false,
    //minCanvasWidth: 1500,
    // minContainerWidth: 1000,
    //minCropBoxWidth: 1500,
    crop: function (data) {
        // console.log(data.x);
        $("#x").val(Math.round(data.x));
        $("#y").val(Math.round(data.y));
        $("#h").val(Math.round(data.height));
        $("#w").val(Math.round(data.width));
    }
});

$(window).scroll(function (e) {


    console.log($(this).scrollTop() + " - " + $(".page-heading").offset().top);

    if ($(this).scrollTop() >= 50) {

        if ($('.page-heading.fixed-heading').length == 0) {
            $('.page-heading').addClass("fixed-heading");
            $("body").addClass('fixed-heading');
        }

    } else {
        if ($('.page-heading.fixed-heading').length) {
            $('.page-heading').removeClass("fixed-heading");
            $("body").removeClass('fixed-heading');
        }
    }

});

var activate_media = function (id) {

    var base = $(".dz-preview[media-id=" + id + "]");
    // base.addClass("active");

    $(".dz-preview").removeClass("active");
    $(".dz-preview[media-id=" + id + "]").addClass("active");


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
        // $(".details-box-name .file_name").text(media_path);
    } else {
        //  $(".details-box-name .file_name").text(media_title);
    }


    $(".details-box-name .file_date").text(media_created_date);
    $(".details-box-name .file_size").text(media_size);


    if (media_type == "image") {
        $('#set_media').show();
    } else {
        $('#set_media').hide();
    }

    if (media_type == "audio" || media_type == "video") {
        $(".details-box-name .file_duration").text(media_duration);
    } else {
        $(".details-box-name .file_duration").text("");
    }

    $("#file_type").val(media_type);
    $("#file_provider").val(media_provider);
    $("#file_provider_id").val(media_provider_id);
    $("#file_url").val(media_url);
    $("#file_title").val(media_title);


    $(".media-form-wrapper").show();
    $(".media-grid").css("width", "");

    $("#file_description").val(media_description);

    $('#delete_selected_media').removeClass("disabled");
    $('#select_media').removeClass("disabled");

}


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

        start: function (e) {
            $(".media_loader").show();
            $(".loaded").text($(".loaded").attr("data-message"));
        },

        stop: function (e) {
            $(".media_loader").hide();
            $(".loaded").text("");
            $('#progress .progress-bar').css('width', '0%');

            activate_media_type("all");
            $('a[href="#library-area"]').tab('show');
        },

        done: function (e, data) {

            if (data.result.error !== undefined) {
                $('#progress .progress-bar').css('width', '0%');
                $(".loaded").text("");
                $(".media_loader").hide();

                $(".upload_errors").html(
                    '<div class="alert alert-danger alert-dark">'
                    + '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'
                    + data.result.error
                    + '</div>'
                );
            }

            $.each(data.result.files, function (index, file) {
                $('.current-uploading-file').text(file.name);
            });
        },
        progressall: function (e, data) {

            var progress = parseInt(data.loaded / data.total * 100, 10);

            $('#progress .progress-bar').css('width', progress + '%');
            $(".loaded").text(progress + "%");

            if (progress == 100) {
                $(".loaded").text($(".loaded").attr("data-message"));
            }

            $(".media_loader").hide();

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
            start: function (e) {
                $(".media_loader").show();
            },
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

                    $(".empty-content").addClass("hidden");

                    $("#galleries-content .media_rows").prepend('<div class="media_row">'
                        + '<input type="hidden" value="' + file.id + '" name="media_id[]">'
                        + '<a href="#" class="media_row_delete">'
                        + '<i class="fa fa-times"></i>'
                        + '</a>'
                        + '<div>'
                        + '<i class="fa fa-arrows"></i>'
                        + '</div>'
                        + '<img src="' + file.thumbnail + '">'
                        + '<label><input type="text" name="media_title[' + file.id + ']" value="' + file.title + '" /></label>'
                        + '</div>');


                    $('.media_rows').nestedSortable({
                        handle: 'img',
                        items: 'li',
                        toleranceElement: '> div',
                        listType: 'ul'
                    });

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
                $(".media_loader").hide();
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');


    });


    // Media link

    $("#mediaform").submit(function () {
        var base = $(this);

        var button = base.find("button").first();
        var link = base.find("input[name=link]").first().val();

        if (link == "") {

            alert_box(button.attr('data-required-text'));

            return false;
        }

        button.button('loading');

        $.post(baseURL + "media/link", base.serialize(), function (file) {

            if (file.error) {
                $(".upload_errors").html('<div class="alert alert-danger alert-dark"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button> ' + button.attr('data-fail-text') + ' </div>');
                //alert(file.error);
            } else {
                button.button('reset');
                base.find("input[name=link]").first().val("");

                $(".no-media").remove();
                $(".dz-preview[media-id=" + file.id + "]").remove();

                $('a[href="#library-area"]').tab('show');
                $('.media-grid').prepend(file.html);
                activate_media(file.id);
                $('.current-uploading-file').text(file.name);
            }

        }, "json").fail(function (xhr, textStatus, errorThrown) {
            button.button('reset');
            $(".upload_errors").html('<div class="alert alert-danger alert-dark"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button> ' + button.attr('data-fail-text') + ' </div>');
        });

        return false;
    });


    /*
     var jcrop_api; // Holder for the API
     initJcrop();

     function initJcrop()//{{{
     {

     $('#cropbox').Jcrop({}, function () {
     jcrop_api = this;
     });

     }
     ;
     */


    /*

     var jcrop_api;

     $('#cropbox').Jcrop({
     onSelect: function (c) {
     $('#x').val(c.x);
     $('#y').val(c.y);
     $('#w').val(c.w);
     $('#h').val(c.h);
     }
     }, function () {
     jcrop_api = this;
     });
     */


    $('#img').click(function (e) {
        jcrop_api.setImage('http://localhost/dotmsr/public/uploads/ss.jpg');
        jcrop_api.setOptions({
            onSelect: function (c) {
                $('#x').val(c.x);
                $('#y').val(c.y);
                $('#w').val(c.w);
                $('#h').val(c.h);
            }
        });
        return false;
    });

    $("#revert_editing").click(function () {

        $("#media-editor").fadeOut(function () {
            $(".files-area").fadeIn();
        });

        return false;
    });

    $(".watermark_editor").click(function () {

        $("#waterbtn").button('loading');
        $(".media_loader").css("display", "inline");
        var size = $(".size-row.active").attr("data-size");
        var media_path = $(".cropper").attr("data-src");
        var remote_media_path = $(".details-box-name .file_name").text();

        $.post(baseURL + "media/watermark", "path=" + $(".cropper").attr("data-src") + "&amazon_path=" + remote_media_path + "&position=" + $("#watermark-position option:selected").val() + "&size=" + $(".size-row.active").attr("data-size"), function (data) {

            var d = new Date();
            var time = d.getTime();

            var sizes = ["large", "medium", "small", "one", "thumbnail", "free"];

            for (var i = 0; i <= sizes.length - 1; i++) {
                $(".size-row img[data-size=" + sizes[i] + "]").attr("src", base_url + "/uploads/" + sizes[i] + "-" + data.path + "?" + time);
            }

            //$(".cropper").attr("data-src", data.path);
            // alert(base_url + "/uploads/" + size + "-" + data.path + "?" + time);
            $(".cropper").cropper("replace", base_url + "/uploads/" + size + "-" + data.path + "?" + time);
            //$(".cropper").cropper("clear");

            /*
             var d = new Date();
             var time = d.getTime();

             $(".jcrop-holder img").css("width", data.width);
             $(".jcrop-holder img").css("height", data.height);
             $(".jcrop-holder img").attr("src", base_url + '/uploads/' + data.path + "?" + time);

             $(".original_image").css("width", data.width);
             $(".original_image").css("height", data.height);
             $(".original_image").attr("src", base_url + '/uploads/' + data.path + "?" + time);
             */


            $.post(baseURL + "media/get", function (data) {
                $('.media-grid').html(data);

                var media_id = $("input[name=file_id]").val();
                $(".dz-preview").removeClass("active");
                $(".dz-preview[media-id=" + media_id + "]").addClass("active");
                activate_media(media_id);

                $(".media_loader").hide();
            });


            $("#waterbtn").button('reset');

        }, "json");
        return false;

    });


    $(".crop_form").submit(function () {

        $("#cropbtn").button('loading');

        $(".media_loader").css("display", "inline");


        var size = $(".size-row.active").attr("data-size");

        var media_path = $image.attr("data-src");
        var remote_media_path = $(".details-box-name .file_name").text();

        $.post(baseURL + "media/crop", $(".crop_form").serialize() + "&amazon_path=" + remote_media_path + "&path=" + media_path + "&size=" + size, function (data) {

            var d = new Date();
            var time = d.getTime();

            $(".size-row img[data-size=" + size + "]").attr("src", data.url + "?" + time);


            // refresh cropped image and replace with new one

            $("img").each(function (image) {

                var d = new Date();
                var time = d.getTime();

                if ($(this).attr("src").indexOf(data.url) > -1) {
                    $(this).attr("src", data.url + "?" + time);
                }
            });

            $("#cropbtn").button('reset');
            $(".media_loader").hide();

            $(".crop-status").show();
            setTimeout(function () {
                $(".crop-status").hide();
            }, 3000);


        }, "json");

        return false;
    });


    var activate_size = function (base) {

        // box
        var size = base.attr("data-size");
        var media_width = base.attr("data-width");
        var media_height = base.attr("data-height");
        //var media_url = $(".cropper").attr("src");

        var d = new Date();
        var time = d.getTime();

        var media_path = $image.attr("data-src");

        $image.cropper("replace", base_url + "uploads/" + media_path + "?" + time);
        $image.cropper("setAspectRatio", media_width / media_height);

    }


    $("#set_media").click(function () {
        var base = $(this);

        var media_path = $(".dz-preview.active input[name=media_path]").first().val();

        // download files from s3 to local server
        base.button('loading');
        $.post(baseURL + "media/download", {path: media_path}, function (sizes) {

            var sizes = JSON.parse(sizes);

            var d = new Date();
            var time = d.getTime();

            $image.attr("data-src", sizes[0].path);
            $image.cropper("enable");

            $image.cropper("replace", sizes[0].url);

            sizes.forEach(function (size, i) {
                $(".size-row img[data-size=" + size.name + "]").attr("src", size.url);
            });

            //$(".cropper").cropper("zoom", -1);

            var media_id = $("input[name=file_id]").val();

            $(".files-area").fadeOut(function () {
                $("#media-editor").fadeIn();
            });

            $(".size-row").removeClass("active");
            $(".size-row").first().addClass("active");

            activate_size($(".size-row").first());

            base.button('reset');

        });

        return false;
    });


    function getRandom(width, height) {
        var dim = jcrop_api.getBounds();

        var bounds = [
            0,
            0,
            parseInt(width),
            parseInt(height)
        ];

        return bounds;
    }


    $(".editor-panel-arrow").click(function () {
        if ($(this).text() == ">") {
            $(".media-setting-panel").animate({"left": "-304px"});
            $(this).text("<")
        } else {
            $(".media-setting-panel").animate({"left": "40px"});
            $(this).text(">")
        }
        return false;
    });


    $(".size-row").click(function () {
        var base = $(this);
        $image.cropper('enable');
        $(".size-row").removeClass("active");
        base.addClass("active");
        activate_size(base);
        return false;
    });

    $("#editor-media-size").change(function () {
        var base = $(this);
        var size = base.val();
        var media_path = $("#cropbox").attr("data-src");
        // box
        var media_width = $("#editor-media-size option:selected").attr("data-width");
        var media_height = $("#editor-media-size option:selected").attr("data-height");
        // Full image
        var dim = jcrop_api.getBounds();
        var image_width = dim[0];

        var image_height = Math.round(image_width * (media_height / media_width));

        var d = new Date();
        var time = d.getTime();

        jcrop_api.setImage(base_url + '/uploads/' + media_path + "?" + time);
        jcrop_api.setOptions({
            setSelect: [0, 0, image_width, image_height], aspectRatio: media_width / media_height,
            boxWidth: media_width,
            onChange: function (c) {
                $('#x').val(c.x);
                $('#y').val(c.y);
                $('#w').val(c.w);
                $('#h').val(c.h);
            },
            onSelect: function (c) {
                $('#x').val(c.x);
                $('#y').val(c.y);
                $('#w').val(c.w);
                $('#h').val(c.h);
            }
        });

        //
        //jcrop_api.animateTo(getRandom(image_width, 500));

        if (size != "full") {
            // jcrop_api.animateTo(getRandom(image_width, null));
        }
    });


    if ($(".dz-preview.active").length == 1) {
        $(".media-form-wrapper").show();
        $(".media-grid").css("width", "");
    } else {
        $(".media-form-wrapper").hide();
        $(".media-grid").css("width", "100%");
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


        if ($(".dz-preview input[name=media_type]").attr("value") == "image") {
            $("#set_media").show();
        } else {
            $("#set_media").hide();
        }


        if ($(".dz-preview.active").length == 1) {
            $(".media-form-wrapper").show();
            $(".media-grid").css("width", "");
            activate_media(base.attr("media-id"));
        } else {
            $(".media-form-wrapper").hide();
            $(".media-grid").css("width", "100%");
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
        confirm_box(base.attr("data-message"), function () {
            base.button('loading');
            base.parents(".media_row").slideUp(function () {
                base.parents(".media_row").remove();
                base.button('reset');
            })
        });
    });
    $("#save_gallery").click(function () {
        var base = $(".gallery_form");

        $("#save_gallery").button('loading');

        $.post(baseURL + "galleries/save", base.serialize(), function (data) {
            var gallery_id = base.attr("gallery-id");
            var count = $(".media_rows .media_row").length;
            $(".gallery_row.active .gallery_details .gallery_details_count span").text(count);
            $("#save_gallery").button('reset');
        });

        return false;
    });

    $("body").on("click", "#delete_gallery", function (e) {
        var base = $(this);

        confirm_box(base.attr("data-message"), function () {
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

            $.post(baseURL + "media/galleries/delete", {gallery_id: gallery_id}, function (data) {
                $(".gallery_row.active").remove();
                //if (next_gallery != null) {
                //activate_gallery(next_gallery);
                if ($(".gallery_row").length) {
                    activate_gallery($(".gallery_row").first().attr("gallery-id"));
                } else {

                    $(".no-galleries").removeClass("hidden");
                    $(".galleries-panel").addClass("hidden");
                    $(".empty-content").addClass("hidden");

                }

                //}
            });
        });

    });

    var activate_gallery = function (gallery_id) {

        var base = $(".gallery_row[gallery-id=" + gallery_id + "]");

        //$(".gallery_row").removeClass("active");
        base.addClass("active");

        var gallery_name = base.find(".gallery_details_name").first().text();

        $(".gallery-ctrl-bar").find("li").eq(1).children("a").text(gallery_name);


        $(".gallery_name").html(gallery_name);
        $("#save_gallery").attr("gallery-id", gallery_id);
        $("#delete_gallery").attr("gallery-id", gallery_id);
        $("#gallery_id").val(gallery_id);

        $.post(baseURL + "galleries/files", {id: gallery_id}, function (data) {

            $("#galleries-content").html(data).promise().done(function () {
                $('.media_rows').sortable();
            });

            $(".media_loader").hide();
        });

    }

    $("body").on("click", ".gallery_row", function (e) {
        var base = $(this);

        $(".media_loader").css("display", "inline");

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

    $(".create_gallery_form").submit(function () {
        var base = $(this);


        if ($(".create_gallery_form").find("input[name=gallery_name]").first().val() == "") {
            alert("إسم الألبوم مطلوب");
            return false;
        }


        $(".media_loader").show();

        $.post(baseURL + "media/galleries/create", base.serialize(), function (id) {
            $('#createGalleryModal').modal('hide');
            $(".no-galleries").addClass("hidden");
            $(".galleries-panel").removeClass("hidden");
            $.post(baseURL + "galleries/get/1", function (data) {
                if (data != "") {
                    $('#galleries-sidebar').html(data);
                    $('#galleries-sidebar').attr("page", 2);
                }
                activate_gallery(id);
                $(".media_loader").hide();
            });

        });
        return false;
    });


    $("body").on("click", ".gallery_ctrls .gallery_delete", function () {
        var base = $(this);
        confirm_box("هل أنت متأكد من الحذف ؟", function () {
            var gallery_id = base.attr("data-gallery");
            $(".media_loader").show();
            $.post(baseURL + "media/galleries/delete", {id: gallery_id}, function () {
                $(".gallery_row[gallery-id=" + gallery_id + "]").remove();
                $(".media_loader").hide();

                if ($(".gallery_row").length == 0) {
                    $(".no-galleries").removeClass("hidden");
                    $(".galleries-panel").addClass("hidden");
                }

            });
        });
        return false;
    });

    $("body").on("click", ".gallery_ctrls .gallery_edit", function () {

        var base = $(this);

        var gallery_id = base.attr("data-gallery");
        var gallery = $(".gallery_row[gallery-id=" + gallery_id + "]");
        var gallery_name = gallery.find(".gallery_details_name").first().text();
        var gallery_author = gallery.find(".gallery_details_author").first().text();

        $('#editGalleryModal').find("input[name=gallery_id]").val(gallery_id);
        $('#editGalleryModal').find("input[name=name]").first().val(gallery_name);
        $('#editGalleryModal').find("input[name=author]").first().val(gallery_author);

        $('#editGalleryModal').modal('show');

        return false;
    });


    $("body").on("submit", ".edit_gallery_form", function () {
        var base = $(this);


        if ($(".edit_gallery_form").find("input[name=gallery_name]").first().val() == "") {
            alert("إسم الألبوم مطلوب");
            return false;
        }


        $(".media_loader").show();
        $.post(baseURL + "media/galleries/edit", base.serialize(), function (id) {

            $('#editGalleryModal').modal('hide');
            $.post(baseURL + "galleries/get/1", function (data) {
                if (data != "") {
                    $('#galleries-sidebar').html(data);
                    $('#galleries-sidebar').attr("page", 2);
                }

                activate_gallery(id);
                $(".media_loader").hide();
            });

            /*
             var gallery_name = $(".edit_gallery_form").find("input[name=gallery_name]").first().val();
             var gallery_author = $(".edit_gallery_form").find("input[name=gallery_author]").first().val();

             $(".gallery_row[gallery-id=" + id + "] .gallery_details .gallery_details_name").html(gallery_name);
             $(".gallery_row[gallery-id=" + id + "] .gallery_details .gallery_details_author").html(gallery_author);
             $('#editGalleryModal').modal('hide');
             $(".media_loader").hide();
             */
        });
        return false;
    });


    $(".search_galleries").submit(function () {
        var base = $(this);
        var q = base.find("[name=q]").eq(0).val();
        $(".media_loader").css("display", "inline");
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

    $(".search_media").submit(function () {
        var base = $(this);
        var q = base.find("[name=q]").eq(0).val();

        if (q == "") {
            alert_box(base.attr("data-required-text"));
            return false;
        }

        var type = base.find("[name=type]").eq(0).val();
        if (base.find("input[name=motive]").eq(0).parent("div").hasClass("checked")) {
            var motive = 1;
        } else {
            var motive = 0;
        }

        $(".media_loader").css("display", "inline");
        $.get(baseURL + "media/get/1/" + type + "/" + q + "?motive=" + motive, function (data) {

            $('.media-grid').html(data);
            $('a[href="#library-area"]').tab('show');

            if (data == "") {
                alert_box(base.attr("data-empty-text"));
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

        window.open(url)
        return false;
    });

    var delete_media = function (media_id, media_path, func) {
        $.post(baseURL + "media/delete", {id: media_id, media_path: media_path}, function (data) {
            func(data);
        });
    }

    /*
     $("[href=#galleries-area]").click(function () {
     $("#delete_selected_media").show();
     $(".gallery_row").removeClass("active");
     if ($(".gallery_row").first().length) {
     var gallery_id = $(".gallery_row").first().attr("gallery-id");
     activate_gallery(gallery_id);
     }

     return true;
     });
     */

    $("#delete_selected_media").click(function () {
        var base = $(this);


        confirm_box(base.attr("data-message"), function () {
            base.button('loading');
            $(".dz-preview.active").each(function () {
                var media_id = $(this).attr("media-id");
                var media_path = $(this).children("input[name=media_path]").val();
                $(".media_loader").show();
                delete_media(media_id, media_path, function () {
                    $("[media-id=" + media_id + "]").remove();
                    $(".media_loader").hide();
                    base.addClass("disabled");

                    $(".media-form-wrapper").hide();
                    $(".media-grid").css("width", "100%");

                    if ($(".dz-preview").length == 0) {
                        $('.media-grid').html("<div class='no-media text-center'><i class='fa fa-file'></i></div>");
                    }

                });
                base.button('reset');
            });
        });
        return false;
    });

    $("#delete_media").click(function () {
        var base = $(this);

        var media_id = $(".media-form").find("[name=file_id]").eq(0).val();
        var media_path = $(".details-box-name .file_name").text();

        confirm_box(base.attr("data-message"), function () {
            $('#delete_media').button('loading');
            delete_media(media_id, media_path, function () {
                $("[media-id=" + media_id + "]").remove();
                $('#delete_media').button('reset');

                $(".media-form-wrapper").hide();
                $(".media-grid").css("width", "100%");


                if ($(".dz-preview").length == 0) {
                    $('.media-grid').html("<div class='no-media text-center'><i class='fa fa-file'></i></div>");
                }

            });
        });

        return false;
    });

    $('.file_manager').bind('scroll', function () {

        if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            if ($("#library-area").is(":visible")) {

                var page = parseInt($(".media-grid-page").val());
                var type = $(".media-grid-type").val();
                var q = $(".search_media").find("[name=q]").eq(0).val();
                page = page + 1;
                $(".media-grid-page").val(page);
                $(".media_loader").css("display", "inline");

                if (q != "") {
                    q = "/" + q;
                }

                $.post(baseURL + "media/get/" + page + "/" + type + q, function (data) {
                    $('.media-grid').append(data);
                    $(".media_loader").hide();
                });

            } else {

                var page = parseInt($('#galleries-sidebar').attr("page"));
                var q = $("#gallery_query").val();

                if (q != "") {
                    var search_query = "?=" + q;
                } else {
                    var search_query = "";
                }

                $(".media_loader").css("display", "inline");
                $.post(baseURL + "galleries/get/" + page + search_query, function (data) {
                    if (data != "") {
                        $('#galleries-sidebar').append(data);
                        $('#galleries-sidebar').attr("page", page + 1);
                    }
                    $(".media_loader").hide();
                });

            }
        }

        return false;


    });
});


var show_file_manager = function (callback) {

    $(".file_manager").fadeIn(function () {
        // $(".file_manager").css("display", "table");
        if (typeof(callback) == "function") {
            callback();
        }
    });

}

var hide_file_manager = function (callback) {
    $(".file_manager").fadeOut(function () {
        if (typeof(callback) == "function") {
            callback();
        }
    });
}

$(".file_manager_close").click(function () {
    hide_file_manager(function () {
        $(".cinema").hide();
    });
    $(".galleries-home").unbind("click");
    $("#select_media").unbind("click");
    return false;
});

$(".cinema").click(function () {
    hide_file_manager(function () {
        $(".cinema").hide();
    });
    return false;
});


var activate_media_type = function (media_type) {

    $(".search_media").find("[name=type]").eq(0).val(media_type);
    $(".media-grid-type").val(media_type);


    $(".filter-bar a").removeClass("active");
    $(".filter-bar a[media-type=" + media_type + "]").addClass("active");


    $.post(baseURL + "media/get/1/" + media_type, function (data) {

        if (data != "") {
            $('.media-grid').html(data);

            if ($(".media-grid .dz-preview").length > 0) {

                var first_box = $(".media-grid .dz-preview").first();
                activate_media(first_box.attr("media-id"));
            }


        } else {
            $('.media-grid').html("<div class='no-media text-center'><i class='fa fa-file'></i></div>");
        }

        $(".media_loader").hide();


    });

}

$(".filter-bar a").click(function () {
    var base = $(this);
    $(".media_loader").css("display", "inline");
    $(".filter-bar a").removeClass("active");
    base.addClass("active");

    var media_type = base.attr("media-type");

    activate_media_type(media_type)

    return false;
});

(function ($) {

    $.fn.filemanager = function (options) {
        var base = this;
        var settings = $.extend({

            panel: "upload",

            types: null,
            media_id: function () {
                return null;
            },
            gallery_id: function () {
                return null;
            },
            activate_size: function (base) {

            },
            activate_media: function (id) {

                var thiz = $(".dz-preview[media-id=" + id + "]");
                thiz.addClass("active");

                // send details to form
                var media_id = thiz.children("[name=media_id]").val();

                var media_path = thiz.children("[name=media_path]").val();


                var media_url = thiz.children("[name=media_url]").val();


                var media_type = thiz.children("[name=media_type]").val();

                var media_provider = thiz.children("[name=media_provider]").val();
                var media_provider_id = thiz.children("[name=media_provider_id]").val();
                var media_size = thiz.children("[name=media_size]").val();
                var media_duration = thiz.children("[name=media_duration]").val();
                var media_title = thiz.children("[name=media_title]").val();
                var media_thumbnail = thiz.children("[name=media_thumbnail]").val();
                var media_description = thiz.children("[name=media_description]").val();
                var media_created_date = thiz.children("[name=media_created_date]").val();
                var media_motive = thiz.children("[name=media_motive]").val();


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

                $(".media-form-wrapper").show();
                $(".media-grid").css("width", "");

                settings.activate_size($(".size-row").first());


            }, activate_gallery: function (gallery_id) {

                var base = $(".gallery_row[gallery-id=" + gallery_id + "]");

                base.addClass("active");

                var gallery_name = base.find(".gallery_details_name").first().text();

                $(".gallery_name").html(gallery_name);
                $("#save_gallery").attr("gallery-id", gallery_id);
                $("#delete_gallery").attr("gallery-id", gallery_id);
                $("#gallery_id").val(gallery_id);

                $.post(baseURL + "galleries/files", {id: gallery_id}, function (data) {
                    $("#galleries-content").html(data).promise().done(function () {
                        $('.media_rows').sortable();
                    });
                    $(".media_loader").hide();
                });

            },
            done: function (files) {
                console.log(files);
            },
            galleries: function (result) {
                console.log(result);
            },
            error: function (media_path) {
                alert("Invalid file format \n" + media_path + "\n" + "please select a file of these types: " + settings.types);
            },


        }, options);


        this.bind("click", function () {

                $(".media_loader").css("display", "inline");

                if (settings.panel == "upload" && settings.media_id() == null && settings.gallery_id() == null) {

                    $(".media_loader").css("display", "inline");
                    $.post(baseURL + "galleries/get/1", {gallery_id: settings.gallery_id()}, function (data) {
                        if (data != "") {
                            $('#galleries-sidebar').html(data);
                            $('#galleries-sidebar').attr("page", 2);
                        }
                        settings.activate_gallery($(".gallery_row").first().attr("gallery-id"));
                    });

                    $('.media-grid').html("");
                    $.post(baseURL + "media/get", {media_id: settings.media_id()}, function (data) {
                        $('.media-grid').html(data);
                        $(".media_loader").hide();
                    });

                    // open upload panel
                    $('a[href="#upload-area"]').tab('show');
                    $(".media_loader").hide();

                } else if (settings.panel == "media" || settings.media_id() != null) {

                    if (settings.media_id() != null) {
                        $('.media-grid').html("");
                        $.post(baseURL + "media/get", {media_id: settings.media_id()}, function (data) {
                            $('.media-grid').html(data);
                            $(".media_loader").hide();
                            settings.activate_media(settings.media_id());
                        });
                    } else {
                        $.post(baseURL + "media/get", function (data) {
                            $('.media-grid').html(data);
                            $(".media_loader").hide();
                        });
                    }

                    // open library panel
                    $('a[href="#library-area"]').tab('show');
                    $(".media_loader").hide();

                } else if (settings.panel == "galleries" || settings.gallery_id() != null) {

                    if (settings.gallery_id() != null && settings.gallery_id() != 0) {
                        $(".media_loader").css("display", "inline");
                        $.post(baseURL + "galleries/get/1", {gallery_id: settings.gallery_id()}, function (data) {
                            if (data != "") {
                                $('#galleries-sidebar').html(data);
                                $('#galleries-sidebar').attr("page", 2);
                            }
                            settings.activate_gallery(settings.gallery_id());
                        });
                    } else {
                        $(".media_loader").css("display", "inline");
                        $.post(baseURL + "galleries/get/1", function (data) {
                            if (data != "") {
                                $('#galleries-sidebar').html(data);
                                $('#galleries-sidebar').attr("page", 2);
                            }
                            settings.activate_gallery($(".gallery_row").first().attr("gallery-id"));
                        });

                    }

                    // open galleries panel
                    $('a[href="#galleries-area"]').tab('show');
                    $(".media_loader").hide();

                }

                if (settings.media_id() != null) {
                    $(".media_loader").css("display", "inline");
                    $.post(baseURL + "galleries/get/1", {gallery_id: settings.gallery_id()}, function (data) {
                        if (data != "") {
                            $('#galleries-sidebar').html(data);
                            $('#galleries-sidebar').attr("page", 2);
                        }
                        settings.activate_gallery($(".gallery_row").first().attr("gallery-id"));
                    });
                }

                if (settings.gallery_id() != null) {
                    $('.media-grid').html("");
                    $.post(baseURL + "media/get", {media_id: settings.media_id()}, function (data) {
                        $('.media-grid').html(data);
                        $(".media_loader").hide();
                    });
                }

                $(".galleries-home").bind("click", function () {
                    $(".media_loader").css("display", "inline");
                    $.post(baseURL + "galleries/get/1", function (data) {
                        if (data != "") {
                            $('#galleries-sidebar').html(data);
                            $('#galleries-sidebar').attr("page", 2);
                        }
                        settings.activate_gallery($(".gallery_row").first().attr("gallery-id"));
                    });
                    return false;
                });

                $(".cinema").show();

                show_file_manager();
                // $(".file_manager").fadeIn();

                $(".gallery-select").bind("click", function () {

                    if ($(".gallery_row.active").length) {

                        var galleries = [];

                        $(".gallery_row.active").each(function (i) {
                            var base = $(this);
                            var gallery = {};
                            gallery.id = base.attr("gallery-id");
                            gallery.type = base.attr("gallery-type");
                            gallery.name = base.find(".gallery_details_name").first().text();
                            galleries[i] = gallery;
                        });

                        settings.galleries(galleries);

                        hide_file_manager(function () {

                            $("#media-editor").hide();
                            $(".files-area").show();

                            $(".gallery_row").removeClass("active");
                            $(".dz-preview").removeClass("active");
                            $(".cinema").hide();
                            $("#select_media").unbind("click");

                            $(".gallery-select").unbind("click");

                            $(".galleries-home").unbind("click");

                        });

                    } else {
                        alert("لم تقم بإختيار ألبوم بعد");
                    }


                });


                $("#select_media").bind("click", function () {

                    var error = false;

                    if ($(".dz-preview.active").length) {
                        var files = [];
                        $(".dz-preview.active").each(function (i) {
                            var file = {};

                            var base = $(this);

                            file.path = base.children("[name=media_path]").val();
                            file.type = base.children("[name=media_type]").val();

                            if (settings.types != null) {
                                var types = settings.types.toLowerCase().split("|");
                                var file_type = file.path.toLowerCase().split('.').pop();
                                if (types.indexOf(file_type) == -1 && types.indexOf(file.type) == -1) {
                                    error = true;

                                    return settings.error(file.path);
                                }
                            }

                            if (!error) {

                                file.id = parseInt(base.children("[name=media_id]").val());
                                file.provider = base.children("[name=media_provider]").val();
                                file.provider_id = base.children("[name=media_provider_id]").val();
                                file.provider_image = base.find("img").first().attr("src");
                                file.type = base.children("[name=media_type]").val();
                                file.url = base.children("[name=media_url]").val();
                                file.size = base.children("[name=media_size]").val();
                                file.path = base.children("[name=media_path]").val().replace(/^.*[\\\/]/, '');

                                // return sizes of image
                                if (file.type == "image") {
                                    var sizes = ["large", "medium", "small", "thumbnail", "one", "free"];
                                    if (file.path.indexOf("/")) {
                                        var parts = file.path.split('/');
                                        sizes.forEach(function (row) {
                                            file[row + "_path"] = parts[0] + "/" + parts[1] + "/" + row + "-" + parts[2];
                                        });
                                    } else {
                                        sizes.forEach(function (row) {
                                            file[row + "_path"] = row + "-" + file.path;
                                        });
                                    }
                                }

                                file.duration = base.children("[name=media_duration]").val();
                                file.title = base.children("[name=media_title]").val();
                                file.thumbnail = base.children("[name=media_thumbnail]").val();
                                file.description = base.children("[name=media_description]").val();
                                file.created_date = base.children("[name=media_created_date]").val();

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

                                if (file.provider == "youtube") {

                                    var code = '<iframe width="' + embed_width + '" height="' + embed_height + '" ';
                                    if (embed_autoplay) {
                                        var url = '//www.youtube.com/embed/' + file.provider_id + "?autoplay=1&start=" + embed_start;
                                    } else {
                                        var url = '//www.youtube.com/embed/' + file.provider_id + "?start=" + embed_start;
                                    }
                                    code = code + 'src="' + url + '" frameborder="0" allowfullscreen></iframe>';

                                    file.embed = code;
                                } else if (file.provider == "soundcloud") {
                                    var code = '<iframe scrolling="no" frameborder="no" width="' + embed_width + '" height="' + embed_height + '" src="https://w.soundcloud.com/player/?url=';
                                    if (embed_autoplay) {
                                        var url = "https%3A//api.soundcloud.com/tracks/" + file.provider_id + '&amp;auto_play=true';
                                    } else {
                                        var url = "https%3A//api.soundcloud.com/tracks/" + file.provider_id;
                                    }
                                    code = code + url + '&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true#t=20s"></iframe>';
                                    file.embed = code;
                                }

                                if (file.type == "image") {
                                    file.embed = '<img src="' + file.url + '" />';
                                }
                                files[i] = file;
                            }
                        });
                        if (files.length) {


                            url = window.location.href;


                            if (files.length > 1) {
                                //console.log(url.indexOf("galleries"));
                                if (url.indexOf("galleries") == -1) {
                                    confirm_box("Make a gallery of these (" + files.length + ") files", function () {
                                        if (name = prompt("gallery name:")) {
                                            if (name != "") {
                                                var ids = [];
                                                files.forEach(function (file, i) {
                                                    ids[i] = file.id;
                                                });

                                                $.post(baseURL + "media/save_gallery", {
                                                    name: name,
                                                    content: ids
                                                }, function (data) {
                                                    var galleries = [];
                                                    galleries[0] = data;
                                                    settings.galleries(galleries);
                                                }, "json");

                                                hide_file_manager(function () {


                                                    $(".files-area").show(function () {
                                                        $("#media-editor").hide();
                                                    });

                                                    $(".gallery_row").removeClass("active");
                                                    $(".dz-preview").removeClass("active");
                                                    $(".cinema").hide();
                                                    $("#select_media").unbind("click");
                                                    $(".galleries-home").unbind("click");
                                                });

                                                return true;
                                            }
                                        }
                                    });
                                }
                            }

                            settings.done(files, base);
                        }
                    }


                    if (error == false) {
                        hide_file_manager(function () {

                            $("#media-editor").hide();
                            $(".files-area").show();

                            $(".gallery_row").removeClass("active");
                            $(".dz-preview").removeClass("active");
                            $(".cinema").hide();

                            $("#select_media").unbind("click");
                            $("#select_gallery").unbind("click");
                            $(".galleries-home").unbind("click");

                        });
                    }

                });
            }
        );
    };


}(jQuery));

$("#open_media_popup").filemanager();
