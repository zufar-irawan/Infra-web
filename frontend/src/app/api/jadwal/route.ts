import { cookies } from 'next/headers';
import api from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('secure-auth-token')?.value;

  try {
    const res = await api.get('/lms/schedules', {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      }
    });

    if (res.status === 200) {
      return NextResponse.json(res.data);
    }

    return NextResponse.json({ error: 'Unexpected status from upstream' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.response?.data || error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value;

    try {
        const body = await req.json();

        const res = await api.post('/lms/schedules', body, {
            headers : {
                Authorization: `Bearer ${token}`,
            }
        })

        if (res.status < 300) {
            return NextResponse.json(res.data);
        }
    } catch (e:any) {
        return NextResponse.json(
            { error: e?.response?.data || e?.message || String(e) },
            { status: 500 }
        )
    }
}