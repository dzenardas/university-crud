import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import styles from "./readCourse.module.css"

export default async function CourseDetailPage({params}: {params: {id: string}}) {
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

    const course = await prisma.course.findUnique({
        where: {
            id: params.id
        }
    })

    if (!course) {
        return <div className={styles.container}>
            <p>Course not found</p>
            <Link href="/dashboard" className={styles.backLink}>Back to Dashboard</Link>
        </div>
    }

    if (course.professorId !== currentUser.id) {
        return <div className={styles.container}>
            <p className={styles.error}>Unauthorized - This is not your course</p>
            <Link href="/dashboard" className={styles.backLink}>Back to Dashboard</Link>
        </div>
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{course.title}</h1>
            
            <div className={styles.infoSection}>
                <p><strong>Course Code:</strong> {course.code}</p>
            </div>

            <div className={styles.infoSection}>
                <p><strong>Credits:</strong> {course.credits}</p>
            </div>

            <div className={styles.infoSection}>
                <p><strong>Semester:</strong> {course.semester}</p>
            </div>

            <div>
                <strong>Description:</strong>
                <p>{course.description}</p>
            </div>
        

            <div className={styles.actions}>
                <Link href={`/courses/${course.id}/edit`} className={styles.editLink}>
                    Edit Course
                </Link>
                <Link href="/dashboard" className={styles.backLink}>
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}