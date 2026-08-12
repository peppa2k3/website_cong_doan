/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Đỏ Cờ" - đỏ chủ đạo, mang tinh thần Công đoàn nhưng trầm hơn màu cờ để giữ vẻ trang trọng
        union: {
          50: '#FBEAEA',
          100: '#F3C9CA',
          200: '#E39A9C',
          300: '#D06B6E',
          400: '#BE474A',
          500: '#B4232C', // primary
          600: '#971C24',
          700: '#7A171D',
          800: '#5D1216',
          900: '#420C10',
        },
        // "Xanh Mực" - nền đậm cho header/footer, chữ chính
        ink: {
          50: '#EEF0F4',
          100: '#D3D7E1',
          200: '#A6AEC2',
          300: '#7A85A4',
          400: '#4F5C85',
          500: '#333F63',
          600: '#28324F',
          700: '#1C2438', // primary dark
          800: '#141A29',
          900: '#0D111B',
        },
        // "Vàng Đồng" - điểm nhấn, huy hiệu, trạng thái nổi bật
        brass: {
          50: '#FBF5E9',
          100: '#F2E1BC',
          200: '#E5C784',
          300: '#D3AC5C',
          400: '#C29C4A',
          500: '#B4893A', // primary
          600: '#93702F',
          700: '#725725',
        },
        paper: '#FBF9F4', // nền giấy ngà
        line: '#E6E1D3', // viền nhạt
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'sans-serif'],
        body: ['"Noto Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 36, 56, 0.06), 0 4px 16px rgba(28, 36, 56, 0.06)',
        lift: '0 8px 24px rgba(28, 36, 56, 0.12)',
      },
      backgroundImage: {
        'seal-grid': 'radial-gradient(circle, rgba(180,35,44,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
