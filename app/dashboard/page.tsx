import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import styles from "./dashboard.module.css";
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/login")
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (!currentUser) {
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
            <Link href="/courses/new" className={styles.createButton}>Create new course</Link>

            {courses.length === 0 ? (
                <p>No courses yet. Create your first course!</p>
            ) : (
                <ul>
                    {courses.map((course) => (
                        <li key={course.id}>
                            <Link href={`/courses/${course.id}`}>
                                <strong>{course.code}</strong> - {course.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}