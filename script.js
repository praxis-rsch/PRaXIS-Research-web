const data = window.PRX_SITE_DATA;
const sheetsConfig = window.PRX_SHEETS_CONFIG || {};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
};

const fillText = (selector, text) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    element.textContent = text;
  });
};

const renderList = (selector, items, renderItem) => {
  const roots = document.querySelectorAll(selector);

  if (!roots.length) {
    return;
  }

  roots.forEach((root) => {
    const limit = Number(root.dataset.limit || items.length);
    root.replaceChildren(...items.slice(0, limit).map(renderItem));
  });
};

const renderContent = () => {
  fillText("[data-brand-name]", data.companyName);
  fillText("[data-hero-kicker]", data.hero.kicker);
  fillText("[data-hero-title]", data.hero.title);
  fillText("[data-hero-lead]", data.hero.lead);
  fillText("[data-company-title]", data.company.title);
  fillText("[data-company-body]", data.company.body);
  fillText("[data-footer-description]", data.footer);
  fillText("[data-year]", new Date().getFullYear().toString());

  renderList("[data-metrics]", data.metrics, (metric) => {
    const item = createElement("div", "metric");
    const value = createElement("strong", "", metric.value);

    if (metric.unit) {
      value.append(createElement("small", "", metric.unit));
    }

    item.append(value);
    item.append(createElement("span", "", metric.label));

    if (metric.body) {
      item.append(createElement("p", "", metric.body));
    }

    if (metric.points?.length) {
      const points = createElement("ul", "metric-list");

      metric.points.forEach((point) => {
        points.append(createElement("li", "", point));
      });

      item.append(points);
    }

    return item;
  });

  renderList("[data-markets]", data.markets, (market) => createElement("li", "", market));

  renderList("[data-principles]", data.principles, (principle) => {
    const card = createElement("article", "principle-card");
    card.append(createElement("span", "index-pill", principle.index));
    card.append(createElement("h3", "", principle.title));
    card.append(createElement("p", "", principle.body));
    return card;
  });

  renderList("[data-technology-map]", data.technologyMap, (tech) => {
    const card = createElement("article", "tech-card");
    card.append(createElement("span", "step", tech.step));
    card.append(createElement("h3", "", tech.title));
    card.append(createElement("p", "", tech.body));
    return card;
  });

  renderList("[data-products]", data.products, (product) => {
    const card = createElement("article", "product-card");
    const statusList = createElement("ul", "status-list");

    product.status.forEach((status) => {
      statusList.append(createElement("li", "", status));
    });

    card.append(createElement("p", "eyebrow", product.eyebrow));
    card.append(createElement("h3", "", product.title));
    card.append(createElement("p", "", product.body));
    card.append(statusList);
    return card;
  });

  renderList("[data-usecases]", data.usecases, (usecase) => {
    const card = createElement("article", "usecase-card");
    if (usecase.visual) {
      card.classList.add(`technology-card-bg-${usecase.visual}`);
    }
    card.append(createElement("h3", "", usecase.title));
    card.append(createElement("p", "", usecase.body));
    return card;
  });

  renderList("[data-events]", data.events, (event) => {
    const card = createElement("article", "event-card");
    const time = createElement("time", "", event.date);
    const body = createElement("div", "event-body");
    const meta = createElement("div", "event-meta");
    const tagClass = event.type ? `event-tag event-tag-${event.type}` : "event-tag";

    meta.append(time);
    meta.append(createElement("span", tagClass, event.tag || "Event"));
    body.append(createElement("h3", "", event.title));
    body.append(createElement("p", "", event.body));
    card.append(meta);
    card.append(body);
    return card;
  });

  renderList("[data-roadmap]", data.roadmap, (item) => {
    const row = createElement("li");
    if (item.visual) {
      row.classList.add(`technology-card-bg-${item.visual}`);
    }
    row.append(createElement("span", "phase", item.phase));

    const body = createElement("div");
    body.append(createElement("h3", "", item.title));
    body.append(createElement("p", "", item.body));
    row.append(body);

    return row;
  });

  renderList("[data-faq]", data.faq, (item, index) => {
    const article = createElement("article", "accordion-item");
    const button = createElement("button");
    const panel = createElement("div", "accordion-panel");
    const isOpen = index === 0;

    button.type = "button";
    button.setAttribute("aria-expanded", String(isOpen));
    button.append(document.createTextNode(item.question));
    button.append(createElement("span", "accordion-icon"));

    if (!isOpen) {
      panel.hidden = true;
    }

    panel.append(createElement("p", "", item.answer));
    article.append(button);
    article.append(panel);
    return article;
  });

  renderList("[data-contact-points]", data.contact.points, (point) =>
    createElement("li", "", point)
  );
};

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  header.classList.remove("menu-active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "메뉴 열기");
};

const bindInteractions = () => {
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const currentPage = document.body.dataset.page;
  const activeNavItem = document.querySelector(`[data-nav-page="${currentPage}"]`);

  if (activeNavItem) {
    activeNavItem.setAttribute("aria-current", "page");
  }

  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    document.body.classList.toggle("menu-open", willOpen);
    header.classList.toggle("menu-active", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });

  const faqRoot = document.querySelector("[data-faq]");

  if (faqRoot) {
    faqRoot.addEventListener("click", (event) => {
      const button = event.target.closest("button");

      if (!button) {
        return;
      }

      const item = button.closest(".accordion-item");
      const panel = item.querySelector(".accordion-panel");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;
    });
  }

  if (form) {
    form.addEventListener("submit", submitContactForm);
  }
};

const renderTypingText = (target, text) => {
  const parts = text.split("\n");

  target.replaceChildren();

  parts.forEach((part, index) => {
    if (index > 0) {
      target.append(document.createElement("br"));
    }

    target.append(document.createTextNode(part));
  });
};

