import $ from "jquery"
let $mobileSize = 768
var passwordConfirm = false
const isTouchDevice = () => {
  return "ontouchstart" in document.documentElement
}

const detectDevice = () => {
  if (
    navigator.userAgent.search("Safari") >= 0 &&
    navigator.userAgent.search("Chrome") < 0
  ) {
    $("body").addClass("ios_device")
  }
  if (isTouchDevice()) {
    $("html").addClass("touch")
    let standardMeta =
      "width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
    let specialMeta =
      "width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
    if ($("body").hasClass("ios_device")) {
      $("input, textarea").on("touchstart", () => {
        $('meta[name="viewport"]').attr("content", specialMeta)
      })
      $("input, textarea").blur(() => {
        $('meta[name="viewport"]').attr("content", standardMeta)
      })
    }
  } else {
    $("html").addClass("web")
  }
}

const closeAllMenues = () => {
  detectDevice()

  // $(".drop_btn").parent().removeClass("opened")
  // $(".drop_block").slideUp(300)

  if (
    $(".search_block").data("type") &&
    $(".search_block").data("type") == "close"
  ) {
    $(".search_block").removeClass("opened")
  }

  // $(".notifications").removeClass("opened")
}

const ignorBodyClick = (evt) => {
  evt.stopPropagation()
}

const detectContentHeight = () => {
  let footerHeight = $(".footer").length > 0 ? $(".footer").height() : 0
  let headerHeight =
    $(".header").length > 0 && $(".header").css("position") != "fixed"
      ? $(".header").height()
      : 0

  let freeSpace = window.innerHeight - footerHeight - headerHeight
  if (freeSpace > 0) {
    $(".content").css("min-height", freeSpace)
  } else {
    $(".content").css("min-height", 0)
  }
  $(".footer").css("opacity", 1)
}

const toggleSearch = (evt) => {
  if (!$(".search_block").hasClass("opened")) {
    evt.preventDefault()
    closeAllMenues(evt)
    evt.stopPropagation()
    $(".search_block").addClass("opened").find("input").focus()
  } else if (!$(".search_block input").val()) {
    $(".search_block input").focus()
    evt.preventDefault()
  } else {
    evt.stopPropagation()
  }
}

const focusEmptySearch = (evt) => {
  if (!$(".search_block input").val()) {
    evt.preventDefault()
    $(".search_block input").focus()
  }
}

const checkFields = () => {
  $("form input").change(() => {
    if ($(this).val().length > 0) {
      $(this).parent().find(".individual_hint").show()
      $(this).parent().find(".standard_hint").hide()
    } else {
      $(this).parent().find(".individual_hint").hide()
      $(this).parent().find(".standard_hint").show()
    }

    if ($(".confirm_field").length > 0) {
      $(".confirm_field").on("keyup change", () => {
        if (
          $(this).val() == $(this).parents("form").find(".password_field").val()
        ) {
          $(this).parent().removeClass("has-error")
          passwordConfirm = true
        }
      })
    }
  })
}

const checkPassConfirm = () => {
  let passValue = $(".confirm_field")
    .parents("form")
    .find(".password_field")
    .val()
  let passConfirm = $(".confirm_field").val()
  if (
    passValue &&
    passValue != passConfirm &&
    $(".pass_fields").css("display") != "none"
  ) {
    $(".confirm_field").parent().addClass("has-error")
    passwordConfirm = null
  } else {
    passwordConfirm = true
  }
}

const checkForm = () => {
  let $button = $(this)
  if ($button.parents("form").find(".confirm_field").length > 0) {
    checkPassConfirm()
  } else {
    passwordConfirm = true
  }
  $.validate({
    scrollToTopOnError: false,
    onError: () => {
      if (
        $button.parents("form").hasClass("login_form") ||
        $button.parents("form").hasClass("register_form")
      ) {
        $(".has-error").each(() => {
          let errorInputType = $(this).find("input").attr("type")
          $('input[type="' + errorInputType + '"]')
            .parents(".general_field")
            .addClass("has-error")
        })
      }
    },
    onSuccess: () => {
      if (!passwordConfirm) {
        return false
      }
    }
  })
  setTimeout(() => {
    if ($button.hasClass("checkout_submit") && $(".has-error").length > 0) {
      $("body, html").animate(
        {
          scrollTop: $(".has-error").eq(0).offset().top - $(".header").height()
        },
        1000
      )
    }
  }, 100)
}

const dropToggle = (evt) => {
  evt.preventDefault()
  if (!$(this).parent().hasClass("opened")) {
    closeAllMenues(evt)
    evt.stopPropagation()
    $(this)
      .parent()
      .addClass("opened")
      .find(".drop_block")
      .stop(true, true)
      .slideDown(300)
  }
}

