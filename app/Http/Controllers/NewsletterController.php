<?php

namespace App\Http\Controllers;

use App\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $count = Newsletter::where('email', '=', $request->get('email'))->count();
        if ($count === 0) {
            $newsletter = new Newsletter();
            $newsletter->email = $request->get('email');
            $newsletter->save();
        }
    }
}
