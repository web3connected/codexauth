/*
 * ----------------------------------------------------------------------------------------
 * 01. Reusable Functions Start
 * 02. faq
 * 03. mobile menu
 * 04. video modal
 * 05. header position set
 * 06. Scroll to top functionality
 * 07. add remove product button
 * 08. select country modal
 * 09. filter by platform modal
 * 10. filter by games modal
 * 11. contacts tab
 * 12. latest game hover effect
 * 13. our expertise hover effect
 * ----------------------------------------------------------------------------------------
 */

/*
 01. Reusable Functions Start
*/

//create tab resubale function
function createTab(tabName, activeButtonClassList, inactiveButtonClassList) {
  const tabButtons = tabName?.querySelectorAll(".tab-item");

  if (tabButtons) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabNameText = button.innerText
          .toLowerCase()
          .replace(/\s+/g, "-")
          .trim();
        tabButtons.forEach((otherButton) => {
          const otherTabName = otherButton.innerText
            .toLowerCase()
            .replace(/\s+/g, "-")
            .trim();

          activeButtonClassList.forEach((className) => {
            otherButton.classList.toggle(
              className,
              tabNameText === otherTabName
            );
          });

          inactiveButtonClassList.forEach((className) => {
            otherButton.classList.toggle(
              className,
              tabNameText !== otherTabName
            );
          });

          const otherTabContent = tabName.querySelector(`#${otherTabName}`);

          otherTabContent.classList.toggle(
            "animationOne",
            tabNameText === otherTabName
          );
          otherTabContent.classList.toggle(
            "hidden",
            tabNameText !== otherTabName
          );
          otherTabContent.classList.toggle(
            "animationTwo",
            tabNameText !== otherTabName
          );
        });
      });
    });
  }
}

// create dropdown resubale function and select item
function dropdownModalAndSelect(
  dropDown,
  dropDownModal,
  openDropDownClasses,
  closeDropDownClasses
) {
  if (dropDown) {
    dropDown.addEventListener("click", () => {
      if (dropDownModal.classList.contains("visible")) {
        dropDownModal.classList.add(...closeDropDownClasses);
        dropDownModal.classList.remove(...openDropDownClasses);
      } else {
        dropDownModal.classList.remove(...closeDropDownClasses);
        dropDownModal.classList.add(...openDropDownClasses);
      }
    });

    const itemList = dropDownModal.querySelectorAll(".item");

    const selectedItem = dropDown.querySelector(".selectedItem");
    itemList.forEach((item) => {
      item.addEventListener("click", () => {
        selectedItem.textContent = item.textContent;
        dropDownModal.classList.add(...closeDropDownClasses);
        dropDownModal.classList.remove(...openDropDownClasses);
      });
    });

    document.addEventListener("click", (e) => {
      if (!dropDown.contains(e.target) && !dropDownModal.contains(e.target)) {
        dropDownModal.classList.add(...closeDropDownClasses);
        dropDownModal.classList.remove(...openDropDownClasses);
      }
    });
  }
}

/*
 Reusable Functions End
*/

// 02. faq
let accordion = document.querySelectorAll(".faq-accordion");

accordion?.forEach((item, index) => {
  accordion[index].addEventListener("click", function () {
    let faqAnswer = this.nextElementSibling;
    let parent = accordion[index].parentElement;

    // Close all other accordions
    accordion.forEach((otherAccordion, otherIndex) => {
      if (otherIndex !== index) {
        let otherFaqAnswer = otherAccordion.nextElementSibling;
        otherFaqAnswer.style.height = null;
        otherAccordion.querySelector("i").classList.remove("ph-minus");
        otherAccordion.querySelector("i").classList.add("ph-plus");
      }
    });

    // Toggle open/close for the clicked accordion
    if (faqAnswer.style.height) {
      faqAnswer.style.height = null;
    } else {
      faqAnswer.style.height = faqAnswer.scrollHeight + "px";
    }

    // Toggle classes for the clicked accordion
    accordion[index].querySelector("i").classList.toggle("ph-plus");
    accordion[index].querySelector("i").classList.toggle("ph-minus");
    // accordion[index].querySelector("i").classList.add("text-g300");
  });
});

