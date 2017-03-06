<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    public function appointments() 
    {
    	return $this->hasMany('App\Appointment');
    }
    public function notes() 
    {
    	return $this->hasMany('App\Note');
    }
    public function payments() 
    {
    	return $this->hasMany('App\Payment');
    }
    protected static function boot() {
        parent::boot();

        static::deleting(function($patient) { // before delete() method call this
             $patient->appointments()->delete();
             $patient->notes()->delete();
             $patient->payments()->delete();
             // do the rest of the cleanup...
        });
    }
}
