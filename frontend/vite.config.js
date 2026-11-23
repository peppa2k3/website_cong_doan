// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';

// // export default defineConfig({
// //   plugins: [react()],
// //   server: {
// //     host: true,
// //     port: 8000,
// //     proxy: {
// //       '/api': {
// //         target: process.env.VITE_API_PROXY || 'http://localhost:5000',
// //         changeOrigin: true,
// //       },
// //       '/uploads': {
// //         target: process.env.VITE_API_PROXY || 'http://localhost:5000',
// //         changeOrigin: true,
// //       },
// //     },
// //   },
// //   preview: {
// //     host: true,
// //     port: 8000,
// //   },
// // });
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 8443,

//     allowedHosts: [
//       'cdcs.billion.com.vn'
//     ],
//   // server: {
//   //   host: true,
//   //   port: 8443,
//     proxy: {
//       '/api': {
//         target: process.env.VITE_API_PROXY || 'http://localhost:5000',
//         changeOrigin: true,
//       },
//       '/uploads': {
//         target: process.env.VITE_API_PROXY || 'http://localhost:5000',
//         changeOrigin: true,
//       },
//     },
//   },
//   preview: {
//     host: true,
//     port: 8443,
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8443,

    allowedHosts: [
      'cdcs.billion.com.vn'
    ],
  // server: {
  //   host: true,
  //   port: 8443,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_API_PROXY || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 8443,
  },
});