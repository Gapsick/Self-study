<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Layout</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <header>
        <h1>Website Header</h1>
    </header>
    <main>
        @yield('content')
    </main>
    <footer>
        @include('inc.footer')
    </footer>
</body>
</html>
