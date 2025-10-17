// noinspection TypeScriptUMDGlobal,JSIgnoredPromiseFromCall

"use client"

import React, {useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LoadingProvider, { useLoading } from "@/components/LoadingProvider";
import axios from "axios";
import EduDataContext, { EduData } from "@/app/edu/context";

function EduLayoutContent({children}: {children?: React.ReactNode}) {
    const pathname = usePathname()
    const isLogin = pathname.includes("/login")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { isLoading } = useLoading()

    // Central data states
    const [user, setUser] = useState<any>(null)
    const [student, setStudent] = useState<any>(null)
    const [students, setStudents] = useState<any[] | null>(null)
    const [tugas, setTugas] = useState<any[] | null>(null)
    const [teachers, setTeachers] = useState<any[] | null>(null)
    const [teacher, setTeacher] = useState<any | null>(null)
    const [subjects, setSubjects] = useState<any[] | null>(null)
    const [exams, setExams] = useState<any | null>(null)
    const [nilai, setNilai] = useState<{ nilaiMapel: any | null; ringkasanNilai: any | null } | null>(null)
    const [schedules, setSchedules] = useState<any[] | null>(null)
    const [rooms, setRooms] = useState<any[] | null>(null)
    const [classes, setClasses] = useState<any[] | null>(null)

    const [bootstrapped, setBootstrapped] = useState(false)

    // Fetch helpers
    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/me')
            setUser(res.data.user)
            return res.data.user ?? null
        } catch (err) {
            console.error(err)
            setUser(null)
            return null
        }
    }

    const fetchStudent = async (me: any) => {
        if (!me) return null
        try {
            const res = await axios.get('/api/student')
            const studentPayload = res.data?.data ?? res.data
            const studentList = Array.isArray(studentPayload) ? studentPayload : (studentPayload?.data ?? [])

            if(me.role === 'siswa') {
                const studentMe = studentList.find((s:any) => (s.userId ?? s.user_id) === me?.id)
                setStudent(studentMe || null)
                // also cache list for potential teacher views, safe for siswa as well
                setStudents(studentList || null)
                return studentMe || null
            } else {
                // for guru/admin, expose the list and clear single student
                setStudent(null)
                setStudents(studentList || null)
                return studentList || null
            }
        } catch (err) {
            console.error(err)
            setStudent(null)
            setStudents(null)
            return null
        }
    }

    const fetchTeacher = async (me: any) => {
        if (!me) return null

        await axios.get('/api/teachers')
            .then (res => {
                const teacherPayload = res.data?.data ?? res.data
                const teacherList = Array.isArray(teacherPayload) ? teacherPayload : (teacherPayload?.data ?? [])
                const teacherMe = teacherList.find((t:any) => (t.userId ?? t.user_id) === me?.id)
                setTeacher(teacherMe || null)
                return teacherMe || null
            })
            .catch(err => {
                console.error(err)
                setTeacher(null)
                return null
            })
    }

    const fetchCoreData = async (studentMe: any, user: any) => {
        try {
            // Parallel fetches that don't depend on each other
            const promises: Promise<any>[] = [
                axios.get('/api/tugas').catch(() => ({ data: { data: [] }})),
                axios.get('/api/teachers').catch(() => ({ data: { data: [] }})),
                axios.get('/api/exam-card').catch(() => ({ data: {} })),
                axios.get('/api/subject').catch(() => ({ data: { data: [] }})),
                axios.get('/api/jadwal').catch(() => ({ data: { data: [] }})),
                axios.get('/api/rooms').catch(() => ({ data: { data: [] }})),
                axios.get('/api/classes').catch(() => ({ data: { data: [] }})),
            ]

            // Fetch nilai only if the logged-in user is a student and has an id
            let sid: any = undefined
            if (user?.role === 'siswa') {
                const s = Array.isArray(studentMe) ? null : studentMe
                sid = s?.id ?? s?.student_id
                if (sid) {
                    promises.push(
                        axios.get('/api/nilai', { params: { student_id: sid } }).catch(() => ({ data: {} }))
                    )
                }
            }

            const results = await Promise.all(promises)

            // Map results
            const [tugasRes, teachersRes, examsRes, subjectsRes, scheduleRes, roomRes, classRes, nilaiRes] = results
            setTugas(tugasRes?.data?.data ?? null)
            setTeachers(teachersRes?.data?.data ?? null)
            setExams(examsRes?.data ?? null)
            setSubjects(subjectsRes?.data?.data ?? null)
            setSchedules(scheduleRes?.data?.data ?? null)
            setRooms(roomRes?.data?.data ?? null)
            setClasses(classRes?.data?.data ?? null)

            if (user?.role === 'siswa' && sid) {
                setNilai({
                    nilaiMapel: nilaiRes?.data?.nilai_mapel ?? null,
                    ringkasanNilai: nilaiRes?.data?.ringkasan ?? null,
                })
            } else {
                setNilai(null)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const handleToggleSidebar = () => {
            setSidebarOpen(prev => !prev)
        }

        window.addEventListener('toggleSidebar', handleToggleSidebar)

        // Bootstrap once
        if (!bootstrapped && !isLogin) {
            (async () => {
                await fetchUser()
            })()
            setBootstrapped(true)
        }

        return () => {
            window.removeEventListener('toggleSidebar', handleToggleSidebar)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, bootstrapped])

    useEffect(() => {
        // After user fetched, fetch student, then other data
        if (!user || isLogin) return
        (async () => {
            const stu = await fetchStudent(user)
            await fetchTeacher(user)
            await fetchCoreData(stu, user)
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isLogin])

    // Listen for login events (same-tab via CustomEvent and cross-tab via storage)
    useEffect(() => {
        const handleAuthEvent = async () => {
            try {
                // Re-fetch user and downstream data right away
                const me = await fetchUser()
                if (me) {
                    const stu = await fetchStudent(me)
                    await fetchTeacher(me)
                    await fetchCoreData(stu, me)
                }
            } catch (err) {
                console.error('Error refetching after auth event', err)
            }
        }

        const onCustomLogin = () => {
            handleAuthEvent()
        }

        const onStorage = (ev: StorageEvent) => {
            if (ev.key === 'edu:login') {
                handleAuthEvent()
            }
        }

        window.addEventListener('edu:login', onCustomLogin)
        window.addEventListener('storage', onStorage)

        return () => {
            window.removeEventListener('edu:login', onCustomLogin)
            window.removeEventListener('storage', onStorage)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // @ts-ignore
    const contextValue: EduData = useMemo(() => ({
        user,
        student,
        students,
        tugas,
        subjects,
        teacher,
        teachers,
        exams,
        nilai,
        schedules,
        rooms,
        classes,
    }), [user, student, students, tugas, subjects, teacher, teachers, exams, nilai, schedules, rooms, classes])

    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
            { !isLogin && !isLoading && (
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    user={user}
                />
            )}

            <div className="flex-col w-full">
                <EduDataContext.Provider value={contextValue}>
                    {children}
                </EduDataContext.Provider>
            </div>
        </div>
    )
}

export default function EduLayout(
    {children}: {children?: React.ReactNode}
) {
    return (
        <LoadingProvider>
            <EduLayoutContent>
                {children}
            </EduLayoutContent>
        </LoadingProvider>
    )
}