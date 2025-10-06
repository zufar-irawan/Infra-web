import Swal from 'sweetalert2';

export const showLoginSuccessAlert = () => {
    Swal.fire({
        html: `
            <div style="display: flex; gap: 1.5rem; padding: 1.5rem;">
                <!-- Left Side - Image -->
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom right, #fb923c, #ea580c); border-radius: 1rem; padding: 2rem;">
                    <div style="text-align: center;">
                        <svg style="width: 6rem; height: 6rem; margin: 0 auto 1rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 style="font-size: 1.5rem; font-weight: bold; color: white; margin: 0;">Welcome Back!</h3>
                    </div>
                </div>

                <!-- Right Side - Features -->
                <div style="flex: 1; text-align: left;">
                    <h2 style="font-size: 1.5rem; font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">Login Berhasil</h2>
                    <p style="color: #64748b; margin-bottom: 1.5rem;">Akses fitur terbaru Anda</p>

                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <!-- Feature 1 -->
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: #eff6ff; border-radius: 0.5rem; border: 1px solid #dbeafe;">
                            <div style="width: 2rem; height: 2rem; background: #1e3a8a; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <svg style="width: 1.25rem; height: 1.25rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 style="font-weight: 600; color: #1e293b; font-size: 0.875rem; margin: 0 0 0.25rem 0;">Dashboard Realtime</h4>
                                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Pantau aktivitas secara langsung</p>
                            </div>
                        </div>

                        <!-- Feature 2 -->
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: #fff7ed; border-radius: 0.5rem; border: 1px solid #fed7aa;">
                            <div style="width: 2rem; height: 2rem; background: #f97316; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <svg style="width: 1.25rem; height: 1.25rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 style="font-weight: 600; color: #1e293b; font-size: 0.875rem; margin: 0 0 0.25rem 0;">Analitik Canggih</h4>
                                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Laporan detail performa Anda</p>
                            </div>
                        </div>

                        <!-- Feature 3 -->
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: #eff6ff; border-radius: 0.5rem; border: 1px solid #dbeafe;">
                            <div style="width: 2rem; height: 2rem; background: #1e3a8a; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <svg style="width: 1.25rem; height: 1.25rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 style="font-weight: 600; color: #1e293b; font-size: 0.875rem; margin: 0 0 0.25rem 0;">Kontrol Penuh</h4>
                                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Kelola semua pengaturan Anda</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Mulai Sekarang',
        confirmButtonColor: '#ea580c',
        width: '800px',
        showCloseButton: true,
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-custom-button',
        },
        didOpen: () => {
            // Tambahkan custom styles
            const style = document.createElement('style');
            style.innerHTML = `
                .swal-custom-popup {
                    border-radius: 1.5rem !important;
                }
                .swal-custom-button {
                    padding: 0.75rem 2rem !important;
                    border-radius: 1rem !important;
                    font-weight: 600 !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                    transition: all 0.3s !important;
                }
                .swal-custom-button:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
                    transform: translateY(-2px);
                }
            `;
            document.head.appendChild(style);
        }
    });
};