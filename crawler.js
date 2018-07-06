#!/usr/bin/env node

/* 
Request is used to make HTTP requests
Cheerio is used to parse and select HTML elements on the page
URL is used to parse URLs
*/
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');

const cards = [
    'Minions',
    'Archers',
    'Knight',
    'Spear_Goblins',
    'Goblins',
    'Bomber',
    'Skeletons',
    'Barbarians',
    'Minion_Horde',
    'Bats',
    'Fire_Spirits',
    'Skeleton_Barrel',
    'Royal_Giant',
    'Ice_Spirit',
    'Rascals',
    'Goblin_Gang',
    'Elite_Barbarians',
    'Mini_P.E.K.K.A.',
    'Musketeer',
    'Giant',
    'Hog_Rider',
    'Valkyrie',
    'Battle_Ram',
    'Mega_Minion',
    'Wizard',
    'Flying_Machine',
    'Three_Musketeers',
    'Ice_Golem',
    'Dart_Goblin',
    'Royal_Hogs',
    'Zappies',
    'Prince',
    'Baby_Dragon',
    'Skeleton_Army',
    'Witch',
    'Hunter',
    'Giant_Skeleton',
    'Balloon',
    'Golem',
    'P.E.K.K.A.',
    'Cannon_Cart',
    'Dark_Prince',
    'Guards',
    'Bowler',
    'Executioner',
    'Miner',
    'Lava_Hound',
    'Night_Witch',
    'Inferno_Dragon',
    'Royal_Ghost',
    'Princess',
    'Lumberjack',
    'Ice_Wizard',
    'Bandit',
    'Magic_Archer',
    'Mega_Knight',
    'Electro_Wizard',
    'Sparky',
    'Arrows',
    'Zap',
    'Giant_Snowball',
    'Fireball',
    'Rocket',
    'Heal',
    'Goblin_Barrel',
    'Barbarian_Barrel',
    'Lightning',
    'Poison',
    'Freeze',
    'Tornado',
    'Rage',
    'Clone',
    'Mirror',
    'Graveyard',
    'The_Log',
    'Cannon',
    'Mortar',
    'Tesla',
    'Goblin_Hut',
    'Tombstone',
    'Barbarian_Hut',
    'Inferno_Tower',
    'Furnace',
    'Elixir_Collector',
    'Bomb_Tower',
    'X-Bow'
]

var rootPath = path.normalize(__dirname);

var filePath = rootPath + '/clash.json';

const defaultURL = 'http://clashroyale.wikia.com/wiki/';

function isEmpty(arr) {
    for (var i in arr) {
        return true;
    } return false;
}

function getInfo(card) {
    var promise = new Promise(function (resolve, reject) {
        var url = defaultURL + card;
        request({
            url: url,
            method: 'GET'
        }, function (error, response, body) {
            if (error) {
                console.log("Error: " + error);
            }
            // if (response.statusCode === 200) {
            console.log('Lucky card: %s', card);
            // Parse the document body
            var $ = cheerio.load(body);
            // Header from the statistics table
            var name = $('#unit-statistics-table tr th').map(function (i, th) {
                return $(th).text().replace(/\n/g, '');
            }).toArray();

            // Statistics table values
            var statisticsTable = $('#unit-statistics-table tr td').map(function (i, td) {
                return $(td).text().replace(/\n/g, '');
            }).toArray();

            var cardInfo = {};
            var index = 0;
            cardInfo['name'] = card;
            cardInfo['stats'] = [];

            while (index < (statisticsTable.length - 1)) {
                for (let statsCount = 0; statsCount < (name.length - 1); statsCount++) {
                    var temp = {};
                    name.map(x => {
                        let keyName = x.toLowerCase().replace(/\s/g, '_');
                        if (statisticsTable[index] !== undefined) {
                            temp[keyName] = statisticsTable[index];
                        }
                        index += 1;
                    });
                    if (isEmpty(temp)) {
                        cardInfo.stats.push(temp);
                    }
                }
            }
            resolve(JSON.stringify(cardInfo));
        }
        );
    });
    return promise;
}

function generateInfoArr() {
    var promise = new Promise(function (resolve, reject) {
        var promises = [];
        var infoArr = [];

        cards.forEach(card => {
            promises.push(
                getInfo(card).then(x => {
                    infoArr.push(x);
                }));
        });
        Promise.all(promises)
            .then(() => {
                resolve(infoArr);
            });
    });
    return promise;
}

generateInfoArr()
    .then((infoArr) => {
        fs.writeFile(filePath, infoArr, function (err) {
            if (err) return console.log(err);
            console.log('Array generated: %s', filePath);
        });
    });