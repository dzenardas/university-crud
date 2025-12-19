import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const courses = await prisma.course.findMany({
        where: {
            professorId: session.user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user.name}!</p>

            <h2>Your Courses ({courses.length})</h2>

            {courses.length === 0 ? (
                <p>No courses yet. Create your first course!</p>
            ) : (
                <ul>
                    {courses.map((course) => (
                        <li key={course.id}>
                            <strong>{course.code}</strong> - {course.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}