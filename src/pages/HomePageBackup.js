import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { Route, Switch, useHistory } from "react-router-dom";
import { Routes } from "../routes";
// Auth
import Login from "./Login";

//pages dicki

import TnosGemsPembelian from "./tnos-coin/Transaction";
import TnosGemsProduct from "./tnos-coin/Product";
import MarketingMessageBlash from "./information/MessageBlash";

// Pages
import OrderIndex from "./order/Index";
import OrderOnProgress from "./order/OnProgress";
import OrderOnProgressDetail from "./order/OnProgressDetail";
import OrderTransaction from "./order/Transaction";
import OrderTransactionDetail from "./order/TransactionDetail";
import OrderSuccess from "./order/Success";
import OrderCancel from "./order/Cancel";
import OrderVoucher from "./order/Voucher";
import OrderVoucherDetail from "./order/DetailVoucher.js"
import OrderVoucherPaymentDetail from "./order/DetailPayment.js"

import PaymentIndex from "./payment/Index";
import PaymentOnProgress from "./payment/OnProgress";
import PaymentIn from "./payment/In";
import PaymentOut from "./payment/Out";
import PaymentWithdrawal from "./payment/Withdrawal";
import PaymentRefund from "./payment/Refund";

import PartnerIndex from "./partner/Index";
import PartnerGuard from "./partner/Guard";
import PartnerGuardCreate from "./partner/GuardCreate";
import PartnerGuardDetail from "./partner/GuardDetail";
import PartnerGuardUpdate from "./partner/GuardUpdate";
import PartnerGuardProfile from "./partner/GuardProfile";
import PartnerGuardBarcodes from "./partner/GuardBarcodes";
import PartnerLawyer from "./partner/Lawyer";
import PartnerLawyerDetail from "./partner/LawyerDetail";
import PartnerLawyerUpdate from "./partner/LawyerUpdate";
import PartnerLawyerProfile from "./partner/LawyerProfile";
import PartnerLawyerBarcodes from "./partner/LawyerBarcodes";
import PartnerSuspended from "./partner/Suspended";
import PartnerBlocked from "./partner/Blocked";

import MemberIndex from "./member/Index";
import MemberProfile from "./member/Profile";
import MemberActive from "./member/Active";
import MemberNonActive from "./member/NonActive";
import MemberSuspended from "./member/Suspended";
import MemberBlocked from "./member/Blocked";

import InformationIndex from "./information/Index";
import InformationFee from "./information/Fee";
import InformationDiscount from "./information/Discount";
import InformationPromotion from "./information/Promotion";
import InformationWebsite from "./information/Website";

import LiveMonitoringIndex from "./liveMonitoring/Index";
import LiveMonitoringPanicButton from "./liveMonitoring/PanicButton";

import TnosAdminIndex from "./tnosAdmin/Index";
import TnosAdminUser from "./tnosAdmin/User";
import TnosAdminUserCreate from "./tnosAdmin/UserCreate";
import TnosAdminUserUpdate from "./tnosAdmin/UserUpdate";
import TnosAdminGroup from "./tnosAdmin/Group";

import PwaB2bTransaction from "./pwaB2b/Transaction";
import PwaB2bTransactionDetail from "./pwaB2b/TransactionDetail";
import PWAB2bTransactionDetailData from "./pwaB2b/TransactionDetailData.js"
import PwaB2bTransactionExportPdf from "./pwaB2b/TransactionExportPdf";
import PwaB2bOrder from "./pwaB2b/Order";
import PwaB2bOrderDetail from "./pwaB2b/OrderDetail";
import PwaB2bOrderExportPdf from "./pwaB2b/OrderExportPdf";
import PwaB2bIncome from "./pwaB2b/Income";
import PwaB2bPembayaran from "./pwaB2b/Pembayaran";
import PwaB2bManualOrder from "./pwaB2b/ManualOrder"
import PwaB2bManualOrderCreate from "./pwaB2b/ManualOrderCreate"
import PwaB2bManualOrderEdit from "./pwaB2b/ManualOrderEdit"
import PwaB2bManualOrderUpload from "./pwaB2b/ManualOrderUpload"
import PwaB2bRefund from "./pwaB2b/Refund";
import PwaB2bPartnerPayments from "./pwaB2b/PartnerPayments";
import PwaB2bVoucher from "./pwaB2b/Voucher";
import PwaB2bOrderVoucherDetail from "./pwaB2b/OrderVoucherDetail";
import PwaB2bPaymentVoucherDetail from "./pwaB2b/PaymentVoucherDetail";
import PwaB2bOrderPesan from "./pwaB2b/OrderPesan.js";
import PwaB2bSecurityProvider from "./pwaB2b/SecurityProvider.js";
import PwaB2bSecurityProviderLayanan from "./pwaB2b/LayananSecurityProvider.js";
import PwaB2bDurasi from "./pwaB2b/Durasi.js"
import PwaB2bUnit from "./pwaB2b/Unit.js"
import PwaB2bSection from "./pwaB2b/Section.js";
import PwaB2bProduct from "./pwaB2b/Product.js";
import PwaB2bProductSubSection from "./pwaB2b/ProductSubSection.js";
import PwaB2bSubSection from "./pwaB2b/SubSection.js";
import PwaB2bOthersProductSub from "./pwaB2b/OthersProductSub.js";
import PwaB2bOthersProduct from "./pwaB2b/OthersProduct.js";
import PWaB2bOthersComponents from "./pwaB2b/OthersComponent.js"

