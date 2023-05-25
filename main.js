
//  Murat Kirazkaya

let PlayerOne = {
    prefix: 'p1',
    healt: 100,
    mana: 100,
    won: 0
};
let PlayerTwo = {
    prefix: 'p2',
    healt: 100,
    mana: 100,
    won: 0
};
const skills = {
    q: {
        mana: 15,
        min_damage: 10,
        max_damage: 15
    },
    w: {
        heal: 20,
        mana: 10
    },
    e: {
        mana: 20
    },
    r: {
        mana: 80,
        min_damage: 50,
        max_damage: 80
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function fetchLocalStorage() {
    localStorage.setItem('history', JSON.stringify({ p1: PlayerOne, p2: PlayerTwo, turn: getTurn().prefix }))
}

function resetGame() {
    PlayerOne.healt = 100;
    PlayerOne.mana = 100;
    PlayerTwo.healt = 100;
    PlayerTwo.mana = 100;
    updateHealt(PlayerOne)
    updateHealt(PlayerTwo)
    updateMana(PlayerOne)
    updateMana(PlayerTwo)
    $('#p2-turn').removeClass('active')
    if (!$('#p1-turn').hasClass('active')) $('#p1-turn').addClass('active')
    $('#log-screen').html('')
    $('#score').text(`${PlayerOne.won} - ${PlayerTwo.won}`)
    fetchManas()
    fetchLocalStorage()
}

function log(text) {
    $('#log-screen').append(text);
}

function updateHealt(player, amout) {
    $(`#${player.prefix}-healt`).css('width', `${player.healt}%`)
    $(`#${player.prefix}-healt`).addClass('shake')
    $(`#${player.prefix}-healt-bar`).addClass('shake')
    setTimeout(() => {
        $(`#${player.prefix}-healt`).removeClass('shake')
        $(`#${player.prefix}-healt-bar`).removeClass('shake')
    }, 500);
}

function increaseHealt(player, amout) {
    player.healt = Math.min(player.healt + amout, 100)
    fetchLocalStorage()
}

function decreaseHealt(player, amout) {
    player.healt = Math.max(player.healt - amout, 0)
    fetchLocalStorage()
}

function updateMana(player) {
    $(`#${player.prefix}-mana`).css('width', `${player.mana}%`)
    $(`#${player.prefix}-mana`).addClass('shake')
    $(`#${player.prefix}-mana-bar`).addClass('shake')
    setTimeout(() => {
        $(`#${player.prefix}-mana`).removeClass('shake')
        $(`#${player.prefix}-mana-bar`).removeClass('shake')
    }, 500);
}

function increaseMana(player, amout) {
    player.mana = Math.min(player.mana + amout, 100)
    fetchLocalStorage()
}

function decreaseMana(player, amout) {
    player.mana = Math.max(player.mana - amout, 0)
    fetchLocalStorage()
}

function shakeMana(player) {
    $(`#${player.prefix}-mana`).addClass('shake')
    $(`#${player.prefix}-mana-bar`).addClass('shake')
    setTimeout(() => {
        $(`#${player.prefix}-mana`).removeClass('shake')
        $(`#${player.prefix}-mana-bar`).removeClass('shake')
    }, 500);
}

function shakeTurn() {
    $('.turn-icon').each(function () {
        if ($(this).hasClass('active')) {
            $(this).addClass('shake')
            setTimeout(() => {
                $(this).removeClass('shake')
            }, 500);
        } 
    })
}

function switchTurn() {
    $('.turn-icon').each(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        } else {
            $(this).addClass('active')
        }
    })
}

function getTurn() {
    let p1 = true
    $('.turn-icon').each(function () {
        if ($(this).hasClass('active')) {
            if ($(this).attr('id') === 'p2-turn') {
                p1 = false
            }
        }
    })
    if (p1) return PlayerOne
    else return PlayerTwo
}

