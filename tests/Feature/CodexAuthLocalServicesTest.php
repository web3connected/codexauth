<?php

namespace Tests\Feature;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;

/** Real HTTP requests to the separately running CodexAuth service. */
class CodexAuthLocalServicesTest extends TestCase
{
    private Client $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = new Client([
            'base_uri' => rtrim(getenv('CODEXAUTH_LOCAL_URL') ?: 'http://127.0.0.1:8003', '/') . '/',
            'connect_timeout' => 3,
            'timeout' => 15,
            'http_errors' => false,
            'allow_redirects' => false,
            'headers' => ['Accept' => 'application/json'],
        ]);

        try {
            $health = $this->client->get('api/health');
        } catch (ConnectException $e) {
            // Only an unreachable service is skippable; HTTP errors are failures.
            $this->markTestSkipped('Local CodexAuth service is offline or unreachable.');
        }

        $this->assertSame(200, $health->getStatusCode(), 'CodexAuth health must return HTTP 200.');
    }

    public function test_health_endpoint_is_healthy(): void
    {
        $response = $this->client->get('api/health');

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('ok', $this->json($response)['status'] ?? null);
    }

    public function test_invalid_login_returns_authentication_failure_without_missing_dependencies(): void
    {
        $response = $this->client->post('api/auth/login', [
            'json' => [
                'email' => 'codexauth-regression-nonexistent@example.invalid',
                'password' => 'invalid-regression-password',
            ],
        ]);

        // Do not include response bodies: debug errors can contain sensitive details.
        $body = (string) $response->getBody();
        $this->assertFalse(
            str_contains($body, 'CodexHashClient') && str_contains($body, 'not found'),
            'The deployed CodexAuth controller must resolve its CodexHash dependency.'
        );
        $this->assertSame(401, $response->getStatusCode(), 'Invalid login must return HTTP 401, never HTTP 500 or success.');
        $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        $this->assertFalse($data['success'] ?? null);
        $this->assertSame('Invalid credentials', $data['message'] ?? null);
        $this->assertArrayNotHasKey('token', $data);
    }

    public function test_me_requires_authentication(): void
    {
        $response = $this->client->get('api/auth/me');

        $this->assertSame(401, $response->getStatusCode());
        $this->assertArrayNotHasKey('token', $this->json($response));
    }

    private function json(ResponseInterface $response): array
    {
        return json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);
    }
}
