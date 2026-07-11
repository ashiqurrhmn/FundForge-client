"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { motion } from "framer-motion";
import { Upload, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditCampaignPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
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
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session && id) {
      const fetchCampaign = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/campaigns/${id}`);
          const data = await res.json();
          if (data.success) {
            const campaign = data.data;
            setFormData({
              campaign_title: campaign.campaign_title,
              campaign_story: campaign.campaign_story,
              category: campaign.category,
              funding_goal: campaign.funding_goal.toString(),
              minimum_contribution: campaign.minimum_contribution.toString(),
              deadline: campaign.deadline ? campaign.deadline.split('T')[0] : "",
              reward_info: campaign.reward_info,
            });
            setPreviewUrl(campaign.campaign_image_url);
            setExistingImageUrl(campaign.campaign_image_url);
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load campaign data");
        }
      };
      fetchCampaign();
    }
  }, [session, id]);

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
    
    setIsSubmitting(true);
    try {
      let campaign_image_url = existingImageUrl;

      // 1. Upload to ImgBB only if a new image was selected
      if (imageFile) {
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
        
        campaign_image_url = imgResult.data.url;
      }

      if (!campaign_image_url) {
        toast.error("Campaign image is required");
        setIsSubmitting(false);
        return;
      }

      // 2. Submit to API using PATCH
      const payload = {
        ...formData,
        funding_goal: Number(formData.funding_goal),
        minimum_contribution: Number(formData.minimum_contribution),
        campaign_image_url,
      };

      const res = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to update campaign");
      }

      toast.success("Campaign updated successfully!");
      router.push("/creator/dashboard/my-campaigns");

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full">
        
        <Link href="/creator/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-emerald-500 dark:hover:text-[#004F3B] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
        >
          <div className="bg-emerald-500 dark:bg-[#004F3B] px-8 py-5 text-white">
            <h1 className="text-3xl font-black mb-2">Edit Campaign</h1>
            <p className="text-emerald-100">Update the details of your campaign below.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Campaign Cover Image
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-64 md:h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${previewUrl ? 'border-transparent' : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-[#004F3B] hover:bg-emerald-50 dark:hover:bg-[#004F3B]/20'}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="campaign_title" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Campaign Title
                </label>
                <input
                  id="campaign_title"
                  name="campaign_title"
                  required
                  value={formData.campaign_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white"
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white"
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white"
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white"
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white"
                  placeholder="e.g., 10"
                />
              </div>

              {/* Story */}
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white resize-y"
                  placeholder="Tell potential supporters about your project..."
                />
              </div>

              {/* Reward Info */}
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#004F3B] focus:border-emerald-500 dark:focus:border-[#004F3B] transition-all dark:text-white resize-y"
                  placeholder="What will supporters receive for pledging?"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-emerald-500 dark:bg-[#004F3B] hover:bg-emerald-600 dark:hover:bg-[#003d2e] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 dark:shadow-[#004F3B]/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </div>
  );
}
