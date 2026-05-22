import { Head } from '@inertiajs/react';
import axios from 'axios';
import { CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationCard, ConfirmationRecord } from '@/components/ConfirmationCard';

// ── Types ────────────────────────────────────────────────────────────────────

interface Child {
    id: number;
    name: string;
    surname: string;
    date_of_birth: string;
    gender: string;
    personal_number: string | number;
    blood_type: string;
    allergies: string;
    chronic_diseases: string;
}

interface Vaccine {
    id: number;
    name: string;
    type?: string;
    description?: string;
    image?: string;
}

interface ParentProfile {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    personal_number?: string | number;
}

interface Doctor {
    id: number;
    name: string;
    surname: string;
    email?: string;
    phone_number?: string;
    status?: string;
}

interface Props {
    parentProfile: ParentProfile | null;
    children: Child[];
    vaccines: Vaccine[];
    doctors: Doctor[];
    confirmations: ConfirmationRecord[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const timeSlots = ['08:30', '10:00', '11:30', '14:00', '15:30', '16:45'];
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
    'Janar',
    'Shkurt',
    'Mars',
    'Prill',
    'Maj',
    'Qershor',
    'Korrik',
    'Gusht',
    'Shtator',
    'Tetor',
    'Nëntor',
    'Dhjetor',
];
const monthNumbers: Record<string, string> = {
    Janar: '01',
    Shkurt: '02',
    Mars: '03',
    Prill: '04',
    Maj: '05',
    Qershor: '06',
    Korrik: '07',
    Gusht: '08',
    Shtator: '09',
    Tetor: '10',
    Nëntor: '11',
    Dhjetor: '12',
};

// ── Shared style helpers ──────────────────────────────────────────────────────

const dropBtn =
    'w-full px-4 py-3 rounded-xl bg-background border text-foreground text-xs font-semibold flex items-center justify-between focus:border-primary outline-none transition';
const dropMenu =
    'absolute left-0 right-0 z-50 mt-2 p-1.5 rounded-xl bg-card border shadow-lg space-y-0.5';
const dropItem =
    'w-full text-left px-4 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground text-xs text-muted-foreground font-semibold transition';
const fieldLabel =
    'block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5';
const readField =
    'w-full px-4 py-3 rounded-xl bg-muted border text-foreground text-xs font-bold';

// ── Component ─────────────────────────────────────────────────────────────────

export default function Reservation({
    parentProfile,
    children,
    vaccines,
    doctors,
    confirmations,
}: Props) {
    const [localConfirmations, setLocalConfirmations] =
        useState<ConfirmationRecord[]>(confirmations);
    const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(
        null,
    );
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>('Maj');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [isVaccineOpen, setIsVaccineOpen] = useState(false);
    const [isChildOpen, setIsChildOpen] = useState(false);
    const [isDoctorOpen, setIsDoctorOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canOpenForm =
        selectedVaccine !== null &&
        selectedChild !== null &&
        selectedDoctor !== null &&
        selectedDate !== null &&
        selectedTime !== null;

    const closeAll = () => {
        setIsVaccineOpen(false);
        setIsChildOpen(false);
        setIsDoctorOpen(false);
        setIsDateOpen(false);
        setIsMonthOpen(false);
        setIsTimeOpen(false);
    };

    const appointmentDate =
        selectedDate && selectedMonth
            ? `2026-${monthNumbers[selectedMonth]}-${String(selectedDate).padStart(2, '0')}`
            : null;

    const handleSubmit = async () => {
        if (!parentProfile || !selectedVaccine || !selectedChild || submitting)
            return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await axios.post('/api/confirmations', {
                parent_id: parentProfile.id,
                child_id: selectedChild.id,
                vaccine_id: selectedVaccine.id,
                doctor_id: selectedDoctor?.id ?? null,
                status: 'pending',
                appointment_date: appointmentDate,
                appointment_time: selectedTime,
            });
            // Prepend the new appointment to the local list
            const newConfirmation: ConfirmationRecord = {
                id: res.data?.id ?? Date.now(),
                status: 'pending',
                child: {
                    id: selectedChild.id,
                    name: selectedChild.name,
                    surname: selectedChild.surname,
                },
                parent: {
                    id: parentProfile.id,
                    name: parentProfile.name,
                    surname: parentProfile.surname,
                },
                vaccine: {
                    id: selectedVaccine.id,
                    name: selectedVaccine.name,
                },
                doctor: selectedDoctor
                    ? {
                          id: selectedDoctor.id,
                          name: selectedDoctor.name,
                          surname: selectedDoctor.surname,
                      }
                    : undefined,
            };
            setLocalConfirmations((prev) => [newConfirmation, ...prev]);
            setIsFormOpen(false);
            setConfirmed(true);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                    'Gabim gjatë rezervimit. Provo sërish.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const resetAll = () => {
        setSelectedVaccine(null);
        setSelectedChild(null);
        setSelectedDoctor(null);
        setSelectedDate(null);
        setSelectedMonth('Maj');
        setSelectedTime(null);
        setConfirmed(false);
        setError(null);
    };

    return (
        <>
            <Head title="Rezervo Termin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* ── Header ── */}
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        Kujdes parandalues për çdo fëmijë
                    </span>
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        Asnjë fëmijë mos të humbet nga kujdesi.
                    </h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        Rezervoni terminin e vaksinimit në mënyrë të thjeshtë
                        dhe të shpejtë. Të dhënat tuaja dhe të fëmijës
                        plotësohen automatikisht.
                    </p>
                </div>

                {/* ── No parent profile warning ── */}
                {!parentProfile && (
                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        Profili juaj si prind nuk është i lidhur me llogarinë.
                        Kontaktoni administratorin.
                    </div>
                )}

                {/* ── Success card ── */}
                {confirmed && selectedChild && selectedVaccine && (
                    <div className="max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-xl text-primary">
                            ✓
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            Termini u rezervua me sukses!
                        </h3>
                        <div className="mt-5 space-y-2.5 rounded-xl border bg-muted p-5 text-left text-xs text-muted-foreground">
                            <p className="flex justify-between border-b border-border pb-2">
                                <span>Fëmija:</span>
                                <span className="font-bold text-foreground">
                                    {selectedChild.name} {selectedChild.surname}
                                </span>
                            </p>
                            <p className="flex justify-between border-b border-border pb-2">
                                <span>Prindi:</span>
                                <span className="font-bold text-foreground">
                                    {parentProfile?.name}{' '}
                                    {parentProfile?.surname}
                                </span>
                            </p>
                            <p className="flex justify-between border-b border-border pb-2">
                                <span>Grupi i Gjakut:</span>
                                <span className="font-bold text-primary">
                                    {selectedChild.blood_type}
                                </span>
                            </p>
                            <p className="flex justify-between pb-1">
                                <span>Vaksina:</span>
                                <span className="font-bold text-foreground">
                                    {selectedVaccine.name}
                                </span>
                            </p>
                            {selectedDoctor && (
                                <p className="flex justify-between border-t border-border pt-2">
                                    <span>Mjeku:</span>
                                    <span className="font-bold text-foreground">
                                        Dr. {selectedDoctor.name}{' '}
                                        {selectedDoctor.surname}
                                    </span>
                                </p>
                            )}
                        </div>
                        <p className="mt-4 text-sm font-semibold text-primary">
                            Data: {selectedDate} {selectedMonth} 2026 — Ora:{' '}
                            {selectedTime}
                        </p>
                        <button
                            onClick={resetAll}
                            className="mt-5 text-xs font-bold text-muted-foreground underline transition hover:text-primary"
                        >
                            Rezervo një tjetër termin
                        </button>
                    </div>
                )}

                {/* ── Booking bar ── */}
                {!confirmed && (
                    <div className="relative z-30 grid grid-cols-1 items-end gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                        {/* 1. Vaccine */}
                        <div className="relative space-y-1.5">
                            <label className={fieldLabel}>Vaksina</label>
                            <button
                                type="button"
                                onClick={() => {
                                    closeAll();
                                    setIsVaccineOpen((v) => !v);
                                }}
                                className={dropBtn}
                            >
                                <span className="truncate">
                                    {selectedVaccine
                                        ? selectedVaccine.name
                                        : 'Zgjidhni Vaksinën'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    ▼
                                </span>
                            </button>
                            {isVaccineOpen && (
                                <div className={dropMenu}>
                                    {vaccines.map((v) => (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedVaccine(v);
                                                setIsVaccineOpen(false);
                                            }}
                                            className={dropItem}
                                        >
                                            {v.name}
                                            {v.type && (
                                                <span className="ml-1 opacity-50">
                                                    ({v.type})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Child */}
                        <div className="relative space-y-1.5">
                            <label className={fieldLabel}>Fëmija</label>
                            <button
                                type="button"
                                onClick={() => {
                                    closeAll();
                                    setIsChildOpen((v) => !v);
                                }}
                                className={dropBtn}
                            >
                                <span className="truncate">
                                    {selectedChild
                                        ? `${selectedChild.name} ${selectedChild.surname}`
                                        : 'Zgjidhni Fëmijën'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    ▼
                                </span>
                            </button>
                            {isChildOpen && (
                                <div className={dropMenu}>
                                    {children.length === 0 ? (
                                        <p className="px-4 py-3 text-xs text-muted-foreground">
                                            Nuk keni fëmijë të regjistruar.
                                        </p>
                                    ) : (
                                        children.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedChild(c);
                                                    setIsChildOpen(false);
                                                }}
                                                className={dropItem}
                                            >
                                                {c.name} {c.surname}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 3. Doctor */}
                        <div className="relative space-y-1.5">
                            <label className={fieldLabel}>Mjeku</label>
                            <button
                                type="button"
                                onClick={() => {
                                    closeAll();
                                    setIsDoctorOpen((v) => !v);
                                }}
                                className={dropBtn}
                            >
                                <span className="truncate">
                                    {selectedDoctor
                                        ? `Dr. ${selectedDoctor.name} ${selectedDoctor.surname}`
                                        : 'Zgjidhni Mjekun'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    ▼
                                </span>
                            </button>
                            {isDoctorOpen && (
                                <div className={dropMenu}>
                                    {doctors.length === 0 ? (
                                        <p className="px-4 py-3 text-xs text-muted-foreground">
                                            Nuk ka mjekë të disponueshëm.
                                        </p>
                                    ) : (
                                        doctors.map((d) => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDoctor(d);
                                                    setIsDoctorOpen(false);
                                                }}
                                                className={dropItem}
                                            >
                                                <span className="font-bold">
                                                    Dr. {d.name} {d.surname}
                                                </span>
                                                {d.status && (
                                                    <span className="ml-2 opacity-50">
                                                        · {d.status}
                                                    </span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 4. Date */}
                        <div className="relative space-y-1.5">
                            <label className={fieldLabel}>Data</label>
                            <div className="flex gap-1.5">
                                <div className="relative flex-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeAll();
                                            setIsDateOpen((v) => !v);
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl border bg-background px-3 py-3 text-xs font-bold text-foreground"
                                    >
                                        <span>{selectedDate ?? 'Dita'}</span>
                                        <span className="text-[9px] opacity-40">
                                            ▼
                                        </span>
                                    </button>
                                    {isDateOpen && (
                                        <div className="absolute right-0 left-0 z-50 mt-2 grid max-h-48 grid-cols-4 gap-1 overflow-y-auto rounded-xl border bg-card p-2 shadow-lg">
                                            {daysInMonth.map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDate(d);
                                                        setIsDateOpen(false);
                                                    }}
                                                    className={`rounded-lg py-2 text-xs font-bold transition ${selectedDate === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative flex-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeAll();
                                            setIsMonthOpen((v) => !v);
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl border bg-background px-3 py-3 text-xs font-bold text-foreground"
                                    >
                                        <span className="truncate">
                                            {selectedMonth}
                                        </span>
                                        <span className="text-[9px] opacity-40">
                                            ▼
                                        </span>
                                    </button>
                                    {isMonthOpen && (
                                        <div className="absolute right-0 left-0 z-50 mt-2 max-h-48 space-y-0.5 overflow-y-auto rounded-xl border bg-card p-1.5 shadow-lg">
                                            {months.map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMonth(m);
                                                        setIsMonthOpen(false);
                                                    }}
                                                    className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${selectedMonth === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 5. Time */}
                        <div className="relative space-y-1.5">
                            <label className={fieldLabel}>Ora</label>
                            <button
                                type="button"
                                onClick={() => {
                                    closeAll();
                                    setIsTimeOpen((v) => !v);
                                }}
                                className={dropBtn}
                            >
                                <span>{selectedTime ?? 'Zgjidhni Orën'}</span>
                                <span className="text-[10px] text-muted-foreground">
                                    ▼
                                </span>
                            </button>
                            {isTimeOpen && (
                                <div className={dropMenu}>
                                    {timeSlots.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTime(t);
                                                setIsTimeOpen(false);
                                            }}
                                            className={dropItem}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 6. Book */}
                        <div>
                            <button
                                onClick={() => {
                                    if (canOpenForm) setIsFormOpen(true);
                                }}
                                disabled={!canOpenForm || !parentProfile}
                                className="w-full rounded-xl bg-primary py-3 text-xs font-black tracking-wider text-primary-foreground uppercase transition hover:bg-primary/90 disabled:bg-muted disabled:opacity-40"
                            >
                                Rezervo Tani
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Vaccine cards ── */}
                {!confirmed && vaccines.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {vaccines.map((vac) => (
                            <button
                                key={vac.id}
                                type="button"
                                onClick={() => {
                                    setSelectedVaccine(vac);
                                    window.scrollTo({
                                        top: 100,
                                        behavior: 'smooth',
                                    });
                                }}
                                className={`group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${selectedVaccine?.id === vac.id ? 'border-primary ring-1 ring-primary/30' : 'border-border'}`}
                            >
                                {vac.image ? (
                                    <img
                                        src={`/storage/${vac.image}`}
                                        alt={vac.name}
                                        className="mb-4 h-20 w-20 object-contain transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl text-primary">
                                        💉
                                    </div>
                                )}
                                <h4 className="mb-1 text-base font-black text-foreground">
                                    {vac.name}
                                </h4>
                                {vac.type && (
                                    <span className="mb-2 text-[10px] font-bold tracking-wider text-primary uppercase">
                                        {vac.type}
                                    </span>
                                )}
                                {vac.description && (
                                    <p className="max-w-[200px] text-xs leading-relaxed font-medium text-muted-foreground">
                                        {vac.description}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── My appointments ── */}
                {localConfirmations.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-t pt-6">
                            <CalendarCheck className="h-5 w-5 text-primary" />
                            <h2 className="text-base font-black tracking-tight text-foreground">
                                Terminet e mia
                            </h2>
                            <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                                {localConfirmations.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {localConfirmations.map((c) => (
                                <ConfirmationCard
                                    key={c.id}
                                    confirmation={c}
                                    onStatusChange={(id, newStatus) =>
                                        setLocalConfirmations((prev) =>
                                            prev.map((item) =>
                                                item.id === id
                                                    ? { ...item, status: newStatus }
                                                    : item,
                                            ),
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Confirmation modal ── */}
            {isFormOpen &&
                selectedChild &&
                selectedVaccine &&
                parentProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-2xl sm:p-8">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-muted-foreground transition hover:text-foreground"
                            >
                                ✕
                            </button>

                            <div className="mb-6">
                                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                    KujtoMe Booking
                                </span>
                                <h3 className="mt-1 text-xl font-black text-foreground">
                                    Konfirmo Rezervimin
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Kontrolloni të dhënat para konfirmimit.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={fieldLabel}>Prindi</label>
                                    <div className={readField}>
                                        {parentProfile.name}{' '}
                                        {parentProfile.surname}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>Email</label>
                                    <div className={readField + ' truncate'}>
                                        {parentProfile.email}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>
                                        Telefoni
                                    </label>
                                    <div className={readField}>
                                        {parentProfile.phone_number || '—'}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>Fëmija</label>
                                    <div className={readField}>
                                        {selectedChild.name}{' '}
                                        {selectedChild.surname}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>
                                        Numri Personal
                                    </label>
                                    <div
                                        className={
                                            readField +
                                            ' font-mono text-primary'
                                        }
                                    >
                                        {selectedChild.personal_number}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>
                                        Data e Lindjes
                                    </label>
                                    <div className={readField}>
                                        {selectedChild.date_of_birth}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>
                                        Grupi i Gjakut
                                    </label>
                                    <div
                                        className={readField + ' text-primary'}
                                    >
                                        {selectedChild.blood_type}
                                    </div>
                                </div>
                                <div>
                                    <label className={fieldLabel}>
                                        Alergjitë
                                    </label>
                                    <div className={readField}>
                                        {selectedChild.allergies || '—'}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={fieldLabel}>
                                        Sëmundjet Kronike
                                    </label>
                                    <div className={readField}>
                                        {selectedChild.chronic_diseases || '—'}
                                    </div>
                                </div>

                                <div className="space-y-1.5 rounded-xl border border-primary/20 bg-primary/10 p-4 sm:col-span-2">
                                    <p className="text-[10px] font-bold tracking-wider text-primary uppercase">
                                        Termini
                                    </p>
                                    <p className="text-sm font-black text-foreground">
                                        {selectedVaccine.name} — {selectedDate}{' '}
                                        {selectedMonth} 2026 — {selectedTime}
                                    </p>
                                    {selectedDoctor && (
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            Mjeku: Dr. {selectedDoctor.name}{' '}
                                            {selectedDoctor.surname}
                                            {selectedDoctor.phone_number && (
                                                <span className="ml-2 opacity-60">
                                                    ·{' '}
                                                    {
                                                        selectedDoctor.phone_number
                                                    }
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-bold text-destructive">
                                    {error}
                                </p>
                            )}

                            <div className="mt-6 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full rounded-xl bg-primary py-3.5 text-xs font-black tracking-wider text-primary-foreground uppercase transition hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {submitting
                                        ? 'Duke rezervuar...'
                                        : 'Konfirmo Terminin'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

Reservation.layout = {
    breadcrumbs: [{ title: 'Rezervo Termin', href: '/reservation' }],
};
