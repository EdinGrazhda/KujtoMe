import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Initialize Sanctum CSRF cookie for SPA authentication
axios.get('/sanctum/csrf-cookie').catch(() => {});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const admin = import.meta.glob('./Admin/**/*.tsx', { eager: true });
        const page =
            (pages as Record<string, unknown>)[`./pages/${name}.tsx`] ??
            (admin as Record<string, unknown>)[`./${name}.tsx`];
        if (!page) throw new Error(`Inertia page not found: ${name}`);
        return page as never;
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
