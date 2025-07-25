<?php

declare(strict_types=1);    // 타입 검사 엄격하게 하겠따는 의미 -> string자리에 int 넣으면 에러

namespace App\Http\Controllers;

use App\Models\User;                    // DB의 users 테이블과 연결된 모델
use Illuminate\Http\Request;            // 사용자 폼 입력을 처리
use Illuminate\Support\Facades\Hash;    // 비밀번호 암호화용 헬퍼

class RegisterController extends Controller
{
    public function create() {   // '/register'주소로 요청이 오면,  (router에서 class와 function을 정의할 수 있음)

        return view('regist.register');     // resources/views/regist/register.blade.php 뷰를 보여달라는 뜻 -> .blade.php는 기본
    }

    public function store(Request $request)     // 폼에서 넘어온 데이터를 $request로 받아옴 (Post 요청)
    {
        $request->validate([    // 유효성 검사
            // required: 필수, string: 문자열, email: 이메일 형식, unique:users:users :테이블에서 중복 불가, confirmed : password 확인값과 일치해야 함
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),   // Hash::make(): 비밀번호 암호화
        ]);

        return view('regist.complete', compact('user'));    // resources/views/regist/complete.blade.php 뷰를 반환하면서, user 데이터를 넘겨 줌
    }
}
