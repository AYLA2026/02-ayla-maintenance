'use client';

import { useState, useEffect } from 'react';

export default function TechnicianApp() {
  const [reports, setReports] = useState<any[]>([]);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  const technicianId = 'TECH_ID_FROM_AUTH';

  useEffect(() => {
    fetchReports();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/technician-sw.js');
    }
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const fetchReports = async () => {
    const res = await fetch(`/api/technicians/${technicianId}/reports`);
    const data = await res.json();
    setReports(data);
  };

  const acceptReport = async (reportId: string) => {
    await fetch(`/api/reports/${reportId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ technicianId })
    });
    fetchReports();
  };

  const closeReport = async () => {
    if (!activeReport) return;

    const res = await fetch(`/api/reports/${activeReport.id}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-technician-id': technicianId
      },
      body: JSON.stringify({
        beforeImages: beforePhotos,
        afterImages: afterPhotos,
        feedback,
        rating
      })
    });

    if (res.ok) {
      alert('✅ تم إغلاق البلاغ بنجاح!');
      setActiveReport(null);
      setBeforePhotos([]);
      setAfterPhotos([]);
      setFeedback('');
      fetchReports();
    }
  };

  const capturePhoto = async (type: 'before' | 'after') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (type === 'before') {
          setBeforePhotos(prev => [...prev, base64]);
        } else {
          setAfterPhotos(prev => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  return (
    <div className="min-h-screen bg-[#1A0F09] text-white">
      <header className="bg-[#C9A227] p-4 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-[#1A0F09]">🔧 تطبيق الفني - آيلا</h1>
      </header>

      {/* Reports List */}
      {!activeReport && (
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-bold text-[#C9A227] mb-4">📋 بلاغاتي</h2>

          {reports.map(report => (
            <div
              key={report.id}
              className="bg-[#2a1a0e] rounded-xl p-4 border border-[#C9A227]/20"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#C9A227] font-bold">#{report.reportNo}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  report.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  report.status === 'ASSIGNED' ? 'bg-blue-500/20 text-blue-400' :
                  report.status === 'IN_PROGRESS' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {report.status === 'PENDING' ? 'مستلم' :
                   report.status === 'ASSIGNED' ? 'موجه' :
                   report.status === 'IN_PROGRESS' ? 'قيد العمل' : 'مغلق'}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-2">{report.title}</p>
              <p className="text-xs text-gray-500 mb-3">{report.school?.name}</p>

              {report.status === 'ASSIGNED' && (
                <button
                  onClick={() => setActiveReport(report)}
                  className="w-full bg-[#C9A227] text-[#1A0F09] py-2 rounded-lg font-bold text-sm"
                >
                  🚀 بدء العمل
                </button>
              )}

              {report.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => setActiveReport(report)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm"
                >
                  ✅ إنهاء وإغلاق
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Close Report Form */}
      {activeReport && (
        <div className="p-4 space-y-4">
          <button
            onClick={() => setActiveReport(null)}
            className="text-[#C9A227] text-sm mb-2"
          >
            ← رجوع
          </button>

          <h2 className="text-lg font-bold text-[#C9A227]">
            إغلاق البلاغ #{activeReport.reportNo}
          </h2>

          {/* Before Photos */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">📸 صور قبل الإصلاح</label>
            <div className="flex gap-2 flex-wrap">
              {beforePhotos.map((photo, i) => (
                <img key={i} src={photo} className="w-20 h-20 object-cover rounded-lg" />
              ))}
              <button
                onClick={() => capturePhoto('before')}
                className="w-20 h-20 border-2 border-dashed border-[#C9A227]/50 rounded-lg flex items-center justify-center text-[#C9A227]"
              >
                + 📷
              </button>
            </div>
          </div>

          {/* After Photos */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">📸 صور بعد الإصلاح</label>
            <div className="flex gap-2 flex-wrap">
              {afterPhotos.map((photo, i) => (
                <img key={i} src={photo} className="w-20 h-20 object-cover rounded-lg" />
              ))}
              <button
                onClick={() => capturePhoto('after')}
                className="w-20 h-20 border-2 border-dashed border-[#C9A227]/50 rounded-lg flex items-center justify-center text-[#C9A227]"
              >
                + 📷
              </button>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">📝 ملاحظات الفني</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-[#2a1a0e] border border-[#C9A227]/30 rounded-lg p-3 text-white text-sm"
              rows={3}
              placeholder="اكتب ملاحظاتك عن العمل المنجز..."
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">⭐ التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-[#C9A227]' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={closeReport}
            disabled={beforePhotos.length === 0 || afterPhotos.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ تأكيد إغلاق البلاغ
          </button>
        </div>
      )}
    </div>
  );
}