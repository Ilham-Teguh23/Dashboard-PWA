import React, { useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartPie,
    faSignOutAlt,
    faTimes,
    faUser,
    faShoppingCart,
    faCreditCard,
    faTrademark,
    faUsers,
    faInfo,
    faVideo,
    faHome,
    faBriefcase,
    faComments,
    faPen,
    faEdit,
    faBook,
} from "@fortawesome/free-solid-svg-icons";
import {
    Nav,
    Badge,
    Image,
    Button,
    Accordion,
    Navbar,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { Routes } from "../routes";
import ReactHero from "../assets/img/Logo-New-TNOS.png";
import ProfilePicture from "../assets/img/Logo-New-TNOS.png";
import HumanizeText from "./HumanizeText";

export default (props = {}) => {
    const location = useLocation();
    const { pathname } = location;
    const [show, setShow] = useState(false);
    const [getMenuData] = useState([
        {
            id: 1,
            eventKey: "order/",
            title: "B2C",
            icon: faShoppingCart,
            children: [
                {
                    id: 1,
                    title: "Index",
                    link: Routes.OrderIndex.path,
                },
                {
                    id: 2,
                    title: "Transaksi",
                    link: Routes.OrderTransaction.path
                },
                {
                    id: 2,
                    title: "Penugasan",
                    link: Routes.OrderOnProgress.path,
                },
                {
                    id: 5,
                    title: "Selesai",
                    link: Routes.OrderSuccess.path,
                },
                {
                    id: 6,
                    title: "Dibatalkan",
                    link: Routes.OrderCancel.path,
                },
                {
                    id: 62,
                    title: "Voucher",
                    link: Routes.OrderVoucher.path,
                },
                {
                    id: 12,
                    title: "Pendapatan",
                    link: Routes.PaymentIn.path,
                },
            ],
        },
        {
            id: 13,
            eventKey: "tab/",
            title: "TAB",
            icon: faEdit,
            children: [
                // {
                //     id: 70,
                //     title: "Index",
                //     link: Routes.TABIndex.path
                // },
                {
                    id: 70,
                    title: "Transaksi",
                    link: Routes.TABTransaksi.path,
                },
                {
                    id: 70,
                    title: "Insiden",
                    link: Routes.TABInsiden.path,
                },
                {
                    id: 73,
                    title: "User",
                    link: Routes.TABUser.path
                },
                {
                    id: 72,
                    title: "Responder",
                    link: Routes.TABResponder.path,
                },
                {
                    id: 73,
                    title: "Banner",
                    link: Routes.TABBanner.path,
                },
                {
                    id: 73,
                    title: "Pesan Massal",
                    link: Routes.TABPesanMassal.path
                }
                // {
                //     id: 73,
                //     title: "Live Location",
                //     link: Routes.TABLiveLocation.path
                // }
            ],
        },
        {
            id: 8,
            eventKey: "tab-b2b/",
            title: "TAB B2B",
            icon: faBook,
            children: [
                // {
                //   id: 69,
                //   title: "Order",
                //   link: Routes.TABB2BOrder.path
                // },
                // {
                //   id: 69,
                //   title: "User",
                //   link: Routes.TABB2BUser.path
                // },
                {
                    id: 73,
                    title: "Transaksi",
                    link: Routes.TABB2BTransaksi.path
                },
                {
                    id: 73,
                    title: "Insiden",
                    link: Routes.TABB2BInsiden.path
                },
                {
                    id: 73,
                    title: "User",
                    link: Routes.TABB2BUser.path
                },
                {
                    id: 73,
                    title: "Responder",
                    link: Routes.TABB2BResponder.path
                },
                {
                    id: 73,
                    title: "Aktivasi Akun",
                    link: Routes.TABB2BAktivasiAkun.path
                },
                {
                    id: 73,
                    title: "Master Paket",
                    link: Routes.TABB2BMasterPaket.path,
                },
                {
                    id: 73,
                    title: "Kategori Usaha",
                    link: Routes.TABB2BKategoriUsaha.path
                },
                {
                    id: 73,
                    title: "Pesan Massal",
                    link: Routes.TABB2BPesanMassal.path
                }
            ]
        },
        {
            id: 12,
            eventKey: "data-akun/",
            title: "Data Akun",
            icon: faUser,
            children: [
                {
                    id: 69,
                    title: "SipLah",
                    link: Routes.DataAkunExternal.path
                },
                {
                    id: 69,
                    title: "Partner",
                    link: Routes.DataAkunPartner.path
                },
                {
                    id: 69,
                    title: "Website",
                    link: Routes.DataAkunInternal.path
                }
            ]
        },
        {
            id: 11,
            eventKey: "consultation-chat/",
            title: "Chat Konsultasi",
            icon: faComments,
            children: [
                {
                    id: 63,
                    title: "Index",
                    link: Routes.ConsultationChatIndex.path,
                },
                {
                    id: 64,
                    title: "Konsultasi",
                    link: Routes.ConsultationChatList.path,
                },
                {
                    id: 65,
                    title: "Spam",
                    link: Routes.ConsultationChatSpam.path,
                },
            ],
        },
        {
            id: 10,
            eventKey: "pwa-b2b/",
            title: "PWA B2B",
            icon: faBriefcase,
            children: [
                {
                    id: 57,
                    title: "Transaksi",
                    link: Routes.PwaB2bTransaction.path,
                },
                {
                    id: 58,
                    title: "Pemesanan",
                    link: Routes.PwaB2bOrder.path,
                },
                {
                    id: 59,
                    title: "Pendapatan",
                    link: Routes.PwaB2bIncome.path,
                },
                {
                    id: 64,
                    title: "Pembayaran",
                    link: Routes.PwaB2bPembayaran.path,
                },
                {
                    id: 60,
                    title: "Manual Order",
                    link: Routes.PwaB2bManualOrder.path
                },
                {
                    id: 61,
                    title: "Security Provider",
                    link: Routes.PwaB2bSecurityProvider.path
                },
                {
                    id: 62,
                    title: "Unit",
                    link: Routes.PwaB2bUnit.path
                },
                {
                    id: 63,
                    title: "Komponen Lainnya",
                    link: Routes.PwaB2bComponentOthers.path
                }
                // {
                //   id: 60,
                //   title: "Refund",
                //   link: Routes.PwaB2bRefund.path,
                // },
                // {
                //   id: 61,
                //   title: "Pembayaran Mitra",
                //   link: Routes.PwaB2bPartnerPayments.path,
                // },
                // {
                //   id: 62,
                //   title: "Voucher",
                //   link: Routes.PwaB2bVoucher.path,
                // },
            ],
        },
        {
            id: 2,
            eventKey: "payment/",
            title: "Pembayaran",
            icon: faCreditCard,
            children: [
                {
                    id: 7,
                    title: "Index",
                    link: Routes.PaymentIndex.path,
                },
                {
                    id: 11,
                    title: "Penugasan",
                    link: Routes.PaymentOnProgress.path,
                },
                {
                    id: 16,
                    title: "Penarikan",
                    link: Routes.PaymentWithdrawal.path,
                },
                {
                    id: 53,
                    title: "Pengembalian",
                    link: Routes.PaymentRefund.path,
                },
                {
                    id: 15,
                    title: "Keluar",
                    link: Routes.PaymentOut.path,
                },
            ],
        },
        {
            id: 3,
            eventKey: "partner/",
            title: "Mitra",
            icon: faTrademark,
            children: [
                {
                    id: 17,
                    title: "Index",
                    link: Routes.PartnerIndex.path,
                },
                {
                    id: 18,
                    title: "Pengamanan",
                    link: Routes.PartnerGuard.path,
                },
                {
                    id: 19,
                    title: "Pengacara",
                    link: Routes.PartnerLawyer.path,
                },
                {
                    id: 21,
                    title: "Ditangguhkan",
                    link: Routes.PartnerSuspended.path,
                },
                {
                    id: 22,
                    title: "Blokir",
                    link: Routes.PartnerBlocked.path,
                },
            ],
        },
        {
            id: 4,
            eventKey: "member/",
            title: "Pengguna",
            icon: faUsers,
            children: [
                {
                    id: 23,
                    title: "Index",
                    link: Routes.MemberIndex.path,
                },
                {
                    id: 24,
                    title: "Aktif",
                    link: Routes.MemberActive.path,
                },
                {
                    id: 25,
                    title: "Tidak Aktif",
                    link: Routes.MemberNonActive.path,
                },
                {
                    id: 27,
                    title: "Ditangguhkan",
                    link: Routes.MemberSuspended.path,
                },
                {
                    id: 29,
                    title: "Blokir",
                    link: Routes.MemberBlocked.path,
                },
            ],
        },
        // {
        //   id: 8,
        //   eventKey: "tnos-gems/",
        //   title: "TNOS Gems",
        //   icon: faCoins,
        //   children: [
        //     {
        //       id: 54,
        //       title: "Pembelian",
        //       link: Routes.TnosGems.path,
        //     },
        //     {
        //       id: 56,
        //       title: "Produk",
        //       link: Routes.TnosGemsProduct.path,
        //     },
        //   ],
        // },
        {
            id: 5,
            eventKey: "information/",
            title: "Informasi",
            icon: faInfo,
            children: [
                // {
                //   id: 32,
                //   title: "Index",
                //   link: Routes.InformationIndex.path,
                // },
                // {
                //   id: 50,
                //   title: "Biaya",
                //   link: Routes.InformationFee.path,
                // },
                // {
                //   id: 33,
                //   title: "Diskon",
                //   link: Routes.InformationDiscount.path,
                // },
                // {
                //   id: 34,
                //   title: "Promosi",
                //   link: Routes.InformationPromotion.path,
                // },
                {
                    id: 38,
                    title: "Pesan Masal",
                    link: Routes.MarketingMessageBlash.path,
                },
                // {
                //   id: 38,
                //   title: "Website",
                //   link: Routes.InformationWebsite.path,
                // },
            ],
        },
        {
            id: 6,
            eventKey: "live-monitoring/",
            title: "Pemantauan Langsung",
            icon: faVideo,
            children: [
                {
                    id: 39,
                    title: "Index",
                    link: Routes.LiveMonitoringIndex.path,
                },
                // {
                //   id: 43,
                //   title: "Tombol Darurat",
                //   link: Routes.LiveMonitoringPanicButton.path,
                // },
            ],
        },
        {
            id: 9,
            eventKey: "pemasaran",
            title: "Pemasaran",
            icon: faHome,
            children: [
                {
                    id: 55,
                    title: "Pesan Masal",
                    link: Routes.MarketingMessageBlash.path,
                },
            ],
        },
        {
            id: 7,
            eventKey: "tnos-admin/",
            title: "TNOS Admin",
            icon: faUser,
            children: [
                // {
                //   id: 44,
                //   title: "Index",
                //   link: Routes.TnosAdminIndex.path,
                // },
                {
                    id: 45,
                    title: "Pengguna",
                    link: Routes.TnosAdminUser.path,
                },
                {
                    id: 49,
                    title: "Grup",
                    link: Routes.TnosAdminGroup.path,
                },
            ],
        },
        {
            id: 12,
            eventKey: "artikel/",
            title: "Artikel",
            icon: faPen,
            children: [
                {
                    id: 11,
                    title: "List",
                    link: Routes.ArtikelIndex.path,
                },
                {
                    id: 12,
                    title: "Tulis Artikel",
                    link: Routes.ArtikelCreate.path,
                },
                {
                    id: 65,
                    title: "Kategori",
                    link: Routes.ArtikelKategory.path,
                },
            ],
        },
    ]);
    const [getMenuIds, setMenuIds] = useState([]);
    const [getSubMenuIds, setSubMenuIds] = useState([]);

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_API_URL
            }/admin-group-menu-access/${localStorage.getItem("user_group_id")}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {

                // console.log("ADMIN GROUP MENU ACCESS");
                // console.log(data);
            
                const subMenuIds = data[0].sub_menu_ids.split(",");
                setSubMenuIds(subMenuIds);

                fetch(`${process.env.REACT_APP_API_URL}/sub-menu`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        const menuAllowed = data.filter((item) => {
                            return subMenuIds.includes(item.id.toString());
                        });
                        const menuAllowedIds = menuAllowed.map((item) => {
                            return item.menu_id.toString();
                        });
                        // Remove the duplicate ids
                        const uniqueMenuAllowedIds = [...new Set(menuAllowedIds)];

                        // console.log("Unique Menu");
                        // console.log(uniqueMenuAllowedIds);
                        
                        setMenuIds(uniqueMenuAllowedIds);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const showClass = show ? "show" : "";

    const onCollapse = () => setShow(!show);

    const CollapsableNavItem = (props) => {
        const { eventKey, title, icon, children = null } = props;
        const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

        return (
            <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
                <Accordion.Item eventKey={eventKey}>
                    <Accordion.Button
                        as={Nav.Link}
                        className="d-flex justify-content-between align-items-center"
                    >
                        <span>
                            <span className="sidebar-icon">
                                <FontAwesomeIcon icon={icon} />{" "}
                            </span>
                            <span className="sidebar-text">
                                {title}
                            </span>
                        </span>
                    </Accordion.Button>
                    <Accordion.Body className="multi-level">
                        <Nav className="flex-column">{children}</Nav>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    };

    const NavItem = (props) => {
        const {
            title,
            link,
            external,
            target,
            icon,
            image,
            badgeText,
            badgeBg = "secondary",
            badgeColor = "primary",
        } = props;
        const classNames = badgeText
            ? "d-flex justify-content-start align-items-center justify-content-between"
            : "";
        const navItemClassName = link === pathname ? "active" : "";
        const linkProps = external ? { href: link } : { as: Link, to: link };

        return (
            <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
                <Nav.Link {...linkProps} target={target} className={classNames}>
                    <span>
                        {icon ? (
                            <span className="sidebar-icon">
                                <FontAwesomeIcon icon={icon} />{" "}
                            </span>
                        ) : null}
                        {image ? (
                            <Image
                                src={image}
                                width={20}
                                height={20}
                                className="sidebar-icon svg-icon"
                            />
                        ) : null}

                        <span className="sidebar-text">
                            {title}
                        </span>
                    </span>
                    {badgeText ? (
                        <Badge
                            pill
                            bg={badgeBg}
                            text={badgeColor}
                            className="badge-md notification-count ms-2"
                        >
                            {badgeText}
                        </Badge>
                    ) : null}
                </Nav.Link>
            </Nav.Item>
        );
    };

    return (
        <>
            <Navbar
                expand={false}
                collapseOnSelect
                variant="dark"
                className="navbar-theme-primary px-4 d-md-none"
            >
                <Navbar.Brand
                    className="me-lg-5"
                    as={Link}
                    to={Routes.DashboardOverview.path}
                >
                    <Image src={ReactHero} className="navbar-brand-light" />
                </Navbar.Brand>
                <Navbar.Toggle
                    as={Button}
                    aria-controls="main-navbar"
                    onClick={onCollapse}
                >
                    <span className="navbar-toggler-icon" />
                </Navbar.Toggle>
            </Navbar>
            <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
                <SimpleBar
                    className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
                >
                    <div className="sidebar-inner px-4 pt-3">
                        <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                            <div className="d-flex align-items-center">
                                <div className="user-avatar lg-avatar me-4">
                                    <Image
                                        src={ProfilePicture}
                                        className="card-img-top rounded-circle border-white"
                                    />
                                </div>
                                <div className="d-block">
                                    <h6>
                                        Hi, <HumanizeText text={localStorage.getItem("username")} />
                                    </h6>
                                    <Button
                                        as={Link}
                                        variant="secondary"
                                        size="xs"
                                        to={Routes.Signin.path}
                                        className="text-dark"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "}
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                            <Nav.Link
                                className="collapse-close d-md-none"
                                onClick={onCollapse}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </Nav.Link>
                        </div>
                        <Nav className="flex-column pt-3 pt-md-0">
                            <NavItem title="TNOS Dashboard" image={ReactHero} />
                            <NavItem
                                title="Dashboard"
                                link={Routes.DashboardOverview.path}
                                icon={faChartPie}
                            />
                            {getMenuData?.map((menu) => {

                                // console.log("Menu Ada");
                                // console.log(menu);
                                

                                return (
                                    getMenuIds?.includes(menu.id.toString()) && (
                                        <CollapsableNavItem
                                            key={menu.id}
                                            eventKey={menu.eventKey}
                                            title={
                                                menu.title
                                            }
                                            icon={menu.icon}
                                        >
                                            {menu.children.map((subMenu) => {
                                                return (
                                                    getSubMenuIds?.includes(subMenu.id.toString()) && (
                                                        <NavItem
                                                            key={subMenu.id}
                                                            title={subMenu.title}
                                                            link={subMenu.link}
                                                            icon={subMenu.id}
                                                        />
                                                    )
                                                );
                                            })}
                                        </CollapsableNavItem>
                                    )
                                );
                            })}

                            {/* <Button
                  as={Link}
                  to={Routes.Upgrade.path}
                  variant="secondary"
                  className="upgrade-to-pro"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
                </Button> */}
                        </Nav>
                    </div>
                </SimpleBar>
            </CSSTransition>
        </>
    );
};