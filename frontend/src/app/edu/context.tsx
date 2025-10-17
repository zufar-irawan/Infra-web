"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
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
    schedules: any[] | null;
    rooms: any[] | null;
    classes: any[] | null;
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
    schedules: null,
    rooms: null,
    classes: null,
};

const EduDataContext = createContext<EduData>(defaultEduData);
export const useEduData = () => useContext(EduDataContext);

export default EduDataContext;
