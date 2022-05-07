// prio 0-49 - alarm, 50-100 - warning
export default {
  highVolt: {
    desc: 'overvoltage {{value}}/{{max}}',
    prio: 5
  }, // повыш. напряжение
  lowVolt: {
    desc: 'undervoltage {{value}}/{{min}}',
    prio: 5
  }, // пониж. напряжение
  highPower: {
    desc: 'excess power {{value}}/{{max}}',
    prio: 3
  }, // превышение мощности
  lostRH: {
    desc: 'heating relay broken',
    prio: 0
  }, // отвалилось реле обогрева
  lostRP: {
    desc: 'pump relay broken',
    prio: 0
  }, // отвалилось реле насоса
  lostPM: {
    desc: 'power meter fell off',
    prio: 0
  }, // отвалился измеритель мощности
  lost220V: {
    desc: 'loss of 220V'
  }, // пропадание 220В,
  swOnPump: {
    desc: 'power on pump'
  }, // вкл./выкл. насоса
  swOnHeater: {
    desc: 'power on heating'
  }, // вкл./выкл. обогрева
  algoState: {
    desc: 'change algo state {{value}}'
  }, // состояние алгоритма
  rebootAF: {
    desc: 'antifreeze reboot'
  }, // перезагрузка AF
  rebootFD: {
    desc: 'footerDog reboot',
    dev: 'fd'
  } // перезагрузка FD
}
