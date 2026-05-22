import { Link, usePage } from '@inertiajs/react';
import {
    Baby,
    BookOpen,
    ClipboardCheck,
    FolderGit2,
    LayoutGrid,
    ShieldCheck,
    Stethoscope,
    Syringe,
    UserCog,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Children',
        href: '/admin/children',
        icon: Baby,
        permission: 'Children_View',
    },
    {
        title: 'Doctors',
        href: '/admin/doctors',
        icon: Stethoscope,
        permission: 'Doctors_View',
    },
    {
        title: 'Parents',
        href: '/admin/parents',
        icon: Users,
        permission: 'Parents_View',
    },
    {
        title: 'Vaccines',
        href: '/admin/vaccines',
        icon: Syringe,
        permission: 'Vaccines_View',
    },
    {
        title: 'Confirmations',
        href: '/admin/confirmations',
        icon: ClipboardCheck,
        permission: 'Confirmations_View',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
        icon: ShieldCheck,
        role: 'Admin',
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: UserCog,
        role: 'Admin',
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const userPermissions: string[] = auth.permissions ?? [];
    const userRoles: string[] = auth.roles ?? [];

    const visibleNavItems = mainNavItems.filter((item) => {
        if (item.role) return userRoles.includes(item.role);
        if (item.permission) return userPermissions.includes(item.permission);
        return true; // Dashboard — always visible
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
