"use client"
import ModeToggle from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { getUser } from "@/hooks/user/getUser";
import { AnimatePresence, motion } from "framer-motion";
import {
    AtSign,
    BookCopy,
    Calendar,
    Compass,
    Layers,
    LogOut,
    Map,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const hideNavbar = ["/login", "/register"].includes(pathname);
    const { data: user } = getUser({ enabled: !hideNavbar });
    const logout = useLogout();

    if (hideNavbar) {
        return null;
    }

    const navLinks = [
        { href: "/feed", icon: <BookCopy className="w-4 h-4" />, label: "Feed" },
        { href: "/adventures", icon: <Compass className="w-4 h-4" />, label: "Adventures" },
        { href: "/collections", icon: <Layers className="w-4 h-4" />, label: "Collections" },
        { href: "/map", icon: <Map className="w-4 h-4" />, label: "Map" },
        { href: "/calendar", icon: <Calendar className="w-4 h-4" />, label: "Calendar" },
        { href: "/aboutus", icon: <AtSign className="w-4 h-4" />, label: "About Us" }
    ];

    return (
        <motion.nav
            className="w-full border-b border-border"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/dashboard" className="text-xl font-bold flex items-center space-x-2">
                    <span>🌍 TravelQuest</span>
                </Link>

                <div className="hidden md:flex items-center space-x-4">
                    {navLinks.map(({ href, icon, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link key={href} href={href}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`rounded-md ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                                >
                                    <Button variant={isActive ? "secondary" : "ghost"} className="flex gap-1 items-center">
                                        {icon}
                                        <span className="hidden lg:inline">{label}</span>
                                    </Button>
                                </motion.div>

                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <ModeToggle />
                    {/* <motion.div whileHover={{ scale: 1.1 }}>
            <Avatar>
              <AvatarImage src="/avatar.png" alt="user" />
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
          </motion.div> */}

                    <Link href="/userdetails">
                        <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
                            <Avatar>
                                <AvatarImage src={user?.name} alt="user" />
                                <AvatarFallback>{user?.name[0]}</AvatarFallback>
                            </Avatar>
                        </motion.div>
                    </Link>


                    <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                        <LogOut className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="md:hidden px-4 pb-4 space-y-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {navLinks.map(({ href, icon, label }) => {
                            const isActive = pathname === href;
                            return (
                                <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start flex gap-2"
                                    >
                                        {icon} {label}
                                    </Button>
                                </Link>
                            );
                        })}
                        <Button
                            variant="ghost"
                            className="w-full justify-start flex gap-2"
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}