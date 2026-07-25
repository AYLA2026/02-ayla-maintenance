"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Camera, CheckCircle, Star, ArrowRight, MapPin, Clock, Package,
  MessageSquare, History, Navigation, Play, Square, Share2, Moon, Sun,
  QrCode, PenTool, Video, FileText, Fingerprint, Wifi, WifiOff,
  ChevronLeft, ChevronRight, Trash2, AlertTriangle, Timer, X
} from "lucide-react";

export default function ReportDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // ========== STATE ==========
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);
  const [beforeIdx, setBeforeIdx] = useState(0);
  const [afterIdx, setAfterIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00");
  const [delayed, setDelayed] = useState(false);

  const [showParts, setShowParts] = useState(false);
  const [parts, setParts] = useState([
    { name: "فلتر مكيف", qty: 0 },
    { name: "مروحة داخلية", qty: 0 },
    { name: "غاز تبريد", qty: 0 },
    { name: "كابل كهرباء", qty: 0 },
  ]);

  const [isOnline, setIsOnline] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const report = {
    id: id || "unknown",
    reportNo: "REP-001",
    title: "عطل مكيف",
    description: "المكيف في غرفة المدير لا يعمل منذ صباح اليوم",
    category: "HVAC",
    priority: "HIGH",
    school: { name: "مدرسة النور", address: "حي الورود" },
    receivedAt: new Date().toISOString(),
  };

  // ========== DARK MODE ==========
  useEffect(() => {
    const saved = localStorage.getItem("ayla_dark");
    if (saved) setDarkMode(saved === "true");
    // Biometric check
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ayla_dark", String(darkMode));
  }, [darkMode]);

  // ========== OFFLINE ==========
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ========== GPS + LIVE TRACKING ==========
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  // ========== CHECK-IN / TIMER / DELAY ALERT ==========
  useEffect(() => {
    const ci = localStorage.getItem(`ci_${id}`);
    const co = localStorage.getItem(`co_${id}`);
    if (ci) setCheckIn(ci);
    if (co) setCheckOut(co);

    if (ci && !co) {
      timerRef.current = setInterval(() => {
        const start = new Date(ci).getTime();
        const now = Date.now();
        const diff = Math.floor((now - start) / 1000);
        const m = String(Math.floor(diff / 60)).padStart(2, "0");
        const s = String(diff % 60).padStart(2, "0");
        setElapsed(`${m}:${s}`);

        // تنبيه تأخير بعد 30 دقيقة
        if (diff > 1800 && !delayed) {
          setDelayed(true);
          alert("⏰ تنبيه: تجاوزت 30 دقيقة على هذا البلاغ!");
        }
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [id, delayed]);

  // ========== SOUND ==========
  const playDing = useCallback(() => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  // ========== HANDLERS ==========
  const handleCheckIn = () => {
    const now = new Date().toISOString();
    setCheckIn(now);
    localStorage.setItem(`ci_${id}`, now);
    playDing();
  };

  const handleCheckOut = () => {
    const now = new Date().toISOString();
    setCheckOut(now);
    localStorage.setItem(`co_${id}`, now);
    if (timerRef.current) clearInterval(timerRef.current);
    playDing();
  };

  const handleImage = (type: "before" | "after") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (type === "before") setBeforeImages((prev) => [...prev, result]);
        else setAfterImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const removeImage = (type: "before" | "after", idx: number) => {
    if (type === "before") {
      const arr = beforeImages.filter((_, i) => i !== idx);
      setBeforeImages(arr);
      setBeforeIdx(Math.min(beforeIdx, Math.max(0, arr.length - 1)));
    } else {
      const arr = afterImages.filter((_, i) => i !== idx);
      setAfterImages(arr);
      setAfterIdx(Math.min(afterIdx, Math.max(0, arr.length - 1)));
    }
  };

  const shareLocation = () => {
    if (!location) return alert("الموقع غير متوفر");
    const url = `https://wa.me/?text=${encodeURIComponent(`موقعي:\nhttps://maps.google.com/?q=${location.lat},${location.lng}`)}`;
    window.open(url, "_blank");
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleRequestParts = () => {
    const requested = parts.filter((p) => p.qty > 0);
    if (requested.length === 0) return alert("اختر كمية أولاً");
    localStorage.setItem(`parts_${id}`, JSON.stringify(requested));
    playDing();
    alert("✅ تم إرسال طلب قطع الغيار");
    setShowParts(false);
  };

  // ========== SIGNATURE ==========
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = darkMode ? "#C9A227" : "#1A0F09";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // ========== PDF REPORT ==========
  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl">
      <head><title>تقرير البلاغ #${report.reportNo}</title>
      <style>
        body { font-family: Arial; padding: 40px; background: #FAF7F2; color: #2C1810; }
        .header { text-align: center; border-bottom: 3px solid #C9A227; padding-bottom: 20px; margin-bottom: 30px; }
        .box { background: white; border: 1px solid #C9A227; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .label { color: #5C3A2A; font-size: 12px; margin-bottom: 5px; }
        .value { font-size: 16px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #C9A227; padding: 12px; text-align: right; }
        th { background: #C9A227; color: white; }
        .signature-img { max-width: 300px; border: 1px solid #ddd; margin-top: 10px; }
        @media print { body { background: white; } }
      </style></head>
      <body>
        <div class="header">
          <h1 style="color:#C9A227; margin:0;">آيلا للصيانة</h1>
          <p style="color:#5C3A2A; margin:5px 0 0;">تقرير إغلاق بلاغ</p>
        </div>
        <div class="box">
          <div class="label">رقم البلاغ</div><div class="value">${report.reportNo}</div>
        </div>
        <div class="box">
          <div class="label">العنوان</div><div class="value">${report.title}</div>
          <div class="label" style="margin-top:10px">الوصف</div><div class="value">${report.description}</div>
        </div>
        <div class="box">
          <div class="label">المدرسة</div><div class="value">${report.school.name}</div>
          <div class="label" style="margin-top:10px">الموقع</div>
          <div class="value">${location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "—"}</div>
        </div>
        <div class="box">
          <div class="label">وقت البدء</div><div class="value">${checkIn ? new Date(checkIn).toLocaleString("ar-SA") : "—"}</div>
          <div class="label" style="margin-top:10px">وقت الانتهاء</div><div class="value">${checkOut ? new Date(checkOut).toLocaleString("ar-SA") : "—"}</div>
          <div class="label" style="margin-top:10px">التقييم</div><div class="value">${rating}/5 نجوم</div>
        </div>
        <div class="box">
          <div class="label">الملاحظات</div><div class="value">${notes || "لا توجد ملاحظات"}</div>
        </div>
        ${signatureData ? `<div class="box"><div class="label">التوقيع الإلكتروني</div><img class="signature-img" src="${signatureData}"/></div>` : ""}
        <div style="text-align:center; margin-top:40px; color:#999; font-size:12px;">تم إنشاء هذا التقرير تلقائياً من تطبيق آيلا للصيانة</div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // ========== CLOSE REPORT ==========
  const handleClose = async () => {
    if (beforeImages.length === 0 || afterImages.length === 0) {
      alert("الرجاء إرفاق صور قبل وبعد");
      return;
    }
    setSubmitting(true);

    // Offline: save to queue if offline
    if (!isOnline) {
      const queue = JSON.parse(localStorage.getItem("offline_queue") || "[]");
      queue.push({ id, notes, rating, beforeImages, afterImages, signatureData, closedAt: new Date().toISOString() });
      localStorage.setItem("offline_queue", JSON.stringify(queue));
      alert("📴 تم الحفظ بدون اتصال — سيرفع تلقائياً لما يتوفر النت");
    }

    await new Promise((r) => setTimeout(r, 800));
    playDing();

    const history = JSON.parse(localStorage.getItem("tech_history") || "[]");
    history.unshift({
      id,
      title: report.title,
      school: report.school.name,
      closedAt: new Date().toLocaleString("ar-SA"),
      rating,
      checkIn,
      checkOut,
      beforeCount: beforeImages.length,
      afterCount: afterImages.length,
      hasSignature: !!signatureData,
    });
    localStorage.setItem("tech_history", JSON.stringify(history));
    setSubmitting(false);
    setDone(true);
  };

  // ========== RENDER HELPERS ==========
  const theme = {
    bg: darkMode ? "bg-[#1A0F09]" : "bg-[#FAF7F2]",
    card: darkMode ? "bg-[#2C1810] border-[#C9A227]/20" : "bg-white border-[#C9A227]/15",
    text: darkMode ? "text-[#C9A227]" : "text-[#2C1810]",
    subText: darkMode ? "text-[#C9A227]/70" : "text-[#5C3A2A]",
    input: darkMode ? "bg-[#1A0F09] border-[#C9A227]/20 text-white placeholder-[#C9A227]/40" : "bg-white border-[#C9A227]/20 text-[#2C1810] placeholder-gray-400",
  };

  const ImageGallery = ({
    images,
    idx,
    setIdx,
    type,
  }: {
    images: string[];
    idx: number;
    setIdx: (n: number) => void;
    type: "before" | "after";
  }) => (
    <div
      className={`aspect-square rounded-xl border-2 border-dashed border-[#C9A227]/40 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative ${theme.card}`}
      onClick={() => images.length === 0 && handleImage(type)}
    >
      {images.length > 0 ? (
        <>
          <img src={images[idx]} className="w-full h-full object-cover" alt={type} />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(idx === 0 ? images.length - 1 : idx - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(idx === images.length - 1 ? 0 : idx + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeImage(type, idx);
            }}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-red-500/80 text-white"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px]">
            {idx + 1}/{images.length}
          </span>
        </>
      ) : (
        <>
          <Camera className="w-8 h-8 text-[#C9A227]/60 mb-2" />
          <span className={`text-xs ${theme.subText}`}>{type === "before" ? "قبل" : "بعد"}</span>
        </>
      )}
    </div>
  );

  if (done) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${theme.text}`}>تم إغلاق البلاغ!</h2>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => router.push("/technician-app/reports")}
              className="px-6 py-3 rounded-xl font-bold text-[#1A0F09] bg-[#C9A227]"
            >
              العودة للبلاغات
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-3 rounded-xl font-bold text-[#C9A227] border border-[#C9A227]"
            >
              <FileText className="w-4 h-4 inline ml-1" />
              تحميل PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      
      {/* ===== HEADER ===== */}
      <div className={`sticky top-0 z-40 p-4 border-b border-[#C9A227]/20 flex items-center justify-between ${theme.card} shadow-sm`}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg bg-[#C9A227]/10 active:scale-95 transition">
            <ArrowRight className="w-5 h-5 text-[#C9A227]" />
          </button>
          <div>
            <h1 className={`text-lg font-bold ${theme.text}`}>بلاغ #{report.reportNo}</h1>
            <p className={`text-xs ${theme.subText}`}>{report.school.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Offline badge */}
          {!isOnline && (
            <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1">
              <WifiOff className="w-3 h-3" /> offline
            </span>
          )}
          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227] active:scale-95 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => router.push("/technician-app/chat")} className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227]">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => router.push("/technician-app/history")} className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227]">
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ===== CONTENT (scrollable) ===== */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* 📍 GPS + Share */}
        <div className={`p-4 rounded-xl border shadow-sm ${theme.card}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.text}`}>
              <Navigation className="w-4 h-4 text-[#C9A227]" /> الموقع الحالي
            </h3>
            {location && (
              <button
                onClick={shareLocation}
                className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold flex items-center gap-1 active:scale-95"
              >
                <Share2 className="w-3 h-3" /> واتساب
              </button>
            )}
          </div>
          {location ? (
            <p className={`text-xs ${theme.subText}`}>
              📍 {location.lat.toFixed(5)} , {location.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-xs text-gray-400">جاري تحديد الموقع...</p>
          )}
        </div>

        {/* ⏱️ Timer + Check-in/out */}
        <div className={`p-4 rounded-xl border shadow-sm ${theme.card}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.text}`}>
              <Clock className="w-4 h-4 text-[#C9A227]" /> تسجيل الوقت
            </h3>
            {checkIn && !checkOut && (
              <span className="px-2 py-1 rounded-lg bg-[#C9A227]/10 text-[#C9A227] text-xs font-mono font-bold flex items-center gap-1">
                <Timer className="w-3 h-3" /> {elapsed}
              </span>
            )}
          </div>
          {delayed && (
            <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> تجاوزت 30 دقيقة — أبلغ المشرف
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCheckIn}
              disabled={!!checkIn}
              className="py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> {checkIn ? "بدأت" : "بدأت العمل"}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!!checkOut || !checkIn}
              className="py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" /> {checkOut ? "انتهيت" : "انتهيت"}
            </button>
          </div>
        </div>

        {/* 🎥 Video */}
        <div className={`p-4 rounded-xl border shadow-sm ${theme.card}`}>
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme.text}`}>
            <Video className="w-4 h-4 text-[#C9A227]" /> تسجيل فيديو للعطل
          </h3>
          <input
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleVideo}
            className="w-full text-xs text-[#C9A227] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#C9A227]/10 file:text-[#C9A227]"
          />
          {videoUrl && (
            <video src={videoUrl} controls className="w-full mt-3 rounded-xl" />
          )}
        </div>

        {/* 📝 Details */}
        <div className={`p-4 rounded-xl border shadow-sm ${theme.card}`}>
          <h3 className={`font-bold text-lg mb-2 ${theme.text}`}>{report.title}</h3>
          <p className={`text-sm leading-relaxed mb-3 ${theme.subText}`}>{report.description}</p>
          <div className={`flex items-center gap-4 text-xs ${theme.subText}`}>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.school.name}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(report.receivedAt).toLocaleDateString("ar-SA")}</span>
          </div>
        </div>

        {/* 🖼️ Album */}
        <div>
          <h3 className={`text-sm font-bold mb-3 ${theme.text}`}>
            📸 صور قبل / بعد <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div onClick={() => beforeImages.length === 0 && handleImage("before")}>
              <ImageGallery images={beforeImages} idx={beforeIdx} setIdx={setBeforeIdx} type="before" />
            </div>
            <div onClick={() => afterImages.length === 0 && handleImage("after")}>
              <ImageGallery images={afterImages} idx={afterIdx} setIdx={setAfterIdx} type="after" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            اضغط لإضافة • اسحب للتنقل • 🗑️ للحذف
          </p>
        </div>

        {/* 🔧 Parts */}
        <button
          onClick={() => setShowParts(!showParts)}
          className="w-full py-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] font-bold text-sm flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" /> {showParts ? "إخفاء قطع الغيار" : "طلب قطع غيار"}
        </button>

        {showParts && (
          <div className={`p-4 rounded-xl border shadow-sm space-y-3 ${theme.card}`}>
            {parts.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-sm ${theme.text}`}>{p.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setParts(parts.map((x, idx) => (idx === i ? { ...x, qty: Math.max(0, x.qty - 1) } : x)))
                    }
                    className="w-8 h-8 rounded-lg bg-gray-100 text-[#2C1810] font-bold"
                  >
                    -
                  </button>
                  <span className={`w-6 text-center ${theme.text}`}>{p.qty}</span>
                  <button
                    onClick={() =>
                      setParts(parts.map((x, idx) => (idx === i ? { ...x, qty: x.qty + 1 } : x)))
                    }
                    className="w-8 h-8 rounded-lg bg-[#C9A227]/20 text-[#2C1810] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleRequestParts}
              className="w-full py-3 rounded-xl bg-[#C9A227] text-white font-bold text-sm shadow-md"
            >
              إرسال الطلب
            </button>
          </div>
        )}

        {/* ✍️ Signature */}
        <div className={`p-4 rounded-xl border shadow-sm ${theme.card}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.text}`}>
              <PenTool className="w-4 h-4 text-[#C9A227]" /> التوقيع الإلكتروني
            </h3>
            <button
              onClick={() => setShowSignature(!showSignature)}
              className="text-xs text-[#C9A227] font-bold"
            >
              {showSignature ? "إخفاء" : "إضافة توقيع"}
            </button>
          </div>
          {signatureData && !showSignature && (
            <img src={signatureData} className="max-h-24 rounded-lg border border-[#C9A227]/20" alt="signature" />
          )}
          {showSignature && (
            <div className="space-y-2">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className={`w-full rounded-xl border-2 border-dashed border-[#C9A227]/40 cursor-crosshair ${darkMode ? "bg-[#1A0F09]" : "bg-white"}`}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <div className="flex gap-2">
                <button onClick={clearSignature} className="flex-1 py-2 rounded-lg border border-red-300 text-red-500 text-xs font-bold">
                  مسح
                </button>
                <button onClick={() => setShowSignature(false)} className="flex-1 py-2 rounded-lg bg-[#C9A227] text-white text-xs font-bold">
                  حفظ التوقيع
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 📱 QR Code */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full py-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] font-bold text-sm flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" /> {showQR ? "إخفاء QR" : "عرض QR المدرسة"}
        </button>
        {showQR && (
          <div className={`p-4 rounded-xl border shadow-sm text-center ${theme.card}`}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(report.school.name + " | " + report.reportNo)}`}
              alt="QR"
              className="mx-auto rounded-xl"
            />
            <p className={`text-xs mt-2 ${theme.subText}`}>امسح الكود لتأكيد حضورك</p>
          </div>
        )}

        {/* 📝 Notes */}
        <div>
          <h3 className={`text-sm font-bold mb-3 ${theme.text}`}>📝 ملاحظات العمل</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اكتب ملاحظاتك..."
            className={`w-full p-4 rounded-xl border focus:border-[#C9A227] focus:outline-none resize-none ${theme.input}`}
            rows={4}
            dir="rtl"
          />
        </div>

        {/* ⭐ Rating */}
        <div>
          <h3 className={`text-sm font-bold mb-3 ${theme.text}`}>⭐ تقييم جودة العمل</h3>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="p-1 transition active:scale-110">
                <Star
                  className={`w-10 h-10 ${s <= rating ? "text-[#C9A227] fill-[#C9A227]" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 🔐 Biometric */}
        {biometricSupported && (
          <button className="w-full py-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] font-bold text-sm flex items-center justify-center gap-2">
            <Fingerprint className="w-4 h-4" /> تفعيل بصمة الوجه للدخول السريع
          </button>
        )}

        {/* PDF Button (before close) */}
        <button
          onClick={generatePDF}
          className="w-full py-3 rounded-xl border border-[#C9A227] text-[#C9A227] font-bold text-sm flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" /> معاينة تقرير PDF
        </button>

        {/* Spacer for sticky button */}
        <div className="h-4" />
      </div>

      {/* ⬇️⬇️⬇️ زر الإغلاق — STICKY (مضمون الظهور) ⬇️⬇️⬇️ */}
      <div className={`sticky bottom-0 left-0 right-0 p-4 border-t-2 border-[#C9A227] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 ${darkMode ? "bg-[#1A0F09]" : "bg-white"}`}>
        <button
          onClick={handleClose}
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-[#C9A227] hover:bg-[#B8941F] active:bg-[#A07820] disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg"
        >
          {submitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              إغلاق البلاغ
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          {beforeImages.length === 0 || afterImages.length === 0
            ? `⚠️ صور: ${beforeImages.length} قبل / ${afterImages.length} بعد`
            : `✅ جاهز للإغلاق (${beforeImages.length + afterImages.length} صورة)`}
        </p>
      </div>

    </div>
  );
}