<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    | Web3Codex engines CodexAuth calls over HTTP. Configuration only for now:
    | no client or operation is implemented yet (next phase).
    */

    'codexhash' => [
        'url' => env('CODEXHASH_URL'),
        'api_key' => env('CODEXHASH_API_KEY'),
        'timeout' => (int) env('CODEXHASH_TIMEOUT', 5),
        'connect_timeout' => (int) env('CODEXHASH_CONNECT_TIMEOUT', 2),
    ],

    'codextime' => [
        'url' => env('CODEXTIME_URL'),
        'api_key' => env('CODEXTIME_API_KEY'),
        'timeout' => (int) env('CODEXTIME_TIMEOUT', 5),
        'connect_timeout' => (int) env('CODEXTIME_CONNECT_TIMEOUT', 2),
    ],

];
