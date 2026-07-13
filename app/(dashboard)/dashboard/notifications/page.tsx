"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { Bell, Check, ShieldCheck, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";


interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`;
        const res = await fetchWithAuth(url);
        if (!res.ok) throw new Error("Failed to fetch");
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
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, { method: "PATCH" });
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case "info": return <CreditCard className="w-6 h-6 text-blue-500" />;
      default: return <Bell className="w-6 h-6 text-neutral-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
          <p className="text-neutral-500 mt-1">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-500 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Mark all as read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">You're all caught up!</h3>
          <p className="text-neutral-500">We'll notify you when something important happens.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-6 flex gap-4 cursor-pointer transition-colors border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 ${
                n.read
                  ? "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  : "bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
              }`}
            >
              <div className="shrink-0 mt-1">
                <div className={`p-3 rounded-full ${n.read ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700'}`}>
                  {getIcon(n.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <p className={`text-base font-bold ${n.read ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                    {n.title}
                  </p>
                  <span className="text-xs font-medium text-neutral-400 whitespace-nowrap mt-1">
                    {formatTime(n.createdAt)}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${n.read ? 'text-neutral-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
                  {n.message}
                </p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
