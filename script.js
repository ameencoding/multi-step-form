"use strict";

const asideLis = document.querySelectorAll("aside li");
const containers = document.querySelectorAll(".parent > div");

const personalContainer = document.querySelector(".card");
const planContainer = document.querySelector(".step-2_parent");
const addonsContainer = document.querySelector(".addons");
const finishContainer = document.querySelector(".finishing");

const successContainer = document.querySelector(".thanks");

const form = document.querySelector("form");

const boxs = document.querySelectorAll(".box");
const plan = document.querySelector(".plan");
const chooses = document.querySelectorAll(".chooses .choose");
const finishedCard = document.querySelector(".finish-card");

const btnPrev = document.querySelector(".btn-prev");
const btnSubmit = document.querySelector(".btn-next");

let nameError = false;
let emailError = false;
let numberError = false;

let boxChecked = false;
let isYearChecked = false;
let isToggle = false;
let addonsChecked = false;

let personalIssue;
let planIssue;
let addonsIssue;

let selectedAddons;
let selectedPlan;

let currentWindow = personalContainer;
let currentId = personalContainer.dataset.id;

let currentAside = 1;

const userData = [{ plans: "" }, { addons: "" }];

// Btn Next
btnSubmit.addEventListener("click", function () {
  const inputName = form.querySelector("#name");
  const inputEmail = form.querySelector("#email");
  const inputNumber = form.querySelector("#number");

  // Name validation
  if (inputName.value === "") {
    currentWindow = personalContainer;
    personalIssue = true;
    nameError = true;
    form.querySelector(".name-error").classList.remove("hide");
  } else {
    nameError = false;
    form.querySelector(".name-error").classList.add("hide");
  }

  // Email validation
  if (inputEmail.value === "" || !inputEmail.value.includes("@")) {
    currentWindow = personalContainer;
    personalIssue = true;
    emailError = true;
    form.querySelector(".email-error").classList.remove("hide");
  } else {
    emailError = false;
    form.querySelector(".email-error").classList.add("hide");
  }

  // Number validation
  if (inputNumber.value === "") {
    currentWindow = personalContainer;
    personalIssue = true;
    numberError = true;
    form.querySelector(".number-error").classList.remove("hide");
  } else {
    numberError = false;
    form.querySelector(".number-error").classList.add("hide");
  }

  // Next Action -> 2
  if (numberError === false && emailError === false && numberError === false) {
    renderNext(personalContainer, planContainer);
    btnPrev.classList.remove("hide");

    currentWindow = planContainer;
    currentId = 2;

    personalIssue = false;
  }

  // Next Action -> 3
  if (boxChecked && personalIssue == false) {
    renderNext(planContainer, addonsContainer);

    currentWindow = addonsContainer;
    currentId = 3;

    planIssue = false;
  }

  // Next Action ->
  if (addonsChecked && personalIssue == false && planIssue == false) {
    renderNext(addonsContainer, finishContainer);

    currentWindow = finishContainer;
    currentId = 4;

    if (isYearChecked) {
      userData.map((user) => {
        user.plans.map((p) => {
          p.plan = `$${parseInt(p.plan.slice(1)) * 12}/mon`;
        });
      });

      //  reset
      isYearChecked = false;
    }

    const getType = userData[0].plans.map((p) => p.type).join("");
    const getTypeMonth = selectedPlan.querySelector(".t-sm").textContent;
    const total = parseInt(
      userData[0].plans
        .map((p) => p.plan)
        .join("")
        .slice(1)
    );

    const getAddon = userData[0].addons.map((a) => a.addonsType).join("");
    const getAddonMonth =
      selectedAddons.querySelector(".choose_month").textContent;

    const plans = `<div class="card-picked flex">
                       <div>
                        <p class="t-md">${
                          getType == "Arcade"
                            ? `${getType} (Monthly)`
                            : `${getType} (Yearly)`
                        }</p>
                        <p class="t-sm">Change</p>
                       </div>
                       <p class="t-md">${getTypeMonth}</p>
                    </div>`;

    const addons = `<div class="card-picked flex">
                    <div>
                     <p class="t-md">${getAddon}</p>
                     <p class="t-sm">Change</p>
                    </div>
                    <p class="t-md">${getAddonMonth}</p>
                 </div>`;
    finishedCard.innerHTML = `${plans} ${addons}`;

    const totalCard = finishContainer.querySelector(".total");
    totalCard.querySelector(".label-total").textContent = `${
      getType == "Arcade" ? `Total (Monthly)` : `Total (Yearly)`
    }`;

    const otherCharge =
      getType == "Arcade"
        ? parseInt(getAddonMonth.slice(2)) * 1
        : parseInt(getAddonMonth.slice(2)) * 12;

    totalCard.querySelector(".label-month").textContent = `$${
      total + otherCharge
    }`;

    setTimeout(() => {
      this.textContent = "Confirm";
    }, 500);
  }

  // Success
  if (btnSubmit.textContent === "Confirm") {
    renderNext(finishContainer, successContainer);
    btnPrev.parentElement.style.display = "none";

    setTimeout(() => {
      location.reload();
    }, 4000);
  }

  // render aside
  updateAside(+currentWindow.dataset.id);
});

