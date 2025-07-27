<x-layout>
    <h1>Posts 인덱스 페이지입니다.</h1>
    <p>저는 {{ $name }} 입니다. 나이는 {{ $age }}세 입니다.</p>
    <ul>
        @foreach($posts_list as $post)
        <li> {{ $post }}</li>
        @endforeach
    </ul>    
</x-layout>