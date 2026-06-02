
// FIREBASE CONFIG

const firebaseConfig = {
  apiKey: "AIzaSyAV3otxsijnQv3Ky9juOiMqDdl_b-VcZcY",
  authDomain: "projectmagang-e094e.firebaseapp.com",
  databaseURL: "https://projectmagang-e094e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "projectmagang-e094e",
  storageBucket: "projectmagang-e094e.firebasestorage.app",
  messagingSenderId: "919858734121",
  appId: "1:919858734121:web:c1e1c71b0098e77b3ea838",
  measurementId: "G-E1LHLT91HF"
};


// INIT FIREBASE

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
console.log("Firebase Connected");


// =====================
// PREVIEW GAMBAR (FIX PASTI JALAN)
// =====================

document.addEventListener("change", function (e) {

  if (e.target && e.target.id === "upload") {

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    const previewImg = document.getElementById("previewImg");
    const textPreview = document.getElementById("textPreview");

    const url = URL.createObjectURL(file);

    previewImg.src = url;
    previewImg.style.display = "block";
    textPreview.style.display = "none";

    console.log("Preview tampil");
  }

});


// BUTTON BATAL (RESET GAMBAR)

document.getElementById("btnBatal")?.addEventListener("click", function () {

  const inputFile = document.getElementById("upload");
  const previewImg = document.getElementById("previewImg");
  const textPreview = document.getElementById("textPreview");

  // Reset file input
  inputFile.value = "";

  // Hapus preview gambar
  previewImg.src = "";
  previewImg.style.display = "none";

  // Tampilkan kembali teks
  textPreview.style.display = "block";

  console.log("Preview direset");
});


// =====================
// UPLOAD CLOUDINARY
// =====================
async function uploadToCloudinary(file) {

  const cloudName = "dojogsvnt";       
  const uploadPreset = "LHIkanwil";

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.secure_url || "";

  } catch (err) {
    console.error("Upload gagal:", err);
    return "";
  }
}

// SIMPAN DATA

document.getElementById('SIMPAN')?.addEventListener('click', async () => {

  try {

    // 🔥 AMBIL FILE & UPLOAD
    const fileInput = document.getElementById("upload");
    const file = fileInput?.files[0];

    let imageUrl = "";

    if (file) {
     imageUrl = await uploadToCloudinary(file);
    }

    const data = {

      TANGGAL: document.getElementById('TANGGAL')?.value || '',
      LOKASIKANTOR: document.getElementById('LOKASIKANTOR')?.value || '',
      JUDUL: document.getElementById('JUDUL')?.value || '',
      ITK: document.getElementById('ITK')?.value || '',
      VOA: document.getElementById('VOA')?.value || '',
      ITAS6: document.getElementById('ITAS6')?.value || '',
      ITAS1: document.getElementById('ITAS1')?.value || '',
      ITAS2: document.getElementById('ITAS2')?.value || '',
      ITKITAS: document.getElementById('ITKITAS')?.value || '',
      ITASITAP: document.getElementById('ITASITAP')?.value || '',
      ITAP: document.getElementById('ITAP')?.value || '',
      AFFIDAVIT: document.getElementById('AFFIDAVIT')?.value || '',
      MERP6: document.getElementById('MERP6')?.value || '',
      MERP1: document.getElementById('MERP1')?.value || '',
      MERP2: document.getElementById('MERP2')?.value || '',
      MERPUNLI: document.getElementById('MERPUNLI')?.value || '',
      PLITAP: document.getElementById('PLITAP')?.value || '',
      SKIM: document.getElementById('SKIM')?.value || '',
      PABG: document.getElementById('PABG')?.value || '',
      ALIHPENJITAP: document.getElementById('ALIHPENJITAP')?.value || '',
      PFOTO: document.getElementById('PFOTO')?.value || '',

      KONSUL: document.getElementById('KONSUL')?.value || '',
      MPASPOR: document.getElementById('MPASPOR')?.value || '',
      WALKIN: document.getElementById('WALKIN')?.value || '',
      PERCEPATAN: document.getElementById('PERCEPATAN')?.value || '',

      ERP: document.getElementById('ERP')?.value || '',
      PALAMAT: document.getElementById('PALAMAT')?.value || '',
      EPO: document.getElementById('EPO')?.value || '',
      MUPASPOR: document.getElementById('MUPASPOR')?.value || '',

      gambar: imageUrl,

      created_at: new Date()

    };


    // VALIDASI
    if (
      !data.TANGGAL ||
      !data.LOKASIKANTOR ||
      !data.JUDUL
    ) {
      alert("Tanggal, Lokasi Kantor, dan Judul wajib diisi");
      return;
    }


    // SIMPAN FIRESTORE

    const result = await db
      .collection('data_input')
      .add(data);

    console.log("BERHASIL SIMPAN:", result.id);
    alert("Data berhasil disimpan");
    location.reload();

  } catch (err) {

    console.error("ERROR SIMPAN:", err);
    alert("Gagal simpan data");

  }

});