//03. mobile menu
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuOpenButton = document.querySelector(".mobile-menu-open");
const mobileMenuCloseButton = document.querySelector(".mobile-menu-close");

mobileMenu &&
  mobileMenuOpenButton.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-[100%]", "opacity-0", "invisible");
    mobileMenu.classList.add("translate-x-0", "opacity-100", "visible");
  });

if (mobileMenu) {
  mobileMenuOpenButton.addEventListener("click", () => {
    mobileMenu.classList.remove(
      "translate-x-[-100%]",
      "opacity-0",
      "invisible"
    );
    mobileMenu.classList.add("translate-x-0", "opacity-100", "visible");
  });

  mobileMenuCloseButton.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-0", "opacity-100", "visible");
    mobileMenu.classList.add("translate-x-[-100%]", "opacity-0", "invisible");
  });
}

// const observer = new IntersectionObserver(
//   ([entry]) => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add("opacity-100");
//       observer.unobserve(entry.target); // optional: remove after it appears once
//     }
//   },
//   {
//     threshold: 0.1, // how much of the div must be visible (10% here)
//   }
// );

// const target = document.getElementById("myDiv");
// if (target) {
//   observer.observe(target);
// }

const mobileSubMenu = document.querySelectorAll(".subMenuToggle");

mobileSubMenu &&
  mobileSubMenu.forEach((el) =>
    el.addEventListener("click", () => {
      const activeSubMenu = document.querySelector(".subMenuOpen");
      const toggleClass = el.querySelector(".subMenu");

      if (toggleClass.classList.contains("subMenuOpen")) {
        toggleClass.classList.add("subMenuClose");
        toggleClass.classList.remove("subMenuOpen");
      } else {
        activeSubMenu?.classList.remove("subMenuOpen");
        activeSubMenu?.classList.add("subMenuClose");
        toggleClass.classList.remove("subMenuClose");
        toggleClass.classList.add("subMenuOpen");
      }
    })
  );

//04. video modal
const videoModalBg = document.querySelector(".videoModalBg");
const videoModalButtonOpen = document.querySelectorAll(".videoModalButtonOpen");
const videoModalButtonClose = document.querySelector(".videoModalButtonClose");
const videoModalItem = document.querySelector(".videoModal");

if (videoModalButtonOpen) {
  videoModalButtonOpen.forEach((openButton) => {
    openButton.addEventListener("click", () => {
      videoModalItem.classList.remove("videoModalClose");
      videoModalBg.classList.remove("videoModalBgClose");
      videoModalBg.classList.add("videoModalBgOpen");
      videoModalItem.classList.add("videoModalOpen");
    });
  });

  videoModalButtonClose?.addEventListener("click", () => {
    videoModalItem.classList.remove("videoModalOpen");
    videoModalBg.classList.remove("videoModalBgOpen");
    videoModalBg.classList.add("videoModalBgClose");
    videoModalItem.classList.add("videoModalClose");
  });
}

//05. header position set
window.addEventListener("scroll", function () {
  const mainHeader = document.querySelector(".header");
  const scrollButton = document.querySelector(".scrollButton");
  if (mainHeader) {
    if (window.scrollY > 100) {
      mainHeader.classList.add("headerFixed");
      mainHeader.classList.remove("headerAbsolute");
    } else {
      mainHeader.classList.add("headerAbsolute");
      mainHeader.classList.remove("headerFixed");
    }
  }

  if (scrollButton) {
    if (window.scrollY > 200) {
      scrollButton.classList.remove("scrollButtonShow");
      scrollButton.classList.add("scrollButtonShow");
    } else {
      scrollButton.classList.remove("scrollButtonShow");
      scrollButton.classList.add("scrollButtonHide");
    }
  }
});

