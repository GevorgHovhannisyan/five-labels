/*  eslint-disable */
const closeMenuBlock = () => {
  const menu = document.querySelector(".orders_menu ul, .profile_menu ul")

  if (menu.classList && menu.classList.contains("opened")) {
    menu.classList.remove("opened")
  } else {
    menu.classList.add("opened")
  }
}

const check_card_expire = (value) => {
  return value
    .replace(/^([1-9]\/|[2-9])$/g, "0$1/")
    .replace(/^(0[1-9]|1[0-2])$/g, "$1/")
    .replace(/^([0-1])([3-9])$/g, "0$1/$2")
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, "$1/$2")
    .replace(/^([0]+)\/|[0]+$/g, "0")
    .replace(/[^\d\/]|^[\/]*$/g, "")
    .replace(/\/\//g, "/")
}

const check_card_number = (selector) => {
  var filter_number = ""
  var ccNumberPattern = /^\d{0,16}$/g,
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
      ccNumberInputOldValue = e.value
      ccNumberInputOldCursor = e.selectionEnd
    },
    ccNumberInputInputHandler = (e) => {
      let el = e,
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
        filter_number = el.value
        return el.value
      } else {
        el.value = ccNumberInputOldValue
        newCursorPosition = ccNumberInputOldCursor
      }
    }

  ccNumberInputKeyDownHandler(selector)
  ccNumberInputInputHandler(selector)

  return filter_number
}

export { closeMenuBlock, check_card_expire, check_card_number }
