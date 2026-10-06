import { NextResponse } from 'next/server';

export const maxDuration = 60; // extend Vercel timeout to 60s

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const githubUser = process.env.GITHUB_USERNAME;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubUser || !githubRepo) {
      return NextResponse.json({ error: 'GitHub credentials are not configured in .env' }, { status: 500 });
    }

    const branch = 'main';

    // Helper: get file SHA without throwing
    const getSHA = async (path: string): Promise<string | undefined> => {
      const res = await fetch(
        `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${path}`,
        { headers: { Authorization: `Bearer ${githubToken}` } }
      );
      if (!res.ok) return undefined;
      const data = await res.json();
      return data.sha;
    };

    // Helper: upload file to GitHub (parallel SHA fetch + PUT)
    const uploadToGitHub = async (path: string, content: string, isBase64: boolean = false) => {
      const sha = await getSHA(path);
      const putRes = await fetch(
        `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update ${path} for ${id}`,
            content: isBase64 ? content : Buffer.from(content).toString('base64'),
            sha,
            branch,
          }),
        }
      );
      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub upload failed for ${path}: ${putRes.status} - ${errText}`);
      }
    };

    // 1. Get current data.json — and SHA — in one call
    let currentData: Record<string, any> = {};
    let dataJsonSHA: string | undefined;
    const dataUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/public/data.json`;
    try {
      const res = await fetch(dataUrl, { headers: { Authorization: `Bearer ${githubToken}` } });
      if (res.ok) {
        const fileData = await res.json();
        dataJsonSHA = fileData.sha;
        currentData = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
      }
    } catch {
      console.log('No existing data.json, creating new one.');
    }

    // 2. Upload image, logo, custom file IN PARALLEL
    const existing = currentData[id] || {};

    const imageFile = formData.get('image') as File | null;
    const logoFile  = formData.get('logo')  as File | null;
    const customFile= formData.get('customBtnFile') as File | null;

    let imageUrl     = existing.image      || '';
    let logoUrl      = existing.logo       || '';
    let customFileUrl= existing.customFileUrl || '';

    const uploads: Promise<void>[] = [];

    if (imageFile && imageFile.size > 0) {
      uploads.push((async () => {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const filename = `${id}_profile.${ext}`;
        const b64 = Buffer.from(await imageFile.arrayBuffer()).toString('base64');
        await uploadToGitHub(`public/assets/${filename}`, b64, true);
        imageUrl = `/assets/${filename}`;
      })());
    }

    if (logoFile && logoFile.size > 0) {
      uploads.push((async () => {
        const ext = logoFile.name.split('.').pop() || 'png';
        const filename = `${id}_logo.${ext}`;
        const b64 = Buffer.from(await logoFile.arrayBuffer()).toString('base64');
        await uploadToGitHub(`public/assets/${filename}`, b64, true);
        logoUrl = `/assets/${filename}`;
      })());
    }

    if (customFile && customFile.size > 0) {
      uploads.push((async () => {
        const ext = customFile.name.split('.').pop() || 'pdf';
        const filename = `${id}_file.${ext}`;
        const b64 = Buffer.from(await customFile.arrayBuffer()).toString('base64');
        await uploadToGitHub(`public/assets/${filename}`, b64, true);
        customFileUrl = `/assets/${filename}`;
      })());
    }

    // Run all file uploads in parallel
    await Promise.all(uploads);

    // 3. Build new record
    currentData[id] = {
      id,
      name:          formData.get('name')          || '',
      company:       formData.get('company')        || '',
      title:         formData.get('title')          || '',
      phone:         formData.get('phone')          || '',
      email:         formData.get('email')          || '',
      website:       formData.get('website')        || '',
      whatsapp:      formData.get('whatsapp')       || '',
      telegram:      formData.get('telegram')       || '',
      instagram:     formData.get('instagram')      || '',
      facebook:      formData.get('facebook')       || '',
      linkedin:      formData.get('linkedin')       || '',
      tiktok:        formData.get('tiktok')         || '',
      productsUrl:   formData.get('productsUrl')    || '',
      aboutUrl:      formData.get('aboutUrl')       || '',
      customBtnLabel:formData.get('customBtnLabel') || 'PROFILE',
      customBtnType: formData.get('customBtnType')  || 'link',
      customBtnLink: formData.get('customBtnLink')  || '',
      customBtnText: formData.get('customBtnText')  || '',
      customFileUrl,
      logoSize:      formData.get('logoSize')       || 72,
      logoMarginTop: formData.get('logoMarginTop')  || 20,
      image:         imageUrl,
      logo:          logoUrl,
    };

    // 4. Save data.json (reuse known SHA for speed — no extra GET needed)
    const dataContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');
    const putData = await fetch(dataUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Update data.json for ${id}`,
        content: dataContent,
        sha: dataJsonSHA,
        branch,
      }),
    });

    if (!putData.ok) {
      const errText = await putData.text();
      throw new Error(`Failed to save data.json: ${putData.status} - ${errText}`);
    }

    return NextResponse.json({ success: true, message: 'Card saved successfully!' });
  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
