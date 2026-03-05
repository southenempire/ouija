import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const { recipient_id, actor_id, actor_username, type, reference_id } = await req.json()

        if (!recipient_id || !actor_id || !actor_username || !type) {
            return NextResponse.json({ error: 'Missing required notification fields' }, { status: 400 })
        }

        // Do not notify if the user is interacting with themselves
        if (recipient_id === actor_id) {
            return NextResponse.json({ success: true, skipped: true })
        }

        const { data, error } = await supabase
            .from('notifications')
            .insert([
                {
                    recipient_id,
                    actor_id,
                    actor_username,
                    type,
                    reference_id
                }
            ])
            .select()

        if (error) {
            console.error('Supabase write error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Notification API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const recipient_id = searchParams.get('recipient_id')

    if (!recipient_id) {
        return NextResponse.json({ error: 'recipient_id is required' }, { status: 400 })
    }

    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', recipient_id)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, notifications: data })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