//menu all functionality script
let $menuItem = "li"
let $menuList = "ul"
let $mainItem = $(".menu_list > li")
let $submenuBtn = $(".submenu_btn")
let $submenuList = ".submenu_list"
let openDelayTime,
  closeDelayTime,
  showing = null

//submenu open function on desctop device with mouseover action
const showSubmenuWithHover = (e) => {
  let $newActiveItem = $(e.target).closest($menuItem)
  $newActiveItem.addClass("active")
  if (openDelayTime) {
    clearTimeout(openDelayTime)
  }

  openDelayTime = setTimeout(() => {
    if ($newActiveItem.hasClass("active")) {
      $newActiveItem
        .find(".opened")
        .removeClass("opened")
        .find($submenuList)
        .hide()
      $newActiveItem
        .addClass("opened")
        .children($submenuList)
        .stop(true, true)
        .fadeIn(300)
    }
  }, 300)
}

//submenu close function on desctop device with mouseleave action
const closeSubmenuWithHover = (leaveItem) => {
  let $activeItem = leaveItem
  if (closeDelayTime) {
    clearTimeout(closeDelayTime)
  }
  closeDelayTime = setTimeout(() => {
    if (!$activeItem.hasClass("active")) {
      $activeItem.removeClass("opened").children($submenuList).fadeOut()
    }
  }, 300)
}

const mouseLeaveItem = (e) => {
  $(e.currentTarget).closest($menuItem).removeClass("active")
}

//submenu open function on touch device (not mobile menu)
const showSubmenuWithTouch = (e) => {
  e.preventDefault()
  if (isTouchDevice()) {
    let $this = $(e.currentTarget)
    setTimeout(() => {
      if (!$this.closest($menuItem).hasClass("opened")) {
        $this
          .closest($menuList)
          .children($menuItem)
          .removeClass("opened")
          .children($submenuList)
          .fadeOut(300)
        $this
          .closest($menuItem)
          .find(".opened")
          .removeClass("opened")
          .children($submenuList)
          .hide()
        $this
          .closest($menuItem)
          .addClass("opened")
          .children($submenuList)
          .stop(true, true)
          .fadeIn(300)
      } else {
        $this
          .closest($menuItem)
          .removeClass("opened")
          .children($submenuList)
          .fadeOut(300)
      }
    }, 0)
  }
}

//submenu open function in mobile menu
const showMobileSubmenu = (e) => {
  var $this = $(e.currentTarget)
  e.preventDefault()
  let backBtn =
    '<li class="back_btn"><button class="icon_left" aria-label="back">' +
    $this.text().toLowerCase() +
    "</button></li>"
  let parentList = $this.closest("ul").hasClass("menu_list")
    ? $(".menu_block")
    : $this.closest($submenuList)
  if (!showing) {
    showing = true
    $($submenuList).animate({ scrollTop: 0 }, 0)
    $this
      .closest($menuItem)
      .addClass("opened")
      .children($submenuList)
      .addClass("fixed")
    if (
      $this.closest($menuItem).children($submenuList).find(".back_btn").length <
      1
    ) {
      $this
        .closest($menuItem)
        .addClass("opened")
        .children($submenuList)
        .prepend(backBtn)
    }
    parentList.addClass("no_scroll")
    setTimeout(() => {
      showing = null
    }, 500)
  }
}

//submenu close function on touch device (not mobile menu)
const closeSubmenuWithTouch = () => {
  $mainItem.removeClass("opened").children($submenuList).fadeOut(300)
}

//submenu close function in mobile menu
const closeMobileSubmenu = (e) => {
  let $backBtn = $(e.currentTarget)
  if (!showing) {
    showing = true
    $backBtn.closest($submenuList).closest($menuItem).removeClass("opened")
    setTimeout(() => {
      $backBtn.closest($submenuList).removeClass("fixed")
      $backBtn.closest(".no_scroll").removeClass("no_scroll")
      $backBtn.closest($menuItem).remove()
      showing = null
    }, 500)
  }
}

//mobile menu open/close function with mobile burger menu touch
const mobMenuTrigger = (e) => {
  e.preventDefault()

  if ($("body").hasClass("menu_opened")) {
    let subCloseTime = $(".menu_list li.opened").length > 0 ? 500 : 0
    $(".menu_list li.opened").removeClass("opened")
    setTimeout(() => {
      $("body").removeClass("menu_opened")
    }, subCloseTime)
  } else {
    $(".menu_inner, body, html").animate({ scrollTop: 0 }, 0)
    $("body").addClass("menu_opened")
  }
}

