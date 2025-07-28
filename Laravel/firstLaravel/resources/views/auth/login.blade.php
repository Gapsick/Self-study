<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인폼</title>
</head>

<body>
@isset($errors)
    <p stype="color:red">{{ $errors->first('message')}}</p>
@endisset
    <form name="loginform" action="/login" method="post">
        {{ csrf_field() }}
        <div>
            <label for="email">메일주소:</label>
            <input type="text" name="email">
        </div>
        <div>
            <label for="password">비밀번호:</label>
            <input type="password" name="password">
        </div>
        <button type="submit" name='action' value='send'>로그인</button>

    </form>
</body>

</html>