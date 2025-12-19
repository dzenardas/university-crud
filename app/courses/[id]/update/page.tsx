"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./updateCourse.module.css"

export default function UpdateCoursePage({params}: {params: Promise<{id: string}>}) {
    const [title, setTitle] = useState("")
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [credits, setCredits] = useState("")
    const [semester, setSemester] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [courseId, setCourseId] = useState("")
    const router = useRouter()

    useEffect(() => {
        async function fetchCourse() {
            const {id} = await params
            setCourseId(id)
            const res = await fetch(`/api/courses/${id}`)
            
            if (res.ok) {
                const data = await res.json()
                setTitle(data.course.title)
                setCode(data.course.code)
                setDescription(data.course.description || "")
                setCredits(data.course.credits.toString())
                setSemester(data.course.semester)
            } else {
                setError("Failed to load course")
            }
            setLoading(false)
        }

        fetchCourse()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        const res = await fetch(`/api/courses/${courseId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, code, description, credits, semester})
        })

        if (res.ok) {
            router.push(`/courses/${courseId}`)
        } else {
            setError("Failed to update course")
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Edit Course</h1>

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
                </form>

                <div className={styles.actions}>
                    <button type="submit" onClick={handleSubmit} className={styles.button}>Update Course</button>
                    <Link href={`/courses/${courseId}`} className={styles.link}>Cancel</Link>
                </div>
            </div>
        </div>
    )
}