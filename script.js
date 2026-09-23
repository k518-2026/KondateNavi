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
}

document.addEventListener("DOMContentLoaded", () => {
  buildCheckboxGroup(document.getElementById("ingredient-group"), "ingredient", INGREDIENTS);
  buildCheckboxGroup(document.getElementById("method-group"), "method", METHODS);
  buildCheckboxGroup(document.getElementById("style-group"), "style", STYLES);

  document.getElementById("suggest-btn").addEventListener("click", suggest);
  document.getElementById("shuffle-btn").addEventListener("click", suggest);

  suggest();
});
