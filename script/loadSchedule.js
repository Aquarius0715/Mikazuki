// script/loadSchedule.js
// ---------------------------------------------------------------
// - /data/schedule.yaml を読み込んで、時刻のDOMを自動生成する。
// - 1カラムあたり最大4件で自動分割（4=1列, 8=2列, 10=3列…）。
// - 右側のボタンは既存の toggleStateArgo / toggleStateBuggy を利用。
// - YAMLパーサ(js-yaml)が無い場合は JSON としてのパースも試みる。
// - HTML側には以下の空コンテナがある想定：
//     <div class="box" id="argo_times"></div>
//     <div class="buggy_box" id="buggy_times"></div>
// ---------------------------------------------------------------

(function () {
  "use strict";

  // 相対パス推奨（先頭スラッシュ無し）: HTML と同階層に data/ フォルダがある想定
  const SCHEDULE_PATH = "data/schedule.yaml";
  const PER_COLUMN = 4; // 1カラムに入れる最大件数

  // DOM 準備完了後に初期化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  async function init() {
    try {
      const cfg = await fetchSchedule(SCHEDULE_PATH);
      if (!cfg) {
        console.error("[loadSchedule] 設定の読み込みに失敗したため描画を中止");
        return;
      }
      draw(cfg);
    } catch (err) {
      console.error("[loadSchedule] 初期化エラー:", err);
    }
  }

  // 外部から再読込したい場合に使えるように公開
  window.reloadSchedule = init;

  // スケジュールファイルを取得してパース（YAML優先, 失敗時はJSONを試す）
  async function fetchSchedule(path) {
    const res = await fetch(withNoCache(path));
    if (!res.ok) {
      console.error(`[loadSchedule] fetch失敗: ${res.status} ${res.statusText}`);
      return null;
    }
    const text = await res.text();
    // YAML -> JSON の順に試す
    let parsed = null;

    // js-yaml があれば YAML を試す
    if (window.jsyaml || window.jsyaml?.load || window.jsyaml?.safeLoad) {
      try {
        // v4 以降は load 推奨
        const yaml = window.jsyaml || window.jsyaml;
        parsed = (yaml.load ? yaml.load(text) : yaml.safeLoad(text));
      } catch (e) {
        // YAML 失敗時は後段の JSON を試す
      }
    }

    if (!parsed) {
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error("[loadSchedule] YAML/JSON ともにパースできませんでした", e);
        return null;
      }
    }

    // 期待するキーが無い場合もガード
    if (!parsed.argo && !parsed.buggy) {
      console.warn("[loadSchedule] argo/buggy セクションが見つかりません。内容:", parsed);
    }
    return parsed;
  }

  // キャッシュバスター
  function withNoCache(url) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}_=${Date.now()}`;
  }

  // 全体を描画
  function draw(cfg) {
    // 既存のトグル関数を参照（無ければダミーにして警告）
    const argoToggle = typeof window.toggleStateArgo === "function"
      ? window.toggleStateArgo
      : (el) => console.warn("toggleStateArgo が未定義です", el);

    const buggyToggle = typeof window.toggleStateBuggy === "function"
      ? window.toggleStateBuggy
      : (el) => console.warn("toggleStateBuggy が未定義です", el);

    // 各セクションを描画
    if (cfg.argo)  renderRide("argo",  cfg.argo,  "argo_times",  argoToggle);
    if (cfg.buggy) renderRide("buggy", cfg.buggy, "buggy_times", buggyToggle);
  }

  /**
   * 1セクションを描画
   * @param {'argo'|'buggy'} rideKey
   * @param {{ slots?: Array<{time:string, state:string}> }} rideCfg
   * @param {string} targetId
   * @param {(el:HTMLElement)=>void} onClickFn
   */
  function renderRide(rideKey, rideCfg, targetId, onClickFn) {
    const root = document.getElementById(targetId);
    if (!root) {
      console.warn(`[loadSchedule] ターゲット #${targetId} が見つかりません`);
      return;
    }

    const slots = Array.isArray(rideCfg?.slots) ? rideCfg.slots : [];
    // 4件ずつ分割 => 配列長 = 列数
    const chunks = chunk(slots, PER_COLUMN);
    const colCount = Math.max(1, chunks.length);

    // CSS変数 --cols をセット（CSS: grid-template-columns: repeat(var(--cols, 1), 1fr);）
    root.style.setProperty("--cols", String(colCount));

    // 再描画
    root.innerHTML = "";

    chunks.forEach((group) => {
      const col = document.createElement("div");
      col.className = "column";

      group.forEach((slot) => {
        const item = document.createElement("div");
        item.className = "time-item";

        // 左側: 時刻
        const left = document.createElement("span");
        left.textContent = padTime(slot.time);

        // 右側: 状態トグル
        const right = document.createElement("span");
        right.className = classByState(slot.state);
        right.dataset.ride = rideKey;             // 'argo' | 'buggy'
        right.dataset.time = String(slot.time);   // 'HH:MM'
        right.setAttribute("date-time", String(slot.time)); // 互換のため（既存コードが参照している場合）
        right.textContent = String(slot.state || "〇");
        right.onclick = function () { onClickFn(this); };

        item.appendChild(left);
        item.appendChild(right);
        col.appendChild(item);
      });

      root.appendChild(col);
    });
  }

  // 'ー' のときは利用不可クラス、それ以外は共通トグル
  function classByState(stateChar) {
    return stateChar === "ー" ? "toggle-btn-unavailable" : "toggle-btn";
  }

  // 配列を size 件ずつに分割
  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
    return out;
  }

// "9:5" → " 9:05"（先頭の空白は NBSP）、"10:00" → "10:00"
// 全角数字/コロン（例: "９:５" や "９：０５"）も許容する。
function padTime(t) {
  if (!t && t !== 0) return "";

  const NBSP = "\u00A0";

  // 全角→半角（０-９, ：）
  const s = String(t).trim().replace(/[０-９：]/g, (ch) => {
    if (ch === "：") return ":";
    // '０' = U+FF10
    const code = ch.charCodeAt(0);
    return String.fromCharCode(code - 0xFEE0);
  });

  const m = /^(\d{1,2}):(\d{1,2})$/.exec(s);
  if (!m) return s; // 想定外フォーマットはそのまま返す

  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);

  const mmStr = String(mm).padStart(2, "0");
  const hhStr = String(hh); // 先頭0は付けない

  // 1桁のときだけ NBSP を前置（textContent でも NBSP は正しく表示される）
  const prefix = hh < 10 ? NBSP : "";

  return `${prefix}${hhStr}:${mmStr}`;
}
})();