import ConsultationChatIndex from "./consultationChat/Index";
import ConsultationChatList from "./consultationChat/List";
import ConsultationChatSpam from "./consultationChat/Spam";

// pages
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import CustomPrint from "./pwaB2b/CustomPrint";

import AddArticle from "./artikel/create";
import ArtikelIndex from "./artikel";
import ArticleDetail from "./artikel/detail.js";
import ArtikelUpdate from "./artikel/update.js";
import ArtikelKategory from "./artikel/artikelkategory.js";
import KategoryCreate from "./artikel/kategorycreate.js";
import SubCategory from "./artikel/subkategorycreate.js";
import SubKategoryList from "./artikel/subkategorylist.js";
import ArtikelTags from "./artikel/tags.js";
import TagsCreate from "./artikel/tagscreate.js";

// TAB
import TABInsidenData from "./tab/insiden-data.js";
import TABInsidenDetail from "./tab/detail-insiden.js"
import TABResponder from "./tab/responder.js"
import TABResponderDetail from "./tab/responder-detail.js"
import TABTransaksiDetail from "./tab/transaksi-detail.js"
import TABMasterPaketDetail from "./tab/master-paket-detail.js"
import TABUser from "./tab/user.js"
import TABTransaksi from "./tab/transaksi.js"
import TABKategoriUsahaDetail from "./tab/detail-kategori-usaha.js"
import TABBanner from "./tab/banner.js"
import TABLiveLocation from "./tab/LiveLocation.js"
import TABLiveLocationDetail from "./tab/LiveLocationDetail.js"

// TAB-B2B
import TABB2BOrder from "./tabB2b/Order.js"
import TABB2BAktivasiAkun from "./tabB2b/AktivasiAkun.js"
import TABB2BTransaksi from "./tabB2b/Transaksi.js"
import TABB2BInsiden from "./tabB2b/Insiden.js"
import TABB2BInsidenDetail from "./tabB2b/InsidenDetail.js"
import TABB2BTransaksiDetail from "./tabB2b/TransaksiDetail.js"
import TABB2BUser from "./tabB2b/User.js"
import TABB2BDetailUser from "./tabB2b/DetailUser.js"
import TABB2BResponder from "./tabB2b/Responder.js"
import TABB2BResponderDetail from "./tabB2b/ResponderDetail.js"
import TABB2BMasterPaket from "./tabB2b/Master-Paket.js"
import TABB2BKategoriUsaha from "./tabB2b/KategoriUsaha.js"

// DATA AKUN
import DataAkunEksternal from "./data-akun/AkunEksternal.js"
import DataAkunPartner from "./data-akun/AkunPartner.js"
import DataAkunDetailExternal from "./data-akun/DetailAkunExternal.js"
import DataAkunDetailPartner from "./data-akun/DetailAkunPartner.js"
import DataAkunInternal from "./data-akun/AkunInternal.js"
import DataAkunDetailInternal from "./data-akun/DetailAkunInternal.js"
import TransactionDetailData from "./pwaB2b/TransactionDetailData.js";

