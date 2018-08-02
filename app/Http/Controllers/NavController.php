<?php

namespace App\Http\Controllers;

use App\Navigation;
use Illuminate\Http\Request;

class NavController extends Controller
{
    public function getNav(Navigation $navigation)
    {
        return $navigation->getNavigation();
    }

    public function getfooterNav()
    {
        return Navigation::getFooterNavigation();
    }
}
