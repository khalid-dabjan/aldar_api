@extends("admin::layouts.master")

@section("content")

    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <h2>
                <i class="fa fa-th-large"></i>
                {{ trans("navigations::navigations.module") }}
            </h2>
            <ol class="breadcrumb">
                <li>
                    <a href="{{ route("admin") }}">{{ trans("admin::common.admin") }}</a>
                </li>
                <li>
                    <a href="{{ route("admin.navigations.show") }}">{{ trans("navigations::navigations.module") }}</a>
                </li>
            </ol>
        </div>
        <div class="col-lg-8 col-md-6 col-sm-6 col-xs-12 text-right">

            <a data-toggle="modal"
               data-target="#createNavMenu" class="btn btn-primary btn-labeled btn-main">
                <i class="btn-label icon fa fa-plus"></i>
                {{ trans("navigations::navigations.add_new") }}
            </a>

        </div>
    </div>

    <div class="wrapper wrapper-content fadeInRight">

        <div class="modal fade" id="createNavMenu" tabindex="-1" role="dialog"
             aria-labelledby="basicModal" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form class="create_nav_menu">

                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal"
                                    aria-hidden="true">&times;
                            </button>
                            <h4 class="modal-title"
                                id="myModalLabel">{{ trans("navigations::navigations.add_new") }}</h4>
                        </div>
                        <div class="modal-body">

                            <div class="input-group input-group-lg">
                                                <span class="input-group-addon">
                                                    <i class="fa fa-bars" aria-hidden="true"></i>
                                                </span>
                                <input autocomplete="off"
                                       placeholder="{{ trans("navigations::navigations.attributes.name") }}"
                                       value="" class="form-control" name="name">


                            </div>

                            <div class="text-danger nav-form-error" style="margin: 5px;"></div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default"
                                    data-dismiss="modal">{{ trans("navigations::navigations.close") }}
                            </button>
                            <button type="submit"
                                    data-loading-text="{{ trans("navigations::navigations.loading") }}"
                                    class="btn btn-primary">{{ trans("navigations::navigations.save") }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


        @if (!$nav)
            <div class="row">

                <div class="col-md-12">
                    <div class="panel panel-default">
                        <div class="panel-body">
                            {{ trans("navigations::navigations.no_menus") }}
                        </div>
                    </div>
                </div>

            </div>
        @endif

        @if ($nav)


            <div class="modal fade" id="editNavMenu" tabindex="-1" role="dialog"
                 aria-labelledby="basicModal" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form class="create_nav_menu">

                            <input type="hidden" name="id" value="{{ $nav->id }}"/>

                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"
                                        aria-hidden="true">&times;
                                </button>
                                <h4 class="modal-title"
                                    id="myModalLabel">{{ trans("navigations::navigations.edit_menu") }}</h4>
                            </div>
                            <div class="modal-body">

                                <div class="input-group input-group-lg">
                                    <i class="input-group-addon">
                                        <i class="fa fa-bars" aria-hidden="true"></i>
                                    </i>
                                    <input autocomplete="off"
                                           placeholder="{{ trans("navigations::navigations.attributes.name") }}"
                                           value="{{ $nav->name }}" class="form-control" name="name">


                                </div>

                                <div class="text-danger nav-form-error" style="margin: 5px;"></div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default"
                                        data-dismiss="modal">{{ trans("navigations::navigations.close") }}
                                </button>
                                <button type="submit"
                                        data-loading-text="{{ trans("navigations::navigations.loading") }}"
                                        class="btn btn-primary">{{ trans("navigations::navigations.save") }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            <div class="row">

                <div class="col-md-8">
                    <div class="panel panel-default">
                        <div class="panel-body">


                            <div class="form-group">

                                <div class="dd-handle">
                                    <div class="row">

                                        <div class="col-md-9">
                                            <select id="input-type"
                                                    class="form-control chosen-select chosen-rtl nav-selector"
                                                    name="type">
                                                @foreach ($navs as $menu)
                                                    <option
                                                        value="{{ $menu->id }}"
                                                        @if ($id == $menu->id) selected="selected" @endif>{{ $menu->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>

                                        <div class="col-md-3">

                                            <a class="btn btn-danger btn-labeled pull-right delete-menu"
                                               data-id="{{ $nav->id }}" style="margin: 5px">
                                                <i
                                                    class="btn-label icon fa fa-trash"></i>
                                            </a>

                                            <a data-toggle="modal"
                                               data-target="#editNavMenu" class="btn btn-primary btn-labeled pull-right"
                                               style="margin: 5px">
                                                <i
                                                    class="btn-label icon fa fa-edit"></i>
                                            </a>
                                        </div>

                                    </div>
                                </div>


                            </div>

                            <div class="dd" id="nestable2">

                                <?php
                                $html = Dot\Navigations\Models\Nav::tree(array(

                                    "query" => function ($query) use ($id) {
                                        return $query->where("menu", $id);
                                    },

                                    "row" => function ($row, $depth) {

                                        $name = strip_tags(trim(preg_replace('/\s\s+/', ' ', $row->name)));

                                        if ($row->type == "post") {
                                            $icon = "fa-newspaper-o";
                                        } elseif ($row->type == "page") {
                                            $icon = "fa-file-text-o";
                                        } elseif ($row->type == "tag") {
                                            $icon = "fa-tag";
                                        } elseif ($row->type == "category") {
                                            $icon = "fa-folder";
                                        } else {
                                            $icon = "fa-link";
                                        }

                                        $html = '<li class="dd-item" data-link="' . $row->link . '" data-id="' . $row->id . '" data-image_id="' . $row->image_id . '" data-name="' . $name . '" data-type="' . $row->type . '" data-type_id="' . $row->type_id . '">
                                        <div class="dd-handle">

                                          <i class="fa ' . $icon . '"></i> &nbsp;' . $row->name
                                            . '</div> <a href="javascript:void(0)" class="pull-right remove-item"> <i class="fa fa-times"></i> </a>';
                                        return $html;
                                    }
                                ));

                                ?>

                                @if(trim($html) == "")
                                    <div class="dd-empty"></div>
                                @else
                                    <ul class="dd-list">
                                        {!! $html !!}
                                    </ul>
                                @endif


                            </div>

                            <form class="nav-items-form">

                                <input type="hidden" name="menu" value="{{ $id }}"/>
                                <br/>

                                <textarea name="tree" id="nestable2-output" class="form-control hidden"></textarea>

                                <div class="dd-handle" style="overflow: hidden">

                                    <button type="submit" class="btn btn-primary pull-right"
                                            data-loading-text="{{ trans("navigations::navigations.loading") }}">
                                        {{ trans("navigations::navigations.save_items") }}
                                    </button>

                                </div>

                            </form>

                        </div>
                    </div>
                </div>

                <div class="col-md-4">

                    <div class="panel panel-default">
                        <div class="panel-body">


                            <div class="panel-group" id="accordion">


                                @foreach (["post", "page", "category", "tag"] as $type)
                                    <?php
                                    if ($type == "post") {
                                        $icon = "fa-newspaper-o";
                                    } elseif ($type == "page") {
                                        $icon = "fa-file-text-o";
                                    } elseif ($type == "tag") {
                                        $icon = "fa-tag";
                                    } elseif ($type == "category") {
                                        $icon = "fa-folder";
                                    } else {
                                        $icon = "fa-link";
                                    }

                                    ?>


                                    <div class="panel panel-default">
                                        <div class="panel-heading" data-toggle="collapse" data-parent="#accordion"
                                             href="#collapse{{ $type }}" style="cursor: pointer">
                                            <h5 class="panel-title">

                                                <i class="fa {{ $icon }}"></i>

                                                <a data-toggle="collapse" data-parent="#accordion"
                                                   href="#collapse{{ $type }}">{{ trans("navigations::navigations." . str_plural($type)) }}</a>
                                            </h5>
                                        </div>
                                        <div id="collapse{{ $type }}"
                                             class="panel-collapse collapse {{ ($type == "post") ? "in" : "" }}">
                                            <div class="panel-body">

                                                <form class="nav-search-form">

                                                    <input type="hidden" name="type" value="{{ $type }}">

                                                    <div class="input-group">
                                                        <input autocomplete="off" name="q" value="" type="text"
                                                               class=" form-control"
                                                               placeholder="{{ trans("navigations::navigations.search_" . str_plural($type)) }} ..">
                                                        <span class="input-group-btn">
                                        <button data-loading-text="<i class='fa fa-spinner fa-spin'><i>"
                                                class="btn btn-primary" type="submit"><i class="fa fa-search"></i>
                                        </button>
                                    </span>

                                                    </div>

                                                    <div class="search-items">

                                                    </div>

                                                </form>

                                            </div>
                                        </div>
                                    </div>


                                @endforeach

                                <div class="panel panel-default">
                                    <div class="panel-heading" data-toggle="collapse" data-parent="#accordion"
                                         href="#collapselink" style="cursor: pointer">
                                        <h5 class="panel-title">

                                            <i class="fa fa-link"></i>

                                            <a>{{ trans("navigations::navigations.links") }}</a>
                                        </h5>
                                    </div>
                                    <div id="collapselink"
                                         class="panel-collapse collapse">
                                        <div class="panel-body">

                                            <form class="nav-link-form">

                                                <input type="hidden" name="type" value="url">

                                                <div class="form-group input-group">
                                                    <span class="input-group-addon"><i class="fa fa-bars"></i></span>
                                                    <input autocomplete="off" required name="name" value=""
                                                           class="form-control input-lg"
                                                           placeholder="{{ trans("navigations::navigations.name") }}"/>
                                                </div>

                                                <div class="form-group input-group">
                                                    <span class="input-group-addon"><i class="fa fa-link"></i></span>
                                                    <input type="text" required autocomplete="off" name="link" value=""
                                                           class="form-control input-lg forign-box"
                                                           placeholder="http://example.com"/>
                                                </div>

                                                <div class="dd-handle" style="overflow: hidden">


                                            <span class="pull-left" style="margin-top: 3px">

                                                <button type="button" class="btn btn-default nav-image-selector">
                                                    <i class="fa fa-picture-o" aria-hidden="true"></i>
                                                </button>

                                                <input type="hidden" class="nav_image_id" name="image_id" value="0"/>

                                                <span class="nav-image-viewer">
                                                    {{ trans("navigations::navigations.no_image") }}
                                                </span>

                                            </span>


                                                    <button type="submit" class="btn btn-primary pull-right">
                                                        {{ trans("navigations::navigations.add_item") }}
                                                    </button>


                                                </div>

                                            </form>

                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>

            </div>
        @endif


    </div>
@stop

@section("head")

    <link href="{{ assets("admin::css/plugins/nestable/nestable.ltr.css") }}" type="text/css"
          rel="stylesheet"/>

    <style>

        .dd-placeholder, .dd-empty {
            background: none;
        }

        a.nav-image-remove {
            position: relative;
            left: -10px;
            background: #111;
            color: #fff;
            width: 19px;
            top: -16px;
        }


    </style>

@stop

@section("footer")

    <script src="{{ assets("admin::js/plugins/nestable/jquery.nestable." . DIRECTION . ".js") }}"></script>

    <script>

        $(document).ready(function () {

            $(".nav-search-form").submit(function () {

                var base = $(this);

                var type = base.find("input[name=type]").first().val();
                var loader = base.find("button[type=submit]").first();

                loader.button("loading");

                $.post("{{ route("admin.navigations.search") }}", base.serialize(), function (data) {

                    base.find(".search-items").first().html(data);

                    loader.button("reset");

                    $('#nest-' + type).nestable({
                        listNodeName: 'ul',
                        group: 1
                    });

                });

                return false;
            });


            $(".create_nav_menu").submit(function () {


                var base = $(this);


                var loader = base.find("button[type=submit]").first();

                loader.button("loading");

                $.post("{{ route("admin.navigations.save_menu") }}", base.serialize(), function (result) {

                    if (result.name !== undefined) {
                        error = result.name.join(" ");
                        $(".nav-form-error").html(error);
                        loader.button("reset");
                        return false
                    }

                    loader.button("reset");


                    window.location.href = result.url;

                }, "json").fail(function () {
                    loader.button("reset");
                });


                return false;
            });

            $(".nav-selector").change(function () {

                var base = $(this);
                window.location.href = "{{ route("admin.navigations.show") }}/" + base.val();

            });


            $("body").on("click", ".nav-image-remove", function () {
                $(".nav_image_id").val(0);
                $(".nav-image-viewer").html("{{ trans("navigations::navigations.no_image") }}");

                return false;
            });

            $(".nav-image-selector").filemanager({

                panel: "upload",

                done: function (files) {
                    if (files.length) {
                        file = files[0];

                        $(".nav_image_id").val(file.id);
                        $(".nav-image-viewer").html("<img style='max-width: 300px;max-height: 51px;' src='" + file.url + "' /><a href='' class='nav-image-remove'><i class='fa fa-times'></i></a>");

                    }
                }

            });


            $(".nav-items-form").submit(function () {

                var base = $(this);

                var loader = base.find("button[type=submit]").first();

                loader.button("loading");

                $.post("{{ route("admin.navigations.save_items") }}", base.serialize(), function (data) {

                    base.find(".search-items").first().html(data);

                    loader.button("reset");

                    // reload parent window if iframe
                    if (window.self !== window.top) {
                        window.parent.location.reload()
                    }

                }).fail(function () {
                    loader.button("reset");
                });

                return false;
            });


            $(".nav-link-form").submit(function () {


                var base = $(this);

                var loader = base.find("button[type=submit]").first();

                loader.button("loading");

                $.post("{{ route("admin.navigations.add_link") }}", base.serialize(), function (data) {


                    $(".dd-list").append(data);

                    base.find("[name=name]").first().val("");
                    base.find("[name=link]").first().val("");
                    base.find("[name=image_id]").first().val("");

                    loader.button("reset");

                    // activate Nestable for list 2
                    $('#nestable2').nestable({
                        listNodeName: 'ul',
                        group: 1
                    }).on('change', updateOutput);

                    updateOutput($('#nestable2').data('output', $('#nestable2-output')));

                });

                return false;


            });


            $("body").on("click", ".remove-item", function () {

                var item = $(this).closest("li");

                confirm_box("{{ trans("navigations::navigations.confirm_item_delete") }}", function () {

                    item.remove();

                    // activate Nestable for list 2
                    $('#nestable2').nestable({
                        listNodeName: 'ul',
                        group: 1
                    }).on('change', updateOutput);

                    updateOutput($('#nestable2').data('output', $('#nestable2-output')));

                    // check empty list
                    if ($("#nestable2 ul li").length == 0) {
                        $("#nestable2").html('<div class="dd-empty"></div>');
                    }

                });

            });

            $("body").on("click", ".delete-menu", function () {

                var id = $(this).attr("data-id");

                confirm_box("{{ trans("navigations::navigations.confirm_menu_delete") }}", function () {

                    $.post("{{ route("admin.navigations.delete_menu") }}", {id: id}, function (data) {
                        window.location.href = "{{ route("admin.navigations.show") }}";
                    });

                });

            });

            var updateOutput = function (e) {
                var list = e.length ? e : $(e.target),
                    output = list.data('output');
                if (window.JSON) {
                    output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
                } else {
                    output.val('JSON browser support required for this demo.');
                }
            };

            // activate Nestable for list 2
            $('#nestable2').nestable({
                listNodeName: 'ul',
                group: 1
            }).on('change', updateOutput);

            updateOutput($('#nestable2').data('output', $('#nestable2-output')));

        });
    </script>

@stop
