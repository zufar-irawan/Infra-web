"use client";

import { createContext, useContext } from "react";

export type EduUser = any;
export type EduStudent = any;
export type EduTugas = any[] | null;
export type EduTeachers = any[] | null;
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
  tugas: EduTugas;
  teachers: EduTeachers;
  subjects: EduSubjects;
  exams: EduExamsPayload;
  nilai: EduNilaiPayload;
};

const defaultEduData: EduData = {
  user: null,
  student: null,
  tugas: null,
  teachers: null,
  subjects: null,
  exams: null,
  nilai: null,
};

const EduDataContext = createContext<EduData>(defaultEduData);

export const useEduData = () => useContext(EduDataContext);

export default EduDataContext;
