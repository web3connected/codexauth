<?php

namespace Web3Codex\CodexAuth\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CodexResetTokenMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    /**
     * Create a new message instance.
     *
     * @param string $token
     * @param string|null $email
     * @return void
     */
    public function __construct(string $token, ?string $email = null)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Connect to Web3Connected - Password Reset Code (' . now()->format('H:i:s') . ')')
                    ->view('codexauth::emails.reset-token');
    }
}
