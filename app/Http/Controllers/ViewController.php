<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Appointment;
use App\Patient;

class ViewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

	public function index() 
	{
		return view('welcome');
	}

    public function calendarInfo(Request $request) 
    {
        $dates = $request->data;
        $information = [];
        $i = 0;
        foreach ($dates as $date) {
        	$appointment = Appointment::where('date', "$date")->with('patient')->get();
            $information[$i]["date"] = $date;
            $information[$i]["appointments"] = $appointment;
            $i++;
        }
        return $information;
    }
}
