import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            )
        }

        const {title, code, description, credits, semester} = await request.json()
    
        const course = await prisma.course.create({
            data: {
                title,
                code,
                description,
                credits: parseInt(credits),
                semester,
                professorId: user.id
            }
        })

        return NextResponse.json(
            {message: "Course created successfully.", course},
            {status: 201}
        )
    } catch (error) {
        console.error("Course creation error:", error)
        
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}