//  GLOBAL 

let allData = [];


// LOAD LIST DATA

async function loadData() {

  try {

    const snapshot = await db
      .collection('data_input')
      .orderBy('created_at', 'desc')
      .get();

    allData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("LIST DATA:", allData);
    renderData(allData);

  } catch (err) {
    console.error("ERROR LOAD:", err);

  }

}


// FILTER DATA

function applyFilter() {

  const search = document
    .getElementById('search')
    ?.value
    .toLowerCase() || '';

  const filtered = allData.filter(item => {

    return (

      (item.JUDUL || '')
      .toLowerCase()
      .includes(search)

      ||

      (item.LOKASIKANTOR || '')
      .toLowerCase()
      .includes(search)

      ||

      (item.TANGGAL || '')
      .toLowerCase()
      .includes(search)

    );
  });

  renderData(filtered);

}


//  RENDER LIST DATA

function renderData(data) {

  const list = document.getElementById('listData');
  if (!list) return;

  list.innerHTML = '';

  // JIKA DATA KOSONG
  if (data.length === 0) {

    list.innerHTML = `
      <div class="table-row">
        <span>Tidak ada data</span>
      </div>
    `;

    return;
  }

  data.forEach(item => {

    const row = document.createElement('div');
    row.className = 'table-row';

    row.innerHTML = `

      <span class="tgl">
        ${item.TANGGAL || '-'}
      </span>

      <span class="judul">
        ${item.JUDUL || '-'}
      </span>

      <span class="lokasi">
        ${item.LOKASIKANTOR || '-'}
      </span>

      <div class="actions">

        <button
          class="btn-view"
          onclick="window.location.href='view.html?id=${item.id}'"
        >
          View
        </button>

        <button
          class="btn-edit"
          onclick="window.location.href='edit.html?id=${item.id}'"
        >
          Edit
        </button>

        <button
          class="btn-hapus"
          onclick="deleteData('${item.id}')"
        >
          Hapus
        </button>

      </div>

    `;

    list.appendChild(row);

  });

}


// DELETE DATA
async function deleteData(id) {

  const konfirmasi = confirm("Yakin ingin menghapus data?");

  if (!konfirmasi) return;
  try {
    await db
      .collection('data_input')
      .doc(id)
      .delete();

    alert("Data berhasil dihapus");
    loadData();

  } catch (err) {

    console.error("ERROR DELETE:", err);
    alert("Gagal menghapus data");

  }

}


