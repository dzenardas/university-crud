import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const {email, password, name} = await request.json()

        const existsUser = await prisma.user.findUnique({
            where: {email},
        })

        if (existsUser) {
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return NextResponse.json(
            {message: "User created successfully", userId: user.id},
            {status: 201}
        )
    } catch (error) {
        console.error("Registration error:", error)
        
        return NextResponse.json(
        {error: "Something went wrong"},
        {status: 500}
    )
    }
}