function getTargetTurn() {
    let p1 = true
    $('.turn-icon').each(function () {
        if ($(this).hasClass('active')) {
            if ($(this).attr('id') === 'p2-turn') {
                p1 = false
            }
        }
    })
    if (p1) return PlayerTwo
    else return PlayerOne
}

function fetchManas() {
    if (PlayerOne.mana < skills.q.mana) $('#skill-Q-0').css('background-color', 'darkred')
    else $('#skill-Q-0').css('background-color', '')
    if (PlayerOne.mana < skills.w.mana) $('#skill-W-0').css('background-color', 'darkred')
    else $('#skill-W-0').css('background-color', '')
    if (PlayerOne.mana < skills.r.mana) $('#skill-R-0').css('background-color', 'darkred')
    else $('#skill-R-0').css('background-color', '')

    if (PlayerTwo.mana < skills.q.mana) $('#skill-Q-1').css('background-color', 'darkred')
    else $('#skill-Q-1').css('background-color', '')
    if (PlayerTwo.mana < skills.w.mana) $('#skill-W-1').css('background-color', 'darkred')
    else $('#skill-W-1').css('background-color', '')
    if (PlayerTwo.mana < skills.r.mana) $('#skill-R-1').css('background-color', 'darkred')
    else $('#skill-R-1').css('background-color', '')

    fetchLocalStorage()
    setTimeout(() => {
        fetchLocalStorage()
        if (PlayerOne.healt === 0) {
            alert('Player Two won this game.')
            PlayerTwo.won++;
            resetGame()
        } else if (PlayerTwo.healt === 0) {
            alert('Player One won this game.')
            PlayerOne.won++;
            resetGame()
        }
    }, 1000);
}

