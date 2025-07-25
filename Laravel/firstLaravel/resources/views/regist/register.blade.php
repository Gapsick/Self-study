<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사용자 등록폼</title>
</head>

<body>
    <form name="registerForm" action="/register" method="post" id="registform">
        {{csrf_field()}}

        <div class='registerForm'>
            <label for="name">이름:</label>
            <input type="text" name="name" />
        </div>
        <div class='registerForm'>
            <label for="email">메일주소:</label>
            <input type="text" name="email" />
        </div>
        <div class='registerForm'>
            <label for="password">비밀번호:</label>
            <input type="password" name="password" />
            <span>{{ $errors->first('password') }}</span>
        </div>
        <div class='registerForm'>
            <label for="password_confirmation">비밀번호(확인):</label>
            <input type="password" name="password_confirmation" />
            <span>{{ $errors->first('password_confirmation') }}</span>
        </div>
        <button type='submit' name='action' value='send'>보내기</button>
    </form>
</body>

</html>