'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Save, Loader2, CheckCircle2, ZoomIn, ZoomOut,
  Move, Plus, Pencil, ExternalLink, Users, X, ChevronLeft
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────
type Employee = {
  id: string; name: string; company: string; title: string;
  phone: string; email: string; website: string; whatsapp: string;
  telegram: string; instagram: string; facebook: string; linkedin: string;
  tiktok: string; image: string; logo: string;
  productsUrl?: string; aboutUrl?: string;
  customBtnLabel?: string; customBtnType?: string; customBtnLink?: string;
  customBtnText?: string; customFileUrl?: string; logoSize?: number | string; logoMarginTop?: number | string;
};

// ─── Image Cropper ─────────────────────────────────────────────────────────
function ImageCropper({ src, onCrop }: { src: string; onCrop: (blob: Blob) => void }) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const SIZE = 200;

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(); };
    img.src = src;
  }, [src]);

  const draw = useCallback(() => {
    const c = canvasRef.current; const i = imgRef.current;
    if (!c || !i) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2); ctx.clip();
    const w = i.width * zoom, h = i.height * zoom;
    ctx.drawImage(i, (SIZE - w) / 2 + pos.x, (SIZE - h) / 2 + pos.y, w, h);
    ctx.restore();
  }, [zoom, pos]);

  useEffect(() => { draw(); }, [draw]);

  const onMD = (e: React.MouseEvent) => { setDragging(true); dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }; };
  const onMM = useCallback((e: MouseEvent) => { if (!dragging) return; setPos({ x: dragStart.current.px + (e.clientX - dragStart.current.mx), y: dragStart.current.py + (e.clientY - dragStart.current.my) }); }, [dragging]);
  const onMU = useCallback(() => setDragging(false), []);
  const onTS = (e: React.TouchEvent) => { const t = e.touches[0]; setDragging(true); dragStart.current = { mx: t.clientX, my: t.clientY, px: pos.x, py: pos.y }; };
  const onTM = useCallback((e: TouchEvent) => { if (!dragging) return; const t = e.touches[0]; setPos({ x: dragStart.current.px + (t.clientX - dragStart.current.mx), y: dragStart.current.py + (t.clientY - dragStart.current.my) }); }, [dragging]);

  useEffect(() => {
    window.addEventListener('mousemove', onMM); window.addEventListener('mouseup', onMU);
    window.addEventListener('touchmove', onTM); window.addEventListener('touchend', onMU);
    return () => { window.removeEventListener('mousemove', onMM); window.removeEventListener('mouseup', onMU); window.removeEventListener('touchmove', onTM); window.removeEventListener('touchend', onMU); };
  }, [onMM, onMU, onTM]);

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-gray-900 rounded-2xl">
      <p className="text-xs text-gray-400 flex items-center gap-1"><Move className="w-3 h-3" /> بکشید و زوم کنید</p>
      <div className="rounded-full overflow-hidden border-4 border-white/20 shadow-2xl" style={{ width: SIZE, height: SIZE, cursor: dragging ? 'grabbing' : 'grab' }} onMouseDown={onMD} onTouchStart={onTS}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} />
      </div>
      <div className="w-full flex items-center gap-2 px-1">
        <button type="button" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-1.5 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600"><ZoomOut className="w-3.5 h-3.5" /></button>
        <input type="range" min="0.3" max="4" step="0.05" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
        <button type="button" onClick={() => setZoom(z => Math.min(4, z + 0.1))} className="p-1.5 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600"><ZoomIn className="w-3.5 h-3.5" /></button>
        <span className="text-xs text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
      </div>
      <button type="button" onClick={() => canvasRef.current?.toBlob(b => { if (b) onCrop(b); }, 'image/jpeg', 0.92)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-xl text-sm">✅ تأیید برش</button>
    </div>
  );
}

