@extends("admin::layouts.master")

@section("content")

    <form action="" method="post">

        <div class="row wrapper border-bottom white-bg page-heading">

            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <h2>
                    <i class="fa fa-newspaper-o"></i>
                    {{ $post->id ? trans("posts::posts.edit") : trans("posts::posts.add_new") }}
                </h2>
                <ol class="breadcrumb">
                    <li>
                        <a href="{{ route("admin") }}">{{ trans("admin::common.admin") }}</a>
                    </li>
                    <li>
                        <a href="{{ route("admin.posts.show") }}">{{ trans("posts::posts.posts") }}</a>
                    </li>
                    <li class="active">
                        <strong>
                            {{ $post->id ? trans("posts::posts.edit") : trans("posts::posts.add_new") }}
                        </strong>
                    </li>
                </ol>
            </div>

            <div class="col-lg-8 col-md-6 col-sm-6 col-xs-12 text-right">

                @if ($post->id)
                    <a href="http://aldar.dotdev.ae/#/details/{{ $post->id }}" target="_blank" class="btn btn-flat btn-danger btn-main">
                        <i class="fa fa-search" aria-hidden="true"></i>
                        {{ trans("posts::posts.preview_post") }}
                    </a>
                @endif

                    @if ($post->id)
                    <a href="{{ route("admin.posts.create") }}" class="btn btn-primary btn-labeled btn-main"> <span
                            class="btn-label icon fa fa-plus"></span>
                        {{ trans("posts::posts.add_new") }}</a>
                @endif

                <button type="submit" class="btn btn-flat btn-danger btn-main">
                    <i class="fa fa-download" aria-hidden="true"></i>
                    {{ trans("posts::posts.save_post") }}
                </button>



            </div>
        </div>

        <div class="wrapper wrapper-content fadeInRight">

            @include("admin::partials.messages")

            <input type="hidden" name="_token" value="{{ csrf_token() }}"/>
            <div class="row">
                <div class="col-md-8">
                    <div class="panel panel-default">
                        <div class="panel-body">

                            <div class="form-group">
                        <textarea name="title" class="form-control input-lg" rows="1" id="post_title"
                                  placeholder="{{ trans("posts::posts.attributes.title") }}">{{ @Request
                                ::old("title", $post->title) }}</textarea>
                            </div>

                            <div class="form-group">
                        <textarea name="excerpt" class="form-control" id="post_excerpt"
                                  placeholder="{{ trans("posts::posts.attributes.excerpt") }}">{{ @Request
                                ::old("excerpt", $post->excerpt) }}</textarea>
                            </div>

                            <div class="form-group">
                                @include("admin::partials.editor", ["name" => "content", "id" => "postcontent", "value" => $post->content])
                            </div>

                        </div>
                    </div>

                    <div class="panel panel-default">

                        <div class="panel-heading">
                            <i class="fa fa-camera"></i>
                            {{ trans("posts::posts.add_fields") }}
                            <a class="add-custom-field pull-right" href="javascript:void(0)">
                                <i class="fa fa-plus text-navy"></i>
                            </a>

                        </div>

                        <div class="panel-body">

                            <div class="form-group meta-rows">

                                @foreach ($post->meta as $meta)
                                    <div class="meta-row">

                                        <input type="text" name="custom_names[]" value="{{ $meta->name }}"
                                               class="form-control input-md pull-left custom-field-name"
                                               placeholder="{{ trans("posts::posts.custom_name") }}"/>

                                        <textarea name="custom_values[]"
                                                  class="form-control input-lg pull-left custom-field-value"
                                                  rows="1"
                                                  placeholder="{{ trans("posts::posts.custom_value") }}">{{ $meta->value }}</textarea>

                                        <a class="remove-custom-field pull-right" href="javascript:void(0)">
                                            <i class="fa fa-times text-navy"></i>
                                        </a>

                                    </div>
                                @endforeach

                                <div class="meta-row">

                                    <input type="text" name="custom_names[]"
                                           class="form-control input-md pull-left custom-field-name"
                                           placeholder="{{ trans("posts::posts.custom_name") }}"/>

                                    <textarea name="custom_values[]"
                                              class="form-control input-lg pull-left custom-field-value"
                                              rows="1"
                                              placeholder="{{ trans("posts::posts.custom_value") }}"></textarea>

                                    <a class="remove-custom-field pull-right" href="javascript:void(0)">
                                        <i class="fa fa-times text-navy"></i>
                                    </a>

                                </div>


                            </div>
                        </div>

                    </div>


                    <div class="row">

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-camera"></i>
                                    {{ trans("posts::posts.add_image") }}
                                    <a class="remove-post-image pull-right" href="javascript:void(0)">
                                        <i class="fa fa-times text-navy"></i>
                                    </a>
                                </div>
                                <div class="panel-body form-group">
                                    <div class="row post-image-block">
                                        <input type="hidden" name="image_id" class="post-image-id"
                                               value="{{ ($post->image) ? $post->image->id : 0 }}">

                                        <a class="change-post-image label" href="javascript:void(0)">
                                            <i class="fa fa-pencil text-navy"></i>
                                            {{ trans("posts::posts.change_image") }}
                                        </a>

                                        <a class="post-media-preview" href="javascript:void(0)">
                                            <img width="100%" height="130px" class="post-image"
                                                 src="{{ ($post and @$post->image) ? thumbnail($post->image->path) : assets("admin::default/image.png") }}">
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">

                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-camera"></i>
                                    {{ trans("posts::posts.add_media") }}
                                    <a class="remove-post-media pull-right" href="javascript:void(0)">
                                        <i class="fa fa-times text-navy"></i>
                                    </a>
                                </div>
                                <div class="panel-body form-group">
                                    <div class="row post-media-block">
                                        <input type="hidden" name="media_id" class="post-media-id"
                                               value="{{ ($post->media) ? $post->media->id : 0 }}">


                                        <a class="change-post-media label" href="javascript:void(0)">
                                            <i class="fa fa-pencil text-navy"></i>
                                            {{ trans("posts::posts.change_media") }}
                                        </a>

                                        <a class="post-media-preview" href="javascript:void(0)">
                                            <img width="100%" height="130px" class="post-media"
                                                 src="{{ ($post and @ $post->media) ? ($post->media->provider_image) : assets("admin::default/video.png") }}">
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    @foreach(Action::fire("post.form.featured", $post) as $output)
                        {!!  $output !!}
                    @endforeach

                </div>
                <div class="col-md-4">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-check-square"></i>
                            {{ trans("posts::posts.post_status") }}
                        </div>
                        <div class="panel-body">
                            <div class="form-group switch-row">
                                <label class="col-sm-9 control-label"
                                       for="input-status">{{ trans("posts::posts.attributes.status") }}</label>
                                <div class="col-sm-3">
                                    <input @if (@Request::old("status", $post->status)) checked="checked" @endif
                                    type="checkbox" id="input-status" name="status" value="1"
                                           class="status-switcher switcher-sm">
                                </div>
                            </div>

                            <div class="form-group format-area event-format-area">
                                <div class="input-group date datetimepick">
                                    <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                    <input name="published_at" type="text"
                                           value="{{ (!$post->id) ? date("Y-m-d H:i:s") : @Request::old('published_at', $post->published_at) }}"
                                           class="form-control" id="input-published_at"
                                           placeholder="{{ trans("posts::posts.attributes.published_at") }}">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-folder"></i>
                            {{ trans("posts::posts.attributes.format") }}
                        </div>
                        <div class="panel-body">
                            <div class="form-group" style="margin-bottom:0px">

                                @foreach (config("posts.formats") as $format => $icon)
                                    <div class="radio" style="margin-top: 0;">
                                        <label>
                                            <input type="radio" name="format" value="{{ $format }}"
                                                   class="i-checks"
                                                   @if ((!$post->id and $format == "post") or ($post and $post->format == $format)) checked @endif>&nbsp;
                                            <i class="fa {{ $icon }}"></i>&nbsp;
                                            <span class="lbl">{{ trans('posts::posts.format_' . $format) }}</span>
                                        </label>
                                    </div>
                                @endforeach
                            </div>

                        </div>

                    </div>

                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-folder"></i>
                            {{ trans("posts::posts.add_category") }}
                        </div>
                        <div class="panel-body">

                            @if (Dot\Categories\Models\Category::count())
                                <ul class='tree-views'>
                                    <?php
                                    echo Dot\Categories\Models\Category::tree(array(
                                        "row" => function ($row, $depth) use ($post, $post_categories) {
                                            $html = "<li><div class='tree-row checkbox i-checks'><a class='expand' href='javascript:void(0)'>+</a> <label><input type='checkbox' ";
                                            if ($post and in_array($row->id, $post_categories->pluck("id")->toArray())) {
                                                $html .= 'checked="checked"';
                                            }
                                            $html .= "name='categories[]' value='" . $row->id . "'> &nbsp;" . $row->name . "</label></div>";
                                            return $html;
                                        }
                                    ));
                                    ?>
                                </ul>
                            @else
                                {{ trans("categories::categories.no_records") }}
                            @endif
                        </div>
                    </div>

                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-th-large"></i>
                            {{ trans("posts::posts.add_block") }}
                        </div>
                        <div class="panel-body">
                            @if (Dot\Blocks\Models\Block::count())
                                <ul class='tree-views'>
                                    @foreach(Dot\Blocks\Models\Block::all() as $block)
                                        <li>
                                            <div class='tree-row checkbox i-checks'>
                                                <label>
                                                    <input type='checkbox'
                                                           @if ($post and in_array($block->id, $post_blocks->pluck("id")->toArray())) checked="checked"
                                                           @endif
                                                           name='blocks[]'
                                                           value='{{ $block->id }}'>
                                                    &nbsp; {{ $block->name }}
                                                </label>
                                            </div>
                                    @endforeach
                                </ul>
                            @else
                                {{ trans("posts::posts.no_blocks") }}
                            @endif
                        </div>
                    </div>


                    <div class="panel panel-default format-area album-format-area">
                        <div class="panel-heading">
                            <i class="fa fa-camera"></i>
                            {{ trans("posts::posts.add_gallery") }}
                            <a href="javascript:void(0)" class="add_gallery pull-right text-navy"><i
                                    class="fa fa-plus"></i></a>
                        </div>
                        <div class="panel-body">
                            <div class="iwell add_gallery"
                                 @if ($post and count($post_galleries->toArray()) > 0) style="display:none" @endif>
                                {{ trans("posts::posts.no_galleries_found") }}
                                <a href="javascript:void(0)" class="add_gallery pull-right text-navy"><i
                                        class="fa fa-info-circle"></i></a>
                            </div>

                            <div class="post_galleries">
                                @if ($post)
                                    @foreach ($post_galleries->toArray() as $gallery)
                                        <div class="iwell post_gallery"
                                             data-gallery-id="{{ $gallery["id"] }}">{{ $gallery["name"] }}
                                            <input type="hidden" name="galleries[]" value="{{ $gallery["id"] }}"/>
                                            <a href="javascript:void(0)"
                                               class="remove_gallery pull-right text-navy">
                                                <i class="fa fa-times"></i>
                                            </a>
                                        </div>
                                    @endforeach
                                @endif

                            </div>
                        </div>
                    </div>


                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-tags"></i>
                            {{ trans("posts::posts.add_tag") }}
                        </div>
                        <div class="panel-body">
                            <div class="form-group" style="position:relative">
                                <input type="hidden" name="tags" id="tags_names"
                                       value="{{ join(",", $post_tags) }}">
                                <ul id="mytags"></ul>
                            </div>
                        </div>
                    </div>

                    @foreach(Action::fire("post.form.sidebar") as $output)
                        {!! $output !!}
                    @endforeach

                </div>

            </div>

        </div>

    </form>

