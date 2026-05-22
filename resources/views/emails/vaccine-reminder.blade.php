<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vaccine Reminder</title>
    <style>
        body { margin: 0; padding: 0; background: #f4f7f9; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
        .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 36px 40px; text-align: center; }
        .header .icon { font-size: 40px; margin-bottom: 12px; }
        .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
        .header p { margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
        .message { font-size: 14px; color: #4a5568; line-height: 1.7; margin-bottom: 28px; }
        .info-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
        .info-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
        .info-row:last-child { margin-bottom: 0; }
        .info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #6b7280; min-width: 80px; padding-top: 1px; }
        .info-value { font-size: 14px; font-weight: 600; color: #111827; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
        .status-pending  { background: #dbeafe; color: #1d4ed8; }
        .status-upcoming { background: #fef3c7; color: #92400e; }
        .status-delayed  { background: #ffedd5; color: #c2410c; }
        .status-missed   { background: #fee2e2; color: #b91c1c; }
        .status-taken    { background: #d1fae5; color: #065f46; }
        .cta { text-align: center; margin-bottom: 32px; }
        .cta a { display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.2px; }
        .divider { border: none; border-top: 1px solid #e5e7eb; margin: 0 0 28px; }
        .doctor-note { background: #f8fafc; border-radius: 10px; padding: 16px 20px; font-size: 13px; color: #4a5568; line-height: 1.6; }
        .doctor-name { font-weight: 700; color: #1a1a2e; }
        .footer { background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6; }
    </style>
</head>
<body>
<div class="wrapper">

    <!-- Header -->
    <div class="header">
        <div class="icon">💉</div>
        <h1>Vaccine Reminder</h1>
        <p>No Child Missed — Child Vaccination Tracking</p>
    </div>

    <!-- Body -->
    <div class="body">

        <p class="greeting">
            Dear {{ $confirmation->parent?->name }} {{ $confirmation->parent?->surname }},
        </p>

        <p class="message">
            This is a reminder that <strong>{{ $confirmation->child?->name }} {{ $confirmation->child?->surname }}</strong>
            has a scheduled vaccination. Please ensure the vaccination takes place as soon as possible.
        </p>

        <!-- Info Card -->
        <div class="info-card">
            <div class="info-row">
                <span class="info-label">Child</span>
                <span class="info-value">{{ $confirmation->child?->name }} {{ $confirmation->child?->surname }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Vaccine</span>
                <span class="info-value">{{ $confirmation->vaccine?->name ?? 'N/A' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value">
                    <span class="status-badge status-{{ $confirmation->status }}">{{ ucfirst($confirmation->status) }}</span>
                </span>
            </div>
            @if ($confirmation->vaccine?->recommended_age_months)
            <div class="info-row">
                <span class="info-label">Rec. Age</span>
                <span class="info-value">{{ $confirmation->vaccine->recommended_age_months }} months</span>
            </div>
            @endif
        </div>

        <!-- CTA -->
        <div class="cta">
            <a href="{{ url('/confirm/' . $confirmation->id) }}">View Vaccination Details</a>
        </div>

        <hr class="divider" />

        <!-- Doctor note -->
        @if ($doctor)
        <div class="doctor-note">
            This reminder was sent by your child's assigned doctor,
            <span class="doctor-name">Dr. {{ $doctor->name }} {{ $doctor->surname }}</span>.
            @if ($doctor->email)
                You can reach them at <a href="mailto:{{ $doctor->email }}">{{ $doctor->email }}</a>.
            @endif
            @if ($doctor->phone_number)
                Phone: {{ $doctor->phone_number }}.
            @endif
        </div>
        @endif

    </div>

    <!-- Footer -->
    <div class="footer">
        <p>
            This is an automated reminder from <strong>No Child Missed</strong>.<br />
            If you believe this was sent in error, please ignore this email.
        </p>
    </div>

</div>
</body>
</html>
