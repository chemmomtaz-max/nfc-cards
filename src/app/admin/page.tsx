'use client';

import { useState, useRef } from 'react';
import { Save, Loader2, CheckCircle2, Phone, Mail, Globe, MessageCircle, Instagram, Linkedin } from 'lucide-react';

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [finalLink, setFinalLink] = useState('');

  // Form State for Live Preview
  const [id, setId] = useState('kamran');
  const [name, setName] = useState('KAMRAN HASAN');
  const [company, setCompany] = useState('MOMTAZ CHEM CO.');
  const [title, setTitle] = useState('DIGITAL MANAGER');
  const [phone, setPhone] = useState('+989123456789');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    setFinalLink('');

    const formData = new FormData(formRef.current!);
    
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      
      if (res.ok) {
        setSuccess('اطلاعات با موفقیت در گیت‌هاب آپدیت شد!');
        setFinalLink(window.location.origin + '/' + id);
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
    <div className="min-h-screen bg-gray-100 py-6 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Form Section */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden h-fit">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white text-center">پنل مدیریت پیشرفته NFC</h1>
            <p className="text-blue-100 text-center mt-1 text-sm">تغییرات را لحظه‌ای ببینید و سپس ذخیره کنید</p>
          </div>
          
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">آیدی اختصاصی (لینک کارت) *</label>
                <input required name="id" value={id} onChange={e=>setId(e.target.value)} placeholder="مثال: kamran" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">نام و نام خانوادگی *</label>
                <input required name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="KAMRAN HASAN" className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">نام شرکت</label>
                <input name="company" value={company} onChange={e=>setCompany(e.target.value)} placeholder="MOMTAZ CHEM CO." className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">عنوان شغلی</label>
                <input name="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="DIGITAL MANAGER" className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">شماره تماس (برای مخاطبین)</label>
                <input name="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+989123456789" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">ایمیل</label>
                <input name="email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="email@example.com" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>

            </div>

            <hr className="my-6" />
            <h3 className="font-bold text-lg text-gray-800">شبکه‌های اجتماعی و لینک‌ها</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">واتساپ (با کد کشور)</label>
                <input name="whatsapp" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="989123456789" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">تلگرام (لینک)</label>
                <input name="telegram" value={telegram} onChange={e=>setTelegram(e.target.value)} placeholder="https://t.me/username" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">اینستاگرام (لینک)</label>
                <input name="instagram" value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="https://instagram.com/..." className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">لینکدین (لینک)</label>
                <input name="linkedin" value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">وب‌سایت</label>
                <input name="website" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://example.com" className="w-full p-2 border border-gray-300 rounded-lg text-left" dir="ltr" />
              </div>
            </div>

            <hr className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">عکس پروفایل</label>
                <input name="image" type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImagePreview)} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">لوگوی شرکت</label>
                <input name="logo" type="file" accept="image/*" onChange={(e) => handleImageChange(e, setLogoPreview)} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-green-700 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{success}</span>
                </div>
                <p className="text-sm text-green-800">لینک نهایی کارت شما آماده است (۱ دقیقه دیگر در Vercel آنلاین می‌شود):</p>
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
              {loading ? 'در حال ارسال به سرور گیت‌هاب...' : 'ذخیره نهایی و ساخت لینک'}
            </button>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="w-full lg:w-[400px] flex flex-col items-center">
          <div className="sticky top-6 flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-700 mb-4 bg-white px-4 py-2 rounded-full shadow-sm">نمایش زنده در موبایل</h2>
            
            {/* Phone Mockup Frame */}
            <div className="w-[340px] h-[720px] bg-gray-100 border-[12px] border-black rounded-[45px] overflow-y-auto relative shadow-2xl pb-4 font-sans no-scrollbar">
              
              {/* Dynamic Card Preview */}
              <div className="w-full flex flex-col gap-4 p-3 mt-4">
                
                <div className="bg-white rounded-[24px] overflow-hidden shadow-lg relative">
                  
                  <div className="bg-gradient-to-b from-[#000033] to-[#000080] h-[170px] flex justify-center items-start pt-5">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-[60px] object-contain" />
                    ) : (
                      <div className="text-white/50 text-sm border border-dashed border-white/30 p-2 rounded">بدون لوگو</div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-b from-[#4f8aff] to-[#5d5cff] pt-[75px] pb-6 px-4 text-center relative rounded-b-[24px]">
                    
                    <div className="absolute -top-[55px] left-1/2 -translate-x-1/2 w-[110px] h-[110px] rounded-full border-[4px] border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400 text-xs text-center px-2">بدون<br/>عکس</div>
                      )}
                    </div>

                    <h2 className="text-[15px] font-black text-black uppercase mb-1" dir="ltr">{company || 'COMPANY NAME'}</h2>
                    <h1 className="text-xl font-black text-black uppercase tracking-wide mb-1" dir="ltr">{name || 'USER NAME'}</h1>
                    <h3 className="text-sm font-bold text-gray-800 uppercase mb-5" dir="ltr">{title || 'JOB TITLE'}</h3>

                    <div className="flex justify-center flex-wrap gap-2 mb-5">
                      {whatsapp && <div className="w-9 h-9 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center"><i className="fab fa-whatsapp"></i></div>}
                      {telegram && <div className="w-9 h-9 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center"><i className="fab fa-telegram-plane"></i></div>}
                      {email && <div className="w-9 h-9 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center"><i className="far fa-envelope"></i></div>}
                      {instagram && <div className="w-9 h-9 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center"><i className="fab fa-instagram"></i></div>}
                      {linkedin && <div className="w-9 h-9 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center"><i className="fab fa-linkedin-in"></i></div>}
                    </div>

                    <div className="flex flex-col gap-2">
                      {website && <div className="w-full bg-[#e5e7eb] text-black font-black uppercase py-2.5 rounded-xl text-sm">WEBSITE</div>}
                      <div className="w-full bg-[#e5e7eb] text-black font-black uppercase py-2.5 rounded-xl text-sm">ABOUT</div>
                      <div className="w-full bg-[#e5e7eb] text-black font-black uppercase py-2.5 rounded-xl text-sm">PROFILE</div>
                    </div>

                  </div>
                </div>

                <div className="flex flex-col gap-2 px-1">
                  <div className="w-full bg-[#e5e7eb] text-black font-black py-2.5 rounded-xl text-center uppercase text-sm">
                    Add to Contact
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
