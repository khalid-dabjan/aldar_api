@if (count($items))

    @if ($type != "url")
        <div class="dd" id="nest-{{ $type }}">

            <ul class="dd-list">
                @endif

                @foreach ($items as $item)

                    <?php
                    $name = strip_tags(trim(preg_replace('/\s\s+/', ' ', $item->name)));

                    if ($item->type == "post") {
                        $icon = "fa-newspaper-o";
                    } elseif ($item->type == "page") {
                        $icon = "fa-file-text-o";
                    } elseif ($item->type == "tag") {
                        $icon = "fa-tag";
                    } elseif ($item->type == "category") {
                        $icon = "fa-folder";
                    } else {
                        $icon = "fa-link";
                    }

                    ?>
                    <li class="dd-item" data-id="{{ str_random(10) }}" data-name="{{ $name }}"
                        data-link="{{ $item->link }}" data-image_id="{{ isset($item->image_id) ? $item->image_id : 0 }}"
                        data-type="{{ $item->type }}"
                        data-type_id="{{ $item->type_id }}">
                        <div class="dd-handle">
                            <i class="fa {{ $icon }}"></i> &nbsp;
                            {{ $item->name }}
                        </div>
                        <a href="javascript:void(0)" class="pull-right remove-item"> <i class="fa fa-times"></i> </a>
                    </li>

                @endforeach

                @if ($type != "url")
            </ul>

        </div>
    @endif

@else

    <div class="dd-handle">
        {{ trans("navigations::navigations.no_results") }}
    </div>

@endif
