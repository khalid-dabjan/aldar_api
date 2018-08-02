<?php

use Illuminate\Database\Migrations\Migration;

class CreatePostsTagsTable extends Migration
{
    /*
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("posts_tags", function ($table) {
            $table->integer('post_id')->index();
            $table->integer('tag_id')->index();
        });

    }

    /*
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('posts_tags');
    }
}
