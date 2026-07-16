'use client';

import { useState } from 'react';
import {
  Settings,
  MessageCircle,
  Bot,
  Bell,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    whatsapp_enabled: true,
    ai_analysis_enabled: true,
    auto_assign_enabled: false,
    notification_enabled: true,
    language: 'ar',
    currency: 'SAR',
  });

  const [twilioConfig, setTwilioConfig] = useState({
    account_sid: '',
    auth_token: '',
    phone_number: '',
  });

  const handleSave = () => {
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 mt-1">تكوين النظام والتفضيلات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ayla-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-ayla-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">إعدادات عامة</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اللغة</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العملة</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">إعدادات WhatsApp</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">تفعيل WhatsApp</span>
              <button
                onClick={() => setSettings({ ...settings, whatsapp_enabled: !settings.whatsapp_enabled })}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  settings.whatsapp_enabled ? 'bg-green-500' : 'bg-gray-300'
                )}
              >
                <span className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                  settings.whatsapp_enabled ? 'left-7' : 'left-1'
                )} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
              <input
                type="text"
                value={twilioConfig.account_sid}
                onChange={(e) => setTwilioConfig({ ...twilioConfig, account_sid: e.target.value })}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
              <input
                type="password"
                value={twilioConfig.auth_token}
                onChange={(e) => setTwilioConfig({ ...twilioConfig, auth_token: e.target.value })}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">إعدادات الذكاء الاصطناعي</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">تحليل AI للبلاغات</span>
              <button
                onClick={() => setSettings({ ...settings, ai_analysis_enabled: !settings.ai_analysis_enabled })}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  settings.ai_analysis_enabled ? 'bg-purple-500' : 'bg-gray-300'
                )}
              >
                <span className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                  settings.ai_analysis_enabled ? 'left-7' : 'left-1'
                )} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">الإشعارات</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">تفعيل الإشعارات</span>
              <button
                onClick={() => setSettings({ ...settings, notification_enabled: !settings.notification_enabled })}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  settings.notification_enabled ? 'bg-yellow-500' : 'bg-gray-300'
                )}
              >
                <span className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                  settings.notification_enabled ? 'left-7' : 'left-1'
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-ayla-600 text-white px-6 py-3 rounded-lg hover:bg-ayla-700 font-medium"
        >
          <Save className="w-5 h-5" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}
