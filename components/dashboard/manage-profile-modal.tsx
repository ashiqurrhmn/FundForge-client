"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/app/lib/auth-client";

interface ManageProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function ManageProfileModal({ isOpen, onClose, user }: ManageProfileModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || "");
      setPreviewUrl(user?.image || null);
      setImageFile(null);
    }
  }, [isOpen, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = user?.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        // Upload to ImgBB
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });
        
        const data = await res.json();
        
        if (data.success) {
          finalImageUrl = data.data.url;
        } else {
          toast.error("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }

      const { error } = await authClient.updateUser({
        name,
        image: finalImageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Manage Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-4 border-white dark:border-neutral-900 shadow-md flex items-center justify-center">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-neutral-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Upload className="w-6 h-6" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-neutral-500">Click image to upload new picture</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-600/20"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
