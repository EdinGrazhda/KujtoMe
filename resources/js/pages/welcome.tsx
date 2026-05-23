import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CalendarCheck,
    Check,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ComponentProps, ReactNode, SVGProps } from 'react';

import { dashboard, login, register } from '@/routes';
import type { User } from '@/types';

type WelcomeProps = {
    auth: {
        user?: User;
    };
};

type PreviewMode = 'today' | 'record' | 'risk';

const previewModes: {
    key: PreviewMode;
    title: string;
    description: string;
    icon: LucideIcon;
}[] = [
    {
        key: 'today',
        title: 'Plani i Ditës',
        description: 'Veprimet dhe afatet që duhen kryer sot.',
        icon: CalendarCheck,
    },
    {
        key: 'record',
        title: 'Libreza Shëndetësore',
        description: 'Historiku i plotë i vaksinimit dhe zhvillimit.',
        icon: ShieldCheck,
    },
    {
        key: 'risk',
        title: 'Parandalimi i Vonesave',
        description: 'Identifikimi i hershëm i kontrolleve të mbetura.',
        icon: AlertTriangle,
    },
];

const journeySteps = [
    { title: 'Regjistrohet', text: 'Librezë digjitale', icon: ShieldCheck },
    { title: 'Sinjalizohet', text: 'Alarm para vonesës', icon: Bell },
    { title: 'Ndërhyhet', text: 'Prind + mjek', icon: Stethoscope },
];

function VaccineGlyph(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            fill="none"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3.6"
                transform="rotate(-38 32 32)"
            >
                <path d="M24 7h16" />
                <path d="M32 7v9" />
                <rect height="25" rx="5" width="18" x="23" y="16" />
                <path d="M27 22h10" opacity="0.75" />
                <path d="M27 29h10" opacity="0.75" />
                <path d="M27 36h10" opacity="0.75" />
                <path d="M32 41v10" />
                <path d="M25 51h14" />
                <path d="M32 51v8" />
            </g>
        </svg>
    );
}

function AppLogo() {
    return (
        <div className="flex items-center gap-3 select-none">
            <div className="relative grid size-12 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 to-teal-400 text-white shadow-lg shadow-violet-200">
                <div className="absolute top-1 right-1 size-4 rounded-full bg-white/20" />
                <VaccineGlyph className="relative size-9" />
            </div>
            <div>
                <p className="text-2xl leading-none font-black tracking-normal text-slate-950">
                    KujtoMe
                </p>
            </div>
        </div>
    );
}