//06. Scroll to top functionality
const scrollButton = document.querySelector(".scrollButton");

scrollButton &&
  scrollButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

//07. add remove product button
const addProductButton = document.querySelector(".addProductButton");

const removeProductButton = document.querySelector(".removeProductButton");

const totalProduct = document.querySelector(".totalProduct");

if (addProductButton) {
  addProductButton.addEventListener("click", () => {
    let value = parseInt(totalProduct.value) || 0;
    totalProduct.value = value + 1;
  });

  removeProductButton.addEventListener("click", () => {
    let value = parseInt(totalProduct.value) || 0;
    totalProduct.value = value > 1 ? value - 1 : 1;
  });
}

//08. select country modal
const selectCountry = document.querySelector(".selectCountry");
const selectCountryModal = document.querySelector(".selectCountryModal");
const openSelectModalClasses = ["visible", "opacity-100", "z-20", "scale-100"];
const closeSelectModalClasses = ["invisible", "opacity-0", "scale-75"];
dropdownModalAndSelect(
  selectCountry,
  selectCountryModal,
  openSelectModalClasses,
  closeSelectModalClasses
);

//09. filter by platform modal
const selectPlatform = document.querySelector(".selectPlatform");
const selectPlatformModal = document.querySelector(".selectPlatformModal");

dropdownModalAndSelect(
  selectPlatform,
  selectPlatformModal,
  openSelectModalClasses,
  closeSelectModalClasses
);

//10. filter by games modal
const selectGames = document.querySelector(".selectGames");
const selectGamesModal = document.querySelector(".selectGamesModal");

dropdownModalAndSelect(
  selectGames,
  selectGamesModal,
  openSelectModalClasses,
  closeSelectModalClasses
);

//11. contacts tab
const productDetailsTab = document.querySelector(".product-details-tab");
createTab(productDetailsTab, ["border-g300", "text-g300"], ["border-bg2"]);

//12. latest game hover effect
const latestGameItems = document.querySelectorAll(".latest-game-item");

latestGameItems?.forEach((item, index) =>
  latestGameItems[index].addEventListener("mouseover", function () {
    latestGameItems.forEach((otherGame, otherIndex) => {
      if (otherIndex !== index) {
        otherGame.classList.remove("active");
      }
    });

    latestGameItems[index].classList.add("active");
  })
);

//13. our expertise hover effect
const ourExpertiseItems = document.querySelectorAll(".our-service-item");

ourExpertiseItems?.forEach((item, index) =>
  ourExpertiseItems[index].addEventListener("mouseover", function () {
    ourExpertiseItems.forEach((otherGame, otherIndex) => {
      if (otherIndex !== index) {
        otherGame.classList.remove("active");
      }
    });

    ourExpertiseItems[index].classList.add("active");
  })
);

//14. active menu
const path = location.pathname;
const menuList = document.querySelectorAll(".menu");
const subMenuList = document.querySelectorAll(".subMenuItem");

menuList &&
  menuList.forEach((menu) => {
    const href = menu.getAttribute("href");

    // Extract base URL from href by removing './' and everything after the last '/'
    const newBaseUrl = href.replace("./", "").replace(/\/[^\/]*$/, "");

    // Check if the current page's pathname ends with the newBaseUrl
    if (path.endsWith(newBaseUrl)) {
      menu.classList.add("activeHeaderMenu");
    }
  });

subMenuList &&
  subMenuList.forEach((subMenu) => {
    const href = subMenu.getAttribute("href");

    // Extract base URL from href by removing './' and everything after the last '/'
    const newBaseUrl = href.replace("./", "").replace(/\/[^\/]*$/, "");

    // Check if the current page's pathname ends with the newBaseUrl
    if (path.endsWith(newBaseUrl)) {
      subMenu.classList.add("activeMenuText");

      const parentText = subMenu.closest("div").querySelector(".subMenuTitle");

      parentText.classList.add("activeHeaderMenu");
    }

    console.log();
  });
