"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { Loader2, PieChart as PieChartIcon, BarChart3, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { motion } from "framer-motion";

const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"];
const ROLE_COLORS = {
  Admin: "#ef4444", // Red
  Creator: "#8b5cf6", // Purple
  Supporter: "#3b82f6", // Blue
};

export default function ReportsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const hasRevenueData = data?.revenueOverTime?.length > 0;
  const hasCategoryData = data?.campaignsByCategory?.length > 0;
  const hasRoleData = data?.usersByRole?.length > 0;

  // Custom Tooltip for Area Chart
  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-lg font-black text-emerald-500">
            ${payload[0].value.toFixed(2)} <span className="text-xs font-bold">USD</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-3 rounded-xl shadow-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
          <div>
            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{payload[0].name}</p>
            <p className="text-base font-black text-neutral-800 dark:text-white">
              {payload[0].value.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1 flex items-center gap-3">
          <PieChartIcon className="w-8 h-8 text-emerald-500" /> Analytics & Reports
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Detailed insights into platform growth, categories, and demographics.
        </p>
      </div>

      {/* Main Revenue Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] mb-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-0.5">FundForge Income Over Time</h3>
            <p className="text-xs text-neutral-400">Total platform profit (USD) by month</p>
          </div>
        </div>

        {hasRevenueData ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:opacity-10" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#888888' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#888888' }} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <p className="text-sm font-bold text-neutral-400">No revenue data available yet.</p>
          </div>
        )}
      </motion.div>

      {/* Two Column Layout for Pies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Campaigns by Category */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-0.5">Campaigns by Category</h3>
              <p className="text-xs text-neutral-400">Distribution of all platform campaigns</p>
            </div>
          </div>

          {hasCategoryData ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.campaignsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.campaignsByCategory.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
              <p className="text-sm font-bold text-neutral-400">No category data available yet.</p>
            </div>
          )}
        </motion.div>

        {/* Users by Role */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-0.5">User Demographics</h3>
              <p className="text-xs text-neutral-400">Breakdown of users by role</p>
            </div>
          </div>

          {hasRoleData ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.usersByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.usersByRole.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={(ROLE_COLORS as any)[entry.name] || CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
              <p className="text-sm font-bold text-neutral-400">No user role data available yet.</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
