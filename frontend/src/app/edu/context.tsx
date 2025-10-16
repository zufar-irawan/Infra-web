"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../lib/api";

export type EduUser = any;
export type EduStudent = any;
export type EduTeacher = any;
export type EduTugas = any[] | null;
export type EduTeachers = any[] | null;
export type EduStudents = any[] | null;
export type EduSubjects = any[] | null;
export type EduExamsPayload = {
  totalExams?: number | null;
  completedExams?: number | null;
  uncompletedExams?: any[] | null;
  selesaiExams?: any[] | null;
  exams?: any[] | null;
} | null;
export type EduNilaiPayload = {
  nilaiMapel: any | null;
  ringkasanNilai: any | null;
} | null;

export type EduData = {
  user: EduUser | null;
  student: EduStudent | null;
  teacher: EduTeacher | null;
  students: EduStudents;
  teachers: EduTeachers;
  tugas: EduTugas;
  subjects: EduSubjects;
  exams: EduExamsPayload;
  nilai: EduNilaiPayload;
};

const defaultEduData: EduData = {
  user: null,
  student: null,
  teacher: null,
  students: null,
  teachers: null,
  tugas: null,
  subjects: null,
  exams: null,
  nilai: null,
};

const extractArray = (res: any): any[] => {
  if (!res || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data; // Laravel paginate
  return [];
};

const EduDataContext = createContext<EduData>(defaultEduData);
export const useEduData = () => useContext(EduDataContext);

export const EduProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<EduData>(defaultEduData);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        // ambil data user login
        const me = await api.get(`/lms/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = me.data;
        let student = null;
        let teacher = null;

        // ambil detail sesuai role
        if (user.role === "siswa") {
          const res = await api.get(`/lms/students/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          student = res.data;
        }

        if (user.role === "guru") {
          const res = await api.get(`/lms/teachers/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          teacher = res.data;
        }

        // ambil data global (admin/guru)
        let [studentsRes, teachersRes, tugasRes, examsRes] = [null, null, null, null];

        if (["admin", "guru"].includes(user.role)) {
          [studentsRes, teachersRes, tugasRes, examsRes] = await Promise.all([
            api.get('/lms/students', { headers: { Authorization: `Bearer ${token}` } }),
            api.get('/lms/teachers', { headers: { Authorization: `Bearer ${token}` } }),
            api.get('/lms/assignments', { headers: { Authorization: `Bearer ${token}` } }),
            api.get('/lms/exams', { headers: { Authorization: `Bearer ${token}` } }),
          ]);
        }

        // update context data
        setData({
        user,
        student,
        teacher,
        students: Array.isArray(studentsRes?.data)
          ? studentsRes.data
          : studentsRes?.data?.data || [],
        teachers: Array.isArray(teachersRes?.data)
          ? teachersRes.data
          : teachersRes?.data?.data || [],
        tugas: Array.isArray(tugasRes?.data)
          ? tugasRes.data
          : tugasRes?.data?.data || [],
        subjects: null,
        exams: Array.isArray(examsRes?.data)
          ? examsRes.data
          : examsRes?.data?.data || [],
        nilai: null,
      });
      } catch (error) {
        console.error("Gagal fetch data LMS:", error);
      }
    };

    fetchAll();
  }, []);

  return <EduDataContext.Provider value={data}>{children}</EduDataContext.Provider>;
};
export default EduDataContext;
