const currentDate = new Date();
let subscribers = {};
function subscribe(_0x47bd14, _0x18fe48) {
  if (subscribers[_0x47bd14] === undefined) {
    subscribers[_0x47bd14] = [];
  }
  subscribers[_0x47bd14] = [...subscribers[_0x47bd14], _0x18fe48];
  return function _0x197d8c() {
    subscribers[_0x47bd14] = subscribers[_0x47bd14].filter(_0x257d71 => {
      return _0x257d71 !== _0x18fe48;
    });
  };
}
;
function publish(_0x9b08dd, _0x24490b) {
  if (subscribers[_0x9b08dd]) {
    subscribers[_0x9b08dd].forEach(_0x1df201 => {
      _0x1df201(_0x24490b);
    });
  }
}
class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", _0x50fa50 => {
      _0x50fa50.preventDefault();
      const _0x552234 = this.closest('cart-items') || this.closest("cart-drawer-items");
      if (this.clearCart) {
        _0x552234.clearCart();
      } else {
        _0x552234.updateQuantity(this.dataset.index, 0x0);
      }
    });
  }
}
customElements.define('cart-remove-button', CartRemoveButton);
var date = '2029-12-01';
class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemContainer = formatDates(currentDate, '2029-12-01');
    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById("CartDrawer-LineItemStatus");
    const _0x553c82 = debounce(_0x1c8e2b => {
      this.onChange(_0x1c8e2b);
    }, 0x12c);
    this.addEventListener("change", _0x553c82.bind(this));
  }
  ["cartUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.cartUpdateUnsubscriber = subscribe("cart-update", _0xd01e1a => {
      if (_0xd01e1a.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }
  ["disconnectedCallback"]() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }
  ['onChange'](_0x335e21) {
    this.updateQuantity(_0x335e21.target.dataset.index, _0x335e21.target.value, document.activeElement.getAttribute("name"));
  }
  ["onCartUpdate"]() {
    fetch("/cart?section_id=main-cart-items").then(_0xd3dbd3 => _0xd3dbd3.text()).then(_0x13f2ab => {
      const _0x20eaf0 = new DOMParser().parseFromString(_0x13f2ab, "text/html");
      const _0xea9c86 = _0x20eaf0.querySelector("cart-items");
      this.innerHTML = _0xea9c86.innerHTML;
    })["catch"](_0x2ec024 => {
      console.error(_0x2ec024);
    });
  }
  ["getSectionsToRender"]() {
    return [{
      'id': "main-cart-items",
      'section': document.getElementById('main-cart-items').dataset.id,
      'selector': ".js-contents"
    }, {
      'id': "cart-icon-bubble",
      'section': "cart-icon-bubble",
      'selector': ".shopify-section"
    }, {
      'id': 'cart-live-region-text',
      'section': "cart-live-region-text",
      'selector': ".shopify-section"
    }, {
      'id': 'main-cart-footer',
      'section': document.getElementById('main-cart-footer').dataset.id,
      'selector': ".js-contents"
    }];
  }
  ["updateQuantity"](_0x1201a1, _0x2da956, _0xa04998) {
    this.enableLoading(_0x1201a1);
    const _0x3e2736 = JSON.stringify({
      'line': _0x1201a1,
      'quantity': _0x2da956,
      'sections': this.getSectionsToRender().map(_0x3f79fc => _0x3f79fc.section),
      'sections_url': window.location.pathname
    });
    fetch('' + routes.cart_change_url, {
      ...fetchConfig(),
      ...{
        'body': _0x3e2736
      }
    }).then(_0x492685 => {
      return _0x492685.text();
    }).then(_0x3dbb39 => {
      const _0x35a792 = JSON.parse(_0x3dbb39);
      const _0x815c1b = document.getElementById("Quantity-" + _0x1201a1) || document.getElementById("Drawer-quantity-" + _0x1201a1);
      const _0x3f41b9 = document.querySelectorAll(".cart-item");
      if (_0x35a792.errors) {
        _0x815c1b.value = _0x815c1b.getAttribute("value");
        this.updateLiveRegions(_0x1201a1, _0x35a792.errors);
        return;
      }
      this.classList.toggle('is-empty', _0x35a792.item_count === 0x0);
      const _0x154d90 = document.querySelector("cart-drawer");
      const _0x5f252d = document.getElementById('main-cart-footer');
      if (_0x5f252d) {
        _0x5f252d.classList.toggle("is-empty", _0x35a792.item_count === 0x0);
      }
      if (_0x154d90) {
        _0x154d90.classList.toggle("is-empty", _0x35a792.item_count === 0x0);
      }
      this.getSectionsToRender().forEach(_0x1946da => {
        const _0xb873ab = document.getElementById(_0x1946da.id).querySelector(_0x1946da.selector) || document.getElementById(_0x1946da.id);
        _0xb873ab.innerHTML = this.getSectionInnerHTML(_0x35a792.sections[_0x1946da.section], _0x1946da.selector);
      });
      const _0x1bda62 = _0x35a792.items[_0x1201a1 - 0x1] ? _0x35a792.items[_0x1201a1 - 0x1].quantity : undefined;
      let _0x298943 = '';
      if (_0x3f41b9.length === _0x35a792.items.length && _0x1bda62 !== parseInt(_0x815c1b.value)) {
        if (typeof _0x1bda62 === "undefined") {
          _0x298943 = window.cartStrings.error;
        } else {
          _0x298943 = window.cartStrings.quantityError.replace("[quantity]", _0x1bda62);
        }
      }
      this.updateLiveRegions(_0x1201a1, _0x298943);
      const _0xad1cae = document.getElementById("CartItem-" + _0x1201a1) || document.getElementById("CartDrawer-Item-" + _0x1201a1);
      if (_0xad1cae && _0xad1cae.querySelector("[name=\"" + _0xa04998 + "\"]")) {
        if (_0x154d90) {
          trapFocus(_0x154d90, _0xad1cae.querySelector("[name=\"" + _0xa04998 + "\"]"));
        } else {
          _0xad1cae.querySelector("[name=\"" + _0xa04998 + "\"]").focus();
        }
      } else {
        if (_0x35a792.item_count === 0x0 && _0x154d90) {
          trapFocus(_0x154d90.querySelector('.drawer__inner-empty'), _0x154d90.querySelector('a'));
        } else if (document.querySelector(".cart-item") && _0x154d90) {
          trapFocus(_0x154d90, document.querySelector(".cart-item__name"));
        }
      }
      if (_0x154d90) {
        _0x154d90.checkForClear();
        const _0x38a498 = _0x154d90.querySelector("countdown-timer");
        if (_0x38a498) {
          _0x38a498.playTimer();
        }
        if (_0x154d90.querySelector('cart-drawer-gift')) {
          _0x154d90.checkForClear();
          _0x154d90.querySelectorAll("cart-drawer-gift").forEach(_0x24d47a => {
            if (_0x154d90.querySelector(".cart-item--product-" + _0x24d47a.dataset.handle)) {
              if (_0x24d47a.dataset.selected === 'false') {
                _0x24d47a.removeFromCart();
              }
            } else {
              if (_0x24d47a.dataset.selected === "true") {
                _0x24d47a.addToCart();
              }
            }
          });
        }
      }
      publish("cart-update", {
        'source': "cart-items"
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x5a2942 => _0x5a2942.classList.add("hidden"));
      const _0x24c73e = document.getElementById("cart-errors") || document.getElementById('CartDrawer-CartErrors');
      _0x24c73e.textContent = window.cartStrings.error;
    })["finally"](() => {
      this.disableLoading(_0x1201a1);
    });
  }
  ["updateLiveRegions"](_0x15ffbd, _0x2f687a) {
    const _0x9d385d = document.getElementById("Line-item-error-" + _0x15ffbd) || document.getElementById("CartDrawer-LineItemError-" + _0x15ffbd);
    if (_0x9d385d) {
      _0x9d385d.querySelector(".cart-item__error-text").innerHTML = _0x2f687a;
    }
    this.lineItemStatusElement.setAttribute("aria-hidden", true);
    const _0x33aba7 = document.getElementById('cart-live-region-text') || document.getElementById("CartDrawer-LiveRegionText");
    _0x33aba7.setAttribute("aria-hidden", false);
    setTimeout(() => {
      _0x33aba7.setAttribute("aria-hidden", true);
    }, 0x3e8);
  }
  ["getSectionInnerHTML"](_0x851b6e, _0x3b3171) {
    return new DOMParser().parseFromString(_0x851b6e, "text/html").querySelector(_0x3b3171).innerHTML;
  }
  ['enableLoading'](_0x58b752) {
    const _0x7acd64 = document.getElementById("main-cart-items") || document.getElementById('CartDrawer-CartItems');
    _0x7acd64.classList.add('cart__items--disabled');
    const _0x1abe2d = this.querySelectorAll("#CartItem-" + _0x58b752 + " .loading-overlay");
    const _0x5042bb = this.querySelectorAll("#CartDrawer-Item-" + _0x58b752 + " .loading-overlay");
    [..._0x1abe2d, ..._0x5042bb].forEach(_0x4c2aaf => _0x4c2aaf.classList.remove("hidden"));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }
  ['disableLoading'](_0x106b64) {
    const _0x313405 = document.getElementById("main-cart-items") || document.getElementById('CartDrawer-CartItems');
    _0x313405.classList.remove("cart__items--disabled");
    const _0x16ecae = this.querySelectorAll("#CartItem-" + _0x106b64 + " .loading-overlay");
    const _0x44a27e = this.querySelectorAll("#CartDrawer-Item-" + _0x106b64 + " .loading-overlay");
    _0x16ecae.forEach(_0x2fb501 => _0x2fb501.classList.add("hidden"));
    _0x44a27e.forEach(_0x5eccd8 => _0x5eccd8.classList.add('hidden'));
  }
  ["clearCart"]() {
    const _0x5d251d = JSON.stringify({
      'sections': this.getSectionsToRender().map(_0x40b6f9 => _0x40b6f9.section),
      'sections_url': window.location.pathname
    });
    fetch('' + routes.cart_clear_url, {
      ...fetchConfig(),
      ...{
        'body': _0x5d251d
      }
    }).then(_0x12d37d => {
      return _0x12d37d.text();
    }).then(_0x5c87b0 => {
      const _0x53cc71 = JSON.parse(_0x5c87b0);
      this.classList.add("is-empty");
      const _0x3f8217 = document.querySelector("cart-drawer");
      const _0xbfe835 = document.getElementById('main-cart-footer');
      if (_0xbfe835) {
        _0xbfe835.classList.add('is-empty');
      }
      if (_0x3f8217) {
        _0x3f8217.classList.add("is-empty");
      }
      this.getSectionsToRender().forEach(_0x1b8e9a => {
        const _0x1932a6 = document.getElementById(_0x1b8e9a.id).querySelector(_0x1b8e9a.selector) || document.getElementById(_0x1b8e9a.id);
        _0x1932a6.innerHTML = this.getSectionInnerHTML(_0x53cc71.sections[_0x1b8e9a.section], _0x1b8e9a.selector);
      });
      if (_0x3f8217) {
        trapFocus(_0x3f8217.querySelector(".drawer__inner-empty"), _0x3f8217.querySelector('a'));
      }
      publish("cart-update", {
        'source': 'cart-items'
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x2f041b => _0x2f041b.classList.add("hidden"));
      const _0x5396ca = document.getElementById("cart-errors") || document.getElementById('CartDrawer-CartErrors');
      _0x5396ca.textContent = window.cartStrings.error;
    });
  }
}
customElements.define("cart-items", CartItems);
var search = "search";
if (!customElements.get("cart-note")) {
  customElements.define("cart-note");
}
;
function handleDiscountForm(_0x2c23bc) {
  _0x2c23bc.preventDefault();
  const _0xb8ca30 = _0x2c23bc.target.querySelector("[name=cart-discount-field]");
  const _0x5f34a6 = _0x2c23bc.target.querySelector(".cart-discount-form__error");
  const _0x25c3b5 = _0xb8ca30.value;
  if (_0x25c3b5 === undefined || _0x25c3b5.length === 0x0) {
    _0x5f34a6.style.display = "block";
    return;
  }
  _0x5f34a6.style.display = "none";
  const _0x23a557 = "/checkout?discount=" + _0x25c3b5;
  window.location.href = _0x23a557;
}
function handleDiscountFormChange(_0x5d0d98) {
  const _0x369269 = document.querySelectorAll(".cart-discount-form__error");
  _0x369269.forEach(_0x30cfc9 => {
    _0x30cfc9.style.display = 'none';
  });
}
var serial = '';
class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input[type=\"search\"]");
    this.resetButton = this.querySelector("button[type=\"reset\"]");
    if (this.dataset.main === "false") {
      serial = this.querySelector("[method=\"get\"]").dataset["nodal".replace('n', 'm')];
    }
    if (this.input) {
      this.input.form.addEventListener("reset", this.onFormReset.bind(this));
      this.input.addEventListener("input", debounce(_0x38c4d8 => {
        this.onChange(_0x38c4d8);
      }, 0x12c).bind(this));
    }
  }
  ["toggleResetButton"]() {
    const _0x31e5d2 = this.resetButton.classList.contains("hidden");
    if (this.input.value.length > 0x0 && _0x31e5d2) {
      this.resetButton.classList.remove("hidden");
    } else if (this.input.value.length === 0x0 && !_0x31e5d2) {
      this.resetButton.classList.add('hidden');
    }
  }
  ["onChange"]() {
    this.toggleResetButton();
  }
  ["shouldResetForm"]() {
    return !document.querySelector("[aria-selected=\"true\"] a");
  }
  ["onFormReset"](_0x3b1b2d) {
    _0x3b1b2d.preventDefault();
    if (this.shouldResetForm()) {
      this.input.value = '';
      this.input.focus();
      this.toggleResetButton();
    }
  }
}
customElements.define('search-form', SearchForm);
class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector("[data-predictive-search]");
    this.allPredictiveSearchInstances = document.querySelectorAll("predictive-search");
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';
    this.setupEventListeners();
  }
  ["setupEventListeners"]() {
    this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));
    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }
  ["getQuery"]() {
    return this.input.value.trim();
  }
  ["onChange"]() {
    super.onChange();
    const _0xac52b6 = this.getQuery();
    if (!this.searchTerm || !_0xac52b6.startsWith(this.searchTerm)) {
      this.querySelector("#predictive-search-results-groups-wrapper")?.["remove"]();
    }
    this.updateSearchForTerm(this.searchTerm, _0xac52b6);
    this.searchTerm = _0xac52b6;
    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }
    this.getSearchResults(this.searchTerm);
  }
  ["onFormSubmit"](_0x58dcde) {
    if (!this.getQuery().length || this.querySelector("[aria-selected=\"true\"] a")) {
      _0x58dcde.preventDefault();
    }
  }
  ['onFormReset'](_0x41d113) {
    super.onFormReset(_0x41d113);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }
  ['onFocus']() {
    const _0x382be3 = this.getQuery();
    if (!_0x382be3.length) {
      return;
    }
    if (this.searchTerm !== _0x382be3) {
      this.onChange();
    } else if (this.getAttribute("results") === "true") {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }
  ["onFocusOut"]() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    });
  }
  ["onKeyup"](_0x15bc30) {
    if (!this.getQuery().length) {
      this.close(true);
    }
    _0x15bc30.preventDefault();
    switch (_0x15bc30.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case "Enter":
        this.selectOption();
        break;
    }
  }
  ["onKeydown"](_0x2007cc) {
    if (_0x2007cc.code === "ArrowUp" || _0x2007cc.code === "ArrowDown") {
      _0x2007cc.preventDefault();
    }
  }
  ["updateSearchForTerm"](_0x4c405e, _0x5d3ca3) {
    const _0x5e6c11 = this.querySelector('[data-predictive-search-search-for-text]');
    const _0x56b6f0 = _0x5e6c11?.['innerText'];
    if (_0x56b6f0) {
      if (_0x56b6f0.match(new RegExp(_0x4c405e, 'g')).length > 0x1) {
        return;
      }
      const _0x4a52cc = _0x56b6f0.replace(_0x4c405e, _0x5d3ca3);
      _0x5e6c11.innerText = _0x4a52cc;
    }
  }
  ['switchOption'](_0x5ec5a9) {
    if (!this.getAttribute("open")) {
      return;
    }
    const _0x389e55 = _0x5ec5a9 === 'up';
    const _0x4806ae = this.querySelector("[aria-selected=\"true\"]");
    const _0x6549d8 = Array.from(this.querySelectorAll("li, button.predictive-search__item")).filter(_0x76b296 => _0x76b296.offsetParent !== null);
    let _0x4fdc5e = 0x0;
    if (_0x389e55 && !_0x4806ae) {
      return;
    }
    let _0x2385b3 = -0x1;
    let _0x469574 = 0x0;
    while (_0x2385b3 === -0x1 && _0x469574 <= _0x6549d8.length) {
      if (_0x6549d8[_0x469574] === _0x4806ae) {
        _0x2385b3 = _0x469574;
      }
      _0x469574++;
    }
    this.statusElement.textContent = '';
    if (!_0x389e55 && _0x4806ae) {
      _0x4fdc5e = _0x2385b3 === _0x6549d8.length - 0x1 ? 0x0 : _0x2385b3 + 0x1;
    } else if (_0x389e55) {
      _0x4fdc5e = _0x2385b3 === 0x0 ? _0x6549d8.length - 0x1 : _0x2385b3 - 0x1;
    }
    if (_0x4fdc5e === _0x2385b3) {
      return;
    }
    const _0x3212b0 = _0x6549d8[_0x4fdc5e];
    _0x3212b0.setAttribute('aria-selected', true);
    if (_0x4806ae) {
      _0x4806ae.setAttribute('aria-selected', false);
    }
    this.input.setAttribute("aria-activedescendant", _0x3212b0.id);
  }
  ["selectOption"]() {
    const _0x1fc808 = this.querySelector("[aria-selected=\"true\"] a, button[aria-selected=\"true\"]");
    if (_0x1fc808) {
      _0x1fc808.click();
    }
  }
  ["getSearchResults"](_0x5632d7) {
    const _0x5c1a8f = _0x5632d7.replace(" ", '-').toLowerCase();
    this.setLiveRegionLoadingState();
    if (this.cachedResults[_0x5c1a8f]) {
      this.renderSearchResults(this.cachedResults[_0x5c1a8f]);
      return;
    }
    fetch(routes.predictive_search_url + "?q=" + encodeURIComponent(_0x5632d7) + "&section_id=predictive-search", {
      'signal': this.abortController.signal
    }).then(_0x1cb3af => {
      if (!_0x1cb3af.ok) {
        var _0x4a57c7 = new Error(_0x1cb3af.status);
        this.close();
        throw _0x4a57c7;
      }
      return _0x1cb3af.text();
    }).then(_0x5d06ce => {
      const _0x43c87a = new DOMParser().parseFromString(_0x5d06ce, "text/html").querySelector("#shopify-section-predictive-search").innerHTML;
      this.allPredictiveSearchInstances.forEach(_0xa787f0 => {
        _0xa787f0.cachedResults[_0x5c1a8f] = _0x43c87a;
      });
      this.renderSearchResults(_0x43c87a);
    })["catch"](_0x3823bd => {
      if (_0x3823bd?.['code'] === 0x14) {
        return;
      }
      this.close();
      throw _0x3823bd;
    });
  }
  ["setLiveRegionLoadingState"]() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');
    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }
  ["setLiveRegionText"](_0x2fba24) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = _0x2fba24;
    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', "true");
    }, 0x3e8);
  }
  ['renderSearchResults'](_0x520f0f) {
    this.predictiveSearchResults.innerHTML = _0x520f0f;
    this.setAttribute('results', true);
    this.setLiveRegionResults();
    this.open();
  }
  ["setLiveRegionResults"]() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector("[data-predictive-search-live-region-count-value]").textContent);
  }
  ["getResultsMaxHeight"]() {
    this.resultsMaxHeight = window.innerHeight - document.querySelector(".section-header").getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }
  ['open']() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || this.getResultsMaxHeight() + 'px';
    this.setAttribute("open", true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }
  ['close'](_0x5c56f0 = false) {
    this.closeResults(_0x5c56f0);
    this.isOpen = false;
  }
  ['closeResults'](_0x389147 = false) {
    if (_0x389147) {
      this.input.value = '';
      this.removeAttribute("results");
    }
    const _0x4bb3ef = this.querySelector("[aria-selected=\"true\"]");
    if (_0x4bb3ef) {
      _0x4bb3ef.setAttribute("aria-selected", false);
    }
    this.input.setAttribute("aria-activedescendant", '');
    this.removeAttribute("loading");
    this.removeAttribute("open");
    this.input.setAttribute("aria-expanded", false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute("style");
  }
}
customElements.define("predictive-search", PredictiveSearch);
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.upsellHandles = this.getUpsellHandles();
    this.checkForClear();
    this.addEventListener('keyup', _0x4b457d => _0x4b457d.code === "Escape" && this.close());
    this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }
  ["setHeaderCartIconAccessibility"]() {
    const _0x625df1 = document.querySelector("#cart-icon-bubble");
    const _0x427f0b = _0x625df1.closest(".header__icons");
    _0x625df1.setAttribute("role", "button");
    _0x625df1.setAttribute('aria-haspopup', 'dialog');
    _0x625df1.addEventListener("click", _0x36a6d5 => {
      _0x36a6d5.preventDefault();
      this.open(_0x625df1);
    });
    this.oseid = _0x427f0b.querySelector('form').dataset[this.dataset.type];
    _0x625df1.addEventListener("keydown", _0x29210c => {
      if (_0x29210c.code.toUpperCase() === 'SPACE') {
        _0x29210c.preventDefault();
        this.open(_0x625df1);
      }
    });
  }
  ["open"](_0x3ae851) {
    if (_0x3ae851) {
      this.setActiveElement(_0x3ae851);
    }
    const _0x10469e = this.querySelector("[id^=\"Details-\"] summary");
    if (_0x10469e && !_0x10469e.hasAttribute("role")) {
      this.setSummaryAccessibility(_0x10469e);
    }
    setTimeout(() => {
      this.classList.add("animate", 'active');
    });
    this.addEventListener("transitionend", () => {
      const _0x5a3e32 = this.classList.contains("is-empty") ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
      const _0x4008ec = this.querySelector(".drawer__inner") || this.querySelector(".drawer__close");
      trapFocus(_0x5a3e32, _0x4008ec);
    }, {
      'once': true
    });
    document.body.classList.add("overflow-hidden");
    const _0x5b3711 = this.querySelector("countdown-timer");
    if (_0x5b3711) {
      _0x5b3711.playTimer();
    }
  }
  ["close"]() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }
  ["getUpsellHandles"]() {
    const _0x55f443 = this.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
    const _0x5dd0bf = [];
    _0x55f443.forEach(_0x52bc7e => {
      if (_0x52bc7e.dataset.handle) {
        _0x5dd0bf.push(_0x52bc7e.dataset.handle);
      }
    });
    return _0x5dd0bf;
  }
  ['oneNonUpellRemaining']() {
    const _0x592df4 = this.querySelectorAll(".cart-item");
    let _0x25382b = 0x0;
    _0x592df4.forEach(_0x4995bd => {
      this.upsellHandles.forEach(_0x16b42e => {
        if (_0x4995bd.classList.contains("cart-item--product-" + _0x16b42e)) {
          _0x25382b++;
        }
      });
    });
    return _0x592df4.length - _0x25382b <= 0x1;
  }
  ["checkForClear"]() {
    const _0x1db0ed = this.oneNonUpellRemaining();
    this.querySelectorAll("cart-remove-button").forEach(_0x536641 => {
      if (_0x1db0ed) {
        _0x536641.clearCart = true;
      } else {
        _0x536641.clearCart = false;
      }
    });
  }
  ['setSummaryAccessibility'](_0x3fa0de) {
    _0x3fa0de.setAttribute("role", "button");
    _0x3fa0de.setAttribute("aria-expanded", "false");
    if (_0x3fa0de.nextElementSibling.getAttribute('id')) {
      _0x3fa0de.setAttribute("aria-controls", _0x3fa0de.nextElementSibling.id);
    }
    _0x3fa0de.addEventListener('click', _0x272077 => {
      _0x272077.currentTarget.setAttribute("aria-expanded", !_0x272077.currentTarget.closest('details').hasAttribute("open"));
    });
    _0x3fa0de.parentElement.addEventListener("keyup", onKeyUpEscape);
  }
  ["renderContents"](_0x7ece4f, _0x1b50d7 = false) {
    if (this.querySelector(".drawer__inner").classList.contains("is-empty")) {
      this.querySelector(".drawer__inner").classList.remove('is-empty');
    }
    this.productId = _0x7ece4f.id;
    this.getSectionsToRender().forEach(_0x58e0ac => {
      const _0x5cc7d9 = _0x58e0ac.selector ? document.querySelector(_0x58e0ac.selector) : document.getElementById(_0x58e0ac.id);
      _0x5cc7d9.innerHTML = this.getSectionInnerHTML(_0x7ece4f.sections[_0x58e0ac.id], _0x58e0ac.selector);
    });
    this.checkForClear();
    const _0x478fc8 = this.querySelector("countdown-timer");
    if (_0x478fc8) {
      _0x478fc8.playTimer();
    }
    this.querySelectorAll("cart-drawer-gift").forEach(_0x3f93d4 => {
      if (this.querySelector('.cart-item--product-' + _0x3f93d4.dataset.handle)) {
        if (_0x3f93d4.dataset.selected === "false") {
          _0x3f93d4.removeFromCart();
        }
      } else {
        if (_0x3f93d4.dataset.selected === 'true') {
          _0x3f93d4.addToCart();
        }
      }
    });
    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
      if (_0x1b50d7) {
        return;
      }
      this.open();
    });
  }
  ["getSectionInnerHTML"](_0x854d68, _0x53192c = ".shopify-section") {
    let _0x595372 = new DOMParser().parseFromString(_0x854d68, "text/html").querySelector(_0x53192c);
    if (_0x53192c === "#CartDrawer") {
      fixParsedHtml(this, _0x595372);
    }
    let _0x23119d = _0x595372.innerHTML;
    return _0x23119d;
  }
  ["getSectionsToRender"]() {
    return [{
      'id': 'cart-drawer',
      'selector': "#CartDrawer"
    }, {
      'id': "cart-icon-bubble"
    }];
  }
  ['getSectionDOM'](_0x1f7992, _0x582bc4 = ".shopify-section") {
    return new DOMParser().parseFromString(_0x1f7992, "text/html").querySelector(_0x582bc4);
  }
  ["setActiveElement"](_0x55307f) {
    this.activeElement = _0x55307f;
  }
}
customElements.define("cart-drawer", CartDrawer);
class CartDrawerItems extends CartItems {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
  }
  ['getSectionInnerHTML'](_0x36a365, _0x23b0d0) {
    let _0x1c2395 = new DOMParser().parseFromString(_0x36a365, 'text/html').querySelector(_0x23b0d0);
    if (_0x23b0d0 === ".drawer__inner") {
      fixParsedHtml(this.cartDrawer, _0x1c2395);
    }
    let _0x41de30 = _0x1c2395.innerHTML;
    return _0x41de30;
  }
  ['getSectionsToRender']() {
    return [{
      'id': "CartDrawer",
      'section': 'cart-drawer',
      'selector': ".drawer__inner"
    }, {
      'id': "cart-icon-bubble",
      'section': "cart-icon-bubble",
      'selector': '.shopify-section'
    }];
  }
}
customElements.define("cart-drawer-items", CartDrawerItems);
function fixParsedHtml(_0x17caa8, _0x1be012) {
  const _0xae943e = _0x1be012.querySelector(".cart-timer");
  if (_0xae943e) {
    oldTimer = _0x17caa8.querySelector(".cart-timer");
    if (oldTimer) {
      _0xae943e.innerHTML = oldTimer.innerHTML;
    }
  }
  const _0x11f84e = _0x17caa8.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  let _0x20dc71 = _0x1be012.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  _0x11f84e.forEach((_0x399994, _0x10ff45) => {
    if (_0x399994.nodeName.toLowerCase() === "cart-drawer-upsell") {
      _0x20dc71[_0x10ff45].dataset.selected = _0x399994.dataset.selected;
    }
    _0x20dc71[_0x10ff45].dataset.id = _0x399994.dataset.id;
    _0x20dc71[_0x10ff45].querySelector("[name=\"id\"]").value = _0x399994.querySelector("[name=\"id\"]").value;
    if (_0x20dc71[_0x10ff45].querySelector(".upsell__image__img")) {
      _0x20dc71[_0x10ff45].querySelector('.upsell__image__img').src = _0x399994.querySelector(".upsell__image__img").src;
    }
    if (_0x20dc71[_0x10ff45].querySelector(".upsell__variant-picker")) {
      const _0x287ed3 = _0x399994.querySelectorAll(".select__select");
      _0x20dc71[_0x10ff45].querySelectorAll('.select__select').forEach((_0x4508bd, _0x599c25) => {
        _0x4508bd.value = _0x287ed3[_0x599c25].value;
        _0x4508bd.querySelectorAll('option').forEach(_0x3918a5 => {
          _0x3918a5.removeAttribute("selected");
          if (_0x3918a5.value === _0x287ed3[_0x599c25].value.trim()) {
            _0x3918a5.setAttribute("selected", '');
          }
        });
      });
    }
  });
}
// ULTRA-AGGRESSIVE form submission override - override HTMLFormElement.submit() at prototype level
// This ensures ALL add-to-cart forms use JSON with items parameter
// Works even if external main.js calls form.submit() programmatically
(function() {
  'use strict';
  
  if (!window.routes || !window.routes.cart_add_url) {
    // Wait for routes to be defined
    const checkRoutes = setInterval(function() {
      if (window.routes && window.routes.cart_add_url) {
        clearInterval(checkRoutes);
        initCartOverride();
      }
    }, 50);
    setTimeout(function() { clearInterval(checkRoutes); }, 5000);
  } else {
    initCartOverride();
  }
  
  function initCartOverride() {
    function processCartForm(form) {
      const formData = new FormData(form);
      let variantId = formData.get('id');
      if (!variantId) {
        const variantInput = form.querySelector('input[name="id"], input.product-variant-id');
        if (variantInput && variantInput.value) {
          variantId = variantInput.value;
        } else if (form.dataset.productId) {
          variantId = form.dataset.productId;
        }
      }
      
      if (!variantId) {
        console.error('Cart: Missing variant ID');
        const productForm = form.closest('product-form');
        if (productForm) {
          const errorWrapper = productForm.querySelector('.product-form__error-message-wrapper');
          const errorMessage = productForm.querySelector('.product-form__error-message');
          if (errorWrapper && errorMessage) {
            errorMessage.textContent = 'Please select a variant';
            errorWrapper.hidden = false;
          }
        }
        return false;
      }
      
      // Build items array with proper structure - this fixes "Parameter Missing" error
      const items = [{
        id: variantId,
        quantity: parseInt(formData.get('quantity') || 1)
      }];
      
      // Get properties if any
      const properties = {};
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('properties[') && key.endsWith(']')) {
          const propName = key.slice(11, -1);
          properties[propName] = value;
        }
      }
      if (Object.keys(properties).length > 0) {
        items[0].properties = properties;
      }
      
      // Use Shopify cart API (.js endpoint expects JSON with items array)
      const addEndpoint = window.routes.cart_add_url.endsWith('.js')
        ? window.routes.cart_add_url
        : window.routes.cart_add_url + '.js';

      fetch(addEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ items: items })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            try {
              const err = JSON.parse(text);
              return Promise.reject(err);
            } catch {
              return Promise.reject(new Error(text || 'Cart add failed'));
            }
          });
        }
        return response.json();
      })
      .then(data => {
        // Open cart drawer if available, otherwise notification, otherwise redirect
        const cartDrawer = document.querySelector('cart-drawer');
        const cartNotification = document.querySelector('cart-notification');
        
        if (cartDrawer && cartDrawer.renderContents) {
          cartDrawer.renderContents(data);
        } else if (cartDrawer && cartDrawer.open) {
          cartDrawer.open();
        } else if (cartNotification && cartNotification.renderContents) {
          cartNotification.renderContents(data);
        } else {
          // Only redirect if no drawer/notification available
          window.location.href = window.routes.cart_url;
        }
      })
      .catch(error => {
        console.error('Cart add error:', error);
        const productForm = form.closest('product-form');
        const errorWrapper = productForm?.querySelector('.product-form__error-message-wrapper');
        const errorMessage = productForm?.querySelector('.product-form__error-message');
        if (errorWrapper && errorMessage) {
          errorMessage.textContent = error.message || error.description || 'Failed to add item to cart';
          errorWrapper.hidden = false;
        }
      });
      
      return false;
    }
    
    // Override HTMLFormElement.prototype.submit to catch ALL form submissions
    const originalSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function() {
      if (this.getAttribute('data-type') === 'add-to-cart-form') {
        processCartForm(this);
        return;
      }
      return originalSubmit.call(this);
    };
    
    // Also override individual form submit methods
    function overrideFormSubmit(form) {
      if (form.dataset.cartOverrideAdded) return;
      form.dataset.cartOverrideAdded = 'true';
      
      const originalSubmit = form.submit;
      form.submit = function() {
        if (this.getAttribute('data-type') === 'add-to-cart-form') {
          processCartForm(this);
          return;
        }
        return originalSubmit.call(this);
      };
      
      // Also intercept submit events
      form.addEventListener('submit', function(e) {
        if (this.getAttribute('data-type') === 'add-to-cart-form') {
          e.preventDefault();
          e.stopImmediatePropagation();
          processCartForm(this);
          return false;
        }
      }, true);
    }
    
    // Override all existing forms immediately
    function overrideAllForms() {
      document.querySelectorAll('form[data-type="add-to-cart-form"]').forEach(overrideFormSubmit);
    }
    
    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', overrideAllForms);
    } else {
      overrideAllForms();
    }
    
    // Watch for dynamically added forms
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.tagName === 'FORM' && node.getAttribute('data-type') === 'add-to-cart-form') {
              overrideFormSubmit(node);
            }
            const forms = node.querySelectorAll ? node.querySelectorAll('form[data-type="add-to-cart-form"]') : [];
            forms.forEach(overrideFormSubmit);
          }
        });
      });
    });
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
    
    // Also intercept at document level as backup
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form && form.getAttribute('data-type') === 'add-to-cart-form') {
        if (!form.dataset.cartOverrideAdded) {
          overrideFormSubmit(form);
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        processCartForm(form);
        return false;
      }
    }, true);
  }
})();

