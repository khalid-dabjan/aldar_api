<div class="row  border-bottom white-bg dashboard-header" style="margin:0">

    <div class="col-sm-3">
        <h2><?php echo Config::get("site_title"); ?></h2>
        <small><?php echo trans("posts::widget.welcome") ?> {{ ucfirst(Auth::user()->first_name) }} </small>

        <br/><br/><br/>

        <ul class="list-group clear-list m-t">
            <li class="list-group-item">
                <span class="label label-primary pull-right">
                    <?php echo $articles_count; ?>
                </span>
                <?php echo trans("posts::widget.articles"); ?>
            </li>
            <li class="list-group-item fist-item">
                <span class="label label-primary pull-right">
                    <?php echo $videos_count; ?>
                </span>
                <?php echo trans("posts::widget.videos"); ?>
            </li>
            <li class="list-group-item">
                <span class="label label-primary pull-right">
                    <?php echo $users_count; ?>
                </span>
                <?php echo trans("posts::widget.users"); ?>
            </li>
            <li class="list-group-item">
                <span class="label label-primary pull-right">
                    <?php echo $categories_count; ?>
                </span>
                <?php echo trans("posts::widget.categories"); ?>
            </li>
            <li class="list-group-item">
                <span class="label label-primary pull-right">
                    <?php echo $tags_count; ?>
                </span>
                <?php echo trans("posts::widget.tags"); ?>
            </li>
        </ul>
    </div>
    <div class="col-sm-9">
        <div style="margin-top:33px">
            <canvas id="lineChart" height="114"></canvas>
        </div>
    </div>
</div>



@section("footer")

    <script src="<?php echo assets("admin::") ?>/js/plugins/chartJs/Chart.min.js"></script>

    <script>
        $(document).ready(function () {

            var lineData = {
                labels: [<?php echo '"' . join('", "', array_keys($posts_charts)) . '"'; ?>],
                datasets: [
                    {
                        label: "الأخبار",
                        fillColor: '{{ Auth::user()->color == "blue" ? "#1e8cbe" : "#1ab394" }}',
                        strokeColor: "#ccc",
                        pointColor: "#ccc",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "ccc",
                        data: [<?php echo join(', ', array_values($posts_charts)); ?>]
                    }
                ]
            };

            var lineOptions = {
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                bezierCurve: true,
                bezierCurveTension: 0.4,
                pointDot: true,
                pointDotRadius: 4,
                pointDotStrokeWidth: 1,
                pointHitDetectionRadius: 20,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true,
                responsive: true,
            };

            var ctx = document.getElementById("lineChart").getContext("2d");
            var myNewChart = new Chart(ctx).Line(lineData, lineOptions);

        });
    </script>

@stop
