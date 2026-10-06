'use client';

import { useState, useRef } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

const cardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
  .preview-wrap { width:100%; max-width:340px; display:flex; flex-direction:column; gap:0; }
  .prev-card { border-radius:20px; overflow:hidden; box-shadow: 0 6px 32px rgba(0,0,0,0.18); }
  .prev-top {
    background: linear-gradient(180deg,#00004d 0%,#0000aa 100%);
    height:180px; display:flex; justify-content:center; align-items:flex-start; padding-top:24px;
  }
  .prev-logo { height:60px; object-fit:contain; }
  .prev-bottom {
    background: linear-gradient(175deg,#4a73f5 0%,#5b50f0 40%,#6644ee 100%);
    padding: 80px 16px 22px; text-align:center; position:relative;
  }
  .prev-avatar {
    position:absolute; top:-62px; left:50%; transform:translateX(-50%);
    width:124px; height:124px; border-radius:50%; border:4px solid #fff;
    overflow:hidden; background:#fff; box-shadow:0 4px 14px rgba(0,0,0,0.2);
    display:flex; align-items:center; justify-content:center;
  }
  .prev-avatar img { width:100%; height:100%; object-fit:cover; }
  .prev-company { font-size:16px; font-weight:900; color:#000; text-transform:uppercase; letter-spacing:1px; margin-bottom:1px; font-family:'Montserrat',Arial,sans-serif; }
  .prev-name { font-size:18px; font-weight:900; color:#000; text-transform:uppercase; letter-spacing:2px; margin-bottom:2px; font-family:'Montserrat',Arial,sans-serif; }
  .prev-title { font-size:13px; font-weight:700; color:#111; text-transform:uppercase; letter-spacing:1px; margin-bottom:18px; font-family:'Montserrat',Arial,sans-serif; }
  .prev-social { display:flex; justify-content:center; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
  .prev-soc-btn { width:38px; height:38px; border:1.5px solid #111; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#111; font-size:17px; background:transparent; }
  .prev-actions { display:flex; flex-direction:column; gap:8px; }
  .prev-action-btn { display:block; width:100%; background:linear-gradient(180deg,#e8e8e8 0%,#c8c8c8 100%); border:1px solid rgba(0,0,0,0.1); color:#000; font-weight:900; font-size:15px; letter-spacing:2px; text-transform:uppercase; padding:9px 0; border-radius:9px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.12); font-family:'Montserrat',Arial,sans-serif; }
  .prev-ext { display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:14px; }
  .prev-ext-full { width:100%; background:linear-gradient(180deg,#dedede 0%,#c5c5c5 100%); color:#000; font-weight:700; font-size:15px; padding:10px 0; border-radius:11px; text-align:center; font-family:'Montserrat',Arial,sans-serif; }
  .prev-ext-narrow { width:190px; background:linear-gradient(180deg,#dedede 0%,#c5c5c5 100%); color:#000; font-weight:700; font-size:15px; padding:10px 0; border-radius:11px; text-align:center; font-family:'Montserrat',Arial,sans-serif; }
`;

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [finalLink, setFinalLink] = useState('');

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [tiktok, setTiktok] = useState('');

  const [imagePreview, setImagePreview] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError(''); setFinalLink('');
    try {
      const res = await fetch('/api/save', { method: 'POST', body: new FormData(formRef.current!) });
      const result = await res.json();
      if (res.ok) { setSuccess('ذخیره شد! گیت‌هاب آپدیت شد.'); setFinalLink(`${window.location.origin}/${id}`); }
      else setError(result.error || 'خطا');
    } catch { setError('خطای ارتباط'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: cardStyles }} />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

        {/* ── FORM ── */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-l from-blue-700 to-blue-500 px-6 py-5">
            <h1 className="text-2xl font-bold text-white text-center">🪪 پنل مدیریت کارت‌های NFC</h1>
            <p className="text-blue-100 text-center mt-1 text-sm">اطلاعات را وارد کنید — پیش‌نمایش لحظه‌ای ببینید — لینک بگیرید</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* ID */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <label className={labelCls}>آیدی اختصاصی (بخشی از لینک) *</label>
              <input required name="id" value={id} onChange={e=>setId(e.target.value.trim())} placeholder="مثال: kamran" className={inputCls} dir="ltr" />
              <p className="text-xs text-blue-500 mt-1">لینک نهایی: yoursite.vercel.app/{id||'...'}</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>نام و نام خانوادگی *</label>
                <input required name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="KAMRAN HASAN" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>نام شرکت</label>
                <input name="company" value={company} onChange={e=>setCompany(e.target.value)} placeholder="MOMTAZ CHEM CO." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>عنوان شغلی</label>
                <input name="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="DIGITAL MANAGER" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>شماره تماس</label>
                <input name="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+989123456789" className={inputCls} dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>ایمیل</label>
                <input name="email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="email@example.com" className={inputCls} dir="ltr" />
              </div>
            </div>

            {/* Social */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-700 mb-4">🔗 شبکه‌های اجتماعی</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {label:'واتساپ (شماره)', name:'whatsapp', val:whatsapp, set:setWhatsapp, ph:'989123456789'},
                  {label:'تلگرام', name:'telegram', val:telegram, set:setTelegram, ph:'https://t.me/username'},
                  {label:'اینستاگرام', name:'instagram', val:instagram, set:setInstagram, ph:'https://instagram.com/...'},
                  {label:'فیسبوک', name:'facebook', val:facebook, set:setFacebook, ph:'https://facebook.com/...'},
                  {label:'لینکدین', name:'linkedin', val:linkedin, set:setLinkedin, ph:'https://linkedin.com/in/...'},
                  {label:'تیک‌تاک', name:'tiktok', val:tiktok, set:setTiktok, ph:'https://tiktok.com/@...'},
                  {label:'وب‌سایت', name:'website', val:website, set:setWebsite, ph:'https://example.com'},
                ].map(f=>(
                  <div key={f.name}>
                    <label className={labelCls}>{f.label}</label>
                    <input name={f.name} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} className={inputCls} dir="ltr" />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-700 mb-4">🖼️ تصاویر</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>عکس پروفایل</label>
                  <input name="image" type="file" accept="image/*" onChange={e=>handleFile(e, setImagePreview)} className="w-full text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg p-1.5" />
                  {imagePreview && <img src={imagePreview} className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-blue-300" />}
                </div>
                <div>
                  <label className={labelCls}>لوگوی شرکت</label>
                  <input name="logo" type="file" accept="image/*" onChange={e=>handleFile(e, setLogoPreview)} className="w-full text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg p-1.5" />
                  {logoPreview && <img src={logoPreview} className="mt-2 h-10 object-contain" />}
                </div>
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5"/><span>{success}</span>
                </div>
                <p className="text-xs text-green-700">لینک NFC آماده است (۱ دقیقه دیگر روی Vercel زنده می‌شود):</p>
                <a href={finalLink} target="_blank" className="font-mono text-sm bg-white p-2 rounded border border-green-300 block text-left text-blue-600 break-all" dir="ltr">{finalLink}</a>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-60 text-base shadow-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
              {loading ? 'در حال ارسال به گیت‌هاب...' : 'ذخیره و ساخت لینک NFC'}
            </button>
          </form>
        </div>

        {/* ── LIVE PREVIEW ── */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 bg-white px-5 py-2 rounded-full shadow-sm">
              <span className="text-base">📱</span>
              <span className="text-base font-bold text-gray-700">پیش‌نمایش زنده موبایل</span>
            </div>

            {/* Phone frame */}
            <div style={{
              width: 360, height: 750,
              border: '14px solid #111', borderRadius: 48,
              overflow: 'hidden', background: '#f2f2f2',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative', overflowY: 'auto',
            }}>
              {/* notch */}
              <div style={{ position:'sticky', top:0, zIndex:10, display:'flex', justifyContent:'center', pointerEvents:'none' }}>
                <div style={{ width:120, height:28, background:'#111', borderRadius:'0 0 20px 20px' }}/>
              </div>

              <div style={{ padding:'16px 12px 40px', display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div className="preview-wrap">

                  <div className="prev-card">
                    {/* TOP */}
                    <div className="prev-top">
                      {logoPreview
                        ? <img src={logoPreview} className="prev-logo" alt="logo"/>
                        : <div style={{height:60,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.4)',fontSize:12,border:'1px dashed rgba(255,255,255,0.3)',borderRadius:8,padding:'4px 12px'}}>LOGO</div>}
                    </div>

                    {/* BOTTOM */}
                    <div className="prev-bottom">
                      <div className="prev-avatar">
                        {imagePreview
                          ? <img src={imagePreview} alt="profile"/>
                          : <div style={{width:'100%',height:'100%',background:'#ddd',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#888'}}>عکس</div>}
                      </div>

                      <div className="prev-company">{company || 'COMPANY NAME'}</div>
                      <div className="prev-name">{name || 'FULL NAME'}</div>
                      <div className="prev-title">{title || 'JOB TITLE'}</div>

                      <div className="prev-social">
                        {whatsapp   && <div className="prev-soc-btn"><i className="fab fa-whatsapp"/></div>}
                        {telegram   && <div className="prev-soc-btn"><i className="fab fa-telegram-plane"/></div>}
                        {email      && <div className="prev-soc-btn"><i className="far fa-envelope"/></div>}
                        {instagram  && <div className="prev-soc-btn"><i className="fab fa-instagram"/></div>}
                        {facebook   && <div className="prev-soc-btn"><i className="fab fa-facebook-f"/></div>}
                        {linkedin   && <div className="prev-soc-btn"><i className="fab fa-linkedin-in"/></div>}
                        {tiktok     && <div className="prev-soc-btn"><i className="fab fa-tiktok"/></div>}
                      </div>

                      <div className="prev-actions">
                        {website && <div className="prev-action-btn">WEBSITE</div>}
                        <div className="prev-action-btn">ABOUT</div>
                        <div className="prev-action-btn">PROFILE</div>
                      </div>
                    </div>
                  </div>

                  <div className="prev-ext">
                    <div className="prev-ext-full">Add to Contact</div>
                    <div className="prev-ext-narrow">Products</div>
                  </div>

                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">با وارد کردن اطلاعات در فرم، کارت اینجا آپدیت می‌شود</p>
          </div>
        </div>

      </div>
    </div>
  );
}
