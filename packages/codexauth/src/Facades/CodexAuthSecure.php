<?php

namespace Web3Codex\CodexAuth\Facades;

use Illuminate\Support\Facades\Facade;

class CodexAuthSecure extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'codex.auth.secure';
    }
}
