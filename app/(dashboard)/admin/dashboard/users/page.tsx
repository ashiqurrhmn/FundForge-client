"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, Search, Filter, Shield, Palette, User, Trash2, ArrowDownUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AdminTableSkeleton } from "@/components/skeletons/admin-table-skeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  credits: number;
}

export default function AdminUsersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter(u => u.role === roleFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      return 0;
    });

    return result;
  }, [users, searchQuery, roleFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if ((session.user as any).role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user && (session.user as any).role === "admin") {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/admin`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    // Basic safeguard
    if (session?.user?.id === id) {
      toast.error("You cannot change your own role here.");
      return;
    }

    setProcessingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (session?.user?.id === id) {
      toast.error("You cannot delete your own account here.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to completely delete ${name}? This action cannot be undone.`);
    if (!confirmed) return;

    setProcessingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!session || (session.user as any).role !== "admin") return null;

  return (
    <div className="p-6 md:p-8 w-full">
      <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-emerald-500 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
      >
        <div className="bg-emerald-500 dark:bg-[#004F3B] px-8 py-6 text-white">
          <h1 className="text-2xl font-black">Manage Users</h1>
          <p className="text-emerald-100 text-sm mt-1">View and manage all registered users, adjust their roles, or remove accounts.</p>
        </div>

        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm transition-all font-medium text-neutral-700 dark:text-neutral-300"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="creator">Creators</option>
                <option value="supporter">Supporters</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm transition-all font-medium text-neutral-700 dark:text-neutral-300"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <AdminTableSkeleton />
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <p>No users found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">User</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Joined</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Credits</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium dark:text-neutral-200">{u.name}</div>
                      <div className="text-xs text-neutral-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        u.role === 'creator' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {u.role || "supporter"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300 text-sm">
                       {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-700 dark:text-neutral-300">
                       {u.credits || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleUpdateRole(u._id, "admin")}
                            disabled={processingId === u._id || session?.user?.id === u._id}
                            className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            title="Make Admin"
                          >
                            {processingId === u._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                          </button>
                        )}
                        {u.role !== "creator" && (
                          <button
                            onClick={() => handleUpdateRole(u._id, "creator")}
                            disabled={processingId === u._id || session?.user?.id === u._id}
                            className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            title="Make Creator"
                          >
                            {processingId === u._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Palette className="w-5 h-5" />}
                          </button>
                        )}
                        {u.role !== "supporter" && (
                          <button
                            onClick={() => handleUpdateRole(u._id, "supporter")}
                            disabled={processingId === u._id || session?.user?.id === u._id}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            title="Make Supporter"
                          >
                            {processingId === u._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-5 h-5" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={processingId === u._id || session?.user?.id === u._id}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center ml-2"
                          title="Delete User"
                        >
                          {processingId === u._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing <span className="font-medium text-neutral-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-neutral-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)}</span> of <span className="font-medium text-neutral-900 dark:text-white">{filteredAndSortedUsers.length}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
