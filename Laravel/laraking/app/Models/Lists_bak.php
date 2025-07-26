<?php
namespace App\Models;

class Lists {
    public static function getAll() {
        return [
            [
                'idx' => 1,
                'subject' => '첫번째 콘텐츠',
                'contents' => '여기가 본문입니다.'
            ],
            [
                'idx' => 2,
                'subject' => '두번째 콘텐츠',
                'contents' => '여기가 두번째 본문입니다.'
            ]
        ];
    }

    public static function getOne($idx) {
        $lists = self::getAll();
        foreach($lists as $row){
            if($row['idx'] == $idx) {
                return $row;
            }
        }
    }
}