const detectCallPosibillity = () => {
  if (
    /Android|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $(".phone_link").addClass("clickable")
  }
  $(".phone_link").click((e) => {
    if (!$(this).hasClass("clickable")) {
      e.preventDefault()
    }
  })
}

const openPopup = (evt) => {
  evt.preventDefault()
  $("body").addClass("popup_opened")
  let popupName = "." + $(evt.currentTarget).data("popup")
  $(popupName).addClass("showed")
}

const closePopup = () => {
  $("body").removeClass("popup_opened")
  $(".popup_block").removeClass("showed")
}

$(document).ready(() => {
  detectDevice()
  detectCallPosibillity()

  //close dropdowns with outside click
  $("body").click(closeAllMenues)

  //menu functionality call functions

  // mobile menu open close function call
  $(".menu_btn").click(mobMenuTrigger)

  if (!isTouchDevice() && window.innerWidth >= $mobileSize) {
    //desctop submenu open/close with mouseover/mouseleave action

    $submenuBtn.hover(showSubmenuWithHover, mouseLeaveItem)
    $submenuBtn.click(showSubmenuWithTouch)
    $(".menu_list li").mouseleave((e) => {
      let $this = $(e.currentTarget)
      if ($this.hasClass("opened")) {
        closeSubmenuWithHover($this)
      }
      // closeSubmenuWithTouch()
    })
  } else if (isTouchDevice && window.innerWidth >= $mobileSize) {
    //touch (not mobile menu) device submenu close action with outside touch
    $("body").on("click", (e) => {
      if (
        $(".menu_list > li.opened").length > 0 &&
        !$(e.target).is(".menu_list li.opened *")
      ) {
        closeSubmenuWithTouch()
      }
    })
    //touch (not mobile menu) device submenu open action with submenu btn touch
    $submenuBtn.click(showSubmenuWithTouch)
  } else {
    //submenu open action in mobile menu with submenu btn touch
    $submenuBtn.click(showMobileSubmenu)

    //submenu close action in mobile menu with back btn touch
    $(document).on(
      "click",
      ".submenu_list .back_btn button",
      closeMobileSubmenu
    )
  }

  //menu functionality call functions end

  // form front validation
  if ($(".validate_btn").length > 0) {
    checkFields()
    $(".validate_btn").click(checkForm)
  }

  //drop element open close
  $(".drop_btn").click(dropToggle)

  //hidden search open/close
  $('.search_block button[type="submit"]').click((evt) => {
    if (
      $(".search_block").data("type") &&
      $(".search_block").data("type") == "close"
    ) {
      toggleSearch(evt)
    } else {
      focusEmptySearch(evt)
    }
  })

  $(".search_block input").click((evt) => {
    if (
      $(".search_block").data("type") &&
      $(".search_block").data("type") == "close"
    ) {
      ignorBodyClick(evt)
    }
  })

  $(".popup_btn").click(openPopup)
  $(".popup_close").click(closePopup)

  //card number and expire mask functionality

  if ($(".card_number").length > 0) {
    var ccNumberInput = document.querySelector(".card_number"),
      ccNumberPattern = /^\d{0,16}$/g,
      ccNumberSeparator = " ",
      ccNumberInputOldValue,
      ccNumberInputOldCursor,
      mask = (value, limit, separator) => {
        var output = []
        for (let i = 0; i < value.length; i++) {
          if (i !== 0 && i % limit === 0) {
            output.push(separator)
          }

          output.push(value[i])
        }

        return output.join("")
      },
      unmask = (value) => value.replace(/[^\d]/g, ""),
      checkSeparator = (position, interval) =>
        Math.floor(position / (interval + 1)),
      ccNumberInputKeyDownHandler = (e) => {
        let el = e.target
        ccNumberInputOldValue = el.value
        ccNumberInputOldCursor = el.selectionEnd
      },
      ccNumberInputInputHandler = (e) => {
        let el = e.target,
          newValue = unmask(el.value),
          newCursorPosition

        if (newValue.match(ccNumberPattern)) {
          newValue = mask(newValue, 4, ccNumberSeparator)

          newCursorPosition =
            ccNumberInputOldCursor -
            checkSeparator(ccNumberInputOldCursor, 4) +
            checkSeparator(
              ccNumberInputOldCursor +
                (newValue.length - ccNumberInputOldValue.length),
              4
            ) +
            (unmask(newValue).length - unmask(ccNumberInputOldValue).length)

          el.value = newValue !== "" ? newValue : ""
        } else {
          el.value = ccNumberInputOldValue
          newCursorPosition = ccNumberInputOldCursor
        }

        el.setSelectionRange(newCursorPosition, newCursorPosition)
      }

    ccNumberInput.addEventListener("keydown", ccNumberInputKeyDownHandler)
    ccNumberInput.addEventListener("input", ccNumberInputInputHandler)
  }

  $(".card_item .info_toggle").click((e) => {
    $(e.currentTarget).parents(".card_item").toggleClass("opened")
  })
})

