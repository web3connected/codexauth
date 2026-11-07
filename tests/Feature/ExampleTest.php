<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_health_endpoint_returns_ok_json(): void
    {
        $this->getJson('/api/health')
            ->assertStatus(200)
            ->assertHeader('Content-Type', 'application/json')
            ->assertExactJson(['service' => 'codexauth', 'status' => 'ok']);
    }

    public function test_health_returns_json_without_an_accept_header(): void
    {
        $this->get('/api/health')
            ->assertStatus(200)
            ->assertExactJson(['service' => 'codexauth', 'status' => 'ok']);
    }

    public function test_unknown_api_route_returns_json_404(): void
    {
        $this->get('/api/does-not-exist')
            ->assertStatus(404)
            ->assertHeader('Content-Type', 'application/json')
            ->assertJsonStructure(['message']);
    }

    public function test_unknown_non_api_path_returns_json_404_not_html(): void
    {
        $this->get('/')
            ->assertStatus(404)
            ->assertHeader('Content-Type', 'application/json')
            ->assertJsonStructure(['message']);
    }

    public function test_wrong_method_returns_json_405(): void
    {
        $this->post('/api/health')
            ->assertStatus(405)
            ->assertHeader('Content-Type', 'application/json')
            ->assertJsonStructure(['message']);
    }
}
