"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./newCourse.module.css"

export default function NewCoursePage() {
    const [title, setTitle] = useState("")
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [credits, setCredits] = useState("")
    const [semester, setSemester] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        const res = await fetch("/api/courses", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, code, description, credits, semester})
        })

        if (res.ok) {
            router.push("/dashboard")
        } else {
            setError("Failed to create course")
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.h2}>Create New Course</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Course Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Course Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Credits</label>
                        <input
                            type="number"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Semester</label>
                        <input
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            placeholder="e.g. Spring 2025"
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button}>Create Course</button>
                </form>
                
                <Link href="/dashboard" className={styles.link}>Cancel</Link>
            </div>
        </div>
    )
}