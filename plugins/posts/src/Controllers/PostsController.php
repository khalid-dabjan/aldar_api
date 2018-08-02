<?php

namespace Dot\Posts\Controllers;

use Action;
use Illuminate\Support\Facades\Auth;
use Dot\Platform\Controller;
use Dot\Posts\Models\Post;
use Dot\Posts\Models\PostMeta;
use Redirect;
use Request;
use View;


/**
 * Class PostsController
 * @package Dot\Posts\Controllers
 */
class PostsController extends Controller
{

    /**
     * View payload
     * @var array
     */
    protected $data = [];


    /**
     * Show all posts
     * @return mixed
     */
    function index()
    {

        if (Request::isMethod("post")) {
            if (Request::filled("action")) {
                switch (Request::get("action")) {
                    case "delete":
                        return $this->delete();
                    case "activate":
                        return $this->status(1);
                    case "deactivate":
                        return $this->status(0);
                }
            }
        }

        $this->data["sort"] = (Request::filled("sort")) ? Request::get("sort") : "created_at";
        $this->data["order"] = (Request::filled("order")) ? Request::get("order") : "DESC";
        $this->data['per_page'] = (Request::filled("per_page")) ? Request::get("per_page") : NULL;

        $query = Post::with('image', 'user', 'tags')->orderBy($this->data["sort"], $this->data["order"]);

        if (Request::filled("tag_id")) {
            $query->whereHas("tags", function ($query) {
                $query->where("tags.id", Request::get("tag_id"));
            });
        }

        if (Request::filled("category_id") and Request::get("category_id") != 0) {
            $query->whereHas("categories", function ($query) {
                $query->where("categories.id", Request::get("category_id"));
            });
        }

        if (Request::filled("block_id") and Request::get("block_id") != 0) {
            $query->whereHas("blocks", function ($query) {
                $query->where("blocks.id", Request::get("block_id"));
            });
        }

        if (Request::filled("format")) {
            $query->where("format", Request::get("format"));
        }

        if (Request::filled("from")) {
            $query->where("created_at", ">=", Request::get("from"));
        }

        if (Request::filled("to")) {
            $query->where("created_at", "<=", Request::get("to"));
        }

        if (Request::filled("user_id")) {
            $query->whereHas("user", function ($query) {
                $query->where("users.id", Request::get("user_id"));
            });
        }

        if (Request::filled("status")) {
            $query->where("status", Request::get("status"));
        }

        if (Request::filled("q")) {
            $query->search(urldecode(Request::get("q")));
        }
        $this->data["posts"] = $query->paginate($this->data['per_page']);

        return View::make("posts::show", $this->data);
    }

    /**
     * Delete post by id
     * @return mixed
     */
    public function delete()
    {
        $ids = Request::get("id");

        $ids = is_array($ids) ? $ids : [$ids];

        foreach ($ids as $ID) {

            $post = Post::findOrFail($ID);

//            dd($post);

            // Fire deleting action

  //          Action::fire("post.deleting", $post);

            $post->tags()->detach();
            $post->categories()->detach();
            $post->galleries()->detach();
            $post->blocks()->detach();

            $post->delete();

            // Fire deleted action

    //        Action::fire("post.deleted", $post);
        }

        return Redirect::back()->with("message", trans("posts::posts.events.deleted"));
    }

    /**
     * Activating / Deactivating post by id
     * @param $status
     * @return mixed
     */
    public function status($status)
    {
        $ids = Request::get("id");

        $ids = is_array($ids) ? $ids : [$ids];

        foreach ($ids as $id) {

            $post = Post::findOrFail($id);

            // Fire saving action
            Action::fire("post.saving", $post);

            $post->status = $status;
            $post->save();

            // Fire saved action

            Action::fire("post.saved", $post);
        }

        if ($status) {
            $message = trans("posts::posts.events.activated");
        } else {
            $message = trans("posts::posts.events.deactivated");
        }

        return Redirect::back()->with("message", $message);
    }

