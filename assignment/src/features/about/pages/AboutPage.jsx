import { TrophyOutlined, SafetyCertificateOutlined, TeamOutlined, HeartOutlined } from '@ant-design/icons';

const stats = [
    { value: '150+', label: 'Giống Lan Quý' },
    { value: '2.500+', label: 'Thành Viên Đam Mê' },
    { value: '99,8%', label: 'Tỷ Lệ Hài Lòng' },
    { value: '8', label: 'Năm Kinh Nghiệm' },
];

const values = [
    {
        icon: <SafetyCertificateOutlined />,
        title: '100% Chuẩn Giống & Đột Biến Thật',
        text: 'Mỗi cây lan đều có nguồn gốc lai tạo hoặc xuất xứ rừng rõ ràng, bảo hành chuẩn mặt hoa đến khi nở.',
    },
    {
        icon: <HeartOutlined />,
        title: 'Tư Vấn Chăm Sóc Trọn Đời',
        text: 'Đội ngũ kỹ thuật viên sẵn sàng hướng dẫn cách ghép giá thể, điều chỉnh ánh sáng và phòng trừ nấm bệnh.',
    },
    {
        icon: <TeamOutlined />,
        title: 'Sàn Giao Lưu Ký Gửi Minh Bạch',
        text: 'Tạo sân chơi cho các nghệ nhân và nhà vườn ký gửi, đăng bán hoa lan an toàn với hệ thống đánh giá thật từ người mua.',
    },
    {
        icon: <TrophyOutlined />,
        title: 'Vườn Lan Đạt Tiêu Chuẩn',
        text: 'Hệ thống nhà màng kiểm soát vi khí hậu hiện đại, đảm bảo cây con phát triển khỏe mạnh trước khi xuất vườn.',
    },
];

const AboutPage = () => {
    return (
        <div className="space-y-6">
            {/* Banner giới thiệu */}
            <section className="relative overflow-hidden rounded-lg border border-gold-400/20 bg-linear-to-br from-ink-900 via-ink-950 to-gold-950 px-6 py-10 text-center shadow-2xl shadow-black/60 md:px-12">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)', backgroundSize: '28px 28px' }}
                />
                <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l border-t border-gold-400/60" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b border-r border-gold-400/60" />

                <div className="relative">
                    <span className="mb-4 inline-block rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-gold-200">
                        Về Chúng Tôi
                    </span>
                    <h1 className="text-gold mb-3 font-brand text-3xl font-bold tracking-wider md:text-5xl">Orchid Paradise</h1>
                    <div className="gold-rule mx-auto mb-4 w-40" />
                    <p className="mx-auto max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
                        Nơi hội tụ những tinh hoa hoa lan quý hiếm của Việt Nam và thế giới. Chúng tôi kết nối cộng đồng yêu lan,
                        bảo tồn các giống lan rừng quý bản địa và lan đột biến độc đáo.
                    </p>
                </div>
            </section>

            {/* Số liệu ấn tượng */}
            <div className="grid grid-cols-2 divide-gold-400/15 overflow-hidden rounded-lg border border-gold-400/20 bg-ink-900 sm:grid-cols-4 sm:divide-x">
                {stats.map((stat) => (
                    <div key={stat.label} className="px-4 py-5 text-center">
                        <p className="text-gold font-display text-3xl font-bold">{stat.value}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Giá trị cốt lõi */}
            <section className="space-y-4">
                <div className="text-center">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Giá trị cốt lõi</p>
                    <h2 className="font-display text-2xl font-bold text-stone-50">Giá Trị Cốt Lõi Của Chúng Tôi</h2>
                    <p className="mt-1 text-sm text-stone-400">Cam kết chất lượng và sự tận tâm cho từng nhành hoa</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {values.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-start gap-4 rounded-lg border border-white/8 bg-ink-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/5"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-xl text-gold-400">
                                {item.icon}
                            </span>
                            <div>
                                <h3 className="mb-1 font-display text-lg font-semibold text-gold-100">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-stone-400">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
