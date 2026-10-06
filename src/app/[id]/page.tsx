import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

function getEmployeeData(id: string) {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    if (!fs.existsSync(dataPath)) return null;
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return data[id] || null;
  } catch { return null; }
}

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getEmployeeData(id);
  if (!user) notFound();

  const vcardData = [
    'BEGIN:VCARD','VERSION:3.0',
    `FN:${user.name}`,`ORG:${user.company}`,`TITLE:${user.title}`,
    `TEL;TYPE=WORK,VOICE:${user.phone||''}`,
    `EMAIL;TYPE=PREF,INTERNET:${user.email||''}`,
    `URL:${user.website||''}`,
    'END:VCARD'
  ].join('\n');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f2f2f2; font-family: 'Montserrat', Arial, sans-serif; }
        .page { min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 24px 16px 48px; }
        .wrap { width: 100%; max-width: 370px; display: flex; flex-direction: column; gap: 0; }

        /* ── MAIN CARD ── */
        .card { border-radius: 22px; overflow: hidden; box-shadow: 0 6px 32px rgba(0,0,0,0.18); }

        /* TOP NAVY */
        .card-top {
          background: linear-gradient(180deg, #00004d 0%, #0000aa 100%);
          height: 200px;
          display: flex; justify-content: center; align-items: flex-start;
          padding-top: 28px;
        }
        .logo { height: 72px; object-fit: contain; }
        .logo-placeholder {
          height: 72px; display:flex; align-items:center; justify-content:center;
          color: rgba(255,255,255,0.4); font-size:13px; border:1px dashed rgba(255,255,255,0.3);
          border-radius:8px; padding:8px 16px;
        }

        /* BOTTOM BLUE */
        .card-bottom {
          background: linear-gradient(175deg, #4a73f5 0%, #5b50f0 40%, #6644ee 100%);
          padding: 90px 20px 28px;
          text-align: center;
          position: relative;
        }

        /* PROFILE PIC */
        .avatar-wrap {
          position: absolute;
          top: -72px;
          left: 50%; transform: translateX(-50%);
          width: 144px; height: 144px;
          border-radius: 50%;
          border: 5px solid #fff;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .avatar-wrap img { width:100%; height:100%; object-fit:cover; }

        /* TEXTS */
        .company {
          font-size: 19px; font-weight: 900; color: #000; text-transform: uppercase;
          letter-spacing: 1px; margin-bottom: 1px;
        }
        .fullname {
          font-size: 21px; font-weight: 900; color: #000; text-transform: uppercase;
          letter-spacing: 2px; margin-bottom: 2px;
        }
        .jobtitle {
          font-size: 15px; font-weight: 700; color: #111; text-transform: uppercase;
          letter-spacing: 1px; margin-bottom: 22px;
        }

        /* SOCIAL ROW */
        .social-row {
          display: flex; justify-content: center; flex-wrap: wrap;
          gap: 7px; margin-bottom: 20px;
        }
        .social-btn {
          width: 42px; height: 42px;
          border: 1.5px solid #111; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #111; text-decoration: none; font-size: 20px;
          background: transparent; transition: background 0.15s;
        }
        .social-btn:hover { background: rgba(0,0,0,0.08); }

        /* ACTION BUTTONS */
        .action-btns { display: flex; flex-direction: column; gap: 10px; }
        .action-btn {
          display: block; width: 100%;
          background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%);
          border: 1px solid rgba(0,0,0,0.1);
          color: #000; text-decoration: none; font-weight: 900;
          font-size: 18px; letter-spacing: 2px;
          text-transform: uppercase; padding: 10px 0;
          border-radius: 10px; text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.12);
        }

        /* EXTERNAL BUTTONS */
        .ext-btns {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
          margin-top: 18px; padding: 0 8px;
        }
        .ext-btn-full {
          width: 100%;
          background: linear-gradient(180deg, #dedede 0%, #c5c5c5 100%);
          border: none; color: #000; font-weight: 700;
          font-size: 17px; padding: 12px 0;
          border-radius: 12px; text-align: center;
          text-decoration: none; cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .ext-btn-narrow {
          width: 220px;
          background: linear-gradient(180deg, #dedede 0%, #c5c5c5 100%);
          border: none; color: #000; font-weight: 700;
          font-size: 17px; padding: 12px 0;
          border-radius: 12px; text-align: center;
          text-decoration: none; cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="page">
        <div className="wrap">

          {/* ── MAIN CARD ── */}
          <div className="card">
            {/* TOP */}
            <div className="card-top">
              {user.logo
                ? <img src={user.logo} alt="Logo" className="logo" />
                : <div className="logo-placeholder">LOGO</div>}
            </div>

            {/* BOTTOM */}
            <div className="card-bottom">
              {/* Avatar */}
              <div className="avatar-wrap">
                {user.image
                  ? <img src={user.image} alt={user.name} />
                  : <div style={{width:'100%',height:'100%',background:'#ccc',display:'flex',alignItems:'center',justifyContent:'center',color:'#666',fontSize:'12px'}}>No Photo</div>}
              </div>

              <div className="company">{user.company}</div>
              <div className="fullname">{user.name}</div>
              <div className="jobtitle">{user.title}</div>

              {/* Social Icons */}
              <div className="social-row">
                {user.whatsapp && <a className="social-btn" href={`https://wa.me/${user.whatsapp.replace(/\D/g,'')}`} target="_blank"><i className="fab fa-whatsapp"/></a>}
                {user.telegram && <a className="social-btn" href={user.telegram} target="_blank"><i className="fab fa-telegram-plane"/></a>}
                {user.email    && <a className="social-btn" href={`mailto:${user.email}`}><i className="far fa-envelope"/></a>}
                {user.instagram&& <a className="social-btn" href={user.instagram} target="_blank"><i className="fab fa-instagram"/></a>}
                {user.facebook && <a className="social-btn" href={user.facebook} target="_blank"><i className="fab fa-facebook-f"/></a>}
                {user.linkedin && <a className="social-btn" href={user.linkedin} target="_blank"><i className="fab fa-linkedin-in"/></a>}
                {user.tiktok   && <a className="social-btn" href={user.tiktok} target="_blank"><i className="fab fa-tiktok"/></a>}
              </div>

              {/* Action Buttons */}
              <div className="action-btns">
                {user.website && <a className="action-btn" href={user.website} target="_blank">WEBSITE</a>}
                <a className="action-btn" href={user.about||'#'} target="_blank">ABOUT</a>
                <a className="action-btn" href={user.profile||'#'} target="_blank">PROFILE</a>
              </div>
            </div>
          </div>

          {/* ── EXTERNAL BUTTONS ── */}
          <div className="ext-btns">
            <a
              className="ext-btn-full"
              href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`}
              download={`${user.name.replace(/\s+/g,'_')}.vcf`}
            >Add to Contact</a>
            {user.products && <a className="ext-btn-narrow" href={user.products} target="_blank">Products</a>}
          </div>

        </div>
      </div>
    </>
  );
}
