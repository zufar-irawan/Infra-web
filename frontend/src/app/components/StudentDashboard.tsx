import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, Clock, FileText, Award, Calendar, PlayCircle } from 'lucide-react';

export function StudentDashboard() {
  const enrolledClasses = [
    { id: 1, name: 'Matematika XII IPA 1', teacher: 'Bu Sarah', progress: 75, nextClass: '2024-09-10 08:00' },
    { id: 2, name: 'Fisika XII IPA 1', teacher: 'Pak Budi', progress: 60, nextClass: '2024-09-10 09:30' },
    { id: 3, name: 'Kimia XII IPA 1', teacher: 'Bu Rina', progress: 85, nextClass: '2024-09-10 11:00' },
  ];

  const assignments = [
    { id: 1, title: 'Tugas Integral', subject: 'Matematika', dueDate: '2024-09-12', status: 'pending' },
    { id: 2, title: 'Laporan Praktikum Gerak', subject: 'Fisika', dueDate: '2024-09-15', status: 'submitted' },
    { id: 3, title: 'Analisis Reaksi Kimia', subject: 'Kimia', dueDate: '2024-09-18', status: 'pending' },
  ];

  const upcomingExams = [
    { id: 1, title: 'Ujian Tengah Semester Matematika', date: '2024-09-25', time: '08:00 - 10:00' },
    { id: 2, title: 'Ujian Praktikum Fisika', date: '2024-09-27', time: '10:00 - 12:00' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Siswa</h1>
          <p className="text-gray-600">Selamat datang kembali, Maya!</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            XII IPA 1
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Kelas Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Tugas Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Ujian Mendatang</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">85.2</p>
                <p className="text-sm text-gray-600">Rata-rata Nilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kelas Terdaftar */}
        <Card>
          <CardHeader>
            <CardTitle>Kelas Terdaftar</CardTitle>
            <CardDescription>Progress pembelajaran Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledClasses.map((cls) => (
              <div key={cls.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{cls.name}</h3>
                    <p className="text-sm text-gray-600">{cls.teacher}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Mulai
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {cls.progress}%</span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      Kelas berikutnya: {new Date(cls.nextClass).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <Progress value={cls.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tugas */}
        <Card>
          <CardHeader>
            <CardTitle>Tugas Terbaru</CardTitle>
            <CardDescription>Tugas yang perlu dikerjakan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.subject}</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={assignment.status === 'submitted' ? 'default' : 'secondary'}
                    className={assignment.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {assignment.status === 'submitted' ? 'Dikumpulkan' : 'Belum'}
                  </Badge>
                  {assignment.status === 'pending' && (
                    <Button size="sm">Kerjakan</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Jadwal Ujian */}
      <Card>
        <CardHeader>
          <CardTitle>Ujian Mendatang</CardTitle>
          <CardDescription>Persiapkan diri untuk ujian berikut</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg border-orange-200 bg-orange-50">
                <div className="space-y-1">
                  <h3 className="font-medium">{exam.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(exam.date).toLocaleDateString('id-ID')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exam.time}
                    </span>
                  </div>
                </div>
                <Button variant="outline">Persiapan</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}