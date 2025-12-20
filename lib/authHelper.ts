import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
    const session = await auth()
    
    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { 
            email: session.user.email 
        }
    })

    if (!user) {
        redirect("/login")
    }

    return user
}

export async function getCurrentUserForAPI() {
    const session = await auth()
    
    if (!session?.user?.email) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { 
            email: session.user.email 
        }
    })

    return user
}