// Btn Prev
btnPrev.addEventListener("click", function () {
  currentId--;
  if (currentId < 1) {
    currentId = 1;
    return;
  }
  if (currentId === 1) {
    this.classList.add("hide");
  }

  document.querySelectorAll(".parent > div").forEach((element) => {
    element.style.display = "none";
    if (element.dataset.id == currentId) {
      renderPrev(element);
      updateAside(currentId);
    }
  });
});

// Handle plan
boxs.forEach((box) => {
  box.addEventListener("click", function () {
    selectedPlan = this;

    boxs.forEach((b) => b.classList.remove("active-box"));
    this.classList.add("active-box");
    boxChecked = true;

    this.className.includes("box-1") ? monthlyPlan() : yearlyPlan();

    const type = box.querySelector("div .t-md").textContent;
    const plan = box.querySelector("div .t-sm").textContent;

    // Update plans
    userData.map((user) => {
      user.plans = [{ type, plan }];
    });
  });
});

// Handle monthly plan
const btnToggle = plan.querySelector("div");

const monthlyPlan = function () {
  isToggle = false;
  btnToggle.querySelector(".circle").classList.remove("toggle");
  plan.querySelector(".yearly").classList.remove("active-plan");
  plan.querySelector(".monthly").classList.add("active-plan");
};

// Handle yearly plan
const yearlyPlan = function () {
  isYearChecked = true; // yearly plan, Otherwise monthly plan.
  isToggle = true;
  btnToggle.querySelector(".circle").classList.add("toggle");
  plan.querySelector(".yearly").classList.add("active-plan");
  plan.querySelector(".monthly").classList.remove("active-plan");
  plan.querySelector(".monthly").style.color = "#9699ab";
};

// Handle Addons
chooses.forEach((choose) => {
  choose.addEventListener("click", function () {
    selectedAddons = this;

    // Disable
    chooses.forEach((c) => c.classList.remove("active-choose"));
    document.querySelectorAll(".check-box").forEach((check) => {
      check.style.borderColor = "#d6d9e6";
    });

    document.querySelectorAll(".check-box").forEach((check) => {
      check.style.backgroundColor = "transparent";
    });

    document.querySelectorAll(".check-box img").forEach((img) => {
      img.style.display = "none";
    });

    // Enable
    this.classList.add("active-choose");
    this.querySelector(".check-box").style.backgroundColor = "#473dff";
    this.querySelector(".check-box img").style.display = "block";

    const addonsType = this.querySelector("div .addons-title").textContent;
    addonsChecked = true;

    // update addons
    userData.map((user) => {
      user.addons = [{ addonsType }];
    });
  });
});

const clearPrevAside = () => {
  asideLis.forEach((lr) => {
    lr.querySelector("button").classList.remove("active-aside");
  });
};

const updateAside = function (id) {
  asideLis.forEach((lr) => {
    lr.querySelector("button").classList.remove("active-aside");
  });

  if (currentAside <= asideLis.length) {
    asideLis.forEach((li, index) => {
      if (index + 1 === id) {
        li.querySelector("button").classList.add("active-aside");
      }
    });
  }
};

const renderPrev = function (prev) {
  prev.style.display = "block";
};

const renderNext = function (cur, next) {
  cur.style.display = "none";
  next.style.display = "block";
};
