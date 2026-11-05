<?php

namespace Tests\Feature;

use App\Http\Controllers\AuthController;
use Tests\TestCase;

class AuthControllerDependenciesTest extends TestCase
{
    public function test_auth_controller_resolves_with_the_installed_service_clients(): void
    {
        $this->assertInstanceOf(AuthController::class, $this->app->make(AuthController::class));
    }
}
