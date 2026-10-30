import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    animate,
    createAnimatable,
    createDrawable,
    createScope,
    createTimeline,
    onScroll,
    splitText,
    stagger,
    utils,
} from 'animejs';
import {
    ArrowRightOutlined,
    CrownFilled,
    StarFilled,
    SafetyCertificateOutlined,
    HeartOutlined,
    TeamOutlined,
    SearchOutlined,
    EditOutlined,
    GiftOutlined,
} from '@ant-design/icons';
import orchidService from '../../orchids/services/orchidService';
import { BrandLogo } from '../../../components/common/Navbar';

export const LANDING_SEEN_KEY = 'orchidLandingSeen';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hạt bụi vàng: vị trí cố định (tính 1 lần) để render luôn ổn định
const PARTICLES = Array.from({ length: 36 }, (_, i) => {
    const seed = Math.sin(i * 9301 + 49297) * 233280;
    const r = seed - Math.floor(seed);
    const seed2 = Math.sin(i * 1531 + 7) * 10000;
    const r2 = seed2 - Math.floor(seed2);
    return { left: `${(r * 100).toFixed(2)}%`, top: `${(r2 * 100).toFixed(2)}%`, size: 1 + Math.round(r * 3) };
});

const VARIETIES = ['Phi Điệp', 'Hoàng Thảo', 'Hồ Điệp', 'Cattleya', 'Vanda', 'Lan Hài', 'Dendrobium', 'Cymbidium', 'Oncidium', 'Kim Điệp'];

const FEATURES = [
    { icon: <CrownFilled />, title: 'Tuyển chọn quý hiếm', text: 'Những giống lan rừng, lan đột biến được tuyển chọn khắt khe từ các nghệ nhân hàng đầu.' },
    { icon: <StarFilled />, title: 'Đánh giá thật', text: 'Mỗi thành viên một đánh giá cho mỗi cây lan — minh bạch, đáng tin cậy.' },
    { icon: <HeartOutlined />, title: 'Chăm sóc tận tâm', text: 'Tư vấn kỹ thuật trọn đời: giá thể, ánh sáng, độ ẩm và phòng bệnh.' },
    { icon: <SafetyCertificateOutlined />, title: 'Chuẩn giống cam kết', text: 'Nguồn gốc rõ ràng, bảo hành mặt hoa, đóng gói chuyên dụng khi vận chuyển.' },
];

const STATS = [
    { value: 150, suffix: '+', label: 'Giống lan quý', decimals: 0 },
    { value: 2500, suffix: '+', label: 'Thành viên', decimals: 0 },
    { value: 99.8, suffix: '%', label: 'Hài lòng', decimals: 1 },
    { value: 8, suffix: '', label: 'Năm kinh nghiệm', decimals: 0 },
];

const STEPS = [
    { icon: <SearchOutlined />, title: 'Khám phá', text: 'Tìm kiếm & lọc theo danh mục trong bộ sưu tập tuyển chọn.' },
    { icon: <EditOutlined />, title: 'Đánh giá', text: 'Đăng nhập Google, chấm sao và chia sẻ cảm nhận của bạn.' },
    { icon: <GiftOutlined />, title: 'Sưu tầm', text: 'Chọn cho mình những nhành lan quý phái nhất để chăm sóc.' },
];

