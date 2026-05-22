<?php

namespace App\Mail;

use App\Models\Confirmation;
use App\Models\doctor as Doctor;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VaccineReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Confirmation $confirmation,
        public readonly ?Doctor $doctor = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vaccine Reminder: ' . ($this->confirmation->vaccine?->name ?? 'Vaccination'),
            replyTo: $this->doctor?->email
                ? [$this->doctor->email]
                : [],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.vaccine-reminder',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
