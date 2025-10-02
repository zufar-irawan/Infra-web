import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ChartContainer, ChartTooltip } from './ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, BookOpen, GraduationCap, Settings, TrendingUp, AlertCircle, UserPlus, FileText } from 'lucide-react';

export function AdminDashboard() {
  const stats = {
    totalStudents: 1245,
    totalTeachers: 67,
    totalClasses: 45,
    activeExams: 12
  };

  const monthlyData = [
    { month: 'Jan', students: 1100, teachers: 60 },
    { month: 'Feb', students: 1150, teachers: 62 },
    { month: 'Mar', students: 1180, teachers: 63 },
    { month: 'Apr', students: 1200, teachers: 65 },
    { month: 'May', students: 1220, teachers: 66 },
    { month: 'Jun', students: 1245, teachers: 67 },
  ];

  const subjectPerformance = [
    { subject: 'Matematika', average: 82 },
    { subject: 'Fisika', average: 78 },
    { subject: 'Kimia', average: 85 },
    { subject: 'Biologi', average: 80 },
    { subject: 'B. Indonesia', average: 88 },
  ];

  const recentActivities = [
    { id: 1, user: 'Bu Sarah', action: 'Membuat ujian baru', subject: 'Matematika', time: '2 jam lalu' },
    { id: 2, user: 'Pak Budi', action: 'Mengupload materi', subject: 'Fisika', time: '3 jam lalu' },
    { id: 3, user: 'Bu Rina', action: 'Menilai tugas', subject: 'Kimia', time: '5 jam lalu' },
    { id: 4, user: 'Maya Sari', action: 'Mengumpulkan tugas', subject: 'Matematika', time: '1 hari lalu' },
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Server backup dijadwalkan malam ini', time: '1 jam lalu' },
    { id: 2, type: 'info', message: '15 siswa baru terdaftar hari ini', time: '3 jam lalu' },
    { id: 3, type: 'warning', message: 'Kapasitas storage mencapai 85%', time: '6 jam lalu' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Kelola sistem pembelajaran sekolah</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Laporan
          </Button>
          <Button className="bg-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Siswa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                <p className="text-sm text-gray-600">Total Guru</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
                <p className="text-sm text-gray-600">Total Kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeExams}</p>
                <p className="text-sm text-gray-600">Ujian Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pertumbuhan Pengguna
            </CardTitle>
            <CardDescription>Statistik pertumbuhan siswa dan guru per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                students: {
                  label: 'Siswa',
                  color: '#ff6b35',
                },
                teachers: {
                  label: 'Guru',
                  color: '#1e3a8a',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="var(--color-students)" 
                    strokeWidth={2}
                    name="Siswa"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="teachers" 
                    stroke="var(--color-teachers)" 
                    strokeWidth={2}
                    name="Guru"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performa Mata Pelajaran</CardTitle>
            <CardDescription>Rata-rata nilai per mata pelajaran</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                average: {
                  label: 'Rata-rata',
                  color: '#ffd23f',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="average" fill="var(--color-average)" name="Rata-rata Nilai" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas pengguna dalam sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.subject}
                    </Badge>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Lihat Semua Aktivitas
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Notifikasi Sistem
            </CardTitle>
            <CardDescription>Peringatan dan informasi penting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-blue-400 bg-blue-50'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-600">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Kelola Notifikasi
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Fungsi administrasi yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <UserPlus className="w-6 h-6" />
              <span className="text-sm">Tambah Siswa</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm">Tambah Guru</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Buat Kelas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="w-6 h-6" />
              <span className="text-sm">Pengaturan</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}