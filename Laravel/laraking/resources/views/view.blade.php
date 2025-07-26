@extends('layout')

@section('content')
<h2>{{ $row['subject'] }}</h2>
<hr>
<p>email: {{ $row['email'] }}</p>
<p>{{  $row['context'] }}</p>
@endsection

