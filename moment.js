'use strict';

var mDates = {
    ПН: '2015-11-02',
    ВТ: '2015-11-03',
    СР: '2015-11-04',
    ЧТ: '2015-11-05',
    ПТ: '2015-11-06',
    СБ: '2015-11-07',
    ВС: '2015-11-08'
};

/**
 * Конвертирует время в объект Date, беря дату
 * из первой недели ноября 2015 года
 * @param formatedTime - время в формате "ВТ 03:00-5"
 * @returns {Date}
 */
function converToRealTime(formatedTime) {
    // Считаем что всегда один заданный формат
    // Считаем, что все это про начало ноября 2015 года
    var toParse = mDates[formatedTime.slice(0, 2)];
    toParse += 'T';
    toParse += formatedTime.slice(3, 8);
    toParse += formatedTime.slice(8, 9);
    toParse += '0' + formatedTime.slice(9, 10);
    toParse += ':00';
    var parsedTime = Date.parse(toParse);
    return new Date(parsedTime);
}

var rusWeekDays = {
    0: 'ВС',
    1: 'ПН',
    2: 'ВТ',
    3: 'СР',
    4: 'ЧТ',
    5: 'ПТ',
    6: 'СБ'
};

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        // Если дали строку из доп задания - сделаем Date
        _date: null,
        set date(value) {
            if (typeof value === 'string') {
                this._date = converToRealTime(value);
            } else {
                this._date = value;
            }
        },
        get date() {
            return this._date;
        },

        // А здесь часовой пояс
        // Часовой пояс по умолчанию в регионе банка
        timezone: 5,

        // Выводит дату в переданном формате
        // Если timezone === null, то показываем в локальном времени
        format: function (pattern) {
            var zoneDate = new Date(this._date.getTime());
            zoneDate.setHours(zoneDate.getHours() + this.timezone);

            var utcDay = zoneDate.getUTCDay(); // Sunday is 0, Monday is 1, and so on.
            var rusDay = rusWeekDays[utcDay];
            var utcHours = String('0' + zoneDate.getUTCHours()).slice(-2);
            var utcMin = String('0' + zoneDate.getUTCMinutes()).slice(-2);
            // Все из-за 100 символов в строке )
            var result = pattern.replace(/%DD/g, rusDay);
            return result.replace(/%HH/g, utcHours.slice(-2)).replace(/%MM/g, utcMin);
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var minDeclension = {
                0: 'минут',
                1: 'минута',
                2: 'минуты',
                3: 'минуты',
                4: 'минуты',
                5: 'минут',
                6: 'минут',
                7: 'минут',
                8: 'минут',
                9: 'минут',
                11: 'минут',
                12: 'минут',
                13: 'минут',
                14: 'минут'
            };
            var hoursDeclension = {
                0: 'часов',
                1: 'час',
                2: 'часа',
                3: 'часа',
                4: 'часа',
                5: 'часов',
                6: 'часов',
                7: 'часов',
                8: 'часов',
                9: 'часов',
                11: 'часов',
                12: 'часов',
                13: 'часов',
                14: 'часов'
            };
            var dayDeclension = {
                0: 'дней',
                1: 'день',
                2: 'дня',
                3: 'дня',
                4: 'дня',
                5: 'дней',
                6: 'дней',
                7: 'дней',
                8: 'дней',
                9: 'дней',
                11: 'дней',
                12: 'дней',
                13: 'дней',
                14: 'дней'
            };
            var declension = function (val, type) {
                var types = {
                    day: dayDeclension,
                    hour: hoursDeclension,
                    minute: minDeclension
                };
                if (Object.keys(types[type]).indexOf(val) !== -1) {
                    return types[type][val];
                }
                return types[type][val % 10];
            };
            var diffMs = this._date.getTime() - moment._date.getTime();
            var oneDay = 1000 * 60 * 60 * 24;
            var oneHour = 1000 * 60 * 60;
            var oneMin = 1000 * 60;
            var fullDays = Math.floor(diffMs / oneDay);
            var remDays = diffMs % oneDay;
            var fullHours = Math.floor(remDays / oneHour);
            var remHours = remDays % oneHour;
            var fullMin = Math.floor(remHours / oneMin);
            var remMin = remHours % oneHour;
            var resTime = '';
            if (fullDays) {
                resTime += ' ' + fullDays + ' ' + declension(fullDays, 'day');
            }
            if (fullHours) {
                resTime += ' ' + fullHours + ' ' + declension(fullHours, 'hour');
            }
            if (fullMin) {
                resTime += ' ' + fullMin + ' ' + declension(fullMin, 'minute');
            }
            var left;
            // Для мужского рода
            var left_m = function (val) {
                if (val === 1) {
                    return 'остался';
                }
                if (val === 2) {
                    return 'осталось';
                }
                return 'осталось';
            };
            // Для женского рода
            var left_f = function (val) {
                if (val === 1) {
                    return 'осталась';
                }
                if (val === 2) {
                    return 'осталось';
                }
                return 'осталось';
            };
            if (fullDays || fullHours) {
                if (fullDays) {
                    left = left_m(fullDays);
                } else {
                    left = left_m(fullHours);
                }
            } else {
                left = left_m(fullMin);
            }
            return 'До ограбления ' + left + resTime;
        }
    };
};
