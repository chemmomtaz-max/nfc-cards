'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, ZoomIn, ZoomOut, Move } from 'lucide-react';

// ─── Image Cropper Component ───────────────────────────────────────────────
function ImageCropper({
  src,
  onCrop,
}: {
  src: string;
  onCrop: (blob: Blob) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const SIZE = 220; // circle diameter in px

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; renderPreview(); };
    img.src = src;
  }, [src]);

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, SIZE, SIZE);
    // clip circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const w = img.width * zoom;
    const h = img.height * zoom;
    const x = (SIZE - w) / 2 + pos.x;
    const y = (SIZE - h) / 2 + pos.y;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  }, [zoom, pos]);

  useEffect(() => { renderPreview(); }, [zoom, pos, renderPreview]);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: dragStart.current.px + (e.clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.clientY - dragStart.current.my),
    });
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setDragging(true);
    dragStart.current = { mx: t.clientX, my: t.clientY, px: pos.x, py: pos.y };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0];
    setPos({
      x: dragStart.current.px + (t.clientX - dragStart.current.mx),
      y: dragStart.current.py + (t.clientY - dragStart.current.my),
    });
  }, [dragging]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove]);

  const exportCrop = () => {
    const canvas = canvasRef.current!;
    canvas.toBlob(b => { if (b) onCrop(b); }, 'image/jpeg', 0.92);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-sm font-semibold text-gray-600 flex items-center gap-1">
        <Move className="w-4 h-4"/> عکس را بکشید و اندازه آن را تنظیم کنید
      </p>

      {/* Canvas circle */}
      <div
        className="rounded-full overflow-hidden border-4 border-white shadow-xl"
        style={{ width: SIZE, height: SIZE, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <canvas ref={canvasRef} width={SIZE} height={SIZE} />
      </div>

      {/* Zoom Slider */}
      <div className="w-full flex items-center gap-3 px-2">
        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-1.5 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50">
          <ZoomOut className="w-4 h-4 text-gray-600"/>
        </button>
        <input
          type="range" min="0.3" max="4" step="0.05"
          value={zoom}
          onChange={e => setZoom(parseFloat(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <button onClick={() => setZoom(z => Math.min(4, z + 0.1))} className="p-1.5 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50">
          <ZoomIn className="w-4 h-4 text-gray-600"/>
        </button>
        <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
      </div>

      <button
        type="button"
        onClick={exportCrop}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
      >
        ✅ تأیید و استفاده از این برش
      </button>
    </div>
  );
}

// ─── Card Preview Component ────────────────────────────────────────────────
const cardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
  .pw{width:100%;max-width:330px;display:flex;flex-direction:column;gap:0}
  .pc{border-radius:20px;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,.18)}
  .pt{background:linear-gradient(180deg,#00004d 0%,#0000aa 100%);height:170px;display:flex;justify-content:center;align-items:flex-start;padding-top:22px}
  .pb{background:linear-gradient(175deg,#4a73f5 0%,#5b50f0 40%,#6644ee 100%);padding:78px 14px 20px;text-align:center;position:relative}
  .pav{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:120px;height:120px;border-radius:50%;border:4px solid #fff;overflow:hidden;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center}
  .pav img{width:100%;height:100%;object-fit:cover}
  .pco{font-size:15px;font-weight:900;color:#000;text-transform:uppercase;letter-spacing:1px;margin-bottom:1px;font-family:'Montserrat',Arial,sans-serif}
  .pna{font-size:17px;font-weight:900;color:#000;text-transform:uppercase;letter-spacing:2px;margin-bottom:1px;font-family:'Montserrat',Arial,sans-serif}
  .pti{font-size:12px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:15px;font-family:'Montserrat',Arial,sans-serif}
  .psr{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin-bottom:13px}
  .psb{width:36px;height:36px;border:1.5px solid #111;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#111;font-size:15px}
  .pac{display:flex;flex-direction:column;gap:7px}
  .pab{display:block;width:100%;background:linear-gradient(180deg,#e8e8e8 0%,#c8c8c8 100%);border:1px solid rgba(0,0,0,.1);color:#000;font-weight:900;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;border-radius:9px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.12);font-family:'Montserrat',Arial,sans-serif}
  .pe{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:12px}
  .pef{width:100%;background:linear-gradient(180deg,#dedede 0%,#c5c5c5 100%);color:#000;font-weight:700;font-size:13px;padding:9px 0;border-radius:10px;text-align:center;font-family:'Montserrat',Arial,sans-serif}
  .pen{width:170px;background:linear-gradient(180deg,#dedede 0%,#c5c5c5 100%);color:#000;font-weight:700;font-size:13px;padding:9px 0;border-radius:10px;text-align:center;font-family:'Montserrat',Arial,sans-serif}
`;

// ─── Main Admin Page ───────────────────────────────────────────────────────
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

  // Image states
  const [rawImageSrc, setRawImageSrc] = useState('');   // original uploaded
  const [croppedImage, setCroppedImage] = useState(''); // after crop confirm
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const [logoPreview, setLogoPreview] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (blob: Blob) => {
    setCroppedBlob(blob);
    const url = URL.createObjectURL(blob);
    setCroppedImage(url);
    setShowCropper(false);
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError(''); setFinalLink('');

    const fd = new FormData(formRef.current!);

    // Replace image with cropped blob
    if (croppedBlob) {
      fd.delete('image');
      fd.append('image', croppedBlob, `${id}_profile.jpg`);
    }

    try {
      const res = await fetch('/api/save', { method: 'POST', body: fd });
      const result = await res.json();
      if (res.ok) { setSuccess('ذخیره شد! گیت‌هاب آپدیت شد.'); setFinalLink(`${window.location.origin}/${id}`); }
      else setError(result.error || 'خطا');
    } catch { setError('خطای ارتباط با سرور'); }
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
            <p className="text-blue-100 text-center mt-1 text-sm">وارد کنید — پیش‌نمایش ببینید — لینک بگیرید</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* ID */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <label className={labelCls}>آیدی اختصاصی (بخشی از لینک) *</label>
              <input required name="id" value={id} onChange={e => setId(e.target.value.trim())} placeholder="مثال: kamran" className={inputCls} dir="ltr" />
              <p className="text-xs text-blue-500 mt-1">لینک نهایی: yoursite.vercel.app/{id || '...'}</p>
            </div>

            {/* Basic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'نام و نام خانوادگی *', name: 'name', val: name, set: setName, ph: 'KAMRAN HASAN', req: true },
                { label: 'نام شرکت', name: 'company', val: company, set: setCompany, ph: 'MOMTAZ CHEM CO.', req: false },
                { label: 'عنوان شغلی', name: 'title', val: title, set: setTitle, ph: 'DIGITAL MANAGER', req: false },
                { label: 'شماره تماس', name: 'phone', val: phone, set: setPhone, ph: '+989123456789', req: false },
              ].map(f => (
                <div key={f.name}>
                  <label className={labelCls}>{f.label}</label>
                  <input required={f.req} name={f.name} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className={inputCls} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className={labelCls}>ایمیل</label>
                <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@example.com" className={inputCls} dir="ltr" />
              </div>
            </div>

            {/* Social */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-700 mb-4">🔗 شبکه‌های اجتماعی</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'واتساپ (شماره)', name: 'whatsapp', val: whatsapp, set: setWhatsapp, ph: '989123456789' },
                  { label: 'تلگرام', name: 'telegram', val: telegram, set: setTelegram, ph: 'https://t.me/username' },
                  { label: 'اینستاگرام', name: 'instagram', val: instagram, set: setInstagram, ph: 'https://instagram.com/...' },
                  { label: 'فیسبوک', name: 'facebook', val: facebook, set: setFacebook, ph: 'https://facebook.com/...' },
                  { label: 'لینکدین', name: 'linkedin', val: linkedin, set: setLinkedin, ph: 'https://linkedin.com/in/...' },
                  { label: 'تیک‌تاک', name: 'tiktok', val: tiktok, set: setTiktok, ph: 'https://tiktok.com/@...' },
                  { label: 'وب‌سایت', name: 'website', val: website, set: setWebsite, ph: 'https://example.com' },
                ].map(f => (
                  <div key={f.name}>
                    <label className={labelCls}>{f.label}</label>
                    <input name={f.name} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className={inputCls} dir="ltr" />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-700 mb-4">🖼️ تصاویر</h3>
              <div className="space-y-4">

                {/* Profile image with cropper */}
                <div>
                  <label className={labelCls}>عکس پروفایل</label>
                  <input name="image" type="file" accept="image/*" onChange={handleImageFile}
                    className="w-full text-sm file:ml-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg p-1.5" />

                  {/* Cropper */}
                  {showCropper && rawImageSrc && (
                    <div className="mt-3">
                      <ImageCropper src={rawImageSrc} onCrop={handleCropConfirm} />
                    </div>
                  )}

                  {/* Confirmed crop preview */}
                  {croppedImage && !showCropper && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={croppedImage} className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow" />
                      <div>
                        <p className="text-xs text-green-600 font-semibold">✅ برش تأیید شد</p>
                        <button type="button" onClick={() => setShowCropper(true)} className="text-xs text-blue-500 underline mt-0.5">ویرایش مجدد</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo */}
                <div>
                  <label className={labelCls}>لوگوی شرکت</label>
                  <input ref={logoInputRef} name="logo" type="file" accept="image/*" onChange={handleLogoFile}
                    className="w-full text-sm file:ml-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg p-1.5" />
                  {logoPreview && <img src={logoPreview} className="mt-2 h-12 object-contain rounded border border-gray-200 p-1 bg-gray-50" />}
                </div>
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" /><span>{success}</span>
                </div>
                <p className="text-xs text-green-700">لینک NFC (۱ دقیقه دیگر زنده می‌شود):</p>
                <a href={finalLink} target="_blank" className="font-mono text-sm bg-white p-2 rounded border border-green-300 block text-left text-blue-600 break-all" dir="ltr">{finalLink}</a>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-60 text-base shadow-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'در حال ارسال به گیت‌هاب...' : 'ذخیره و ساخت لینک NFC'}
            </button>
          </form>
        </div>

        {/* ── LIVE PREVIEW ── */}
        <div className="w-full lg:w-[390px] shrink-0">
          <div className="sticky top-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 bg-white px-5 py-2 rounded-full shadow-sm">
              <span className="text-base">📱</span>
              <span className="text-base font-bold text-gray-700">پیش‌نمایش زنده</span>
            </div>

            {/* Phone frame */}
            <div style={{
              width: 360, height: 755,
              border: '14px solid #111', borderRadius: 48,
              overflow: 'hidden', background: '#f2f2f2',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflowY: 'auto',
            }}>
              <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ width: 110, height: 26, background: '#111', borderRadius: '0 0 18px 18px' }} />
              </div>

              <div style={{ padding: '14px 10px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="pw">
                  <div className="pc">
                    <div className="pt">
                      {logoPreview
                        ? <img src={logoPreview} style={{ height: 60, objectFit: 'contain' }} alt="logo" />
                        : <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12, border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 8, padding: '4px 12px' }}>LOGO</div>}
                    </div>
                    <div className="pb">
                      <div className="pav">
                        {croppedImage
                          ? <img src={croppedImage} alt="profile" />
                          : <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>عکس</div>}
                      </div>
                      <div className="pco">{company || 'COMPANY NAME'}</div>
                      <div className="pna">{name || 'FULL NAME'}</div>
                      <div className="pti">{title || 'JOB TITLE'}</div>
                      <div className="psr">
                        {whatsapp   && <div className="psb"><i className="fab fa-whatsapp" /></div>}
                        {telegram   && <div className="psb"><i className="fab fa-telegram-plane" /></div>}
                        {email      && <div className="psb"><i className="far fa-envelope" /></div>}
                        {instagram  && <div className="psb"><i className="fab fa-instagram" /></div>}
                        {facebook   && <div className="psb"><i className="fab fa-facebook-f" /></div>}
                        {linkedin   && <div className="psb"><i className="fab fa-linkedin-in" /></div>}
                        {tiktok     && <div className="psb"><i className="fab fa-tiktok" /></div>}
                      </div>
                      <div className="pac">
                        {website && <div className="pab">WEBSITE</div>}
                        <div className="pab">ABOUT</div>
                        <div className="pab">PROFILE</div>
                      </div>
                    </div>
                  </div>
                  <div className="pe">
                    <div className="pef">Add to Contact</div>
                    <div className="pen">Products</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">با پر کردن فرم، کارت اینجا آپدیت می‌شود</p>
          </div>
        </div>

      </div>
    </div>
  );
}
