<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    public function patient() 
    {
    	return $this->belongsTo('App\Patient');
    }
}
