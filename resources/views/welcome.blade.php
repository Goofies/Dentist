@extends('master')

@section('content')
<div class="calendar">
	@include('partials.weeklyModal')
	@include('partials.sideModal')
	@include('partials.calendarControls')
	@include('partials.calendarBoxes')
</div>
@endsection
