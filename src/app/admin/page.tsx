'use client';

import { useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [finalLink, setFinalLink] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    setFinalLink('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const id = formData.get('id') as string;

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      
      if (res.ok) {
        setSuccess('اطلاعات با موفقیت ذخیره و در گیت‌هاب آپدیت شد!');
        // Assuming Vercel deployment URL or local URL
        setFinalLink(window.location.origin + '/' + id);
        form.reset();
      } else {
        setError(result.error || 'خطا در ذخیره اطلاعات');
      }
    } catch (err) {
      setError('خطای ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">پنل مدیریت کارت‌های NFC</h1>
          <p className="text-blue-100 text-center mt-1 text-sm">بدون نیاز به دیپلوی! اطلاعات را وارد کنید تا خودکار آپدیت شود.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">آیدی اختصاصی (لینک کارت) *</label>
              <input required name="id" placeholder="مثال: kamran" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              <p className="text-xs text-gray-500">لینک نهایی به این شکل می‌شود: site.com/kamran</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">نام و نام خانوادگی *</label>
              <input required name="name" placeholder="KAMRAN HASAN" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">نام شرکت</label>
              <input name="company" placeholder="MOMTAZ CHEM CO." className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">عنوان شغلی</label>
              <input name="title" placeholder="DIGITAL MANAGER" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">شماره تماس (ذخیره در مخاطبین)</label>
              <input name="phone" placeholder="+989123456789" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">ایمیل</label>
              <input name="email" type="email" placeholder="email@example.com" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>

          </div>

          <hr className="my-6" />
          <h3 className="font-bold text-lg text-gray-800">شبکه‌های اجتماعی و لینک‌ها</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">واتساپ (شماره با کد کشور)</label>
              <input name="whatsapp" placeholder="989123456789" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">تلگرام (لینک)</label>
              <input name="telegram" placeholder="https://t.me/username" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">اینستاگرام (لینک)</label>
              <input name="instagram" placeholder="https://instagram.com/..." className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">لینکدین (لینک)</label>
              <input name="linkedin" placeholder="https://linkedin.com/in/..." className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">وب‌سایت</label>
              <input name="website" placeholder="https://example.com" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
            </div>
          </div>

          <hr className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">عکس پروفایل</label>
              <input name="image" type="file" accept="image/*" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">لوگوی شرکت</label>
              <input name="logo" type="file" accept="image/*" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>{success}</span>
              </div>
              <p className="text-sm text-green-800">
                شما می‌توانید این لینک را روی کارت NFC خود کپی کنید:
              </p>
              <a href={finalLink} target="_blank" className="font-mono bg-white p-2 rounded block border border-green-200 text-left w-full overflow-x-auto text-blue-600" dir="ltr">
                {finalLink}
              </a>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'در حال ذخیره و آپدیت گیت‌هاب...' : 'ذخیره کارمند و ساخت لینک'}
          </button>
        </form>
      </div>
    </div>
  );
}