const formatStat = (value, decimals) =>
    Number(value).toLocaleString('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Hoa lan vẽ bằng nét vàng (các path có class lp-draw sẽ được "vẽ" bằng AnimeJS)
const OrchidArt = () => (
    <svg viewBox="0 0 400 400" className="lp-orchid h-full w-full overflow-visible" aria-hidden="true">
        <defs>
            <linearGradient id="lpStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5ebc8" />
                <stop offset="45%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#977722" />
            </linearGradient>
            <radialGradient id="lpFill" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.02" />
            </radialGradient>
            <radialGradient id="lpCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbf7ea" />
                <stop offset="100%" stopColor="#d4af37" />
            </radialGradient>
        </defs>

        {/* Vòng tròn huyền bí */}
        <g className="lp-ring" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="200" cy="190" r="178" fill="none" stroke="#d4af37" strokeOpacity="0.25" strokeDasharray="2 10" />
            {Array.from({ length: 12 }).map((_, i) => (
                <circle
                    key={i}
                    cx={200 + 178 * Math.cos((i * Math.PI) / 6)}
                    cy={190 + 178 * Math.sin((i * Math.PI) / 6)}
                    r="2.5"
                    fill="#d4af37"
                    fillOpacity="0.6"
                />
            ))}
        </g>
        <g className="lp-ring-reverse" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="200" cy="190" r="152" fill="none" stroke="#d4af37" strokeOpacity="0.18" strokeDasharray="40 14 4 14" />
        </g>

        <g fill="url(#lpFill)" stroke="url(#lpStroke)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Đài trên */}
            <path className="lp-draw" d="M200 185 C 180 150, 176 95, 200 50 C 224 95, 220 150, 200 185 Z" />
            {/* Cánh hoa hai bên */}
            <path className="lp-draw" d="M195 188 C 158 168, 96 146, 58 170 C 78 208, 150 214, 195 194 Z" />
            <path className="lp-draw" d="M205 188 C 242 168, 304 146, 342 170 C 322 208, 250 214, 205 194 Z" />
            {/* Đài dưới */}
            <path className="lp-draw" d="M196 198 C 176 228, 140 268, 108 300 C 150 298, 188 252, 201 202 Z" />
            <path className="lp-draw" d="M204 198 C 224 228, 260 268, 292 300 C 250 298, 212 252, 199 202 Z" />
            {/* Cánh môi */}
            <path className="lp-draw" d="M200 196 C 176 212, 168 250, 186 274 C 192 282, 208 282, 214 274 C 232 250, 224 212, 200 196 Z" />
        </g>

        <g fill="none" stroke="url(#lpStroke)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8">
            {/* Gân cánh */}
            <path className="lp-draw" d="M200 176 L200 72" />
            <path className="lp-draw" d="M190 186 Q 130 170 76 172" />
            <path className="lp-draw" d="M210 186 Q 270 170 324 172" />
            <path className="lp-draw" d="M198 206 Q 165 250 124 292" />
            <path className="lp-draw" d="M202 206 Q 235 250 276 292" />
            <path className="lp-draw" d="M200 208 L200 262" />
            <path className="lp-draw" d="M188 230 Q 200 242 212 230" />
            {/* Cành & lá */}
            <path className="lp-draw" strokeWidth="1.6" d="M204 280 C 206 318, 222 352, 246 398" />
            <path className="lp-draw" strokeWidth="1.4" d="M240 396 C 276 362, 330 350, 376 360 C 334 382, 286 396, 240 396" />
            <path className="lp-draw" strokeWidth="1.4" d="M236 398 C 196 372, 124 362, 66 378 C 118 394, 182 400, 236 398" />
        </g>

        {/* Nhuỵ hoa */}
        <circle className="lp-core" cx="200" cy="192" r="7" fill="url(#lpCore)" />
    </svg>
);

const SectionHeading = ({ eyebrow, title, text }) => (
    <div className="lp-reveal mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold text-stone-50 md:text-4xl">{title}</h2>
        <div className="gold-rule mx-auto my-4 w-32" />
        {text && <p className="text-sm leading-relaxed text-stone-400 md:text-base">{text}</p>}
    </div>
);

const LandingPage = () => {
    const root = useRef(null);
    const scope = useRef(null);
    const showcaseRef = useRef(null);
    const [orchids, setOrchids] = useState([]);

    // Đánh dấu đã xem trang giới thiệu (lần sau vào trang chủ sẽ không tự chuyển hướng nữa)
    useEffect(() => {
        localStorage.setItem(LANDING_SEEN_KEY, '1');
        orchidService
            .getAll()
            .then((data) => {
                const list = Array.isArray(data) ? data : [];
                const featured = [...list].sort((a, b) => Number(Boolean(b.isSpecial)) - Number(Boolean(a.isSpecial)));
                setOrchids(featured.slice(0, 3));
            })
            .catch((err) => console.error('Lỗi khi tải hoa lan nổi bật:', err));
    }, []);

    // ===== Hiệu ứng chính (AnimeJS v4) =====
    useLayoutEffect(() => {
        if (prefersReducedMotion()) return undefined;

        scope.current = createScope({ root }).add(() => {
            // --- Trạng thái ban đầu ---
            const split = splitText('.lp-title', { chars: { wrap: 'clip', class: 'lp-char' } });
            utils.set(['.lp-eyebrow', '.lp-hero-text', '.lp-hero-cta', '.lp-scroll-cue', '.lp-topbar'], { opacity: 0 });
            utils.set('.lp-hero-rule', { scaleX: 0 });
            utils.set('.lp-draw', { fillOpacity: 0 });
            const orchidStrokes = createDrawable('.lp-draw');
            const stepLine = createDrawable('.lp-step-line');
            utils.set([...orchidStrokes, ...stepLine], { draw: '0 0' });
            utils.set('.lp-core', { scale: 0 });
            utils.set(['.lp-reveal', '.lp-feature', '.lp-stat', '.lp-step'], { opacity: 0, translateY: 40 });

            // --- Hero: timeline mở màn ---
            createTimeline({ defaults: { ease: 'outExpo', duration: 1100 } })
                .add('.lp-topbar', { opacity: [0, 1], translateY: [-20, 0] }, 0)
                .add('.lp-eyebrow', { opacity: [0, 1], translateY: [20, 0] }, 150)
                .add(split.chars, { translateY: ['110%', '0%'], rotate: [12, 0], duration: 1200, delay: stagger(45) }, 250)
                .add('.lp-hero-rule', { scaleX: [0, 1], duration: 1400 }, 900)
                .add('.lp-hero-text', { opacity: [0, 1], translateY: [24, 0] }, 1000)
                .add('.lp-hero-cta', { opacity: [0, 1], translateY: [24, 0], delay: stagger(120) }, 1150)
                .add(orchidStrokes, { draw: ['0 0', '0 1'], duration: 2400, ease: 'inOutSine', delay: stagger(90) }, 200)
                .add('.lp-draw', { fillOpacity: [0, 1], duration: 1600, ease: 'outSine' }, 2200)
                .add('.lp-core', { scale: [0, 1], duration: 900, ease: 'outElastic(1, .5)' }, 2600)
                .add('.lp-scroll-cue', { opacity: [0, 1], duration: 800 }, 2600);

            // --- Vòng tròn huyền bí xoay chậm ---
            animate('.lp-ring', { rotate: 360, duration: 90000, ease: 'linear', loop: true });
            animate('.lp-ring-reverse', { rotate: -360, duration: 60000, ease: 'linear', loop: true });

            // --- Nhuỵ hoa phát sáng nhịp thở ---
            animate('.lp-glow', { scale: [0.9, 1.1], opacity: [0.45, 0.8], duration: 3200, ease: 'inOutSine', loop: true, alternate: true });

            // --- Bụi vàng bay lơ lửng ---
            animate('.lp-particle', {
                translateY: () => [0, utils.random(-160, -60)],
                translateX: () => [0, utils.random(-30, 30)],
                opacity: [{ to: () => utils.random(4, 9) / 10, duration: 1200 }, { to: 0, duration: 1800 }],
                duration: () => utils.random(3500, 7000),
                delay: () => utils.random(0, 4000),
                ease: 'inOutSine',
                loop: true,
            });

            // --- Chỉ báo cuộn ---
            animate('.lp-scroll-dot', { translateY: [0, 14], opacity: [1, 0], duration: 1600, ease: 'inOutSine', loop: true });

            // --- Dải tên các loài lan chạy ngang ---
            animate('.lp-marquee-track', { translateX: ['0%', '-50%'], duration: 45000, ease: 'linear', loop: true });

            // --- Parallax theo chuột cho hoa lan & quầng sáng ---
            const orchid = createAnimatable('.lp-orchid-wrap', { x: 1200, y: 1200, ease: 'out(3)' });
            const glow = createAnimatable('.lp-cursor-glow', { x: 600, y: 600, ease: 'out(2)' });
            const hero = root.current.querySelector('.lp-hero');
            const onMove = (e) => {
                const rect = hero.getBoundingClientRect();
                const dx = (e.clientX - rect.left) / rect.width - 0.5;
                const dy = (e.clientY - rect.top) / rect.height - 0.5;
                orchid.x(dx * -30);
                orchid.y(dy * -30);
                glow.x(e.clientX - rect.left - 200);
                glow.y(e.clientY - rect.top - 200);
            };
            hero.addEventListener('pointermove', onMove);

            // --- Hiện dần khi cuộn tới ---
            const revealOnScroll = (selector, extra = {}) =>
                root.current.querySelectorAll(selector).forEach((el, i) =>
                    animate(el, {
                        opacity: [0, 1],
                        translateY: [40, 0],
                        duration: 1000,
                        ease: 'outExpo',
                        delay: (extra.stagger || 0) * i,
                        autoplay: onScroll({ target: el, enter: '90% top', repeat: false }),
                    })
                );
            revealOnScroll('.lp-reveal');
            revealOnScroll('.lp-feature', { stagger: 120 });
            revealOnScroll('.lp-step', { stagger: 150 });

            // --- Icon tính năng xoay vào ---
            root.current.querySelectorAll('.lp-feature-icon').forEach((el) =>
                animate(el, {
                    rotate: [-90, 0],
                    scale: [0.4, 1],
                    duration: 1200,
                    ease: 'outElastic(1, .6)',
                    autoplay: onScroll({ target: el, enter: '90% top', repeat: false }),
                })
            );

            // --- Đếm số liệu ---
            root.current.querySelectorAll('.lp-stat').forEach((el, i) => {
                const numberEl = el.querySelector('.lp-stat-number');
                const { value, decimals } = STATS[i];
                const counter = { v: 0 };
                animate(el, {
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 900,
                    delay: i * 120,
                    ease: 'outExpo',
                    autoplay: onScroll({ target: el, enter: '90% top', repeat: false }),
                });
                animate(counter, {
                    v: value,
                    duration: 2200,
                    delay: i * 120,
                    ease: 'outExpo',
                    onUpdate: () => {
                        numberEl.textContent = formatStat(counter.v, decimals);
                    },
                    autoplay: onScroll({ target: el, enter: '90% top', repeat: false }),
                });
            });

            // --- Đường vàng nối các bước, vẽ theo thanh cuộn ---
            animate(stepLine, {
                draw: ['0 0', '0 1'],
                ease: 'linear',
                autoplay: onScroll({ target: '.lp-steps', enter: '85% top', leave: '45% bottom', sync: 0.4 }),
            });

            // --- Nút CTA cuối trang: vòng sáng lan toả ---
            animate('.lp-cta-pulse', { scale: [1, 1.35], opacity: [0.55, 0], duration: 2200, ease: 'outSine', loop: true });

            return () => {
                hero.removeEventListener('pointermove', onMove);
                split.revert();
            };
        });

        return () => scope.current?.revert();
    }, []);

    // ===== Hiệu ứng cho các thẻ hoa lan nổi bật (sau khi tải dữ liệu) =====
    useEffect(() => {
        if (!orchids.length || prefersReducedMotion() || !showcaseRef.current) return undefined;
        const cards = showcaseRef.current.querySelectorAll('.lp-show-card');
        utils.set(cards, { opacity: 0, translateY: 60, rotateX: 18 });
        const animation = animate(cards, {
            opacity: [0, 1],
            translateY: [60, 0],
            rotateX: [18, 0],
            duration: 1300,
            delay: stagger(160),
            ease: 'outExpo',
            autoplay: onScroll({ target: showcaseRef.current, enter: '85% top', repeat: false }),
        });
        return () => animation.revert();
    }, [orchids]);

    return (
        <div ref={root} className="min-h-screen overflow-x-hidden bg-ink-950 text-stone-200">
            {/* ================= HERO ================= */}
            <section className="lp-hero relative flex min-h-screen flex-col overflow-hidden">
                {/* Nền */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_40rem_at_70%_40%,rgba(212,175,55,0.12),transparent_70%)]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />
                <div className="lp-cursor-glow pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-gold-400/10 blur-3xl" />
                {PARTICLES.map((p, i) => (
                    <span
                        key={i}
                        className="lp-particle pointer-events-none absolute rounded-full bg-gold-300 opacity-0 shadow-[0_0_8px_rgba(226,194,95,0.9)]"
                        style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
                    />
                ))}

                {/* Thanh trên */}
                <div className="lp-topbar relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
                    <BrandLogo />
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-2 rounded-md border border-gold-400/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-200! transition-colors hover:border-gold-400 hover:bg-gold-400/10"
                    >
                        Vào cửa hàng <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Nội dung hero */}
                <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-6 pb-20 lg:grid-cols-2">
                    <div className="text-center lg:text-left">
                        <p className="lp-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-200">
                            <CrownFilled className="text-gold-400" /> Luxury Orchid Boutique
                        </p>
                        <h1 className="lp-title font-brand text-5xl font-bold leading-[1.05] tracking-wider text-gold-300 sm:text-6xl xl:text-7xl">
                            <span className="block">Orchid</span>
                            <span className="block">Paradise</span>
                        </h1>
                        <div className="lp-hero-rule gold-rule mx-auto my-6 w-48 origin-center lg:mx-0 lg:origin-left" />
                        <p className="lp-hero-text mx-auto max-w-lg text-base leading-relaxed text-stone-400 lg:mx-0 md:text-lg">
                            Nơi hội tụ tinh hoa hoa lan quý hiếm — mỗi nhành lan là một tác phẩm nghệ thuật,
                            được tuyển chọn và chăm sóc dành riêng cho người sành chơi.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                            <Link
                                to="/"
                                className="lp-hero-cta inline-flex items-center gap-2 rounded-md bg-linear-to-r from-gold-200 via-gold-400 to-gold-500 px-7 py-3 text-sm font-semibold text-ink-950! shadow-lg shadow-gold-500/30 transition-shadow hover:shadow-xl hover:shadow-gold-500/50 hover:brightness-110"
                            >
                                Khám phá bộ sưu tập <ArrowRightOutlined />
                            </Link>
                            <a
                                href="#lp-story"
                                className="lp-hero-cta inline-flex items-center rounded-md border border-gold-400/40 px-6 py-3 text-sm font-medium text-gold-200! transition-colors hover:bg-gold-400/10"
                            >
                                Câu chuyện của chúng tôi
                            </a>
                        </div>
                    </div>

                    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-xl">
                        <div className="lp-glow pointer-events-none absolute inset-[18%] rounded-full bg-gold-400/20 blur-3xl" />
                        <div className="lp-orchid-wrap relative h-full w-full drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]">
                            <OrchidArt />
                        </div>
                    </div>
                </div>

                {/* Chỉ báo cuộn */}
                <a href="#lp-story" className="lp-scroll-cue absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-500!">
                    <span className="flex h-9 w-5 justify-center rounded-full border border-gold-400/40 pt-1.5">
                        <span className="lp-scroll-dot h-1.5 w-1.5 rounded-full bg-gold-400" />
                    </span>
                    Cuộn xuống
                </a>
            </section>

            {/* ================= MARQUEE ================= */}
            <div className="overflow-hidden border-y border-gold-400/20 bg-ink-900 py-4">
                <div className="lp-marquee-track flex w-max">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                            {VARIETIES.map((name) => (
                                <span key={`${copy}-${name}`} className="flex items-center gap-8 pr-8 font-display text-lg italic text-gold-300/80">
                                    {name}
                                    <span className="text-xs not-italic text-gold-600">✦</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= TÍNH NĂNG ================= */}
            <section id="lp-story" className="relative mx-auto max-w-7xl scroll-mt-6 px-6 py-20">
                <SectionHeading
                    eyebrow="Vì sao chọn chúng tôi"
                    title="Tinh hoa trong từng nhành lan"
                    text="Orchid Paradise không chỉ là một sàn hoa lan — đó là nơi những người yêu lan gặp gỡ, chia sẻ và sưu tầm những tuyệt tác của thiên nhiên."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((item) => (
                        <div
                            key={item.title}
                            className="lp-feature group relative overflow-hidden rounded-lg border border-white/8 bg-ink-900 p-6 transition-colors duration-500 hover:border-gold-400/50"
                        >
                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/0 blur-2xl transition-colors duration-500 group-hover:bg-gold-400/15" />
                            <span className="lp-feature-icon mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-gold-400/40 bg-gold-400/10 text-xl text-gold-400">
                                {item.icon}
                            </span>
                            <h3 className="mb-2 font-display text-lg font-semibold text-gold-100">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-stone-400">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= SỐ LIỆU ================= */}
            <section className="border-y border-gold-400/15 bg-linear-to-r from-ink-900 via-gold-950/60 to-ink-900">
                <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 md:grid-cols-4">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="lp-stat px-4 py-10 text-center">
                            <p className="text-gold font-display text-4xl font-bold md:text-5xl">
                                <span className="lp-stat-number">{formatStat(stat.value, stat.decimals)}</span>
                                {stat.suffix}
                            </p>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-stone-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= HOA LAN NỔI BẬT ================= */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <SectionHeading
                    eyebrow="Bộ sưu tập"
                    title="Những tuyệt tác nổi bật"
                    text="Chiêm ngưỡng trước vài nhành lan đặc biệt đang có mặt trong vườn."
                />
                <div ref={showcaseRef} className="grid grid-cols-1 gap-5 md:grid-cols-3" style={{ perspective: '1200px' }}>
                    {orchids.length === 0
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg border border-white/8 bg-ink-900" />
                        ))
                        : orchids.map((orchid) => (
                            <Link
                                key={orchid.id}
                                to={`/orchids/${orchid.id}`}
                                className="lp-show-card group relative block aspect-[3/4] overflow-hidden rounded-lg border border-gold-400/20 bg-ink-900"
                            >
                                {orchid.image && (
                                    <img
                                        src={orchid.image}
                                        alt={orchid.orchidName}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/40 to-transparent" />
                                <span className="pointer-events-none absolute inset-3 rounded-md border border-gold-400/0 transition-colors duration-500 group-hover:border-gold-400/50" />
                                {orchid.isSpecial && (
                                    <span className="badge-gold absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                                        <CrownFilled /> Đặc biệt
                                    </span>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-gold-400">{orchid.category}</p>
                                    <h3 className="font-display text-xl font-semibold text-stone-50">{orchid.orchidName}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-gold font-display text-lg font-bold">${orchid.price?.toLocaleString()}</span>
                                        <span className="inline-flex items-center gap-1 text-xs text-gold-200 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                                            Xem chi tiết <ArrowRightOutlined />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </section>

            {/* ================= HÀNH TRÌNH ================= */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <SectionHeading eyebrow="Hành trình" title="Ba bước đến với hoa lan quý" />
                <div className="lp-steps relative">
                    <svg className="pointer-events-none absolute left-0 top-8 hidden h-2 w-full md:block" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
                        <line className="lp-step-line" x1="80" y1="2" x2="920" y2="2" stroke="#d4af37" strokeOpacity="0.7" strokeWidth="2" />
                    </svg>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <div key={step.title} className="lp-step relative text-center">
                                <span className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-ink-950 text-2xl text-gold-400 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                    {step.icon}
                                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 font-brand text-xs font-bold text-ink-950">
                                        {i + 1}
                                    </span>
                                </span>
                                <h3 className="mb-2 font-display text-xl font-semibold text-gold-100">{step.title}</h3>
                                <p className="mx-auto max-w-xs text-sm leading-relaxed text-stone-400">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA CUỐI ================= */}
            <section className="relative overflow-hidden border-t border-gold-400/20 px-6 py-24 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_50%,rgba(212,175,55,0.12),transparent_70%)]" />
                <div className="lp-reveal relative mx-auto max-w-2xl">
                    <TeamOutlined className="mb-4 text-3xl text-gold-400" />
                    <h2 className="text-gold mb-4 font-display text-3xl font-bold md:text-5xl">Bước vào thế giới hoa lan</h2>
                    <p className="mb-10 text-stone-400">
                        Tham gia cộng đồng Orchid Paradise để khám phá, đánh giá và sưu tầm những nhành lan quý phái nhất.
                    </p>
                    <div className="relative inline-block">
                        <span className="lp-cta-pulse pointer-events-none absolute inset-0 rounded-md border-2 border-gold-400" />
                        <Link
                            to="/"
                            className="relative inline-flex items-center gap-2 rounded-md bg-linear-to-r from-gold-200 via-gold-400 to-gold-500 px-9 py-4 text-base font-semibold text-ink-950! shadow-xl shadow-gold-500/30 transition-transform hover:-translate-y-0.5"
                        >
                            Bắt đầu khám phá <ArrowRightOutlined />
                        </Link>
                    </div>
                </div>
                <p className="relative mt-16 text-xs text-stone-600">© 2026 Orchid Paradise. Lab 6 Assignment.</p>
            </section>
        </div>
    );
};

export default LandingPage;
