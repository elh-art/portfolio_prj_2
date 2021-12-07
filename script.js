const biButtons = document.querySelectorAll('.biBtn')
const buttons = document.querySelectorAll('.toggleBtn')
const clockEl = document.querySelector('.clock')
const toggle = document.querySelector('.toggle')
const needleEl = document.querySelector('.needle')

let num = 0
var flip = 'now'

// StackOverflow https://tinyurl.com/2p8smryu
const scale = (numz, in_min, in_max, out_min, out_max) => {
  return (
    ((numz - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min + 90
  )
}

// Dark - Light mode switch
toggle.addEventListener('click', (e) => {
  const html = document.querySelector('html')
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    e.target.innerHTML = 'Dark mode'
  } else {
    html.classList.add('dark')
    e.target.innerHTML = 'Light mode'
  }
})

// Async - Await fetch
const getResults = async () => {
  if (biButtons[0].classList.contains('active')) {
    var URL = `https://api.alternative.me/fng/?limit=3`
    var init = {}
  }

  if (biButtons[1].classList.contains('active')) {
    var URL = `https://fear-and-greed-index.p.rapidapi.com/v1/fgi`
    var init = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'fear-and-greed-index.p.rapidapi.com',
        'x-rapidapi-key': '5e1151671dmsh33148bd157b34c4p1bac09jsn1a09aab41bcb',
      },
    }
  }

  const res = await fetch(URL, init)
  const dta = await res.json()
  return dta
}

function callForResult() {
  getResults().then((dta) => container(dta))
}

callForResult()
buttons[num].classList.add('active')

const container = (dta) => {
  if (clockEl.lastElementChild.className == 'value') {
    clockEl.lastElementChild.remove()
  }

  if (clockEl.lastElementChild.className == 'classification') {
    clockEl.lastElementChild.remove()
  }

  const fear = document.createElement('div')
  fear.classList.add('classification')

  if (biButtons[0].classList.contains('active')) {
    fear.innerHTML = dta.data[num].value_classification
  }

  // eval() evaluates string as JS code
  if (biButtons[1].classList.contains('active')) {
    fear.innerHTML = eval(`dta.fgi.${flip}.valueText`)
  }

  clockEl.appendChild(fear)

  const value = document.createElement('div')
  value.classList.add('value')

  if (biButtons[0].classList.contains('active')) {
    value.innerHTML = dta.data[num].value
  }

  if (biButtons[1].classList.contains('active')) {
    value.innerHTML = eval(`dta.fgi.${flip}.value`)
  }

  clockEl.appendChild(value)
  rotateNeedle()
}

function rotateNeedle() {
  var txt = clockEl.lastElementChild.innerHTML
  // parseInt converts string to integer
  var parsed = parseInt(txt, 10)
  needleEl.style.transform = `rotate(${scale(parsed, 0, 100, 0, 180)}deg)`
}

buttons.forEach((e) => {
  e.addEventListener('click', (e) => {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active')
    }
    e.target.classList.add('active')

    if (biButtons[0].classList.contains('active')) {
      num = e.target.innerHTML.slice(-1)
    }

    if (biButtons[1].classList.contains('active')) {
      if (buttons[0].classList.contains('active')) {
        flip = 'now'
      }
      if (buttons[1].classList.contains('active')) {
        flip = 'previousClose'
      }
      if (buttons[2].classList.contains('active')) {
        flip = 'oneWeekAgo'
      }
    }

    callForResult()
  })
})

biButtons.forEach((e) => {
  e.addEventListener('click', (e) => {
    for (var i = 0; i < biButtons.length; i++) {
      biButtons[i].classList.remove('active')
    }
    e.target.classList.add('active')

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active')
    }
    buttons[0].classList.add('active')

    buttons[0].click()
  })
})