// LOAD VIEW DATA
async function loadViewData() {

  try {

    const params = new URLSearchParams(window.location.search);

    const id = params.get('id');

    if (!id) return;

    console.log("VIEW ID:", id);

    const doc = await db
      .collection('data_input')
      .doc(id)
      .get();

    if (!doc.exists) {

      alert("Data tidak ditemukan");
      return;
    }

    const data = doc.data();
    console.log("VIEW DATA:", data);


// TAMPILKAN GAMBAR DARI FIRESTORE

if (data.gambar) {

  const previewImg = document.getElementById("previewImg");
  const textPreview = document.getElementById("textPreview");

  previewImg.src = data.gambar;
  previewImg.style.display = "block";
  textPreview.style.display = "none";
}


// DOWNLOAD GAMBAR

const btnDownload = document.getElementById("simpangmr");

if (btnDownload && data.gambar) {
  btnDownload.addEventListener("click", function () {

    const link = document.createElement("a");
    link.href = data.gambar;

    // nama file otomatis dari waktu
    link.download = "gambar_" + Date.now() + ".jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  });
}


    // TAMPILKAN DATA
    Object.keys(data).forEach(key => {
      const el = document.getElementById(key);

      if (el) {

        el.value = data[key];


        // READONLY
        el.setAttribute("readonly", true);
      }
    });

  } catch (err) {
    console.error("ERROR VIEW:", err);
  }

}


//  LOAD EDIT DATA
async function loadEditData() {

  try {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return;

    console.log("EDIT ID:", id);

    const doc = await db
      .collection('data_input')
      .doc(id)
      .get();

    if (!doc.exists) {

      alert("Data tidak ditemukan");
      return;
    }

    const data = doc.data();
    console.log("EDIT DATA:", data);

    // =====================
// TAMBAHAN PREVIEW GAMBAR SAAT EDIT
// =====================
if (data.gambar) {

  const previewImg = document.getElementById("previewImg");
  const textPreview = document.getElementById("textPreview");

  previewImg.src = data.gambar;
  previewImg.style.display = "block";
  textPreview.style.display = "none";
}

    // ISI INPUT
    Object.keys(data).forEach(key => {

      const el = document.getElementById(key);

      if (el) {
        el.value = data[key];
      }
    });

  } catch (err) {
    console.error("ERROR LOAD EDIT:", err);
  }

}


// UPDATE DATA
document.getElementById('UPDATE')?.addEventListener('click', async () => {
  try {

    // 🔥 AMBIL ID DULU (WAJIB PALING ATAS)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      alert("ID tidak ditemukan");
      return;
    }

    // 🔥 AMBIL FILE
    const fileInput = document.getElementById("upload");
    const file = fileInput?.files[0];

    let imageUrl = "";

    // 🔥 AMBIL DATA LAMA
    const oldDoc = await db.collection('data_input').doc(id).get();
    const oldData = oldDoc.data();

    // 🔥 CEK: upload baru atau tidak
    if (file) {
      console.log("Upload gambar baru...");
      imageUrl = await uploadToCloudinary(file);
    } else {
      console.log("Pakai gambar lama...");
      imageUrl = oldData.gambar || "";
    }

    // 🔥 DATA UPDATE
    const data = {

      gambar: imageUrl,

      TANGGAL: document.getElementById('TANGGAL')?.value || '',
      LOKASIKANTOR: document.getElementById('LOKASIKANTOR')?.value || '',
      JUDUL: document.getElementById('JUDUL')?.value || '',
      ITK: document.getElementById('ITK')?.value || '',
      VOA: document.getElementById('VOA')?.value || '',
      ITAS6: document.getElementById('ITAS6')?.value || '',
      ITAS1: document.getElementById('ITAS1')?.value || '',
      ITAS2: document.getElementById('ITAS2')?.value || '',
      ITKITAS: document.getElementById('ITKITAS')?.value || '',
      ITASITAP: document.getElementById('ITASITAP')?.value || '',
      ITAP: document.getElementById('ITAP')?.value || '',
      AFFIDAVIT: document.getElementById('AFFIDAVIT')?.value || '',
      MERP6: document.getElementById('MERP6')?.value || '',
      MERP1: document.getElementById('MERP1')?.value || '',
      MERP2: document.getElementById('MERP2')?.value || '',
      MERPUNLI: document.getElementById('MERPUNLI')?.value || '',
      PLITAP: document.getElementById('PLITAP')?.value || '',
      SKIM: document.getElementById('SKIM')?.value || '',
      PABG: document.getElementById('PABG')?.value || '',
      ALIHPENJITAP: document.getElementById('ALIHPENJITAP')?.value || '',
      PFOTO: document.getElementById('PFOTO')?.value || '',

      KONSUL: document.getElementById('KONSUL')?.value || '',
      MPASPOR: document.getElementById('MPASPOR')?.value || '',
      WALKIN: document.getElementById('WALKIN')?.value || '',
      PERCEPATAN: document.getElementById('PERCEPATAN')?.value || '',

      ERP: document.getElementById('ERP')?.value || '',
      PALAMAT: document.getElementById('PALAMAT')?.value || '',
      EPO: document.getElementById('EPO')?.value || '',
      MUPASPOR: document.getElementById('MUPASPOR')?.value || '',

    };

    // 🔥 UPDATE FIRESTORE
    await db.collection('data_input').doc(id).update(data);

    alert("Data berhasil diupdate");
    window.location.href = 'index.html';

  } catch (err) {
    console.error("ERROR UPDATE:", err);
    alert("Gagal update data");
  }
});


//  AUTO LOAD SEMUA HALAMAN
window.onload = () => {

  console.log("PATH:", window.location.pathname);

  if (document.getElementById('listData')) {
    loadData();
  }


  if (window.location.pathname.includes("view.html")) {
    loadViewData();
  }

  if (window.location.pathname.includes("edit.html")) {
    loadEditData();
  }

};