import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { getCurrentUserForAPI } from "@/lib/authHelper"

export async function POST(request: Request) {
    try {
        const user = await getCurrentUserForAPI()

        if (!user) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
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