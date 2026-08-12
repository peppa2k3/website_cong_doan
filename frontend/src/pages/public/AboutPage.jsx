import React from 'react';
import { HeartHandshake, Scale, Users, Trophy } from 'lucide-react';
import UnionSeal from '../../components/common/UnionSeal';

const FUNCTIONS = [
  { icon: HeartHandshake, title: 'Chăm lo đời sống', desc: 'Chăm lo đời sống vật chất, tinh thần cho đoàn viên, người lao động.' },
  { icon: Scale, title: 'Bảo vệ quyền lợi', desc: 'Đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của người lao động.' },
  { icon: Users, title: 'Xây dựng đoàn kết', desc: 'Tuyên truyền, vận động đoàn viên xây dựng khối đoàn kết, thi đua lao động sản xuất.' },
  { icon: Trophy, title: 'Giám sát, phản biện', desc: 'Tham gia quản lý, giám sát thực hiện chế độ chính sách với người lao động.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-sky-500 py-14">
        <div className="container-page flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
          {/* <UnionSeal size={120} spin={false} className="shrink-0 text-brass-400" /> */}
          <img src="/hhcd.svg" alt="My SVG Logo" width="225" height="150"></img>
          <div>
            <span className="eyebrow !text-brass-800">Giới thiệu</span>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-black">Công đoàn cơ sở</h1>
            <p className="mt-3 max-w-2xl text-ink-700">
              Tổ chức đại diện cho đoàn viên và người lao động, hoạt động vì mục tiêu chăm lo, bảo vệ quyền và lợi ích hợp pháp, chính đáng, xây dựng mối quan hệ lao động hài hoà, ổn định và tiến bộ.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-800">Quá trình hình thành</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Công đoàn cơ sở được thành lập nhằm tập hợp, đoàn kết đội ngũ cán bộ, nhân viên, người lao động trong đơn vị; là cầu nối giữa người lao động với Ban Lãnh đạo, góp phần xây dựng mối quan hệ lao động hài hoà và phát triển bền vững.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-800">Tầm nhìn & Sứ mệnh</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Trở thành tổ chức đại diện tin cậy, gần gũi và hiệu quả của người lao động; không ngừng đổi mới nội dung, phương thức hoạt động để đáp ứng tốt hơn nhu cầu, nguyện vọng chính đáng của đoàn viên.
            </p>
          </div>
        </div>

        <h2 className="mt-14 mb-6 text-center font-display text-xl font-bold text-ink-800">Chức năng, nhiệm vụ</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FUNCTIONS.map((f) => (
            <div key={f.title} className="card p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-union-50 text-union-600">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-display font-semibold text-ink-800">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