import { database } from "../config/firebase";
import { ref, onValue, off, getDatabase } from "firebase/database"

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          {" "}
          <Preloader show={loaded ? false : true} /> <Component {...props} />{" "}
        </>
      )}
    />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded] = useState(true)

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };

  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };

  const currentPath = rest.path;
  const isOrderFormPage =
    currentPath && currentPath.startsWith("/pwa-b2b/order/:id/form");

  // const [latestIncident, setLatestIncident] = useState(null)
  // const [showModal, setShowModal] = useState(false);
  // const mapRef = useRef(null)
  // const markerRef = useRef(null)
  // const [isMapReady, setIsMapReady] = useState(false);

  // const setupListener = () => {
  //     const dbRef = ref(database, "TNSALERT/PANIC/INCIDENT");

  //     onValue(dbRef, (snapshot) => {
  //         const dataResponse = snapshot.val();
  //         const newData = dataResponse ? Object.values(dataResponse) : [];

  //         const sortedData = newData.sort((a, b) => b.timestamp - a.timestamp);
  //         const latestData = sortedData[0] || null

  //         if (latestData) {
  //             setLatestIncident(latestData)
  //             setShowModal(true)
  //         }
  //     });
  // };

  // const initMap = () => {
  //     if (latestIncident?.lokasi && !mapRef.current) {
  //         mapRef.current = new window.google.maps.Map(
  //             document.getElementById("map"),
  //             {
  //                 center: {
  //                     lat: latestIncident.lokasi.latitude,
  //                     lng: latestIncident.lokasi.longitude,
  //                 },
  //                 zoom: 12,
  //             }
  //         );

  //         markerRef.current = new window.google.maps.Marker({
  //             position: {
  //                 lat: latestIncident.lokasi.latitude,
  //                 lng: latestIncident.lokasi.longitude,
  //             },
  //             map: mapRef.current,
  //             title: "Incident Location",
  //             icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  //         });

  //         setIsMapReady(true);
  //     }
  // };

  // const updateMap = () => {
  //     if (latestIncident?.lokasi && mapRef.current && markerRef.current) {
  //         mapRef.current.setCenter({
  //             lat: latestIncident.lokasi.latitude,
  //             lng: latestIncident.lokasi.longitude,
  //         });

  //         markerRef.current.setPosition({
  //             lat: latestIncident.lokasi.latitude,
  //             lng: latestIncident.lokasi.longitude,
  //         });
  //     }
  // };

  // useEffect(() => {

  //     setupListener();

  //     return () => {
  //         const dbRef = ref(database, "TNSALERT/PANIC/INCIDENT")
  //         off(dbRef);
  //     };
  // }, []);

  // useEffect(() => {
  //     if (showModal && latestIncident) {
  //         setTimeout(() => {
  //             if (!isMapReady) {
  //                 initMap()
  //             } else {
  //                 updateMap()
  //             }
  //         }, 500)
  //     }
  // }, [showModal, latestIncident, isMapReady]);

  // const handleCloseModal = () => {
  //     setShowModal(false);
  //     setIsMapReady(false)
  //     mapRef.current = null
  //     markerRef.current = null
  // };

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={loaded ? false : true} />

          {isOrderFormPage ? (
            <Component {...props} />
          ) : (
            <>
              <Sidebar />

              <main className="content">
                <Navbar />

                <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title>Notifikasi Data Baru</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {latestIncident ? (
                      <>
                        <p>Data terbaru telah terdeteksi:</p>
                        <pre>{JSON.stringify(latestIncident, null, 2)}</pre>

                        {/* Peta */}
                        <div
                          id="map"
                          style={{ width: "100%", height: "300px" }}
                        ></div>
                      </>
                    ) : (
                      <p>Tidak ada data baru.</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                      Oke, Mengerti
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Component {...props} />
                <Footer
                  toggleSettings={toggleSettings}
                  showSettings={showSettings}
                />
              </main>
            </>
          )}
        </>
      )}
    />
  );
};

