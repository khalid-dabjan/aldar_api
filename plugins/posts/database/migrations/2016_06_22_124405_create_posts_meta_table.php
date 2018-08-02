<?php

use Illuminate\Database\Migrations\Migration;

class CreatePostsMetaTable extends Migration
{
    /*
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("posts_meta", function ($table) {
            $table->integer('post_id')->index();
            $table->string('name')->index();
            $table->text('value');
        });
    }

    /*
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('posts_meta');
    }
}
