"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flame, AlertCircle } from "lucide-react";
import { authClient } from "../lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    password: "",
    role: "supporter",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.profilePictureUrl.trim()) {
       newErrors.profilePictureUrl = "Profile Picture URL is required";
    } else {
       try {
          new URL(formData.profilePictureUrl);
       } catch (_) {
          newErrors.profilePictureUrl = "Please enter a valid URL";
       }
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and a number";
    }

    // Mock existing email check for demonstration
    if (formData.email === "test@example.com") {
      newErrors.email = "This email is already registered. Please log in.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const { data, error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      image: formData.profilePictureUrl,
    });

    if (error) {
      setErrors({ ...errors, email: error.message || "An error occurred during signup" });
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(false);
    router.push("/dashboard");
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950 px-4 transition-colors">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* We use large blurred circles rotating slowly to create a dynamic, modern background */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-300/30 dark:bg-emerald-600/20 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-[spin_40s_linear_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 dark:bg-emerald-900/30 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-[spin_50s_linear_infinite_reverse]" />
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-3xl shadow-2xl my-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/assets/logo-light.png" 
              alt="FundForge Logo" 
              width={180} 
              height={50} 
              className="h-10 w-auto object-contain dark:hidden" 
              priority
            />
            <Image 
              src="/assets/logo-dark.png" 
              alt="FundForge Logo" 
              width={180} 
              height={50} 
              className="h-auto w-auto object-contain hidden dark:block" 
              priority
            />
          </Link>
          <p className="text-neutral-500 dark:text-neutral-400">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`flex h-12 w-full rounded-xl border ${errors.name ? 'border-red-500/50 focus:ring-red-500' : 'border-neutral-200 dark:border-white/10 focus:ring-emerald-500'} bg-white/50 dark:bg-white/5 px-4 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`flex h-12 w-full rounded-xl border ${errors.email ? 'border-red-500/50 focus:ring-red-500' : 'border-neutral-200 dark:border-white/10 focus:ring-emerald-500'} bg-white/50 dark:bg-white/5 px-4 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5" htmlFor="profilePictureUrl">
              Profile Picture URL
            </label>
            <input
              id="profilePictureUrl"
              name="profilePictureUrl"
              type="url"
              value={formData.profilePictureUrl}
              onChange={handleChange}
              className={`flex h-12 w-full rounded-xl border ${errors.profilePictureUrl ? 'border-red-500/50 focus:ring-red-500' : 'border-neutral-200 dark:border-white/10 focus:ring-emerald-500'} bg-white/50 dark:bg-white/5 px-4 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.profilePictureUrl && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400"><AlertCircle className="w-3 h-3" /> {errors.profilePictureUrl}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`flex h-12 w-full rounded-xl border ${errors.password ? 'border-red-500/50 focus:ring-red-500' : 'border-neutral-200 dark:border-white/10 focus:ring-emerald-500'} bg-white/50 dark:bg-white/5 px-4 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              placeholder="••••••••"
            />
            {errors.password ? (
               <p className="mt-1.5 flex items-start gap-1 text-xs text-red-500 dark:text-red-400">
                 <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> 
                 <span>{errors.password}</span>
               </p>
            ) : (
               <p className="mt-1.5 text-xs text-neutral-500">Must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.</p>
            )}
          </div>

          {/* Role Selection (Dropdown) */}
          <div>
             <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5" htmlFor="role">
               Select Role
             </label>
             <div className="relative">
               <select
                 id="role"
                 name="role"
                 value={formData.role}
                 onChange={handleChange}
                 className="flex h-12 w-full appearance-none rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
               >
                 <option value="supporter" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Supporter</option>
                 <option value="creator" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Creator</option>
               </select>
               {/* Custom dropdown arrow */}
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500 dark:text-neutral-400">
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
               </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_20px_rgba(5,150,105,0.3)]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Registering...
              </span>
            ) : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-neutral-200 dark:border-white/10"></div>
          <span className="px-3 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Or continue with</span>
          <div className="flex-1 border-t border-neutral-200 dark:border-white/10"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-neutral-900 dark:text-white font-medium hover:bg-neutral-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
          
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 pt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
