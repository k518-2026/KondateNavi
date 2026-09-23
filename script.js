function buildCheckboxGroup(container, groupId, options) {
  Object.entries(options).forEach(([key, def]) => {
    const id = `${groupId}-${key}`;
    const wrap = document.createElement("label");
    wrap.className = "check-item";
    wrap.setAttribute("for", id);
    wrap.innerHTML = `<input type="checkbox" id="${id}" name="${groupId}" value="${key}"><span>${def.label}</span>`;
    container.appendChild(wrap);
  });
}

function getChecked(groupId) {
  return Array.from(document.querySelectorAll(`input[name="${groupId}"]:checked`)).map((el) => el.value);
}

function pickRandom(arr, n) {
  const copy = [...arr];
  const result = [];
  while (copy.length && result.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(i, 1)[0]);
  }
  return result;
}

function buildSearchUrl(site, keywords) {
  const q = keywords.join(" ");
  if (site === "cookpad") {
    return `https://cookpad.com/jp/search/${encodeURIComponent(q)}`;
  }
  return `https://www.kurashiru.com/search?query=${encodeURIComponent(q)}`;
}

function renderResults(dishes, note) {
  const area = document.getElementById("results");
  area.innerHTML = "";

  if (note) {
    const noteEl = document.createElement("p");
    noteEl.className = "result-note";
    noteEl.textContent = note;
    area.appendChild(noteEl);
  }

  dishes.forEach((dish) => {
    const keywords = [INGREDIENTS[dish.ingredient].search, METHODS[dish.method].search];
    if (!SEARCH_DROPS_STYLE.has(dish.ingredient)) {
      keywords.push(STYLES[dish.style].search);
    }

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-tags">
        <span class="tag">${INGREDIENTS[dish.ingredient].label}</span>
        <span class="tag">${METHODS[dish.method].label}</span>
        <span class="tag">${STYLES[dish.style].label}</span>
      </div>
      <h3>${dish.name}</h3>
      <p class="card-desc">${dish.desc}</p>
      <div class="card-links">
        <a class="link-btn" href="${buildSearchUrl("cookpad", keywords)}" target="_blank" rel="noopener noreferrer">Cookpadで探す</a>
        <a class="link-btn link-btn-alt" href="${buildSearchUrl("kurashiru", keywords)}" target="_blank" rel="noopener noreferrer">クラシルで探す</a>
      </div>
    `;
    area.appendChild(card);
  });
}

// 通算回数は外部の無料カウンターAPI（キー不要）に記録する。
// このサイトにサーバーが無いため、全員分を合算した本当の通算値を
// 安全に書き込める場所が他に無い（GitHub直書きは書き込みトークンの
// 公開が必要になり危険なので避けた）。サービスが落ちている場合は
// このブラウザだけの回数にフォールバックする。
const COUNTER_NAMESPACE = "kondate-navi-k518-2026";
const COUNTER_KEY = "suggest";
const LOCAL_COUNT_FALLBACK_KEY = "kondateNaviSuggestCountLocal";

async function fetchGlobalSuggestCount() {
  const res = await fetch(`https://abacus.jasoncameron.dev/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
  if (!res.ok) throw new Error("counter api error");
  const data = await res.json();
  return data.value;
}

function bumpLocalSuggestCount() {
  try {
    const count = (Number(localStorage.getItem(LOCAL_COUNT_FALLBACK_KEY)) || 0) + 1;
    localStorage.setItem(LOCAL_COUNT_FALLBACK_KEY, String(count));
    return count;
  } catch (e) {
    return null;
  }
}

function renderSuggestCount() {
  const el = document.getElementById("suggest-count");
  if (!el) return;
  fetchGlobalSuggestCount()
    .then((count) => {
      el.textContent = `これまで ${count} 回、レシピを提案しました`;
    })
    .catch((err) => {
      console.error("global counter failed", err);
      const local = bumpLocalSuggestCount();
      el.textContent = local
        ? `これまで ${local} 回、レシピを提案しました（集計サービスに接続できないため、このブラウザだけの回数です）`
        : "";
    });
}

function suggest() {
  const ingredients = getChecked("ingredient");
  const methods = getChecked("method");
  const styles = getChecked("style");

  const candidates = DISHES.filter((d) => {
    const okIngredient = ingredients.length === 0 || ingredients.includes(d.ingredient);
    const okMethod = methods.length === 0 || methods.includes(d.method);
    const okStyle = styles.length === 0 || styles.includes(d.style);
    return okIngredient && okMethod && okStyle;
  });

  if (candidates.length === 0) {
    renderResults(pickRandom(DISHES, 3), "条件に合うレシピが見つからなかったので、おすすめをランダムに表示しています。");
    return;
  }

  const chosen = pickRandom(candidates, Math.min(3, candidates.length));
  renderResults(chosen, chosen.length < 2 ? "条件に合うレシピが少なかったので、これだけ表示しています。" : null);
  renderSuggestCount();
}

document.addEventListener("DOMContentLoaded", () => {
  buildCheckboxGroup(document.getElementById("ingredient-group"), "ingredient", INGREDIENTS);
  buildCheckboxGroup(document.getElementById("method-group"), "method", METHODS);
  buildCheckboxGroup(document.getElementById("style-group"), "style", STYLES);

  document.getElementById("suggest-btn").addEventListener("click", suggest);
  document.getElementById("shuffle-btn").addEventListener("click", suggest);

  suggest();
});
