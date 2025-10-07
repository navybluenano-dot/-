let globalData = [];

const fileInput = document.getElementById("csv-file-input");
const applyBtn = document.getElementById("apply-filters");
const resetBtn = document.getElementById("reset-filters");

const selCarType = document.getElementById("filter-car-type");
const selEngine = document.getElementById("filter-engine");
const selTrim = document.getElementById("filter-trim");
const selColor = document.getElementById("filter-color");

fileInput.addEventListener("change", handleFileUpload);
applyBtn.addEventListener("click", handleFilterApply);
resetBtn.addEventListener("click", handleFilterReset);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("CSV 파일을 선택해주세요.");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      globalData = results.data;
      console.log("파싱된 데이터:", globalData);
      populateFilterOptions(globalData);
      renderResults(globalData);
    },
    error: function(err) {
      console.error("CSV 파싱 오류:", err);
      alert("CSV 파싱 중 오류가 발생했습니다.");
    }
  });
}

function populateFilterOptions(data) {
  const setCar = new Set();
  const setEngine = new Set();
  const setTrim = new Set();
  const setColor = new Set();

  data.forEach(item => {
    if (item["차종"]) setCar.add(item["차종"]);
    if (item["엔진"]) setEngine.add(item["엔진"]);
    if (item["트림"]) setTrim.add(item["트림"]);
    if (item["외장칼라"]) setColor.add(item["외장칼라"]);
  });

  fillSelectFromSet(selCarType, setCar);
  fillSelectFromSet(selEngine, setEngine);
  fillSelectFromSet(selTrim, setTrim);
  fillSelectFromSet(selColor, setColor);
}

function fillSelectFromSet(selectElem, valuesSet) {
  for (let i = selectElem.options.length - 1; i >= 1; i--) {
    selectElem.remove(i);
  }
  valuesSet.forEach(val => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.text = val;
    selectElem.appendChild(opt);
  });
}

function handleFilterApply() {
  const ct = selCarType.value;
  const en = selEngine.value;
  const tr = selTrim.value;
  const col = selColor.value;

  const filtered = globalData.filter(item => {
    return (ct === "" || item["차종"] === ct)
      && (en === "" || item["엔진"] === en)
      && (tr === "" || item["트림"] === tr)
      && (col === "" || item["외장칼라"] === col);
  });

  renderResults(filtered);
}

function handleFilterReset() {
  // 필터 드롭다운들을 “전체”로 돌려놓기
  selCarType.value = "";
  selEngine.value = "";
  selTrim.value = "";
  selColor.value = "";

  // 전체 데이터 다시 보여주기
  renderResults(globalData);
}

function renderResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!data || data.length === 0) {
    const msg = document.createElement("div");
    msg.className = "message";
    msg.textContent = "조건에 맞는 결과가 없습니다.";
    resultsDiv.appendChild(msg);
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  const first = data[0];
  for (const key in first) {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  data.forEach(item => {
    const tr = document.createElement("tr");
    for (const key in item) {
      const td = document.createElement("td");
      td.textContent = item[key];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  resultsDiv.appendChild(table);
}