const initTypingTitle = () => {
  const title = document.querySelector("[data-typing-text]");

  if (!title) {
    return;
  }

  const target = title.querySelector("[data-typing-target]");
  const mobileTitleQuery = window.matchMedia("(max-width: 720px)");
  const getFullText = () =>
    mobileTitleQuery.matches && title.dataset.typingTextMobile
      ? title.dataset.typingTextMobile
      : title.dataset.typingText;
  let fullText = getFullText();

  if (!target || !fullText) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    renderTypingText(target, fullText);
    title.classList.add("is-typing-complete");
    return;
  }

  let index = 0;
  target.textContent = "";

  const typeNext = () => {
    index += 1;
    renderTypingText(target, fullText.slice(0, index));

    if (index < fullText.length) {
      window.setTimeout(typeNext, fullText[index - 1] === "\n" ? 180 : 42);
      return;
    }

    title.classList.add("is-typing-complete");
  };

  window.setTimeout(typeNext, 360);

  mobileTitleQuery.addEventListener("change", () => {
    if (!title.classList.contains("is-typing-complete")) {
      return;
    }

    fullText = getFullText();
    renderTypingText(target, fullText);
  });
};

const initScrollReveals = () => {
  const selectors = [
    ".hero-copy",
    ".metric",
    ".page-hero-grid > *",
    ".company-hero-copy",
    ".company-hero-panel article",
    ".section-heading",
    ".home-tech-card",
    ".home-path-copy",
    ".home-path-actions",
    ".technology-solution",
    ".usecase-card",
    ".technology-roadmap li",
    ".technology-collab-layout > *",
    ".company-two-axis article",
    ".company-scope-grid article",
    ".company-method-list li",
    ".company-cta-layout > *",
    ".event-card",
    ".contact-intro",
    ".contact-form",
  ];

  const elements = Array.from(
    new Set(document.querySelectorAll(selectors.join(",")))
  );

  if (!elements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14,
    }
  );

  const revealElement = (element) => {
    element.classList.add("is-visible");
  };

  elements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${(index % 5) * 70}ms`);

    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.92) {
      revealElement(element);
      return;
    }

    observer.observe(element);
  });
};

const appendHiddenField = (formElement, name, value) => {
  if (!name) {
    return;
  }

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value || "";
  formElement.append(input);
};

const submitGoogleForm = (payload) =>
  new Promise((resolve) => {
    const config = sheetsConfig.googleForm;
    const iframeName = `google-form-target-${Date.now()}`;
    const iframe = document.createElement("iframe");
    const postForm = document.createElement("form");
    let submitted = false;
    let resolved = false;

    const finish = () => {
      if (!submitted || resolved) {
        return;
      }

      resolved = true;
      window.setTimeout(() => {
        iframe.remove();
        postForm.remove();
      }, 300);
      resolve();
    };

    iframe.name = iframeName;
    iframe.hidden = true;
    iframe.addEventListener("load", finish);

    postForm.hidden = true;
    postForm.method = "POST";
    postForm.action = config.endpoint;
    postForm.target = iframeName;

    appendHiddenField(postForm, config.fields.name, payload.name);
    appendHiddenField(postForm, config.fields.email, payload.email);
    appendHiddenField(postForm, config.fields.organization, payload.organization);

    if (payload.type === "기타") {
      appendHiddenField(postForm, config.fields.type, "__other_option__");
      appendHiddenField(postForm, config.fields.typeOther, "기타");
    } else {
      appendHiddenField(postForm, config.fields.type, payload.type);
    }

    appendHiddenField(postForm, config.fields.message, payload.message);
    appendHiddenField(postForm, "fvv", "1");
    appendHiddenField(postForm, "pageHistory", "0");
    appendHiddenField(postForm, "submissionTimestamp", "-1");

    if (config.fbzx) {
      appendHiddenField(postForm, "fbzx", config.fbzx);
      appendHiddenField(postForm, "partialResponse", `[null,null,"${config.fbzx}"]`);
    }

    document.body.append(iframe, postForm);
    submitted = true;
    postForm.submit();
    window.setTimeout(finish, 2200);
  });

const submitContactForm = async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    formStatus.textContent = "필수 항목을 확인해 주세요.";
    return;
  }

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const submitButton = form.querySelector('button[type="submit"]');
  payload.page = window.location.href;

  if (sheetsConfig.googleForm?.endpoint) {
    formStatus.textContent = "전송 중입니다...";
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      await submitGoogleForm(payload);
      formStatus.textContent = "문의가 접수되었습니다. 빠르게 연락드리겠습니다.";
      form.reset();
    } catch (error) {
      formStatus.textContent =
        "전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }

    return;
  }

  if (!sheetsConfig.endpoint) {
    if (sheetsConfig.formUrl) {
      formStatus.textContent =
        sheetsConfig.demoMessage || "문의 설문지가 새 창으로 열립니다.";
      window.open(sheetsConfig.formUrl, "_blank", "noopener,noreferrer");
      return;
    }

    formStatus.textContent =
      sheetsConfig.demoMessage ||
      "현재는 데모 모드입니다. 구글 스프레드시트 URL을 설정해 주세요.";
    form.reset();
    return;
  }

  formStatus.textContent = "전송 중입니다...";

  try {
    await fetch(sheetsConfig.endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    formStatus.textContent = "문의가 접수되었습니다. 빠르게 연락드리겠습니다.";
    form.reset();
  } catch (error) {
    formStatus.textContent =
      "전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.";
  }
};

renderContent();
initTypingTitle();
initScrollReveals();
bindInteractions();
