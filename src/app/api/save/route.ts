import { NextResponse } from 'next/server';

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

    // Helper to upload a file to GitHub
    const uploadToGitHub = async (path: string, content: string, isBase64: boolean = false) => {
      // 1. Get file SHA if it exists
      const fileUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${path}`;
      let sha = undefined;
      
      try {
        const getRes = await fetch(fileUrl, {
          headers: { Authorization: `Bearer ${githubToken}` }
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }
      } catch (e) {}

      // 2. Put file
      const putRes = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${path} for ${id}`,
          content: isBase64 ? content : Buffer.from(content).toString('base64'),
          sha,
          branch
        }),
      });

      if (!putRes.ok) {
        throw new Error(`Failed to upload ${path}`);
      }
    };

    // 1. Get current data.json from GitHub
    let currentData = {};
    const dataUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/public/data.json`;
    try {
      const res = await fetch(dataUrl, { headers: { Authorization: `Bearer ${githubToken}` } });
      if (res.ok) {
        const fileData = await res.json();
        const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
        currentData = JSON.parse(decoded);
      }
    } catch (e) {
      console.log('No existing data.json found, creating new one.');
    }

    // 2. Upload Image if present
    const imageFile = formData.get('image') as File;
    let imageUrl = (currentData as any)[id]?.image || '';
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split('.').pop() || 'jpg';
      const filename = `${id}_profile.${ext}`;
      const base64Content = buffer.toString('base64');
      await uploadToGitHub(`public/assets/${filename}`, base64Content, true);
      imageUrl = `/assets/${filename}`;
    }

    // 3. Upload Logo if present
    const logoFile = formData.get('logo') as File;
    let logoUrl = (currentData as any)[id]?.logo || '/assets/logo.png';
    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const ext = logoFile.name.split('.').pop() || 'png';
      const filename = `${id}_logo.${ext}`;
      const base64Content = buffer.toString('base64');
      await uploadToGitHub(`public/assets/${filename}`, base64Content, true);
      logoUrl = `/assets/${filename}`;
    }

    // 4. Update JSON
    (currentData as any)[id] = {
      id,
      name: formData.get('name') || '',
      company: formData.get('company') || '',
      title: formData.get('title') || '',
      phone: formData.get('phone') || '',
      email: formData.get('email') || '',
      website: formData.get('website') || '',
      whatsapp: formData.get('whatsapp') || '',
      telegram: formData.get('telegram') || '',
      instagram: formData.get('instagram') || '',
      linkedin: formData.get('linkedin') || '',
      image: imageUrl,
      logo: logoUrl,
    };

    await uploadToGitHub('public/data.json', JSON.stringify(currentData, null, 2), false);

    return NextResponse.json({ success: true, message: 'Card saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
