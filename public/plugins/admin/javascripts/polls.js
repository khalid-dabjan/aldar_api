$(function () {


    if ($('#add-answer').length) {
        $('#add-answer').click(function (ev) {
            ev.preventDefault();
            var self = $(this);
            var container = $('#new-answer-container');
            var answerNum = parseInt(self.attr('data-answer_num'));
            var newAnswerNum = answerNum + 1;
            $.ajax({
                url: baseURL + 'polls/newAnswer',
                dataType: 'html',
                data: {
                    answer_num: answerNum
                },
                success: function (data) {
                    container.append(data);
                    self.attr('data-answer_num', newAnswerNum);
                    $('.set-answer-thumbnail').filemanager({
                        types: "png|jpg|jpeg|gif|bmp",
                        done: function (files, newAnswerNum) {
                            console.log(newAnswerNum.length);
                            if (files.length) {
                                //var id = intiator.attr('data-id');
                                var file = files[0];
                                $('#image_holder_' + newAnswerNum.length).val(file.media_id);
                                $('#image_preview_' + newAnswerNum.length).attr('src', file.media_thumbnail);

                            }
                        },
                        error: function (media_path) {
                            alert(media_path);
                        }
                    });
                }
            });
        });
    }
    if ($('#add-answer').length) {
        $('.remove-answer').bind('click', function (event) {
            event.preventDefault();
            var self = $(this);
            var theForm = $('#edit-form');
            var answerId = self.attr('data-answer-id');
            var divSelector = '#answer_' + answerId;
            $(divSelector).hide('slow', function () {
                $(this).remove();
                $('<input>', {
                    'type': 'hidden',
                    'name': 'deleted[]',
                    'value': answerId
                }).appendTo(theForm);
            });
        });
    }

//    $('#delete-poll').on('click', function (ev) {
//        ev.preventDefault();
//        var form = $('#delete-form');
//        bootbox.confirm({
//            message: "Are you sure?",
//            callback: function (result) {
//                if (result) {
//                    form.submit();
//                }
//            },
//            className: "bootbox-sm"
//        });
//
//    });
});
