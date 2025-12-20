"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteCourse } from "./deleteCourse"
import styles from "./deleteButton.module.css"

export default function DeleteButton({courseId, className}: {courseId: string, className: string}) {
    const router = useRouter()
    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        setShowConfirm(false)
        const success = await deleteCourse(courseId)

        if (success) {
            router.push("/dashboard")
        }
    }

    return (
        <>
            <button onClick={() => setShowConfirm(true)} className={className}>
                Delete Course
            </button>

            {showConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h3 className={styles.modalTitle}>Delete Course</h3>
                        <p className={styles.modalText}>
                            Are you sure you want to delete this course? This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}