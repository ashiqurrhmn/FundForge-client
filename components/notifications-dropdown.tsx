"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  read: boolean;
  createdAt: string;
  link?: string;
}

export function NotificationsDropdown({ isMobile = false, isDashboardHeader = false }: { isMobile?: boolean, isDashboardHeader?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchNotifications = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`;
      const res = await fetchWithAuth(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Oops, we haven't received JSON!");
      }

      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((n: any) => ({
          id: n._id || n.id,
          title: n.title || "Notification",
          message: n.message || "",
          type: n.type || "info",
          read: n.read || false,
          createdAt: n.createdAt || new Date().toISOString(),
        }));
        setNotifications(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
    
    // Auto-refresh every 30 seconds in the background
    const intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 30000);

    // Listen for custom events to instantly refresh (e.g., after a purchase)
    const handleRefreshEvent = () => fetchNotifications(false);
    window.addEventListener("refresh-notifications", handleRefreshEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("refresh-notifications", handleRefreshEvent);
    };
  }, []);

  // Also refresh immediately when the user opens the dropdown
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(false);
    }
  }, [isOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayNotifications = notifications.filter((n) => !n.read).slice(0, 5);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, { method: "PATCH" });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    setIsOpen(false);
    
    const t = n.title.toLowerCase();
    const role = (session?.user as any)?.role || "";

    if (role === "admin") {
      if (t.includes("withdrawal")) return router.push("/admin/dashboard/withdrawals");
      if (t.includes("campaign")) return router.push("/admin/dashboard/campaigns");
      if (t.includes("purchase")) return router.push("/admin/dashboard/purchases");
    } else if (role === "creator") {
      if (t.includes("withdrawal")) return router.push("/creator/dashboard/withdrawals");
      if (t.includes("campaign")) return router.push("/creator/dashboard/my-campaigns");
      if (t.includes("support") || t.includes("contribution")) return router.push("/creator/dashboard/contributions");
    } else if (role === "supporter") {
      if (t.includes("contribution") || t.includes("support")) return router.push("/supporter/dashboard/contributions");
      if (t.includes("purchase") || t.includes("credit")) return router.push("/supporter/dashboard/payments");
    }
    
    // Default fallback
    router.push("/dashboard/notifications");
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, { method: "PATCH" });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "info":
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1 w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between text-sm font-medium px-3 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors w-full"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-neutral-500" /> Notifications
          </div>
          {unreadCount > 0 && (
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-2 mt-1 space-y-1">
                {isLoading ? (
                  <p className="text-xs text-center text-neutral-500 py-4">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-xs text-center text-neutral-500 py-4">No notifications</p>
                ) : (
                  <>
                    <div className="flex justify-between items-center px-2 py-1 mb-1">
                      <span className="text-xs font-bold text-neutral-500">Recent</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-[10px] text-emerald-600 hover:underline">
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {displayNotifications.length === 0 ? (
                      <p className="text-xs text-center text-neutral-500 py-4">No new notifications</p>
                    ) : (
                      displayNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-2 rounded-md cursor-pointer transition-colors flex gap-3 ${
                          n.read
                            ? "hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-70"
                            : "bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">{getIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{n.title}</p>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-tight mt-0.5">{n.message}</p>
                          <p className="text-[9px] text-neutral-400 mt-1">{formatTime(n.createdAt)}</p>
                        </div>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                        )}
                      </div>
                    )))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center p-1.5 rounded-full transition-colors ${
          isDashboardHeader
            ? "text-emerald-100 hover:text-white hover:bg-white/10 dark:hover:bg-emerald-900/30"
            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
        title="Notifications"
      >
        <Bell className={isDashboardHeader ? "w-6 h-6" : "w-5 h-5"} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden z-50 origin-top-right flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50">
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="flex flex-col">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-neutral-500 flex flex-col items-center justify-center gap-2">
                   <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                   Loading...
                </div>
              ) : displayNotifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-500 flex flex-col items-center justify-center gap-2">
                  <Bell className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                  <p>You're all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {displayNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 flex gap-4 cursor-pointer transition-colors border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 ${
                        n.read
                          ? "bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          : "bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                         <div className={`p-2 rounded-full ${n.read ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-800 shadow-sm'}`}>
                            {getIcon(n.type)}
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                           <p className={`text-sm font-bold truncate ${n.read ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                             {n.title}
                           </p>
                           <span className="text-[10px] text-neutral-400 whitespace-nowrap mt-0.5">{formatTime(n.createdAt)}</span>
                        </div>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${n.read ? 'text-neutral-500 dark:text-neutral-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
                          {n.message}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 self-center" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50 text-center shrink-0">
               <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors block w-full">
                  View all notifications
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
