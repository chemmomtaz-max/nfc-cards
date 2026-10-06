import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

function getEmployeeData(id: string) {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    if (!fs.existsSync(dataPath)) return null;
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);
    return data[id] || null;
  } catch (e) {
    return null;
  }
}

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getEmployeeData(id);

  if (!user) {
    notFound();
  }

  const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${user.name}\nORG:${user.company}\nTITLE:${user.title}\nTEL;TYPE=WORK,VOICE:${user.phone || ''}\nEMAIL;TYPE=PREF,INTERNET:${user.email || ''}\nURL:${user.website || ''}\nEND:VCARD`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-12 px-4 font-sans">
      <div className="w-full max-w-[380px] flex flex-col">
        
        {/* Main Card Container */}
        <div className="w-full rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          
          {/* Top dark blue section */}
          <div className="bg-[#000066] h-[220px] flex justify-center items-start pt-10">
            {user.logo && (
              <img src={user.logo} alt="Logo" className="h-[75px] object-contain" />
            )}
          </div>
          
          {/* Bottom light blue section */}
          <div className="bg-gradient-to-b from-[#4a6bf6] to-[#6a5ced] pt-[95px] pb-6 px-6 text-center relative">
            
            {/* Profile Picture */}
            <div className="absolute -top-[75px] left-1/2 -translate-x-1/2 w-[150px] h-[150px] rounded-full border-[5px] border-white overflow-hidden bg-white flex items-center justify-center shadow-sm">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 text-sm">No Image</div>
              )}
            </div>

            {/* Texts */}
            <h2 className="text-[20px] font-black text-black uppercase mb-0 tracking-tight" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>{user.company}</h2>
            <h1 className="text-[22px] font-black text-black uppercase tracking-[0.1em] mb-1" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>{user.name}</h1>
            <h3 className="text-[16px] font-semibold text-black uppercase mb-6">{user.title}</h3>

            {/* Social Icons */}
            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {user.whatsapp && (
                <a href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {user.telegram && (
                <a href={user.telegram} target="_blank" className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="fab fa-telegram-plane"></i>
                </a>
              )}
              {user.email && (
                <a href={`mailto:${user.email}`} className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="far fa-envelope"></i>
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram} target="_blank" className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {/* Added Facebook and Tiktok to match image exactly */}
              {user.facebook && (
                <a href={user.facebook} target="_blank" className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
              {/* Tiktok icon */}
              {user.tiktok && (
                <a href={user.tiktok} target="_blank" className="w-[42px] h-[42px] rounded-xl border border-black text-black flex items-center justify-center hover:bg-black/10 transition text-[22px]">
                  <i className="fab fa-tiktok"></i>
                </a>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col gap-3 px-1">
              {user.website && (
                <a href={user.website} target="_blank" className="w-full bg-gradient-to-b from-[#f6f6f6] to-[#cfcfcf] text-black font-black uppercase py-[10px] rounded-[10px] shadow-sm text-[18px]" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
                  WEBSITE
                </a>
              )}
              <a href="#" className="w-full bg-gradient-to-b from-[#f6f6f6] to-[#cfcfcf] text-black font-black uppercase py-[10px] rounded-[10px] shadow-sm text-[18px]" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
                ABOUT
              </a>
              <a href="#" className="w-full bg-gradient-to-b from-[#f6f6f6] to-[#cfcfcf] text-black font-black uppercase py-[10px] rounded-[10px] shadow-sm text-[18px]" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
                PROFILE
              </a>
            </div>
          </div>
        </div>

        {/* External Buttons */}
        <div className="mt-6 flex flex-col items-center gap-3 w-full px-2">
          <a 
            href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`} 
            download={`${user.name.replace(/\s+/g, '_')}.vcf`}
            className="w-full bg-[#e3e3e3] hover:bg-[#d4d4d4] text-black font-black py-2.5 rounded-xl text-center shadow-sm text-[17px]"
          >
            Add to Contact
          </a>
          <a 
            href="#"
            className="w-[220px] bg-[#e3e3e3] hover:bg-[#d4d4d4] text-black font-black py-2.5 rounded-xl text-center shadow-sm text-[17px]"
          >
            Products
          </a>
        </div>

      </div>
    </div>
  );
}
