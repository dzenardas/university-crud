import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import styles from "./readCourse.module.css"
import DeleteButton from "./delete/deleteButton"

export default async function ReadCoursePage({params}: {params: Promise<{id: string}>}) {
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

    const {id} = await params

    const course = await prisma.course.findUnique({
        where: {
            id: id
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
            <div className={styles.wrapper}>
                <h1 className={styles.title}>{course.title}</h1>
                
                <div className={styles.infoRow}>
                    <strong>Course Code</strong>
                    <span>{course.code}</span>
                </div>

                <div className={styles.infoRow}>
                    <strong>Credits</strong>
                    <span>{course.credits}</span>
                </div>

                <div className={styles.infoRow}>
                    <strong>Semester</strong>
                    <span>{course.semester}</span>
                </div>

                {course.description && (
                    <div className={styles.description}>
                        <strong>Description</strong>
                        <p>{course.description}</p>
                    </div>
                )}

                <div className={styles.actions}>
                    <Link href={`/courses/${course.id}/update`} className={styles.editButton}>
                        Edit Course
                    </Link>
                    <DeleteButton courseId={course.id} className={styles.deleteButton} />
                    <Link href="/dashboard" className={styles.backLink}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}