export const fix = function () {
  if ($(".card_summary").length > 0) {
    $(window)
      .resize(() => {
        $(document)
          .scroll(() => {
            if (
              window.innerWidth >= 768 &&
              $(".card_inner").height() - 20 >
                $(".summary_inner").innerHeight() +
                  parseInt($(".card_summary").css("padding-top")) &&
              $(".summary_inner").innerHeight() <
                window.innerHeight - $(".header").innerHeight() - 40
            ) {
              if (
                $(document).scrollTop() + $(".header").height() + 20 >=
                $(".card_summary").offset().top
              ) {
                $(".summary_inner")
                  .addClass("fixed")
                  .css({
                    left:
                      $(".card_summary").offset().left +
                      parseInt($(".card_summary").css("padding-left")),
                    width:
                      $(".card_summary").innerWidth() -
                      2 * parseInt($(".card_summary").css("padding-left"))
                  })
                if (
                  $(document).scrollTop() +
                    $(".header").height() +
                    $(".summary_inner").innerHeight() +
                    20 >=
                  $(".card_inner").offset().top + $(".card_inner").innerHeight()
                ) {
                  $(".summary_inner").addClass("to_bottom")
                } else {
                  $(".summary_inner").removeClass("to_bottom")
                }
              } else {
                $(".summary_inner")
                  .removeClass("fixed to_bottom")
                  .css({ left: "auto", width: "100%" })
              }
            } else {
              $(".summary_inner").removeClass("fixed to_bottom").css({
                left: "auto",
                width: "100%"
              })
            }
          })
          .trigger("scroll")
      })
      .trigger("resize")
  }
}

$(window).on("load", () => {
  $(window)
    .resize(() => {
      detectContentHeight()
    })
    .trigger("resize")
})

const animate_home = () => {
  setTimeout(() => {
    if ($(".how_works").length > 0) {
      $(window)
        .scroll(() => {
          if (
            $(".work_steps").offset() &&
            $(document).scrollTop() + window.innerHeight >
              $(".work_steps").offset().top + $(".work_steps").innerHeight() &&
            $(document).scrollTop() < $(".work_steps").offset().top &&
            !$(".work_steps").hasClass("showed")
          ) {
            $(".work_steps").addClass("showed")
            $(".step_inner").addClass("moving")
            let handPosition = "pos_" + Math.ceil(Math.random() * 4)
            $(".shapes_list").addClass(handPosition)
            if ($(".work_steps").hasClass("slick-slider")) {
              $(".work_steps").slick(
                "slickSetOption",
                {
                  autoplay: true
                },
                true
              )
            }
          }
        })
        .trigger("scroll")
      // jogi
      $(window).resize(() => {
        if (
          window.innerWidth < 960 &&
          !$(".work_steps").hasClass("slick-slider")
        ) {
          $(".work_steps").removeClass("showed").slick({
            autoplay: false,
            arrows: false,
            infinite: false,
            autoplaySpeed: 4000,
            speed: 2050,
            draggable: false,
            swipe: false,
            touchMove: false
          })
          $(".shapes_list").attr("class", "shapes_list")
          $(window).trigger("scroll")
        } else if (
          window.innerWidth >= 960 &&
          $(".work_steps").hasClass("slick-slider")
        ) {
          $(".work_steps").removeClass("showed").slick("destroy")
          $(".shapes_list").attr("class", "shapes_list")
          $(window).trigger("scroll")
        }
      })

      $(".work_steps").on("beforeChange", () => {
        $(".step_inner").removeClass("moving")
        setTimeout(() => {
          $(".step_inner").addClass("moving")
        }, 50)
      })

      $(".work_steps").on("afterChange", () => {
        if ($(".slick-slide:last-child").hasClass("slick-active")) {
          $(".work_steps").slick(
            "slickSetOption",
            {
              autoplay: false,
              dots: true,
              draggable: true,
              swipe: true,
              touchMove: true
            },
            true
          )
        } else {
          $(".work_steps").slick(
            "slickSetOption",
            {
              autoplaySpeed: 2000
            },
            true
          )
        }
      })
    }
  }, 300)
}

export { detectContentHeight, animate_home }