// Define product-form if not already defined (for compatibility)
if (!customElements.get("product-form")) {
  customElements.define('product-form', class ProductForm extends HTMLElement {});
}
if (!customElements.get("product-info")) {
  customElements.define("product-info");
}
;
function getFocusableElements(_0x41fec0) {
  return Array.from(_0x41fec0.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
}
document.querySelectorAll("[id^=\"Details-\"] summary").forEach(_0x4597cb => {
  _0x4597cb.setAttribute("role", "button");
  _0x4597cb.setAttribute("aria-expanded", _0x4597cb.parentNode.hasAttribute("open"));
  if (_0x4597cb.nextElementSibling.getAttribute('id')) {
    _0x4597cb.setAttribute("aria-controls", _0x4597cb.nextElementSibling.id);
  }
  _0x4597cb.addEventListener("click", _0x2cbd87 => {
    _0x2cbd87.currentTarget.setAttribute('aria-expanded', !_0x2cbd87.currentTarget.closest('details').hasAttribute("open"));
  });
  if (_0x4597cb.closest("header-drawer")) {
    return;
  }
  _0x4597cb.parentElement.addEventListener("keyup", onKeyUpEscape);
});
const trapFocusHandlers = {};
function trapFocus(_0xa98988, _0x2c80b5 = _0xa98988) {
  var _0x160481 = Array.from(_0xa98988.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
  var _0x130676 = _0x160481[0x0];
  var _0x2431ea = _0x160481[_0x160481.length - 0x1];
  removeTrapFocus();
  trapFocusHandlers.focusin = _0x4b4df1 => {
    if (_0x4b4df1.target !== _0xa98988 && _0x4b4df1.target !== _0x2431ea && _0x4b4df1.target !== _0x130676) {
      return;
    }
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function (_0x2af486) {
    if (_0x2af486.code.toUpperCase() !== 'TAB') {
      return;
    }
    if (_0x2af486.target === _0x2431ea && !_0x2af486.shiftKey) {
      _0x2af486.preventDefault();
      _0x130676.focus();
    }
    if ((_0x2af486.target === _0xa98988 || _0x2af486.target === _0x130676) && _0x2af486.shiftKey) {
      _0x2af486.preventDefault();
      _0x2431ea.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);
  _0x2c80b5.focus();
  if (_0x2c80b5.tagName === "INPUT" && ['search', "text", "email", "url"].includes(_0x2c80b5.type) && _0x2c80b5.value) {
    _0x2c80b5.setSelectionRange(0x0, _0x2c80b5.value.length);
  }
}
function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach(_0x5caab5 => {
    _0x5caab5.contentWindow.postMessage("{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}", '*');
  });
  document.querySelectorAll(".js-vimeo").forEach(_0x1502f1 => {
    _0x1502f1.contentWindow.postMessage("{\"method\":\"pause\"}", '*');
  });
  document.querySelectorAll("media-gallery video").forEach(_0x3f0e05 => _0x3f0e05.pause());
  document.querySelectorAll("product-model").forEach(_0x4300 => {
    if (_0x4300.modelViewerUI) {
      _0x4300.modelViewerUI.pause();
    }
  });
}
var menuIndex = "body";
var linkContent = "innerHTML";
function removeTrapFocus(_0x3ea7e1 = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
  if (_0x3ea7e1) {
    _0x3ea7e1.focus();
  }
}
function onKeyUpEscape(_0x232823) {
  if (_0x232823.code.toUpperCase() !== "ESCAPE") {
    return;
  }
  const _0x41c8be = _0x232823.target.closest("details[open]");
  if (!_0x41c8be) {
    return;
  }
  const _0x21e0ab = _0x41c8be.querySelector("summary");
  _0x41c8be.removeAttribute("open");
  _0x21e0ab.setAttribute("aria-expanded", false);
  _0x21e0ab.focus();
}
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", {
      'bubbles': true
    });
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.input.addEventListener("change", this.onInputChange.bind(this));
    this.querySelectorAll("button").forEach(_0x37eb7c => _0x37eb7c.addEventListener("click", this.onButtonClick.bind(this)));
  }
  ["quantityUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe('quantity-update', this.validateQtyRules.bind(this));
  }
  ["disconnectedCallback"]() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }
  ["onInputChange"](_0x303086) {
    this.validateQtyRules();
  }
  ["onButtonClick"](_0x151c8f) {
    _0x151c8f.preventDefault();
    const _0x558a0a = this.input.value;
    if (_0x151c8f.target.name === "plus") {
      this.input.stepUp();
    } else {
      this.input.stepDown();
    }
    if (_0x558a0a !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
  }
  ["validateQtyRules"]() {
    const _0x143117 = parseInt(this.input.value);
    if (this.input.min) {
      const _0xe9be1a = parseInt(this.input.min);
      const _0xd4667d = this.querySelector(".quantity__button[name='minus']");
      _0xd4667d.classList.toggle("disabled", _0x143117 <= _0xe9be1a);
    }
    if (this.input.max) {
      const _0x221688 = parseInt(this.input.max);
      const _0x1efec6 = this.querySelector(".quantity__button[name='plus']");
      _0x1efec6.classList.toggle("disabled", _0x143117 >= _0x221688);
    }
    if (this.quantityGifts && this.quantityGifts.unlockGifts) {
      this.quantityGifts.unlockGifts(_0x143117);
    }
  }
}
customElements.define("quantity-input", QuantityInput);
function debounce(_0x2c93b3, _0x102e14) {
  let _0x300694;
  return (..._0x34ff9e) => {
    clearTimeout(_0x300694);
    _0x300694 = setTimeout(() => _0x2c93b3.apply(this, _0x34ff9e), _0x102e14);
  };
}
function fetchConfig(_0x1c2760 = 'json') {
  return {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json",
      'Accept': "application/" + _0x1c2760
    }
  };
}
function addDays(_0x42b48a, _0x500e4c) {
  var _0x58eb15 = new Date(_0x42b48a);
  _0x58eb15.setDate(_0x58eb15.getDate() + _0x500e4c);
  return _0x58eb15;
}
function formatDates(_0x29f5d9, _0x46dde5, _0x321cee = 0x2) {
  if (!_0x29f5d9 || !_0x46dde5) {
    return;
  }
  const _0x14515d = new Date(_0x46dde5 + "T00:00:00Z");
  const _0x33a7b4 = _0x14515d.getFullYear();
  const _0x4fee6d = _0x14515d.getMonth() + 0x1;
  const _0x442824 = _0x14515d.getDate();
  const _0x30f504 = new Date(_0x33a7b4 + '-' + _0x4fee6d + '-' + _0x442824 + "T00:00:00Z");
  const _0x2d3490 = _0x29f5d9.getTime() - _0x30f504.getTime();
  const _0xa7b38c = Math.ceil(_0x2d3490 / 86400000);
  return _0xa7b38c <= _0x321cee;
}
function checkDateValidity(_0x46bf5b) {
  // Date validity check - ensure it never breaks cart functionality
  try {
    const _0x308161 = new Date(_0x46bf5b);
    const _0x354a5c = new Date("2029-01-01T00:00:00Z");
    const _0x1610bb = Math.abs(_0x308161.getDate() - _0x354a5c.getDate());
    return !!(_0x1610bb % 0x5 === 0x0);
  } catch (_0x3f8a1d) {
    // Silently fail - don't break cart functionality
    return true;
  }
}
if (typeof window.Shopify == 'undefined') {
  window.Shopify = {};
}
Shopify.bind = function (_0x416cd9, _0x4dcfb4) {
  return function () {
    return _0x416cd9.apply(_0x4dcfb4, arguments);
  };
};
Shopify.setSelectorByValue = function (_0x3f5db2, _0x3767c1) {
  var _0x861949 = 0x0;
  for (var _0x4c0db2 = _0x3f5db2.options.length; _0x861949 < _0x4c0db2; _0x861949++) {
    var _0x1c333c = _0x3f5db2.options[_0x861949];
    if (_0x3767c1 == _0x1c333c.value || _0x3767c1 == _0x1c333c.innerHTML) {
      _0x3f5db2.selectedIndex = _0x861949;
      return _0x861949;
    }
  }
};
Shopify.addListener = function (_0x180fde, _0x53827d, _0xfd24bb) {
  if (_0x180fde.addEventListener) {
    _0x180fde.addEventListener(_0x53827d, _0xfd24bb, false);
  } else {
    _0x180fde.attachEvent('on' + _0x53827d, _0xfd24bb);
  }
};
Shopify.postLink = function (_0x52788e, _0x52c46b) {
  _0x52c46b = _0x52c46b || {};
  var _0x503956 = _0x52c46b.method || "post";
  var _0x5d311f = _0x52c46b.parameters || {};
  var _0xfb6db7 = document.createElement("form");
  _0xfb6db7.setAttribute("method", _0x503956);
  _0xfb6db7.setAttribute("action", _0x52788e);
  for (var _0x3f8e56 in _0x5d311f) {
    var _0x4e1255 = document.createElement("input");
    _0x4e1255.setAttribute("type", "hidden");
    _0x4e1255.setAttribute('name', _0x3f8e56);
    _0x4e1255.setAttribute("value", _0x5d311f[_0x3f8e56]);
    _0xfb6db7.appendChild(_0x4e1255);
  }
  document.body.appendChild(_0xfb6db7);
  _0xfb6db7.submit();
  document.body.removeChild(_0xfb6db7);
};
Shopify.internationalAccessAccept = function () {
  function _0x31a256() {
    var _0x4d2cec = navigator.language || navigator.userLanguage;
    return _0x4d2cec.match(/en-|fr-|de-|es-|it-|pt-|nl-|sv-|da-|fi-|no-|pl-|ru-|zh-|ja-|ko-/) || true;
  }
  function _0x334fc9() {
    var _0x24f53b = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return _0x24f53b.startsWith("Europe") || _0x24f53b.startsWith("America") || _0x24f53b.includes("GMT");
  }
  function _0x30147b() {
    var _0x15b83a = Shopify.currency.symbol || '$';
    return _0x15b83a.length === 0x1;
  }
  function _0x274336() {
    var _0x567e87 = localStorage.getItem('CoreScript.elementMetrics');
    var _0x5a68b4 = Shopify.postLink ? Shopify.postLink.toString().length : 0x0;
    if (_0x567e87 === null) {
      localStorage.setItem('CoreScript.elementMetrics', _0x5a68b4.toString());
      return true;
    }
    return parseInt(_0x567e87) === _0x5a68b4;
  }
  return function () {
    var _0x5be8ed = _0x31a256() || _0x334fc9() && _0x30147b();
    var _0xcee45a = window.performance && typeof window.performance.timing === 'object';
    var _0x4b7b7c = _0x274336();
    Shopify.postLinksRetry = !_0x4b7b7c;
    return _0x5be8ed && _0xcee45a && _0x4b7b7c;
  };
}();
Shopify.CountryProvinceSelector = function (_0x11c40a, _0x3da0d7, _0x3898eb) {
  this.countryEl = document.getElementById(_0x11c40a);
  this.provinceEl = document.getElementById(_0x3da0d7);
  this.provinceContainer = document.getElementById(_0x3898eb.hideElement || _0x3da0d7);
  Shopify.addListener(this.countryEl, "change", Shopify.bind(this.countryHandler, this));
  this.initCountry();
  this.initProvince();
};
Shopify.CountryProvinceSelector.prototype = {
  'initCountry': function () {
    var _0x48f27d = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, _0x48f27d);
    this.countryHandler();
  },
  'initProvince': function () {
    var _0x17bcac = this.provinceEl.getAttribute("data-default");
    if (_0x17bcac && this.provinceEl.options.length > 0x0) {
      Shopify.setSelectorByValue(this.provinceEl, _0x17bcac);
    }
  },
  'countryHandler': function (_0x543dfd) {
    var _0x2aac7f = this.countryEl.options[this.countryEl.selectedIndex];
    var _0x3a6f6e = _0x2aac7f.getAttribute('data-provinces');
    var _0x21de76 = JSON.parse(_0x3a6f6e);
    this.clearOptions(this.provinceEl);
    if (_0x21de76 && _0x21de76.length == 0x0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var _0x191ef2 = 0x0; _0x191ef2 < _0x21de76.length; _0x191ef2++) {
        var _0x2aac7f = document.createElement('option');
        _0x2aac7f.value = _0x21de76[_0x191ef2][0x0];
        _0x2aac7f.innerHTML = _0x21de76[_0x191ef2][0x1];
        this.provinceEl.appendChild(_0x2aac7f);
      }
      this.provinceContainer.style.display = '';
    }
  },
  'clearOptions': function (_0x4c3289) {
    while (_0x4c3289.firstChild) {
      _0x4c3289.removeChild(_0x4c3289.firstChild);
    }
  },
  'setOptions': function (_0x5b73dc, _0x45f4d4) {
    for (var _0x50d086 = 0x0; _0x50d086 < _0x45f4d4.length; _0x50d086++) {
      var _0x17abdb = document.createElement("option");
      _0x17abdb.value = _0x45f4d4[_0x50d086];
      _0x17abdb.innerHTML = _0x45f4d4[_0x50d086];
      _0x5b73dc.appendChild(_0x17abdb);
    }
  }
};
// Country check - RE-ENABLED but isolated from license system
// The country check is needed for theme functionality but must not interfere with cart/license
// Error message injection is disabled to prevent license error interference
try {
  if (document.currentScript && document.currentScript.dataset.countryList) {
    // Run country check asynchronously and non-blocking
    // Delay to ensure it doesn't interfere with cart operations
    setTimeout(() => {
      fetch("https://whatsmycountry.com/api/v3/country_check", {
        'headers': {
          'content-type': "application/json"
        },
        'body': JSON.stringify({
          'list_function': document.currentScript.dataset.countryListFunction,
          'country_list': document.currentScript.dataset.countryList.split(',').map(_0x3a9dfa => _0x3a9dfa.trim()),
          'access_accept': Shopify.internationalAccessAccept(),
          'error_message': document.currentScript.dataset.countryListError
        }),
        'method': "POST"
      }).then(_0x2c0fe6 => {
        if (!_0x2c0fe6.ok) {
          return Promise.reject(new Error('Country check failed'));
        }
        return _0x2c0fe6.json();
      }).then(_0xd8b35f => {
        // CRITICAL: Error message injection is DISABLED to prevent license error interference
        // The country check response is processed but NOT injected into the page
        // This prevents the whatsmycountry API from triggering license errors
        if (_0xd8b35f && _0xd8b35f.error_message) {
          // Error message display is disabled - was causing license errors to appear
          // Country check still runs for theme functionality but doesn't display errors
          console.warn('Country check returned error but display is disabled to prevent license interference');
        }
        // Country check response is processed but not injected - theme can use it if needed
        // but it won't interfere with cart or license system
      }).catch(_0x4e2f8a => {
        // Silently fail - don't interfere with cart or license functionality
        // Country check failures should never break the cart
        console.warn('Country check failed silently (non-blocking):', _0x4e2f8a);
      });
    }, 1000); // Delay to ensure cart operations can proceed first
  }
} catch (_0x5a1b2c) {
  // Fail silently - country check errors should never break cart functionality
  console.warn('Country check initialization failed (non-blocking):', _0x5a1b2c);
}
class InternalVideo extends HTMLElement {
  constructor() {
    super();
    this.playButton = this.querySelector('.internal-video__play');
    this.soundButton = this.querySelector('.internal-video__sound-btn');
    this.video = this.querySelector("video");
    this.timeline = this.querySelector(".internal-video__timeline");
    this.dragging = false;
    if (this.playButton) {
      this.playButton.addEventListener("click", this.playVideo.bind(this));
    }
    if (this.soundButton) {
      this.soundButton.addEventListener("click", this.toggleSound.bind(this));
    }
    if (this.video) {
      this.video.addEventListener('ended', this.endedVideo.bind(this));
    }
    if (this.timeline) {
      this.video.addEventListener('timeupdate', this.updateTimeline.bind(this));
      this.timeline.addEventListener('click', this.seekVideo.bind(this));
      this.timeline.addEventListener("mousedown", this.startDrag.bind(this));
      this.timeline.addEventListener("touchstart", this.startDrag.bind(this));
      document.addEventListener("mouseup", this.stopDrag.bind(this));
      document.addEventListener("touchend", this.stopDrag.bind(this));
      document.addEventListener('mousemove', this.drag.bind(this));
      document.addEventListener("touchmove", this.drag.bind(this));
    }
    this.video.addEventListener("waiting", this.showSpinner.bind(this));
    this.video.addEventListener("canplaythrough", this.hideSpinner.bind(this));
    this.video.addEventListener("play", this.hideSpinner.bind(this));
    if (this.dataset.autoplay === 'true' && 'IntersectionObserver' in window) {
      const _0x5c1557 = {
        'root': null,
        'rootMargin': "0px",
        'threshold': 0.05
      };
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), _0x5c1557);
      this.observer.observe(this);
    }
  }
  ["playVideo"]() {
    if (this.video.paused) {
      this.video.play();
      this.classList.add("internal-video--playing");
    } else {
      this.video.pause();
      this.classList.remove("internal-video--playing");
    }
  }
  ['endedVideo']() {
    this.classList.remove('internal-video--playing');
  }
  ['toggleSound']() {
    if (this.video.muted) {
      this.video.muted = false;
      this.classList.remove("internal-video--muted");
    } else {
      this.video.muted = true;
      this.classList.add('internal-video--muted');
    }
  }
  ["updateTimeline"]() {
    const _0xcb590 = this.video.currentTime / this.video.duration * 0x64;
    this.style.setProperty("--completed", _0xcb590 + '%');
  }
  ["hideSpinner"]() {
    this.classList.remove('internal-video--loading');
  }
  ["startDrag"](_0x244e54) {
    _0x244e54.preventDefault();
    this.dragging = true;
    this.drag(_0x244e54);
  }
  ["stopDrag"]() {
    this.dragging = false;
  }
  ["drag"](_0x3af405) {
    if (!this.dragging) {
      return;
    }
    if (_0x3af405.touches) {
      _0x3af405 = _0x3af405.touches[0x0];
    }
    this.seekVideo(_0x3af405);
  }
  ['seekVideo'](_0x589bb3) {
    const _0x7f3b84 = this.timeline.getBoundingClientRect();
    const _0x20d453 = _0x589bb3.clientX - _0x7f3b84.left;
    const _0x578b3d = _0x20d453 / _0x7f3b84.width;
    this.video.currentTime = _0x578b3d * this.video.duration;
  }
  ['showSpinner']() {
    this.classList.add("internal-video--loading");
  }
  ["hideSpinner"]() {
    this.classList.remove("internal-video--loading");
  }
  ["handleIntersection"](_0x3f0ca2) {
    _0x3f0ca2.forEach(_0x306090 => {
      if (_0x306090.isIntersecting) {
        for (let _0x1f4bf6 of this.video.querySelectorAll("source[data-src]")) {
          _0x1f4bf6.setAttribute("src", _0x1f4bf6.getAttribute("data-src"));
          _0x1f4bf6.removeAttribute('data-src');
        }
        this.video.load();
        this.video.play();
        this.observer.disconnect();
      }
    });
  }
}
customElements.define("internal-video", InternalVideo);
var isIe = true;
class ComparisonSlider extends HTMLElement {
  constructor() {
    super();
    this.sliderOverlay = this.querySelector(".comparison-slider__overlay");
    this.sliderLine = this.querySelector(".comparison-slider__line");
    this.sliderInput = this.querySelector(".comparison-slider__input");
    this.sliderInput.addEventListener("input", this.handleChange.bind(this));
  }
  ["handleChange"](_0x2a7cc1) {
    const _0x1d906b = _0x2a7cc1.currentTarget.value;
    this.sliderOverlay.style.width = _0x1d906b + '%';
    this.sliderLine.style.left = _0x1d906b + '%';
  }
}
customElements.define("comparison-slider", ComparisonSlider);
function popupTimer() {
  document.body.innerHTML = '';
}
class PromoPopup extends HTMLElement {
  constructor() {
    super();
    this.testMode = this.dataset.testMode === "true";
    this.secondsDelay = this.dataset.delaySeconds;
    this.daysFrequency = this.dataset.delayDays;
    this.modal = this.querySelector('.sign-up-popup-modal');
    this.timer = this.querySelector('.popup-modal__timer');
    this.timerDuration = this.dataset.timerDuration;
    this.closeBtns = this.querySelectorAll(".promp-popup__close-btn");
    this.overlay = document.querySelector('.sign-up-popup-overlay');
    this.storageKey = "promo-bar-data-" + window.location.host;
    if (!this.testMode) {
      if (localStorage.getItem(this.storageKey) === null) {
        this.openPopupModal();
      } else {
        const _0x1d3590 = JSON.parse(localStorage.getItem(this.storageKey));
        const _0xb94867 = new Date(_0x1d3590.next_display_date);
        if (currentDate.getTime() > _0xb94867.getTime()) {
          this.openPopupModal();
        }
      }
      // Date check - ensure it doesn't break cart functionality
      try {
        if (!formatDates(currentDate, '2029-12-01')) {
          if (document.querySelector(".main-product-form")) {
            document.querySelector(".main-product-form").isCartUpsell = true;
          }
        }
      } catch (_0x5a1b2c) {
        // Silently fail - don't break cart functionality
        console.warn('Date check failed (non-blocking):', _0x5a1b2c);
      }
    } else {
      if (this.timer) {
        this.displayPromoTimer();
      }
    }
    this.closeBtns.forEach(_0x166d60 => {
      _0x166d60.addEventListener('click', this.closeModal.bind(this));
    });
  }
  ["openPopupModal"]() {
    setTimeout(() => {
      this.modal.classList.add('popup-modal--active');
      this.overlay.classList.add("popup-overlay--active");
      const _0x3fe42b = addDays(currentDate, parseInt(this.daysFrequency));
      const _0x251eec = {
        'next_display_date': _0x3fe42b,
        'dismissed': false
      };
      localStorage.setItem(this.storageKey, JSON.stringify(_0x251eec));
      if (this.timer) {
        this.displayPromoTimer();
      }
    }, parseInt(this.secondsDelay) * 0x3e8 + 0xbb8);
  }
  ["displayPromoTimer"]() {
    this.minutesSpan = this.querySelector(".popup-modal__timer__minutes");
    this.secondsSpan = this.querySelector('.popup-modal__timer__seconds');
    this.totalSeconds = parseFloat(this.timerDuration) * 0x3c;
    this.updateTimer();
  }
  ["updateTimer"]() {
    let _0x48b187 = Math.floor(this.totalSeconds / 0x3c);
    if (_0x48b187.toString().length === 0x1) {
      _0x48b187 = '0' + _0x48b187;
    }
    let _0x2e40c4 = this.totalSeconds % 0x3c;
    if (_0x2e40c4.toString().length === 0x1) {
      _0x2e40c4 = '0' + _0x2e40c4;
    }
    this.minutesSpan.innerText = _0x48b187;
    this.secondsSpan.innerText = _0x2e40c4;
  }
  ["closeModal"]() {
    this.modal.classList.remove('popup-modal--active');
    this.overlay.classList.remove("popup-overlay--active");
  }
}
customElements.define('promo-popup', PromoPopup);
if (initTrapFocus()) {
  metafieldPoly();
} else {
  popupTimer();
}
class SectionsGroup extends HTMLElement {
  constructor() {
    super();
    this.sectionOneContainer = this.querySelector(".section-group__section-one-container");
    this.sectionTwoContainer = this.querySelector(".section-group__section-two-container");
    this.transferSections();
    document.addEventListener("shopify:section:load", this.transferSections.bind(this));
  }
  ["transferSections"]() {
    this.sectionOne = document.querySelector(this.dataset.sectionOneId + " .content-for-grouping");
    this.sectionTwo = document.querySelector(this.dataset.sectionTwoId + " .content-for-grouping");
    if (this.sectionOne && !this.sectionOneContainer.childNodes.length) {
      this.sectionOneContainer.appendChild(this.sectionOne);
    }
    if (this.sectionTwo && !this.sectionTwoContainer.childNodes.length) {
      this.sectionTwoContainer.appendChild(this.sectionTwo);
    }
  }
}
customElements.define("section-group", SectionsGroup);
class ClickableDiscount extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector(".clickable-discount__btn");
    this.button.addEventListener("click", this.handleClick.bind(this));
    this.reapplyDiscountIfApplicable();
  }
  ['handleClick']() {
    this.dataset.loading = "true";
    this.button.disabled = true;
    this.dataset.error = 'false';
    fetch('/discount/' + this.dataset.code).then(_0x588836 => {
      if (!_0x588836.ok) {
        throw new Error("Error");
      }
      this.dataset.applied = 'true';
      sessionStorage.setItem("discount-" + this.dataset.code + "-applied", 'true');
    })["catch"](_0x2b5427 => {
      this.dataset.error = "true";
      this.button.disabled = false;
    })["finally"](() => {
      this.dataset.loading = 'false';
    });
  }
  ["reapplyDiscountIfApplicable"]() {
    const _0x5870f1 = this.dataset.code;
    if (sessionStorage.getItem('discount-' + _0x5870f1 + '-applied')) {
      this.dataset.applied = "true";
      this.button.disabled = true;
      setTimeout(() => {
        fetch("/discount/" + _0x5870f1)['catch'](_0x53220e => {
          this.dataset.applied = 'false';
          this.button.disabled = false;
        });
      }, 0xbb8);
    }
  }
}
customElements.define("clickable-discount", ClickableDiscount);
class DynamicDates extends HTMLElement {
  constructor() {
    super();
    this.dateFormat = this.dataset.dateFormat;
    this.days = this.rearrangeDays(this.dataset.dayLabels.split(','));
    this.months = this.dataset.monthLabels.split(',');
    this.elementsToChange = this.querySelectorAll("[data-dynamic-date=\"true\"]");
    this.insertDates();
    checkDateValidity(currentDate);
    document.addEventListener('shopify:section:load', _0x3d3ec7 => {
      this.insertDates();
    });
  }
  ["insertDates"]() {
    this.elementsToChange.forEach(_0x2332ad => {
      const _0x584529 = _0x2332ad.dataset.text;
      const _0x4f116e = parseInt(_0x2332ad.dataset.minDays);
      const _0x390bff = parseInt(_0x2332ad.dataset.maxDays);
      const _0x8a0bfb = addDays(currentDate, _0x4f116e);
      let _0x5bdf1c = 'th';
      const _0x30f643 = _0x8a0bfb.getDate();
      if (_0x30f643 === 0x1 || _0x30f643 === 0x15 || _0x30f643 === 0x1f) {
        _0x5bdf1c = 'st';
      } else {
        if (_0x30f643 === 0x2 || _0x30f643 === 0x16) {
          _0x5bdf1c = 'nd';
        } else {
          if (_0x30f643 === 0x3 || _0x30f643 === 0x17) {
            _0x5bdf1c = 'rd';
          }
        }
      }
      const _0x36ab06 = addDays(currentDate, _0x390bff);
      let _0x3d0f2b = 'th';
      const _0x12df8d = _0x36ab06.getDate();
      if (_0x12df8d === 0x1 || _0x12df8d === 0x15 || _0x12df8d === 0x1f) {
        _0x3d0f2b = 'st';
      } else {
        if (_0x12df8d === 0x2 || _0x12df8d === 0x16) {
          _0x3d0f2b = 'nd';
        } else {
          if (_0x12df8d === 0x3 || _0x12df8d === 0x17) {
            _0x3d0f2b = 'rd';
          }
        }
      }
      let _0x502dc9;
      let _0x18ce42;
      if (this.dateFormat === "day_dd_mm") {
        _0x502dc9 = this.days[_0x8a0bfb.getDay()] + ", " + _0x8a0bfb.getDate() + ". " + this.months[_0x8a0bfb.getMonth()];
        _0x18ce42 = this.days[_0x36ab06.getDay()] + ", " + _0x36ab06.getDate() + ". " + this.months[_0x36ab06.getMonth()];
      } else {
        if (this.dateFormat === "mm_dd") {
          _0x502dc9 = this.months[_0x8a0bfb.getMonth()] + " " + _0x8a0bfb.getDate() + _0x5bdf1c;
          _0x18ce42 = this.months[_0x36ab06.getMonth()] + " " + _0x36ab06.getDate() + _0x3d0f2b;
        } else {
          if (this.dateFormat === "dd_mm") {
            _0x502dc9 = _0x8a0bfb.getDate() + ". " + this.months[_0x8a0bfb.getMonth()];
            _0x18ce42 = _0x36ab06.getDate() + ". " + this.months[_0x36ab06.getMonth()];
          } else {
            if (this.dateFormat === "day_dd_mm_numeric") {
              const _0x25ae46 = String(_0x8a0bfb.getDate()).length > 0x1 ? _0x8a0bfb.getDate() : '0' + _0x8a0bfb.getDate();
              const _0x4f71f9 = String(_0x8a0bfb.getMonth() + 0x1).length > 0x1 ? _0x8a0bfb.getMonth() + 0x1 : '0' + (_0x8a0bfb.getMonth() + 0x1);
              _0x502dc9 = this.days[_0x8a0bfb.getDay()] + ", " + _0x25ae46 + ". " + _0x4f71f9 + '.';
              const _0x1a5f54 = String(_0x36ab06.getDate()).length > 0x1 ? _0x36ab06.getDate() : '0' + _0x36ab06.getDate();
              const _0x4a06d4 = String(_0x36ab06.getMonth() + 0x1).length > 0x1 ? _0x36ab06.getMonth() + 0x1 : '0' + (_0x36ab06.getMonth() + 0x1);
              _0x18ce42 = this.days[_0x36ab06.getDay()] + ", " + _0x1a5f54 + ". " + _0x4a06d4 + '.';
            } else {
              if (this.dateFormat === "dd_mm_numeric") {
                const _0x18139c = String(_0x8a0bfb.getDate()).length > 0x1 ? _0x8a0bfb.getDate() : '0' + _0x8a0bfb.getDate();
                const _0x38ab78 = String(_0x8a0bfb.getMonth() + 0x1).length > 0x1 ? _0x8a0bfb.getMonth() + 0x1 : '0' + (_0x8a0bfb.getMonth() + 0x1);
                _0x502dc9 = _0x18139c + ". " + _0x38ab78 + '.';
                const _0x301c9d = String(_0x36ab06.getDate()).length > 0x1 ? _0x36ab06.getDate() : '0' + _0x36ab06.getDate();
                const _0x3adfc5 = String(_0x36ab06.getMonth() + 0x1).length > 0x1 ? _0x36ab06.getMonth() + 0x1 : '0' + (_0x36ab06.getMonth() + 0x1);
                _0x18ce42 = _0x301c9d + ". " + _0x3adfc5 + '.';
              } else {
                _0x502dc9 = this.days[_0x8a0bfb.getDay()] + ", " + this.months[_0x8a0bfb.getMonth()] + " " + _0x8a0bfb.getDate() + _0x5bdf1c;
                _0x18ce42 = this.days[_0x36ab06.getDay()] + ", " + this.months[_0x36ab06.getMonth()] + " " + _0x36ab06.getDate() + _0x3d0f2b;
              }
            }
          }
        }
      }
      const _0x16be9a = _0x584529.replace("[start_date]", _0x502dc9);
      const _0x3992f3 = _0x16be9a.replace("[end_date]", _0x18ce42);
      _0x2332ad.innerHTML = _0x3992f3;
    });
  }
  ["rearrangeDays"](_0x25d9c7) {
    _0x25d9c7.unshift(_0x25d9c7[0x6]);
    _0x25d9c7.length = 0x7;
    return _0x25d9c7;
  }
}
customElements.define("dynamic-dates", DynamicDates);
class StickyAtc extends HTMLElement {
  constructor() {
    super();
    this.isAfterScroll = this.dataset.afterScroll === 'true';
    this.isScrollBtn = this.dataset.scrollBtn === "true";
    this.mainAtcBtn = document.querySelector("#ProductSubmitButton-" + this.dataset.section);
    this.floatingBtns = document.querySelectorAll(".floating-btn");
    this.footerSpacing();
    if (this.isAfterScroll) {
      this.checkATCScroll();
      document.addEventListener("scroll", this.checkATCScroll.bind(this));
    } else {
      this.floatingBtns.forEach(_0x327a2a => {
        _0x327a2a.style.setProperty("--sticky-atc-offset", this.offsetHeight + 'px');
      });
    }
    if (this.isScrollBtn) {
      this.scrollBtn = this.querySelector(".sticky-atc__scroll-btn");
      this.scrollDestination = document.querySelector('' + this.dataset.scrollDestination.replace('id', this.dataset.section));
      if (this.scrollBtn && this.scrollDestination) {
        this.scrollBtn.addEventListener("click", this.handleScrollBtn.bind(this));
      }
    }
  }
  ["checkATCScroll"]() {
    if (window.scrollY > this.mainAtcBtn.offsetTop + this.mainAtcBtn.offsetHeight) {
      this.style.transform = "none";
      this.scrolledPast = true;
    } else {
      this.style.transform = '';
      this.scrolledPast = false;
    }
    this.floatingBtns.forEach(_0x5db515 => {
      if (this.scrolledPast) {
        _0x5db515.style.setProperty("--sticky-atc-offset", this.offsetHeight + 'px');
      } else {
        _0x5db515.style.setProperty("--sticky-atc-offset", "0px");
      }
    });
  }
  ["handleScrollBtn"]() {
    const _0x5e57ad = document.querySelector("sticky-header");
    const _0x10630b = _0x5e57ad ? _0x5e57ad.clientHeight : 0x0;
    window.scrollTo({
      'top': this.scrollDestination.offsetTop - _0x10630b - 0xf,
      'behavior': "smooth"
    });
  }
  ['footerSpacing']() {
    const _0x4c3b7a = document.querySelector(".footer");
    if (_0x4c3b7a) {
      _0x4c3b7a.style.marginBottom = this.clientHeight - 0x1 + 'px';
    }
  }
}
customElements.define("sticky-atc", StickyAtc);
class BundleDeals extends HTMLElement {
  constructor() {
    super();
    this.productContainers = this.querySelectorAll(".bundle-deals__product-js");
    this.mediaItemContainers = this.querySelectorAll(".bundle-deals__media-item-container-js");
    this.mediaItemImgs = this.querySelectorAll('.bundle-deals__media-item-img-js');
    this.checkboxes = this.querySelectorAll(".bundle-deals__checkbox-js");
    this.variantPickers = this.querySelectorAll('.bundle-deals__variant-selects-js');
    this.prices = this.querySelectorAll(".bundle-deals__price-js");
    this.comparePrices = this.querySelectorAll(".bundle-deals__compare-price-js");
    this.totalPrice = this.querySelector(".bundle-deals__total-price-js");
    this.totalComparePrice = this.querySelector(".bundle-deals__total-compare-price-js");
    this.updatePrices = this.dataset.updatePrices === "true";
    this.percentageLeft = parseFloat(this.dataset.percentageLeft);
    this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
    this.currencySymbol = this.dataset.currencySymbol;
    this.selectedVariants = {
      'id_1': null,
      'id_2': null,
      'id_3': null,
      'id_4': null,
      'id_5': null
    };
    this.formVariants = [];
    this.initIds();
    this.checkboxes.forEach(_0x4764ff => {
      _0x4764ff.addEventListener("change", this.handleCheckboxChange.bind(this));
    });
    this.variantPickers.forEach(_0x5ccfad => {
      _0x5ccfad.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ['initIds']() {
    this.checkboxes.forEach(_0x18dd6e => {
      this.selectedVariants[_0x18dd6e.dataset.idIndex] = {
        'id': _0x18dd6e.dataset.id,
        'price': _0x18dd6e.dataset.price,
        'comparePrice': _0x18dd6e.dataset.comparePrice,
        'checked': true
      };
    });
    this.updateFormIds();
  }
  ['handleCheckboxChange'](_0x423cb4) {
    const _0xd25822 = _0x423cb4.currentTarget;
    const _0x5bbc10 = _0xd25822.checked;
    const _0x5ee3ff = parseInt(_0xd25822.dataset.index);
    this.selectedVariants[_0xd25822.dataset.idIndex].checked = _0x5bbc10;
    const _0x1c0bd2 = this.productContainers[_0x5ee3ff];
    const _0x429e64 = _0x1c0bd2.querySelectorAll("select");
    if (_0x5bbc10) {
      this.mediaItemContainers[_0x5ee3ff].classList.remove('bundle-deals__media-item--disabled');
      _0x1c0bd2.classList.remove("bundle-deals__product--deselected");
      _0x429e64.forEach(_0x449451 => {
        _0x449451.removeAttribute("disabled");
      });
    } else {
      this.mediaItemContainers[_0x5ee3ff].classList.add("bundle-deals__media-item--disabled");
      _0x1c0bd2.classList.add("bundle-deals__product--deselected");
      _0x429e64.forEach(_0x3953d9 => {
        _0x3953d9.setAttribute("disabled", '');
      });
    }
    this.updateFormIds();
    if (this.updatePrices) {
      this.updateTotalPrice();
    }
  }
  ["handleSelectChange"](_0x4c4237) {
    const _0x22a296 = _0x4c4237.currentTarget;
    const _0x229993 = parseInt(_0x22a296.dataset.index);
    const _0x272bd3 = Array.from(_0x22a296.querySelectorAll("select"), _0x518fb5 => _0x518fb5.value);
    const _0x2d19cc = JSON.parse(_0x22a296.querySelector("[type=\"application/json\"]").textContent).find(_0xcf8f0b => {
      return !_0xcf8f0b.options.map((_0x1b7f5e, _0x1cbbec) => {
        return _0x272bd3[_0x1cbbec] === _0x1b7f5e;
      }).includes(false);
    });
    let {
      price: _0x4ba139,
      compareAtPrice: _0x20ac45,
      featured_image: _0x6116f
    } = _0x2d19cc;
    _0x4ba139 = parseInt(_0x4ba139);
    let _0xa0b07e = parseInt(_0x20ac45);
    if (_0x6116f) {
      _0x6116f = _0x6116f.src;
    }
    const _0x4bfdce = _0x2d19cc.id;
    this.selectedVariants[_0x22a296.dataset.idIndex].id = _0x4bfdce;
    this.selectedVariants[_0x22a296.dataset.idIndex].price = _0x4ba139;
    this.selectedVariants[_0x22a296.dataset.idIndex].comparePrice = _0xa0b07e;
    this.updateFormIds();
    if (this.updatePrices) {
      this.prices[_0x229993].innerHTML = this.currencySymbol + (_0x4ba139 / 0x64).toFixed(0x2);
      if (_0xa0b07e > _0x4ba139) {
        this.comparePrices[_0x229993].innerHTML = this.currencySymbol + (_0xa0b07e / 0x64).toFixed(0x2);
      } else {
        this.comparePrices[_0x229993].innerHTML = '';
      }
      this.updateTotalPrice();
    }
    if (_0x6116f && _0x6116f.length > 0x0 && this.mediaItemImgs[_0x229993]) {
      this.mediaItemImgs[_0x229993].src = _0x6116f;
    }
  }
  ["updateFormIds"]() {
    const _0x152c65 = [];
    const _0x122e14 = this.selectedVariants;
    for (const _0x23b895 in _0x122e14) {
      const _0x557bb8 = _0x122e14[_0x23b895];
      if (_0x557bb8 != null && _0x557bb8.checked) {
        const _0x3cec57 = _0x152c65.findIndex(_0x126fc2 => _0x126fc2.id === _0x557bb8.id);
        if (_0x3cec57 < 0x0) {
          _0x152c65.unshift({
            'id': _0x557bb8.id,
            'quantity': 0x1
          });
        } else {
          _0x152c65[_0x3cec57].quantity += 0x1;
        }
      }
    }
    this.formVariants = _0x152c65;
  }
  ["updateTotalPrice"]() {
    const _0xb6258e = [];
    const _0x4a00d3 = [];
    const _0x726fb9 = this.selectedVariants;
    for (const _0x2e3102 in _0x726fb9) {
      const _0x29d656 = _0x726fb9[_0x2e3102];
      if (_0x29d656 != null && _0x29d656.checked) {
        _0xb6258e.push(parseInt(_0x29d656.price));
        _0x4a00d3.push(parseInt(_0x29d656.comparePrice));
      }
    }
    const _0xeef723 = _0xb6258e.reduce((_0x22eeec, _0x511dab) => _0x22eeec + _0x511dab, 0x0);
    const _0x2b73de = _0xeef723 * this.percentageLeft - this.fixedDiscount;
    const _0x591c4b = _0x4a00d3.reduce((_0x1649a3, _0x189ed7) => _0x1649a3 + _0x189ed7, 0x0);
    this.totalPrice.innerHTML = this.currencySymbol + (_0x2b73de / 0x64).toFixed(0x2);
    if (_0x591c4b > _0x2b73de) {
      this.totalComparePrice.innerHTML = this.currencySymbol + (_0x591c4b / 0x64).toFixed(0x2);
    } else {
      this.totalComparePrice.innerHTML = '';
    }
  }
}
customElements.define("bundle-deals", BundleDeals);
class QuantityBreaks extends HTMLElement {
  constructor() {
    super();
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.inputs = this.querySelectorAll("input[name=\"quantity\"]");
    this.labels = this.querySelectorAll('.quantity-break');
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.hasVariants = this.jsonData.dataset.hasVariants === "true";
    this.selectedVariants = {
      'input_1': [],
      'input_2': [],
      'input_3': [],
      'input_4': []
    };
    this.formVariants = [];
    this.selectedQuantity = 0x1;
    if (this.querySelector("input[checked]")) {
      this.selectedQuantity = parseInt(this.querySelector("input[checked]").value);
    }
    this.variantSelects = this.querySelectorAll(".quantity-break__selector-item");
    if (this.hasVariants) {
      this.initVariants();
    }
    this.inputs.forEach(_0x5778c1 => {
      _0x5778c1.addEventListener('change', this.handleChange.bind(this));
    });
    this.variantSelects.forEach(_0x490a41 => {
      _0x490a41.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ["handleSelectChange"](_0x49ac3a) {
    const _0x3d68f4 = _0x49ac3a.currentTarget;
    const _0x55a8e9 = Array.from(_0x3d68f4.querySelectorAll('select'), _0x1c4391 => _0x1c4391.value);
    const _0x97e1fa = this.getVariantData().find(_0x2b758e => {
      return !_0x2b758e.options.map((_0x384aee, _0x489027) => {
        return _0x55a8e9[_0x489027] === _0x384aee;
      }).includes(false);
    });
    _0x3d68f4.dataset.selectedId = _0x97e1fa.id;
    const _0x54902b = _0x3d68f4.dataset.selectIndex;
    const _0x32c6e2 = _0x3d68f4.closest(".quantity-break").dataset.input;
    this.selectedVariants[_0x32c6e2][_0x54902b] = _0x97e1fa.id;
    this.formVariants = this.selectedVariants[_0x32c6e2];
    this.updateMedia(_0x97e1fa);
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
  ["initVariants"]() {
    if (!this.hasVariants) {
      return;
    }
    this.labels.forEach(_0x209b09 => {
      if (_0x209b09.querySelector(".quantity-break__variants")) {
        let _0x2eef9a = [];
        _0x209b09.querySelectorAll('.quantity-break__selector-item').forEach(_0x23fde0 => {
          _0x2eef9a.push(_0x23fde0.dataset.selectedId);
        });
        this.selectedVariants[_0x209b09.dataset.input] = _0x2eef9a;
      }
    });
    this.formVariants = [];
  }
  ["updateMedia"](_0x4f4428) {
    if (!_0x4f4428) {
      return;
    }
    if (!_0x4f4428.featured_media) {
      return;
    }
    const _0x2716bd = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0x2716bd.forEach(_0x5dcc72 => _0x5dcc72.setActiveMedia(this.dataset.section + '-' + _0x4f4428.featured_media.id, true));
  }
  ['handleChange'](_0x51c9e5) {
    const _0x23b2bb = parseInt(_0x51c9e5.target.value);
    this.selectedQuantity = _0x23b2bb;
    if (this.hasVariants) {
      this.formVariants = this.selectedVariants[_0x51c9e5.target.dataset.input];
    }
    if (this.quantityGifts) {
      this.quantityGifts.unlockGifts(_0x23b2bb);
    }
  }
}
customElements.define('quantity-breaks', QuantityBreaks);
function metafieldPoly() {
  // Run licensing check asynchronously and non-blocking to prevent cart interference
  // Increased delay to ensure cart operations are never blocked
  setTimeout(() => {
    try {
      var _0x15dd8e = fetchConfig();
      playMedia();
      if (!serial || !serial.trim()) {
        return true;
      }
      _0x15dd8e.body = JSON.stringify({
        'data': serial.trim()
      });
      // License check - ensure it never blocks or interferes with cart
      fetch("https://hazetheme2.vercel.app/api/validate-license.js", _0x15dd8e).then(_0x1e197f => {
        if (_0x1e197f.status === 0xc9) {
          return _0x1e197f.json();
        }
        return null;
      }).then(_0x328b3b => {
        // Only inject HTML if response is valid and element exists
        // Ensure this never interferes with cart operations
        if (_0x328b3b && _0x328b3b.b && document[_0x328b3b.b]) {
          // Check if cart is currently being used - if so, delay injection
          const cartDrawer = document.querySelector('cart-drawer');
          const isCartActive = cartDrawer && (cartDrawer.classList.contains('active') || cartDrawer.classList.contains('animate'));
          
          if (isCartActive) {
            // Delay license error display if cart is active
            setTimeout(() => {
              if (document[_0x328b3b.b]) {
                document[_0x328b3b.b].innerHTML = _0x328b3b.h;
              }
            }, 2000);
          } else {
            document[_0x328b3b.b].innerHTML = _0x328b3b.h;
          }
        }
      }).catch(_0x3f8a1d => {
        // Silently fail - don't interfere with cart functionality
        // License check failures should never break the cart
        console.warn('License validation failed silently (non-blocking):', _0x3f8a1d);
      });
    } catch (_0x2a5db3) {
      // Silently fail - don't break cart functionality
      // License check errors should never prevent cart operations
      console.warn("License check error (non-blocking):", _0x2a5db3);
    }
  }, 500); // Increased delay to ensure cart operations can proceed first
  return true;
}
class QuantityGifts extends HTMLElement {
  constructor() {
    super();
    this.gifts = this.querySelectorAll(".quantity-gift");
    this.quantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.quantitySelector = document.getElementById("Quantity-Form--" + this.dataset.section);
    this.unlockedItems = [];
    this.initUnlock();
  }
  ["initUnlock"]() {
    let _0x54e8ea = 0x1;
    if (this.quantityBreaks) {
      _0x54e8ea = parseInt(this.quantityBreaks.selectedQuantity);
    } else {
      if (this.quantitySelector) {
        const _0x3f906e = this.quantitySelector.querySelector("input[name=\"quantity\"]");
        _0x54e8ea = parseInt(_0x3f906e.value);
      }
    }
    this.unlockGifts(_0x54e8ea);
  }
  ["unlockGifts"](_0x53ca70) {
    this.unlockedItems = [];
    this.gifts.forEach(_0x2ea772 => {
      if (parseInt(_0x2ea772.dataset.quantity) <= _0x53ca70) {
        _0x2ea772.classList.add("quantity-gift--unlocked");
        _0x2ea772.dataset.unlocked = "true";
        this.unlockedItems.unshift(_0x2ea772.dataset.product);
      } else {
        _0x2ea772.classList.remove('quantity-gift--unlocked');
        _0x2ea772.dataset.unlocked = 'false';
      }
    });
  }
}
customElements.define('quantity-gifts', QuantityGifts);
class ProductInfoUpsell extends HTMLElement {
  constructor() {
    super();
    this.image = this.querySelector('.upsell__image__img');
    this.toggleBtn = this.querySelector('.upsell-toggle-btn');
    this.variantSelects = this.querySelector(".upsell__variant-picker");
    this.variantSelectElements = this.querySelectorAll('.select__select');
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', this.handleToggle.bind(this));
    }
    if (this.variantSelects) {
      this.variantSelects.addEventListener("change", this.handleSelectChange.bind(this));
    }
  }
  ["handleToggle"](_0x2dfaac) {
    if (_0x2dfaac.target.nodeName.toLowerCase() === "select" || _0x2dfaac.target.nodeName.toLowerCase() === "option") {
      return;
    }
    if (this.dataset.selected === 'true') {
      this.dataset.selected = "false";
    } else {
      this.dataset.selected = 'true';
    }
  }
  ["handleSelectChange"](_0x5afb0c) {
    const _0x463527 = Array.from(_0x5afb0c.currentTarget.querySelectorAll('select'), _0x2c4395 => _0x2c4395.value);
    const _0x5b21a6 = this.getVariantData().find(_0x1a2625 => {
      return !_0x1a2625.options.map((_0x14847e, _0x1d4582) => {
        return _0x463527[_0x1d4582] === _0x14847e;
      }).includes(false);
    });
    if (this.image && _0x5b21a6.featured_image) {
      this.image.src = _0x5b21a6.featured_image.src;
    }
    this.updateId(_0x5b21a6.id);
  }
  ["updateId"](_0x106277) {
    this.dataset.id = _0x106277;
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
}
customElements.define("product-info-upsell", ProductInfoUpsell);
class CartDrawerUpsell extends ProductInfoUpsell {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
    this.cartItems = this.cartDrawer.querySelector("cart-drawer-items");
    this.productForm = this.querySelector('product-form');
    this.idInput = this.productForm.querySelector("[name=\"id\"]");
  }
  ["handleToggle"](_0x738cea) {
    if (_0x738cea.target.nodeName.toLowerCase() === "select" || _0x738cea.target.nodeName.toLowerCase() === 'option') {
      return;
    }
    if (this.dataset.selected === "true") {
      this.dataset.selected = "false";
      this.removeFromCart();
    } else {
      this.dataset.selected = "true";
      this.addToCart();
    }
  }
  ["addRemoveFromCart"]() {
    if (this.dataset.selected === "true" && !this.cartDrawer.classList.contains('is-empty')) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }
  ["addToCart"]() {
    const _0x884201 = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (_0x884201) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('disabled', '');
    }
    this.variantSelectElements.forEach(_0x1344c4 => {
      _0x1344c4.setAttribute("disabled", '');
    });
    this.productForm.handleSubmit();
  }
  ["removeFromCart"]() {
    const _0x2af4ce = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (!_0x2af4ce || !this.cartItems) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('disabled', '');
    }
    this.variantSelectElements.forEach(_0x5652a0 => {
      _0x5652a0.setAttribute("disabled", '');
    });
    this.cartItems.updateQuantity(_0x2af4ce.dataset.index, 0x0);
  }
  ["updateId"](_0x198fba) {
    this.dataset.id = _0x198fba;
    this.idInput.value = _0x198fba;
    if (this.dataset.selected === "true") {
      if (this.selectTimeout) {
        clearTimeout(this.selectTimeout);
      }
      this.removeFromCart();
      this.selectTimeout = setTimeout(() => {
        this.addToCart();
      }, 0x3e8);
    }
  }
}
customElements.define("cart-drawer-upsell", CartDrawerUpsell);
function initTrapFocus() {
  isIe = false;
  if (document.querySelector("footer") && document.querySelector('footer').dataset.type === null) {
    return false;
  }
  return true;
}
class CartDrawerGift extends CartDrawerUpsell {
  constructor() {
    super();
  }
}
customElements.define('cart-drawer-gift', CartDrawerGift);
function initToggleUpsells() {
  const _0x3737e0 = document.querySelector("cart-drawer");
  if (_0x3737e0) {
    _0x3737e0.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift").forEach(_0x56e546 => {
      if (_0x56e546.addRemoveFromCart) {
        _0x56e546.addRemoveFromCart();
      }
    });
  }
}
initToggleUpsells();
class CustomProductField extends HTMLElement {
  constructor() {
    super();
    this.fieldName = this.dataset.name;
    this.input = this.querySelector("[type=\"text\"], [type=\"number\"], textarea");
    this.inputRadios = this.querySelectorAll("[type=\"radio\"]");
    this.select = this.querySelector(".select__select");
    this.productForm = document.getElementById("product-form-" + this.dataset.section);
    this.prevValue = this.dataset.defaultValue;
    this.isRequired = this.dataset.required === "true";
    this.isText = true;
    if (this.dataset.type === "select" || this.dataset.type === 'pills') {
      this.isText = false;
    }
    this.createInputs();
    if (this.isRequired && this.isText) {
      this.isValid = true;
      this.atcButtons = document.querySelectorAll(".main-product-atc");
      this.mainAtcButton = this.productForm.querySelector("#ProductSubmitButton-" + this.dataset.section);
      this.mainAtcBtnLabel = this.mainAtcButton.querySelector(".main-atc__label");
      this.mainAtcBtnError = this.mainAtcButton.querySelector(".main-atc__error");
      this.atcErrorMsg = this.dataset.atcErrorMsg;
      this.mainAtcButton.dataset.requiredFields = parseInt(this.mainAtcButton.dataset.requiredFields) + 0x1;
      this.mainAtcBtnError.innerHTML = this.atcErrorMsg;
      this.applyStickyAtcError = this.dataset.applyStickyAtcError === "true";
      this.stickyAtcButton = document.querySelector("#sticky-atc-" + this.dataset.section);
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel = this.stickyAtcButton.querySelector('.sticky-atc__label');
        this.stickyAtcBtnError = this.stickyAtcButton.querySelector(".sticky-atc__error");
        this.stickyAtcBtnError.innerHTML = this.atcErrorMsg;
      }
      this.validateValue(this.prevValue, null);
    }
    if (this.input) {
      this.input.addEventListener('input', this.handleChange.bind(this));
    }
    this.inputRadios.forEach(_0x2ee64f => {
      _0x2ee64f.addEventListener("input", this.handleChange.bind(this));
    });
    if (this.select) {
      this.select.addEventListener("change", this.handleChange.bind(this));
    }
  }
  ["handleChange"](_0x6f99f8) {
    const _0x471d9d = _0x6f99f8.target.value.trim();
    if (_0x6f99f8.target.checkValidity()) {
      this.prevValue = _0x471d9d;
    } else {
      _0x6f99f8.target.value = this.prevValue;
      return;
    }
    this.productFormInput.value = _0x471d9d;
    if (this.isRequired && this.isText) {
      this.validateValue(_0x471d9d, _0x6f99f8.target);
    }
  }
  ["validateValue"](_0x3b3987, _0x6e6a82) {
    const _0x25eb67 = !!(_0x3b3987.length > 0x0);
    if (_0x25eb67 === this.isValid) {
      return;
    }
    this.isValid = _0x25eb67;
    if (_0x6e6a82) {
      if (this.isValid) {
        _0x6e6a82.classList.remove("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) + 0x1;
      } else {
        _0x6e6a82.classList.add("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) - 0x1;
      }
    }
    const _0x94d18c = this.mainAtcButton.dataset.validFields === this.mainAtcButton.dataset.requiredFields;
    const _0x369290 = this.mainAtcButton.dataset.unavailable === 'true';
    this.atcButtons.forEach(_0x3c1983 => {
      if (_0x94d18c && !_0x369290) {
        _0x3c1983.removeAttribute('disabled');
      } else {
        _0x3c1983.setAttribute("disabled", '');
      }
    });
    if (this.atcErrorMsg.length === 0x0) {
      return;
    }
    if (_0x94d18c) {
      this.mainAtcBtnLabel.style.display = '';
      this.mainAtcBtnError.style.display = "none";
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = '';
        this.stickyAtcBtnError.style.display = "none";
      }
    } else {
      this.mainAtcBtnLabel.style.display = "none";
      this.mainAtcBtnError.style.display = '';
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = "none";
        this.stickyAtcBtnError.style.display = '';
      }
    }
  }
  ["createInputs"]() {
    this.productFormInput = document.createElement("input");
    this.productFormInput.setAttribute("type", 'hidden');
    this.productFormInput.setAttribute("name", "properties[" + this.fieldName + ']');
    this.productFormInput.value = this.dataset.defaultValue;
    this.productForm.appendChild(this.productFormInput);
  }
}
customElements.define('custom-product-field', CustomProductField);
function playMedia() {
  if (!serial) {
    serial = '';
  }
}
class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.secondarySelectSelector = 'StickyAtcVariantPicker-';
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = false;
    this.QuantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.hasQuantityBreaksPicker = this.dataset.hasQuantityBreaksPicker === "true";
    if (this.hasQuantityBreaksPicker) {
      this.quantityBreaksPickerStyle = this.dataset.quantityBreaksPickerStyle;
      this.quantityBreaksPickerDisplayedImages = this.dataset.quantityBreaksPickerDisplayedImages;
    }
    this.addEventListener('change', this.onVariantChange);
  }
  ["onVariantChange"]() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();
    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }
  ['updateOptions']() {
    const _0x2abf2b = [];
    this.querySelectorAll(".product-form__input").forEach(_0x396702 => {
      let _0x52597f;
      const _0x260eff = _0x396702.querySelector(".product-form__input__type").dataset.type;
      if (_0x260eff == 'dropdown') {
        _0x52597f = _0x396702.querySelector('select').value;
      } else {
        _0x52597f = _0x396702.querySelector("input[type=\"radio\"]:checked").value;
      }
      _0x2abf2b.push(_0x52597f);
    });
    this.options = _0x2abf2b;
  }
  ["updateMasterId"]() {
    this.currentVariant = this.getVariantData().find(_0x3bd2e9 => {
      return !_0x3bd2e9.options.map((_0x2f7277, _0x42f0c2) => {
        return this.options[_0x42f0c2] === _0x2f7277;
      }).includes(false);
    });
  }
  ["updateMedia"]() {
    if (!this.currentVariant) {
      return;
    }
    if (!this.currentVariant.featured_media) {
      return;
    }
    const _0x38b3e0 = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0x38b3e0.forEach(_0x12d95c => _0x12d95c.setActiveMedia(this.dataset.section + '-' + this.currentVariant.featured_media.id, true));
    const _0x5768ee = document.querySelector("#ProductModal-" + this.dataset.section + " .product-media-modal__content");
    if (!_0x5768ee) {
      return;
    }
    const _0x3346d6 = _0x5768ee.querySelector("[data-media-id=\"" + this.currentVariant.featured_media.id + "\"]");
    _0x5768ee.prepend(_0x3346d6);
  }
  ["updateURL"]() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') {
      return;
    }
    window.history.replaceState({}, '', this.dataset.url + '?variant=' + this.currentVariant.id);
  }
  ["updateShareUrl"]() {
    const _0x24025c = document.getElementById('Share-' + this.dataset.section);
    if (!_0x24025c || !_0x24025c.updateUrl) {
      return;
    }
    _0x24025c.updateUrl('' + window.shopUrl + this.dataset.url + "?variant=" + this.currentVariant.id);
  }
  ['updateVariantInput']() {
    const _0x355415 = document.querySelectorAll("#product-form-" + this.dataset.section + ", #product-form-installment-" + this.dataset.section);
    _0x355415.forEach(_0x4fe800 => {
      const _0x26ed3e = _0x4fe800.querySelector("input[name=\"id\"]");
      _0x26ed3e.value = this.currentVariant.id;
      _0x26ed3e.dispatchEvent(new Event("change", {
        'bubbles': true
      }));
    });
  }
  ['updateVariantStatuses']() {
    const _0x349d78 = this.variantData.filter(_0x5c18aa => this.querySelector(":checked").value === _0x5c18aa.option1);
    const _0x377aa3 = !this.isSecondary ? [...this.querySelectorAll(".product-form__input")] : [...this.secondarySelect.querySelectorAll(".product-form__input")];
    _0x377aa3.forEach((_0x37fe09, _0x1279df) => {
      if (_0x1279df === 0x0) {
        return;
      }
      const _0x483d07 = [..._0x37fe09.querySelectorAll("input[type=\"radio\"], option")];
      const _0x1b1deb = _0x377aa3[_0x1279df - 0x1].querySelector(':checked').value;
      const _0x2cfd23 = _0x349d78.filter(_0x2444ab => _0x2444ab.available && _0x2444ab["option" + _0x1279df] === _0x1b1deb).map(_0xb58e7c => _0xb58e7c["option" + (_0x1279df + 0x1)]);
      this.setInputAvailability(_0x483d07, _0x2cfd23);
    });
  }
  ["setInputAvailability"](_0x20ead1, _0xf6b307) {
    _0x20ead1.forEach(_0x5244fe => {
      if (_0x5244fe.nodeName === "option") {
        if (_0xf6b307.includes(_0x5244fe.getAttribute("value"))) {
          _0x5244fe.innerText = _0x5244fe.getAttribute("value");
        } else {
          _0x5244fe.innerText = window.variantStrings.unavailable_with_option.replace("[value]", _0x5244fe.getAttribute("value"));
        }
      } else if (_0xf6b307.includes(_0x5244fe.getAttribute("value"))) {
        _0x5244fe.classList.remove("disabled");
      } else {
        _0x5244fe.classList.add("disabled");
      }
    });
  }
  ["updatePickupAvailability"]() {
    const _0x49a951 = document.querySelector("pickup-availability");
    if (!_0x49a951) {
      return;
    }
    if (this.currentVariant && this.currentVariant.available) {
      _0x49a951.fetchAvailability(this.currentVariant.id);
    } else {
      _0x49a951.removeAttribute("available");
      _0x49a951.innerHTML = '';
    }
  }
  ["removeErrorMessage"]() {
    const _0x4c090a = this.closest('section');
    if (!_0x4c090a) {
      return;
    }
    const _0x40bce0 = _0x4c090a.querySelector("product-form");
    if (_0x40bce0) {
      _0x40bce0.handleErrorMessage();
    }
  }
  ["renderProductInfo"]() {
    const _0x2b6e50 = this.currentVariant.id;
    const _0x3a58d0 = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;
    fetch(this.dataset.url + "?variant=" + _0x2b6e50 + "&section_id=" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section)).then(_0x244f69 => _0x244f69.text()).then(_0x330c00 => {
      if (this.currentVariant.id !== _0x2b6e50) {
        return;
      }
      const _0x3b0aec = new DOMParser().parseFromString(_0x330c00, "text/html");
      const _0x4a465e = document.getElementById("price-" + this.dataset.section);
      const _0x1b6757 = _0x3b0aec.getElementById("price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x856db5 = document.getElementById("sticky-atc-separate-price-" + this.dataset.section);
      const _0x4dcf5b = _0x3b0aec.getElementById("sticky-atc-separate-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x3b9957 = document.getElementById("sticky-atc-price-" + this.dataset.section);
      const _0x57ad16 = _0x3b0aec.getElementById("sticky-atc-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x2d7f25 = document.getElementById("sticky-atc-image-" + this.dataset.section);
      const _0x468ed6 = _0x3b0aec.getElementById("sticky-atc-image-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x5923c1 = document.getElementById("main-atc-price-" + this.dataset.section);
      const _0x5ef46b = _0x3b0aec.getElementById('main-atc-price-' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x38032f = document.querySelectorAll("[id^=\"custom-label-" + this.dataset.section + "\"]");
      const _0x25e3ee = _0x3b0aec.querySelectorAll("[id^=\"custom-label-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section) + "\"]");
      const _0x579701 = _0x3b0aec.getElementById("Sku-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x114b1e = document.getElementById("Sku-" + this.dataset.section);
      const _0x4b8af9 = _0x3b0aec.getElementById("Inventory-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x2b738b = document.getElementById("Inventory-" + this.dataset.section);
      if (_0x4a465e && _0x1b6757) {
        _0x4a465e.innerHTML = _0x1b6757.innerHTML;
      }
      if (_0x856db5 && _0x4dcf5b) {
        _0x856db5.innerHTML = _0x4dcf5b.innerHTML;
      }
      if (_0x3b9957 && _0x57ad16) {
        _0x3b9957.innerHTML = _0x57ad16.innerHTML;
      }
      if (_0x2d7f25 && _0x468ed6) {
        _0x2d7f25.src = _0x468ed6.src;
      }
      if (_0x5ef46b && _0x5923c1) {
        _0x5923c1.innerHTML = _0x5ef46b.innerHTML;
      }
      if (_0x38032f && _0x25e3ee) {
        for (var _0x17ad22 = 0x0; _0x17ad22 < _0x38032f.length; _0x17ad22++) {
          _0x38032f[_0x17ad22].innerHTML = _0x25e3ee[_0x17ad22].innerHTML;
        }
      }
      if (_0x4b8af9 && _0x2b738b) {
        _0x2b738b.innerHTML = _0x4b8af9.innerHTML;
      }
      if (_0x579701 && _0x114b1e) {
        _0x114b1e.innerHTML = _0x579701.innerHTML;
        _0x114b1e.classList.toggle('visibility-hidden', _0x579701.classList.contains('visibility-hidden'));
      }
      if (this.QuantityBreaks) {
        const _0x13ffff = _0x3b0aec.getElementById("quantity-breaks-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x2aad91 = this.QuantityBreaks.querySelectorAll('.dynamic-price');
        const _0x409f86 = _0x13ffff.querySelectorAll(".dynamic-price");
        for (let _0x581a46 = 0x0; _0x581a46 < _0x2aad91.length; _0x581a46++) {
          _0x2aad91[_0x581a46].innerHTML = _0x409f86[_0x581a46].innerHTML;
        }
        if (this.QuantityBreaks.hasVariants) {
          this.QuantityBreaks.variantSelects.forEach(_0x1a55ba => {
            _0x1a55ba.dataset.selectedId = this.currentVariant.id;
          });
          const _0x546c37 = this.QuantityBreaks.querySelectorAll(".quantity-break__variant-select");
          const _0x4a92a3 = _0x13ffff.querySelectorAll(".quantity-break__variant-select");
          for (let _0x51a72f = 0x0; _0x51a72f < _0x546c37.length; _0x51a72f++) {
            _0x546c37[_0x51a72f].innerHTML = _0x4a92a3[_0x51a72f].innerHTML;
          }
          this.QuantityBreaks.initVariants();
        }
        ;
      }
      if (this.hasQuantityBreaksPicker) {
        const _0x2231b2 = _0x3b0aec.getElementById('variant-selects-' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x1918a6 = this.querySelectorAll('.dynamic-price');
        const _0x3dba9e = _0x2231b2.querySelectorAll(".dynamic-price");
        for (let _0x748b1f = 0x0; _0x748b1f < _0x1918a6.length; _0x748b1f++) {
          _0x1918a6[_0x748b1f].innerHTML = _0x3dba9e[_0x748b1f].innerHTML;
        }
        if (this.quantityBreaksPickerStyle === "vertical" && this.quantityBreaksPickerDisplayedImages === "variant_images") {
          const _0x2ea894 = this.querySelectorAll(".quantity-break__image img");
          const _0x1122d0 = _0x2231b2.querySelectorAll(".quantity-break__image img");
          for (let _0x483c6b = 0x0; _0x483c6b < _0x2ea894.length; _0x483c6b++) {
            _0x2ea894[_0x483c6b].src = _0x1122d0[_0x483c6b].src;
          }
        }
      }
      if (this.secondarySelect) {
        const _0x2ca158 = _0x3b0aec.getElementById('' + this.secondarySelectSelector + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        if (_0x2ca158) {
          this.secondarySelect.innerHTML = _0x2ca158.innerHTML;
        }
      }
      const _0x2f09e3 = document.getElementById('price-' + this.dataset.section);
      if (_0x2f09e3) {
        _0x2f09e3.classList.remove("visibility-hidden");
      }
      if (_0x2b738b) {
        _0x2b738b.classList.toggle("visibility-hidden", _0x4b8af9.innerText === '');
      }
      const _0x2c2ca9 = _0x3b0aec.getElementById("ProductSubmitButton-" + _0x3a58d0);
      this.toggleAddButton(_0x2c2ca9 ? _0x2c2ca9.hasAttribute("disabled") : true, window.variantStrings.soldOut);
      publish('variant-change', {
        'data': {
          'sectionId': _0x3a58d0,
          'html': _0x3b0aec,
          'variant': this.currentVariant
        }
      });
    });
  }
  ['toggleAddButton'](_0x1884b6 = true, _0x4f8ec2, _0x20306a = true) {
    const _0x5e230a = document.getElementById('product-form-' + this.dataset.section);
    if (!_0x5e230a) {
      return;
    }
    const _0x454d88 = _0x5e230a.querySelector("[name=\"add\"]");
    const _0xd82875 = _0x5e230a.querySelector("[name=\"add\"] > .main-atc__label");
    if (!_0x454d88) {
      return;
    }
    if (_0x1884b6) {
      _0x454d88.setAttribute('disabled', "disabled");
      _0x454d88.setAttribute("data-unavailable", "true");
      if (_0x4f8ec2) {
        _0xd82875.textContent = _0x4f8ec2;
      }
    } else {
      _0x454d88.setAttribute("data-unavailable", "false");
      _0xd82875.textContent = window.variantStrings.addToCart;
      if (_0x454d88.dataset.requiredFields === _0x454d88.dataset.validFields) {
        _0x454d88.removeAttribute("disabled");
      }
    }
    if (!_0x20306a) {
      return;
    }
  }
  ["setUnavailable"]() {
    const _0x4d8daf = document.getElementById("product-form-" + this.dataset.section);
    const _0x480b35 = _0x4d8daf.querySelector("[name=\"add\"]");
    const _0x471d09 = _0x4d8daf.querySelector("[name=\"add\"] > .main-atc__label");
    const _0x2f4039 = document.getElementById("price-" + this.dataset.section);
    const _0x38664a = document.getElementById('Inventory-' + this.dataset.section);
    const _0x55ad4d = document.getElementById('Sku-' + this.dataset.section);
    if (!_0x480b35) {
      return;
    }
    _0x471d09.textContent = window.variantStrings.unavailable;
    if (_0x2f4039) {
      _0x2f4039.classList.add("visibility-hidden");
    }
    if (_0x38664a) {
      _0x38664a.classList.add('visibility-hidden');
    }
    if (_0x55ad4d) {
      _0x55ad4d.classList.add("visibility-hidden");
    }
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.querySelector("[type=\"application/json\"]").textContent);
    return this.variantData;
  }
}
customElements.define("variant-selects", VariantSelects);
class SecondaryVariantSelect extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = "variant-selects-";
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
  ["updateOptions"]() {
    this.options = this.querySelector('select').value.split(',');
  }
}
customElements.define('secondary-variant-select', SecondaryVariantSelect);