    /**
     * Create a new post
     * @return mixed
     */
    public function create()
    {

        $post = new Post();

        if (Request::isMethod("post")) {

            $post->title = Request::get('title');
            $post->excerpt = Request::get('excerpt');
            $post->content = Request::get('content');
            $post->image_id = Request::get('image_id', 0);
            $post->media_id = Request::get('media_id', 0);
            $post->user_id = Auth::user()->id;
            $post->status = Request::get("status", 0);
            $post->format = Request::get("format", "post");
            $post->lang = app()->getLocale();

            $post->published_at = Request::get('published_at');

            if (in_array($post->published_at, [NULL, ""])) {
                $post->published_at = date("Y-m-d H:i:s");
            }

            $post->image_id = $post->image_id ? $post->image_id : NULL;

            // Fire saving action

            Action::fire("post.saving", $post);

            if (!$post->validate()) {
                return Redirect::back()->withErrors($post->errors())->withInput(Request::all());
            }

            $post->image_id = $post->image_id ? $post->image_id : 0;

            $post->save();
            $post->syncTags(Request::get("tags", []));
            $post->categories()->sync(Request::get("categories", []));
            $post->galleries()->sync(Request::get("galleries", []));
            $post->syncBlocks(Request::get("blocks", []));

            // Saving post meta

            $custom_fields = array_filter(array_combine(Request::get("custom_names", []), Request::get("custom_values", [])));

            foreach ($custom_fields as $name => $value) {
                $meta = new PostMeta();
                $meta->name = $name;
                $meta->value = $value;
                $post->meta()->save($meta);
            }

            // Fire saved action

            Action::fire("post.saved", $post);

            return Redirect::route("admin.posts.edit", array("id" => $post->id))
                ->with("message", trans("posts::posts.events.created"));
        }

        $this->data["post_tags"] = array();
        $this->data["post_categories"] = collect([]);
        $this->data["post_galleries"] = collect([]);
        $this->data["post_blocks"] = collect([]);
        $this->data["post"] = $post;

        return View::make("posts::edit", $this->data);
    }

    /**
     * Edit post by id
     * @param $id
     * @return mixed
     */
    public function edit($id)
    {

        $post = Post::findOrFail($id);

        if (Request::isMethod("post")) {

            $post->title = Request::get('title');
            $post->excerpt = Request::get('excerpt');
            $post->content = Request::get('content');
            $post->image_id = Request::get('image_id', 0);
            $post->media_id = Request::get('media_id', 0);
            $post->status = Request::get("status", 0);
            $post->format = Request::get("format", "post");
            $post->published_at = Request::get('published_at') != "" ? Request::get('published_at') : date("Y-m-d H:i:s");
            $post->lang = app()->getLocale();

            $post->image_id = $post->image_id ? $post->image_id : NULL;

            // Fire saving action

            Action::fire("post.saving", $post);

            if (!$post->validate()) {
                return Redirect::back()->withErrors($post->errors())->withInput(Request::all());
            }

            $post->image_id = $post->image_id ? $post->image_id : 0;

            $post->save();
            $post->categories()->sync(Request::get("categories", []));
            $post->galleries()->sync(Request::get("galleries", []));
            $post->syncTags(Request::get("tags", []));
            $post->syncBlocks(Request::get("blocks", []));

            // Fire saved action

            PostMeta::where("post_id", $post->id)->delete();

            $custom_fields = array_filter(array_combine(Request::get("custom_names", []), Request::get("custom_values", [])));

            foreach ($custom_fields as $name => $value) {
                $meta = new PostMeta();
                $meta->name = $name;
                $meta->value = $value;
                $post->meta()->save($meta);
            }

            // Fire saved action

            Action::fire("post.saved", $post);

            return Redirect::route("admin.posts.edit", array("id" => $id))->with("message", trans("posts::posts.events.updated"));
        }

        $this->data["post_tags"] = $post->tags->pluck("name")->toArray();
        $this->data["post_categories"] = $post->categories;
        $this->data["post_galleries"] = $post->galleries;
        $this->data["post_blocks"] = $post->blocks;
        $this->data["post"] = $post;

        return View::make("posts::edit", $this->data);
    }

}
