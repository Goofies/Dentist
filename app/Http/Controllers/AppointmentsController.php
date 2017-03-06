<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Appointment;
use App\Patient;
use App\Note;
use Carbon\Carbon;


class AppointmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('welcome');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $appointment = new Appointment();
        $appointment->patient_id = $request->patient_id;
        $appointment->date = $request->date;
        $appointment->starting_at = Carbon::createFromTimeStamp($request->starting_at/1000, 'Europe/Athens');
        $appointment->ending_at = Carbon::createFromTimeStamp($request->ending_at/1000, 'Europe/Athens');
        $appointment->operation_name = $request->operation_name;
        $appointment->save();
        if ($request->note) {
            $note = new Note();
            $note->body = $request->note;
            $note->patient_id = $request->patient_id;
            $note->save();
        }
        return $appointment;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $appointment = Appointment::find($id);
        $appointment->delete();
    }

    public function get($date)
    {
        $appointments = Appointment::where('date', "$date")->with('patient')->get();
        return $appointments;
    }
}
