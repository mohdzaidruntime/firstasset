<?php

namespace App\Http\Controllers;

use App\Models\ClientUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientUserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'phone_no' => 'required|string|size:13|unique:users,phone_no',
            'password' => 'required|confirmed',
            'state' => 'required|string',
            'city' => 'required|string',
            'interested_in' => 'required|array',
            'interested_in.*' => 'string|in:Fractional,Property Management,Sole selling projects with FIRST/ASSET',
        ]);
        if (User::where('email', $request->email)->first()) {
            return response([
                'message' => 'Email already exists',
                'status' => 'failed'
            ], 200);
        }
        $user  = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_no' => $request->phone_no,
            'password' => Hash::make($request->password),
        ]);
        $clientuser = ClientUser::create([
            'user_id' => $user->id,
            'interested_in' => implode(",", $request->interested_in),
            'state' => $request->state,
            'city' => $request->city,
        ]);
        
        $user->clientuser()->save($clientuser);
        $token = $user->createToken($request->email)->plainTextToken;
        

       
        return response([
            'data' => $user,
            'token' => $token,
            'message' => 'Register Success',
            'status' => 'success'
        ], 200);
    }
}