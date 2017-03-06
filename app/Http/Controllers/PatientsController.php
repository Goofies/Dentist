<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Patient;
use App\Note;
use App\Appointment;
use App\Payment;


class PatientsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $patients = Patient::orderBy('name', 'asc')->get();
        foreach ($patients as $patient) {
            $patient['gravatar'] = "https://www.gravatar.com/avatar/".md5($patient['email'])."?s=200&d=identicon";
        }
        return $patients;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function timeline($id)
    {
        $data['appointments']= Appointment::where('patient_id', $id)->get();
        $data['payments']= Payment::where('patient_id', $id)->get();

        return $data;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'lastname' => 'required'
        ]);
        $patient = new Patient();
        $patient->name = $request->name;
        $patient->lastname = $request->lastname;
        $patient->email = $request->email;
        $patient->phone = $request->phone;
        $patient->mobilephone = $request->mobilephone;
        $patient->address = $request->address;

        $patient->save();
        return $patient;
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
    public function update(Request $request)
    {
        $patient = Patient::find($request->id);
        $patient->name = $request->name;
        $patient->lastname = $request->lastname;
        $patient->phone = $request->phone;
        $patient->mobilephone = $request->mobilephone;
        $patient->email = $request->email;
        $patient->address = $request->address;

        $patient->save();

        return $patient;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $patient = Patient::find($id);
        $patient->delete();
    }
}
