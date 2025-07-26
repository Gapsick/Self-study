@props(['row'])

<h2><a href="/list/{{$row['id']}}">{{ $row['subject'] }}</a></h2>
<p>{{ $row['context']}}</p>