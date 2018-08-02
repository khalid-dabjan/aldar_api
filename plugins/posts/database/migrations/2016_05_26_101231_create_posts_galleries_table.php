<?php

use Illuminate\Database\Migrations\Migration;

class CreatePostsGalleriesTable extends Migration
{
    /*
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create("posts_galleries", function ($table) {
            $table->integer('post_id')->index();
            $table->integer('gallery_id')->index();
        });

    }

    /*
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('posts_galleries');
    }
}
