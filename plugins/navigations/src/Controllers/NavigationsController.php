<?php

namespace Dot\Navigations\Controllers;

use Dot\Categories\Models\Category;
use Dot\Navigations\Models\Nav;
use Dot\Pages\Models\Page;
use Dot\Platform\Controller;
use Dot\Posts\Models\Post;
use Dot\Tags\Models\Tag;
use Request;
use stdClass;

/*
 * Class NavigationsController
 * @package Dot\Navigations\Controllers
 */
class NavigationsController extends Controller
{

    /*
     * View payload
     * @var array
     */
    public $data = [];


    /*
     * Show menu by id
     * @param int $id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    function index($id = 0)
    {
        $nav = Nav::find($id);

        if (!$id) {
            $nav = Nav::first();
            if ($nav) {
                return redirect()->route("admin.navigations.show", ["id" => $nav->id]);
            }
        }

        $this->data["nav"] = $nav;
        $this->data["navs"] = Nav::where("menu", 0)->get();

        $this->data["id"] = $id;
        return view("navigations::navigations", $this->data);
    }

    /*
     * Create / Edit menu
     * @return string
     */
    function save_menu()
    {

        if (Request::filled("id")) {
            $nav = Nav::find(Request::get("id"));
        } else {
            $nav = new Nav();
        }

        $nav->name = Request::get("name");
        $nav->lang = app()->getLocale();

        if (!$nav->validate()) {
            return json_encode($nav->errors());
        }

        $nav->save();

        return json_encode(["url" => route("admin.navigations.show", ["id" => $nav->id])]);
    }


    /*
     * Delete menu by id
     * @return void
     */
    function delete_menu()
    {

        $nav = Nav::find(Request::get("id"));

        $nav->delete();

        Nav::where("menu", $nav->id)->delete();
    }

    /*
     * Add a custom link to menu
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    function add_link()
    {

        $name = Request::get("name");
        $link = Request::get("link");
        $image_id = Request::get("image_id");

        $item = new stdClass();
        $item->type = "url";
        $item->type_id = 0;
        $item->name = $name;
        $item->image_id = $image_id;
        $item->link = $link;

        $this->data["type"] = $item->type;
        $this->data["items"] = [$item];

        return view("navigations::results", $this->data);
    }


    /*
     * Save items to menu
     * @return void
     */
    function save_items()
    {

        $menu_id = Request::get("menu");

        Nav::where("menu", $menu_id)->delete();

        $items = json_decode(Request::get("tree"));

        $items = array_filter($items);

        $order = 0;

        foreach ($items as $item) {

            if (isset($item->id)) {

                $nav = new Nav();
                $nav->name = $item->name;
                $nav->link = $item->link;
                $nav->type = $item->type;
                $nav->image_id = isset($item->image_id) ? $item->image_id : 0;
                $nav->type_id = $item->type_id;
                $nav->parent = 0;
                $nav->order = $order;
                $nav->menu = $menu_id;
                $nav->lang = app()->getLocale();

                $nav->save();

                $children = isset($item->children) ? $item->children : [];
                $nav->saveChildren($children);

                $order++;
            }
        }
    }

    /*
     * Search in items by type
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    function search()
    {

        $q = Request::get("q");

        $type = Request::get("type");

        $items = [];

        if ($type == "post") {

            $result = Post::search($q)->limit(5)->get();

            foreach ($result as $row) {
                $item = new stdClass();
                $item->type = "post";
                $item->type_id = $row->id;
                $item->name = $row->title;
                $item->link = "";

                $items[] = $item;
            }

        } else if ($type == "page") {

            $result = Page::search($q)->limit(5)->get();

            foreach ($result as $row) {
                $item = new stdClass();
                $item->type = "page";
                $item->type_id = $row->id;
                $item->name = $row->title;
                $item->link = "";

                $items[] = $item;
            }

        } else if ($type == "category") {

            $result = Category::search($q)->limit(5)->get();

            foreach ($result as $row) {
                $item = new stdClass();
                $item->type = "category";
                $item->type_id = $row->id;
                $item->name = $row->name;
                $item->link = "";

                $items[] = $item;
            }

        } else if ($type == "tag") {

            $result = Tag::search($q)->limit(5)->get();

            foreach ($result as $row) {
                $item = new stdClass();
                $item->type = "tag";
                $item->type_id = $row->id;
                $item->name = $row->name;
                $item->link = "";

                $items[] = $item;
            }
        }

        $this->data["items"] = $items;
        $this->data["type"] = $type;

        return view("navigations::results", $this->data);
    }
}
