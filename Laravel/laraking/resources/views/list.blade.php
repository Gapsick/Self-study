@extends('layout')

@section('content')

        <section class="post-list">
            @foreach($lists as $row) 
            <article class="post">
                <x-lists-card :row="$row" />
            </article>
            @endforeach
        </section>

    @if(count($lists) > 0)
        <p>자료가 {{ count($lists) }} 건 있습니다.</p>
    @endif

@endsection