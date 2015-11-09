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
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            var utcDay = this.date.getUTCDay(); // Sunday is 0, Monday is 1, and so on.
            var rusDay = rusWeekDays[utcDay];
            var utcHours = String('0' + this.date.getHours()).slice(-2);
            var utcMin = String('0' + this.date.getMinutes()).slice(-2);
            return pattern.replace(/%DD/g, rusDay).replace(/%HH/g, utcHours.slice(-2)).replace(/%MM/g, utcMin);
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
        }
    };
};
