"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { motion } from "framer-motion";
import { Upload, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreateCampaignPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please select a campaign cover image");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload to ImgBB
      const imgData = new FormData();
      imgData.append("image", imageFile);
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      
      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: imgData,
      });
      const imgResult = await imgRes.json();
      
      if (!imgResult.success) {
        throw new Error("Failed to upload image");
      }
      
      const campaign_image_url = imgResult.data.url;

      // 2. Submit to API
      const payload = {
        ...formData,
        funding_goal: Number(formData.funding_goal),
        minimum_contribution: Number(formData.minimum_contribution),
        campaign_image_url,
        creator_id: session.user.id,
        creator_name: session.user.name,
        creator_email: session.user.email,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const res = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to create campaign");
      }

      toast.success("Campaign submitted for approval!");
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
        >
          <div className="bg-emerald-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-black mb-2">Start a New Campaign</h1>
            <p className="text-emerald-100">Share your vision with the world and get funded.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Campaign Cover Image
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-64 md:h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${previewUrl ? 'border-transparent' : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'}`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white font-medium flex items-center gap-2"><Upload className="w-5 h-5" /> Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-neutral-500">
                    <ImageIcon className="w-12 h-12 mb-3 text-neutral-400" />
                    <p className="font-medium text-neutral-700 dark:text-neutral-300">Click to upload image</p>
                    <p className="text-xs mt-1">High resolution images recommended</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="campaign_title" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Campaign Title
                </label>
                <input
                  id="campaign_title"
                  name="campaign_title"
                  required
                  value={formData.campaign_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                  placeholder="e.g., Help us build a solar-powered water pump"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                >
                  <option value="Technology">Technology</option>
                  <option value="Art">Art</option>
                  <option value="Community">Community</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label htmlFor="deadline" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Funding Deadline
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                />
              </div>

              {/* Funding Goal */}
              <div className="space-y-2">
                <label htmlFor="funding_goal" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Funding Goal (Credits)
                </label>
                <input
                  id="funding_goal"
                  name="funding_goal"
                  type="number"
                  required
                  min="1"
                  value={formData.funding_goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                  placeholder="e.g., 5000"
                />
              </div>

              {/* Minimum Contribution */}
              <div className="space-y-2">
                <label htmlFor="minimum_contribution" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Minimum Contribution (Credits)
                </label>
                <input
                  id="minimum_contribution"
                  name="minimum_contribution"
                  type="number"
                  required
                  min="1"
                  value={formData.minimum_contribution}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                  placeholder="e.g., 10"
                />
              </div>

              {/* Story */}
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="campaign_story" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Campaign Story
                </label>
                <textarea
                  id="campaign_story"
                  name="campaign_story"
                  required
                  rows={5}
                  value={formData.campaign_story}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white resize-y"
                  placeholder="Tell potential supporters about your project..."
                />
              </div>

              {/* Reward Info */}
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="reward_info" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Reward Information
                </label>
                <textarea
                  id="reward_info"
                  name="reward_info"
                  required
                  rows={3}
                  value={formData.reward_info}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white resize-y"
                  placeholder="What will supporters receive for pledging?"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Add Campaign"
                )}
              </button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </div>
  );
}
