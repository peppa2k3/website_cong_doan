import React from 'react';
import { HeartHandshake, Scale, Users, Trophy, Target, History, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import UnionSeal from '../../components/common/UnionSeal';

const FUNCTIONS = [
  { 
    icon: HeartHandshake, 
    title: 'Chăm lo đời sống', 
    desc: 'Chăm lo đời sống vật chất, tinh thần, tổ chức thăm hỏi, hỗ trợ đoàn viên khó khăn.',
    color: 'from-amber-500 to-orange-500'
  },
  { 
    icon: Scale, 
    title: 'Bảo vệ quyền lợi', 
    desc: 'Đại diện thương lượng thỏa ước lao động, bảo vệ quyền lợi hợp pháp, chính đáng.',
    color: 'from-sky-500 to-blue-600'
  },
  { 
    icon: Users, 
    title: 'Xây dựng đoàn kết', 
    desc: 'Tuyên truyền, vận động, tổ chức các phong trào thi đua lao động giỏi, lao động sáng tạo.',
    color: 'from-emerald-400 to-teal-500'
  },
  { 
    icon: Trophy, 
    title: 'Giám sát, phản biện', 
    desc: 'Tham gia quản lý, giám sát thực hiện chế độ chính sách, an toàn vệ sinh lao động.',
    color: 'from-indigo-500 to-sky-600'
  },
];

const HIGHLIGHTS = [
  'Đại diện & Bảo vệ quyền, lợi ích hợp pháp',
  'Môi trường làm việc an toàn, văn minh',
  'Hoạt động văn hóa, thể thao sôi nổi',
  'Hỗ trợ & Đồng hành cùng người lao động'
];

export default function AboutPage() {
  return (
    <div className="bg-sky-50/60 font-sans text-slate-800">
      
      {/* 1. HERO BANNER: Tone Xanh Da Trời Tươi Sáng + Kính Mờ */}
      <section className="relative min-h-[420px] overflow-hidden bg-sky-600 py-16 text-white">

        {/* Ảnh nền thực tế phủ gradient mờ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')` }}
        />

        {/* Lớp Gradient phủ màu xanh */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600/90" />

        {/* === BỔ SUNG: HỌA TIẾT LOGO CÔNG ĐOÀN CHÌM Ở BÊN PHẢI (GIỐNG HÌNH 3) === */}
        <div className="absolute right-0 top-0 w-[650px] h-full overflow-hidden pointer-events-none select-none">
            {/* 1. Ảnh nền */}
            <img 
                src="/company__3_.jpg" 
                alt="Logo Billion VN" 
                className="w-full h-full object-cover object-center"
            />

            {/* 2. Lớp mờ gradient hòa trộn từ xanh sang ảnh */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0284c7] via-[#0284c7]/60 to-transparent" />
        </div>

        <div className="container-page relative mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            
            {/* Cột trái: Văn bản & Thẻ chỉ số Kính Mờ */}
            <div className="space-y-5 lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/60 bg-yellow-400/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-200 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Cổng thông tin chính thức</span>
              </div>
              
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                {/* Chữ màu Đỏ Đô + Hiệu ứng bóng sáng mịn làm đệm nền */}
                <span className="text-[#801B24] filter drop-shadow-[0_1px_8px_rgba(255,255,255,0.8)]">
                  CÔNG ĐOÀN CƠ SỞ
                </span> 
                <br />
                <span className="text-amber-300 drop-shadow-md">
                  CÔNG TY BILLION VN
                </span>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-sky-100 sm:text-base">
                Mái nhà chung ấm áp của người lao động — Nơi kết nối, bảo vệ quyền, lợi ích chính đáng và đồng hành cùng sự phát triển bền vững của doanh nghiệp.
              </p>

              {/* Thẻ Kính Mờ */}
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur-md shadow-lg">
                  <div className="text-xl font-extrabold text-yellow-300 sm:text-2xl">100%</div>
                  <div className="text-xs text-sky-100">Bảo vệ quyền, lợi ích hợp pháp</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur-md shadow-lg">
                  <div className="text-xl font-extrabold text-yellow-300 sm:text-2xl">24/7</div>
                  <div className="text-xs text-sky-100">Lắng nghe & Hỗ trợ</div>
                </div>
                <div className="col-span-2 rounded-xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur-md shadow-lg sm:col-span-1">
                  <div className="text-xl font-extrabold text-yellow-300 sm:text-2xl">Đoàn kết</div>
                  <div className="text-xs text-sky-100">Phát triển bền vững</div>
                </div>
              </div>
            </div>



            {/* Cột phải: Logo nổi bật hiệu ứng Glow
            <div className="flex justify-center lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-300 via-sky-200 to-blue-400 opacity-70 blur-2xl transition duration-500 group-hover:opacity-100"></div>
                
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/30 bg-white/20 p-6 backdrop-blur-xl shadow-2xl sm:h-64 sm:w-64">
                  <img 
                    src="/hhcd.svg" 
                    alt="Huy hiệu Công đoàn" 
                    className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105" 
                  />
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* 2. KHỐI QUÁ TRÌNH HÌNH THÀNH & TẦM NHÌN */}
      <section className="container-page mx-auto -mt-8 px-4 relative z-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div className="group rounded-2xl border border-sky-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3 border-b border-sky-50 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Quá trình hình thành</h2>
                <p className="text-xs text-sky-600 font-medium">Lịch sử & Phát triển</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Công đoàn cơ sở BILLION được thành lập nhằm tập hợp, đoàn kết đội ngũ người lao động; đóng vai trò làm cầu nối vững chắc giữa người lao động và Ban Giám đốc, đảm bảo mối quan hệ lao động hài hòa, tiến bộ và ổn định.
            </p>
          </div>

          <div className="group rounded-2xl border border-sky-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3 border-b border-sky-50 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow-md shadow-red-500/20">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Tầm nhìn & Sứ mệnh</h2>
                <p className="text-xs text-red-500 font-medium">Mục tiêu chiến lược</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Xây dựng tổ chức Công đoàn hiện đại, vững mạnh, lấy đoàn viên làm trung tâm. Không ngừng đổi mới phương thức hoạt động để đại diện, chăm lo thiết thực và bảo vệ quyền, lợi ích chính đáng cho toàn thể công nhân viên.
            </p>
          </div>
        </div>
      </section>

      {/* 3. KHỐI BANNER CHIẾN LƯỢC: Tone Xanh Da Trời Đậm */}
      <section className="container-page mx-auto mt-12 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 to-blue-700 p-8 text-white shadow-xl sm:p-10">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl"></div>
          
          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow">
                <ShieldCheck className="h-4 w-4" /> Cam kết hành động
              </div>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                Vì lợi ích hợp pháp & Đời sống tốt đẹp cho Đoàn viên
              </h3>
              <p className="text-sm text-sky-100 leading-relaxed">
                Chúng tôi luôn sẵn sàng tiếp nhận, lắng nghe ý kiến phản ánh và đồng hành cùng bạn trong mọi tình huống tại doanh nghiệp.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {HIGHLIGHTS.map((text, idx) => (
                <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-white/15 p-3 text-xs font-medium backdrop-blur-md border border-white/20 text-white">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-yellow-300" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. KHỐI CHỨC NĂNG & NHIỆM VỤ */}
      <section className="container-page mx-auto mt-14 px-4 pb-16">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            Trọng tâm hoạt động
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Chức năng & Nhiệm vụ chính
          </h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-gradient-to-r from-sky-400 to-blue-600"></div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FUNCTIONS.map((f) => (
            <div 
              key={f.title} 
              className="group relative overflow-hidden rounded-2xl border border-sky-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-transparent"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${f.color}`}></div>
              
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}>
                <f.icon className="h-6 w-6" />
              </div>
              
              <h3 className="mt-5 font-display text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                {f.title}
              </h3>
              
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}


//đoạn code sửa

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//CODE GỐC
// const FUNCTIONS = [
//   { icon: HeartHandshake, title: 'Chăm lo đời sống', desc: 'Chăm lo đời sống vật chất, tinh thần cho đoàn viên, người lao động.' },
//   { icon: Scale, title: 'Bảo vệ quyền lợi', desc: 'Đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của người lao động.' },
//   { icon: Users, title: 'Xây dựng đoàn kết', desc: 'Tuyên truyền, vận động đoàn viên xây dựng khối đoàn kết, thi đua lao động sản xuất.' },
//   { icon: Trophy, title: 'Giám sát, phản biện', desc: 'Tham gia quản lý, giám sát thực hiện chế độ chính sách với người lao động.' },
// ];

// export default function AboutPage() {
//   return (
//     <div>
//       <section className="bg-sky-500 py-14">
//         <div className="container-page flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
//           {/* <UnionSeal size={120} spin={false} className="shrink-0 text-brass-400" /> */}
//           <img src="/hhcd.svg" alt="My SVG Logo" width="225" height="150"></img>
//           <div>
//             <span className="eyebrow !text-brass-800">Giới thiệu</span>
//             <h1 className="mt-2 font-display text-3xl font-extrabold text-black">Công đoàn cơ sở</h1>
//             <p className="mt-3 max-w-2xl text-ink-700">
//               Tổ chức đại diện cho đoàn viên và người lao động, hoạt động vì mục tiêu chăm lo, bảo vệ quyền và lợi ích hợp pháp, chính đáng, xây dựng mối quan hệ lao động hài hoà, ổn định và tiến bộ.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="container-page py-12">
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
//           <div>
//             <h2 className="font-display text-xl font-bold text-ink-800">Quá trình hình thành</h2>
//             <p className="mt-3 leading-relaxed text-ink-600">
//               Công đoàn cơ sở được thành lập nhằm tập hợp, đoàn kết đội ngũ cán bộ, nhân viên, người lao động trong đơn vị; là cầu nối giữa người lao động với Ban Lãnh đạo, góp phần xây dựng mối quan hệ lao động hài hoà và phát triển bền vững.
//             </p>
//           </div>
//           <div>
//             <h2 className="font-display text-xl font-bold text-ink-800">Tầm nhìn & Sứ mệnh</h2>
//             <p className="mt-3 leading-relaxed text-ink-600">
//               Trở thành tổ chức đại diện tin cậy, gần gũi và hiệu quả của người lao động; không ngừng đổi mới nội dung, phương thức hoạt động để đáp ứng tốt hơn nhu cầu, nguyện vọng chính đáng của đoàn viên.
//             </p>
//           </div>
//         </div>

//         <h2 className="mt-14 mb-6 text-center font-display text-xl font-bold text-ink-800">Chức năng, nhiệm vụ</h2>
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           {FUNCTIONS.map((f) => (
//             <div key={f.title} className="card p-5 text-center">
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-union-50 text-union-600">
//                 <f.icon className="h-6 w-6" />
//               </div>
//               <h3 className="mt-3 font-display font-semibold text-ink-800">{f.title}</h3>
//               <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
