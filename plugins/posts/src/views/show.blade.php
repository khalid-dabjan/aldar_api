@extends("admin::layouts.master")
@section("content")

    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <h2>
                <i class="fa fa-newspaper-o"></i>
                {{ trans("posts::posts.posts") }}
            </h2>
            <ol class="breadcrumb">
                <li>
                    <a href="{{ route("admin") }}">{{ trans("admin::common.admin") }}</a>
                </li>
                <li>
                    <a href="{{ route("admin.posts.show") }}">{{ trans("posts::posts.posts") }}
                        ({{ $posts->total() }})</a>
                </li>
            </ol>
        </div>
        <div class="col-lg-8 col-md-6 col-sm-6 col-xs-12 text-right">
            <a href="{{ route("admin.posts.create") }}" class="btn btn-primary btn-labeled btn-main"> <span
                    class="btn-label icon fa fa-plus"></span> {{ trans("posts::posts.add_new") }}</a>
        </div>
    </div>

    <div class="wrapper wrapper-content fadeInRight">
        <div id="content-wrapper">
            @include("admin::partials.messages")
            <form action="" method="get" class="filter-form">
                <input type="hidden" name="per_page" value="{{ Request::get('per_page') }}"/>
                <input type="hidden" name="tag_id" value="{{ Request::get('tag_id') }}"/>
                <div class="row">
                    <div class="col-lg-4 col-md-4">
                        <div class="form-group">
                            <select name="sort" class="form-control chosen-select chosen-rtl">
                                <option
                                    value="title"
                                    @if ($sort == "title") selected='selected' @endif>{{ ucfirst(trans("posts::posts.attributes.title")) }}</option>
                                <option
                                    value="created_at"
                                    @if ($sort == "created_at") selected='selected' @endif>{{ ucfirst(trans("posts::posts.attributes.created_at")) }}</option>
                            </select>
                            <select name="order" class="form-control chosen-select chosen-rtl">
                                <option
                                    value="DESC"
                                    @if ($order == "DESC") selected='selected' @endif>{{ trans("posts::posts.desc") }}</option>
                                <option
                                    value="ASC"
                                    @if ($order == "ASC") selected='selected' @endif>{{ trans("posts::posts.asc") }}</option>
                            </select>
                            <button type="submit"
                                    class="btn btn-primary">{{ trans("posts::posts.order") }}</button>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                        <div class="form-group">

                            <select name="status" class="form-control chosen-select chosen-rtl">
                                <option value="">{{ trans("posts::posts.all") }}</option>
                                <option @if (Request::get("status") == "1") selected='selected' @endif
                                value="1">{{ trans("posts::posts.activated") }}</option>
                                <option @if (Request::get("status") == "0") selected='selected' @endif
                                value="0">{{ trans("posts::posts.deactivated") }}</option>
                            </select>

                            <select name="category_id" class="form-control chosen-select chosen-rtl">
                                <option value="">{{ trans("posts::posts.all_categories") }}</option>
                                <?php
                                echo Dot\Categories\Models\Category::tree(array(
                                    "row" => function ($row, $depth) {
                                        $html = '<option value="' . $row->id . '"';
                                        if (Request::get("category_id") == $row->id) {
                                            $html .= 'selected="selected"';
                                        }
                                        $html .= '>' . str_repeat("&nbsp;", $depth * 1) . " - " . $row->name . '</option>';
                                        return $html;
                                    }
                                ));
                                ?>
                            </select>


                            <select name="block_id" class="form-control chosen-select chosen-rtl">
                                <option value="">{{ trans("posts::posts.all_blocks") }}</option>
                                @foreach(Dot\Blocks\Models\Block::all() as $block)
                                    <option @if (Request::get("block_id") == $block->id) selected='selected' @endif
                                    value="{{ $block->id }}">{{ $block->name }}</option>
                                @endforeach
                            </select>

                            <select name="format" class="form-control chosen-select chosen-rtl">
                                <option value="">{{ trans("posts::posts.all_formats") }}</option>
                                @foreach (config("posts.formats") as $format => $icon)
                                    <option @if (Request::get("format") == $format) selected='selected' @endif
                                    value="{{ $format }}">
                                        {{ trans("posts::posts.format_" . $format) }}</option>
                                @endforeach
                            </select>

                            <button type="submit"
                                    class="btn btn-primary">{{ trans("posts::posts.filter") }}</button>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-4">
                        <form action="" method="get" class="search_form">

                            <div class="input-group">
                                <input name="q" value="{{ Request::get("q") }}" type="text"
                                       class=" form-control"
                                       placeholder="{{ trans("posts::posts.search_posts") }} ...">
                                <span class="input-group-btn">
                                    <button class="btn btn-primary" type="submit"><i class="fa fa-search"></i></button>
                                </span>
                            </div>

                            <div class="input-group date datetimepick col-sm-6 pull-left" style="margin-top: 5px">
                                <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                <input name="from" type="text" value="{{ @Request::get("from") }}"
                                       class="form-control" id="input-from"
                                       placeholder="{{ trans("posts::posts.from") }}">
                            </div>

                            <div class="input-group date datetimepick col-sm-6 pull-left" style="margin-top: 5px">
                                <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                <input name="to" type="text" value="{{ @Request::get("to") }}"
                                       class="form-control" id="input-to"
                                       placeholder="{{ trans("posts::posts.to") }}">
                            </div>


                        </form>
                    </div>
                </div>
            </form>
            <form action="" method="post" class="action_form">
                <input type="hidden" name="_token" value="{{ csrf_token() }}"/>
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>
                            <i class="fa fa-file-text-o"></i>
                            {{ trans("posts::posts.posts") }}
                        </h5>
                    </div>
                    <div class="ibox-content">
                        @if (count($posts))
                            <div class="row">
                                <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 action-box">

                                    <select name="action" class="form-control pull-left">
                                        <option value="-1"
                                                selected="selected">{{ trans("posts::posts.bulk_actions") }}</option>
                                        <option value="delete">{{ trans("posts::posts.delete") }}</option>
                                        <option value="activate">{{ trans("posts::posts.activate") }}</option>
                                        <option value="deactivate">{{ trans("posts::posts.deactivate") }}</option>
                                    </select>

                                    <button type="submit"
                                            class="btn btn-primary pull-right">{{ trans("posts::posts.apply") }}</button>

                                </div>

                                <div class="col-lg-6 col-md-4 hidden-sm hidden-xs"></div>

                                <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                                    <select class="form-control per_page_filter">
                                        <option value="" selected="selected">-- {{ trans("posts::posts.per_page") }}
                                            --
                                        </option>
                                        @foreach (array(10, 20, 30, 40) as $num)
                                            <option
                                                value="{{ $num }}"
                                                @if ($num == $per_page) selected="selected" @endif>{{ $num }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table cellpadding="0" cellspacing="0" border="0" class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th style="width:35px">
                                            <input type="checkbox" class="i-checks check_all" name="ids[]"/>
                                        </th>
                                        <th>{{ trans("posts::posts.attributes.title") }}</th>
                                        <th>{{ trans("posts::posts.attributes.created_at") }}</th>
                                        <th>{{ trans("posts::posts.user") }}</th>
                                        <th>{{ trans("posts::posts.tags") }}</th>
                                        <th>{{ trans("posts::posts.attributes.status") }}</th>
                                        <th>{{ trans("posts::posts.actions") }}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach ($posts as $post)
                                        <tr>

                                            <td>
                                                <input type="checkbox" class="i-checks" name="id[]"
                                                       value="{{ $post->id }}"/>
                                            </td>

                                            <td>
                                                <a data-toggle="tooltip" data-placement="bottom"
                                                   title="{{ trans("posts::posts.edit") }}" class="text-navy"
                                                   href="{{ route("admin.posts.edit", array("id" => $post->id)) }}">
                                                    <strong>{{ $post->title }}</strong>
                                                </a>

                                            </td>

                                            <td>
                                                <small>{{ $post->created_at->render() }}</small>
                                            </td>

                                            <td>
                                                <a href="?user_id={{ @$post->user->id }}" class="text-navy">
                                                    <small> {{ @$post->user->first_name }}</small>
                                                </a>
                                            </td>

                                            <td>
                                                @if (count($post->tags))
                                                    @foreach ($post->tags as $tag)
                                                        <a href="?tag_id={{ $tag->id }}" class="text-navy">
                                                            <span class="badge badge-primary">{{ $tag->name }}</span>
                                                        </a>
                                                    @endforeach
                                                @else
                                                    -
                                                @endif
                                            </td>

                                            <td>
                                                @if ($post->status)
                                                    <a data-toggle="tooltip" data-placement="bottom"
                                                       title="{{ trans("posts::posts.activated") }}" class="ask"
                                                       message="{{ trans('posts::posts.sure_deactivate') }}"
                                                       href="{{ URL::route("admin.posts.status", array("id" => $post->id, "status" => 0)) }}">
                                                        <i class="fa fa-toggle-on text-success"></i>
                                                    </a>
                                                @else
                                                    <a data-toggle="tooltip" data-placement="bottom"
                                                       title="{{ trans("posts::posts.deactivated") }}" class="ask"
                                                       message="{{ trans('posts::posts.sure_activate') }}"
                                                       href="{{ URL::route("admin.posts.status", array("id" => $post->id, "status" => 1)) }}">
                                                        <i class="fa fa-toggle-off text-danger"></i>
                                                    </a>
                                                @endif
                                            </td>

                                            <td class="center">
                                                <a data-toggle="tooltip" data-placement="bottom"
                                                   title="{{ trans("posts::posts.edit") }}"
                                                   href="{{ route("admin.posts.edit", array("id" => $post->id)) }}">
                                                    <i class="fa fa-pencil text-navy"></i>
                                                </a>
                                                <a data-toggle="tooltip" data-placement="bottom"
                                                   title="{{ trans("posts::posts.delete") }}" class="delete_user ask"
                                                   message="{{ trans("posts::posts.sure_delete") }}"
                                                   href="{{ URL::route("admin.posts.delete", array("id" => $post->id)) }}">
                                                    <i class="fa fa-times text-navy"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    {{ trans("posts::posts.page") }}
                                    {{ $posts->currentPage() }}
                                    {{ trans("posts::posts.of") }}
                                    {{ $posts->lastPage() }}
                                </div>
                                <div class="col-lg-12 text-center">
                                    {{ $posts->appends(Request::all())->render() }}
                                </div>
                            </div>
                        @else
                            {{ trans("posts::posts.no_records") }}
                        @endif
                    </div>
                </div>
            </form>
        </div>
    </div>

@stop

@section("head")

    <link href="{{ assets('admin::css/plugins/datetimepicker/bootstrap-datetimepicker.min.css') }}"
          rel="stylesheet" type="text/css">

@stop

@section("footer")

    <script type="text/javascript" src="{{ assets('admin::js/plugins/moment/moment.min.js') }}"></script>
    <script type="text/javascript"
            src="{{ assets('admin::js/plugins/datetimepicker/bootstrap-datetimepicker.min.js') }}"></script>

    <script>

        $(document).ready(function () {

            $('.datetimepick').datetimepicker({
                format: 'YYYY-MM-DD HH:mm:ss',
            });

            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });

            $('.check_all').on('ifChecked', function (event) {
                $("input[type=checkbox]").each(function () {
                    $(this).iCheck('check');
                    $(this).change();
                });
            });

            $('.check_all').on('ifUnchecked', function (event) {
                $("input[type=checkbox]").each(function () {
                    $(this).iCheck('uncheck');
                    $(this).change();
                });
            });

            $(".filter-form input[name=per_page]").val($(".per_page_filter").val());

            $(".per_page_filter").change(function () {
                var base = $(this);
                var per_page = base.val();
                $(".filter-form input[name=per_page]").val(per_page);
                $(".filter-form").submit();
            });

            $(".filter-form input[name=from]").val($(".datetimepick input[name=from]").val());
            $(".filter-form input[name=to]").val($(".datetimepick input[name=to]").val());
            $(".date_filter").click(function () {
                var base = $(this);
                var from = $(".datetimepick input[name=from]").val();
                var to = $(".datetimepick input[name=to]").val();
                $(".filter-form input[name=from]").val(from);
                $(".filter-form input[name=to]").val(to);
                $(".filter-form").submit();
            });
        });

    </script>

@stop

