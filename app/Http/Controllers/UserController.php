<?php

namespace App\Http\Controllers;

use App\OrderedBlock;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Validator;

class UserController extends Controller
{
    public $successStatus = 200;

    /**
     * login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login()
    {
        if (Auth::attempt(['username' => request('username'), 'password' => request('password')])) {
            $user = Auth::user();
            $success['token'] = $user->createToken('MyApp')->accessToken;
            $success['result'] = true;
            return response()->json($success, $this->successStatus);
        } else {
            return response()->json(['result' => false], 401);
        }
    }

    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        $user = Auth::user();
        return response()->json(['success' => $user], $this->successStatus);
    }

    public function order(Request $request)
    {
        $orderedBlock = new OrderedBlock($request->get('block'));
//        return $request->get('ids');
        $orderedBlock->order($request->get('ids'));
    }
}