import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getCurrentUserForAPI } from "@/lib/authHelper"

export async function GET(request: Request, {params}: {params: Promise<{id: string}>}) {
    try {
        const user = await getCurrentUserForAPI()

        if (!user) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const {id} = await params

        const course = await prisma.course.findUnique({
            where: {
                id: id
            }
        })

        if (!course) {
            return NextResponse.json(
                {error: "Course not found"},
                {status: 404}
            )
        }

        if (course.professorId !== user.id) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        return NextResponse.json(
            {course},
            {status: 200}
        )
    } catch (error) {
        console.error("Course fetch error:", error)
        
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
    try {
        const user = await getCurrentUserForAPI()

        if (!user) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const {id} = await params

        const course = await prisma.course.findUnique({
            where: {
                id: id
            }
        })

        if (!course) {
            return NextResponse.json(
                {error: "Course not found"},
                {status: 404}
            )
        }

        if (course.professorId !== user.id) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        await prisma.course.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json(
            {message: "Course deleted successfully."},
            {status: 200}
        )
    } catch (error) {
        console.error("Course delete error:", error)
        
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
    try {
        const user = await getCurrentUserForAPI()

        if (!user) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const {id} = await params

        const course = await prisma.course.findUnique({
            where: {
                id: id
            }
        })

        if (!course) {
            return NextResponse.json(
                {error: "Course not found"},
                {status: 404}
            )
        }

        if (course.professorId !== user.id) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const {title, code, description, credits, semester} = await request.json()

        const updatedCourse = await prisma.course.update({
            where: {
                id: id
            },
            data: {
                title,
                code,
                description,
                credits: parseInt(credits),
                semester
            }
        })

        return NextResponse.json(
            {message: "Course updated successfully.", course: updatedCourse},
            {status: 200}
        )
    } catch (error) {
        console.error("Course update error:", error)
        
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}