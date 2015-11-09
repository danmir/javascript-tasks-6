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
                resTime += ' ' + fullDays + ' день';
            }
            if (fullHours) {
                resTime += ' ' + fullHours + ' часов';
            }
            if (fullMin) {
                resTime += ' ' + fullMin + ' минут';
            }
            return 'До ограбления остался' + resTime;
        }
    };
};
