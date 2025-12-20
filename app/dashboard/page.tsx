import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import styles from "./dashboard.module.css"
import { prisma } from "@/lib/prisma"
import LogoutButton from "./components/logoutButton"
import { getCurrentUser } from "@/lib/authHelper"

export default async function DashboardPage() {
    const currentUser = await getCurrentUser()

    const courses = await prisma.course.findMany({
        where: {
            professorId: currentUser.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.welcome}>Welcome back, {currentUser.name}!</p>
                </div>
                <LogoutButton className={styles.logoutButton} />
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Your Courses ({courses.length})</h2>
                    <Link href="/courses/create" className={styles.createButton}>
                        + Create New Course
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No courses yet. Create your first course to get started!</p>
                        <Link href="/courses/create" className={styles.createButton}>
                            Create Your First Course
                        </Link>
                    </div>
                ) : (
                    <ul className={styles.courseList}>
                        {courses.map((course) => (
                            <li key={course.id} className={styles.courseItem}>
                                <Link href={`/courses/${course.id}`} className={styles.courseLink}>
                                    <div className={styles.courseCode}>{course.code}</div>
                                    <div className={styles.courseTitle}>{course.title}</div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}