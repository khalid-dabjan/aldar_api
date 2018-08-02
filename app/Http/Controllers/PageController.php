<?php

namespace App\Http\Controllers;

use App\Category;
use App\Page;
use App\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PageController extends Controller
{
    public function get($slug)
    {
        return Page::getPage($slug);
    }

    public function contactUs(Request $request)
    {
        Mail::send('emails.contact', ['data' => $request->all()], function ($message) {
            $message->from('contact@aldar.com', 'Al Dar Contact Us');
            $message->to('editorial@aldar.com');
        });
    }
}
