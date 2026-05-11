"use client";

import { useRef } from "react";
import { Share2, Pencil } from "lucide-react";
import QRCode from "react-qr-code";

interface QRDisplayPageProps {
  paymentUrl?: string;
  onEdit?: () => void;
}

export default function QRDisplayPage({
  paymentUrl = "https://monieplug.com/pay/viewcenter",
  onEdit,
}: QRDisplayPageProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.download = "monieplug-qr.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Monieplug Payment QR",
        text: "Scan to make payment",
        url: paymentUrl,
      });
    } else {
      await navigator.clipboard.writeText(paymentUrl);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-900">Send or Print and share to customers</h1>
          <p className="text-sm text-gray-500 mt-1">Recieve payment of your business in one place.</p>
        </div>

        {/* QR Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center mb-5">
          <p className="text-sm text-gray-700 mb-5 font-medium">Scan Me to make payment</p>

          <div ref={qrRef} className="p-2">
            <QRCode
              value={paymentUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all shadow-sm"
          >
            Download code
          </button>

          <button
            onClick={handleShare}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={onEdit}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}