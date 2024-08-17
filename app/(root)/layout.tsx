import Navbar from '@/components/navbar'
import React, { ReactNode } from 'react'
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-option';
import NextTopLoader from 'nextjs-toploader';


export default async function Layout({ children }: Readonly<{
    children: ReactNode
}>) {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return redirect("/login")
    }

    return (
        <div>
            <Navbar user={JSON.parse(JSON.stringify(session.currentUser))} />
            {children}
        </div>
    )
}