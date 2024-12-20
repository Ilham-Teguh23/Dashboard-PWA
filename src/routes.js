export const Routes = {
    Login: { path: "/login" },

    // Custom Print
    CustomPrint: { path: "/pwa-b2b/custom-print" },

    // pages dicki
    TnosGems: { path: "/tnos-gems/pembelian" },
    TnosGemsProduct: { path: "/tnos-gems/product" },
    MarketingMessageBlash: { path: "/information/message-blash" },

    // Pages
    OrderIndex: { path: "/order/index" },
    OrderOnProgress: { path: "/order/on-progress" },
    OrderOnProgressDetail: { path: "/order/on-progress/detail" },
    OrderSuccess: { path: "/order/success" },
    OrderCancel: { path: "/order/cancel" },
    OrderVoucher: { path: "/order/voucher" },
    OrderVoucherDetail: { path: "/order/voucher/order-voucher-detail/:id" },
    OrderVoucherPembayaran: { path: "/order/voucher/payment-voucher-detail/:id" },
    OrderTransaction: { path: "/order/transaction" },
    OrderTransactionDetail: { path: "/order/transaction/detail" },
    // TAB
    TABInsiden: { path: "/tab/insiden" },
    TABResponder: { path: "/tab/responder" },
    TABResponderDetail: { path: "/tab/responder/:id" },
    TABInsidenDetail: { path: "/tab/insiden/detail/:id" },
    TABUser: { path: "/tab/user" },
    TABUserGrafik: { path: "/tab/user/grafik" },
    TABTransaksiDetail: { path: "/tab/transaksi/:id/detail" },
    TABKategoriUsaha: { path: "/tab/kategori-usaha" },
    TABKategoriUsahaDetail: { path: "/tab/kategori-usaha/:id/detail" },
    TABMasterPaketDetail: { path: "/tab/master-paket/:id" },
    TABAktivasiAkun: { path: "/tab/aktivasi-akun" },
    TABIndex: { path: "/tab/index" },
    TABTransaksi: { path: "/tab/transaksi" },
    TABBanner: { path: "/tab/banner" },
    TABLiveLocation: { path: "/tab/live-location" },
    TABLiveLocationDetail: { path: "/tab/live-location/:id/detail" },
    TABPesanMassal: { path: "/tab/pesan-masal" },

    // TAB-B2B
    TABB2BOrder: { path: "/tab-b2b/order" },
    TABB2BUser: { path: "/tab-b2b/user" },
    TABB2BAktivasiAkun: { path: "/tab-b2b/aktivasi-akun" },
    TABB2BTransaksi: { path: "/tab-b2b/transaksi" },
    TABB2BTransaksiDetail: { path: "/tab-b2b/transaksi/:id" },
    TABB2BInsiden: { path: "/tab-b2b/insiden" },
    TABB2BInsidenDetail: { path: "/tab-b2b/insiden/:id/detail" },
    TABB2BUser: { path: "/tab-b2b/user" },
    TABB2BUserDetail: { path: "/tab-b2b/user/:id" },
    TABB2BResponder: { path: "/tab-b2b/responder" },
    TABB2BResponderDetail: { path: "/tab-b2b/responder/:id" },
    TABB2BMasterPaket: { path: "/tab-b2b/master-paket" },
    TABB2BKategoriUsaha: { path: "/tab-b2b/kategori-usaha" },
    TABB2BPesanMassal: { path: "/tab-b2b/pesan-masal" },

    // DATA AKUN
    DataAkunExternal: { path: "/data-akun/external" },
    DataDetailAkunExternal: { path: "/data-akun/external/:id" },
    DataAkunPartner: { path: "/data-akun/partner" },
    DataAkunDetailPartner: { path: "/data-akun/partner/:id" },
    DataAkunInternal: { path: "/data-akun/internal" },
    DataDetailAkunInternal: { path: "/data-akun/internal/:id" },

    PaymentIndex: { path: "/payment/index" },
    PaymentOnProgress: { path: "/payment/on-progress" },
    PaymentIn: { path: "/payment/in" },
    PaymentOut: { path: "/payment/out" },
    PaymentWithdrawal: { path: "/payment/withdrawal" },
    PaymentRefund: { path: "/payment/refund" },

    PartnerIndex: { path: "/partner/index" },
    PartnerGuard: { path: "/partner/guard" },
    PartnerGuardCreate: { path: "/partner/guard/create" },
    PartnerGuardDetail: { path: "/partner/guard/detail/:id" },
    PartnerGuardUpdate: { path: "/partner/guard/update/:id" },
    PartnerGuardProfile: { path: "/partner/guard/profile/:id" },
    PartnerGuardBarcodes: { path: "/partner/guard/barcodes" },
    PartnerLawyer: { path: "/partner/lawyer" },
    PartnerLawyerDetail: { path: "/partner/lawyer/detail/:id" },
    PartnerLawyerUpdate: { path: "/partner/lawyer/update/:id" },
    PartnerLawyerProfile: { path: "/partner/lawyer/profile/:id" },
    PartnerLawyerBarcodes: { path: "/partner/lawyer/barcodes" },
    PartnerSuspended: { path: "/partner/suspended" },
    PartnerBlocked: { path: "/partner/blocked" },
    PartnerRejected: { path: "/partner/rejected" },

    MemberIndex: { path: "/member/index" },
    MemberProfile: { path: "/member/profile/:id" },
    MemberActive: { path: "/member/active" },
    MemberNonActive: { path: "/member/non-active" },
    MemberSuspended: { path: "/member/suspended" },
    MemberBlocked: { path: "/member/blocked" },

    InformationIndex: { path: "/information/index" },
    InformationFee: { path: "/information/fee" },
    InformationDiscount: { path: "/information/discount" },
    InformationPromotion: { path: "/information/promotion" },
    InformationWebsite: { path: "/information/website" },

    LiveMonitoringIndex: { path: "/live-monitoring/index" },
    LiveMonitoringPanicButton: { path: "/live-monitoring/panic-button" },

    TnosAdminIndex: { path: "/tnos-admin/index" },
    TnosAdminUser: { path: "/tnos-admin/user" },
    TnosAdminUserCreate: { path: "/tnos-admin/user/create" },
    TnosAdminUserUpdate: { path: "/tnos-admin/user/update/:id" },
    TnosAdminGroup: { path: "/tnos-admin/group" },

    PwaB2bTransaction: { path: "/pwa-b2b/transaction" },
    PWAB2bTransactionDetailData: { path: "/pwa-b2b/transaction/detail" },
    // PwaB2bTransactionDetail: { path: "/pwa-b2b/transaction/detail" },
    PwaB2bTransactionExportPdf: { path: "/pwa-b2b/transaction/export-pdf" },
    PwaB2bOrder: { path: "/pwa-b2b/order" },
    PwaB2bOrderDetail: { path: "/pwa-b2b/order/detail" },
    PwaB2bOrderExportPdf: { path: "/pwa-b2b/order/export-pdf" },
    PwaB2bIncome: { path: "/pwa-b2b/income" },
    PwaB2bPembayaran: { path: "/pwa-b2b/pembayaran" },
    PwaB2bSecurityProvider: { path: "/pwa-b2b/security-provider" },
    PwaB2bSecurityProviderLayanan: { path: "/pwa-b2b/security-provider/:id/layanan" },
    PwaB2bDurasi: { path: "/pwa-b2b/security-provider/:id/durasi" },
    PwaB2bUnit: { path: "/pwa-b2b/unit" },
    PwaB2bComponentOthers: { path: "/pwa-b2b/component-others" },
    PwaB2bRefund: { path: "/pwa-b2b/refund" },
    PwaB2bPartnerPayments: { path: "/pwa-b2b/partner-payments" },
    PwaB2bVoucher: { path: "/pwa-b2b/voucher" },
    PwaB2bOrderVoucherDetail: {
        path: "/pwa-b2b/voucher/order-voucher-detail/:id",
    },
    PwaB2bManualOrder: { path: "/pwa-b2b/manual-order" },
    PwaB2bManualOrderCreate: { path: "/pwa-b2b/manual-order/create" },
    PwaB2bManualOrderEdit: { path: "/pwa-b2b/manual-order/:id/edit" },
    PwaB2bManualOrderUpload: { path: "/pwa-b2b/manual-order/:id/upload" },
    PwaB2bPaymentVoucherDetail: {
        path: "/pwa-b2b/voucher/payment-voucher-detail/:id",
    },
    PwaB2bOrderPesan: { path: "/pwa-b2b/order/:id/form" },
    PwaB2bSection: { path: "/pwa-b2b/layanan/:id/section" },
    PwaB2bProduct: { path: "/pwa-b2b/section/:id/product" },
    PwaB2bSubSectionProduct: { path: "/pwa-b2b/section/:id/product-sub-section" },
    PwaB2bSubSection: { path: "/pwa-b2b/section/:id/sub-section" },
    PwaB2bLainnyaOthersProductSub: { path: "/pwa-b2b/lainnya/:id/others-prod-sub" },
    PwaB2bLainnyaOthersProduct: { path: "/pwa-b2b/lainnya/:id/others-prod" },

    ConsultationChatIndex: { path: "/consultation-chat/index" },
    ConsultationChatList: { path: "/consultation-chat/list" },
    ConsultationChatSpam: { path: "/consultation-chat/spam" },

    // Components
    // DashboardOverview: { path: "/dashboard/overview" },
    BootstrapTables: { path: "/bootstrap/tables" },
    BootstrapForms: { path: "/bootstrap/forms" },
    BootstrapLayout: { path: "/bootstrap/layout" },
    BootstrapElements: { path: "/bootstrap/elements" },
    BootstrapCharts: { path: "/bootstrap/charts" },

    // pages
    DashboardOverview: { path: "/" },
    Transactions: { path: "/transactions" },
    Settings: { path: "/settings" },
    Upgrade: { path: "/upgrade" },
    Billing: { path: "/examples/billing" },
    Invoice: { path: "/examples/invoice" },
    Signin: { path: "/examples/sign-in" },
    Signup: { path: "/examples/sign-up" },
    ForgotPassword: { path: "/examples/forgot-password" },
    ResetPassword: { path: "/examples/reset-password" },
    Lock: { path: "/examples/lock" },
    NotFound: { path: "/examples/404" },
    ServerError: { path: "/examples/500" },

    // docs
    DocsOverview: { path: "/documentation/overview" },
    DocsDownload: { path: "/documentation/download" },
    DocsQuickStart: { path: "/documentation/quick-start" },
    DocsLicense: { path: "/documentation/license" },
    DocsFolderStructure: { path: "/documentation/folder-structure" },
    DocsBuild: { path: "/documentation/build-tools" },
    DocsChangelog: { path: "/documentation/changelog" },

    // components
    Accordions: { path: "/components/accordions" },
    Alerts: { path: "/components/alerts" },
    Badges: { path: "/components/badges" },
    Widgets: { path: "/widgets" },
    Breadcrumbs: { path: "/components/breadcrumbs" },
    Buttons: { path: "/components/buttons" },
    Forms: { path: "/components/forms" },
    Modals: { path: "/components/modals" },
    Navs: { path: "/components/navs" },
    Navbars: { path: "/components/navbars" },
    Pagination: { path: "/components/pagination" },
    Popovers: { path: "/components/popovers" },
    Progress: { path: "/components/progress" },
    Tables: { path: "/components/tables" },
    Tabs: { path: "/components/tabs" },
    Tooltips: { path: "/components/tooltips" },
    Toasts: { path: "/components/toasts" },
    WidgetsComponent: { path: "/components/widgets" },

    // Artikel
    ArtikelTags: { path: "/artikel/tags" },
    ArtikelIndex: { path: "/artikel/index" },
    ArtikelCreate: { path: "/artikel/create" },
    ArtikelKategory: { path: "/artikel/artikelkategory" },
    SubKategoryList: { path: "/artikel/subcategorylist" },
    KategoryCreate: { path: "/artikel/artikelkategory/create" },
    SubCategory: { path: "/article/category/:id" },
    ArtikelDetail: { path: "/artikel/detail/:id" },
    ArtikelUpdate: { path: "/artikel/update/:id" },
    TagsCreate: { path: "/artikel/tags/create" },
}