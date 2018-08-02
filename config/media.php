<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default media driver
    |--------------------------------------------------------------------------
    */

    "driver" => env("MEDIA_DRIVER", "local"),

    /*
    |--------------------------------------------------------------------------
    | Allowed media drivers
    |--------------------------------------------------------------------------
    */

    "drivers" => [

        "local" => [

            "url" => env("MEDIA_URL"),

            "path" => env("MEDIA_PATH"),

        ]

    ],

    /*
     |--------------------------------------------------------------------------
     | Media Thumbnail sizes
     |--------------------------------------------------------------------------
     */

    'thumbnails' => true,

    'sizes' => [
        'medium' => array(460, 307),
        'small' => array(234, 156),
        'thumbnail' => array(165, 108)
    ],

    /*
     |--------------------------------------------------------------------------
     | Allowed file types
     |--------------------------------------------------------------------------
     */

    "allowed_file_types" => 'jpg,png,jpeg,gif,doc,docx,txt,pdf,zip',

    /*
     |--------------------------------------------------------------------------
     | Max file size to upload in KB
     |--------------------------------------------------------------------------
     */

    "max_file_size" => 3072,

    /*
     |--------------------------------------------------------------------------
     | Maximium image width in px
     | if uploaded image exceeds max width, set it as max width
     |--------------------------------------------------------------------------
     */

    "max_width" => 1200,

    /*
     |--------------------------------------------------------------------------
     | Allowed mime types
     |--------------------------------------------------------------------------
     */

    "mimes" => [
        'csv' => array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel'),
        'pdf' => array('application/pdf', 'application/x-download'),
        'ai' => 'application/postscript',
        'eps' => 'application/postscript',
        'xls' => array('application/excel', 'application/vnd.ms-excel', 'application/msexcel'),
        'ppt' => array('application/powerpoint', 'application/vnd.ms-powerpoint'),
        'swf' => 'application/x-shockwave-flash',
        'zip' => array('application/x-zip', 'application/zip', 'application/x-zip-compressed'),
        'mp3' => array('audio/mpeg', 'audio/mpg', 'audio/mpeg3', 'audio/mp3'),
        'wav' => array('audio/x-wav', 'audio/wave', 'audio/wav'),
        'bmp' => array('image/bmp', 'image/x-windows-bmp'),
        'gif' => 'image/gif',
        'jpg' => array('image/jpeg', 'image/pjpeg'),
        'png' => array('image/png', 'image/x-png'),
        'txt' => 'text/plain',
        'rtx' => 'text/richtext',
        'rtf' => 'text/rtf',
        'mpg' => 'video/mpeg',
        'mov' => 'video/quicktime',
        'avi' => 'video/x-msvideo',
        'doc' => 'application/msword',
        'docx' => array('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'),
        'xlsx' => array('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'),
        'word' => array('application/msword', 'application/octet-stream'),
        'xl' => 'application/excel',
        'mp4' => "video/mp4"
    ],

    /*
     |--------------------------------------------------------------------------
     | S3 configuration
     |--------------------------------------------------------------------------
     */

    "s3" => [

        /*
         |--------------------------------------------------------------------------
         | Allow uploading to S3
         |--------------------------------------------------------------------------
         */

        "status" => false,

        'bucket' => "my-bucket",

        'region' => "eu-west-1",

        /*
         |--------------------------------------------------------------------------
         | Delete file after uploading to S3
         |--------------------------------------------------------------------------
         */

        "delete_locally" => false
    ]
];
