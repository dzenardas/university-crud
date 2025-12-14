"use client"

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { signIn } from "next-auth/react";


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError("Invalid email or password")
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <button type="submit">Login</button>
            </form>
                
            <p>Don't have an account? <Link href="/register">Register</Link></p>
        </div>
    )
}