"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { X, Camera } from "lucide-react";

interface CreateEventModalProps {
  onClose: () => void;
  onNext: (data: { description: string; image: File | null }) => void;
  userName?: string;
  userAvatar?: string;
}

export default function CreateEventModal({
  onClose,
  onNext,
  userName: propUserName,
  userAvatar: propUserAvatar,
}: CreateEventModalProps) {
  const authUser: any = useSelector((state: RootState) => 
    state.auth?.user || (state as any).saveCredentials?.loginResponse
  );

  const displayName = propUserName || 
    (authUser?.first_name 
      ? `${authUser.first_name} ${authUser.last_name || ""}`.trim() 
      : authUser?.name || "User");

  const displayAvatar = propUserAvatar || 
    authUser?.avatar || 
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(displayName)}`;
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleNext = () => {
    if (!description.trim()) return;
    onNext({ description, image: imageFile });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-100 flex-shrink-0">
              {displayAvatar && (
                <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-800">{displayName}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your event"
            rows={13}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/25 focus:border-[#1E35C8] transition-all resize-none"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="mt-3 rounded-xl overflow-hidden max-h-48">
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={!description.trim()}
            className={`px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 ${
              description.trim()
                ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98]"
                : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}