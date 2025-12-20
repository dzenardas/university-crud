"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton({className}: {className?: string}) {
    async function handleLogout() {
        await signOut({callbackUrl: "/login"})
    }

    return (
        <button onClick={handleLogout} className={className}>
            Logout
        </button>
    )
}