function ButtonLink({
    children,
    href,
    primary = false,
}: {
    children: ReactNode;
    href: ComponentProps<typeof Link>['href'];
    primary?: boolean;
}) {
    return (
        <Link
            className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                primary
                    ? 'bg-violet-700 text-white shadow-xl shadow-violet-200 hover:bg-violet-800 hover:shadow-violet-300'
                    : 'bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200/50 hover:bg-white hover:text-slate-950 hover:ring-slate-300'
            }`}
            href={href}
        >
            {children}
        </Link>
    );
}

function VaccineOrbit() {
    return (
        <div className="pointer-events-none absolute -top-8 -right-5 hidden h-56 w-56 select-none lg:block">
            <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-violet-300/80 [animation-duration:18s]" />
            <div className="absolute inset-8 animate-spin rounded-full border border-dashed border-teal-300/80 [animation-direction:reverse] [animation-duration:14s]" />
            <div className="absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 [transform:rotateX(16deg)_rotateY(-22deg)_rotateZ(8deg)] place-items-center rounded-[1.7rem] bg-gradient-to-br from-violet-700 to-teal-500 text-white shadow-2xl shadow-violet-200 transition duration-500">
                <VaccineGlyph className="size-16" />
            </div>
            <div className="absolute top-10 left-3 grid size-11 animate-bounce place-items-center rounded-2xl bg-white text-amber-500 shadow-lg">
                <Bell className="size-6 fill-amber-300" />
            </div>
            <div className="absolute right-2 bottom-8 grid size-11 animate-bounce place-items-center rounded-2xl bg-white text-emerald-600 shadow-lg [animation-delay:350ms]">
                <Check className="size-6 stroke-[4]" />
            </div>
        </div>
    );
}

function ChildAvatar() {
    return (
        <div className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-100 to-teal-100">
            <div className="relative size-10 overflow-hidden rounded-full bg-orange-200">
                <div className="absolute top-1 left-1/2 h-4 w-8 -translate-x-1/2 rounded-b-full bg-[#4b2a22]" />
                <div className="absolute top-5 left-3 size-1.5 rounded-full bg-slate-950" />
                <div className="absolute top-5 right-3 size-1.5 rounded-full bg-slate-950" />
                <div className="absolute bottom-2 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-b-full bg-rose-500" />
                <div className="absolute -bottom-5 left-1/2 size-8 -translate-x-1/2 rounded-full bg-teal-500" />
            </div>
        </div>
    );
}

function PhoneHeroPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[370px] rounded-[2.5rem] border border-white/80 bg-white/80 p-3 shadow-2xl shadow-violet-200/80 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
            <div className="absolute top-28 -left-5 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 shadow-violet-100 ring-white/80">
                <p className="text-xs font-black tracking-wider text-slate-400 uppercase">
                    Rreziku
                </p>
                <p className="text-sm font-black text-emerald-600">I ulët</p>
            </div>
            <div className="absolute -right-5 bottom-24 z-10 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-xl">
                <p className="text-xs font-black tracking-wider text-white/50 uppercase">
                    Veprimi
                </p>
                <p className="text-sm font-black text-teal-300">DTP (3)</p>
            </div>

            <div className="relative flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f7f7ff]">
                <div>
                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-teal-500 px-5 pt-5 pb-7 text-white">
                        <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-white/5 blur-xl" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
                                    Monitorimi i Jonit
                                </p>
                                <h2 className="mt-0.5 text-2xl font-black tracking-normal">
                                    Ballina
                                </h2>
                            </div>
                            <button className="relative grid size-11 place-items-center rounded-2xl bg-white/15">
                                <Bell className="size-5" />
                                <span className="absolute top-2 right-2 size-2 animate-pulse rounded-full bg-rose-400" />
                            </button>
                        </div>

                        <div className="relative z-10 mt-5 flex items-center gap-4 rounded-[1.5rem] bg-white/14 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                            <ChildAvatar />
                            <div>
                                <p className="text-lg font-black">
                                    Joni Berisha
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-white/85">
                                    4 vjeç · 12/13 veprime
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mx-4 -mt-4 min-h-[330px] pb-5">
                        <TodayCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InteractivePreviewContainer({ mode }: { mode: PreviewMode }) {
    return (
        <div className="mx-auto w-full max-w-[400px] rounded-[2.5rem] bg-white/40 p-2 transition-all duration-300">
            <div className="flex min-h-[360px] flex-col justify-center">
                {mode === 'today' && <TodayCard />}
                {mode === 'record' && <AnimatedRecordCard />}
                {mode === 'risk' && <EnhancedRiskCard />}
            </div>
        </div>
    );
}

function TodayCard() {
    return (
        <div className="animate-in space-y-4 duration-300 fade-in slide-in-from-bottom-2">
            <section className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-md shadow-slate-100">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black tracking-wide text-slate-400 uppercase">
                            Veprimi parandalues
                        </p>
                        <h3 className="mt-1 text-2xl font-black text-slate-950">
                            DTP (3)
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                            20 Maj · 09:30
                        </p>
                    </div>
                    <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                        <VaccineGlyph className="size-9" />
                    </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                </div>
                <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-center text-xs font-black text-emerald-700">
                    Në kohë për kujdesin e radhës
                </div>
            </section>

            <section className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-md shadow-slate-100">
                <p className="text-sm font-black text-slate-950">
                    Sot për prindin
                </p>
                <p className="mt-1 text-xs leading-relaxed font-semibold text-slate-500">
                    Konfirmo terminin ose kërko ndihmë nga pediatri.
                </p>
            </section>
        </div>
    );
}

function AnimatedRecordCard() {
    const records = [
        {
            name: 'Në Lindje',
            status: 'Kryer',
            desc: 'Vaksinimi i parë fillestar',
            color: 'border-sky-500 text-sky-600 bg-sky-50',
        },
        {
            name: 'BCG (Tuberkulozi)',
            status: 'Kryer',
            desc: 'Imunizimi në javët e para',
            color: 'border-indigo-500 text-indigo-600 bg-indigo-50',
        },
        {
            name: 'HepB (Dozë e dytë)',
            status: 'Kryer',
            desc: 'Mbrojtje e plotësuar',
            color: 'border-emerald-500 text-emerald-600 bg-emerald-50',
        },
        {
            name: 'DTP (3) / Polio',
            status: 'Në Plan',
            desc: 'Pritet konfirmimi i datës',
            color: 'border-amber-500 text-amber-600 bg-amber-50',
        },
    ];

    return (
        <section className="scale-in animate-in rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-xl shadow-violet-100/40 duration-300 fade-in">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-black text-slate-950">
                    Libreza e Vaksinimit
                </p>
                <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-[11px] font-black text-white shadow-sm">
                    12 të kryera
                </span>
            </div>

            <div className="relative ml-2 space-y-3 border-l-2 border-dashed border-slate-200 pl-5">
                {records.map((item, index) => (
                    <div
                        key={item.name}
                        className="group relative rounded-xl p-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-slate-50 hover:shadow-sm"
                    >
                        <span
                            className={`absolute top-4 -left-[30px] grid size-4 place-items-center rounded-full ring-4 ring-white transition-transform duration-300 group-hover:scale-125 ${index === 3 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        >
                            {index !== 3 && (
                                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-25" />
                            )}
                            <Check className="size-2.5 stroke-[4] text-white" />
                        </span>

                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-black text-slate-950 transition-colors group-hover:text-violet-700">
                                {item.name}
                            </p>
                            <span
                                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-black tracking-wider uppercase ${item.color}`}
                            >
                                {item.status}
                            </span>
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function EnhancedRiskCard() {
    return (
        <div className="animate-in space-y-3 duration-300 fade-in slide-in-from-bottom-4">
            <section className="group relative overflow-hidden rounded-[1.5rem] border border-l-4 border-amber-500 border-y-slate-100 border-r-slate-100 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-100">
                <div className="pointer-events-none absolute top-0 right-0 size-24 rounded-bl-full bg-amber-500/5" />
                <div className="flex items-center gap-3">
                    <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
                        <AlertTriangle className="relative z-10 size-6" />
                        <span className="absolute -top-0.5 -right-0.5 size-3 animate-pulse rounded-full border-2 border-white bg-amber-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-black text-slate-950">
                                Kontroll zhvillimi
                            </p>
                            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-black text-amber-600 uppercase">
                                Urgjente
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                            Vonesë prej 5 ditëve në vizitën sistematike.
                        </p>
                    </div>
                </div>
            </section>

            <section className="group relative overflow-hidden rounded-[1.5rem] border border-l-4 border-violet-600 border-y-slate-100 border-r-slate-100 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-100">
                <div className="pointer-events-none absolute top-0 right-0 size-24 rounded-bl-full bg-violet-600/5" />
                <div className="flex items-center gap-3">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 transition-transform group-hover:scale-110">
                        <Stethoscope className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-950">
                            Njofto pediatrin në kohë
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                            Gjenero raportin e mungesave për mjekun kujdestar.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

function JourneyStrip() {
    return (
        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            {journeySteps.map((step) => (
                <div
                    className="relative overflow-hidden rounded-2xl bg-white/60 p-5 shadow-sm ring-1 ring-slate-200/50 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    key={step.title}
                >
                    <div className="absolute -top-8 -right-8 size-20 rounded-full bg-violet-50/50" />
                    <div className="relative mb-4 grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-700 to-teal-400 text-white shadow-md shadow-violet-100">
                        <step.icon className="size-5" />
                    </div>
                    <h2 className="font-black text-slate-950">{step.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                        {step.text}
                    </p>
                </div>
            ))}
        </div>
    );
}

// 👑 E RE: Komponenti për FAQ me shtrirje (Accordion)

export default function Welcome() {
    const { auth } = usePage<WelcomeProps>().props;
    const [mode, setMode] = useState<PreviewMode>('today');
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <Head title="KujtoMe" />

            <div
                className="pointer-events-none fixed z-50 hidden text-violet-700 drop-shadow-[0_3px_6px_rgba(109,40,217,0.25)] filter lg:block"
                style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`,
                    transform: 'translate(-4px, -4px)',
                }}
            >
                <VaccineGlyph className="size-9" />
            </div>

            <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#efe8ff,transparent_38%),radial-gradient(circle_at_top_right,#dff8f2,transparent_32%),linear-gradient(135deg,#fbf7ff_0%,#f8fbff_52%,#fff7f2_100%)] text-slate-950 lg:cursor-none">
                <div className="pointer-events-none absolute top-1/4 right-0 hidden size-[400px] rounded-full bg-gradient-to-br from-violet-300/20 to-teal-200/20 blur-3xl lg:block" />

                <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
                    <AppLogo />
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <ButtonLink href={dashboard()} primary>
                                Dashboard
                            </ButtonLink>
                        ) : (
                            <>
                                <div className="hidden sm:block">
                                    <ButtonLink href={login()}>Kyçu</ButtonLink>
                                </div>
                                <ButtonLink href={register()} primary>
                                    Fillo
                                </ButtonLink>
                            </>
                        )}
                    </nav>
                </header>

                {/* Seksioni Hero */}
                <section className="relative z-20 mx-auto grid max-w-7xl items-center gap-12 px-6 pt-6 pb-14 md:px-8 lg:grid-cols-[1fr_440px] lg:pt-12 lg:pb-24">
                    <VaccineOrbit />
                    <div className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-sm select-none">
                            <Sparkles className="size-4 animate-pulse text-violet-600" />
                            Kujdes parandalues për çdo fëmijë
                        </div>
                        <h1 className="text-4xl leading-[1.1] font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                            Asnjë fëmijë mos të humbet nga kujdesi.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed font-semibold text-slate-600">
                            KujtoMe bashkon librezën digjitale, vaksinat,
                            kontrollat dhe sinjalet e hershme në një ballinë të
                            qartë për prindin dhe mjekun.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {auth.user ? (
                                <ButtonLink href={dashboard()} primary>
                                    Hape dashboard-in
                                </ButtonLink>
                            ) : (
                                <>
                                    <ButtonLink href={register()} primary>
                                        Krijo llogari
                                    </ButtonLink>
                                    <ButtonLink href={login()}>
                                        Kam llogari
                                    </ButtonLink>
                                </>
                            )}
                        </div>

                        <JourneyStrip />
                    </div>

                    <div className="relative w-full pt-6 lg:pt-0">
                        <PhoneHeroPreview />
                    </div>
                </section>

                {/* Seksioni i dytë interaktiv */}
                <section className="relative z-20 mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:px-8 lg:grid-cols-[420px_1fr]">
                    <div className="flex min-h-[460px] items-center justify-center rounded-[2rem] border border-white/80 bg-white/50 p-4 shadow-xl shadow-violet-100/30 backdrop-blur-sm md:p-6">
                        <InteractivePreviewContainer mode={mode} />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-black tracking-wider text-violet-700 uppercase">
                                Menaxhimi i thjeshtuar
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                Çfarë ju mundëson KujtoMe?
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed font-semibold text-slate-600 md:text-base">
                                Platforma organizon të gjithë kalendarin
                                shëndetësor të fëmijës tuaj. Kliko mbi opsionet
                                më poshtë për të parë se si ndryshon ndërfaqja
                                dhe si strukturohet informkacioni kritik.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {previewModes.map((item) => (
                                <button
                                    className={`rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95 ${
                                        mode === item.key
                                            ? 'border-transparent bg-violet-700 text-white shadow-lg shadow-violet-200/50'
                                            : 'border-slate-200/60 bg-white text-slate-700 hover:border-violet-300 hover:bg-slate-50/50'
                                    }`}
                                    key={item.key}
                                    onClick={() => setMode(item.key)}
                                    type="button"
                                >
                                    <item.icon
                                        className={`mb-3 size-6 transition-transform group-hover:scale-110 ${mode === item.key ? 'text-white' : 'text-violet-700'}`}
                                    />
                                    <span className="block text-sm font-black">
                                        {item.title}
                                    </span>
                                    <span
                                        className={`mt-1 block text-xs leading-normal font-semibold ${
                                            mode === item.key
                                                ? 'text-white/80'
                                                : 'text-slate-500'
                                        }`}
                                    >
                                        {item.description}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 👑 SEKSIONI I RI 4: Footer-i në fund */}
                <footer className="relative z-20 mt-12 border-t border-slate-200 bg-white/40 text-slate-500 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 sm:flex-row md:px-8">
                        <div className="flex items-center gap-2">
                            <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-700 to-teal-400 text-white shadow-md">
                                <VaccineGlyph className="size-5" />
                            </div>
                            <span className="text-lg font-black tracking-tight text-slate-950">
                                KujtoMe
                            </span>
                        </div>
                        <p className="text-xs font-semibold">
                            &copy; {new Date().getFullYear()} KujtoMe. Të gjitha
                            të drejtat e rezervuara.
                        </p>
                        <div className="flex gap-4 text-xs font-black text-slate-600">
                            <a
                                href="#"
                                className="transition-colors hover:text-violet-700"
                            >
                                Privatësia
                            </a>
                            <a
                                href="#"
                                className="transition-colors hover:text-violet-700"
                            >
                                Kushtet
                            </a>
                            <a
                                href="#"
                                className="transition-colors hover:text-violet-700"
                            >
                                Kontakti
                            </a>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
