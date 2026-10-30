import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import viVN from 'antd/locale/vi_VN';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
const GOOGLE_CLIENT_ID = "263909778192-4jma5efiopgp4ud14camlg1jrb5m6k7p.apps.googleusercontent.com";

// Design system: Đen huyền (Onyx) + Vàng kim (Champagne Gold) — phong cách huyền bí, quý phái
const GOLD = '#d4af37';
const orchidTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: GOLD,
        colorInfo: GOLD,
        colorLink: '#e2c25f',
        colorLinkHover: '#f5ebc8',
        colorBgBase: '#070708',
        colorBgLayout: '#070708',
        colorBgContainer: '#0e0e10',
        colorBgElevated: '#18181b',
        colorBorder: '#2a2a2f',
        colorBorderSecondary: '#1f1f23',
        colorText: '#e7e5e4',
        colorTextSecondary: '#a8a29e',
        borderRadius: 6,
        borderRadiusLG: 8,
        fontFamily: "'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif",
    },
    components: {
        Rate: { starColor: GOLD, starBg: '#2a2a2f' },
        Button: {
            fontWeight: 500,
            primaryColor: '#070708', // chữ đen trên nền vàng
            primaryShadow: '0 8px 20px -8px rgba(212, 175, 55, 0.45)',
            defaultBg: 'transparent',
            defaultBorderColor: '#3a3a40',
        },
        Table: {
            headerBg: '#131315',
            headerColor: '#d4af37',
            headerSplitColor: 'transparent',
            rowHoverBg: 'rgba(212, 175, 55, 0.06)',
            borderColor: '#1f1f23',
            cellPaddingBlock: 10,
        },
        Modal: { borderRadiusLG: 10, titleFontSize: 18, contentBg: '#0e0e10', headerBg: '#0e0e10' },
        Dropdown: { borderRadiusLG: 8, paddingBlock: 8 },
        Input: { activeShadow: '0 0 0 3px rgba(212, 175, 55, 0.15)' },
        Select: { optionSelectedBg: 'rgba(212, 175, 55, 0.15)' },
        Switch: { handleBg: '#f5ebc8' },
        Breadcrumb: { linkColor: '#a8a29e', linkHoverColor: GOLD, separatorColor: '#57534e', lastItemColor: '#e7e5e4' },
    },
};

// Áp dụng theme cho các thông báo tĩnh (message.success / message.error ...)
ConfigProvider.config({
    holderRender: (children) => (
        <StyleProvider layer>
            <ConfigProvider theme={orchidTheme} locale={viVN}>{children}</ConfigProvider>
        </StyleProvider>
    ),
});

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                {/* layer: đưa CSS của antd vào @layer antd để class Tailwind (utilities) được ưu tiên hơn */}
                <StyleProvider layer>
                    <ConfigProvider theme={orchidTheme} locale={viVN}>
                        <BrowserRouter>
                            <AppRoutes />
                        </BrowserRouter>
                    </ConfigProvider>
                </StyleProvider>
            </AuthProvider>
        </GoogleOAuthProvider>

    )
}
export default App