$(function Naz() {
    if (localStorage.getItem('history') === null) {
        localStorage.setItem('history', JSON.stringify({ p1: PlayerOne, p2: PlayerTwo, turn: getTurn().prefix }))
    } else {
        let history = JSON.parse(localStorage.getItem('history'))
        PlayerOne = history.p1;
        PlayerTwo = history.p2;
        if (history.turn === 'p2') switchTurn()
    }
    updateHealt(PlayerOne)
    updateHealt(PlayerTwo)
    updateMana(PlayerOne)
    updateMana(PlayerTwo)
    $('#score').text(`${PlayerOne.won} - ${PlayerTwo.won}`)
    

    $('#skill-Q-0').click(() => {
        if (getTurn().prefix !== PlayerOne.prefix) {
            shakeTurn()
            return
        }
        if (getTurn().mana < skills.q.mana) {
            shakeMana(PlayerOne)
            return
        }

        let amout = randomIntFromInterval(skills.q.min_damage, skills.q.max_damage)
        decreaseMana(PlayerOne, skills.q.mana)
        updateMana(PlayerOne)
        setTimeout(() => {
            decreaseHealt(PlayerTwo, amout)
            updateHealt(PlayerTwo)
            setTimeout(() => {
                switchTurn()
            }, 300);
        }, 400);

        fetchManas()
        log(`Player One gave ${amout} damage to Player Two. (Cost: ${skills.q.mana} mana)<br>`)
    })

    $('#skill-W-0').click(() => {
        if (getTurn().prefix !== PlayerOne.prefix) {
            shakeTurn()
            return
        }
        if (getTurn().mana < skills.w.mana) {
            shakeMana(PlayerOne)
            return
        }

        decreaseMana(PlayerOne, skills.w.mana)
        updateMana(PlayerOne)
        setTimeout(() => {
            increaseHealt(PlayerOne, skills.w.heal)
            updateHealt(PlayerOne)
            setTimeout(() => {
                switchTurn()
            }, 300);
        }, 400);

        fetchManas()
        log(`Player One earn ${skills.w.heal} heal. (Cost: ${skills.w.mana} mana)<br>`)
    })

    $('#skill-E-0').click(() => {
        if (getTurn().prefix !== PlayerOne.prefix) {
            shakeTurn()
            return
        }

        increaseMana(PlayerOne, skills.e.mana)
        updateMana(PlayerOne)
        setTimeout(() => {
            switchTurn()
        }, 400);

        fetchManas()
        log(`Player One earn ${skills.e.mana} mana<br>`)
    })

    $('#skill-R-0').click(() => {
        if (getTurn().prefix !== PlayerOne.prefix) {
            shakeTurn()
            return
        }
        if (getTurn().mana < skills.r.mana) {
            shakeMana(PlayerOne)
            return
        }

        let amout = randomIntFromInterval(skills.r.min_damage, skills.r.max_damage)
        decreaseMana(PlayerOne, skills.r.mana)
        updateMana(PlayerOne)
        setTimeout(() => {
            decreaseHealt(PlayerTwo, amout)
            updateHealt(PlayerTwo)
            setTimeout(() => {
                switchTurn()
            }, 300);
        }, 400);

        fetchManas()
        log(`Player One gave ${amout} damage to Player Two. (Cost: ${skills.r.mana} mana)<br>`)
    })

    $('#skill-Q-1').click(() => {
        if (getTurn().prefix !== PlayerTwo.prefix) {
            shakeTurn()
            return
        }
        if (getTurn().mana < skills.q.mana) {
            shakeMana(PlayerTwo)
            return
        }

        let amout = randomIntFromInterval(skills.q.min_damage, skills.q.max_damage)
        decreaseMana(PlayerTwo, skills.q.mana)
        updateMana(PlayerTwo)
        setTimeout(() => {
            decreaseHealt(PlayerOne, amout)
            updateHealt(PlayerOne)
            setTimeout(() => {
                switchTurn()
            }, 300);
        }, 400);

        fetchManas()
        log(`Player Two gave ${amout} damage to Player One. (Cost: ${skills.q.mana} mana)<br>`)
    })

    $('#skill-W-1').click(() => {
        if (getTurn().prefix !== PlayerTwo.prefix) {
            shakeTurn()
            return
        }
        if (getTurn().mana < skills.w.mana) {
            shakeMana(PlayerTwo)
            return
        }

        decreaseMana(PlayerTwo, skills.w.mana)
        updateMana(PlayerTwo)
        setTimeout(() => {
            increaseHealt(PlayerTwo, skills.w.heal)
            updateHealt(PlayerTwo)
            setTimeout(() => {
                switchTurn()
            }, 300);
        }, 400);

        fetchManas()
        log(`Player Two earn ${skills.w.heal} heal. (Cost: ${skills.w.mana} mana)<br>`)
    })

    $('#skill-E-1').click(() => {
        if (getTurn().prefix !== PlayerTwo.prefix) {
            shakeTurn()
            return
        }

        increaseMana(PlayerTwo, skills.e.mana)
        updateMana(PlayerTwo)
        setTimeout(() => {
            switchTurn()
        }, 400);

        fetchManas()
        log(`Player Two earn ${skills.e.mana} mana<br>`)
    })

    $('#skill-R-1').click(() => {
        if (getTurn().prefix !== PlayerTwo.prefix) {
            shakeTurn()
            return
        }
        if (getTurn().mana < skills.r.mana) {
            shakeMana(PlayerTwo)
            return
        }

        let amout = randomIntFromInterval(skills.r.min_damage, skills.r.max_damage)
        decreaseMana(PlayerTwo, skills.r.mana)
        updateMana(PlayerTwo)
        setTimeout(() => {
            decreaseHealt(PlayerOne, amout)
            updateHealt(PlayerOne)
            setTimeout(() => {
                switchTurn()
            }, 300);
        }, 400);

        fetchManas()
        log(`Player Two gave ${amout} damage to Player One. (Cost: ${skills.r.mana} mana)<br>`)
    })

    $('#reset-button').click(() => {
        PlayerOne.won = 0
        PlayerTwo.won = 0
        resetGame()
    })
})