// ─── Card Preview ──────────────────────────────────────────────────────────
function CardPreview({ data, imagePreview, logoPreview }: { data: Partial<Employee>; imagePreview: string; logoPreview: string; }) {
  const s = { fontFamily: "'Montserrat', Arial, sans-serif" };
  return (
    <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 6px 28px rgba(0,0,0,0.22)' }}>
        {/* TOP */}
        <div style={{ background: 'linear-gradient(180deg,#00004d 0%,#0000aa 100%)', height: 155, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: data.logoMarginTop != null ? Number(data.logoMarginTop) : 20 }}>
          {logoPreview ? <img src={logoPreview} style={{ height: Number(data.logoSize) || 72, objectFit: 'contain' }} alt="" /> : <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, border: '1px dashed rgba(255,255,255,0.25)', borderRadius: 7, padding: '3px 10px' }}>LOGO</div>}
        </div>
        {/* BOTTOM */}
        <div style={{ background: 'linear-gradient(175deg,#4a73f5 0%,#5b50f0 40%,#6644ee 100%)', padding: '66px 14px 18px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -52, left: '50%', transform: 'translateX(-50%)', width: 104, height: 104, borderRadius: '50%', border: '4px solid #fff', overflow: 'hidden', background: '#ddd', boxShadow: '0 3px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: 10, color: '#999' }}>عکس</span>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1, ...s }}>{data.company || 'COMPANY'}</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 1, ...s }}>{data.name || 'FULL NAME'}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 13, ...s }}>{data.title || 'JOB TITLE'}</div>
          {/* Social */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {['whatsapp', 'telegram', 'email', 'instagram', 'facebook', 'linkedin', 'tiktok'].map(k => {
              const val = (data as any)[k];
              if (!val) return null;
              const icon: Record<string, string> = { whatsapp: 'fa-whatsapp', telegram: 'fa-telegram-plane', email: 'fa-envelope', instagram: 'fa-instagram', facebook: 'fa-facebook-f', linkedin: 'fa-linkedin-in', tiktok: 'fa-tiktok' };
              const prefix = k === 'email' ? 'far' : 'fab';
              return <div key={k} style={{ width: 32, height: 32, border: '1.5px solid #111', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><i className={`${prefix} ${icon[k]}`} /></div>;
            })}
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              data.website && 'WEBSITE', 
              (data.aboutUrl || data.website) && 'ABOUT', 
              data.customBtnLabel || 'PROFILE'
            ].filter(Boolean).map(label => (
              <div key={label} style={{ background: 'linear-gradient(180deg,#e8e8e8 0%,#c8c8c8 100%)', border: '1px solid rgba(0,0,0,0.1)', color: '#000', fontWeight: 900, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', padding: '7px 0', borderRadius: 8, textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', ...s }}>{label}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <div style={{ width: '100%', background: 'linear-gradient(180deg,#dedede 0%,#c5c5c5 100%)', color: '#000', fontWeight: 700, fontSize: 12, padding: '8px 0', borderRadius: 10, textAlign: 'center', ...s }}>Add to Contact</div>
        {(data.productsUrl || data.website) && (
          <div style={{ width: 150, background: 'linear-gradient(180deg,#dedede 0%,#c5c5c5 100%)', color: '#000', fontWeight: 700, fontSize: 12, padding: '8px 0', borderRadius: 10, textAlign: 'center', ...s }}>Products</div>
        )}
      </div>
    </div>
  );
}

// ─── Empty form ────────────────────────────────────────────────────────────
const emptyForm = (): Partial<Employee> => ({
  id: '', name: '', company: '', title: '', phone: '', email: '',
  website: '', whatsapp: '', telegram: '', instagram: '',
  facebook: '', linkedin: '', tiktok: '', image: '', logo: '', logoSize: 72, logoMarginTop: 20,
  productsUrl: '', aboutUrl: '', customBtnLabel: 'PROFILE', customBtnType: 'link', customBtnLink: '', customBtnText: ''
});

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [employees, setEmployees] = useState<Record<string, Employee>>({});
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [err, setErr] = useState('');
  const [finalLink, setFinalLink] = useState('');

  const [form, setForm] = useState<Partial<Employee>>(emptyForm());
  const [isEdit, setIsEdit] = useState(false);

  const [rawImg, setRawImg] = useState('');
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  // Load employees
  const loadEmployees = async () => {
    setLoadingList(true);
    try {
      const r = await fetch('/api/employees', { cache: 'no-store' });
      setEmployees(await r.json());
    } catch { }
    setLoadingList(false);
  };

  useEffect(() => { loadEmployees(); }, []);

  const openNew = () => {
    setForm(emptyForm()); setIsEdit(false);
    setRawImg(''); setCroppedBlob(null); setCroppedUrl(''); setLogoUrl('');
    setSaved(''); setErr(''); setFinalLink('');
    setView('form');
  };

  const openEdit = (emp: Employee) => {
    setForm(emp); setIsEdit(true);
    setRawImg(''); setCroppedBlob(null);
    setCroppedUrl(emp.image || ''); setLogoUrl(emp.logo || '');
    setSaved(''); setErr(''); setFinalLink('');
    setView('form');
  };

  const set = (k: keyof Employee) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setRawImg(reader.result as string); setShowCropper(true); };
    reader.readAsDataURL(file);
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaved(''); setErr(''); setFinalLink('');
    const fd = new FormData(formRef.current!);
    if (isEdit) fd.set('id', form.id as string);
    if (croppedBlob) { fd.delete('image'); fd.append('image', croppedBlob, `${form.id}_profile.jpg`); }
    try {
      const r = await fetch('/api/save', { method: 'POST', body: fd });
      const res = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
      if (r.ok) {
        setSaved('کارت ذخیره شد و گیت‌هاب آپدیت شد!');
        setFinalLink(`${window.location.origin}/${form.id}`);
        await loadEmployees();
      } else setErr(res.error || 'خطا در ذخیره');
    } catch (e: any) { setErr('خطای ارتباط: ' + (e?.message || 'اتصال ناموفق')); }
    setSaving(false);
  };


  const inp = "w-full bg-gray-800/60 border border-gray-700 text-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600 transition";
  const lbl = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide";

  // ── LIST VIEW ──
  if (view === 'list') return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">پنل مدیریت کارت‌های NFC</h1>
              <p className="text-gray-500 text-sm">{Object.keys(employees).length} کارت فعال</p>
            </div>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm shadow-lg">
            <Plus className="w-4 h-4" /> کارت جدید
          </button>
        </div>

        {/* Cards Grid */}
        {loadingList ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : Object.keys(employees).length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🪪</div>
            <p className="text-gray-500 mb-4">هنوز هیچ کارتی ساخته نشده</p>
            <button onClick={openNew} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">اولین کارت را بسازید</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(employees).map(emp => (
              <div key={emp.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition group">
                {/* Card mini preview */}
                <div className="h-24 flex items-end justify-center relative" style={{ background: 'linear-gradient(180deg,#00004d 0%,#0000aa 100%)' }}>
                  {emp.logo && <img src={emp.logo} className="h-10 object-contain mb-3" alt="" />}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-3 border-gray-900 overflow-hidden bg-gray-700" style={{ border: '3px solid #111827' }}>
                    {emp.image ? <img src={emp.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">?</div>}
                  </div>
                </div>
                <div className="pt-9 pb-4 px-4 text-center">
                  <p className="font-black text-sm text-white uppercase tracking-wide">{emp.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{emp.title}</p>
                  <p className="text-blue-500 text-xs mt-0.5">{emp.company}</p>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={() => openEdit(emp)} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 rounded-xl transition text-xs">
                    <Pencil className="w-3.5 h-3.5" /> ویرایش
                  </button>
                  <a href={`/${emp.id}`} target="_blank" className="flex items-center justify-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold py-2 px-3 rounded-xl transition text-xs">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── FORM VIEW ──
  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm">
            <ChevronLeft className="w-4 h-4" /> بازگشت
          </button>
          <div className="h-4 w-px bg-gray-700" />
          <h1 className="text-lg font-bold">{isEdit ? `ویرایش: ${form.name}` : 'کارت جدید'}</h1>
          {isEdit && <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-lg">در حال ویرایش</span>}
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* FORM */}
          <div className="flex-1 space-y-4">
            <form ref={formRef} onSubmit={handleSubmit}>
              {/* ID */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">🔗 آیدی کارت</h3>
                <div>
                  <label className={lbl}>آیدی (بخشی از لینک) *</label>
                  <input required name="id" value={form.id || ''} onChange={set('id')} disabled={isEdit} placeholder="مثال: kamran" className={`${inp} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`} dir="ltr" />
                  <p className="text-xs text-gray-600 mt-1.5">لینک: yoursite.vercel.app/{form.id || '...'}</p>
                </div>
              </div>

              {/* Info */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-300 mb-4">👤 اطلاعات شخصی</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    ['name', 'نام و نام خانوادگی *', 'KAMRAN HASAN', true],
                    ['company', 'نام شرکت', 'MOMTAZ CHEM CO.', false],
                    ['title', 'عنوان شغلی', 'DIGITAL MANAGER', false],
                    ['phone', 'شماره تماس', '+989123456789', false],
                    ['email', 'ایمیل', 'email@example.com', false],
                    ['website', 'وب‌سایت', 'https://example.com', false],
                  ] as [keyof Employee, string, string, boolean][]).map(([k, l, p, r]) => (
                    <div key={k} className={k === 'email' || k === 'website' ? 'sm:col-span-2' : ''}>
                      <label className={lbl}>{l}</label>
                      <input required={r} name={k} value={(form[k] as string) || ''} onChange={set(k)} placeholder={p} className={inp} dir={k === 'email' || k === 'website' ? 'ltr' : undefined} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-300 mb-4">🌐 شبکه‌های اجتماعی</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    ['whatsapp', 'واتساپ (شماره)', '989123456789'],
                    ['telegram', 'تلگرام', 'https://t.me/...'],
                    ['instagram', 'اینستاگرام', 'https://instagram.com/...'],
                    ['facebook', 'فیسبوک', 'https://facebook.com/...'],
                    ['linkedin', 'لینکدین', 'https://linkedin.com/in/...'],
                    ['tiktok', 'تیک‌تاک', 'https://tiktok.com/@...'],
                  ] as [keyof Employee, string, string][]).map(([k, l, p]) => (
                    <div key={k}>
                      <label className={lbl}>{l}</label>
                      <input name={k} value={(form[k] as string) || ''} onChange={set(k)} placeholder={p} className={inp} dir="ltr" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-300 mb-4">🔘 دکمه‌های اکشن</h3>
                
                <div className="space-y-4">
                  {/* Products & About */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>لینک دکمه PRODUCTS</label>
                      <input name="productsUrl" value={form.productsUrl || ''} onChange={set('productsUrl')} placeholder="https://..." className={inp} dir="ltr" />
                    </div>
                    <div>
                      <label className={lbl}>لینک دکمه ABOUT</label>
                      <input name="aboutUrl" value={form.aboutUrl || ''} onChange={set('aboutUrl')} placeholder="https://..." className={inp} dir="ltr" />
                    </div>
                  </div>

                  <hr className="border-gray-800" />
                  
                  {/* Custom Button */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">شخصی‌سازی دکمه سوم (پیش‌فرض PROFILE)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>نام دکمه</label>
                        <input name="customBtnLabel" value={form.customBtnLabel || ''} onChange={set('customBtnLabel')} placeholder="مثال: SHOP یا CATALOG" className={inp} dir="ltr" />
                      </div>
                      <div>
                        <label className={lbl}>نوع دکمه</label>
                        <select name="customBtnType" value={form.customBtnType || 'link'} onChange={(e) => setForm(f => ({ ...f, customBtnType: e.target.value }))} className={inp}>
                          <option value="link">لینک سایت</option>
                          <option value="file">دانلود فایل (PDF و...)</option>
                          <option value="text">نمایش متن</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      {(!form.customBtnType || form.customBtnType === 'link') && (
                        <div>
                          <label className={lbl}>لینک</label>
                          <input name="customBtnLink" value={form.customBtnLink || ''} onChange={set('customBtnLink')} placeholder="https://..." className={inp} dir="ltr" />
                        </div>
                      )}
                      {form.customBtnType === 'file' && (
                        <div>
                          <label className={lbl}>فایل (آپلود)</label>
                          <input name="customBtnFile" type="file" className="w-full text-sm file:ml-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 file:font-medium hover:file:bg-gray-600 cursor-pointer border border-gray-700 rounded-xl p-1.5 text-gray-400 bg-gray-800/40" />
                          {form.customFileUrl && <p className="text-xs text-green-400 mt-2">فایل قبلاً آپلود شده است. برای تغییر فایل جدید انتخاب کنید.</p>}
                        </div>
                      )}
                      {form.customBtnType === 'text' && (
                        <div>
                          <label className={lbl}>متن نمایشی</label>
                          <textarea name="customBtnText" value={form.customBtnText || ''} onChange={(e) => setForm(f => ({ ...f, customBtnText: e.target.value }))} rows={3} placeholder="متن خود را وارد کنید..." className={inp}></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-300 mb-4">🖼️ تصاویر</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Profile */}
                  <div>
                    <label className={lbl}>عکس پروفایل</label>
                    <input name="image" type="file" accept="image/*" onChange={handleImgFile}
                      className="w-full text-sm file:ml-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 file:font-medium hover:file:bg-gray-600 cursor-pointer border border-gray-700 rounded-xl p-1.5 text-gray-400 bg-gray-800/40" />
                    {showCropper && rawImg && (
                      <div className="mt-3">
                        <ImageCropper src={rawImg} onCrop={blob => { setCroppedBlob(blob); setCroppedUrl(URL.createObjectURL(blob)); setShowCropper(false); }} />
                      </div>
                    )}
                    {croppedUrl && !showCropper && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                        <img src={croppedUrl} className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500" />
                        <div>
                          <p className="text-xs text-green-400 font-semibold">✅ برش تأیید شد</p>
                          <button type="button" onClick={() => setShowCropper(true)} className="text-xs text-blue-400 underline mt-0.5">ویرایش</button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Logo */}
                  <div>
                    <label className={lbl}>لوگوی شرکت</label>
                    <input name="logo" type="file" accept="image/*" onChange={handleLogoFile}
                      className="w-full text-sm file:ml-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 file:font-medium hover:file:bg-gray-600 cursor-pointer border border-gray-700 rounded-xl p-1.5 text-gray-400 bg-gray-800/40 mb-3" />
                    
                    <label className={lbl}>اندازه لوگو ({form.logoSize || 72}px)</label>
                    <input type="range" name="logoSize" min="30" max="150" value={form.logoSize || 72} onChange={(e) => setForm(f => ({ ...f, logoSize: e.target.value }))} className="w-full accent-blue-500 mb-3" />

                    <label className={lbl}>موقعیت عمودی ({form.logoMarginTop != null ? form.logoMarginTop : 20}px)</label>
                    <input type="range" name="logoMarginTop" min="0" max="100" value={form.logoMarginTop != null ? form.logoMarginTop : 20} onChange={(e) => setForm(f => ({ ...f, logoMarginTop: e.target.value }))} className="w-full accent-blue-500 mb-3" />

                    {logoUrl && <div className="mt-2 p-3 bg-gray-800 rounded-xl flex items-start justify-center" style={{ paddingTop: form.logoMarginTop != null ? Number(form.logoMarginTop) : 20, minHeight: 120 }}><img src={logoUrl} style={{ height: Number(form.logoSize) || 72, objectFit: 'contain' }} /></div>}
                  </div>
                </div>
              </div>

              {err && <div className="p-3 bg-red-900/40 border border-red-800 text-red-300 rounded-xl text-sm">{err}</div>}
              {saved && (
                <div className="p-4 bg-green-900/30 border border-green-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-green-400 font-bold text-sm"><CheckCircle2 className="w-4 h-4" />{saved}</div>
                  <p className="text-xs text-green-600">لینک کارت (۱ دقیقه دیگر آنلاین می‌شود):</p>
                  <a href={finalLink} target="_blank" className="flex items-center gap-1.5 font-mono text-sm text-blue-400 underline" dir="ltr">{finalLink} <ExternalLink className="w-3 h-3" /></a>
                </div>
              )}

              <button type="submit" disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition disabled:opacity-60 shadow-lg text-sm mt-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'در حال ارسال به گیت‌هاب...' : isEdit ? 'ذخیره تغییرات' : 'ساخت کارت و گرفتن لینک NFC'}
              </button>
            </form>
          </div>

          {/* PREVIEW */}
          <div className="w-full xl:w-[360px] shrink-0">
            <div className="sticky top-6">
              <p className="text-center text-sm font-semibold text-gray-400 mb-4">📱 پیش‌نمایش زنده</p>
              <div style={{ width: 340, height: 720, border: '12px solid #1a1a1a', borderRadius: 44, overflow: 'hidden', background: '#f2f2f2', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflowY: 'auto', margin: '0 auto' }}>
                <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ width: 100, height: 24, background: '#1a1a1a', borderRadius: '0 0 16px 16px' }} />
                </div>
                <div style={{ padding: '12px 8px 40px', display: 'flex', justifyContent: 'center' }}>
                  <CardPreview
                    data={form}
                    imagePreview={croppedUrl}
                    logoPreview={logoUrl}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 mt-3">تغییرات فوری اینجا نمایش داده می‌شوند</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