export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getSubMenuData] = useState([
    {
      id: 1,
      component: OrderIndex,
      path: Routes.OrderIndex.path,
    },
    {
      id: 2,
      component: OrderOnProgress,
      path: Routes.OrderOnProgress.path,
    },
    {
      id: 2,
      component: OrderTransaction,
      path: Routes.OrderTransaction.path
    },
    {
      id: 2,
      component: OrderTransactionDetail,
      path: Routes.OrderTransactionDetail.path
    },
    {
      id: 5,
      component: OrderSuccess,
      path: Routes.OrderSuccess.path,
    },
    {
      id: 6,
      component: OrderCancel,
      path: Routes.OrderCancel.path,
    },
    {
      id: 7,
      component: PaymentIndex,
      path: Routes.PaymentIndex.path,
    },
    {
      id: 11,
      component: PaymentOnProgress,
      path: Routes.PaymentOnProgress.path,
    },
    {
      id: 12,
      component: PaymentIn,
      path: Routes.PaymentIn.path,
    },
    {
      id: 15,
      component: PaymentOut,
      path: Routes.PaymentOut.path,
    },
    {
      id: 16,
      component: PaymentWithdrawal,
      path: Routes.PaymentWithdrawal.path,
    },
    {
      id: 53,
      component: PaymentRefund,
      path: Routes.PaymentRefund.path,
    },
    {
      id: 17,
      component: PartnerIndex,
      path: Routes.PartnerIndex.path,
    },
    {
      id: 18,
      component: PartnerGuard,
      path: Routes.PartnerGuard.path,
    },
    {
      id: 19,
      component: PartnerLawyer,
      path: Routes.PartnerLawyer.path,
    },
    {
      id: 21,
      component: PartnerSuspended,
      path: Routes.PartnerSuspended.path,
    },
    {
      id: 22,
      component: PartnerBlocked,
      path: Routes.PartnerBlocked.path,
    },
    {
      id: 23,
      component: MemberIndex,
      path: Routes.MemberIndex.path,
    },
    {
      id: 24,
      component: MemberActive,
      path: Routes.MemberActive.path,
    },
    {
      id: 25,
      component: MemberNonActive,
      path: Routes.MemberNonActive.path,
    },
    {
      id: 27,
      component: MemberSuspended,
      path: Routes.MemberSuspended.path,
    },
    {
      id: 29,
      component: MemberBlocked,
      path: Routes.MemberBlocked.path,
    },
    {
      id: 32,
      component: InformationIndex,
      path: Routes.InformationIndex.path,
    },
    {
      id: 50,
      component: InformationFee,
      path: Routes.InformationFee.path,
    },
    {
      id: 33,
      component: InformationDiscount,
      path: Routes.InformationDiscount.path,
    },
    {
      id: 34,
      component: InformationPromotion,
      path: Routes.InformationPromotion.path,
    },
    {
      id: 38,
      component: InformationWebsite,
      path: Routes.InformationWebsite.path,
    },
    {
      id: 39,
      component: LiveMonitoringIndex,
      path: Routes.LiveMonitoringIndex.path,
    },
    {
      id: 43,
      component: LiveMonitoringPanicButton,
      path: Routes.LiveMonitoringPanicButton.path,
    },
    {
      id: 44,
      component: TnosAdminIndex,
      path: Routes.TnosAdminIndex.path,
    },
    {
      id: 45,
      component: TnosAdminUser,
      path: Routes.TnosAdminUser.path,
    },
    {
      id: 49,
      component: TnosAdminGroup,
      path: Routes.TnosAdminGroup.path,
    },
    {
      id: 57,
      component: PwaB2bTransaction,
      path: Routes.PwaB2bTransaction.path,
    },
    {
      id: 57,
      component: TransactionDetailData,
      path: Routes.PWAB2bTransactionDetailData.path
    },
    {
      id: 58,
      component: PwaB2bOrder,
      path: Routes.PwaB2bOrder.path,
    },
    {
      id: 59,
      component: PwaB2bIncome,
      path: Routes.PwaB2bIncome.path,
    },
    {
      id: 59,
      component: PwaB2bPembayaran,
      path: Routes.PwaB2bPembayaran.path
    },
    {
      id: 59,
      component: PwaB2bManualOrder,
      path: Routes.PwaB2bManualOrder.path
    },
    {
      id: 59,
      component: PwaB2bManualOrderCreate,
      path: Routes.PwaB2bManualOrderCreate.path
    },
    {
      id: 59,
      component: PwaB2bManualOrderEdit,
      path: Routes.PwaB2bManualOrderEdit.path
    },
    {
      id: 59,
      component: PwaB2bManualOrderUpload,
      path: Routes.PwaB2bManualOrderUpload.path
    },
    {
      id: 60,
      component: PwaB2bRefund,
      path: Routes.PwaB2bRefund.path,
    },
    {
      id: 61,
      component: PwaB2bPartnerPayments,
      path: Routes.PwaB2bPartnerPayments.path,
    },
    {
      id: 62,
      component: OrderVoucher,
      path: Routes.OrderVoucher.path,
    },
    {
      id: 63,
      component: ConsultationChatIndex,
      path: Routes.ConsultationChatIndex.path,
    },
    {
      id: 64,
      component: ConsultationChatList,
      path: Routes.ConsultationChatList.path,
    },
    {
      id: 65,
      component: ConsultationChatSpam,
      path: Routes.ConsultationChatSpam.path,
    },
    {
      id: 24,
      component: PwaB2bSecurityProvider,
      path: Routes.PwaB2bSecurityProvider.path,
    },
    {
      id: 24,
      component: PwaB2bUnit,
      path: Routes.PwaB2bUnit.path
    },
    {
      id: 24,
      component: PwaB2bSecurityProviderLayanan,
      path: Routes.PwaB2bSecurityProviderLayanan.path
    },
    {
      id: 24,
      component: PwaB2bDurasi,
      path: Routes.PwaB2bDurasi.path
    },
    {
      id: 24,
      component: PwaB2bSection,
      path: Routes.PwaB2bSection.path
    },
    {
      id: 24,
      component: PwaB2bProduct,
      path: Routes.PwaB2bProduct.path
    },
    {
      id: 24,
      component: PwaB2bProductSubSection,
      path: Routes.PwaB2bSubSectionProduct.path
    },
    {
      id: 24,
      component: PwaB2bSubSection,
      path: Routes.PwaB2bSubSection.path
    },
    {
      id: 24,
      component: PwaB2bOthersProduct,
      path: Routes.PwaB2bLainnyaOthersProduct.path
    },
    {
      id: 24,
      component: PwaB2bOthersProductSub,
      path: Routes.PwaB2bLainnyaOthersProductSub.path
    },
    {
      id: 24,
      component: PWaB2bOthersComponents,
      path: Routes.PwaB2bComponentOthers.path
    },
    {
      id: 24,
      component: ArtikelKategory,
      path: Routes.ArtikelKategory.path,
    },
    {
      id: 24,
      component: ArtikelIndex,
      path: Routes.ArtikelIndex.path,
    },
    {
      id: 70,
      component: TABInsidenData,
      path: Routes.TABInsiden.path,
    },
    {
      id: 70,
      component: TABInsidenDetail,
      path: Routes.TABInsidenDetail.path
    },
    {
      id: 72,
      component: TABResponder,
      path: Routes.TABResponder.path,
    },
    {
      id: 72,
      component: TABResponderDetail,
      path: Routes.TABResponderDetail.path
    },
    {
      id: 72,
      component: TABB2BAktivasiAkun,
      path: Routes.TABB2BAktivasiAkun.path
    },
    {
      id: 72,
      component: TABB2BTransaksi,
      path: Routes.TABB2BTransaksi.path
    },
    {
      id: 72,
      component: TABB2BTransaksiDetail,
      path: Routes.TABB2BTransaksiDetail.path
    },
    {
      id: 72,
      component: TABB2BInsiden,
      path: Routes.TABB2BInsiden.path
    },
    {
      id: 72,
      component: TABB2BInsidenDetail,
      path: Routes.TABB2BInsidenDetail.path
    },
    {
      id: 69,
      component: TABB2BOrder,
      path: Routes.TABB2BOrder.path
    },
    {
      id: 72,
      component: TABB2BUser,
      path: Routes.TABB2BUser.path
    },
    {
      id: 72,
      component: TABB2BDetailUser,
      path: Routes.TABB2BUserDetail.path
    },
    {
      id: 72,
      component: TABB2BResponder,
      path: Routes.TABB2BResponder.path
    },
    {
      id: 72,
      component: TABB2BResponderDetail,
      path: Routes.TABB2BResponderDetail.path
    },
    {
      id: 69,
      component: TABTransaksi,
      path: Routes.TABTransaksi.path
    },
    {
      id: 69,
      component: TABTransaksiDetail,
      path: Routes.TABTransaksiDetail.path
    },
    {
      id: 69,
      component: TABBanner,
      path: Routes.TABBanner.path
    },
    {
      id: 69,
      component: TABLiveLocation,
      path: Routes.TABLiveLocation.path
    },
    {
      id: 69,
      component: TABLiveLocationDetail,
      path: Routes.TABLiveLocationDetail.path
    },
    {
      id: 69,
      component: TABB2BKategoriUsaha,
      path: Routes.TABB2BKategoriUsaha.path
    },
    {
      id: 69,
      component: TABKategoriUsahaDetail,
      path: Routes.TABKategoriUsahaDetail.path
    },
    {
      id: 69,
      component: TABB2BMasterPaket,
      path: Routes.TABB2BMasterPaket.path
    },
    {
      id: 69,
      component: TABMasterPaketDetail,
      path: Routes.TABMasterPaketDetail.path
    },
    {
      id: 69,
      component: TABUser,
      path: Routes.TABUser.path
    },
    {
      id: 69,
      component: DataAkunEksternal,
      path: Routes.DataAkunExternal.path
    },
    {
      id: 69,
      component: DataAkunDetailExternal,
      path: Routes.DataDetailAkunExternal.path
    },
    {
      id: 69,
      component: DataAkunPartner,
      path: Routes.DataAkunPartner.path
    },
    {
      id: 69,
      component: DataAkunDetailPartner,
      path: Routes.DataAkunDetailPartner.path
    },
    {
      id: 69,
      component: DataAkunInternal,
      path: Routes.DataAkunInternal.path
    },
    {
      id: 69,
      component: DataAkunDetailInternal,
      path: Routes.DataDetailAkunInternal.path
    }
  ]);
  const [getReadWriteSubMenuData] = useState([
    {
      id: 1,
      path: Routes.TnosAdminUserCreate.path,
      component: TnosAdminUserCreate,
      type: 1,
      sub_menu_id: 45,
    },
    {
      id: 2,
      path: Routes.PartnerGuardCreate.path,
      component: PartnerGuardCreate,
      type: 1,
      sub_menu_id: 18,
    },
    {
      id: 3,
      path: Routes.PartnerGuardDetail.path,
      component: PartnerGuardDetail,
      type: 0,
      sub_menu_id: 18,
    },
    {
      id: 4,
      path: Routes.PartnerGuardUpdate.path,
      component: PartnerGuardUpdate,
      type: 1,
      sub_menu_id: 18,
    },
    {
      id: 5,
      path: Routes.PartnerGuardProfile.path,
      component: PartnerGuardProfile,
      type: 0,
      sub_menu_id: 18,
    },
    {
      id: 6,
      path: Routes.PartnerGuardBarcodes.path,
      component: PartnerGuardBarcodes,
      type: 0,
      sub_menu_id: 18,
    },
    {
      id: 7,
      path: Routes.PartnerLawyerDetail.path,
      component: PartnerLawyerDetail,
      type: 0,
      sub_menu_id: 19,
    },
    {
      id: 8,
      path: Routes.PartnerLawyerUpdate.path,
      component: PartnerLawyerUpdate,
      type: 1,
      sub_menu_id: 19,
    },
    {
      id: 9,
      path: Routes.PartnerLawyerProfile.path,
      component: PartnerLawyerProfile,
      type: 0,
      sub_menu_id: 19,
    },
    {
      id: 10,
      path: Routes.PartnerLawyerBarcodes.path,
      component: PartnerLawyerBarcodes,
      type: 0,
      sub_menu_id: 19,
    },
    {
      id: 11,
      path: Routes.TnosAdminUserUpdate.path,
      component: TnosAdminUserUpdate,
      type: 1,
      sub_menu_id: 45,
    },
    {
      id: 13,
      path: Routes.OrderOnProgressDetail.path,
      component: OrderOnProgressDetail,
      type: 0,
      sub_menu_id: 2,
    },
    {
      id: 14,
      path: Routes.MemberProfile.path,
      component: MemberProfile,
      type: 0,
      sub_menu_id: 24,
    },
    {
      id: 15,
      path: Routes.PwaB2bOrderDetail.path,
      component: PwaB2bOrderDetail,
      type: 0,
      sub_menu_id: 58,
    },
    // {
    //   id: 16,
    //   path: Routes.PWAB2bTransactionDetailData.path,
    //   component: PWAB2bTransactionDetailData,
    //   type: 0,
    //   sub_menu_id: 57,
    // },
    {
      id: 17,
      path: Routes.PwaB2bOrderExportPdf.path,
      component: PwaB2bOrderExportPdf,
      type: 0,
      sub_menu_id: 58,
    },
    {
      id: 18,
      path: Routes.PwaB2bTransactionExportPdf.path,
      component: PwaB2bTransactionExportPdf,
      type: 0,
      sub_menu_id: 57,
    },
    {
      id: 19,
      path: Routes.OrderVoucherDetail.path,
      component: OrderVoucherDetail,
      type: 0,
      sub_menu_id: 62,
    },
    {
      id: 20,
      path: Routes.OrderVoucherPembayaran.path,
      component: OrderVoucherPaymentDetail,
      type: 0,
      sub_menu_id: 62,
    },
    {
      id: 24,
      path: Routes.ArtikelCreate.path,
      component: AddArticle,
      type: 1,
      sub_menu_id: 18,
    },
    {
      id: 5,
      path: Routes.ArtikelDetail.path,
      component: ArticleDetail,
      type: 0,
      sub_menu_id: 18,
    },
    {
      id: 6,
      path: Routes.ArtikelUpdate.path,
      component: ArtikelUpdate,
      type: 0,
      sub_menu_id: 18,
    },
    {
      id: 7,
      path: Routes.KategoryCreate.path,
      component: KategoryCreate,
      type: 0,
      sub_menu_id: 19,
    },
    {
      id: 8,
      path: Routes.SubCategory.path,
      component: SubCategory,
      type: 1,
      sub_menu_id: 19,
    },
    {
      id: 9,
      path: Routes.SubKategoryList.path,
      component: SubKategoryList,
      type: 0,
      sub_menu_id: 19,
    },
    {
      id: 10,
      path: Routes.ArtikelTags.path,
      component: ArtikelTags,
      type: 0,
      sub_menu_id: 19,
    },
    {
      id: 11,
      path: Routes.TagsCreate.path,
      component: TagsCreate,
      type: 1,
      sub_menu_id: 45,
    },
  ]);
  const [getSubMenuIds, setSubMenuIds] = useState([]);
  const [getReadWriteSubMenuIds, setReadWriteSubMenuIds] = useState([]);
  const history = useHistory()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      fetch(`${process.env.REACT_APP_API_URL}/admin-group-menu-access/${localStorage.getItem("user_group_id")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json())
        .then((data) => {

          const subMenuIds = data[0].sub_menu_ids.split(",");
          const readWriteSubMenuIds = data[0].read_write_ids.split(",");
          setSubMenuIds(subMenuIds);
          setReadWriteSubMenuIds(readWriteSubMenuIds);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      history.push("/login");
    }
  }, [history]);

  return (
    <div>
      <Switch>
        {/* Halaman Login */}
        <RouteWithLoader exact path={Routes.Login.path} component={Login} />
        <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
        <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
        <RouteWithLoader
          exact
          path={Routes.ForgotPassword.path}
          component={ForgotPassword}
        />
        <RouteWithLoader
          exact
          path={Routes.ResetPassword.path}
          component={ResetPassword}
        />
        {/* Halaman yang tidak memerlukan login */}
        <RouteWithLoader
          exact
          path={Routes.PwaB2bOrderPesan.path}
          component={PwaB2bOrderPesan}
        />
        {/* Routes yang memerlukan login */}
        {isLoggedIn && (
          <>
            <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
            <RouteWithLoader
              exact
              path={Routes.NotFound.path}
              component={NotFoundPage}
            />
            <RouteWithLoader
              exact
              path={Routes.ServerError.path}
              component={ServerError}
            />
            {/* Pages */}
            {getSubMenuData?.map((item) => {

              return (
                getSubMenuIds?.includes(item.id.toString()) && (
                  <RouteWithSidebar
                    key={item.id}
                    exact
                    path={item.path}
                    component={item.component}
                  />
                )
              );
            })}
            {/* Pages (Read) */}
            {getReadWriteSubMenuData?.map((item) => {
              // If item.menu_id in getSubMenuIds, then render the component
              return getSubMenuIds?.includes(item.sub_menu_id.toString()) &&
                item.type === 0 ? (
                <RouteWithSidebar
                  key={item.id}
                  exact
                  path={item.path}
                  component={item.component}
                />
              ) : (
                ""
              );
            })}
            {/* Pages (Read and Write) */}
            {getReadWriteSubMenuData?.map((item) => {
              // If item.menu_id in getSubMenuIds, then render the component
              return getReadWriteSubMenuIds?.includes(
                item.sub_menu_id.toString()
              ) && item.type === 1 ? (
                <RouteWithSidebar
                  key={item.id}
                  exact
                  path={item.path}
                  component={item.component}
                />
              ) : (
                ""
              );
            })}
            {/* pages */}
            <RouteWithSidebar
              exact
              path={Routes.DashboardOverview.path}
              component={DashboardOverview}
            />
            <RouteWithSidebar
              exact
              path={Routes.Upgrade.path}
              component={Upgrade}
            />

            {/* dicki  */}
            <RouteWithSidebar
              exact
              path={Routes.TnosGems.path}
              component={TnosGemsPembelian}
            />
            <RouteWithSidebar
              exact
              path={Routes.TnosGemsProduct.path}
              component={TnosGemsProduct}
            />
            <RouteWithSidebar
              exact
              path={Routes.MarketingMessageBlash.path}
              component={MarketingMessageBlash}
            />
            <RouteWithSidebar
              exact
              path={Routes.Transactions.path}
              component={Transactions}
            />
            <RouteWithSidebar
              exact
              path={Routes.Settings.path}
              component={Settings}
            />
            <RouteWithSidebar
              exact
              path={Routes.BootstrapTables.path}
              component={BootstrapTables}
            />
            {/* components */}
            <RouteWithSidebar
              exact
              path={Routes.Accordions.path}
              component={Accordion}
            />
            <RouteWithSidebar
              exact
              path={Routes.Alerts.path}
              component={Alerts}
            />
            <RouteWithSidebar
              exact
              path={Routes.Badges.path}
              component={Badges}
            />
            <RouteWithSidebar
              exact
              path={Routes.Breadcrumbs.path}
              component={Breadcrumbs}
            />
            <RouteWithSidebar
              exact
              path={Routes.Buttons.path}
              component={Buttons}
            />
            <RouteWithSidebar
              exact
              path={Routes.Forms.path}
              component={Forms}
            />
            <RouteWithSidebar
              exact
              path={Routes.Modals.path}
              component={Modals}
            />
            <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
            <RouteWithSidebar
              exact
              path={Routes.Navbars.path}
              component={Navbars}
            />
            <RouteWithSidebar
              exact
              path={Routes.Pagination.path}
              component={Pagination}
            />
            <RouteWithSidebar
              exact
              path={Routes.Popovers.path}
              component={Popovers}
            />
            <RouteWithSidebar
              exact
              path={Routes.Progress.path}
              component={Progress}
            />
            <RouteWithSidebar
              exact
              path={Routes.Tables.path}
              component={Tables}
            />
            <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
            <RouteWithSidebar
              exact
              path={Routes.Tooltips.path}
              component={Tooltips}
            />
            <RouteWithSidebar
              exact
              path={Routes.Toasts.path}
              component={Toasts}
            />
            {/* documentation */}
            <RouteWithSidebar
              exact
              path={Routes.DocsOverview.path}
              component={DocsOverview}
            />
            <RouteWithSidebar
              exact
              path={Routes.DocsDownload.path}
              component={DocsDownload}
            />
            <RouteWithSidebar
              exact
              path={Routes.DocsQuickStart.path}
              component={DocsQuickStart}
            />
            <RouteWithSidebar
              exact
              path={Routes.DocsLicense.path}
              component={DocsLicense}
            />
            <RouteWithSidebar
              exact
              path={Routes.DocsFolderStructure.path}
              component={DocsFolderStructure}
            />
            <RouteWithSidebar
              exact
              path={Routes.DocsBuild.path}
              component={DocsBuild}
            />
            <RouteWithSidebar
              exact
              path={Routes.DocsChangelog.path}
              component={DocsChangelog}
            />
            <RouteWithSidebar
              exact
              path={Routes.CustomPrint.path}
              component={CustomPrint}
            />
            {/* <Redirect to={Routes.NotFound.path} />; */}
          </>
        )}
      </Switch>
    </div>
  );
};