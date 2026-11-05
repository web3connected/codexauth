<?php

namespace Tests\Feature;

use Tests\TestCase;

class CodexSecureStatusTest extends TestCase
{
    public function test_codexsecure_status_endpoint_returns_zone_header(): void
    {
        $response = $this->getJson('/api/codexsecure/status');

        $response
            ->assertOk()
            ->assertHeader('X-Codex-Zone', '2')
            ->assertJsonPath('service', 'codexauth')
            ->assertJsonPath('zone.zone_id', 2);
    }
}
