"use client";

import { ClerkLoaded, ClerkLoading, useUser, SignOutButton } from "@clerk/nextjs";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MixerHorizontalIcon,
    ExitIcon,
    CardStackIcon,
    PersonIcon,
    DashboardIcon,
    CalendarIcon,
    CrumpledPaperIcon,
    MoonIcon,
    SunIcon,
    AccessibilityIcon,
} from "@radix-ui/react-icons";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Badge } from "./ui/badge";

const Appshell = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const pathname = usePathname();

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/count`, fetcher);

    const mainPages = [
        {
            name: "Tableau de bord",
            href: "/",
            current: pathname === "/",
            icon: <DashboardIcon className="mr-2 h-4 w-4" />,
        },
        {
            name: "Commandes",
            href: "/orders",
            current: pathname.includes("/orders"),
            icon: <CardStackIcon className="mr-2 h-4 w-4" />,
            isCount: true,
            count: data?.orderCount,
        },
        {
            name: "Clients",
            href: "/clients",
            current: pathname.includes("/clients"),
            icon: <PersonIcon className="mr-2 h-4 w-4" />,
            isCount: true,
            count: data?.clientsCount,
        },
        {
            name: "Comptes rendus",
            href: "/reports",
            current: pathname.includes("/reports"),
            icon: <CalendarIcon className="mr-2 h-4 w-4" />,
        },
        {
            name: "Devis plateau spécial",
            href: "/estimate",
            current: pathname.includes("/estimate"),
            icon: <CrumpledPaperIcon className="mr-2 h-4 w-4" />,
        },
    ];

    const secondaryPages = [
        {
            name: "Plats chauds",
            href: "/meal/hot",
            current: pathname.includes("/hot"),
        },
        {
            name: "Plats froids",
            href: "/meal/cold",
            current: pathname.includes("/cold"),
        },
        {
            name: "Plateaux PL1 à PL5",
            href: "/meal/special",
            current: pathname.includes("/special"),
        },
        {
            name: "Huitres ouvertes",
            href: "/meal/oysters",
            current: pathname.includes("/oysters"),
        },
        {
            name: "Ingrédients",
            href: "/ingredients",
            current: pathname.includes("/ingredients"),
        },
        {
            name: "Unitées",
            href: "/units",
            current: pathname.includes("/units"),
        },
        {
            name: "Vendeurs",
            href: "/sellers",
            current: pathname.includes("/sellers"),
        },
    ];

    const { setTheme, theme } = useTheme();

    return (
        <div>
            {/* <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. --> */}
            <div className="relative z-40 md:hidden" role="dialog" aria-modal="true">
                {/* <!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>

                <div className="fixed inset-0 z-40 flex">
                    {/* <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      --> */}
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-black pt-5 pb-4">
                        {/* <!--
          Close button, show/hide based on off-canvas menu state.

          Entering: "ease-in-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-300"
            From: "opacity-100"
            To: "opacity-0"
        --> */}
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="sr-only">Close sidebar</span>
                                {/*  <!-- Heroicon name: outline/x-mark --> */}
                                <svg
                                    className="h-6 w-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-shrink-0 items-center px-4">
                            <img className="h-8 w-auto" src="/logo.svg" alt="Your Company" />
                        </div>
                        <div className="mt-5 h-0 flex-1 overflow-y-auto">
                            <nav className="flex-1 space-y-1 pb-4">
                                {mainPages.map((page) => (
                                    <Button
                                        key={page.href}
                                        className="w-full justify-start rounded-none"
                                        variant={page.current ? "default" : "ghost"}
                                        asChild
                                    >
                                        <Link href={page.href}>
                                            {page.icon} {page.name}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                            <span className="text-xs ml-4 mb-2 mt-4 uppercase font-medium opacity-70">
                                Mises à jour
                            </span>
                            <nav className="flex-1 space-y-1 pb-4">
                                {secondaryPages.map((page) => (
                                    <Button
                                        key={page.href}
                                        className="w-full justify-start"
                                        variant={page.current ? "default" : "ghost"}
                                        asChild
                                    >
                                        <Link href={page.href}>{page.name}</Link>
                                    </Button>
                                ))}
                            </nav>
                        </div>
                    </div>
                    <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
                </div>
            </div>

            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800 pt-5">
                    <div className="flex width-full justify-between items-center px-4">
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <img className="h-8 w-auto" src="/logo.svg" alt="Traiteur Pro" />
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem>Copier le logo</ContextMenuItem>
                                <ContextMenuItem>Tableau de bord</ContextMenuItem>
                                <ContextMenuItem>Page d&apos;accueil</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                        <ClerkLoading>
                            <span className="w-[32px] h-[32px] bg-slate-300 rounded-full animate-pulse" />
                        </ClerkLoading>
                        <ClerkLoaded>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="w-[32px] h-[32px] cursor-pointer">
                                        <AvatarImage src={user?.profileImageUrl} />
                                        <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 ml-48 mt-1">
                                    <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                                    <DropdownMenuLabel className="text-xs font-normal opacity-70 -mt-3">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer" asChild>
                                            <Link href="/me">
                                                <MixerHorizontalIcon className="mr-2" /> Gérer mon compte
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <SunIcon className={`mr-2 + ${theme != "light" && "hidden"}`} />
                                                <MoonIcon className={`mr-2 + ${theme != "dark" && "hidden"}`} />
                                                Changer de thème
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => setTheme("light")}
                                                    >
                                                        <SunIcon className="mr-2" /> Clair
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => setTheme("dark")}
                                                    >
                                                        <MoonIcon className="mr-2" /> Sombre
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => setTheme("system")}
                                                    >
                                                        <AccessibilityIcon className="mr-2" /> Système
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <SignOutButton>
                                            <DropdownMenuItem className="focus:bg-red-100 dark:focus:bg-red-800 cursor-pointer">
                                                <ExitIcon className="mr-2" /> Déconnexion
                                            </DropdownMenuItem>
                                        </SignOutButton>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ClerkLoaded>
                    </div>
                    <div className="mt-5 flex flex-col px-2">
                        <nav className="flex-1 space-y-1 pb-4">
                            {mainPages.map((page) => (
                                <Button
                                    key={page.href}
                                    className="w-full justify-start"
                                    variant={page.current ? "default" : "ghost"}
                                    asChild
                                >
                                    <Link href={page.href}>
                                        {page.icon} {page.name} &nbsp;
                                        {page.isCount && (
                                            <Badge
                                                className={
                                                    page.current
                                                        ? `rounded px-2 whitespace-nowrap text-white bg-zinc-700 hover:bg-zinc-700`
                                                        : `rounded px-2 whitespace-nowrap`
                                                }
                                                variant="secondary"
                                            >
                                                {page.count ?? "—"}
                                            </Badge>
                                        )}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                        <span className="text-xs ml-4 mb-2 mt-4 uppercase font-medium opacity-70">Mises à jour</span>
                        <nav className="flex-1 space-y-1 pb-4">
                            {secondaryPages.map((page) => (
                                <Button
                                    key={page.href}
                                    className="w-full justify-start"
                                    variant={page.current ? "default" : "ghost"}
                                    asChild
                                >
                                    <Link href={page.href}>{page.name}</Link>
                                </Button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col md:pl-64">
                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-8">
                            <section id="appshell-content">{children}</section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Appshell;
