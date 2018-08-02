<?php

use Illuminate\Database\Migrations\Migration;

class CreatePostsTable extends Migration
{
    /*
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("posts", function ($table) {
            $table->increments('id');
            $table->string('title')->index();
            $table->string('slug')->unique();
            $table->string('excerpt')->nullable()->index();
            $table->text('content')->nullable();
            $table->integer('image_id')->default(0)->index();
            $table->integer('media_id')->default(0)->index();
            $table->integer('user_id')->default(0)->index();
            $table->integer('status')->default(0)->index();
            $table->string("format")->default("post")->index();
            $table->string("lang")->nullable()->index();
            $table->string("views")->default(0)->index();
            $table->timestamp('created_at')->nullable()->index();
            $table->timestamp('updated_at')->nullable()->index();
            $table->timestamp('published_at')->nullable()->index();
        });

    }

    /*
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('posts');
    }
}
