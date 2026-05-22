import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Vaccine {
    id: string;
    name: string;
    type: string;
    description: string;
    icon: string;
    color: string;
    glowColor: string;
    fallbackColor: string;
}

interface PersonalInfo {
    parentName: string;
    childName: string;
    childLastName: string;
    personalNumber: string;
    parentEmail: string;
    phone: string;
    allergies: string;
    chronicDiseases: string;
    bloodType: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    note: string;
}

interface VaccineIconProps {
    src: string;
    name: string;
}

// Čista komponenta za prikaz ikona bez suvišnih pozadina i tekstualnih fallback-ova
function VaccineIcon({ src, name }: VaccineIconProps) {
    return (
        <img 
            src={src} 
            alt={name} 
            className="w-full h-full object-contain select-none group-hover:scale-110 transition duration-300"
        />
    );
}

export default function Appointment() {
    const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        parentName: '',
        childName: '',
        childLastName: '',
        personalNumber: '',
        parentEmail: '',
        phone: '',
        allergies: '',
        chronicDiseases: '',
        bloodType: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        note: '',
    });

    // Kontrola otvaranja zaobljenih i odvojenih custom dropdown-a
    const [isVaccineOpen, setIsVaccineOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [isBloodOpen, setIsBloodOpen] = useState(false);
    const [isDayOpen, setIsDayOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    // Konfiguracija putanja do 3D ikona
    const vaccines: Vaccine[] = [
        { 
            id: '1', 
            name: 'Covid-19 Booster', 
            type: 'mRNA', 
            description: 'Mbrojtje e përditësuar për fëmijët.', 
            icon: '/images/covid-booster-3d.png', 
            color: 'from-blue-500 to-indigo-600',
            glowColor: 'shadow-blue-500/30',
            fallbackColor: 'text-blue-400'
        },
        { 
            id: '2', 
            name: 'Vaksina e Gripit', 
            type: 'Pediatrike', 
            description: 'Mbrojtje vjetore sezonale pa stres.', 
            icon: '/images/flu-vaccine-3d.png', 
            color: 'from-orange-400 to-amber-500',
            glowColor: 'shadow-orange-500/30',
            fallbackColor: 'text-orange-400'
        },
        { 
            id: '3', 
            name: 'Hepatitis B', 
            type: 'Rekomanduar', 
            description: 'Dozë imuniteti afatgjatë për mëlçinë.', 
            icon: '/images/hepatitis-3d.png', 
            color: 'from-blue-600 to-blue-800',
            glowColor: 'shadow-blue-800/30',
            fallbackColor: 'text-blue-500'
        },
    ];

    const timeSlots = ['08:30', '10:00', '11:30', '14:00', '15:30', '16:45'];
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
    const months = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
    const years = Array.from({ length: 27 }, (_, i) => String(2026 - i));
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const canOpenForm = selectedVaccine !== null && selectedDate !== null && selectedTime !== null;

    const canConfirm =
        personalInfo.parentName.trim() !== '' &&
        personalInfo.childName.trim() !== '' &&
        personalInfo.childLastName.trim() !== '' &&
        personalInfo.parentEmail.trim() !== '' &&
        personalInfo.personalNumber.trim() !== '' &&
        personalInfo.birthDay !== '' &&
        personalInfo.birthMonth !== '' &&
        personalInfo.birthYear !== '' &&
        personalInfo.bloodType !== '' &&
        personalInfo.phone.trim() !== '';

    const handleConfirm = () => {
        if (!canConfirm) return;
        setIsFormOpen(false);
        setConfirmed(true);
    };

    return (
        <>
            <Head title="Rezervo Termin" />
            
            <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans pb-24 relative overflow-hidden">
                
                {/* Efekti blagog sjaja u pozadini */}
                <div className="absolute top-[-5%] left-[-5%] w-112.5 h-112.5 rounded-full bg-blue-500/10 filter blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-5%] right-[-5%] w-112.5 h-112.5 rounded-full bg-emerald-500/5 filter blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 space-y-8">
                    
                    {/* Kompaktno zaglavlje teksta */}
                    <div className="space-y-3">
                        <span className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span>Kujdes parandalues për çdo fëmijë</span>
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
                            Asnjë fëmijë mos të humbet nga kujdesi.
                        </h1>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-2xl">
                            Rezervoni terminin e vaksinimit në mënyrë të thjeshtë dhe të shpejtë, duke mbajtur të sigurt historikun mjekësor të fëmijës tuaj.
                        </p>
                    </div>

                    {confirmed && (
                        <div className="mb-16 rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 text-center max-w-2xl mx-auto shadow-2xl animate-fade-in">
                            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 text-2xl flex items-center justify-center rounded-2xl mx-auto mb-4 border border-blue-500/20 shadow-inner">✓</div>
                            <h3 className="text-xl font-bold text-white">Termini u konfirmua me sukses!</h3>
                            
                            <div className="mt-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-3 text-xs text-slate-300">
                                <p className="flex justify-between border-b border-slate-900 pb-2"><span className="opacity-60">Fëmija:</span> <span className="font-bold text-white">{personalInfo.childName} {personalInfo.childLastName}</span></p>
                                <p className="flex justify-between border-b border-slate-900 pb-2"><span className="opacity-60">Prindi:</span> <span className="font-bold text-white">{personalInfo.parentName}</span></p>
                                <p className="flex justify-between border-b border-slate-900 pb-2"><span className="opacity-60">Numri Personal:</span> <span className="font-mono text-blue-400 font-bold">{personalInfo.personalNumber}</span></p>
                                <p className="flex justify-between border-b border-slate-900 pb-2"><span className="opacity-60">Data e Lindjes:</span> <span className="font-bold text-white">{personalInfo.birthDay} {personalInfo.birthMonth} {personalInfo.birthYear}</span></p>
                                <p className="flex justify-between pb-1"><span className="opacity-60">Grupi i Gjakut:</span> <span className="font-bold text-blue-400">{personalInfo.bloodType}</span></p>
                            </div>

                            <p className="text-sm font-semibold text-blue-400 mt-4">Vaksina: {selectedVaccine?.name} | Data: {selectedDate} Maj, {selectedTime}</p>
                            <button onClick={() => setConfirmed(false)} className="mt-6 text-xs font-bold text-slate-400 hover:text-blue-400 transition underline">Rezervo një tjetër termin</button>
                        </div>
                    )}

                    {/* INTERAKTIVNA REZERVACIONA TRAKA SA ODVOJENIM DROPDOWN-IMA */}
                    <div className="relative z-30 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        
                        {/* 1. Custom Dropdown: Vakcine */}
                        <div className="relative space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Vaksina</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsVaccineOpen(!isVaccineOpen);
                                    setIsDateOpen(false);
                                    setIsTimeOpen(false);
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold flex items-center justify-between focus:border-blue-500 outline-none transition"
                            >
                                <span className="truncate">{selectedVaccine ? selectedVaccine.name : 'Zgjidhni Vaksinën'}</span>
                                <span className="text-slate-500 text-[10px]">▼</span>
                            </button>
                            
                            {isVaccineOpen && (
                                <div className="absolute left-0 right-0 z-50 mt-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-1 animate-fade-in">
                                    {vaccines.map(v => (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedVaccine(v);
                                                setIsVaccineOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white text-xs text-slate-300 font-semibold transition"
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Custom Dropdown: Datumi */}
                        <div className="relative space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Data (Maj 2026)</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDateOpen(!isDateOpen);
                                    setIsVaccineOpen(false);
                                    setIsTimeOpen(false);
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold flex items-center justify-between focus:border-blue-500 outline-none transition"
                            >
                                <span>{selectedDate ? `${selectedDate} Maj` : 'Zgjidhni Datën'}</span>
                                <span className="text-slate-500 text-[10px]">▼</span>
                            </button>

                            {isDateOpen && (
                                <div className="absolute left-0 right-0 z-50 mt-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-h-52 overflow-y-auto grid grid-cols-4 gap-1.5 scrollbar-thin scrollbar-thumb-slate-800 animate-fade-in">
                                    {daysInMonth.map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDate(d);
                                                setIsDateOpen(false);
                                            }}
                                            className={`py-2 rounded-xl text-xs font-bold transition ${
                                                selectedDate === d ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                                            }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. Custom Dropdown: Satnice */}
                        <div className="relative space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Ora e Terminit</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTimeOpen(!isTimeOpen);
                                    setIsVaccineOpen(false);
                                    setIsDateOpen(false);
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold flex items-center justify-between focus:border-blue-500 outline-none transition"
                            >
                                <span>{selectedTime || 'Zgjidhni Orën'}</span>
                                <span className="text-slate-500 text-[10px]">▼</span>
                            </button>

                            {isTimeOpen && (
                                <div className="absolute left-0 right-0 z-50 mt-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-1 animate-fade-in">
                                    {timeSlots.map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTime(t);
                                                setIsTimeOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white text-xs text-slate-300 font-semibold transition"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 4. Taster za aktivaciju detaljne forme */}
                        <div>
                            <button 
                                onClick={() => {
                                    if (canOpenForm) setIsFormOpen(true);
                                }}
                                disabled={!canOpenForm}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-500/20"
                            >
                                Rezervo Tani
                            </button>
                        </div>

                    </div>

                    {/* VAKCINE KAO KARTICE SA JASNIM I VELIKIM 3D IKONAMA */}
                    <div className="mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {vaccines.map((vac) => (
                                <button
                                    key={vac.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedVaccine(vac);
                                        window.scrollTo({ top: 120, behavior: 'smooth' });
                                    }}
                                    className={`p-8 bg-slate-900 rounded-[2.5rem] border text-center flex flex-col items-center transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl group ${
                                        selectedVaccine?.id === vac.id ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-slate-800'
                                    }`}
                                >
                                    {/* Povećan i centriran kontejner za čisti prikaz 3D ikone */}
                                    <div className="w-24 h-24 flex items-center justify-center mb-4 group-hover:scale-105 transition duration-300">
                                        <VaccineIcon 
                                            src={vac.icon} 
                                            name={vac.name} 
                                        />
                                    </div>
                                    <h4 className="font-black text-white text-base mb-2">{vac.name}</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">{vac.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

            </div>

            {/* 5. DETALJNI MODAL SA SVIM PODACIMA */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto animate-fade-in">
                        
                        <button 
                            onClick={() => {
                                setIsFormOpen(false);
                                setIsBloodOpen(false);
                            }}
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">KujtoMe Booking</span>
                            <h3 className="text-xl font-black text-white mt-1">Detajet Shëndetësore të Fëmijës</h3>
                            <p className="text-xs text-slate-400 mt-1">Të gjitha fushat janë plotësisht të zaobljene i odvojene për lehtësi përdorimi.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Emri i Prindit */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Emri i Prindit</label>
                                <input 
                                    type="text" 
                                    placeholder="Psh. Agron"
                                    value={personalInfo.parentName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, parentName: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                Aminom />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email i Prindit</label>
                                <input 
                                    type="email" 
                                    placeholder="agron@email.com"
                                    value={personalInfo.parentEmail}
                                    onChange={(e) => setPersonalInfo({...personalInfo, parentEmail: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                />
                            </div>

                            {/* Emri i Fëmijës */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Emri i Fëmijës</label>
                                <input 
                                    type="text" 
                                    placeholder="Psh. Joni"
                                    value={personalInfo.childName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, childName: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                />
                            </div>

                            {/* Mbiemri */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mbiemri i Fëmijës</label>
                                <input 
                                    type="text" 
                                    placeholder="Berisha"
                                    value={personalInfo.childLastName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, childLastName: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                />
                            </div>

                            {/* Numri Personal */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Numri Personal (ID)</label>
                                <input 
                                    type="text" 
                                    placeholder="1234567890"
                                    value={personalInfo.personalNumber}
                                    onChange={(e) => setPersonalInfo({...personalInfo, personalNumber: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition font-mono"
                                />
                            </div>

                            {/* Telefoni */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Numri i Telefonit</label>
                                <input 
                                    type="text" 
                                    placeholder="+383 4X XXX XXX"
                                    value={personalInfo.phone}
                                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                />
                            </div>

                            {/* Data e Lindjes */}
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data e Lindjes së Fëmijës</label>
                                <div className="grid grid-cols-3 gap-2">
                                    
                                    {/* Dan */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsDayOpen(!isDayOpen);
                                                setIsMonthOpen(false);
                                                setIsYearOpen(false);
                                            }}
                                            className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold flex items-center justify-between"
                                        >
                                            <span>{personalInfo.birthDay || 'Dita'}</span>
                                            <span className="text-[9px] opacity-40">▼</span>
                                        </button>
                                        {isDayOpen && (
                                            <div className="absolute z-50 left-0 right-0 mt-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto space-y-0.5 shadow-2xl">
                                                {days.map(d => (
                                                    <button
                                                        key={d}
                                                        type="button"
                                                        onClick={() => {
                                                            setPersonalInfo({...personalInfo, birthDay: d});
                                                            setIsDayOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 transition"
                                                    >
                                                        {d}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mjesec */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMonthOpen(!isMonthOpen);
                                                setIsDayOpen(false);
                                                setIsYearOpen(false);
                                            }}
                                            className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold flex items-center justify-between"
                                        >
                                            <span className="truncate">{personalInfo.birthMonth || 'Muaji'}</span>
                                            <span className="text-[9px] opacity-40">▼</span>
                                        </button>
                                        {isMonthOpen && (
                                            <div className="absolute z-50 left-0 right-0 mt-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto space-y-0.5 shadow-2xl">
                                                {months.map(m => (
                                                    <button
                                                        key={m}
                                                        type="button"
                                                        onClick={() => {
                                                            setPersonalInfo({...personalInfo, birthMonth: m});
                                                            setIsMonthOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 transition"
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Godina */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsYearOpen(!isYearOpen);
                                                setIsDayOpen(false);
                                                setIsMonthOpen(false);
                                            }}
                                            className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold flex items-center justify-between"
                                        >
                                            <span>{personalInfo.birthYear || 'Viti'}</span>
                                            <span className="text-[9px] opacity-40">▼</span>
                                        </button>
                                        {isYearOpen && (
                                            <div className="absolute z-50 left-0 right-0 mt-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto space-y-0.5 shadow-2xl">
                                                {years.map(y => (
                                                    <button
                                                        key={y}
                                                        type="button"
                                                        onClick={() => {
                                                            setPersonalInfo({...personalInfo, birthYear: y});
                                                            setIsYearOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 transition"
                                                    >
                                                        {y}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                           
                            <div className="sm:col-span-2 relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grupi i Gjakut</label>
                                <button
                                    type="button"
                                    onClick={() => setIsBloodOpen(!isBloodOpen)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold flex items-center justify-between focus:border-blue-500 outline-none transition"
                                >
                                    <span>{personalInfo.bloodType || 'Zgjidhni Grupin e Gjakut'}</span>
                                    <span className="text-slate-500 text-[10px]">▼</span>
                                </button>
                                {isBloodOpen && (
                                    <div className="absolute left-0 right-0 z-50 mt-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto space-y-0.5 shadow-2xl animate-fade-in">
                                        {bloodTypes.map(bt => (
                                            <button
                                                key={bt}
                                                type="button"
                                                onClick={() => {
                                                    setPersonalInfo({...personalInfo, bloodType: bt});
                                                    setIsBloodOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white text-xs text-slate-300 font-semibold transition"
                                            >
                                                {bt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Alergije */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alergjitë</label>
                                <input 
                                    type="text" 
                                    placeholder="Ndonjë alergji (nëse ka)"
                                    value={personalInfo.allergies}
                                    onChange={(e) => setPersonalInfo({...personalInfo, allergies: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                />
                            </div>

                            {/* Hronične bolesti */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sëmundjet Kronike</label>
                                <input 
                                    type="text" 
                                    placeholder="Sëmundje kronike (nëse ka)"
                                    value={personalInfo.chronicDiseases}
                                    onChange={(e) => setPersonalInfo({...personalInfo, chronicDiseases: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition"
                                />
                            </div>

                            {/* Beleška */}
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Shënim (Note)</label>
                                <textarea 
                                    placeholder="Informacion shtesë..."
                                    value={personalInfo.note}
                                    onChange={(e) => setPersonalInfo({...personalInfo, note: e.target.value})}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 outline-none text-xs font-bold transition resize-none"
                                />
                            </div>

                        </div>

                        {/* Dugme za potvrdu unutar modala */}
                        <div className="mt-6 pt-4 border-t border-slate-800/60">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!canConfirm}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-500/20"
                            >
                                Konfirmo Terminin
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

