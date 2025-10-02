import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Users, BookOpen, FileText, Calendar, Plus, Eye, Edit } from 'lucide-react';

export function TeacherDashboard() {
  const classes = [
    { id: 1, name: 'XII IPA 1', subject: 'Matematika', students: 32, attendance: 28, nextClass: '2024-09-10 08:00' },
    { id: 2, name: 'XII IPA 2', subject: 'Matematika', students: 30, attendance: 29, nextClass: '2024-09-10 10:00' },
    { id: 3, name: 'XI IPA 1', subject: 'Matematika', students: 28, attendance: 26, nextClass: '2024-09-10 13:00' },
  ];

  const recentAssignments = [
    { id: 1, title: 'Tugas Integral', class: 'XII IPA 1', submitted: 25, total: 32, deadline: '2024-09-12' },
    { id: 2, title: 'Latihan Soal Limit', class: 'XII IPA 2', submitted: 28, total: 30, deadline: '2024-09-15' },
    { id: 3, title: 'Tugas Trigonometri', class: 'XI IPA 1', submitted: 20, total: 28, deadline: '2024-09-18' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Rapat Guru', date: '2024-09-12', time: '14:00' },
    { id: 2, title: 'Ujian Tengah Semester', date: '2024-09-25', time: '08:00' },
    { id: 3, title: 'Workshop Pembelajaran Digital', date: '2024-09-30', time: '13:00' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
          <p className="text-gray-600">Selamat datang, Bu Sarah!</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Buat Materi Baru
          </Button>
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
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">90</p>
                <p className="text-sm text-gray-600">Total Siswa</p>
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
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Tugas Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">83</p>
                <p className="text-sm text-gray-600">Kehadiran Rata-rata (%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kelas yang Diajar */}
        <Card>
          <CardHeader>
            <CardTitle>Kelas yang Diajar</CardTitle>
            <CardDescription>Overview kelas Anda hari ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {classes.map((cls) => (
              <div key={cls.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{cls.name} - {cls.subject}</h3>
                    <p className="text-sm text-gray-600">
                      {cls.students} siswa • Kehadiran: {cls.attendance}/{cls.students}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Kehadiran: {Math.round((cls.attendance / cls.students) * 100)}%</span>
                    <span className="text-gray-600">
                      Kelas berikutnya: {new Date(cls.nextClass).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <Progress value={(cls.attendance / cls.students) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tugas yang Diberikan */}
        <Card>
          <CardHeader>
            <CardTitle>Tugas Terbaru</CardTitle>
            <CardDescription>Status pengumpulan tugas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.class}</p>
                  </div>
                  <Button size="sm" variant="outline">Periksa</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Dikumpulkan: {assignment.submitted}/{assignment.total}
                    </span>
                    <span className="text-gray-600">
                      Deadline: {new Date(assignment.deadline).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
                  <div className="flex gap-2">
                    <Badge 
                      variant="secondary"
                      className={
                        assignment.submitted === assignment.total 
                          ? 'bg-green-100 text-green-800'
                          : assignment.submitted > assignment.total * 0.8
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {Math.round((assignment.submitted / assignment.total) * 100)}% terkumpul
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Jadwal Mendatang */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Mendatang</CardTitle>
          <CardDescription>Kegiatan dan acara yang akan datang</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString('id-ID')}
                    </span>
                    <span>Pukul {event.time}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Detail</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}