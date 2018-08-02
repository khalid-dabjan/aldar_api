$(document).ready(function () {
    $("body").on("click", ".ask", function () {
        var link = $(this).attr("href");
        var message = $(this).attr("message");

        if (message == undefined) {
            message = "are you sure?";
        }

        bootbox.confirm(message, function (result) {
            if (result) {
                window.location.href = link;
            }
        });

        return false;
    });
});
