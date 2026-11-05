<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'codexhash' => [
        'url' => env('CODEX_HASH_URL', env('CODEXHASH_API_URL', 'http://codexhash-api:8001')),
        'api_key' => env('CODEXHASH_API_KEY'),
        'timeout' => (int) env('CODEXHASH_TIMEOUT', 5),
    ],

    'codextime' => [
        'url' => env('CODEX_TIME_URL', env('CODEXTIME_API_URL', 'http://codextime-api:50002')),
        'api_key' => env('CODEXTIME_API_KEY'),
        'timeout' => (int) env('CODEXTIME_TIMEOUT', 5),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
