<?php

use Illuminate\Database\Migrations\Migration;

class CreatePostsCategoriesTable extends Migration
{
    /*
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create("posts_categories", function ($table) {
            $table->integer('post_id')->index();
            $table->integer('category_id')->index();
        });

    }

    /*
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('posts_categories');
    }
}
