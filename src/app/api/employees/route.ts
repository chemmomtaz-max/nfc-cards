import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUser = process.env.GITHUB_USERNAME;
    const githubRepo = process.env.GITHUB_REPO;

    const url = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/public/data.json`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${githubToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return NextResponse.json({});
    const file = await res.json();
    const decoded = Buffer.from(file.content, 'base64').toString('utf-8');
    return NextResponse.json(JSON.parse(decoded));
  } catch {
    return NextResponse.json({});
  }
}
