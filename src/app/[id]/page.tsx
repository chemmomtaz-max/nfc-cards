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
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[400px] flex flex-col gap-4">
        
        {/* Main Card */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-lg relative">
          
          <div className="bg-gradient-to-b from-[#000033] to-[#000080] h-[190px] flex justify-center items-start pt-6">
            {user.logo && (
              <img src={user.logo} alt="Logo" className="h-[70px] object-contain" />
            )}
          </div>
          
          <div className="bg-gradient-to-b from-[#4f8aff] to-[#5d5cff] pt-[85px] pb-8 px-6 text-center relative rounded-b-[24px]">
            
            <div className="absolute -top-[65px] left-1/2 -translate-x-1/2 w-[130px] h-[130px] rounded-full border-[4px] border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 text-sm">No Image</div>
              )}
            </div>

            <h2 className="text-lg font-black text-black uppercase mb-1">{user.company}</h2>
            <h1 className="text-2xl font-black text-black uppercase tracking-wide mb-1">{user.name}</h1>
            <h3 className="text-base font-bold text-gray-800 uppercase mb-6">{user.title}</h3>

            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {user.whatsapp && (
                <a href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="w-10 h-10 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center hover:bg-black/10 transition text-xl">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {user.telegram && (
                <a href={user.telegram} target="_blank" className="w-10 h-10 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center hover:bg-black/10 transition text-xl">
                  <i className="fab fa-telegram-plane"></i>
                </a>
              )}
              {user.email && (
                <a href={`mailto:${user.email}`} className="w-10 h-10 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center hover:bg-black/10 transition text-xl">
                  <i className="far fa-envelope"></i>
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram} target="_blank" className="w-10 h-10 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center hover:bg-black/10 transition text-xl">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" className="w-10 h-10 rounded-xl border-[1.5px] border-black text-black flex items-center justify-center hover:bg-black/10 transition text-xl">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {user.website && (
                <a href={user.website} target="_blank" className="w-full bg-[#e5e7eb] hover:bg-[#d1d5db] text-black font-black uppercase py-3 rounded-xl shadow-sm">
                  WEBSITE
                </a>
              )}
              <a href="#" className="w-full bg-[#e5e7eb] hover:bg-[#d1d5db] text-black font-black uppercase py-3 rounded-xl shadow-sm">
                ABOUT
              </a>
              <a href="#" className="w-full bg-[#e5e7eb] hover:bg-[#d1d5db] text-black font-black uppercase py-3 rounded-xl shadow-sm">
                PROFILE
              </a>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-3 px-2">
          <a 
            href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`} 
            download={`${user.name.replace(/\s+/g, '_')}.vcf`}
            className="w-full bg-[#e5e7eb] hover:bg-gray-300 text-black font-black py-3 rounded-xl text-center shadow-sm uppercase"
          >
            Add to Contact
          </a>
        </div>
      </div>
    </div>
  );
}
