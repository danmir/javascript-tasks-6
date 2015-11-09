'use strict';

var moment = require('./moment');

var mDates = {
    ПН: '2015-11-02',
    ВТ: '2015-11-03',
    СР: '2015-11-04'
};

function converToRealTime(formatedTime) {
    // Считаем что всегда заданный формат
    // Считаем, что все это про начало ноября 2015 года
    var toParse = mDates[formatedTime.slice(0, 2)];
    toParse += 'T';
    toParse += formatedTime.slice(3, 8);
    toParse += formatedTime.slice(8, 9);
    toParse += '0' + formatedTime.slice(9, 10);
    toParse += ':00';
    //console.log(toParse);
    var parsedTime = Date.parse(toParse);
    //console.log(new Date(parsedTime));
    return new Date(parsedTime);
}

function isAvailable(date, name, gang) {
    var available = true;
    gang[name].forEach(function (timeDict) {
        var f = timeDict['from'].getTime();
        var t = timeDict['to'].getTime();
        if (f <= date && date <= t) {
            available = false;
        }
    }, this);
    return available;
}

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();

    var gang = JSON.parse(json);
    console.log(gang);
    // Делаем стандартную дату
    for (var name in gang) {
        gang[name].forEach( function (timeDict) {
            timeDict['from'] = converToRealTime(timeDict['from']);
            timeDict['to'] = converToRealTime(timeDict['to']);
        }, this);
    }
    console.log(gang);

    // Простое решение:
    // Идем по каждому дню с момента открытие по момент закрытия банка
    // На каждой ms проверям, не попали ли в часы занятости хоть кого-нибудь
    // Не попали - выставляем счетчик
    // Попали & еще не накопили 90 минут - сбрасываем счетчик
    // Попали & накопили - готов ответ

    var startTime = 0;
    var currFreeSegment = 0;
    var currFreePeopleCount = 0;
    var msDuration = minDuration * 60 * 1000;
    // Идем по каждому дню в неделе
    for (var currDay in mDates) {
        // Раз банк работает только в перделах дня - каждый день обнуляем все
        startTime = 0;
        currFreeSegment = 0;
        currFreePeopleCount = 0;
        // Конструируем текущий день
        // из дня недели и времени работы банка
        var wFrom = currDay + ' ' + workingHours['from'];
        var wTo = currDay + ' ' + workingHours['to'];
        var realWorkingHours = {
            from: converToRealTime(wFrom),
            to: converToRealTime(wTo)
        };
        // Идем по каждой минуте и смотрим, все ли свободны
        for (var cmin = realWorkingHours['from']; cmin <= realWorkingHours['to'];
             cmin.setMinutes(cmin.getMinutes() + 1)) {
            var ms = cmin.getTime();
            // console.log(cmin);
            currFreePeopleCount = 0;
            for (var person in gang) {
                if (isAvailable(ms, person, gang)) {
                    currFreePeopleCount++;
                }
            }
            if (currFreePeopleCount === 3 && !startTime) {
                startTime = ms;
                currFreeSegment++;
            } else if (currFreePeopleCount === 3 && startTime) {
                currFreeSegment++;
            } else {
                startTime = 0;
                currFreeSegment = 0;
            }

            // Проверяем, есть ли ответ
            if (currFreeSegment === minDuration) {
                console.log(new Date(cmin.getTime() - msDuration));
                if (!appropriateMoment.date) {
                    appropriateMoment.date = new Date(cmin.getTime() - msDuration);
                }
            }
        }
    }
    return appropriateMoment;
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
