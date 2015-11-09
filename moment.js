'use strict';

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
        date: null,

        // А здесь часовой пояс
        // Раз банк в
        timezone: +5,

        // Выводит дату в переданном формате
        // Если timezone === null, то показываем в локальном времени
        format: function (pattern) {
            var zoneDate = new Date(this.date.getTime());
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
        }
    };
};
