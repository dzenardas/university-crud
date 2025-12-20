export async function deleteCourse(courseId: string): Promise<boolean> {
    try {
        const res = await fetch(`/api/courses/${courseId}`, {
            method: "DELETE"
        })

        return res.ok
    } catch (error) {
        console.error("Delete error:", error)
        return false
    }
}