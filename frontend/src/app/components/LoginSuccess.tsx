import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';

// Komponen Login Success Content
const LoginSuccessContent = () => {
    return (
        <div className="flex gap-6 p-6">
            {/* Left Side - Image */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-2xl font-bold text-white">Welcome Back!</h3>
                </div>
            </div>

            {/* Right Side - Features */}
            <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Berhasil</h2>
                <p className="text-slate-600 mb-6">Akses fitur terbaru Anda</p>

                <div className="space-y-4">
                    {/* Feature 1 */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">Dashboard Realtime</h4>
                            <p className="text-xs text-slate-600">Pantau aktivitas secara langsung</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">Analitik Canggih</h4>
                            <p className="text-xs text-slate-600">Laporan detail performa Anda</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">Kontrol Penuh</h4>
                            <p className="text-xs text-slate-600">Kelola semua pengaturan Anda</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Function untuk show alert dengan React component
export const showLoginSuccessAlert = () => {
    // Create container div
    const container = document.createElement('div');

    Swal.fire({
        html: container,
        showConfirmButton: true,
        confirmButtonText: 'Mulai Sekarang',
        confirmButtonColor: '#ea580c',
        width: '800px',
        showCloseButton: true,
        customClass: {
            popup: 'rounded-3xl',
            confirmButton: 'px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all',
        },
        buttonsStyling: true,
        didOpen: () => {
            // Render React component ke dalam container
            const root = createRoot(container);
            root.render(<LoginSuccessContent />);
        },
    });
};