@stop


@section("head")

    <link href="{{ assets("admin::tagit") }}/jquery.tagit.css" rel="stylesheet" type="text/css">
    <link href="{{ assets("admin::tagit") }}/tagit.ui-zendesk.css" rel="stylesheet" type="text/css">

    <link href="{{ assets('admin::css/plugins/datetimepicker/bootstrap-datetimepicker.min.css') }}"
          rel="stylesheet" type="text/css">


    <style>
        .custom-field-name {
            width: 40%;
            margin: 5px;
        }

        .custom-field-value {
            width: 50%;
            margin: 5px;
        }

        .remove-custom-field {
            margin: 10px;
        }

        .meta-rows {

        }

        .meta-row {
            background: #f1f1f1;
            overflow: hidden;
            margin-top: 4px;
        }

    </style>

@stop

@section("footer")

    <script type="text/javascript" src="{{ assets("admin::tagit") }}/tag-it.js"></script>
    <script type="text/javascript" src="{{ assets('admin::js/plugins/moment/moment.min.js') }}"></script>
    <script type="text/javascript"
            src="{{ assets('admin::js/plugins/datetimepicker/bootstrap-datetimepicker.min.js') }}"></script>

    <script>

        $(document).ready(function () {

            $('.datetimepick').datetimepicker({
                format: 'YYYY-MM-DD HH:mm:ss',
            });


            $("[name=format]").on('ifChecked', function () {
                $(this).iCheck('check');
                $(this).change();
                switch_format($(this));
            });

            switch_format($("[name=format]:checked"));

            function switch_format(radio) {

                var format = radio.val();

                $(".format-area").hide();
                $("." + format + "-format-area").show();
            }


            var elems = Array.prototype.slice.call(document.querySelectorAll('.status-switcher'));
            elems.forEach(function (html) {
                var switchery = new Switchery(html, {size: 'small'});
            });

            $("body").on("click", ".remove-custom-field", function () {

                var item = $(this);
                confirm_box("{{ trans("posts::posts.sure_delete_field") }}", function () {
                    item.parents(".meta-row").remove();
                });

            });

            $(".add-custom-field").click(function () {

                var html = ' <div class="meta-row">'
                    + '<input type="text" name="custom_names[]"'
                    + 'class="form-control input-md pull-left custom-field-name"'
                    + ' placeholder="{{ trans("posts::posts.custom_name") }}"/>'
                    + '   <textarea name="custom_values[]" class="form-control input-lg pull-left custom-field-value"'
                    + '   rows="1"'
                    + '   placeholder="{{ trans("posts::posts.custom_value") }}"></textarea>'
                    + '   <a class="remove-custom-field pull-right" href="javascript:void(0)">'
                    + '   <i class="fa fa-times text-navy"></i>'
                    + '   </a>'
                    + '   </div>';

                $(".meta-rows").append(html);


            });

            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });

            $('.tree-views input[type=checkbox]').on('ifChecked', function () {
                var checkbox = $(this).closest('ul').parent("li").find("input[type=checkbox]").first();
                checkbox.iCheck('check');
                checkbox.change();
            });

            $('.tree-views input[type=checkbox]').on('ifUnchecked', function () {
                var checkbox = $(this).closest('ul').parent("li").find("input[type=checkbox]").first();
                checkbox.iCheck('uncheck');
                checkbox.change();
            });

            $(".expand").each(function (index, element) {
                var base = $(this);
                if (base.parents("li").find("ul").first().length > 0) {
                    base.text("+");
                } else {
                    base.text("-");
                }
            });
            $("body").on("click", ".expand", function () {
                var base = $(this);
                if (base.text() == "+") {
                    if (base.closest("li").find("ul").length > 0) {
                        base.closest("li").find("ul").first().slideDown("fast");
                        base.text("-");
                    }
                    base.closest("li").find(".expand").last().text("-");
                } else {
                    if (base.closest("li").find("ul").length > 0) {
                        base.closest("li").find("ul").first().slideUp("fast");
                        base.text("+");
                    }
                }
                return false;
            });


            $(".change-post-image").filemanager({
                types: "image",
                panel: "media",
                done: function (result, base) {
                    if (result.length) {
                        var file = result[0];
                        base.parents(".post-image-block").find(".post-image-id").first().val(file.id);
                        base.parents(".post-image-block").find(".post-image").first().attr("src", file.thumbnail);
                    }
                },
                error: function (media_path) {
                    alert_box("{{ trans("posts::posts.not_image_file") }}");
                }
            });

            $(".change-post-media").filemanager({
                types: "video",
                panel: "media",
                done: function (result, base) {
                    if (result.length) {
                        var file = result[0];
                        base.parents(".post-media-block").find(".post-media-id").first().val(file.id);
                        base.parents(".post-media-block").find(".post-media").first().attr("src", file.thumbnail);
                    }
                },
                error: function (media_path) {
                    alert_box("{{ trans("posts::posts.not_media_file") }}");
                }
            });

            $(".remove-post-image").click(function () {
                var base = $(this);
                $(".post-image-id").first().val(0);
                $(".post-image").attr("src", "{{ assets("admin::default/post.png") }}");
            });

            $(".remove-post-media").click(function () {
                var base = $(this);
                $(".post-media-id").first().val(0);
                $(".post-media").attr("src", "{{ assets("admin::default/media.gif") }}");
            });


            $("#mytags").tagit({
                singleField: true,
                singleFieldNode: $('#tags_names'),
                allowSpaces: true,
                minLength: 2,
                placeholderText: "",
                removeConfirmation: true,
                tagSource: function (request, response) {
                    $.ajax({
                        url: "{{ route("admin.tags.search") }}",
                        data: {q: request.term},
                        dataType: "json",
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.name,
                                    value: item.name
                                }
                            }));
                        }
                    });
                },
                beforeTagAdded: function (event, ui) {
                    $("#metakeywords").tagit("createTag", ui.tagLabel);
                }
            });


            $(".add_gallery").filemanager({
                types: "image|video|audio|pdf",
                panel: "galleries",
                gallery_id: function () {
                    return 0;
                },
                galleries: function (result) {
                    result.forEach(function (row) {
                        if ($(".post_galleries [data-gallery-id=" + row.id + "]").length == 0) {
                            var html = '<div class="iwell post_gallery" data-gallery-id="' + row.id + '">' + row.name
                                + '<input type="hidden" name="galleries[]" value="' + row.id + '" />'
                                + '<a href="javascript:void(0)" class="remove_gallery pull-right text-navy"><i class="fa fa-times"></i></a></div>';
                            $(".post_galleries").html(html);
                        }
                    });
                    if ($(".post_galleries [data-gallery-id]").length != 0) {
                        $(".iwell.add_gallery").slideUp();
                    } else {
                        $(".iwell.add_gallery").slideDown();
                    }

                },
                error: function (media_path) {
                    alert(media_path + " is not an image");
                }
            });
            $("body").on("click", ".remove_gallery", function () {
                var base = $(this);
                var data_gallery = base.parents(".post_gallery");
                var data_gallery_id = data_gallery.attr("data-gallery-id");
                bootbox.dialog({
                    message: "هل أنت متأكد من الحذف ؟",
                    buttons: {
                        success: {
                            label: "موافق",
                            className: "btn-success",
                            callback: function () {
                                data_gallery.remove();
                                if ($(".post_galleries [data-gallery-id]").length != 0) {
                                    $(".iwell.add_gallery").slideUp();
                                } else {
                                    $(".iwell.add_gallery").slideDown();
                                }

                            }
                        },
                        danger: {
                            label: "إلغاء",
                            className: "btn-primary",
                            callback: function () {
                            }
                        },
                    },
                    className: "bootbox-sm"
                });
            });

        });


    </script>

@stop
