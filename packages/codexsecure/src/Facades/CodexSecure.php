<?php

namespace Web3Codex\CodexSecure\Facades;

use Illuminate\Support\Facades\Facade;

class CodexSecure extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'codex.secure';
    }
}
