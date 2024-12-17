import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Row, Table } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import MyModal from "./MyModal";
import MyModalTAB from "./MyModalTAB";
import { faBars, faFileExcel, faPlus, faSync, faThList } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import ReactExport from "react-export-excel";
import ReadableDateTime from "./ReadableDateTime";

export const TnosDataTable = (props) => {

    const location = useLocation()

    const isSecurityProviderRoute =
        location.pathname === "/pwa-b2b/security-provider" ||
        location.pathname.startsWith("/pwa-b2b/security-provider/") ||
        location.pathname.startsWith("/pwa-b2b/layanan/") ||
        location.pathname.startsWith("/pwa-b2b/section") ||
        location.pathname.endsWith("/others") ||
        location.pathname.includes("/unit") ||
        location.pathname.includes("/component-others") ||
        location.pathname.endsWith("/others-prod") ||
        location.pathname.endsWith("/others-prod-sub")
    const isTAB = location.pathname === "/tab/kategori-usaha" || location.pathname === "/tab/banner";
    const isManualOrder = location.pathname === "/pwa-b2b/manual-order"

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const columnsConfig = {
        "pwa-transaction": [
            { label: "No. Invoice", value: "tnos_invoice_id" },
            { label: "ID Referensi", value: "external_id" },
            { label: "Status Transaksi", value: "payment_status" },
            { label: "Member", value: "name" },
            { label: "Payment Method", value: "payment_method" },
            { label: "Payment Channel", value: "payment_channel" },
            { label: "Payment Status", value: "payment_status" },
            { label: "Layanan", value: "layanan" },
            { label: "Waktu Pesanan Dibuat", value: "waktu_pesanan" },
            { label: "Waktu Transaksi", value: "waktu_transaksi" },
            { label: "Jumlah", value: "jumlah" },
        ],
        "tab-transaction": [
            { label: "Member Code", value: "member_code" },
            { label: "ID Transaksi", value: "external_id" },
            { label: "Status Transaksi", value: "status_transaksi" },
            { label: "Nama Paket", value: "nama_paket" },
            { label: "Waktu Pesanan Dibuat", value: "waktu_dibuat" },
            { label: "Waktu Transaksi", value: "waktu_transaksi" },
            { label: "Membership", value: "member_code" },
            { label: "Nama", value: "name" },
            { label: "Harga", value: "harga" },
        ],
        "tab-b2b-transaction": [
            { label: "ID Transaksi", value: "external_id" },
            { label: "Status Transaksi", value: "status_transaksi" },
            { label: "Pembeli", value: "name" },
            { label: "Nama Responder", value: "nama_responder" },
            { label: "Nama Paket", value: "nama_paket" },
            { label: "Kategori Pembelian", value: "kategori_pembelian" },
            { label: "Jenis Pembelian", value: "jenis_pembelian" },
            { label: "Harga", value: "harga" },
            { label: "Tanggal Transaksi", value: "tanggal_transaksi" }
        ],
        "tab-user": [
            { label: "Nama", value: "mmbr_name" },
            { label: "Kode Member", value: "mmbr_code" },
            { label: "Tanggal Mendaftar", value: "mmbr_date_insert" },
            { label: "No. HP", value: "mmbr_phone" },
            { label: "Email", value: "mmbr_email" },
        ],
        "akun-external": [
            { label: "Kode Organisasi", value: "institution_id" },
            { label: "Kategori", value: "sub_category" },
            { label: "Nama", value: "nama" },
            { label: "Email", value: "email" },
            { label: "Username", value: "username" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Kode Unik", value: "unique_institution_id" },
        ],
        "akun-partner": [
            { label: "Kode Organisasi", value: "institution_id" },
            { label: "Kategori", value: "sub_category" },
            { label: "Nama", value: "nama" },
            { label: "Email", value: "email" },
            { label: "Username", value: "username" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Kode Unik", value: "unique_institution_id" },
        ],
        "akun-internal": [
            { label: "Kategori", value: "bisnis_category" },
            { label: "Nama", value: "nama" },
            { label: "Email", value: "email" },
            { label: "Username", value: "username" },
            { label: "Nomor HP", value: "phone_number" },
        ],
        "tab-b2b-user": [
            { label: "Nama", value: "nama" },
            { label: "Username", value: "username" },
            { label: "Email", value: "email" },
            { label: "Kode Negara", value: "country_code" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Nama Akun", value: "nama_akun" },
            { label: "Status", value: "status_akun" },
        ],
        "tab-b2b-responder": [
            { label: "Tanggal", value: "tanggal" },
            { label: "Nama", value: "username" },
            { label: "Email", value: "email" },
            { label: "Username", value: "country_code" },
            { label: "Kode Negara", value: "phone_number" },
            { label: "Nomor HP", value: "tanggal" },
            { label: "Organisasi", value: "nama_akun" },
            { label: "Email Organisasi", value: "email_akun" },
            { label: "Kode Member Akun", value: "kode_member" }
        ],
        "tab-b2b-insiden": [
            { label: "Tanggal", value: "tanggal" },
            { label: "Jam", value: "jam" },
            { label: "Nama", value: "nama" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Status", value: "status" },
            { label: "Nama Responder", value: "responder_name" },
            { label: "Nomor HP Responder", value: "responder_phone_number" },
            { label: "Organisasi", value: "organisasi" }
        ],
        "tab-b2b-master-paket": [
            { label: "Nama Paket", value: "nama_paket" },
            { label: "Limit User", value: "limit_user" },
            { label: "Limit Kontak", value: "limit_contact" },
            { label: "Durasi Waktu", value: "durationDate" },
            { label: "Harga", value: "harga" }
        ],
        "tab-kategori-usaha": [
            { label: "Kode", value: "code" },
            { label: "Nama", value: "nama" },
            { label: "Faktor Resiko", value: "nilai_x" }
        ],
        "pwa-b2b-order": [
            { label: "No. Invoice", value: "tnos_invoice_id" },
            { label: "ID Referensi", value: "external_id" },
            { label: "Waktu Transaksi", value: "waktu_transaksi" },
            { label: "Status Pemesanan", value: "orderStatus" },
            { label: "Layanan", value: "layanan" },
            { label: "Member", value: "name" },
            { label: "Partner", value: "partner_name" },
            { label: "Jumlah", value: "jumlah" }
        ],
        "pwa-b2b-income": [
            { label: "No. Invoice", value: "tnos_invoice_id" },
            { label: "ID Referensi", value: "invoice_id" },
            { label: "Waktu Transaksi", value: "waktu_transaksi" },
            { label: "Status Pemesanan", value: "status_pemesanan" },
            { label: "Layanan", value: "layanan" },
            { label: "Pendapatan", value: "pendapatan" }
        ],
        "member-active": [
            { label: "Nama", value: "mmbr_name" },
            { label: "Kode Member", value: "mmbr_code" },
            { label: "Tanggal Mendaftar", value: "tanggal_mendaftar" },
            { label: "No. HP", value: "mmbr_phone" },
            { label: "Email", value: "mmbr_email" }
        ],
        "artikel-tags": [
            { label: "Nama", value: "name" },
            { label: "Dibuat Tanggal", value: "created_at" }
        ],
        "artikel-kategori": [
            { label: "Nama", value: "name" },
            { label: "Dibuat Tanggal", value: "created_at" }
        ],
        "artikel-sub-kategori": [
            { label: "Nama", value: "name" },
            { label: "Dibuat Tanggal", value: "created_at" }
        ],
        "artikel-data": [
            { label: "Judul Artikel", value: "title" },
            { label: "Kategori", value: "category" },
            { label: "Penulis", value: "writer_name" },
            { label: "Status", value: "status" },
        ],
        "tnos-admin/user": [
            { label: "Nama Lengkap", value: "fullname" },
            { label: "Username", value: "username" },
            { label: "Grup", value: "group_name" }
        ],
        "detail-akun-internal": [
            { label: "Nama", value: "nama" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Jam", value: "jam" },
            { label: "Nama Responder", value: "responder_name" },
            { label: "Nomor HP Responder", value: "responder_phone_number" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Status", value: "status" },
        ],
        "export-data-security-provider": [
            { label: "Nama Security Provider", value: "name_sc" },
            { label: "Nama PT", value: "name_pt" },
            { label: "Slug", value: "slug" },
            { label: "Deskripsi", value: "description" },
            { label: "Status", value: "status" }
        ],
        "order-voucher-transaksi": [
            { label: "ID", value: "id" },
            { label: "ID Pengguna", value: "user_id" },
            { label: "Tanggal", value: "created_at" },
            { label: "Voucher (Masuk + / Keluar -)", value: "amount" },
            { label: "Deskripsi", value: "description" }
        ],
        "pwa-b2b-pembayaran": [
            { label: "ID", value: "id" },
            { label: "ID Invoice", value: "invoice_id" },
            { label: "ID User", value: "user_id" },
            { label: "Jumlah", value: "amount" },
            { label: "Deskripsi", value: "description" },
            { label: "Status Pemesanan", value: "status_order" },
            { label: "Status Pembayaran", value: "payment_status" },
            { label: "Tanggal Dibuat", value: "created_at" },
        ],
        "pwa-b2b-penyesuaian": [
            { label: "ID", value: "id" },
            { label: "ID Pengguna", value: "user_id" },
            { label: "Voucher (Masuk + / Keluar -)", value: "in_point" },
            { label: "Voucher Sebelumnya", value: "before_point" },
            { label: "Sisa Voucher", value: "point" },
            { label: "Deskripsi", value: "description" },
            { label: "Tanggal Dibuat", value: "created_at" },
        ],
        "order-cancel": [
            { label: "ID", value: "id" },
            { label: "ID Pemesanan", value: "sid" },
            { label: "No. Invoice", value: "no_invoice" },
            { label: "Waktu Pemesanan", value: "date_insert" },
            { label: "Jumlah", value: "price" },
            { label: "Kode Member", value: "membercode" },
            { label: "Kode Mitra", value: "mitracode" },
            { label: "Tipe Mitra", value: "type" },
            { label: "Status", value: "status" },
            { label: "Waktu Selesai", value: "waktu_selesai" },
        ],
        "order-on-progress": [
            { label: "ID", value: "id" },
            { label: "ID Pemesanan", value: "sid" },
            { label: "No. Invoice", value: "no_invoice" },
            { label: "Waktu Pemesanan", value: "date_insert" },
            { label: "Jumlah", value: "price" },
            { label: "Kode Member", value: "membercode" },
            { label: "Kode Mitra", value: "mitracode" },
            { label: "Tipe Mitra", value: "type" },
            { label: "Status", value: "status" },
            { label: "Waktu Selesai", value: "waktu_selesai" }
        ],
        "order-success": [
            { label: "ID", value: "id" },
            { label: "ID Pemesanan", value: "sid" },
            { label: "No. Invoice", value: "no_invoice" },
            { label: "Waktu Pemesanan", value: "date_insert" },
            { label: "Jumlah", value: "price" },
            { label: "Kode Member", value: "membercode" },
            { label: "Kode Mitra", value: "mitracode" },
            { label: "Tipe Mitra", value: "type" },
            { label: "Status", value: "status" },
            { label: "Waktu Selesai", value: "waktu_selesai" }
        ],
        "tab-insiden": [
            { label: "Nama", value: "nama" },
            { label: "No. Handphone", value: "phone_number" },
            { label: "Status", value: "status" },
            { label: "Responder", value: "responder_name" },
            { label: "Nomor HP Responder", value: "phone_number_responder" },
        ],
        "tab-responder": [
            { label: "Nama", value: "name" },
            { label: "Kode Member", value: "member_code" },
            { label: "Tanggal Mendaftar", value: "tanggal_mendaftar" },
            { label: "No. Handphone", value: "phone_number" },
            { label: "Email", value: "email" },
            { label: "Kontak Pengguna", value: "kontak_pengguna" }
        ],
        "detail-akun-user": [
            { label: "Nama", value: "name" },
            { label: "Nomor HP", value: "nomor_hp" },
            { label: "Username", value: "username" },
            { label: "Status", value: "account_status_id" },
        ],
        "detail-akun-responder": [
            { label: "Nama", value: "name" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Username", value: "username" },
            { label: "Status", value: "status" },
            { label: "Org", value: "org" }
        ],
        "detail-akun-partner": [
            { label: "Nama", value: "name" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Email", value: "email" },
            { label: "Kode Referensi", value: "unique_responder_id" },
            { label: "Tanggal", value: "register_at" },
        ],
        "detail-akun-insiden-siplah": [
            { label: "Nama", value: "nama" },
            { label: "Nomor HP", value: "phone_number" },
            { label: "Jam", value: "jam" },
            { label: "Nama Responder", value: "responder_name" },
            { label: "Nomor HP Responder", value: "responder_phone_number" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Status", value: "status" },
        ],
        "detail-akun-user-siplah": [
            { label: "Nama", value: "nama" },
            { label: "Nomor HP", value: "nomor_hp" },
            { label: "Username", value: "username" },
            { label: "Status", value: "status" },
        ],
        "pwa-b2b-unit": [
            { label: "Satuan", value: "satuan" },
            { label: "Slug", value: "slug" },
            { label: "Status", value: "status" }
        ],
        "layanan-security-provider": [
            { label: "Security Provider", value: "name_sc" },
            { label: "Nama PT", value: "name_pt" },
            { label: "Nama Layanan", value: "name" },
            { label: "Slug", value: "slug" },
        ],
        "durasi-security-provider": [
            { label: "Layanan", value: "layanan" },
            { label: "Durasi", value: "durasi" },
            { label: "Status", value: "status" },
        ],
        "others-component": [
            { label: "Komponen Lainnya", value: "komponen" },
            { label: "Slug", value: "slug" },
            { label: "Status", value: "status" },
        ],
        "sub-section": [
            { label: "Nama Section", value: "nama_section" },
            { label: "Nama Sub Section", value: "name" },
            { label: "Slug", value: "slug" },
        ],
        "product-sub-section": [
            { label: "Nama Section", value: "nama_section" },
            { label: "Kolom", value: "column" },
            { label: "Harga", value: "harga" },
        ],
        "others-prod-sub": [
            { label: "Sub Section Produk", value: "sub_section_product" },
            { label: "Kolom Lainnya", value: "others_column" },
        ],
        "others-prod": [
            { label: "Sub Section Produk", value: "sub_section_product" },
            { label: "Kolom Lainnya", value: "others_column" },
        ],
        "product-section": [
            { label: "Nama Section", value: "sections" },
            { label: "Kolom", value: "column" },
            { label: "Harga", value: "harga" }
        ],
        "payment-on-progress": [
            { label: "ID Pemesanan", value: "order_id" },
            { label: "Status Pemesanan", value: "order_status" },
            { label: "Tipe Pembayaran", value: "payment_type" },
            { label: "Jumlah", value: "gross_amount" },
            { label: "Harga Invoice", value: "invoice_price" },
            { label: "Pendapatan Mitra", value: "order_id" },
            { label: "Pendapatan Perusahaan", value: "order_id" },
            { label: "Waktu Transaksi", value: "order_id" },
            { label: "Status Transaksi", value: "order_id" }
        ],
        "pwa-b2b-income": [
            { label: "No. Invoice", value: "tnos_invoice_id" },
            { label: "ID Transaksi", value: "invoice_id" },
            { label: "Waktu Transaksi", value: "paid_at" },
            { label: "Status Pemesanan", value: "status_order" },
            { label: "Layanan", value: "layanan" },
            { label: "Pendapatan", value: "pendapatan_tnos" }
        ],
        "manual-order": [
            { label: "No. Invoice", value: "tnos_invoice_id" },
            { label: "Bukti Bayar", value: "file_document" },
            { label: "ID Referensi", value: "external_id" },
            { label: "Status Transaksi", value: "payment_status" },
            { label: "Member", value: "name" },
            { label: "Payment Method", value: "payment_method" },
            { label: "Payment Channel", value: "payment_channel" },
            { label: "Payment Status", value: "payment_status" },
            { label: "Layanan", value: "layanan" },
            { label: "Waktu Pesanan Dibuat", value: "waktu_pesanan" },
            { label: "Waktu Transaksi", value: "waktu_transaksi" },
            { label: "Jumlah", value: "jumlah" },
        ],
        "order-voucher-pembayaran": [
            { label: "ID", value: "id" },
            { label: "ID Invoice", value: "invoice_id" },
            { label: "ID User", value: "gives_name" },
            { label: "Jumlah", value: "amount" },
            { label: "Deskripsi", value: "description" },
            { label: "Status Pemesanan", value: "status_order" },
            { label: "Status Pembayaran", value: "payment_status" },
            { label: "Tanggal Dibuat", value: "created_at" },
        ],
        "mitra-pengamanan": [
            { label: "Nama", value: "fullname" },
            { label: "Kode Mitra", value: "code" },
            { label: "Tanggal Mendaftar", value: "mmit_date_insert" },
            { label: "Email", value: "email" },
            { label: "Nomor Telepon", value: "mobile" },
            { label: "Klasifikasi", value: "levelname" },
            { label: "Status", value: "mmit_status" }
        ],
        "payment-pendapatan": [
            { label: "No. Invoice", value: "nomor_invoice"},
            { label: "ID Pemesanan", value: "sid"},
            { label: "Status Pemesanan", value: "status_pemesanan"},
            { label: "Waktu Selesai", value: "waktu_selesai"},
            { label: "Jumlah Invoice", value: "jumlah_invoice"},
            { label: "Pendapatan", value: "pendapatan"},
            { label: "Member", value: "nama_member"},
        ]
    }

    const humanizeText = (str) => {
        var i,
            frags = str.split("_");
        for (i = 0; i < frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(" ");
    };

    const ConvertTimestamps = (timestamp) => {
        const date = new Date(Number(timestamp));
        const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleString('id-ID', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calcAmount = (amount, times = true) => {
        const am = times ? amount * 10000 : amount;
        return "IDR " + am.toLocaleString("id-ID", {});
    };

    const orderText = (code) => {
        if (code === "001") {
            return "Menunggu";
        } else if (code === "010") {
            return "Selesai";
        } else if (code === "011") {
            return "Gagal";
        }
    };

    const transformData = (resultData) => {
        return resultData.map(itemData => {
            let newItem = { ...itemData }

            if (props.getMenu === "pwa-transaction" || props.getMenu === "manual-order") {

                if (props.getMenu === "pwa-transaction") {
                    if (newItem.payment_status === "EXPIRED") {

                        newItem.tnos_invoice_id = "Belum Pembayaran, Sudah Kadaluarsa"
                        newItem.payment_method = "Sudah Kadaluarsa"
                        newItem.payment_channel = "Sudah Kadaluarsa"
                        newItem.payment_status = "Belum Pembayaran"

                    } else if (newItem.payment_status === "ORDER") {

                        newItem.tnos_invoice_id = "Sudah Memesan, Belum Melakukan Pembayaran"
                        newItem.payment_method = "Belum Pembayaran"
                        newItem.payment_channel = "Belum Pembayaran"
                        newItem.payment_status = "Belum Pembayaran"

                    } else if (newItem.payment_status === "PAID" || newItem.payment_status === "SETTLED") {

                        newItem.tnos_invoice_id = "Sudah Melakukan Pembayaran"
                        newItem.payment_method = "Sudah Melakukan Pembayaran"
                        newItem.payment_channel = "Sudah Melakukan Pembayaran"
                        newItem.payment_status = "Sudah Pembayaran"

                    } else if (newItem.payment_status === "UNPAID") {

                        newItem.tnos_invoice_id = "Menunggu Pembayaran"
                        newItem.payment_method = "Menunggu Pembayaran"
                        newItem.payment_channel = "Menunggu Pembayaran"
                        newItem.payment_status = "Menunggu Pembayaran"

                    }
                } else if (props.getMenu === "manual-order") {
                    if (newItem.file_document === null) {
                        newItem.tnos_invoice_id = "Belum Ada Bukti Bayar"
                        newItem.payment_method = "Menunggu Pembayaran"
                        newItem.payment_channel = "Menunggu Pembayaran"
                        newItem.payment_status = "Menunggu Pembayaran"
                    } else {
                        newItem.tnos_invoice_id = newItem.tnos_invoice_id
                        newItem.payment_method = "Bank Transfer"
                        newItem.payment_channel = "BCA"
                        newItem.payment_status = "Sudah Dibayar (PAID)"
                    }
                }

                if (props.getMenu === "manual-order") {
                    if (newItem.file_document === null) {
                        newItem.file_document = "Belum Ada Bukti Bayar"
                    } else {
                        newItem.file_document = "Udah Upload Bukti Bayar"
                    }
                }

                if (!newItem.payment_method) {
                    newItem.payment_method = "Belum Melakukan Pembayaran"
                }

                if (!newItem.payment_channel) {
                    newItem.payment_channel = "Belum Melakukan Pembayaran";
                }

                newItem.layanan = "Pembayaran Lainnya (Manual Order)"
                newItem.waktu_pesanan = ReadableDateTime(newItem.created_at)

                if (!newItem.paid_at) {
                    newItem.waktu_transaksi = "-"
                } else {
                    newItem.waktu_transaksi = ReadableDateTime(newItem.paid_at)
                }

                newItem.jumlah = 'IDR ' + parseInt(newItem.order_total).toLocaleString("id-ID", {});
            } else if (props.getMenu === "tab-transaction") {
                newItem.nama_paket = newItem.masterPaket?.nama_paket
                newItem.waktu_dibuat = newItem.start_date
                    ? ConvertTimestamps(newItem.start_date)
                    : "-";

                newItem.waktu_transaksi = newItem.timestamp
                    ? ConvertTimestamps(newItem.timestamp)
                    : "-";

                newItem.harga = newItem.amount
                    ? formatCurrency(newItem.amount)
                    : "-";
            } else if (props.getMenu === "tab-b2b-transaction") {
                newItem.name = newItem.name ? newItem.name : "-"
                newItem.nama_responder = newItem.nama_responder ? newItem.nama_responder : "-"
                newItem.jenis_pembelian = newItem.jenis_pembelian == "" ? "Tidak Ada Keterangan" : newItem.jenis_pembelian
                newItem.harga = newItem.amount
                    ? formatCurrency(newItem.amount)
                    : "-"

                newItem.tanggal_transaksi = newItem.tanggal_transaksi
                    ? ConvertTimestamps(newItem.tanggal_transaksi)
                    : "-";
            } else if (props.getMenu === "tab-b2b-user") {
                newItem.tanggal = newItem.timestamp
                    ? ConvertTimestamps(newItem.timestamp)
                    : "-"

                newItem.nama_akun = newItem.account_id?.nama
                newItem.status_akun = newItem.account_status_id?.nama_status
            } else if (props.getMenu === "tab-b2b-responder") {
                newItem.tanggal = newItem.timestamp
                    ? ConvertTimestamps(newItem.timestamp)
                    : "-"

                newItem.email = newItem.email ? newItem.email : "-"
                newItem.nama_akun = newItem.account_id?.nama
                newItem.email_akun = newItem.account_id?.email ? newItem.account_id?.email : "-"
                newItem.kode_member = newItem.account_id?.member_account_code
            } else if (props.getMenu === "tab-b2b-insiden") {
                if (newItem.status === "Menunggu Responder") {
                    newItem.status = "Menunggu Responder"
                } else if (newItem.status === "Sedang Ditangani") {
                    newItem.status = "Sedang Ditangani"
                } else if (newItem.status === "Selesai") {
                    newItem.status = "Selesai"
                }
            } else if (props.getMenu === "tab-b2b-master-paket") {
                newItem.harga = newItem.amount
                    ? "Rp." + newItem.amount.toLocaleString()
                    : "0"
            } else if (props.getMenu === "pwa-b2b-order") {
                newItem.waktu_transaksi = newItem.paid_at
                    ? ReadableDateTime(newItem.paid_at)
                    : ""
                newItem.layanan = newItem.service_datas?.name

                newItem.jumlah = newItem.order_total
                    ? "IDR " + parseInt(newItem.order_total).toLocaleString("id-ID", {})
                    : ""
            } else if (props.getMenu === "member-active") {
                newItem.tanggal_mendaftar = newItem.mmbr_date_insert
                    ? ReadableDateTime(newItem.mmbr_date_insert)
                    : "-"
            } else if (props.getMenu === "artikel-data") {
                newItem.status = newItem.status === "Y"
                    ? "Publish"
                    : newItem.status === "N"
                        ? "Unpublish"
                        : "Draft"
            } else if (props.getMenu === "export-data-security-provider") {
                newItem.status = newItem.status === "1" ? "Aktif" : "Tidak Aktif"
            } else if (props.getMenu === "export-data-voucher") {
                newItem.created_at = newItem.created_at
                    ? ReadableDateTime(newItem.created_at)
                    : ""

                newItem.voucher = newItem.in_point === null ? calcAmount(newItem.out_point) + " -" : calcAmount(newItem.in_point) + " +"
            } else if (props.getMenu === "pwa-b2b-pembayaran") {
                newItem.amount = calcAmount(newItem.amount)
                newItem.status_order = orderText(newItem.status_order)
                newItem.created_at = newItem.created_at
                    ? ReadableDateTime(newItem.created_at)
                    : "-"
            } else if (props.getMenu === "pwa-b2b-penyesuaian") {
                newItem.before_point = calcAmount(newItem.before_point)
                newItem.point = calcAmount(newItem.point)
                newItem.in_point = newItem.in_point === null ? calcAmount(newItem.out_point) : calcAmount(newItem.in_point)
            } else if (props.getMenu === "order-cancel") {
                newItem.no_invoice = newItem.type + newItem.invoice
                newItem.date_insert = newItem.date_insert.split("+")[0].split("T")[0].split("-")[2] + "-" + newItem.date_insert.split("+")[0].split("T")[0].split("-")[1] + "-" + newItem.date_insert.split("+")[0].split("T")[0].split("-")[0] + " " + newItem.date_insert.split("+")[0].split("T")[1]
                newItem.price = "IDR " + parseInt(newItem.price).toLocaleString("id-ID", {})
                newItem.type =
                    newItem.type === "TLC"
                        ? "Pengacara (Konsultasi)"
                        : newItem.type === "TL"
                            ? "Pengacara (Pendampingan)"
                            : newItem.servicename + newItem.gradename === "Lawyer"
                                ? newItem.gradename === "A"
                                    ? "Pengacara (Platinum)"
                                    : "Pengacara (Silver)"
                                : "";
                newItem.status = "Dibatalkan"
                newItem.waktu_selesai = newItem.type === "TLC" ? newItem.other : newItem.enddate + " " + newItem.endtime
            } else if (props.getMenu === "order-on-progress") {
                newItem.no_invoice = newItem.type + newItem.invoice
                newItem.date_insert = newItem.date_insert.split("+")[0].split("T")[0].split("-")[2] + "-" + newItem.date_insert.split("+")[0].split("T")[0].split("-")[1] + "-" + newItem.date_insert.split("+")[0].split("T")[0].split("-")[0] + " " + newItem.date_insert.split("+")[0].split("T")[1]
                newItem.price = "IDR " + parseInt(newItem.price).toLocaleString("id-ID", {})
                newItem.type =
                    newItem.type === "TLC"
                        ? "Pengacara (Konsultasi)"
                        : newItem.type === "TL"
                            ? "Pengacara (Pendampingan)"
                            : newItem.servicename + newItem.gradename === "Lawyer"
                                ? newItem.gradename === "A"
                                    ? "Pengacara (Platinum)"
                                    : "Pengacara (Silver)"
                                : "";
                newItem.status = newItem.status === 1
                    ? "Menerima Pesanan"
                    : newItem.status === 2
                        ? "Dalam Perjalanan"
                        : newItem.status === 3
                            ? "Hadir dan Sedang Bertugas"
                            : newItem.status === 990
                                ? "Sedang Berlangsung"
                                : ""
                newItem.waktu_selesai = newItem.type === "TLC" ? newItem.other : newItem.enddate + " " + newItem.endtime
            } else if (props.getMenu === "order-success") {
                newItem.no_invoice = newItem.type + newItem.invoice
                newItem.date_insert = newItem.date_insert.split("+")[0].split("T")[0].split("-")[2] + "-" + newItem.date_insert.split("+")[0].split("T")[0].split("-")[1] + "-" + newItem.date_insert.split("+")[0].split("T")[0].split("-")[0] + " " + newItem.date_insert.split("+")[0].split("T")[1]
                newItem.price = "IDR " + parseInt(newItem.price).toLocaleString("id-ID", {})
                newItem.type =
                    newItem.type === "TLC"
                        ? "Pengacara (Konsultasi)"
                        : newItem.type === "TL"
                            ? "Pengacara (Pendampingan)"
                            : newItem.servicename +
                            (newItem.gradename !== "Lawyer"
                                ? newItem.gradename === "A"
                                    ? " (Platinum)"
                                    : " (Silver)"
                                : "");
                newItem.status = "Selesai"
                newItem.waktu_selesai = newItem.type === "TLC" ? newItem.other : newItem.enddate + " " + newItem.endtime
            } else if (props.getMenu === "tab-insiden") {
                newItem.nama = newItem.nama ? newItem.nama : "-"
                newItem.status = newItem.status === "D" ? "Done" : newItem.status === "P" ? "Sedang Diproses" : "Menunggu"
            } else if (props.getMenu === "tab-responder") {
                newItem.email = "-"
                newItem.kontak_pengguna = "-"
                newItem.member_code = newItem.detail.member_code
                newItem.tanggal_mendaftar = newItem.detail.tanggal_mendaftar
            } else if (props.getMenu === "detail-akun-user") {
                newItem.name = newItem.detail.nama
                newItem.nomor_hp = newItem.detail.phone_number
                newItem.username = newItem.detail.username
                newItem.account_status_id = newItem.detail.account_status_id === "active" ? "Aktif" : "Tidak Aktif"
            } else if (props.getMenu === "detail-akun-responder") {
                newItem.name = newItem.detail.nama
                newItem.phone_number = newItem.detail.phone_number
                newItem.username = newItem.detail.username
                newItem.status = newItem.detail.account_status_id === "active" ? "Aktif" : "Tidak Aktif"
                newItem.org = newItem.detail.nama_institusi
            } else if (props.getMenu === "detail-akun-insiden-siplah") {
                newItem.status = newItem.status === "Selesai" ? "Selesai" : newItem.status === "Menunggu Responder" ? "Menunggu Responder" : newItem.status === "Sedang Ditangani" ? "Sedang Ditangani" : ""
            } else if (props.getMenu === "detail-akun-user-siplah") {
                newItem.nama = newItem.detail.nama
                newItem.nomor_hp = newItem.detail.phone_number
                newItem.username = newItem.detail.username
                // newItem.nama = newItem.detail.account_status_id === ""
            } else if (props.getMenu === "pwa-b2b-unit") {
                newItem.status = newItem.status === 1 ? "Aktif" : "Tidak Aktif"
            } else if (props.getMenu === "layanan-security-provider") {
                newItem.name_sc = newItem.providers.name_sc
                newItem.name_pt = newItem.providers.name_pt
            } else if (props.getMenu === "durasi-security-provider") {
                newItem.layanan = newItem.layanans.name
                newItem.durasi = newItem.durasi + " Jam"
                newItem.status = newItem.status === 1 ? "Aktif" : "Tidak Aktif"
            } else if (props.getMenu === "others-component") {
                newItem.status = newItem.status === 1 ? "Aktif" : "Tidak Aktif"
            } else if (props.getMenu === "sub-section") {
                newItem.nama_section = newItem.nama_section ? newItem.sections.name : "-"
            } else if (props.getMenu === "product-sub-section") {
                newItem.nama_section = newItem.nama_section ? newItem.subsections.name : "-"
            } else if (props.getMenu === "others-prod-sub") {
                newItem.sub_section_product = newItem.ref_sub_sections.name ? newItem.ref_sub_sections.name : "-"
            } else if (props.getMenu === "others-prod") {
                newItem.sub_section_product = newItem.ref_sections.name ? newItem.ref_sections.name : "-"
            } else if (props.getMenu === "product-section") {
                newItem.sections = newItem.sections ? newItem.sections.name : "-"
            } else if (props.getMenu === "payment-on-progress") {
                newItem.order_id = newItem.order_id
                newItem.order_status = newItem.order_status.status
                newItem.payment_type = humanizeText(newItem.payment_type)
                newItem.gross_amount = newItem.currency + " " + parseInt(newItem.gross_amount).toLocaleString("id-ID", {})
            } else if (props.getMenu === "pwa-b2b-income") {
                newItem.tnos_invoice_id = !newItem.tnos_invoice_id ? "Menunggu Konfirmasi" : newItem.tnos_invoice_id
                newItem.invoice_id = !newItem.invoice_id ? "Menunggu Pembayaran" : newItem.invoice_id
                newItem.paid_at = ReadableDateTime(newItem.paid_at)
                newItem.status_order = newItem.status_order === "001" ? "Belum Pembayaran" : newItem.status_order === "002" ? "Order Diproses" : ""
                newItem.layanan = newItem.tnos_service_id === "2" && newItem.tnos_subservice_id === "2" ? (
                    "Pengamanan Usaha & Bisnis"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "1" ? (
                    "Badan Hukum PT"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "2" ? (
                    "Badan Usaha CV"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "3" ? (
                    "Yayasan"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "4" ? (
                    "Perkumpulan"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "5" ? (
                    "Asosiasi"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "6" ? (
                    "Legalitas Lainnya"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "7" ? (
                    "Komprehensif Solusi Hukum"
                ) : newItem.tnos_service_id === "3" && newItem.tnos_subservice_id === "8" ? (
                    "Pembayaran Lainnya"
                ) : newItem.tnos_service_id === "4" && newItem.tnos_subservice_id === "1" ? (
                    "PAS"
                ) : newItem.tnos_service_id === "6" && newItem.tnos_subservice_id === "1" ? (
                    "P1 Force"
                ) : (
                    <>
                        &nbsp;
                    </>
                )

                newItem.pendapatan_tnos = "IDR " + parseInt(newItem.pendapatan_tnos).toLocaleString("id-ID", {})
            } else if (props.getMenu === "order-voucher-transaksi") {
                newItem.amount = newItem.in_point === null ? calcAmount(newItem.out_point) + " -" : calcAmount(newItem.in_point) + " +"
            } else if (props.getMenu === "order-voucher-pembayaran") {
                newItem.gives_name = newItem.gives_name + " " + newItem.user_id
                newItem.amount = calcAmount(newItem.amount)
                newItem.status_order = newItem.status_order === "001" ? "Menunggu" : newItem.status_order === "010" ? "Selesai" : newItem.status_order === "011" ? "Gagal" : ""
                newItem.created_at = ReadableDateTime(newItem.created_at)
            } else if (props.getMenu === "mitra-pengamanan") {
                newItem.mmit_date_insert = ReadableDateTime(newItem.mmit_date_insert)
                newItem.levelname = newItem.levelname === "A" ? "Platinum" : newItem.levelname === "B" ? "Silver" : newItem.levelname === "C" ? "Silver" : ""
                newItem.mmit_status = newItem.mmit_status === 0
                    ? "Menunggu Verifikasi"
                    : newItem.mmit_status === 1
                        ? "Lolos Verifikasi Dokumen"
                        : newItem.mmit_status === 2
                            ? "Tidak Lolos Verifikasi Dokumen"
                            : newItem.mmit_status === 3
                                ? "Atur Jadwal Verifikasi Aktual"
                                : newItem.mmit_status === 4
                                    ? "Menunggu Verifikasi Aktual"
                                    : newItem.mmit_status === 5
                                        ? "Jadwal Pembekalan"
                                        : newItem.mmit_status === 6
                                            ? "Tidak Lolos Verifikasi Aktual"
                                            : newItem.mmit_status === 7
                                                ? "Pembekalan"
                                                : newItem.mmit_status === 9
                                                    ? "Online"
                                                    : newItem.mmit_status === 10
                                                        ? "Offline"
                                                        : ""
            } else if (props.getMenu === "payment-pendapatan") {
                newItem.nomor_invoice = newItem.type + newItem.invoice
                newItem.status_pemesanan = "Selesai"
                newItem.waktu_selesai = newItem.type === "TLC" ? newItem.other : newItem.enddate + " " + newItem.endtime
                newItem.jumlah_invoice = "IDR " + parseInt(newItem.price).toLocaleString("id-ID", {})
                newItem.pendapatan =  "IDR " + parseInt(newItem.tnosfee).toLocaleString("id-ID", {})
                newItem.nama_member = newItem.mmbr_name + " - " + newItem.membercode
            }

            return newItem;
        })
    }

    const excelColumns = columnsConfig[props.getMenu] || [];

    return (
        <Card border="light" className="shadow-sm mb-4">
            <Card.Body className="pb-0">
                <Row className="mb-3">
                    <Col>
                        <h6 className="mb-n1">{props.title}</h6>
                        <small>{props.subtitle}</small>
                    </Col>
                    <Col
                        xs={12}
                        style={{ textAlign: "right" }}
                        className={props.reload === false ? "d-none" : ""}
                    >

                        {props.getMenu === "artikel-tags" || props.getMenu === "artikel-kategori" || props.getMenu === "tnos-admin/user" ? (
                            <Link to={props.getMenu === "artikel-tags" ? "/artikel/tags/create" : props.getMenu === "artikel-kategori" ? '/artikel/artikelkategory/create' : props.getMenu === "tnos-admin/user" ? '/tnos-admin/user/create' : ''} className="ms-2">
                                <Button variant="primary" size="sm" className="text-white mb-2" style={{ marginRight: '10px' }}>
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{ marginRight: "10px" }}
                                    />{" "}
                                    Tambah
                                </Button>
                            </Link>
                        ) : (
                            ""
                        )}

                        {props.getMenu === "artikel-kategori" ? (
                            <Link to={props.getMenu === "artikel-kategori" ? "/artikel/tags" : ''} className="ms-2">
                                <Button variant="primary" size="sm" className="text-white mb-2" style={{ marginRight: '10px' }}>
                                    <FontAwesomeIcon
                                        icon={faThList}
                                        style={{ marginRight: "10px" }}
                                    />{" "}
                                    Tags
                                </Button>
                            </Link>
                        ) : ""}

                        {props.getMenu === "artikel-kategori" ? (
                            <Link to={props.getMenu === "artikel-kategori" ? "/artikel/subcategorylist" : ''} className="ms-2">
                                <Button variant="primary" size="sm" className="text-white mb-2" style={{ marginRight: '10px' }}>
                                    <FontAwesomeIcon
                                        icon={faThList}
                                        style={{ marginRight: "10px" }}
                                    />{" "}
                                    Sub Kategori
                                </Button>
                            </Link>
                        ) : ""}

                        {/* {props.getMenu === "tab-user" ? (
                            <Link to={`${location.pathname}/grafik`} className="ms-2">
                                <Button variant="primary" size="sm" className="text-white mb-2" style={{marginRight: '10px'}}>
                                    <FontAwesomeIcon icon={faBars} style={{marginRight: '10px'}} />{" "}
                                    Lihat Grafik
                                </Button>
                            </Link>
                        ) : "" } */}

                        {!props.getExportData ? "" : (
                            <>
                                <ExcelFile
                                    element={
                                        <Button variant="success" size="sm" className="text-white mb-2">
                                            <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: "10px" }} /> Export Excel
                                        </Button>
                                    }
                                    filename={
                                        props.getMenu === "akun-external" ||
                                            props.getMenu === "akun-partner" ||
                                            props.getMenu === "akun-internal" ||
                                            props.getMenu === "tab-b2b-insiden" ||
                                            props.getMenu === "tab-b2b-master-paket" ||
                                            props.getMenu === "tab-kategori-usaha" ||
                                            props.getMenu === "pwa-b2b-order" ||
                                            props.getMenu === "artikel-tags" ||
                                            props.getMenu === "artikel-kategori" ||
                                            props.getMenu === "artikel-sub-kategori" ||
                                            props.getMenu === "artikel-data" ||
                                            props.getMenu === "tnos-admin/user" ||
                                            props.getMenu === "detail-akun-internal" ||
                                            props.getMenu === "export-data-security-provider" ||
                                            props.getMenu === "order-voucher-transaksi" ||
                                            props.getMenu === "pwa-b2b-pembayaran" ||
                                            props.getMenu === "pwa-b2b-penyesuaian" ||
                                            props.getMenu === "order-cancel" ||
                                            props.getMenu === "order-on-progress" ||
                                            props.getMenu === "order-success" ||
                                            props.getMenu === "tab-insiden" ||
                                            props.getMenu === "tab-responder" ||
                                            props.getMenu === "detail-akun-user" ||
                                            props.getMenu === "detail-akun-responder" ||
                                            props.getMenu === "detail-akun-partner" ||
                                            props.getMenu === "detail-akun-insiden-siplah" ||
                                            props.getMenu === "detail-akun-user-siplah" ||
                                            props.getMenu === "pwa-b2b-unit" ||
                                            props.getMenu === "layanan-security-provider" ||
                                            props.getMenu === "durasi-security-provider" ||
                                            props.getMenu === "others-component" ||
                                            props.getMenu === "sub-section" ||
                                            props.getMenu === "product-sub-section" ||
                                            props.getMenu === "others-prod" ||
                                            props.getMenu === "others-prod-sub" ||
                                            props.getMenu === "product-section" ||
                                            props.getMenu === "payment-on-progress" ||
                                            props.getMenu === "pwa-b2b-income" ||
                                            props.getMenu === "manual-order" ||
                                            props.getMenu === "order-voucher-pembayaran" ||
                                            props.getMenu === "mitra-pengamanan" ||
                                            props.getMenu === "payment-pendapatan" ? (
                                            `export-data-${props.getMenu}`
                                        ) : (
                                            `export-data-${props.getMenu}-${props.getTanggalMulai}-${props.getTanggalAkhir}`
                                        )}
                                >
                                    <ExcelSheet data={transformData(props.getExportData)} name={`data-${props.getMenu}`}>
                                        {excelColumns.map((col, index) => (
                                            <ExcelColumn key={index} label={col.label} value={col.value} />
                                        ))}
                                    </ExcelSheet>
                                </ExcelFile>
                            </>
                        )}
                        <Link
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="ms-2"
                        >
                            <Button variant="info" size="sm" className="text-white mb-2">
                                <FontAwesomeIcon
                                    icon={faSync}
                                    style={{ marginRight: "10px" }}
                                />{" "}
                                Muat Ulang
                            </Button>
                        </Link>

                        {isSecurityProviderRoute ? (
                            <>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="text-white mb-2"
                                    onClick={handleShow}
                                    style={{ marginLeft: "10px" }}
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{ marginRight: "7px" }}
                                    />{" "}
                                    Tambah
                                </Button>
                            </>
                        ) : isManualOrder ? (
                            <>
                                <Link to={"/pwa-b2b/manual-order/create"} className="ms-2" target="_blank">
                                    <Button variant="primary" size="sm" className="text-white mb-2">
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            style={{ marginRight: "10px" }}
                                        />{" "}
                                        Tambah
                                    </Button>
                                </Link>
                            </>
                        ) : isTAB ? (
                            <>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="text-white mb-2"
                                    onClick={handleShow}
                                    style={{ marginLeft: "10px" }}
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{ marginRight: "7px" }}
                                    />{" "}
                                    Tambah
                                </Button>
                            </>
                        ) : (
                            ""
                        )}

                        {location.pathname.endsWith("product-sub-section") || location.pathname.endsWith("product") ? (
                            <>
                                <Link to={location.pathname.endsWith("product-sub-section") ? `/pwa-b2b/lainnya/${location.pathname.split("/")[3]}/others-prod-sub` : location.pathname.endsWith("product") ? `/pwa-b2b/lainnya/${location.pathname.split("/")[3]}/others-prod` : ""} className="ms-2" target="_blank">
                                    <Button variant="primary" size="sm" className="text-white mb-2">
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            style={{ marginRight: "10px" }}
                                        />{" "}
                                        Others
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <></>
                        )}

                    </Col>
                </Row>
                {props.alert}
                <div className="tnos-data-table">
                    <Table
                        responsive
                        className="table-centered table-nowrap rounded mb-0"
                    >
                        {props.data}
                    </Table>
                </div>
            </Card.Body>

            {isSecurityProviderRoute ? (
                <MyModal show={showModal} handleClose={handleClose} />
            ) : isTAB ? (
                <MyModalTAB show={showModal} handleClose={handleClose} />
            ) : (
                <></>
            )}
        </Card>
    );
};