window.rStorage = (function () {
    function getStorageKeyWithSettings(key, settings) {
        var keyData = [];
        if (settings) {
            if (settings.difficulty) {
                keyData.push(settings.difficulty);
            }
            if (settings.dictionary) {
                keyData.push(settings.dictionary);
            }
        }
        keyData.push(key);
        return keyData.join('.');
    }


    async function getGames(settings) {
        var response = await fetch(`${window.TOD_SERVER_ADDRESS}/get.php?difficulty=${settings.difficulty}`);
        var games = await response.json();
        if (!games) {
            return [];
        } else {
            try {
                games.sort(function(g1, g2) {
                    return g2['score'] - g1['score'];
                })
                return games;
            } catch (e) {
                return [];
            }
        }
    }

    function saveGames(gamesArray, settings) {
        var key = getStorageKeyWithSettings('games', settings);
        localStorage.setItem(key, JSON.stringify(gamesArray));
    }

    function getSettings() {
        var settings = localStorage.getItem('settings');
        try {
            settings = JSON.parse(settings);
            return typeof settings == "object" && settings !== null ? settings : {};
        } catch (e) {
            return {};
        }
    }

    function saveSetting(name, value) {
        console.log('save setting', name, value);
        var settings = getSettings();
        settings[name] = value;
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    function getSetting(name, def) {
        if (typeof def == "undefined") def = null;
        var settings = getSettings();
        return name in settings ? settings[name] : def;
    }


    return {
        addGameRecord: async function(gameData) {
            var settings = getSettings();
            gameData['time'] = Date.now();
            var games = await getGames(settings);
            games.push(gameData);
            saveGames(games, settings);
        },
        getGames: async function() {
            var settings = getSettings();
            return await getGames(settings);
        },
        getSetting: getSetting,
        saveSetting: saveSetting
    }
}());
