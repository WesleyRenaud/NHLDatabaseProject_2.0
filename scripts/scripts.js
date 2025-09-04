var seasonSelector = document.querySelector('#season_selector');
var seasonDropdownItems = document.querySelectorAll('.season_dropdown_option');
var seasonDropdownButton = document.querySelector('#season_dropdown_button');

var teamTextField = document.querySelector('#team_text_field');

var startingSeasonTextField = document.getElementById('starting_season_text_field');
var endingSeasonTextField = document.getElementById('ending_season_text_field');


if (endingSeasonTextField != null) {
    endingSeasonTextField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            var firstSeason = startingSeasonTextField.value;
            var lastSeason = endingSeasonTextField.value;
    
            if (!isValidSeason(firstSeason)) {
                alert('Error - invalid starting season');
            }
            else if (!isValidSeason(lastSeason)) {
                alert('Error - invalid ending season');
            }
            else if (!seasonsFollowCorrectOrder(firstSeason, lastSeason)) {
                alert('Error - seasons do not follow proper order');
            }
            else {
                var pageName = window.location.pathname.split('/').pop().split('.')[0];
                
                if (pageName == 'team_season_stats') {
                    getTeamStats('Regular Season', 'all', firstSeason, lastSeason);
                }
                else if (pageName == 'team_playoff_stats') {
                    getTeamStats('Playoffs', 'all', firstSeason, lastSeason);
                }
                else if (pageName == 'player_season_stats') {
                    if (teamTextField.value != '') {
                        var team = teamTextField.value;
                    }
                    else {
                        var team = 'all';
                    }

                    if (playerType == 'Skater') {       
                        var positionDropdownButton = document.querySelector('#position_dropdown_button');
                        if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
                            var position = positionDropdownButton.textContent;
                        }
                        else {
                            var position = null;
                        }

                        getSkaterStats('Regular Season', team, firstSeason, lastSeason, position);
                    }
                    else if (playerType == 'Goalie') {
                        getGoalieStats('Regular Season', team, firstSeason, lastSeason);
                    }
                    else {
                        alert("Error: You must select the player type ('Skater' or 'Goalie')");
                    }
                }
                else if (pageName == 'player_playoff_stats') {
                    if (teamTextField.value != '') {
                        var team = teamTextField.value;
                    }
                    else {
                        var team = 'all';
                    }

                    if (playerType == 'Skater') {
                        var positionDropdownButton = document.querySelector('#position_dropdown_button');
                        if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
                            var position = positionDropdownButton.textContent;
                        }
                        else {
                            var position = null;
                        }

                        getSkaterStats('Playoffs', team, firstSeason, lastSeason, position);
                    }
                    else if (playerType == 'Goalie') {
                        getGoalieStats('Playoffs', team, firstSeason, lastSeason);
                    }
                    else {
                        alert("Error: You must select the player type ('Skater' or 'Goalie')");
                    }
                }

                seasonDropdownButton.textContent = 'Select Season';
            }
        }
    });
}


function displaySeasons() {
    seasonDropdownItems.forEach(item => {
        item.style.display = 'block';
    });
    
    seasonSelector.style.display = 'block';
}

seasonDropdownItems.forEach(item => {
    item.addEventListener('click', function () {
        seasonSelector.style.display = 'none';
        seasonDropdownItems.forEach(item => {
            item.style.display = 'none';
        });

        var pageName = window.location.pathname.split('/').pop().split('.')[0];

        var season = item.textContent;
        if (pageName == 'standings') {
            displayStandings(item.textContent);
            seasonDropdownButton.textContent = item.textContent;
        }
        else if (pageName == 'team_season_stats') {
            getTeamStats('Regular Season', 'all', season, season);
            seasonDropdownButton.textContent = item.textContent;
        }
        else if (pageName == 'team_playoff_stats') {
            getTeamStats('Playoffs', 'all', season, season);
            seasonDropdownButton.textContent = item.textContent;
        }
        else if (pageName == 'player_season_stats') {
            if (teamTextField.value != '') {
                var team = teamTextField.value;
            }
            else {
                var team = 'all';
            }
            
            if (playerType == 'Skater') {
                var positionDropdownButton = document.querySelector('#position_dropdown_button');
                if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
                    var position = positionDropdownButton.textContent;
                }
                else {
                    position = null;
                }
                getSkaterStats('Regular Season', team, season, season, position);
                seasonDropdownButton.textContent = item.textContent;
            }
            else if (playerType == 'Goalie') {
                getGoalieStats('Regular Season', team, season, season);
                seasonDropdownButton.textContent = item.textContent;
            }
            else {
                alert("Error: You must select the player type ('Skater' or 'Goalie')");
            }
        }
        else if (pageName == 'player_playoff_stats') {
            if (teamTextField.value != '') {
                var team = teamTextField.value;
            }
            else {
                var team = 'all';
            }

            if (playerType == 'Skater') {
                var positionDropdownButton = document.querySelector('#position_dropdown_button');
                if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
                    var position = positionDropdownButton.textContent;
                }
                else {
                    var position = null;
                }
                getSkaterStats('Playoffs', team, season, season, position);
                seasonDropdownButton.textContent = item.textContent;
            }
            else if (playerType == 'Goalie') {
                getGoalieStats('Playoffs', team, season, season);
                seasonDropdownButton.textContent = item.textContent;
            }
            else {
                alert("Error: You must select the player type ('Skater' or 'Goalie')");
            }
        }

        startingSeasonTextField.value = '';
        endingSeasonTextField.value = '';
    });
});

if (teamTextField != null) {
    teamTextField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (teamTextField.value != '') {
                var team = teamTextField.value;
            }
            else {
                var team = 'all';
            }


            var season = seasonDropdownButton.textContent;
            if (isValidSeason(season)) {
                var pageName = window.location.pathname.split('/').pop().split('.')[0];
                if (pageName == 'player_season_stats') {
                    if (playerType == 'Skater') {
                        var positionDropdownButton = document.querySelector('#position_dropdown_button');
                        if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
                            var position = positionDropdownButton.textContent;
                        }
                        else {
                            var position = null;
                        }

                        getSkaterStats('Regular Season', team, season, season, position);
                    }
                    else if (playerType == 'Goalie') {
                        getGoalieStats('Regular Season', team, season, season);
                    }
                    else {
                        alert("Error: You must select the player type ('Skater' or 'Goalie')");
                    }
                }
                else if (pageName == 'player_playoff_stats') {
                    if (playerType == 'Skater') {
                        var positionDropdownButton = document.querySelector('#position_dropdown_button');
                        if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
                            var position = positionDropdownButton.textContent;
                        }
                        else {
                            var position = null;
                        }

                        getSkaterStats('Playoffs', team, season, season, position);
                    }
                    else if (playerType == 'Goalie') {
                        getGoalieStats('Playoffs', team, season, season);
                    }
                    else {
                        alert("Error: You must select the player type ('Skater' or 'Goalie')");
                    }
                }
            }
            else {
                var firstSeason = startingSeasonTextField.value;
                var lastSeason = endingSeasonTextField.value;

                if (!isValidSeason(firstSeason)) {
                    alert('Error - invalid starting season');
                }
                else if (!isValidSeason(lastSeason)) {
                    alert('Error - invalid ending season');
                }
                else if (!seasonsFollowCorrectOrder(firstSeason, lastSeason)) {
                    alert('Error - seasons do not follow proper order');
                }
                else {
                    var pageName = window.location.pathname.split('/').pop().split('.')[0];

                    if (pageName == 'player_season_stats') {
                        if (playerType == 'Skater') {
                            getSkaterStats('Regular Season', team, firstSeason, lastSeason, position);
                        }
                        else if (playerType == 'Goalie') {
                            getGoalieStats('Regular Season', team, firstSeason, lastSeason, position);
                        }
                        else {
                            alert("Error: You must select the player type ('Skater' or 'Goalie')");
                        }
                    }
                    else if (pageName == 'player_playoff_stats') {
                        if (playerType == 'Skater') {
                            getSkaterStats('Playoffs', team, firstSeason, lastSeason);
                        }
                        else if (playerType == 'Goalie') {
                            getGoalieStats('Playoffs', team, firstSeason, lastSeason);
                        }
                        else {
                            alert("Error: You must select the player type ('Skater' or 'Goalie')");
                        }
                    }
                    seasonDropdownButton.textContent = 'Select Season';
                }
            }
        }        
    });
}

function displayPositions() {
    var positionSelector = document.querySelector('#position_selector');
    var positionDropdownItems = document.querySelectorAll('.position_dropdown_option');
    var positionDropdownButton = document.querySelector('#position_dropdown_button');

    positionDropdownItems.forEach(item => {
        item.style.display = 'block';
    });
    
    positionSelector.style.display = 'block';

    positionDropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            positionSelector.style.display = 'none';
            positionDropdownItems.forEach(item => {
                item.style.display = 'none';
            });
    
            positionDropdownButton.textContent = item.textContent;
            var position = positionDropdownButton.textContent;

            if (teamTextField.value != '') {
                var team = teamTextField.value;
            }
            else {
                var team = 'all';
            }
    
            var season = seasonDropdownButton.textContent;
            if (isValidSeason(season)) {
                var pageName = window.location.pathname.split('/').pop().split('.')[0];
                if (pageName == 'player_season_stats') {
                    if (playerType == 'Skater') {
                        getSkaterStats('Regular Season', team, season, season, position);
                    }
                    else if (playerType == 'Goalie') {
                        getGoalieStats('Regular Season', team, season, season);
                    }
                    else {
                        alert("Error: You must select the player type ('Skater' or 'Goalie')");
                    }
                }
                else if (pageName == 'player_playoff_stats') {
                    if (playerType == 'Skater') {
                        getSkaterStats('Playoffs', team, season, season, position);
                    }
                    else if (playerType == 'Goalie') {
                        getGoalieStats('Playoffs', team, season, season);
                    }
                    else {
                        alert("Error: You must select the player type ('Skater' or 'Goalie')");
                    }
                }
            }
            else {
                var firstSeason = startingSeasonTextField.value;
                var lastSeason = endingSeasonTextField.value;
    
                if (!isValidSeason(firstSeason)) {
                    alert('Error - invalid starting season');
                }
                else if (!isValidSeason(lastSeason)) {
                    alert('Error - invalid ending season');
                }
                else if (!seasonsFollowCorrectOrder(firstSeason, lastSeason)) {
                    alert('Error - seasons do not follow proper order');
                }
                else {
                    var pageName = window.location.pathname.split('/').pop().split('.')[0];
    
                    if (pageName == 'player_season_stats') {
                        if (playerType == 'Skater') {
                            getSkaterStats('Regular Season', team, firstSeason, lastSeason, position);
                        }
                        else if (playerType == 'Goalie') {
                            getGoalieStats('Regular Season', team, season, season);
                        }
                        else {
                            alert("Error: You must select the player type ('Skater' or 'Goalie')");
                        }
                    }
                    else if (pageName == 'player_playoff_stats') {
                        if (playerType == 'Skater') {
                            getSkaterStats('Playoffs', team, firstSeason, lastSeason, position);
                        }
                        else if (playerType == 'Goalie') {
                            getGoalieStats('Playoffs', team, season, season);
                        }
                        else {
                            alert("Error: You must select the player type ('Skater' or 'Goalie')");
                        }
                    }
    
                    seasonDropdownButton.textContent = 'Select Season';
                }
            }
        });
    });
}

function isValidSeason(season) {
    if (season.length == 9 && season[4] == '-') {
        var year1 = parseInt(season.split('-')[0]);
        var year2 = parseInt(season.split('-')[1]);

        if (Number.isInteger(year1) && Number.isInteger(year2) && year1 == year2 - 1 && year1 >= 1917 && year2 <= 2025) {
            return true;
        }
        return false;
    }
    return false;
}

function seasonsFollowCorrectOrder(startingSeason, endingSeason) {
    var season1year1 = startingSeason.split('-')[0];
    var season2year1 = endingSeason.split('-')[0];

    if (season1year1 <= season2year1) {
        return true;
    }
    return false;
}


var skatersButton = document.getElementById('skaters_button');
var goaliesButton = document.getElementById('goalies_button');
var playerType = null;

if (skatersButton != null) {
    skatersButton.addEventListener('click', function () {
        playerType = 'Skater';
        
        // hover colour
        skatersButton.style.backgroundColor = '#e0e0e0';
        skatersButton.addEventListener('mouseenter', function() {
            skatersButton.style.backgroundColor = '#c0c0c0';
        });
        skatersButton.addEventListener('mouseleave', function() {
            skatersButton.style.backgroundColor = '#e0e0e0';
        });
        goaliesButton.style.backgroundColor = 'white';
        goaliesButton.addEventListener('mouseenter', function() {
            goaliesButton.style.backgroundColor = '#c0c0c0';
        });
        goaliesButton.addEventListener('mouseleave', function() {
            goaliesButton.style.backgroundColor = 'white';
        });

        addPositionButton();

        var positionDropdownButton = document.querySelector('#position_dropdown_button');
        if (positionDropdownButton != null && positionDropdownButton.textContent != 'Select Position') {
            var position = positionDropdownButton.textContent;
        }
        else {
            position = null;
        }

        if (teamTextField.value != '') {
            var team = teamTextField.value;
        }
        else {
            var team = 'all';
        }

        var season = seasonDropdownButton.textContent;
        if (isValidSeason(season)) {
            var pageName = window.location.pathname.split('/').pop().split('.')[0];
            if (pageName == 'player_season_stats') {
                getSkaterStats('Regular Season', team, season, season, position);
            }
            else {
                getSkaterStats('Playoffs', team, season, season, position);
            }
        }
        else {
            var firstSeason = startingSeasonTextField.value;
            var lastSeason = endingSeasonTextField.value;

            if (firstSeason != '' && lastSeason != '') {
                if (!isValidSeason(firstSeason)) {
                    alert('Error - invalid starting season');
                }
                else if (!isValidSeason(lastSeason)) {
                    alert('Error - invalid ending season');
                }
                else if (!seasonsFollowCorrectOrder(firstSeason, lastSeason)) {
                    alert('Error - seasons do not follow proper order');
                }
                else {
                    var pageName = window.location.pathname.split('/').pop().split('.')[0];

                    if (pageName == 'player_season_stats') {
                        getSkaterStats('Regular Season', team, firstSeason, lastSeason, position);
                    }
                    else {
                        getSkaterStats('Playoffs', team, firstSeason, lastSeason, position);
                    }

                    seasonDropdownButton.textContent = 'Select Season';
                }
            }
        }
    });

    goaliesButton.addEventListener('click', function () {
        playerType = 'Goalie';
        
        // hover colour
        goaliesButton.style.backgroundColor = '#e0e0e0';
        goaliesButton.addEventListener('mouseenter', function() {
            goaliesButton.style.backgroundColor = '#c0c0c0';
        });
        goaliesButton.addEventListener('mouseleave', function() {
            goaliesButton.style.backgroundColor = '#e0e0e0';
        });
        skatersButton.style.backgroundColor = 'white';
        skatersButton.addEventListener('mouseenter', function() {
            skatersButton.style.backgroundColor = '#c0c0c0';
        });
        skatersButton.addEventListener('mouseleave', function() {
            skatersButton.style.backgroundColor = 'white';
        });

        removePositionButton();

        if (teamTextField.value != '') {
            var team = teamTextField.value;
        }
        else {
            var team = 'all';
        }

        var season = seasonDropdownButton.textContent;
        if (isValidSeason(season)) {
            var pageName = window.location.pathname.split('/').pop().split('.')[0];
            if (pageName == 'player_season_stats') {
                getGoalieStats('Regular Season', team, season, season);
            }
            else {
                getGoalieStats('Playoffs', team, season, season);
            }
        }
        else {
            var firstSeason = startingSeasonTextField.value;
            var lastSeason = endingSeasonTextField.value;

            if (firstSeason != '' && lastSeason != '') {
                if (!isValidSeason(firstSeason)) {
                    alert('Error - invalid starting season');
                }
                else if (!isValidSeason(lastSeason)) {
                    alert('Error - invalid ending season');
                }
                else if (!seasonsFollowCorrectOrder(firstSeason, lastSeason)) {
                    alert('Error - seasons do not follow proper order');
                }
                else {
                    var pageName = window.location.pathname.split('/').pop().split('.')[0];
    
                    if (pageName == 'player_season_stats') {
                        getGoalieStats('Regular Season', team, firstSeason, lastSeason);
                    }
                    else {
                        getGoalieStats('Playoffs', team, firstSeason, lastSeason);
                    }
    
                    seasonDropdownButton.textContent = 'Select Season';
                }
            }
        }
    });
}

function addPositionButton() {
    // Remove existing dropdown if it exists
    var existingButton = document.getElementById('position_dropdown_button');
    if (existingButton) {
        var existingDropdown = existingButton.closest('.dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
    }

    var dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    var button = document.createElement('div');
    button.className = 'dropdown_button';
    button.id = 'position_dropdown_button';
    button.textContent = 'Select Position';
    button.setAttribute('onclick', 'displayPositions()');

    var content = document.createElement('div');
    content.className = 'dropdown_content';
    content.id = 'position_selector';

    var positions = ['Forward', 'Left Wing', 'Right Wing', 'Center', 'Defense'];
    positions.forEach(pos => {
        var option = document.createElement('div');
        option.className = 'position_dropdown_option';
        option.textContent = pos;
        content.appendChild(option);
    });

    dropdown.appendChild(button);
    dropdown.appendChild(content);

    var container = document.getElementById('stat_selecting_container');
    var checkbox = document.getElementById('checkbox');
    container.insertBefore(dropdown, checkbox);
}

function removePositionButton() {
    var existingButton = document.getElementById('position_dropdown_button');
    if (existingButton) {
        var existingDropdown = existingButton.closest('.dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
    }
}


var searchBar = document.getElementById('search_bar');

var sortedByStat = null;
var multiplier = -1;

var seasonTypeChangeButton = document.getElementById('season_type_change_button');
if (seasonTypeChangeButton != null) {          
    seasonTypeChangeButton.addEventListener('click', function() {
        if (seasonTypeChangeButton.textContent == 'Playoffs') {
            seasonTypeChangeButton.textContent = 'Regular Season';
            search(null, 'Playoffs');
        }
        else {
            seasonTypeChangeButton.textContent = 'Playoffs';
            search(null, 'Regular Season');
        }
    });
}

if (searchBar != null) {
    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            seasonTypeChangeButton.style.visibility = 'visible';
            seasonTypeChangeButton.textContent = 'Playoffs';

            search(null, 'Regular Season');
        }
    });
}

function search(stat, type) {
    var searchBarValue = searchBar.value;

    if (searchBarValue != '') {
        var pageName = window.location.pathname.split('/').pop().split('.')[0];
        if (pageName == 'skater_lookup') {
            $.ajax({
                type: 'POST',
                url: '/get_skater_stats',
                data: JSON.stringify({
                    name: searchBarValue,
                    stat: sortedByStat,
                    multiplier: multiplier
                }),
                contentType: 'application/json',
                success: function(response) {
                    var skaters = response.skaters;
                    if (skaters.length > 1) {
                        // TO-DO: provide system for the user to choose between the players
                    }
                    else {
                        var skater = skaters[0];

                        // get regular seasons range
                        if (sortedByStat == null) {
                            var firstRegularSeason = skater.seasons[0].season;
                            var lastRegularSeason = skater.seasons[skater.seasons.length - 1].season;
                        }
                        else {
                            var firstRegularSeason = skater.seasons[0].season;
                            var firstRegularSeasonFirstYear = getFirstYear(firstRegularSeason);
                            var lastRegularSeason = firstRegularSeason;
                            var lastRegularSeasonFirstYear = firstRegularSeasonFirstYear;

                            for (i = 1; i < skater.seasons.length; i++) {
                                var currFirstYear = getFirstYear(skater.seasons[i].season);
                                if (currFirstYear < firstRegularSeasonFirstYear) {
                                    firstRegularSeason = skater.seasons[i].season;
                                    firstRegularSeasonFirstYear = currFirstYear;
                                }
                                else if (currFirstYear > lastRegularSeasonFirstYear) {
                                    lastRegularSeason = skater.seasons[i].season;
                                    lastRegularSeasonFirstYear = currFirstYear;
                                }
                            }
                        }

                        // get playoffs seasons range
                        if (sortedByStat == null) {
                            var firstPlayoffsSeason = skater.playoffs[0].season;
                            var lastPlayoffsSeason = skater.playoffs[skater.playoffs.length - 1].season;
                        }
                        else {
                            var firstPlayoffsSeason = skater.playoffs[0].season;
                            var firstPlayoffsSeasonFirstYear = getFirstYear(firstPlayoffsSeason);
                            var lastPlayoffsSeason = firstPlayoffsSeason;
                            var lastPlayoffsSeasonFirstYear = firstPlayoffsSeasonFirstYear;

                            for (i = 1; i < skater.playoffs.length; i++) {
                                var currFirstYear = getFirstYear(skater.playoffs[i].season);
                                if (currFirstYear < firstPlayoffsSeasonFirstYear) {
                                    firstPlayoffsSeason = skater.playoffs[i].season;
                                    firstPlayoffsSeasonFirstYear = currFirstYear;
                                }
                                else if (currFirstYear > lastPlayoffsSeasonFirstYear) {
                                    lastPlayoffsSeason = skater.seasons[i].season;
                                    lastPlayoffsSeasonFirstYear = currFirstYear;
                                }
                            }
                        }

                        if (type == 'Regular Season') {
                            var response = {
                                skater_stats: skater.seasons,
                                first_season: firstRegularSeason,
                                last_season: lastRegularSeason,
                                name: searchBarValue
                            }
                        }
                        else {
                            var response = {
                                skater_stats: skater.playoffs,
                                first_season: firstPlayoffsSeason,
                                last_season: lastPlayoffsSeason,
                                name: searchBarValue
                            }
                        }

                        displaySkaterStats(response);

                        var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

                        statSortingButtons.forEach(function(button) {
                            button.addEventListener('click', function() {
                                sortedByStat = getStatNameFromAbbreviation(button.textContent);
                                
                                if (sortedByStat == stat) {
                                    multiplier *= -1;
                                }
                                else {
                                    multiplier = 1;
                                }

                                search(sortedByStat, type);
                            });
                        });
                    }

                    if (stat == null) {
                        removeSortedByStatButtonClasses();
                    }
                },
                error: function() {
                    alert('Error - skater not found');
                }
            });
        }
        else if (pageName == 'goalie_lookup') {
            $.ajax({
                type: 'POST',
                url: '/get_goalie_stats',
                data: JSON.stringify({
                    name: searchBarValue,
                    stat: sortedByStat,
                    multiplier: multiplier
                }),
                contentType: 'application/json',
                success: function(response) {
                    var goalies = response.goalies;
                    if (goalies.length > 1) {
                        // TO-DO: provide system for the user to choose between the players
                    }
                    else {
                        var goalie = goalies[0];

                        // get regular seasons range
                        if (sortedByStat == null) {
                            var firstRegularSeason = goalie.seasons[0].season;
                            var lastRegularSeason = goalie.seasons[goalie.seasons.length - 1].season;
                        }
                        else {
                            var firstRegularSeason = goalie.seasons[0].season;
                            var firstRegularSeasonFirstYear = getFirstYear(firstRegularSeason);
                            var lastRegularSeason = firstRegularSeason;
                            var lastRegularSeasonFirstYear = firstRegularSeasonFirstYear;

                            for (i = 1; i < goalie.seasons.length; i++) {
                                var currFirstYear = getFirstYear(goalie.seasons[i].season);
                                if (currFirstYear < firstRegularSeasonFirstYear) {
                                    firstRegularSeason = goalie.seasons[i].season;
                                    firstRegularSeasonFirstYear = currFirstYear;
                                }
                                else if (currFirstYear > lastRegularSeasonFirstYear) {
                                    lastRegularSeason = goalie.seasons[i].season;
                                    lastRegularSeasonFirstYear = currFirstYear;
                                }
                            }
                        }

                        // get playoffs seasons range
                        if (sortedByStat == null) {
                            var firstPlayoffsSeason = goalie.playoffs[0].season;
                            var lastPlayoffsSeason = goalie.playoffs[goalie.playoffs.length - 1].season;
                        }
                        else {
                            var firstPlayoffsSeason = goalie.playoffs[0].season;
                            var firstPlayoffsSeasonFirstYear = getFirstYear(firstPlayoffsSeason);
                            var lastPlayoffsSeason = firstPlayoffsSeason;
                            var lastPlayoffsSeasonFirstYear = firstPlayoffsSeasonFirstYear;

                            for (i = 1; i < goalie.playoffs.length; i++) {
                                var currFirstYear = getFirstYear(goalie.playoffs[i].season);
                                if (currFirstYear < firstPlayoffsSeasonFirstYear) {
                                    firstPlayoffsSeason = goalie.playoffs[i].season;
                                    firstPlayoffsSeasonFirstYear = currFirstYear;
                                }
                                else if (currFirstYear > lastPlayoffsSeasonFirstYear) {
                                    lastPlayoffsSeason = goalie.seasons[i].season;
                                    lastPlayoffsSeasonFirstYear = currFirstYear;
                                }
                            }
                        }

                        if (type == 'Regular Season') {
                            var response = {
                                goalie_stats: goalie.seasons,
                                first_season: firstRegularSeason,
                                last_season: lastRegularSeason,
                                name: searchBarValue
                            }
                        }
                        else {
                            var response = {
                                goalie_stats: goalie.playoffs,
                                first_season: firstPlayoffsSeason,
                                last_season: lastPlayoffsSeason,
                                name: searchBarValue
                            }
                        }

                        displayGoalieStats(response, type);

                        var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

                        statSortingButtons.forEach(function(button) {
                            button.addEventListener('click', function() {
                                sortedByStat = getStatNameFromAbbreviation(button.textContent);
                                
                                if (sortedByStat == stat) {
                                    multiplier *= -1;
                                }
                                else {
                                    multiplier = 1;
                                }

                                search(sortedByStat, type);
                            });
                        });
                    }

                    if (stat == null) {
                        removeSortedByStatButtonClasses();
                    }
                },
                error: function() {
                    alert('Error - goalie not found');
                }
            });
        }
        else {
            $.ajax({
                type: 'POST',
                url: '/get_team_stats',
                data: JSON.stringify({
                    team: searchBarValue,
                    stat: sortedByStat,
                    multiplier: multiplier
                }),
                contentType: 'application/json',
                success: function(response) {
                    var teamStats = response.team_stats;
                    if (teamStats.length > 0) {
                        var regularSeasons = teamStats.filter(season => (season.type === 'Regular Season'));
                        var playoffs = teamStats.filter(season => (season.type === 'Playoffs'));

                        // get seasons range
                        if (sortedByStat == null) {
                            var firstRegularSeason = regularSeasons[0].season;
                            var lastRegularSeason = regularSeasons[regularSeasons.length - 1].season;
                        }
                        else {
                            var firstRegularSeason = regularSeasons[0].season;
                            var firstRegularSeasonFirstYear = getFirstYear(firstRegularSeason);
                            var lastRegularSeason = firstRegularSeason;
                            var lastRegularSeasonFirstYear = firstRegularSeasonFirstYear;

                            for (i = 1; i < regularSeasons.length; i++) {
                                var currFirstYear = getFirstYear(regularSeasons[i].season);
                                if (currFirstYear < firstRegularSeasonFirstYear) {
                                    firstRegularSeason = regularSeasons[i].season;
                                    firstRegularSeasonFirstYear = currFirstYear;
                                }
                                else if (currFirstYear > lastRegularSeasonFirstYear) {
                                    lastRegularSeason = regularSeasons[i].season;
                                    lastRegularSeasonFirstYear = currFirstYear;
                                }
                            }
                        }

                        // get playoffs seasons range
                        if (playoffs.length > 0) {
                                if (sortedByStat == null) {
                                var firstPlayoffsSeason = playoffs[0].season;
                                var lastPlayoffsSeason = playoffs[playoffs.length - 1].season;
                            }
                            else {
                                var firstPlayoffsSeason = playoffs[0].season;
                                var firstPlayoffsSeasonFirstYear = getFirstYear(firstPlayoffsSeason);
                                var lastPlayoffsSeason = firstPlayoffsSeason;
                                var lastPlayoffsSeasonFirstYear = firstPlayoffsSeasonFirstYear;

                                for (i = 1; i < playoffs.length; i++) {
                                    var currFirstYear = getFirstYear(playoffs[i].season);
                                    if (currFirstYear < firstPlayoffsSeasonFirstYear) {
                                        firstPlayoffsSeason = playoffs[i].season;
                                        firstPlayoffsSeasonFirstYear = currFirstYear;
                                    }
                                    else if (currFirstYear > lastPlayoffsSeasonFirstYear) {
                                        lastPlayoffsSeason = playoffs[i].season;
                                        lastPlayoffsSeasonFirstYear = currFirstYear;
                                    }
                                }
                            }
                        }

                        if (type == 'Regular Season') {
                            var response = {
                                team_stats: regularSeasons,
                                first_season: firstRegularSeason,
                                last_season: lastRegularSeason,
                                team: searchBarValue 
                            }
                        }
                        else {
                            if (playoffs.length > 0) {
                                    var response = {
                                    team_stats: playoffs,
                                    first_season: firstPlayoffsSeason,
                                    last_season: lastPlayoffsSeason,
                                    team: searchBarValue 
                                }
                            }
                            else {
                                alert('Error - this team has no playoff stats');
                                seasonTypeChangeButton.textContent = 'Playoffs';
                                var response = {
                                    team_stats: regularSeasons,
                                    first_season: firstRegularSeason,
                                    last_season: lastRegularSeason,
                                    team: searchBarValue 
                                }
                                type = 'Regular Season';
                            }
                        }

                        displayTeamStats(response, type);

                        var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

                        statSortingButtons.forEach(function(button) {
                            button.addEventListener('click', function() {
                                sortedByStat = getStatNameFromAbbreviation(button.textContent);
                                
                                if (sortedByStat == stat) {
                                    multiplier *= -1;
                                }
                                else {
                                    multiplier = 1;
                                }

                                search(sortedByStat, type);
                            });
                        });

                        if (stat == null) {
                            removeSortedByStatButtonClasses();
                        }
                    }
                    else {
                        alert('Error - team not found');
                    }
                },
                error: function() {
                    alert('Error - team not found');
                }
            });
        }
    }
}

function removeSortedByStatButtonClasses() {
    var sortedByStatButtons = document.querySelectorAll('.sorted_by_stat_button');
    for (i = 0; i < sortedByStatButtons.length; i++) {
        sortedByStatButtons[i].classList.remove('sorted_by_stat_button');
    }
}


function addSkaterStats() {
    var player = JSON.parse(localStorage.getItem('player'));
    if (player == null && !areEmptyFields()) {
        var player = {
            name: document.getElementById('name').value,
            team: document.getElementById('team').value,
            number: Number(document.getElementById('number').value),
            position: document.getElementById('position').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            birthday: document.getElementById('birthday').value,
            handedness: document.getElementById('handedness').value,
            draftPosition: document.getElementById('draft_position').value,
            seasons: [],
            playoffs: [],
        };
    }
    else if  (player != null) {
        player.name = document.getElementById('name').value;
        player.team = document.getElementById('team').value;
        player.number = Number(document.getElementById('number').value);
        player.position = document.getElementById('position').value;
        player.height = document.getElementById('height').value;
        player.weight = document.getElementById('weight').value;
        player.birthday = document.getElementById('birthday').value;
        player.handedness = document.getElementById('handedness').value;
        player.draftPosition = document.getElementById('draft_position').value;
    }

    emptyFields();

    localStorage.setItem('player', JSON.stringify(player));
}

function addSkaterRegularSeason() {
    if (areEmptyFields()) {
        alert('Error: One or more fields are empty');
        return;
    }

    var invalidFields = [];

    var season = document.getElementById('season').value;
    if (!isValidSeason(season)) {
        invalidFields.push('Season');
    }

    var team = document.getElementById('team').value;

    var gamesPlayed = document.getElementById('games_played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0 || gamesPlayed >= 100) {
        invalidFields.push('Games Played');
    }

    var goals = document.getElementById('goals').value;
    goals = Number(goals);
    if (!Number.isInteger(goals) || goals < 0) {
        invalidFields.push('Goals');
    }

    var assists = document.getElementById('assists').value;
    assists = Number(assists);
    if (!Number.isInteger(assists) || assists < 0) {
        invalidFields.push('Assists');
    }

    var points = document.getElementById('points').value;
    points = Number(points);
    if (!Number.isInteger(points) || points != goals + assists) {
        invalidFields.push('Points');
    }

    var plusMinus = document.getElementById('plus_minus').value;
    if (isPlusMinusSeason(season)) {
        plusMinus = Number(plusMinus);
        if (!Number.isInteger(plusMinus)) {
            invalidFields.push('Plus-Minus');
        }
    }
    else {
        if (plusMinus != 'null') {
            invalidFields.push('Plus-Minus');
        }
    }

    var penaltyMinutes = document.getElementById('penalty_minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var powerplayGoals = document.getElementById('powerplay_goals').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        powerplayGoals = Number(powerplayGoals);
        if (!Number.isInteger(powerplayGoals) || powerplayGoals > goals) {
            invalidFields.push('Powerplay Goals');
        }
    }
    else {
        if (powerplayGoals != 'null') {
            invalidFields.push('Powerplay Goals');
        }
    }

    var powerplayPoints = document.getElementById('powerplay_points').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        powerplayPoints = Number(powerplayPoints);
        if (!Number.isInteger(powerplayPoints) || powerplayPoints > points || powerplayPoints < powerplayGoals) {
            invalidFields.push('Powerplay Points');
        }
    }
    else {
        if (powerplayPoints != 'null') {
            invalidFields.push('Powerplay Points');
        }
    }

    var shortHandedGoals = document.getElementById('shorthanded_goals').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        shortHandedGoals = Number(shortHandedGoals);
        if (!Number.isInteger(shortHandedGoals) || shortHandedGoals > goals) {
            invalidFields.push('Short-Handed Goals');
        }
    }
    else {
        if (shortHandedGoals != 'null') {
            invalidFields.push('Short-Handed Goals');
        }
    }

    var shortHandedPoints = document.getElementById('shorthanded_points').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        shortHandedPoints = Number(shortHandedPoints);
        if (!Number.isInteger(shortHandedPoints) || shortHandedPoints > points || shortHandedPoints < shortHandedGoals) {
            invalidFields.push('Short-Handed Points');
        }
    }
    else {
        if (shortHandedPoints != 'null') {
            invalidFields.push('Short-Handed Points');
        }
    }

    var timeOnIcePerGame = document.getElementById('time_on_ice_per_game').value;
    if (isTimeOnIcePerGameSeason(season)) {
        if (timeOnIcePerGame.length != 4 && timeOnIcePerGame.length != 5 || timeOnIcePerGame[timeOnIcePerGame.length - 3] != ':') {
            invalidFields.push('Time On Ice/Game');
        }
    }
    else {
        if (timeOnIcePerGame != 'null') {
            invalidFields.push('Time On Ice/Game');
        }
    }

    var gameWinningGoals = document.getElementById('game_winning_goals').value;
    gameWinningGoals = Number(gameWinningGoals);
    if (!Number.isInteger(gameWinningGoals) || gameWinningGoals > goals) {
        invalidFields.push('Game-Winning Goals');
    }

    var overtimeGoals = document.getElementById('overtime_goals').value;
    overtimeGoals = Number(overtimeGoals);
    if (!Number.isInteger(overtimeGoals) || overtimeGoals > gameWinningGoals) {
        invalidFields.push('Overtime Goals');
    }

    var shots = document.getElementById('shots').value;
    if (isShotsSeason(season)) {
        shots = Number(shots);
        if (!Number.isInteger(shots) || shots < 0) {
            invalidFields.push('Shots');
        }
    }
    else {
        if (shots != 'null') {
            invalidFields.push('Shots');
        }
    }

    var shootingPercentage = document.getElementById('shooting_percentage').value;
    if (isShootingPercentageSeason(season)) {
        shootingPercentage = Number(shootingPercentage);
        if (shootingPercentage < 0 || shootingPercentage > 100 || (shots != 0 && round(shootingPercentage, 1) != round(goals / shots * 100, 1))
                                   || shots == 0 && shootingPercentage != 0) {
            invalidFields.push('Shooting Percentage');
        }
    }
    else {
        if (shootingPercentage != 'null') {
            invalidFields.push('Shooting Percentage');
        }
    }

    var faceoffPercentage = document.getElementById('faceoff_percentage').value;
    if (isFaceoffPercentageSeason(season)) {
        if (faceoffPercentage != 'null') {
            faceoffPercentage = Number(faceoffPercentage);
            if (faceoffPercentage < 0 || faceoffPercentage > 100) {
                invalidFields.push('Faceoff Percentage');
            }
        }
        else {
            invalidFields.push('Faceoff Win Percentage');
        }
    }
    else {
        if (faceoffPercentage != 'null') {
            invalidFields.push('Faceoff Win Percentage');
        }
    }

    if (invalidFields.length > 0) {
        var errorMessage = 'Error: the following fields entered are invalid: ';
        for (var i = 0; i < invalidFields.length; i++) {
            errorMessage += "'" + invalidFields[i] + "'";

            if (i != invalidFields.length - 1) {
                errorMessage += ', ';
            }
        }
        errorMessage += '.';

        alert (errorMessage);
    }
    else {   
        var player = JSON.parse(localStorage.getItem('player'));
        player.seasons = player.seasons.filter(skaterseason => !(skaterseason.season === season && skaterseason.team === team));

        player.seasons.push({
            season: season,
            team: team,
            gamesPlayed: gamesPlayed,
            goals: goals,
            assists: assists,
            points: points,
            plusMinus: plusMinus,
            penaltyMinutes: penaltyMinutes,
            powerplayGoals: powerplayGoals,
            powerplayPoints: powerplayPoints,
            shortHandedGoals: shortHandedGoals,
            shortHandedPoints: shortHandedPoints,
            timeOnIcePerGame: timeOnIcePerGame,
            gameWinningGoals: gameWinningGoals,
            overtimeGoals: overtimeGoals,
            shots: shots,
            shootingPercentage: shootingPercentage,
            faceoffPercentage: faceoffPercentage
        });        
        localStorage.setItem('player', JSON.stringify(player));

        window.location.href = 'add_skater.html';
    }
}

function addSkaterPlayoffs() {
    if (areEmptyFields()) {
        alert('Error: One or more fields are empty');
        return;
    }

    var invalidFields = [];

    var season = document.getElementById('season').value;
    if (!isValidSeason(season)) {
        invalidFields.push('Season');
    }

    var team = document.getElementById('team').value;

    var gamesPlayed = document.getElementById('games_played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0 || gamesPlayed >= 40) {
        invalidFields.push('Games Played');
    }

    var goals = document.getElementById('goals').value;
    goals = Number(goals);
    if (!Number.isInteger(goals) || goals < 0) {
        invalidFields.push('Goals');
    }

    var assists = document.getElementById('assists').value;
    assists = Number(assists);
    if (!Number.isInteger(assists) || assists < 0) {
        invalidFields.push('Assists');
    }

    var points = document.getElementById('points').value;
    points = Number(points);
    if (!Number.isInteger(points) || points != goals + assists) {
        invalidFields.push('Points');
    }

    var plusMinus = document.getElementById('plus_minus').value;
    if (isPlusMinusSeason(season)) {
        plusMinus = Number(plusMinus);
        if (!Number.isInteger(plusMinus)) {
            invalidFields.push('Plus-Minus');
        }
    }
    else {
        if (plusMinus != 'null') {
            invalidFields.push('Plus-Minus');
        }
    }

    var penaltyMinutes = document.getElementById('penalty_minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var powerplayGoals = document.getElementById('powerplay_goals').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        powerplayGoals = Number(powerplayGoals);
        if (!Number.isInteger(powerplayGoals) || powerplayGoals > goals) {
            invalidFields.push('Powerplay Goals');
        }
    }
    else {
        if (powerplayGoals != 'null') {
            invalidFields.push('Powerplay Goals');
        }
    }

    var powerplayPoints = document.getElementById('powerplay_points').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        powerplayPoints = Number(powerplayPoints);
        if (!Number.isInteger(powerplayPoints) || powerplayPoints > points || powerplayPoints < powerplayGoals) {
            invalidFields.push('Powerplay Points');
        }
    }
    else {
        if (powerplayPoints != 'null') {
            invalidFields.push('Powerplay Points');
        }
    }

    var shortHandedGoals = document.getElementById('shorthanded_goals').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        shortHandedGoals = Number(shortHandedGoals);
        if (!Number.isInteger(shortHandedGoals) || shortHandedGoals > goals) {
            invalidFields.push('Short-Handed Goals');
        }
    }
    else {
        if (shortHandedGoals != 'null') {
            invalidFields.push('Short-Handed Goals');
        }
    }

    var shortHandedPoints = document.getElementById('shorthanded_points').value;
    if (isSkaterSpecialTeamsStatsSeason(season)) {
        shortHandedPoints = Number(shortHandedPoints);
        if (!Number.isInteger(shortHandedPoints) || shortHandedPoints > points || shortHandedPoints < shortHandedGoals) {
            invalidFields.push('Short-Handed Points');
        }
    }
    else {
        if (shortHandedPoints != 'null') {
            invalidFields.push('Short-Handed Points');
        }
    }

    var timeOnIcePerGame = document.getElementById('time_on_ice_per_game').value;
    if (isTimeOnIcePerGameSeason(season)) {
        if (timeOnIcePerGame.length != 4 && timeOnIcePerGame.length != 5 || timeOnIcePerGame[timeOnIcePerGame.length - 3] != ':') {
            invalidFields.push('Time On Ice/Game');
        }
    }
    else {
        if (timeOnIcePerGame != 'null') {
            invalidFields.push('Time On Ice/Game');
        }
    }

    var gameWinningGoals = document.getElementById('game_winning_goals').value;
    gameWinningGoals = Number(gameWinningGoals);
    if (!Number.isInteger(gameWinningGoals) || gameWinningGoals > goals) {
        invalidFields.push('Game-Winning Goals');
    }

    var overtimeGoals = document.getElementById('overtime_goals').value;
    overtimeGoals = Number(overtimeGoals);
    if (!Number.isInteger(overtimeGoals) || overtimeGoals > gameWinningGoals) {
        invalidFields.push('Overtime Goals');
    }

    var shots = document.getElementById('shots').value;
    if (isShotsSeason(season)) {
        shots = Number(shots);
        if (!Number.isInteger(shots) || shots < 0) {
            invalidFields.push('Shots');
        }
    }
    else {
        if (shots != 'null') {
            invalidFields.push('Shots');
        }
    }

    var shootingPercentage = document.getElementById('shooting_percentage').value;
    if (isShootingPercentageSeason(season)) {
        shootingPercentage = Number(shootingPercentage);
        if (shootingPercentage < 0 || shootingPercentage > 100 || (shots != 0 && round(shootingPercentage, 1) != round(goals / shots * 100, 1))
            || shots == 0 && shootingPercentage != 0) {
            invalidFields.push('Shooting Percentage');
        }
    }
    else {
        if (shootingPercentage != 'null') {
            invalidFields.push('Shooting Percentage');
        }
    }

    var faceoffPercentage = document.getElementById('faceoff_percentage').value;
    if (isFaceoffPercentageSeason(season)) {
        if (faceoffPercentage != 'null') {
            faceoffPercentage = Number(faceoffPercentage);
            if (faceoffPercentage < 0 || faceoffPercentage > 100) {
                invalidFields.push('Faceoff Percentage');
            }
        }
        else {
            invalidFields.push('Faceoff Win Percentage');
        }
    }
    else {
        if (faceoffPercentage != 'null') {
            invalidFields.push('Faceoff Win Percentage');
        }
    }

    if (invalidFields.length > 0) {
        var errorMessage = 'Error: the following fields entered are invalid: ';
        for (var i = 0; i < invalidFields.length; i++) {
            errorMessage += "'" + invalidFields[i] + "'";

            if (i != invalidFields.length - 1) {
                errorMessage += ', ';
            }
        }
        errorMessage += '.';

        alert (errorMessage);
    }
    else {   
        var player = JSON.parse(localStorage.getItem('player'));
        player.playoffs = player.playoffs.filter(skaterseason => !(skaterseason.season === season && skaterseason.team === team));

        player.playoffs.push({
            season: season,
            team: team,
            gamesPlayed: gamesPlayed,
            goals: goals,
            assists: assists,
            points: points,
            plusMinus: plusMinus,
            penaltyMinutes: penaltyMinutes,
            powerplayGoals: powerplayGoals,
            powerplayPoints: powerplayPoints,
            shortHandedGoals: shortHandedGoals,
            shortHandedPoints: shortHandedPoints,
            timeOnIcePerGame: timeOnIcePerGame,
            gameWinningGoals: gameWinningGoals,
            overtimeGoals: overtimeGoals,
            shots: shots,
            shootingPercentage: shootingPercentage,
            faceoffPercentage: faceoffPercentage
        });        
        localStorage.setItem('player', JSON.stringify(player));

        window.location.href = 'add_skater.html';
    }
}

window.onload = function() {
    var pageName = window.location.pathname.split('/').pop().split('.')[0];

    if (pageName == 'add_skater') {
        restoreSkaterStats();
    }
    else if (pageName == 'add_skater_regular_season') {
        var season = JSON.parse(localStorage.getItem('season'));
        var team = JSON.parse(localStorage.getItem('team'));
        if (season != null && team != null) {
            restoreSkaterSeasonStats('Regular Season', season, team);

            season = null;
            team = null;
            localStorage.setItem('season', JSON.stringify(season));
            localStorage.setItem('team', JSON.stringify(team));
        }    
    }
    else if (pageName == 'add_skater_playoffs') {
        var season = JSON.parse(localStorage.getItem('season'));
        var team = JSON.parse(localStorage.getItem('team'));
        if (season != null && team != null) {
            restoreSkaterSeasonStats('Playoffs', season, team);

            season = null;
            team = null;
            localStorage.setItem('season', JSON.stringify(season));
            localStorage.setItem('team', JSON.stringify(team));
        }    
    }
    else if (pageName == 'add_goalie') {
        restoreGoalieStats();
    }
    else if (pageName == 'add_goalie_regular_season') {
        var season = JSON.parse(localStorage.getItem('season'));
        var team = JSON.parse(localStorage.getItem('team'));
        if (season != null && team != null) {
            restoreGoalieSeasonStats('Regular Season', season, team);

            season = null;
            team = null;
            localStorage.setItem('season', JSON.stringify(season));
            localStorage.setItem('team', JSON.stringify(team));
        }    
    }
    else if (pageName == 'add_goalie_playoffs') {
        var season = JSON.parse(localStorage.getItem('season'));
        var team = JSON.parse(localStorage.getItem('team'));
        if (season != null && team != null) {
            restoreGoalieSeasonStats('Playoffs', season, team);

            season = null;
            team = null;
            localStorage.setItem('season', JSON.stringify(season));
            localStorage.setItem('team', JSON.stringify(team));
        }    
    }
    else {
        var player = null;
        localStorage.setItem('player', JSON.stringify(player));
    }
}

function restoreSkaterStats() {
    var player = JSON.parse(localStorage.getItem('player'));

    if (player != null) {
        document.getElementById('name').value = player.name;
        document.getElementById('team').value = player.team;
        document.getElementById('number').value = player.number;
        document.getElementById('position').value = player.position;
        document.getElementById('height').value = player.height;
        document.getElementById('weight').value = player.weight;
        document.getElementById('birthday').value = player.birthday;
        document.getElementById('handedness').value = player.handedness;
        document.getElementById('draft_position').value = player.draftPosition;

        addEditSeasonButton('Skater');
    }
}

function restoreSkaterSeasonStats(type, season, team) {
    var player = JSON.parse(localStorage.getItem('player'));

    if (type == 'Regular Season') {
        for (i = 0; i < player.seasons.length; i++) {
            if (player.seasons[i].season == season && player.seasons[i].team == team) {
                var skaterSeason = player.seasons[i];
            }
        }
    }
    else {
        for (i = 0; i < player.playoffs.length; i++) {
            if (player.playoffs[i].season == season && player.playoffs[i].team == team) {
                var skaterSeason = player.playoffs[i];
            }
        }
    }

    if (type == 'Regular Season') {
        player.playoffs = player.playoffs.filter(skaterseason => !(skaterseason.season === season && skaterseason.team === team));
    }
    else {
        player.playoffs = player.playoffs.filter(skaterseason => !(skaterseason.season === season && skaterseason.team === team));
    }

    document.getElementById('season').value = season;
    document.getElementById('team').value = skaterSeason.team;
    document.getElementById('games_played').value = skaterSeason.gamesPlayed;
    document.getElementById('goals').value = skaterSeason.goals;
    document.getElementById('assists').value = skaterSeason.assists;
    document.getElementById('points').value = skaterSeason.points;
    document.getElementById('plus_minus').value = skaterSeason.plusMinus;
    document.getElementById('penalty_minutes').value = skaterSeason.penaltyMinutes;
    document.getElementById('powerplay_goals').value = skaterSeason.powerplayGoals;
    document.getElementById('powerplay_points').value = skaterSeason.powerplayPoints;
    document.getElementById('shorthanded_goals').value = skaterSeason.shortHandedGoals;
    document.getElementById('shorthanded_points').value = skaterSeason.shortHandedPoints;
    document.getElementById('time_on_ice_per_game').value = skaterSeason.timeOnIcePerGame;
    document.getElementById('game_winning_goals').value = skaterSeason.gameWinningGoals;
    document.getElementById('overtime_goals').value = skaterSeason.overtimeGoals;
    document.getElementById('shots').value = skaterSeason.shots;
    document.getElementById('shooting_percentage').value = skaterSeason.shootingPercentage;
    document.getElementById('faceoff_percentage').value = skaterSeason.faceoffPercentage;
}

function finishSkater() {
    var player = JSON.parse(localStorage.getItem('player'));
    addSkaterStats();

    if (player == null || (player.seasons.length == 0 && player.playoffs.length == 0)) {
        alert('Error: There are no stats for the player');
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/add_skater',
            data: JSON.stringify(player),
            contentType: 'application/json',
            success: function() {
                emptyFields();
            }
        });
        
        emptyFields();
        var modal = document.getElementById('team_select_modal');
        if (modal) {
            modal.remove();
        }
                
        player = null;
        localStorage.setItem('player', JSON.stringify(player));
    }
}


function addGoalieStats() {
    var player = JSON.parse(localStorage.getItem('player'));
    if (player == null && !areEmptyFields()) {
        var player = {
            name: document.getElementById('name').value,
            team: document.getElementById('team').value,
            number: Number(document.getElementById('number').value),
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            birthday: document.getElementById('birthday').value,
            handedness: document.getElementById('handedness').value,
            draftPosition: document.getElementById('draft_position').value,
            seasons: [],
            playoffs: [],
        };
    }
    else if  (player != null) {
        player.name = document.getElementById('name').value;
        player.team = document.getElementById('team').value;
        player.number = Number(document.getElementById('number').value);
        player.height = document.getElementById('height').value;
        player.weight = document.getElementById('weight').value;
        player.birthday = document.getElementById('birthday').value;
        player.handedness = document.getElementById('handedness').value;
        player.draftPosition = document.getElementById('draft_position').value;
    }
    emptyFields();
    localStorage.setItem('player', JSON.stringify(player));
}

function addGoalieRegularSeason() {
    if (areEmptyFields()) {
        alert('Error: One or more fields are empty');
        return;
    }

    var invalidFields = [];

    var season = document.getElementById('season').value;
    if (!isValidSeason(season)) {
        invalidFields.push('Season');
    }

    var team = document.getElementById('team').value;

    var gamesPlayed = document.getElementById('games_played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0 || gamesPlayed >= 100) {
        invalidFields.push('Games Played');
    }

    var gamesStarted = document.getElementById('games_started').value;
    gamesStarted = Number(gamesStarted);
    if (!Number.isInteger(gamesStarted) || gamesStarted < 0 || gamesStarted > gamesPlayed) {
        invalidFields.push('Games Started');
    }

    var wins = document.getElementById('wins').value;
    wins = Number(wins);
    if (!Number.isInteger(wins) || wins < 0 || wins > gamesPlayed) {
        invalidFields.push('Wins');
    }

    var losses = document.getElementById('losses').value;
    losses = Number(losses);
    if (!Number.isInteger(losses) || losses < 0 || losses > gamesPlayed) {
        invalidFields.push('Losses');
    }

    var ties = document.getElementById('ties').value;
    var overtimeLosses = document.getElementById('overtime_losses').value;
    if (isOvertimeLossesSeason('Regular Season', season)) {
        if (ties != 'null' && ties != 'Null') {
            invalidFields.push('Ties');
        }
        overtimeLosses = Number(overtimeLosses);
        if (!Number.isInteger(overtimeLosses) || overtimeLosses < 0 || overtimeLosses > gamesPlayed) {
            invalidFields.push('Overtime Losses');
        }
    }
    else {
        if (overtimeLosses != 'null' && overtimeLosses != 'Null') {
            invalidFields.push('Overtime Losses');
        }
        ties = Number(ties);
        if (!Number.isInteger(ties) || ties < 0 || ties > gamesPlayed) {
            invalidFields.push('Ties');
        }
    }

    var shotsAgainst = document.getElementById('shots_against').value;
    if (isShotsAgainstSeason(season)) {
        shotsAgainst = Number(shotsAgainst);
        if (!Number.isInteger(shotsAgainst) || shotsAgainst < 0) {
            invalidFields.push('Shots Against');
        }
    }
    else {
        if (shotsAgainst != 'null') {
            invalidFields.push('Shots Against');
        }
    }

    var goalsAgainstAverage = document.getElementById('goals_against_average').value;
    goalsAgainstAverage = Number(goalsAgainstAverage);
    if (goalsAgainstAverage < 0) {
        invalidFields.push('Goals Against Average');
    }

    var savePercentage = document.getElementById('save_percentage').value;
    if (isSavePercentageSeason(season)) {
        savePercentage = Number(savePercentage);
        if (savePercentage < 0 || savePercentage > 1) {
            invalidFields.push('Save Percentage');
        }
    }
    else {
        if (savePercentage != 'null') {
            invalidFields.push('Save Percentage');
        }
    }

    var shutouts = document.getElementById('shutouts').value;
    shutouts = Number(shutouts);
    if (!Number.isInteger(shutouts) || shutouts > gamesPlayed) {
        invalidFields.push('Shutouts');
    }

    var goals = document.getElementById('goals').value;
    goals = Number(goals);
    if (!Number.isInteger(goals) || goals < 0) {
        invalidFields.push('Goals');
    }

    var assists = document.getElementById('assists').value;
    assists = Number(assists);
    if (!Number.isInteger(assists) || assists < 0) {
        invalidFields.push('Assists');
    }

    var penaltyMinutes = document.getElementById('penalty_minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var timeOnIce = document.getElementById('time_on_ice').value;

    if (invalidFields.length > 0) {
        var errorMessage = 'Error: the following fields entered are invalid: ';
        for (var i = 0; i < invalidFields.length; i++) {
            errorMessage += "'" + invalidFields[i] + "'";

            if (i != invalidFields.length - 1) {
                errorMessage += ', ';
            }
        }
        errorMessage += '.';

        alert (errorMessage);
    }
    else {
        var player = JSON.parse(localStorage.getItem('player'));
        player.seasons = player.seasons.filter(goalieSeason => !(goalieSeason.season === season && goalieSeason.team === team));
        
        player.seasons.push({
            season: season,
            team: team,
            gamesPlayed: gamesPlayed,
            gamesStarted: gamesStarted,
            wins: wins,
            losses: losses,
            ties: ties,
            overtimeLosses: overtimeLosses,
            shotsAgainst: shotsAgainst,
            goalsAgainstAverage: goalsAgainstAverage,
            savePercentage: savePercentage,
            shutouts: shutouts,
            goals: goals,
            assists,
            penaltyMinutes: penaltyMinutes,
            timeOnIce: timeOnIce,
        });

        localStorage.setItem('player', JSON.stringify(player));

        window.location.href = 'add_goalie.html';
    }
}

function addGoaliePlayoffs() {
    if (areEmptyFields()) {
        alert('Error: One or more fields are empty');
        return;
    }

    var invalidFields = [];

    var season = document.getElementById('season').value;
    if (!isValidSeason(season)) {
        invalidFields.push('Season');
    }

    var team = document.getElementById('team').value;

    var gamesPlayed = document.getElementById('games_played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0 || gamesPlayed >= 50) {
        invalidFields.push('Games Played');
    }

    var gamesStarted = document.getElementById('games_started').value;
    gamesStarted = Number(gamesStarted);
    if (!Number.isInteger(gamesStarted) || gamesStarted < 0 || gamesStarted > gamesPlayed) {
        invalidFields.push('Games Started');
    }

    var wins = document.getElementById('wins').value;
    wins = Number(wins);
    if (!Number.isInteger(wins) || wins < 0 || wins > gamesPlayed) {
        invalidFields.push('Wins');
    }

    var losses = document.getElementById('losses').value;
    losses = Number(losses);
    if (!Number.isInteger(losses) || losses < 0 || losses > gamesPlayed) {
        invalidFields.push('Losses');
    }

    var ties = document.getElementById('ties').value;
    if (isGoalieTiesInPlayoffsSeason(season)) {
        ties = Number(ties);
        if (!Number.isInteger(ties) || ties < 0 || ties > gamesPlayed) {
            invalidFields.push('Ties');
        }
    }
    else {
        if (ties != 'null') {
            invalidFields.push('Ties');
        }
    }

    var overtimeLosses = document.getElementById('overtime_losses').value;
    if (isOvertimeLossesSeason('Playoffs', season)) {
        overtimeLosses = Number(overtimeLosses);
        if (!Number.isInteger(overtimeLosses) || overtimeLosses < 0 || overtimeLosses > gamesPlayed) {
            invalidFields.push('Overtime Losses');
        }
    }
    else {
        if (overtimeLosses != 'null') {
            invalidFields.push('Overtime Losess');
        }
    }

    var shotsAgainst = document.getElementById('shots_against').value;
    if (isShotsAgainstSeason(season)) {
        shotsAgainst = Number(shotsAgainst);
        if (!Number.isInteger(shotsAgainst) || shotsAgainst < 0) {
            invalidFields.push('Shots Against');
        }
    }
    else {
        if (shotsAgainst != 'null') {
            invalidFields.push('Shots Against');
        }
    }

    var goalsAgainstAverage = document.getElementById('goals_against_average').value;
    goalsAgainstAverage = Number(goalsAgainstAverage);
    if (goalsAgainstAverage < 0) {
        invalidFields.push('Goals Against Average');
    }

    var savePercentage = document.getElementById('save_percentage').value;
    if (isSavePercentageSeason(season)) {
        savePercentage = Number(savePercentage);
        if (savePercentage < 0 || savePercentage > 1) {
            invalidFields.push('Save Percentage');
        }
    }
    else {
        if (savePercentage != 'null') {
            invalidFields.push('Save Percentage');
        }
    }

    var shutouts = document.getElementById('shutouts').value;
    shutouts = Number(shutouts);
    if (!Number.isInteger(shutouts) || shutouts > gamesPlayed) {
        invalidFields.push('Shutouts');
    }

    var goals = document.getElementById('goals').value;
    goals = Number(goals);
    if (!Number.isInteger(goals) || goals < 0) {
        invalidFields.push('Goals');
    }

    var assists = document.getElementById('assists').value;
    assists = Number(assists);
    if (!Number.isInteger(assists) || assists < 0) {
        invalidFields.push('Assists');
    }

    var penaltyMinutes = document.getElementById('penalty_minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var timeOnIce = document.getElementById('time_on_ice').value;

    if (invalidFields.length > 0) {
        var errorMessage = 'Error: the following fields entered are invalid: ';
        for (var i = 0; i < invalidFields.length; i++) {
            errorMessage += "'" + invalidFields[i] + "'";

            if (i != invalidFields.length - 1) {
                errorMessage += ', ';
            }
        }
        errorMessage += '.';

        alert (errorMessage);
    }
    else {
        var player = JSON.parse(localStorage.getItem('player'));
        player.playoffs = player.playoffs.filter(skaterseason => !(skaterseason.season === season && skaterseason.team === team));

        emptyFields();
        
        player.playoffs.push({
            season: season,
            team: team,
            gamesPlayed: gamesPlayed,
            gamesStarted: gamesStarted,
            wins: wins,
            losses: losses,
            ties: ties,
            overtimeLosses: overtimeLosses,
            shotsAgainst: shotsAgainst,
            goalsAgainstAverage: goalsAgainstAverage,
            savePercentage: savePercentage,
            shutouts: shutouts,
            goals: goals,
            assists,
            penaltyMinutes: penaltyMinutes,
            timeOnIce: timeOnIce,
        });

        localStorage.setItem('player', JSON.stringify(player));

        window.location.href = 'add_goalie.html';
    }
}

function restoreGoalieStats() {
    var player = JSON.parse(localStorage.getItem('player'));

    if (player != null) {
        document.getElementById('name').value = player.name;
        document.getElementById('team').value = player.team;
        document.getElementById('number').value = player.number;
        document.getElementById('height').value = player.height;
        document.getElementById('weight').value = player.weight;
        document.getElementById('birthday').value = player.birthday;
        document.getElementById('handedness').value = player.handedness;
        document.getElementById('draft_position').value = player.draftPosition;

        addEditSeasonButton('Goalie');
    }
}

function restoreGoalieSeasonStats(type, season, team) {
    var player = JSON.parse(localStorage.getItem('player'));

    if (type == 'Regular Season') {
        for (i = 0; i < player.seasons.length; i++) {
            if (player.seasons[i].season == season && player.seasons[i].team == team) {
                var goalieSeason = player.seasons[i];
            }
        }
    }
    else {
        for (i = 0; i < player.playoffs.length; i++) {
            if (player.playoffs[i].season == season && player.playoffs[i].team == team) {
                var goalieSeason = player.playoffs[i];
            }
        }
    }

    if (type == 'Regular Season') {
        player.playoffs = player.playoffs.filter(goalieSeason => !(goalieSeason.season === season && goalieSeason.team === team));
    }
    else {
        player.playoffs = player.playoffs.filter(goalieSeason => !(goalieSeason.season === season && goalieSeason.team === team));
    }

    document.getElementById('season').value = season;
    document.getElementById('team').value = goalieSeason.team;
    document.getElementById('games_played').value = goalieSeason.gamesPlayed;
    document.getElementById('games_started').value = goalieSeason.gamesStarted;
    document.getElementById('wins').value = goalieSeason.wins;
    document.getElementById('losses').value = goalieSeason.losses;
    document.getElementById('ties').value = goalieSeason.ties;
    if (goalieSeason.overtimeLosses == null){
        document.getElementById('overtime_losses').value = 'null';
    }
    else {
        document.getElementById('overtime_losses').value = goalieSeason.overtimeLosses;
    }
    document.getElementById('shots_against').value = goalieSeason.shotsAgainst;
    document.getElementById('goals_against_average').value = goalieSeason.goalsAgainstAverage;
    document.getElementById('save_percentage').value = goalieSeason.savePercentage;
    document.getElementById('shutouts').value = goalieSeason.shutouts;
    document.getElementById('goals').value = goalieSeason.goals;
    document.getElementById('assists').value = goalieSeason.assists;
    document.getElementById('penalty_minutes').value = goalieSeason.penaltyMinutes;
    document.getElementById('time_on_ice').value = goalieSeason.timeOnIce;
}

function finishGoalie() {
    addGoalieStats();

    var player = JSON.parse(localStorage.getItem('player'));

    if (player == null || (player.seasons.length == 0 && player.playoffs.length == 0)) {
        alert('Error: There are no stats for the player');
    }
    else {      
        $.ajax({
            type: 'POST',
            url: '/add_goalie',
            data: JSON.stringify(player),
            contentType: 'application/json',
            success: function() {
                emptyFields();
            }
        });
        
        emptyFields();
        var modal = document.getElementById('team_select_modal');
        if (modal) {
            modal.remove();
        }
                
        player = null;
        localStorage.setItem('player', JSON.stringify(player));
    }
}

if (document.getElementById('faceoff_win_percentage') != null) {
    document.getElementById('faceoff_win_percentage').addEventListener('keydown', function(event) {
        if (event.key === 'Tab' && event.key != 'Shift') {
            event.preventDefault();
            document.getElementsByClassName('confirm_button')[0].focus();
        }
    });
}

function finishTeam(type) {
    if (areEmptyFields()) {
        alert('Error: One or more fields are empty');
        return;
    }

    var invalidFields = [];

    var season = document.getElementById('season').value;
    if (!isValidSeason(season)) {
        invalidFields.push('Season');
    }

    var gamesPlayed = document.getElementById('games_played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0) {
        invalidFields.push('Games Played');
    }

    var wins = document.getElementById('wins').value;
    wins = Number(wins);
    if (!Number.isInteger(wins) || wins < 0 || wins > gamesPlayed) {
        invalidFields.push('Wins');
    }

    var losses = document.getElementById('losses').value;
    losses = Number(losses);
    if (type == 'Regular Season') {
        if (!Number.isInteger(losses) || losses < 0 || losses > gamesPlayed - wins) {
            invalidFields.push('Losses');
        }
    }
    else {
        if (!Number.isInteger(losses)) {
            invalidFields.push('Losses');
        }
        else {
            if (season != '2019-2020' && !isTiesInPlayoffsSeason(season) && losses != gamesPlayed - wins) {
                invalidFields.push('Losses');
            }
        }
    }
    
    var ties = document.getElementById('ties').value;
    var overtimeLosses = document.getElementById('overtime_losses').value;
    if (type == 'Regular Season') {
        if (isOvertimeLossesSeason(type, season)) {
            overtimeLosses = Number(overtimeLosses);
    
            if (!Number.isInteger(overtimeLosses) || overtimeLosses < 0 || overtimeLosses != gamesPlayed - wins - losses) {
                invalidFields.push('Overtime losses');
            }

            if (ties != 'null') {
                invalidFields.push('Ties');
            }
        }
        else if (isTiesAndOvertimeLossesSeason(season)) {
            ties = Number(ties);
            overtimeLosses = Number(overtimeLosses);
    
            if (!Number.isInteger(ties) || ties < 0) {
                invalidFields.push('Ties');
            }
            else if (!Number.isInteger(overtimeLosses) || overtimeLosses < 0) {
                invalidFields.push('Overtime losses');
            }
        }
        else {
            ties = Number(ties);
            if (!Number.isInteger(ties) || ties < 0 || ties != gamesPlayed - wins - losses) {
                invalidFields.push('Ties');
            }

            if (overtimeLosses != 'null') {
                invalidFields.push(overtimeLosses);
            }
        }
    }
    else {
        if (isTiesInPlayoffsSeason(season)) {
            var tiesNumber = Number(ties);

            if (tiesNumber != gamesPlayed - wins - losses) {
                invalidFields.push('Ties');
            }
            else {
                ties = Number(ties);
            }
        }
        else {
            if (ties != 'null') {
                invalidFields.push('Ties');
            }
        }

        if (season == '2019-2020') {
            var overtimeLossesNumber = Number(overtimeLosses);

            if (overtimeLosses != 'null' && overtimeLossesNumber != gamesPlayed - wins - losses) {
                invalidFields.push('Overtime Losses');
            }
            else {
                overtimeLosses = Number(overtimeLosses);
            }
        }
        else {
            if (overtimeLosses != 'null') {
                invalidFields.push('Overtime Losses');
            }
        }
    }

    var points = document.getElementById('points').value;
    points = Number(points);
    if (!Number.isInteger(points)) {
        invalidFields.push('Points');
    }

    if (type == 'Regular Season') {
        if (isOvertimeLossesSeason(type, season)) {
            if (points != 2 * wins + overtimeLosses) {
                invalidFields.push('Points');
            }
        }
        else if (isTiesAndOvertimeLossesSeason(season)) {
            if (points != 2 * wins + ties + overtimeLosses) {
                invalidFields.push('Points');
            }
        }
        else {
            if (points != 2 * wins + ties) {
                invalidFields.push('Points');
            }
        }
    }
    else {
        if (season == '2019-2020') {
            if (points != 2 * wins && points != 2 * wins + overtimeLosses) {
                invalidFields.push('Points');
            }
        }
        else if (isTiesInPlayoffsSeason(season)) {
            if (points != 2 * wins + ties) {
                invalidFields.push('Points');
            }
        }
        else {
            if (points != 2 * wins) {
                invalidFields.push('Points');
            }
        }
    }

    var pointsPercentage = document.getElementById('points_percentage').value;
    pointsPercentage = Number(pointsPercentage);
    if (pointsPercentage < 0 || pointsPercentage > 1 || round(pointsPercentage, 3) != round((points / (2 * gamesPlayed)), 3)) {
        invalidFields.push('Points Percentage');
    }

    var regulationWins = document.getElementById('regulation_wins').value;
    regulationWins = Number(regulationWins);
    if (!Number.isInteger(regulationWins) || regulationWins < 0 || regulationWins > 82 || regulationWins > wins) {
        invalidFields.push('Regulation Wins');
    }

    var regulationAndOvertimeWins = document.getElementById('regulation_and_overtime_wins').value;
    regulationAndOvertimeWins = Number(regulationAndOvertimeWins);
    if (!Number.isInteger(regulationAndOvertimeWins) || regulationAndOvertimeWins < 0 || regulationAndOvertimeWins > 82
        || regulationAndOvertimeWins < regulationWins || regulationAndOvertimeWins > wins) {
        invalidFields.push('Regulation/Overtime Wins');
    }

    var goalsFor = document.getElementById('goals_for').value;
    goalsFor = Number(goalsFor);
    if (!Number.isInteger(goalsFor) || goalsFor < 0) {
        invalidFields.push('Goals For');
    }

    var goalsAgainst = document.getElementById('goals_against').value;
    goalsAgainst = Number(goalsAgainst);
    if (!Number.isInteger(goalsAgainst) || goalsAgainst < 0) {
        invalidFields.push('Goals Against');
    }

    var goalDifferential = document.getElementById('goal_differential').value;
    goalDifferential = Number(goalDifferential);
    if (!Number.isInteger(goalDifferential) || goalDifferential != goalsFor - goalsAgainst) {
        invalidFields.push('Goal Differential');
    }

    var home = document.getElementById('home').value;
    var away = document.getElementById('away').value;
    if (type == 'Regular Season') {
        if (!invalidFields.includes('Wins') && !invalidFields.includes('losses') && !invalidFields.includes('Overtime losses')) {
            if (!isValidHomeAndAway(season, home, away, wins, losses, ties, overtimeLosses)) {
                invalidFields.push('Home');
                invalidFields.push('Away');
            }
        }
    }
    else {
        if (home != 'null') {
            invalidFields.push('Home');
        }

        if (away != 'null') {
            invalidFields.push('Away');
        }
    }

    var shootoutWins = document.getElementById('shootout_wins').value;
    if (type == 'Regular Season' && isOvertimeLossesSeason(type, season)) {
        shootoutWins = Number(shootoutWins);

        if (!Number.isInteger(shootoutWins) || shootoutWins != wins - regulationAndOvertimeWins) {
            invalidFields.push('Shootout Wins');
        }
    }
    else {
        if (shootoutWins != 'null') {
            invalidFields.push('Shootout Wins');
        }
    }
    
    var shootout = document.getElementById('shootout').value;
    if (type == 'Regular Season' && isOvertimeLossesSeason(type, season)) {
        if (!isValidShootout(shootout, shootoutWins, overtimeLosses)) {
            invalidFields.push('Shootout');
        }
    }
    else {
        if (shootout != 'null') {
            invalidFields.push('Shootout');
        }
    }

    var last10 = document.getElementById('last_10').value;
    if (type == 'Regular Season') {
        if (!isValidLast10(season, last10)) {
            invalidFields.push('Last 10');
        }
    }
    else {
        if (last10 != 'null') {
            invalidFields.push('Last 10');
        }
    }

    var streak = document.getElementById('streak').value;
    if (type == 'Regular Season') {
        if (!isValidStreak(season, streak)) {
            invalidFields.push('streak');
        }
    }
    else {
        if (streak != 'null') {
            invalidFields.push('Streak');
        }
    }

    var goalsForPerGame = document.getElementById('goals_for_per_game').value;
    goalsForPerGame = Number(goalsForPerGame);
    if (round(goalsForPerGame, 2) != round((goalsFor / gamesPlayed), 2)) {
        invalidFields.push('Goals For/Game');
    }

    var goalsAgainstPerGame = document.getElementById('goals_against_per_game').value;
    goalsAgainstPerGame = Number(goalsAgainstPerGame);
    if (round(goalsAgainstPerGame, 2) != round((goalsAgainst / gamesPlayed), 2)) {
        invalidFields.push('Goals Against/Game');
    }

    var powerplayPercentage = document.getElementById('powerplay_percentage').value;
    if (isTeamSpecialTeamsSeason(season)) {
        powerplayPercentage = Number(powerplayPercentage);
        if (powerplayPercentage < 0 || powerplayPercentage > 100) {
            invalidFields.push('Powerplay Percentage');
        }
    }
    else {
        if (powerplayPercentage != 'null') {
            invalidFields.push('Powerplay Percentage');
        }
    }

    var penaltyKillPercentage = document.getElementById('penalty_kill_percentage').value;
    if (isTeamSpecialTeamsSeason(season)) {
        penaltyKillPercentage = Number(penaltyKillPercentage);
        if (penaltyKillPercentage < 0 || penaltyKillPercentage > 100) {
            invalidFields.push('Penalty Kill Percentage');
        }
    }
    else {
        if (penaltyKillPercentage != 'null') {
            invalidFields.push('Penalty Kill Percentage');
        }
    }

    var netPowerplayPercentage = document.getElementById('net_powerplay_percentage').value;
    if (isTeamSpecialTeamsSeason(season)) {
        netPowerplayPercentage = Number(netPowerplayPercentage);
        if (netPowerplayPercentage > powerplayPercentage) {
            invalidFields.push('Net Powerplay Percentage');
        }
    }
    else {
        if (netPowerplayPercentage != 'null') {
            invalidFields.push('Net Powerplay Percentage');
        }
    }

    var netPenaltyKillPercentage = document.getElementById('net_penalty_kill_percentage').value;
    if (isTeamSpecialTeamsSeason(season)) {
        netPenaltyKillPercentage = Number(netPenaltyKillPercentage);
        if (netPenaltyKillPercentage < penaltyKillPercentage) {
            invalidFields.push('Net Penalty Kill Percentage');
        }
    }
    else {
        if (netPenaltyKillPercentage != 'null') {
            invalidFields.push('Net Penalty Kill Percentage');
        }
    }

    var faceoffWinPercentage = document.getElementById('faceoff_win_percentage').value;
    if (isFaceoffWinPercentageSeason(season)) {
        faceoffWinPercentage = Number(faceoffWinPercentage);
        if (faceoffWinPercentage < 0 || faceoffWinPercentage > 100) {
            invalidFields.push('Faceoff Win Percentage');
        }
    }
    else {
        if (faceoffWinPercentage != 'null') {
            invalidFields.push('Faceoff Win Percentage');
        }
    }

    if (invalidFields.length > 0) {
        var errorMessage = 'Error: the following fields entered are invalid: ';
        for (var i = 0; i < invalidFields.length; i++) {
            errorMessage += "'" + invalidFields[i] + "'";

            if (i != invalidFields.length - 1) {
                errorMessage += ', ';
            }
        }
        errorMessage += '.';

        alert (errorMessage);
    }
    else {
        var team = {
            type: type,
            season: season,
            city: document.getElementById('city').value.trim(),
            name: document.getElementById('name').value.trim(),
            gamesPlayed: gamesPlayed,
            wins: wins,
            losses: losses,
            ties: ties,
            overtimeLosses: overtimeLosses,
            points: points,
            pointsPercentage: pointsPercentage,
            regulationWins: regulationWins,
            regulationAndOvertimeWins: regulationAndOvertimeWins,
            goalsFor: goalsFor,
            goalsAgainst: goalsAgainst,
            goalDifferential: goalDifferential,
            home: home,
            away: away,
            shootout: shootout,
            last10: last10,
            streak: streak,
            shootoutWins: shootoutWins,
            goalsForPerGame: goalsForPerGame,
            goalsAgainstPerGame: goalsAgainstPerGame,
            powerplayPercentage: powerplayPercentage,
            penaltyKillPercentage: penaltyKillPercentage,
            netPowerplayPercentage: netPowerplayPercentage,
            netPenaltyKillPercentage: netPenaltyKillPercentage,
            faceoffWinPercentage: faceoffWinPercentage
        }

        $.ajax({
            type: 'POST',
            url: '/add_team',
            data: JSON.stringify(team),
            contentType: 'application/json',
            success: function() {
                emptyFields();
            }
        });
    }
}

function areEmptyFields() {
    var statFields = document.querySelectorAll('.stat_field');

    for (var field of statFields) {
        var input = field.querySelector('input');
        if (input) {
            var fieldValue = input.value;

            if (fieldValue === '') {
                return true;
            }
        }
    }

    return false;
}

function isValidHomeAndAway(season, home, away, wins, losses, ties, overtimeLosses) {
    if (typeof home != 'string' || typeof away != 'string') {
        return false
    }

    home = home.split('-');
    away = away.split('-');

    if (isOvertimeLossesSeason('Regular Season', season)) {
        if (home.length != 3 || away.length != 3) {
            return false
        }

        var homeWins = Number(home[0]);
        var homelosses = Number(home[1]);
        var homeOvertimelosses = Number(home[2]);
        var awayWins = Number(away[0]);
        var awaylosses = Number(away[1]);
        var awayOvertimelosses = Number(away[2]);

        if (!Number.isInteger(homeWins) || !Number.isInteger(homelosses) || !Number.isInteger(homeOvertimelosses) || 
            !Number.isInteger(awayWins) || !Number.isInteger(awaylosses) || !Number.isInteger(awayOvertimelosses)) {
            return false
        }

        if (homeWins + homelosses + homeOvertimelosses + awayWins + awaylosses + awayOvertimelosses == wins + losses + overtimeLosses &&
            homeWins + awayWins == wins && homelosses + awaylosses == losses && homeOvertimelosses + awayOvertimelosses == overtimeLosses) {
            return true;
        }
    }

    else if (isTiesAndOvertimeLossesSeason(season)) {
        if (home.length != 4 || away.length != 4) {
            return false;
        }

        var homeWins = Number(home[0]);
        var homelosses = Number(home[1]);
        var homeTies = Number(home[2]);
        var homeOvertimelosses = Number(home[3]);
        var awayWins = Number(away[0]);
        var awaylosses = Number(away[1]);
        var awayTies = Number(away[2]);
        var awayOvertimelosses = Number(away[3]);

        if (!Number.isInteger(homeWins) || !Number.isInteger(homelosses) || !Number.isInteger(homeTies) || 
            !Number.isInteger(homeOvertimelosses) || !Number.isInteger(awayWins) || !Number.isInteger(awaylosses) || 
            !Number.isInteger(awayTies) || !Number.isInteger(awayOvertimelosses)) {
            return false;
        }

        if (homeWins + homelosses + homeTies + homeOvertimelosses + awayWins + awaylosses + awayTies + awayOvertimelosses == wins + losses + 
            ties + overtimeLosses && homeWins + awayWins == wins && homelosses + awaylosses == losses && homeTies + awayTies == ties && 
            homeOvertimelosses + awayOvertimelosses == overtimeLosses) {
            return true;
        }
    }

    else {
        if (home.length != 3 || away.length != 3) {
            return false
        }

        var homeWins = Number(home[0]);
        var homelosses = Number(home[1]);
        var homeTies = Number(home[2]);
        var awayWins = Number(away[0]);
        var awaylosses = Number(away[1]);
        var awayTies = Number(away[2]);

        if (!Number.isInteger(homeWins) || !Number.isInteger(homelosses) || !Number.isInteger(homeTies) || !Number.isInteger(awayWins) ||
            !Number.isInteger(awaylosses) || !Number.isInteger(awayTies)) {
            return false
        }

        if (homeWins + homelosses + homeTies + awayWins + awaylosses + awayTies == wins + losses + ties && homeWins + awayWins == wins 
            && homelosses + awaylosses == losses && homeTies + awayTies == ties) {
            return true;
        }
    }

    return false;
}

function isValidShootout(shootout, shootoutWins, overtimeLosses) {
    if (typeof shootout != 'string') {
        return false;
    }

    shootout = shootout.split('-');

    if (shootout.length != 2) {
        return false;
    }

    var winsFromShootout = Number(shootout[0]);
    var shootoutlosses = Number(shootout[1]);

    if (!Number.isInteger(winsFromShootout) || !Number.isInteger(shootoutlosses)) {
        return false;
    }

    if (winsFromShootout == shootoutWins && shootoutlosses <= overtimeLosses && shootoutlosses >= 0) {
        return true;
    }
    return false;
}

function isValidLast10(season, last10) {
    if (typeof last10 != 'string') {
        return false;
    }

    last10 = last10.split('-');

    if (isOvertimeLossesSeason('Regular Season', season)) {
        if (last10.length != 3) {
            return false;
        }
    
        last10Wins = Number(last10[0]);
        last10Losses = Number(last10[1]);
        last10OvertimeLosses = Number(last10[2]);
    
        if (!Number.isInteger(last10Wins) || !Number.isInteger(last10Losses) || !Number.isInteger(last10OvertimeLosses)) {
            return false;
        }
    
        if (last10Wins >= 0 && last10Losses >= 0 && last10OvertimeLosses >= 0 && last10Wins + last10Losses + last10OvertimeLosses == 10) {
            return true;
        }
    }

    else if (isTiesAndOvertimeLossesSeason(season)) {
        if (last10.length != 4) {
            return false;
        }

        last10Wins = Number(last10[0]);
        last10Losses = Number(last10[1]);
        last10Ties = Number(last10[2]);
        last10OvertimeLosses = Number(last10[3]);
    
        if (!Number.isInteger(last10Wins) || !Number.isInteger(last10Losses) || !Number.isInteger(last10Ties) || 
            !Number.isInteger(last10OvertimeLosses)) {
            return false;
        }
    
        if (last10Wins >= 0 && last10Losses >= 0 && last10Ties >= 0 && last10OvertimeLosses >= 0 && last10Wins + last10Losses + last10Ties +
            last10OvertimeLosses == 10) {
            return true;
        }
    }

    else {
        if (last10.length != 3) {
            return false;
        }
    
        last10Wins = Number(last10[0]);
        last10Losses = Number(last10[1]);
        last10Ties = Number(last10[2]);
    
        if (!Number.isInteger(last10Wins) || !Number.isInteger(last10Losses) || !Number.isInteger(last10Ties)) {
            return false;
        }
    
        if (last10Wins >= 0 && last10Losses >= 0 && last10Ties >= 0 && last10Wins + last10Losses + last10Ties == 10 ||
            (season == '1917-1918' && last10Wins == 1 && last10Losses == 5 && last10Ties == 0)) {
            return true;
        }
    }
    
    return false;
}

function isValidStreak(season, streak) {
    if (typeof streak != 'string') {
        return false;
    }

    if (isOvertimeLossesSeason('Regular Season', season)) {
        var regex = /^(W|L|OT)[1-9]\d*$/;
        return regex.test(streak);
    }

    else if (isTiesAndOvertimeLossesSeason(season)) {
        var regex = /^(W|L|T|OT|)[1-9]\d*$/;
        return regex.test(streak);
    }

    else {
        var regex = /^(W|L|T)[1-9]\d*$/;
        return regex.test(streak);
    }
}

function emptyFields() {
    var statFields = document.querySelectorAll('.stat_field');

    for (var field of statFields) {
        var input = field.querySelector('input');
        if (input) {
            input.value = '';
        }
    }
}


var statViewingContainer = document.querySelector('#stat_viewing_container');

function displayStandings(season) {
    sortedByStat = null;
    multiplier = -1;

    if (isWildcardSeason(season)) {
        $.ajax({
            type: 'POST',
            url: '/get_wildcard_standings',
            data: JSON.stringify({
                season: season
            }),
            contentType: 'application/json',
            success: function(response) {
                displayWildcardStandings(response, season);                
            },
            error: function() {
                alert('Error - data entry is not complete yet');

            }
        });
    }

    else if (isDivisionSeason(season)) {
        $.ajax({
            type: 'POST',
            url: '/get_division_standings',
            data: JSON.stringify({
                season: season
            }),
            contentType: 'application/json',
            success: function(response) {
                sortedByStat = null;
                multiplier = -1;
                resetStatsScreen();
                displayDivisionStandings(response, season);
                
                var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

                statSortingButtons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        var stat = getStatNameFromAbbreviation(button.textContent);
                        multiplier *= -1; // toggles between 1 and -1
                        getDivisionStandingsByStat(season, stat, multiplier);
                    });
                });
            },
            error: function() {
                seasonDropdownButton.textContent = 'Select Season';
                alert('Error - data entry is not complete yet');
            }
        });
    }

    else {
        $.ajax({
            type: 'POST',
            url: '/get_league_standings',
            data: JSON.stringify({
                type: 'Regular Season',
                season: season
            }),
            contentType: 'application/json',
            success: function(response) {
                sortedByStat = null;
                multiplier = -1;
                resetStatsScreen();
                displayLeagueStandings(response, season);
                
                var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

                statSortingButtons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        var stat = getStatNameFromAbbreviation(button.textContent);
                        multiplier *= -1; // toggles between 1 and -1
                        getLeagueStandingsByStat(season, stat, multiplier);
                    });
                });
            },
            error: function() {
                alert('Error - data entry is not complete yet');
            }
        });
    }
}

var wildcardButton = document.querySelector('#wildcard_button');
var divisionButton = document.querySelector('#division_button');
var conferenceButton = document.querySelector('#conference_button');
var leagueButton = document.querySelector('#league_button');

var statViewButtonContainer = document.querySelector('#stat_view_button_container');

if (wildcardButton != null) {
    wildcardButton.addEventListener('click', function () {
        var season = seasonDropdownButton.textContent;
    
        if (isWildcardSeason(season)) {
            $.ajax({
                type: 'POST',
                url: '/get_wildcard_standings',
                data: JSON.stringify({
                    season: season
                }),
                contentType: 'application/json',
                success: function(response) {
                    sortedByStat = null;
                    multiplier = -1;
                    resetStatsScreen();
                    displayWildcardStandings(response, season);
                }
            });
        }
        else {
            alert('Wildcard standings are not valid for this season');
        }
    });
}

if (divisionButton != null) {
    divisionButton.addEventListener('click', function () {
        var season = seasonDropdownButton.textContent;
    
        if (isDivisionSeason(season)) {
            $.ajax({
                type: 'POST',
                url: '/get_division_standings',
                data: JSON.stringify({
                    season: season
                }),
                contentType: 'application/json',
                success: function(response) {
                    sortedByStat = null;
                    multiplier = -1;
                    resetStatsScreen();
                    displayDivisionStandings(response, season);
                 
                    var statSortingButtons = document.querySelectorAll('.stat_sorting_button');
    
                    statSortingButtons.forEach(function(button) {
                        button.addEventListener('click', function() {
                            var stat = getStatNameFromAbbreviation(button.textContent);
                            multiplier *= -1; // toggles between 1 and -1
                            getDivisionStandingsByStat(season, stat, multiplier);
                        });
                    });
                }
            });
        }
        else {
            alert('Divisional standings are not valid for this season');
        }
    });
}

if (conferenceButton != null) {
    conferenceButton.addEventListener('click', function () {
        var season = seasonDropdownButton.textContent;
    
        if (isConferenceSeason(season)) {
            $.ajax({
                type: 'POST',
                url: '/get_conference_standings',
                data: JSON.stringify({
                    season: season
                }),
                contentType: 'application/json',
                success: function(response) {
                    sortedByStat = null;
                    multiplier = -1;
                    resetStatsScreen();
                    displayConferenceStandings(response, season);
                 
                    var statSortingButtons = document.querySelectorAll('.stat_sorting_button');
    
                    statSortingButtons.forEach(function(button) {
                        button.addEventListener('click', function() {
                            var stat = getStatNameFromAbbreviation(button.textContent);
                            multiplier *= -1; // toggles between 1 and -1
                            getConferenceStandingsByStat(season, stat, multiplier);
                        });
                    });
                }
            });
        }
        else {
            alert('Divisional standings are not valid for this season');
        }
    });
}

if (leagueButton != null) {
    leagueButton.addEventListener('click', function () {
        var season = seasonDropdownButton.textContent;
    
        $.ajax({
            type: 'POST',
            url: '/get_league_standings',
            data: JSON.stringify({
                type: 'Regular Season',
                season: season
            }),
            contentType: 'application/json',
            success: function(response) {
                sortedByStat = null;
                multiplier = -1;
                resetStatsScreen();
                displayLeagueStandings(response, season);
                
                var statSortingButtons = document.querySelectorAll('.stat_sorting_button');
    
                statSortingButtons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        var stat = getStatNameFromAbbreviation(button.textContent);
                        multiplier *= -1; // toggles between 1 and -1
                        getLeagueStandingsByStat(season, stat, multiplier);
                    });
                });
            }
        });
    });
}

function displayWildcardStandings(response, season) {
    resetStatsScreen();
    updateStandingsButtons(season);

    var standings = response.wildcard_standings;
    
    var hasHeaders = false;
    var teamIndex = 0;

    for (var i = 0; i < standings.length; i++) {                    
        if (typeof standings[i] == 'string' && standings[i].includes('Conference')) {
            hasHeaders = false;

            var conference = standings[i].split('Conference:')[1].trim();

            var conferenceHeader = document.createElement('h2');
            conferenceHeader.textContent = conference;
            conferenceHeader.classList.add('header');

            statViewingContainer.appendChild(conferenceHeader);
        }
        else if (typeof standings[i] == 'string' && standings[i].includes('Division')) {
            hasHeaders = false;
            
            var division = standings[i].split('Division:')[1].trim();

            var divisionHeader = document.createElement('h3');
            divisionHeader.textContent = division;
            divisionHeader.classList.add('header');

            statViewingContainer.appendChild(divisionHeader);
        }
        else if (typeof standings[i] == 'string' && standings[i].includes('Wildcard')) {
            hasHeaders = false;
            
            var wildcardHeader = document.createElement('h3');
            wildcardHeader.textContent = 'Wildcard';
            wildcardHeader.classList.add('header');

            statViewingContainer.appendChild(wildcardHeader);
        }
        else {
            if (!hasHeaders) {
                var rank  = 1;

                hasHeaders = true;
        
                var fields = [];
        
                // Add the fields to the table
                fields.push('rank_and_team');
                for (var key in standings[i]) {
                    if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                        if (key !== 'city' && key !== 'name') {
                            fields.push(key);
                        }
                    }
                }
        
                var table = document.createElement('table');
                table.classList.add('standings_table');
                if (isOvertimeLossesSeason('Regular Season', season)) {
                    table.classList.add('standings_table_overtime_losses_season');
                }
                else if (isTiesAndOvertimeLossesSeason(season)) {
                    table.classList.add('standings_table_ties_and_overtime_losses_season');
                }
                else {
                    table.classList.add('standings_table_ties_season');
                }
                var thead = document.createElement('thead');
        
                var headerRow = document.createElement('tr');
                fields.forEach(function(field) {
                    var th = document.createElement('th');
                
                    if (field === 'rank_and_team') {
                        th.classList.add('name_field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat_sorting_button');
                        
                        th.textContent = '';
                        th.appendChild(button);
                    }
                    
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);
        
                statViewingContainer.appendChild(table);                   
            }
        
            var tables = statViewingContainer.querySelectorAll('table');
            var table = tables[tables.length - 1];
            var tbody = table.querySelector('tbody');
            
            if (!tbody) {
                tbody = document.createElement('tbody');
                table.appendChild(tbody);
            }
            
            // add the team to the table
            var dataRow = document.createElement('tr');
            fields.forEach(function(field) {
                var td = document.createElement('td');
                if (field === 'rank_and_team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings_rank_and_team');

                    // check if the team has a clinching marker
                    var clinchingMarker = document.createElement('span');
                    if (response.clinching_markers[fullTeamName] != null) {
                        clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                        clinchingMarker.classList.add('clinching_marker');
                    }
                    else {
                        clinchingMarker.classList.add('clinching_marker_placeholder');
                    } 

                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('standings_table_logo_container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[teamIndex];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team_logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name_field');
                }
                else if (field === 'points_percentage') {
                    td.textContent = round(parseFloat(standings[i][field]), 3).toFixed(3);
                }
                else {
                    td.textContent = standings[i][field];
                }
                dataRow.appendChild(td);
            });
            tbody.appendChild(dataRow);

            teamIndex++;
            rank++;
        }                 
    }
}

function displayDivisionStandings(response, season) {
    resetStatsScreen();
    updateStandingsButtons(season);

    var standings = response.division_standings;
    
    var hasHeaders = false;
    var teamIndex = 0;

    for (var i = 0; i < standings.length; i++) {                    
        if (typeof standings[i] == 'string' && standings[i].includes('Conference')) {
            hasHeaders = false;

            var conference = standings[i].split('Conference:')[1].trim();

            var conferenceHeader = document.createElement('h2');
            conferenceHeader.textContent = conference;
            conferenceHeader.classList.add('header');

            statViewingContainer.appendChild(conferenceHeader);
        }
        else if (typeof standings[i] == 'string' && standings[i].includes('Division')) {
            hasHeaders = false;
            
            var division = standings[i].split('Division:')[1].trim();

            var divisionHeader = document.createElement('h3');
            divisionHeader.textContent = division;
            divisionHeader.classList.add('header');

            statViewingContainer.appendChild(divisionHeader);
        }
        else {
            if (!hasHeaders) {
                var rank  = 1;

                hasHeaders = true;
        
                var fields = [];
        
                // Add the fields to the table
                fields.push('rank_and_team');
                for (var key in standings[i]) {
                    if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                        if (key !== 'city' && key !== 'name') {
                            fields.push(key);
                        }
                        
                    }
                }
        
                var table = document.createElement('table');
                table.classList.add('standings_table');
                if (isOvertimeLossesSeason('Regular Season', season)) {
                    table.classList.add('standings_table_overtime_losses_season');
                }
                else if (isTiesAndOvertimeLossesSeason(season)) {
                    table.classList.add('standings_table_ties_and_overtime_losses_season');
                }
                else {
                    table.classList.add('standings_table_ties_season');
                }
                var thead = document.createElement('thead');
        
                var headerRow = document.createElement('tr');
                fields.forEach(function(field) {
                    var th = document.createElement('th');
                
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted_by_stat_button');
                    }

                    if (field === 'rank_and_team') {
                        th.classList.add('name_field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat_sorting_button');
                        
                        th.textContent = '';
                        th.appendChild(button);
                    }
                    
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);
        
                statViewingContainer.appendChild(table);                   
            }
        
            var tables = statViewingContainer.querySelectorAll('table');
            var table = tables[tables.length - 1];
            var tbody = table.querySelector('tbody');
            
            if (!tbody) {
                tbody = document.createElement('tbody');
                table.appendChild(tbody);
            }
            
            // add the team to the table
            var dataRow = document.createElement('tr');
            fields.forEach(function(field) {
                var td = document.createElement('td');

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted_by_stat_button');
                }

                if (field === 'rank_and_team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings_rank_and_team');

                    // check if the team has a clinching marker
                    var clinchingMarker = document.createElement('span');
                    if (response.clinching_markers[fullTeamName] != null) {
                        clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                        clinchingMarker.classList.add('clinching_marker');
                    }
                    else {
                        clinchingMarker.classList.add('clinching_marker_placeholder');
                    } 

                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('standings_table_logo_container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[teamIndex];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team_logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name_field');
                }
                else if (field === 'points_percentage') {
                    td.textContent = round(parseFloat(standings[i][field]), 3).toFixed(3);
                }
                else {
                    td.textContent = standings[i][field] !== null ? standings[i][field] : '';
                }
                dataRow.appendChild(td);
            });
            tbody.appendChild(dataRow);

            teamIndex++;
            rank++;
        }                 
    }
}

function displayConferenceStandings(response, season) {
    resetStatsScreen();
    updateStandingsButtons(season);

    var standings = response.conference_standings;
    
    var hasHeaders = false;
    var teamIndex = 0;

    for (var i = 0; i < standings.length; i++) {                    
        if (typeof standings[i] == 'string' && standings[i].includes('Conference')) {
            hasHeaders = false;

            var conference = standings[i].split('Conference:')[1].trim();

            var conferenceHeader = document.createElement('h2');
            conferenceHeader.textContent = conference;
            conferenceHeader.classList.add('header');

            statViewingContainer.appendChild(conferenceHeader);
        }
        else {
            if (!hasHeaders) {
                var rank  = 1;

                hasHeaders = true;
        
                var fields = [];
        
                // Add the fields to the table
                fields.push('rank_and_team');
                for (var key in standings[i]) {
                    if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                        if (key !== 'city' && key !== 'name') {
                            fields.push(key);
                        }
                        
                    }
                }
        
                var table = document.createElement('table');
                table.classList.add('standings_table');
                if (isOvertimeLossesSeason('Regular Season', season)) {
                    table.classList.add('standings_table_overtime_losses_season');
                }
                else if (isTiesAndOvertimeLossesSeason(season)) {
                    table.classList.add('standings_table_ties_and_overtime_losses_season');
                }
                else {
                    table.classList.add('standings_table_ties_season');
                }
                var thead = document.createElement('thead');
        
                var headerRow = document.createElement('tr');
                fields.forEach(function(field) {
                    var th = document.createElement('th');
                
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted_by_stat_button');
                    }

                    if (field === 'rank_and_team') {
                        th.classList.add('name_field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat_sorting_button');
                        
                        th.textContent = '';
                        th.appendChild(button);
                    }
                    
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);
        
                statViewingContainer.appendChild(table);                   
            }
        
            var tables = statViewingContainer.querySelectorAll('table');
            var table = tables[tables.length - 1];
            var tbody = table.querySelector('tbody');
            
            if (!tbody) {
                tbody = document.createElement('tbody');
                table.appendChild(tbody);
            }
            
            // add the team to the table
            var dataRow = document.createElement('tr');
            fields.forEach(function(field) {
                var td = document.createElement('td');

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted_by_stat_button');
                }

                if (field === 'rank_and_team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings_rank_and_team');

                    // check if the team has a clinching marker
                    var clinchingMarker = document.createElement('span');
                    if (response.clinching_markers[fullTeamName] != null) {
                        clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                        clinchingMarker.classList.add('clinching_marker');
                    }
                    else {
                        clinchingMarker.classList.add('clinching_marker_placeholder');
                    } 

                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('standings_table_logo_container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[teamIndex];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team_logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name_field');
                }
                else if (field === 'points_percentage') {
                    td.textContent = round(parseFloat(standings[i][field]), 3).toFixed(3);
                }
                else {
                    td.textContent = standings[i][field] !== null ? standings[i][field] : '';
                }
                dataRow.appendChild(td);
            });
            tbody.appendChild(dataRow);

            teamIndex++;
            rank++;
        }                 
    }
}

function displayLeagueStandings(response, season) {
    resetStatsScreen();
    updateStandingsButtons(season);

    var standings = response.league_standings;
    
    var hasHeaders = false;
    var teamIndex = 0;

    var leagueHeader = document.createElement('h2');
    leagueHeader.textContent = 'League';
    leagueHeader.classList.add('header');

    statViewingContainer.appendChild(leagueHeader);

    for (var i = 0; i < standings.length; i++) {                    
        if (!hasHeaders) {
            var rank  = 1;

            hasHeaders = true;
    
            var fields = [];
    
            // Add the fields to the table
            fields.push('rank_and_team');
            for (var key in standings[i]) {
                if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                    if (key !== 'city' && key !== 'name') {
                        fields.push(key);
                    }
                    
                }
            }
    
            var table = document.createElement('table');
            table.classList.add('standings_table');
            if (isOvertimeLossesSeason('Regular Season', season)) {
                table.classList.add('standings_table_overtime_losses_season');
            }
            else if (isTiesAndOvertimeLossesSeason(season)) {
                table.classList.add('standings_table_ties_and_overtime_losses_season');
            }
            else {
                table.classList.add('standings_table_ties_season');
            }
            var thead = document.createElement('thead');
    
            var headerRow = document.createElement('tr');
            fields.forEach(function(field) {
                var th = document.createElement('th');
            
                if (sortedByStat != null && field === sortedByStat) {
                    th.classList.add('sorted_by_stat_button');
                }

                if (field === 'rank_and_team') {
                    th.classList.add('name_field');
                    th.textContent = getFieldAbbreviation(field);
                } 
                else {
                    var button = document.createElement('button');
                    button.textContent = getFieldAbbreviation(field);
                    button.classList.add('stat_sorting_button');
                    
                    th.textContent = '';
                    th.appendChild(button);
                }
                
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);
    
            statViewingContainer.appendChild(table);                   
        }
    
        var tables = statViewingContainer.querySelectorAll('table');
        var table = tables[tables.length - 1];
        var tbody = table.querySelector('tbody');
        
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }
        
        // add the team to the table
        var dataRow = document.createElement('tr');
        fields.forEach(function(field) {
            var td = document.createElement('td');

            if (sortedByStat != null && field === sortedByStat) {
                td.classList.add('sorted_by_stat_button');
            }

            if (field === 'rank_and_team') {
                var fullTeamName = standings[i].city + ' ' + standings[i].name

                var rankSpan = document.createElement('span');
                rankSpan.innerHTML = rank + '. ';

                var textSpan = document.createElement('span');
                textSpan.textContent = fullTeamName;
                textSpan.classList.add('standings_rank_and_team');

                // check if the team has a clinching marker
                var clinchingMarker = document.createElement('span');
                if (response.clinching_markers[fullTeamName] != null) {
                    clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                    clinchingMarker.classList.add('clinching_marker');
                }
                else {
                    clinchingMarker.classList.add('clinching_marker_placeholder');
                } 

                var teamLogoContainer = document.createElement('span');
                teamLogoContainer.classList.add('standings_table_logo_container');

                var teamLogo = document.createElement('img');
                teamLogo.src = response.logos[teamIndex];
                teamLogo.alt = fullTeamName + ' Logo';
                teamLogo.classList.add('team_logo');
                
                teamLogoContainer.appendChild(teamLogo);                                

                td.appendChild(rankSpan);
                td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                td.appendChild(teamLogoContainer);
                td.appendChild(textSpan);

                td.classList.add('name_field');
            }
            else if (field === 'points_percentage') {
                td.textContent = round(parseFloat(standings[i][field]), 3).toFixed(3);
            }
            else {
                td.textContent = standings[i][field] !== null ? standings[i][field] : '';
            }
            dataRow.appendChild(td);
        });
        tbody.appendChild(dataRow);

        teamIndex++;
        rank++;
    }                 
}

function isWildcardSeason(season) {
    var firstYear = getFirstYear(season);
    if (firstYear >= 2013 && firstYear != 2019 && firstYear != 2020) {
        return true
    }
    return false;
}

function isDivisionSeason(season) {
    var firstYear = getFirstYear(season);
    if (firstYear >= 1967 || (firstYear <= 1937 && firstYear >= 1926)) {
        return true;
    }
    return false;
}

function isConferenceSeason(season) {
    var firstYear = getFirstYear(season);
    if (firstYear >= 1974 && firstYear != 2020) {
        return true;
    }
    return false;
}

function getFieldAbbreviation(stat) {
    switch (stat) {
        case 'rank_and_team':
            return '\u00A0\u00A0Rank\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Team';

        case 'season':
            return 'Season';

        case 'name':
            return 'Name';

        case 'team':
            return 'Team';

        case 'games_played':
            return 'GP';

        case 'wins':
            return 'W';
            
        case 'losses':
            return 'L';

        case 'ties':
            return 'T'

        case 'overtime_losses':
            return 'OTL';

        case 'points':
            return 'PTS';

        case 'points_percentage':
            return 'P%';

        case 'regulation_wins':
            return 'RW';

        case 'regulation_and_overtime_wins':
            return 'ROW';

        case 'goals_for':
            return 'GF';

        case 'goals_against':
            return 'GA';

        case 'goal_differential':
            return 'DIFF';

        case 'home':
            return 'HOME';

        case 'away':
            return 'AWAY';

        case 'shootout':
            return 'S/O';
        
        case 'last_10':
            return 'L10';
            
        case 'streak':
            return 'STRK';

        case 'shootout_wins':
            return 'SOW';

        case 'goals_for_per_game':
            return 'GF/GP';

        case 'goals_against_per_game':
            return 'GA/GP';

        case 'powerplay_percentage':
            return 'PP%';

        case 'penalty_kill_percentage':
            return 'PK%';

        case 'net_powerplay_percentage':
            return 'NPP%';

        case 'net_penalty_kill_percentage':
            return 'NPK%';
        
        case 'faceoff_win_percentage':
            return 'FOW%';

        case 'goals':
            return 'G';

        case 'assists':
            return 'A';

        case 'plus_minus':
            return '+/-';

        case 'penalty_minutes':
            return 'PIM';

        case 'powerplay_goals':
            return 'PPG';

        case 'powerplay_points':
            return 'PPP';

        case 'shorthanded_goals':
            return 'SHG';

        case 'shorthanded_points':
            return 'SHP';

        case 'time_on_ice_per_game':
            return 'TOI/G';

        case 'game_winning_goals':
            return 'GWG';

        case 'overtime_goals':
            return 'OTG';

        case 'shots':
            return 'S';

        case 'shooting_percentage':
            return 'S%';

        case 'faceoff_percentage':
            return 'FO%';

        case 'games_started':
            return 'GS';

        case 'shots_against':
            return 'SA';

        case 'goals_against_average':
            return 'GAA';

        case 'save_percentage':
            return 'SV%';

        case 'shutouts':
            return 'SO';

        case 'time_on_ice':
            return 'TOI';
    }
}

function getStatNameFromAbbreviation(abbreviation) {
    switch (abbreviation)
    {
        case 'Season':
            return 'season';

        case 'GP':
            return 'games_played';

        case 'W':
            return 'wins';

        case 'L':
            return 'losses';

        case 'T':
            return 'ties';

        case 'OTL':
            return 'overtime_losses';

        case 'PTS':
            return 'points';

        case 'P%':
            return 'points_percentage';

        case 'RW':
            return 'regulation_wins';

        case 'ROW':
            return 'regulation_and_overtime_wins';

        case 'GF':
            return 'goals_for';

        case 'GA':
            return 'goals_against';

        case 'DIFF':
            return 'goal_differential';

        case 'HOME':
            return 'home';

        case 'AWAY':
            return 'away';

        case 'S/O':
            return 'shootout';

        case 'L10':
            return 'last_10';

        case 'STRK':
            return 'streak';

        case 'SOW':
            return 'shootout_wins';

        case 'GF/GP':
            return 'goals_for_per_game';

        case 'GA/GP':
            return 'goals_against_per_game';

        case 'PP%':
            return 'powerplay_percentage';

        case 'PK%':
            return 'penalty_kill_percentage';

        case 'NPP%':
            return 'net_powerplay_percentage';

        case 'NPK%':
            return 'net_penalty_kill_percentage';
        
        case 'FOW%':
            return 'faceoff_win_percentage';

        case 'G':
            return 'goals';

        case 'A':
            return 'assists';

        case '+/-':
            return 'plus_minus';

        case 'PIM':
            return 'penalty_minutes';

        case 'PPG':
            return 'powerplay_goals';

        case 'PPP':
            return 'powerplay_points';

        case 'SHG':
            return 'shorthanded_goals';

        case 'SHP':
            return 'shorthanded_points';

        case 'TOI/G':
            return 'time_on_ice_per_game';

        case 'GWG':
            return 'game_winning_goals';

        case 'OTG':
            return 'overtime_goals';

        case 'S':
            return 'shots';

        case 'S%':
            return 'shooting_percentage';

        case 'FO%':
            return 'faceoff_percentage';

        case 'GS':
            return 'games_started';

        case 'SA':
            return 'shots_against';

        case 'GAA':
            return 'goals_against_average';

        case 'SV%':
            return 'save_percentage';

        case 'SO':
            return 'shutouts';

        case 'TOI':
            return 'time_on_ice';
    }
}

function getPositionAbbreviation(abbreviation) {
    switch (abbreviation) {
        case 'Forward':
            return 'Forward';

        case 'Left Wing':
            return 'LW';
        
        case 'Right Wing':
            return 'RW';

        case 'Center':
            return 'C';

        case 'Defense':
            return 'D';
    }
}

function getDivisionStandingsByStat(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get_division_standings',
        data: JSON.stringify({
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displayDivisionStandings(response, season);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var newStat = getStatNameFromAbbreviation(button.textContent);
                    if (newStat == sortedByStat) {
                        multiplier *= -1;
                    }
                    else {
                        sortedByStat = newStat;
                        multiplier = 1;
                    }
                    getDivisionStandingsByStat(season, sortedByStat, multiplier);
                });
            });
        }
    });
}

function getConferenceStandingsByStat(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get_conference_standings',
        data: JSON.stringify({
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displayConferenceStandings(response, season);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var newStat = getStatNameFromAbbreviation(button.textContent);
                    if (newStat == sortedByStat) {
                        multiplier *= -1;
                    }
                    else {
                        sortedByStat = newStat;
                        multiplier = 1;
                    }
                    getConferenceStandingsByStat(season, sortedByStat, multiplier);
                });
            });
        }
    });
}

function getLeagueStandingsByStat(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get_league_standings',
        data: JSON.stringify({
            type: 'Regular Season',
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displayLeagueStandings(response, season);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var newStat = getStatNameFromAbbreviation(button.textContent);
                    if (newStat == sortedByStat) {
                        multiplier *= -1;
                    }
                    else {
                        sortedByStat = newStat;
                        multiplier = 1;
                    }
                    getLeagueStandingsByStat(season, sortedByStat, multiplier);
                });
            });
        }
    });
}

function resetStatsScreen() {
    var pageName = window.location.pathname.split('/').pop().split('.')[0];
    if (pageName == 'standings') {
        statViewingContainer.appendChild(statViewButtonContainer);
    }

    if (pageName != 'skater_lookup' && pageName != 'goalie_lookup' && pageName != 'team_lookup') {
        statViewingContainer.innerHTML = '';
    }
    else {
        document.querySelectorAll("table").forEach(table => table.remove());
    }
}

function isOvertimeLossesSeason(type, season) {
    if (type == 'Regular Season') {
            if (getFirstYear(season) >= 2005) {
            return true;
        }
        return false;
    }
    else {
        if (getFirstYear(season) == 2019) {
            return true;
        }
        return false;
    }
}

function isTiesAndOvertimeLossesSeason(season) {
    var firstYear = getFirstYear(season);

    if (firstYear >= 1999 && firstYear <= 2003) {
        return true;
    }
    return false;
}

function isTiesSeason(season) {
    var firstYear = getFirstYear(season);

    if (firstYear <= 1998) {
        return true;
    }
    return false;
}

function updateStandingsButtons(season) {
    if (!isWildcardSeason(season)) {
        wildcardButton.disabled = true;
    }
    else {
        wildcardButton.disabled = false;
    }

    if (!isConferenceSeason(season)) {
        conferenceButton.disabled = true;
    }
    else {
        conferenceButton.disabled = false;
    }

    if (!isDivisionSeason(season)) {
        divisionButton.disabled = true;
    }
    else {
        divisionButton.disabled = false;
    }
}


function editTeam(type) {
    // prompt the user for the team and the season
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal_content');

    var teamAndSeasonFieldsContainer = document.createElement('div');
    teamAndSeasonFieldsContainer.classList.add('team_and_season_fields_container')
    
    var teamLabel = document.createElement('label');
    teamLabel.innerText = 'Team: ';
    var teamInput = document.createElement('input');
    teamInput.type = 'text';
    teamInput.id = 'modal_team';

    var teamField = document.createElement('div');
    teamField.appendChild(teamLabel);
    teamField.appendChild(teamInput);

    var seasonLabel = document.createElement('label');
    seasonLabel.innerText = 'Season: ';
    var seasonInput = document.createElement('input');
    seasonInput.type = 'text';
    seasonInput.id = 'modal_season';

    var seasonField = document.createElement('div');
    seasonField.appendChild(seasonLabel);
    seasonField.appendChild(seasonInput);

    teamAndSeasonFieldsContainer.appendChild(teamField);
    teamAndSeasonFieldsContainer.appendChild(seasonField);

    modalContent.appendChild(teamAndSeasonFieldsContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal_submit_button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var team = document.getElementById('modal_team').value;
        var season = document.getElementById('modal_season').value;

        if (team != '' && isValidSeason(season)) {
            document.body.removeChild(modal);

            $.ajax({
                type: 'POST',
                url: '/get_team_stats',
                data: JSON.stringify({
                    type: type,
                    team: team,
                    first_season: season,
                    last_season: season
                }),
                contentType: 'application/json',
                success: function(response) {
                    var team_stats = response.team_stats;
                    // re-populate the fields so they can be updated
                    document.getElementById('season').value = team_stats.season;
                    document.getElementById('city').value = team_stats.city;
                    document.getElementById('name').value = team_stats.name;
                    document.getElementById('games_played').value = team_stats.games_played;
                    document.getElementById('wins').value = team_stats.wins;
                    document.getElementById('losses').value = team_stats.losses;
                    if (type == 'Regular Season') {
                        if (isOvertimeLossesSeason(type, season)) {
                            document.getElementById('ties').value = 'null';
                            document.getElementById('overtime_losses').value = team_stats.overtime_losses;
                        }
                        else if (isTiesAndOvertimeLossesSeason(season)) {
                            document.getElementById('ties').value = team_stats.ties;
                            document.getElementById('overtime_losses').value = team_stats.overtime_losses;
                        }
                        else {
                            document.getElementById('ties').value = team_stats.ties;
                            document.getElementById('overtime_losses').value = 'null';
                        }
                    }
                    else {
                        document.getElementById('ties').value = 'null';
                        document.getElementById('overtime_losses').value = 'null';
                    }
                    document.getElementById('points').value = team_stats.points;
                    document.getElementById('points_percentage').value = team_stats.points_percentage.toFixed(3);
                    document.getElementById('regulation_wins').value = team_stats.regulation_wins;
                    document.getElementById('regulation_and_overtime_wins').value = team_stats.regulation_and_overtime_wins;
                    document.getElementById('goals_for').value = team_stats.goals_for;
                    document.getElementById('goals_against').value = team_stats.goals_against;
                    if (team.goal_differential > 0) {
                        document.getElementById('goal_differential').value = '+' + team_stats.goal_differential;
                    }
                    else {
                        document.getElementById('goal_differential').value = team_stats.goal_differential;
                    }
                    if (type == 'Regular Season') {
                        document.getElementById('home').value = team_stats.home;
                        document.getElementById('away').value = team_stats.away;
                    }
                    else {
                        document.getElementById('home').value = 'null';
                        document.getElementById('away').value = 'null';
                    }
                    if (type == 'Regular Season' && isOvertimeLossesSeason(type, season)) {
                        document.getElementById('shootout').value = team_stats.shootout;
                    }
                    else {
                        document.getElementById('shootout').value = 'null';
                    }
                    if (type == 'Regular Season') {
                        document.getElementById('last_10').value = team_stats.last_10;
                        document.getElementById('streak').value = team_stats.streak;
                    }
                    else {
                        document.getElementById('last_10').value = 'null';
                        document.getElementById('streak').value = 'null';
                    }
                    if (type == 'Regular Season' && isOvertimeLossesSeason(type, season)) {
                        document.getElementById('shootout_wins').value = team_stats.shootout_wins;
                    }
                    else {
                        document.getElementById('shootout_wins').value = 'null';
                    }
                    document.getElementById('goals_for_per_game').value = round(team_stats.goals_for_per_game, 2).toFixed(2);
                    document.getElementById('goals_against_per_game').value = round(team_stats.goals_against_per_game, 2).toFixed(2);
                    if (isTeamSpecialTeamsSeason(season)) {
                        document.getElementById('powerplay_percentage').value = round(team_stats.powerplay_percentage, 1).toFixed(1);
                        document.getElementById('penalty_kill_percentage').value = round(team_stats.penalty_kill_percentage, 1).toFixed(1);
                        document.getElementById('net_powerplay_percentage').value = round(team_stats.net_powerplay_percentage, 1).toFixed(1);
                        document.getElementById('net_penalty_kill_percentage').value = round(team_stats.net_penalty_kill_percentage, 1).toFixed(1);
                    }
                    else {
                        document.getElementById('powerplay_percentage').value = 'null';
                        document.getElementById('penalty_kill_percentage').value = 'null';
                        document.getElementById('net_powerplay_percentage').value = 'null';
                        document.getElementById('net_penalty_kill_percentage').value = 'null';
                    }
                    
                    if (isOvertimeLossesSeason(type, season)) {
                        document.getElementById('faceoff_win_percentage').value = round(team_stats.faceoff_win_percentage, 1).toFixed(1);
                    }
                    else {
                        document.getElementById('faceoff_win_percentage').value = 'null';
                    }
                },
                error: function() {
                    alert('Error -  team not found');
                }
            });
        }
        else if (team == '') {
            alert('Error - team cannot be blank');
        }
        else if (season == '') {
            alert('Error - season cannot be blank');
        }
        else {
            alert('Error - season is not valid');
        }
    };

    modalContent.appendChild(submitButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function getFirstYear(season) {
    return parseInt(season.substring(0, 4), 10);
}

function isFaceoffWinPercentageSeason(season) {
    if (getFirstYear(season) >= 1997) {
        return true
    }
    return false;
}

function round(num, places) {
    var factor = Math.pow(10, places);
    return Math.round(num * factor + 0.0000001) / factor;
}

function isTeamSpecialTeamsSeason(season) {
    if (getFirstYear(season) >= 1977) {
        return true;
    }

    return false;
}

function isTiesInPlayoffsSeason(season) {
    if (getFirstYear(season) <= 1950) {
        return true;
    }

    return false;
}


function getSkaterStats(type, team, firstSeason, lastSeason, position) {
    position = getPositionAbbreviation(position);

    var multiplier = -1;

    $.ajax({
        type: 'POST',
        url: '/get_skater_stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason,
            position: position
        }),
        contentType: 'application/json',
        success: function(response) {   
            sortedByStat = null;
            multiplier = -1;

            displaySkaterStats(response);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var stat = getStatNameFromAbbreviation(button.textContent);
                    multiplier *= -1; // toggles between 1 and -1
                    getSkaterStatsByStat(type, team, firstSeason, lastSeason, position, stat, multiplier);
                });
            });
        },
        error: function() {
            alert('Error - data entry is not complete yet');
        }
    });
}

function displaySkaterStats(response) {
    resetStatsScreen();

    var skaterStats = response.skater_stats;

    if (response.first_season == response.last_season && response.first_season == '1919-1920') {
        alert('There are no stats for the selected season.');
    }
    for (var i = 0; i < skaterStats.length; i++) {       
        if (i == 0) {
            var fields = [];
    
            // Add the fields to the table
            for (var key in skaterStats[i]) {
                if (skaterStats[i].hasOwnProperty(key) && skaterStats[i][key] !== null && key != 'type') {
                    fields.push(key);
                }
            }
    
            var table = document.createElement('table');
            // the seasons determine which stats we need to include in the table and how the coluns should be sized
            if (response.name != null) {
                var lastSeason = response.last_season;

                if (isTimeOnIcePerGameSeason(lastSeason) && isFaceoffPercentageSeason(lastSeason)) {
                    table.classList.add('skater_stats_table_time_on_ice_per_game_and_faceoff_percentage_season_without_names');
                }
                else if (isPlusMinusSeason(lastSeason) && isShotsSeason(lastSeason) && isShootingPercentageSeason(lastSeason)) {
                    table.classList.add('skater_stats_table_plus_minus_and_shots_and_shooting_percentage_season_without_names');
                }
                else {
                    table.classList.add('skater_stats_table_without_names');
                }
            }
            else {
                if (response.first_season == response.last_season) {
                    var season = response.first_season;

                    if (isTimeOnIcePerGameSeason(season) && isFaceoffPercentageSeason(season)) {
                        table.classList.add('skater_stats_table_time_on_ice_per_game_and_faceoff_percentage_season');
                    }
                    else if (isPlusMinusSeason(season) && isShotsSeason(season) && isShootingPercentageSeason(season)) {
                        table.classList.add('skater_stats_table_plus_minus_and_shots_and_shooting_percentage_season');
                    }
                    else {
                        table.classList.add('skater_stats_table');
                    }
                }
                else {
                    var lastSeason = response.last_season;

                    if (isTimeOnIcePerGameSeason(lastSeason) && isFaceoffPercentageSeason(lastSeason)) {
                        table.classList.add('skater_stats_table_time_on_ice_per_game_and_faceoff_percentage_season_with_seasons');
                    }
                    else if (isPlusMinusSeason(lastSeason) && isShotsSeason(lastSeason) && isShootingPercentageSeason(lastSeason)) {
                        table.classList.add('skater_stats_table_plus_minus_and_shots_and_shooting_percentage_season_with_seasons');
                    }
                    else {
                        table.classList.add('skater_stats_table_with_seasons');
                    }
                }
            }

            var thead = document.createElement('thead');
    
            var headerRow = document.createElement('tr');
            fields.forEach(function(field) {
                if (response.name == null || isPeriodWithSkaterStat(field, response.last_season)) {
                    var th = document.createElement('th');
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted_by_stat_button');
                    }

                    if (field === 'name' || field === 'team') {
                        th.style.position = 'relative';
                        th.style.left = '5px';

                        if (field === 'name') {
                            th.textContent = 'Name';
        
                        }
                        else {
                            th.textContent = 'Team';
                        }
                    }
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat_sorting_button');
                        
                        th.textContent = '';
                        th.appendChild(button);
                    }
                    
                    headerRow.appendChild(th);
                }
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            statViewingContainer.appendChild(table);      
        }

        var tables = document.querySelectorAll('table');
        var table = tables[tables.length - 1];

        var tbody = table.querySelector('tbody');
    
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }
        var tbody = table.querySelector('tbody');

        var dataRow = document.createElement('tr');
        fields.forEach(function(field) {
            if (response.name == null || isPeriodWithSkaterStat(field, response.last_season)) {
                var td = document.createElement('td');

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted_by_stat_button');
                }

                if (field === 'name') {
                    td.classList.add('name_field');
                    td.textContent = skaterStats[i].name;
                }
                else if (field === 'team') {
                    td.classList.add('team_field');
                    var textSpan = document.createElement('span');
                    textSpan.textContent = skaterStats[i].team;

                    if (response.name == null) {
                        var teamLogoContainer = document.createElement('span');
                        teamLogoContainer.classList.add('skater_stats_table_logo_container');

                        var teamLogo = document.createElement('img');
                        teamLogo.src = response.logos[i];
                        teamLogo.alt = skaterStats[i].team + ' Logo';
                        teamLogo.classList.add('team_logo');
                        
                        teamLogoContainer.appendChild(teamLogo);                                

                        td.appendChild(teamLogoContainer);
                    }
                    
                    td.appendChild(textSpan);
                }
                else {
                    if (skaterStats[i][field] == 'null') {
                        td.textContent = '--';
                    }
                    else{
                        if (field == 'shooting_percentage' || field == 'faceoff_percentage') {
                            td.textContent = round(parseFloat(skaterStats[i][field]), 3).toFixed(1);
                        }
                        else {
                            td.textContent = skaterStats[i][field];
                        }
                    }
                }

                dataRow.appendChild(td);
            } 
        });

        tbody.appendChild(dataRow);
    }                      
}

function isPeriodWithSkaterStat(stat, season) {
    switch (stat) {
        case 'plus_minus':
            if (isPlusMinusSeason(season)) {
                return true;
            }
            return false;

        case 'time_on_ice_per_game':
            if (isTimeOnIcePerGameSeason(season)) {
                return true;
            }
            return false;

        case 'shots':
            if (isShotsSeason(season)) {
                return true;
            }
            return false;

        case 'shooting_percentage':
            if (isShootingPercentageSeason(season)) {
                return true;
            }
            return false;

        case 'faceoff_percentage':
            if (isFaceoffPercentageSeason(season)) {
                return true;
            }
            return false;

        default:
            return true;
    }
}

function getSkaterStatsByStat(type, team, firstSeason, lastSeason, position, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get_skater_stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason,
            position: position,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displaySkaterStats(response);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var newStat = getStatNameFromAbbreviation(button.textContent);
                    if (newStat == sortedByStat) {
                        multiplier *= -1;
                    }
                    else {
                        sortedByStat = newStat;
                        multiplier = 1;
                    }
                    getSkaterStatsByStat(type, team, firstSeason, lastSeason, position, sortedByStat, multiplier);
                });
            });
        }
    });
}


function getGoalieStats(type, team, firstSeason, lastSeason) {
    sortedByStat = null;
    multiplier = -1;

    $.ajax({
        type: 'POST',
        url: '/get_goalie_stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason,
        }),
        contentType: 'application/json',
        success: function(response) {   
            sortedByStat = null;
            multiplier = -1;

            displayGoalieStats(response, type);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var stat = getStatNameFromAbbreviation(button.textContent);
                    multiplier *= -1; // toggles between 1 and -1
                    getGoalieStatsByStat(type, team, firstSeason, lastSeason, stat, multiplier);
                });
            });
        },
        error: function() {
            alert('Error - data entry is not complete yet');
        }
    });
}

function displayGoalieStats(response, type) {
    resetStatsScreen();

    var goalieStats = response.goalie_stats;

    if (response.first_season == response.last_season && response.first_season == '1919-1920') {
        alert('There are no stats for the selected season.');
    }
    for (var i = 0; i < goalieStats.length; i++) {       
        if (i == 0) {
            var fields = [];
    
            // Add the fields to the table
            for (var key in goalieStats[i]) {
                if (goalieStats[i].hasOwnProperty(key) && goalieStats[i][key] !== null && key != 'type') {
                    fields.push(key);
                }
            }
    
            var table = document.createElement('table');
            // the seasons determine which stats we need to include in the table and how the coluns should be sized
            if (response.name != null) {
                var firstSeason = response.first_season;
                var lastSeason = response.last_season;

                if (type == 'Regular Season') {
                    if (!isOvertimeLossesSeason(type, firstSeason) && isOvertimeLossesSeason(type, lastSeason)) {
                        
                        table.classList.add('goalie_stats_table_overtime_losses_and_ties_season_without_names');
                    }
                    else if (isOvertimeLossesSeason(type, firstSeason) && isOvertimeLossesSeason(type, lastSeason)) {
                        table.classList.add('goalie_stats_table_overtime_losses_season_without_names');
                    }
                    else {
                        table.classList.add('goalie_stats_table_without_names');
                    }
                }
                else {
                    table.classList.add('goalie_playoff_stats_table_without_names');
                }
            }
            else {
                if (type == 'Regular Season') {
                    if (response.first_season == response.last_season) {
                        var season = response.first_season;
        
                        if (isOvertimeLossesSeason(type, season)) {
                            table.classList.add('goalie_stats_table_overtime_losses_season');
                        }
                        else {
                            table.classList.add('goalie_stats_table');
                        }
                    }
                    else {
                        var firstSeason = response.first_season;
                        var lastSeason = response.last_season;
        
                        if (!isOvertimeLossesSeason(type, firstSeason) && isOvertimeLossesSeason(type, lastSeason)) {
                            table.classList.add('goalie_stats_table_overtime_losses_and_ties_season_with_seasons');
                        }
                        else if (isOvertimeLossesSeason(type, firstSeason) && isOvertimeLossesSeason(type, lastSeason)) {
                            table.classList.add('goalie_stats_table_overtime_losses_season_with_seasons');
                        }
                        else {
                            table.classList.add('goalie_stats_table_with_seasons');
                        }
                    }
                }
                else {
                    if (response.first_season == response.last_season) {
                        table.classList.add('goalie_playoff_stats_table');
                    }
                    else {
                        table.classList.add('goalie_playoff_stats_table_with_seasons');
                    }
                }
            }

            var thead = document.createElement('thead');
    
            var headerRow = document.createElement('tr');
            if (sortedByStat != null) {
                sortedByStat = sortedByStat.replace('-', '_');
            }
            fields.forEach(function(field) {
                if (response.name == null || isPeriodWithGoalieStat(field, response.first_season, type) ||
                                             isPeriodWithGoalieStat(field, response.last_season, type)) {
                    var th = document.createElement('th');
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted_by_stat_button');
                    }

                    if (field === 'name' || field === 'team') {
                        th.style.textAlign = 'left';
                        th.style.position = 'relative';
                        th.style.left = '5px';

                        if (field === 'name') {
                            th.textContent = 'Name';
        
                        }
                        else {
                            th.textContent = 'Team';
                        }
                    }
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat_sorting_button');
                        
                        th.textContent = '';
                        th.appendChild(button);
                    }
                    
                    headerRow.appendChild(th);
                }
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            statViewingContainer.appendChild(table);      
        }

        var tables = document.querySelectorAll('table');
        var table = tables[tables.length - 1];

        var tbody = table.querySelector('tbody');
    
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }
        var tbody = table.querySelector('tbody');

        var dataRow = document.createElement('tr');
        fields.forEach(function(field) {
            if (response.name == null || isPeriodWithGoalieStat(field, response.first_season, type) ||
                                             isPeriodWithGoalieStat(field, response.last_season, type)) {
                var td = document.createElement('td');

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted_by_stat_button');
                }

                if (field === 'name') {
                    td.classList.add('name_field');
                    td.textContent = goalieStats[i].name;
                }
                if (field === 'team') {
                    td.classList.add('team_field');
                    var textSpan = document.createElement('span');
                    textSpan.textContent = goalieStats[i].team;

                    if (response.name == null) {
                        var teamLogoContainer = document.createElement('span');
                        teamLogoContainer.classList.add('goalie_stats_table_logo_container');
        
                        var teamLogo = document.createElement('img');
                        teamLogo.src = response.logos[i];
                        teamLogo.alt = goalieStats[i].team + ' Logo';
                        teamLogo.classList.add('team_logo');
                        
                        teamLogoContainer.appendChild(teamLogo);                                
        
                        td.appendChild(teamLogoContainer);
                    }

                    td.appendChild(textSpan);
                }
                else {
                    if (goalieStats[i][field] == 'null') {
                        td.textContent = '--';
                    }
                    else{
                        if (field == 'save_percentage') {
                            td.textContent = round(parseFloat(goalieStats[i][field]), 3).toFixed(3);
                        }
                        else {
                            td.textContent = goalieStats[i][field];
                        }
                    }
                }

                dataRow.appendChild(td);
            } 
        });

        tbody.appendChild(dataRow);
    }                      
}

function isPeriodWithGoalieStat(stat, season, type) {
    switch (stat) {
        case 'overtime_losses':
            if (type == 'Playoffs') {
                return false;
            }
            else {
                if (isOvertimeLossesSeason(type, season)) {
                    return true;
                }
                return false;
            }

        case 'ties':
            if (type == 'Playoffs') {
                return false;
            }
            else {
                if (isTiesSeason(season) || isTiesAndOvertimeLossesSeason(season)) {
                    return true;
                }
                return false;
            }

        default:
            return true;
    }
}

function getGoalieStatsByStat(type, team, firstSeason, lastSeason, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get_goalie_stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason,
            stat: stat,
            multiplier: multiplier,
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displayGoalieStats(response, type);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var newStat = getStatNameFromAbbreviation(button.textContent);
                    if (newStat == sortedByStat) {
                        multiplier *= -1;
                    }
                    else {
                        sortedByStat = newStat;
                        multiplier = 1;
                    }
                    getGoalieStatsByStat(type, team, firstSeason, lastSeason, sortedByStat, multiplier);
                });
            });
        }
    });
}


function getTeamStats(type, team, firstSeason, lastSeason) {
    sortedByStat = null;
    multiplier = -1;

    $.ajax({
        type: 'POST',
        url: '/get_team_stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason
        }),
        contentType: 'application/json',
        success: function(response) {            
            sortedByStat = null;
            multiplier = -1;
            displayTeamStats(response, type);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var stat = getStatNameFromAbbreviation(button.textContent);
                    multiplier *= -1; // toggles between 1 and -1
                    getTeamStatsByStat(type, team, firstSeason, lastSeason, stat, multiplier);
                });
            });
        },
        error: function() {
            alert('Error - data entry is not complete yet');
        }
    });
}

function displayTeamStats(response, type) {
    resetStatsScreen();

    var teamStats = response.team_stats;

    if (response.first_season == response.last_season && response.first_season == '1919-1920') {
        alert('There are no stats for the selected season.');
    }
    for (var i = 0; i < teamStats.length; i++) {       
        if (i == 0) {
            var fields = [];
    
            // Add the fields to the table
            if (response.team == null) {
                fields.push('rank_and_team');
            }
            for (var key in teamStats[i]) {
                if (teamStats[i].hasOwnProperty(key) && teamStats[i][key] !== null) {
                    if (key !== 'city' && key !== 'name' && key !== 'type') {
                        fields.push(key);
                    }
                }
            }
    
            var table = document.createElement('table');
            // the seasons determine which stats we need to include in the table and how the coluns should be sized
            if (response.team == null) {
                if (response.first_season == response.last_season) {
                    var season = response.first_season;

                    if (type == 'Regular Season') {
                        table.classList.add('team_stats_table');
                        if (isOvertimeLossesSeason(type, season)) {
                            table.classList.add('team_stats_table_overtime_losses_season');
                        }
                        else if (isTiesAndOvertimeLossesSeason(season)) {
                            table.classList.add('team_stats_table_ties_and_overtime_losses_season');
                        }
                        else {
                            if (isFaceoffWinPercentageSeason(season)) {
                                table.classList.add('team_stats_table_ties_and_faceoff_win_percentage_season');
                            }
                            else if (isTeamSpecialTeamsSeason(season)) {
                                table.classList.add('team_stats_table_ties_and_special_teams_season');
                            }
                            else {
                                table.classList.add('team_stats_table_ties_season');
                            }
                        }
                    }
                    else {
                        table.classList.add('team_playoff_stats_table');
                        if (season == '2019-2020') {
                            table.classList.add('team_playoff_stats_table_special_teams_and_overtime_losses_season');
                        }
                        else if (isFaceoffWinPercentageSeason(season)) {
                            table.classList.add('team_playoff_stats_table_faceoff_win_percentage_season');
                        }
                        else if (isTeamSpecialTeamsSeason(season)) {
                            table.classList.add('team_playoff_stats_table_special_teams_season');
                        }
                        else if (isTiesInPlayoffsSeason(season)) {
                            table.classList.add('team_playoff_stats_ties_in_playoffs_season');
                        }
                        else {
                            table.classList.add('team_playoff_stats_table_ties_season');
                        }
                    }
                }
                else {
                    var firstSeason = response.first_season;
                    var lastSeason = response.last_season;

                    table.classList.add('team_stats_table_with_seasons');
                    if (type == 'Regular Season') {
                        if (isTiesSeason(firstSeason)) {
                            if (seasonsFallInShootoutPeriod(lastSeason)) {
                                table.classList.add('team_stats_table_ties_and_shootout_season_with_seasons');
                            }
                            else if (seasonsFallInTiesAndOvertimeLossesPeriod(firstSeason, lastSeason)) {
                                table.classList.add('team_stats_table_ties_and_overtime_losses_season_with_seasons')
                            }
                            else if (seasonsFallInFaceoffWinPercentagePeriod(lastSeason)) {
                                table.classList.add('team_stats_table_ties_and_faceoff_win_percentage_season_with_seasons');
                            }
                            else if (seasonsFallInSpecialTeamsStatsPeriod(lastSeason)) {
                                table.classList.add('team_stats_table_ties_and_special_teams_stats_season_with_seasons');
                            }
                            else {
                                table.classList.add('team_stats_table_ties_season_with_seasons');
                            }
                        }
                        else if (isTiesAndOvertimeLossesSeason(firstSeason)) {
                            if (!seasonsFallInShootoutPeriod(lastSeason)) {
                                table.classList.add('team_stats_table_ties_and_overtime_losses_season_with_seasons');
                            }
                            else {
                                table.classList.add('team_stats_table_ties_and_shootout_season_with_seasons');
                            }
                        }
                        else {
                            table.classList.add('team_stats_table_overtime_losses_season_with_seasons');
                        }
                    }
                    else {
                        if (seasonsFallInOvertimeLossesInPlayoffsPeriod(firstSeason, lastSeason)) {
                            if (seasonsFallInTiesInPlayoffsPeriod(firstSeason, lastSeason)) {
                                table.classList.add('team_playoff_stats_table_overtime_losses_and_ties_season_with_seasons');
                            }
                            else {
                                table.classList.add('team_playoff_stats_overtime_losses_season_with_seasons');
                            }
                        }
                        else if (seasonsFallInFaceoffWinPercentagePeriod(lastSeason)) {
                            if (seasonsFallInTiesInPlayoffsPeriod(firstSeason, lastSeason)) {
                                table.classList.add('team_playoff_stats_table_faceoff_win_percentage_and_ties_season_with_seasons');
                            }
                            else {
                                table.classList.add('team_playoff_stats_table_faceoff_win_percentage_season_with_seasons');
                            }
                        }
                        else if (seasonsFallInSpecialTeamsStatsPeriod(lastSeason)) {
                            if (seasonsFallInTiesInPlayoffsPeriod(firstSeason, lastSeason)) {
                                table.classList.add('team_playoff_stats_table_special_teams_stats_and_ties_season_with_seasons');
                            }
                            else {
                                table.classList.add('team_playoff_stats_table_special_teams_stats_season_with_seasons');
                            }
                        }
                        else {
                            if (seasonsFallInTiesInPlayoffsPeriod(firstSeason, lastSeason)) {
                                table.classList.add('team_playoff_stats_ties_season_with_seasons');
                            }
                            else {
                                table.classList.add('team_playoff_stats_season_with_seasons');
                            }
                        }
                    }
                }
            }
            else {
                var firstSeason = response.first_season;
                var lastSeason = response.last_season;

                if (type == 'Regular Season') {
                    if (isTiesSeason(firstSeason)) {
                        if (seasonsFallInShootoutPeriod(lastSeason)) {
                            table.classList.add('team_stats_table_ties_and_shootout_season_without_names');
                        }
                        else if (seasonsFallInSpecialTeamsStatsPeriod(lastSeason)) {
                            table.classList.add('team_stats_table_ties_and_special_teams_stats_season_without_names');
                        }
                        else {
                            table.classList.add('team_stats_table_ties_season_without_names');
                        }
                    }
                    else if (isTiesAndOvertimeLossesSeason(firstSeason)) {
                        table.classList.add('team_stats_table_ties_and_shootout_season_without_names');
                    }
                    else {
                        table.classList.add('team_stats_table_overtime_losses_season_without_names');
                    }
                }
                else {
                    if (seasonsFallInOvertimeLossesInPlayoffsPeriod(firstSeason, lastSeason)) {
                        if (seasonsFallInTiesInPlayoffsPeriod(firstSeason, lastSeason)) {
                            table.classList.add('team_playoff_stats_table_overtime_losses_and_ties_season_without_names');
                        }
                        else {
                            table.classList.add('team_playoff_stats_overtime_losses_season_without_names');
                        }
                    }
                    else if (seasonsFallInFaceoffWinPercentagePeriod(lastSeason)) {
                        table.classList.add('team_playoff_stats_table_faceoff_win_percentage_season_without_names');
                    }
                    else if (seasonsFallInSpecialTeamsStatsPeriod(lastSeason)) {
                        table.classList.add('team_playoff_stats_table_special_teams_stats_season_without_names');
                    }
                    else {
                        table.classList.add('team_playoff_stats_season_without_names');
                    }
                }
            }

            var thead = document.createElement('thead');
    
            var headerRow = document.createElement('tr');
            fields.forEach(function(field) {
                if (response.team == 'all' || isPeriodWithTeamStat(field, response.first_season, response.last_season, type)) {
                    var th = document.createElement('th');
            
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted_by_stat_button');
                    }

                    if (field === 'rank_and_team') {
                        th.classList.add('name_field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat_sorting_button');
                        
                        th.textContent = '';
                        th.appendChild(button);
                    }
                    
                    headerRow.appendChild(th);
                }
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            statViewingContainer.appendChild(table);      
        }

        var tables = document.querySelectorAll('table');
        var table = tables[tables.length - 1];

        var tbody = table.querySelector('tbody');
    
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }
        var tbody = table.querySelector('tbody');

        var dataRow = document.createElement('tr');
        fields.forEach(function(field) {
            if (response.team == 'all' || isPeriodWithTeamStat(field, response.first_season, response.last_season, type)) {
                var td = document.createElement('td');

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted_by_stat_button');
                }

                if (field === 'rank_and_team') {
                    var fullTeamName = teamStats[i].city + ' ' + teamStats[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = (i + 1) + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    if (type == 'Regular Season') {
                        textSpan.classList.add('team_stats_rank_and_team');
                    }
                    else {
                        textSpan.classList.add('team_playoff_stats_rank_and_team');
                    }

                    var teamLogoContainer = document.createElement('span');
                    if (type == 'Regular Season') {
                        teamLogoContainer.classList.add('team_stats_table_logo_container');
                    }
                    else {
                        teamLogoContainer.classList.add('team_playoff_stats_table_logo_container');
                    }

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[i];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team_logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name_field');
                }
                else {
                    if (teamStats[i][field] == 'null' || teamStats[i][field] == 'None' || teamStats[i][field] == null) {
                        td.textContent = '--';
                    }
                    else{
                        if ((field === 'powerplay_percentage' || field === 'penalty_kill_percentage' || field === 'net_powerplay_percentage' ||
                             field === 'net_penalty_kill_percentage' || field === 'faceoff_win_percentage') && teamStats[i][field] != '--') {
                            td.textContent = round(parseFloat(teamStats[i][field]), 2).toFixed(1);
                        }
                        else if (field === 'goals_for_per_game' || field === 'goals_against_per_game') {
                            td.textContent = round(parseFloat(teamStats[i][field]), 2).toFixed(2);
                        }
                        else if (field === 'points_percentage') {
                            td.textContent = round(parseFloat(teamStats[i][field]), 3).toFixed(3);
                        }
                        else {
                            td.textContent = teamStats[i][field];
                        }
                    }
                }
                dataRow.appendChild(td);
            }
        });

        tbody.appendChild(dataRow);
    }
}

function isPeriodWithTeamStat(stat, firstSeason, lastSeason, type) {
    switch (stat) {
        case 'overtime_losses':
            if (type == 'Playoffs') {
                if (seasonsFallInOvertimeLossesInPlayoffsPeriod(firstSeason, lastSeason)) {
                    return true;
                }
                return false;
            }
            else {
                if (isOvertimeLossesSeason(lastSeason)) {
                    return true;
                }
                return false;
            }

        case 'shootout':
            if (type == 'Playoffs') {
                return false;
            }
            else {
                if (seasonsFallInShootoutPeriod(lastSeason)) {
                    return true;
                }
                return false;
            }

        case 'shootout_wins':
            if (type == 'Playoffs') {
                return false;
            }
            else {
                if (seasonsFallInShootoutPeriod(lastSeason)) {
                    return true;
                }
                return false
            }

        case 'faceoff_win_percentage':
            if (isFaceoffWinPercentageSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'ties':
            if (type == 'Playoffs') {
                return false;
            }
            else {
                if (isTiesSeason(firstSeason) || isTiesAndOvertimeLossesSeason(firstSeason)) {
                    return true;
                }
                return false;
            }
        
        case 'home':
            if (type == 'Playoffs') {
                return false;
            }
            return true;

        case 'away':
            if (type == 'Playoffs') {
                return false;
            }
            return true;

        case 'last_10':
            if (type == 'Playoffs') {
                return false;
            }
            return true;

        case 'streak':
            if (type == 'Playoffs') {
                return false;
            }
            return true;

        case 'powerplay_percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'penalty_kill_percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'net_powerplay_percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'net_penalty_kill_percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        default:
            return true;
    }
}

function getTeamStatsByStat(type, team, firstSeason, lastSeason, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get_team_stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displayTeamStats(response, type);
            
            var statSortingButtons = document.querySelectorAll('.stat_sorting_button');

            statSortingButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var newStat = getStatNameFromAbbreviation(button.textContent);
                    if (newStat == sortedByStat) {
                        multiplier *= -1;
                    }
                    else {
                        sortedByStat = newStat;
                        multiplier = 1;
                    }
                    getTeamStatsByStat(type, team, firstSeason, lastSeason, sortedByStat, multiplier);
                });
            });
        }
    });
}

function seasonsFallInShootoutPeriod(lastSeason) {
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (lastSeasonFirstYear >= 2005) {
        return true;
    }
    return false;
}

function seasonsFallInTiesAndOvertimeLossesPeriod(firstSeason, lastSeason) {
    var firstSeasonFirstYear = getFirstYear(firstSeason);
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (firstSeasonFirstYear <= 2003 && lastSeasonFirstYear >= 1999) {
        return true;
    }
    return false;
}

function seasonsFallInOvertimeLossesPeriod(lastSeason) {
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (lastSeasonFirstYear >= 1999) {
        return true;
    }
    return false;
}

function seasonsFallInFaceoffWinPercentagePeriod(lastSeason) {
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (lastSeasonFirstYear >= 1997) {
        return true;
    }
    return false;
}

function seasonsFallInSpecialTeamsStatsPeriod(lastSeason) {
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (lastSeasonFirstYear >= 1977) {
        return true;
    }
    return false;
}

function seasonsFallInOvertimeLossesInPlayoffsPeriod(firstSeason, lastSeason) {
    var firstSeasonFirstYear = getFirstYear(firstSeason);
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (firstSeasonFirstYear <= 2019 && lastSeasonFirstYear >= 2019) {
        return true;
    }
    return false;
}

function seasonsFallInTiesInPlayoffsPeriod(firstSeason, lastSeason) {
    var firstSeasonFirstYear = getFirstYear(firstSeason);
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    if (firstSeasonFirstYear <= 1950 && lastSeasonFirstYear >= 1950) {
        return true;
    }
    return false;
}

function editSkater() {
    // prompt the user for the skater's name
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal_content');

    var skaterNameFieldContainer = document.createElement('div');
    skaterNameFieldContainer.classList.add('skater_name_field_container')
    
    var nameLabel = document.createElement('label');
    nameLabel.innerText = 'Name: ';
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'modal_name';

    var nameField = document.createElement('div');
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);

    skaterNameFieldContainer.appendChild(nameField);

    modalContent.appendChild(skaterNameFieldContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal_submit_button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var name = document.getElementById('modal_name').value;
        if (name != '') {
            document.body.removeChild(modal);

            $.ajax({
                type: 'POST',
                url: '/get_skater_stats',
                data: JSON.stringify({
                    name: name
                }),
                contentType: 'application/json',
                success: function(response) {
                    var skaters = response.skaters;
                    if (skaters.length > 1) {
                        // TO-DO: provide system for the user to choose between the players
                    }
                    else {
                        var skater = skaters[0];
                        // re-populate the fields so they can be updated
                        document.getElementById('name').value = name;
                        document.getElementById('team').value = skater.team;
                        document.getElementById('number').value = skater.number;
                        document.getElementById('position').value = skater.position;
                        document.getElementById('height').value = skater.height;
                        document.getElementById('weight').value = skater.weight;
                        document.getElementById('birthday').value = skater.birthday;
                        document.getElementById('handedness').value = skater.handedness;
                        document.getElementById('draft_position').value = skater.draft_position;

                        // restore the player object
                        var player = {
                            name: name,
                            team: skater.team,
                            number: skater.number,
                            position: skater.position,
                            height: skater.height,
                            weight: skater.weight,
                            birthday: skater.birthday,
                            handedness: skater.handedness,
                            draftPosition: skater.draft_position,
                            seasons: [],
                            playoffs: [],
                        };

                        for (i = 0; i < skater.seasons.length; i++) {
                            player.seasons.push({
                                season: skater.seasons[i].season,
                                team: skater.seasons[i].team,
                                gamesPlayed: skater.seasons[i].games_played,
                                goals: skater.seasons[i].goals,
                                assists: skater.seasons[i].assists,
                                points: skater.seasons[i].points,
                                plusMinus: skater.seasons[i].plus_minus,
                                penaltyMinutes: skater.seasons[i].penalty_minutes,
                                powerplayGoals: skater.seasons[i].powerplay_goals,
                                powerplayPoints: skater.seasons[i].powerplay_points,
                                shortHandedGoals: skater.seasons[i].shorthanded_goals,
                                shortHandedPoints: skater.seasons[i].shorthanded_points,
                                timeOnIcePerGame: skater.seasons[i].time_on_ice_per_game,
                                gameWinningGoals: skater.seasons[i].game_winning_goals,
                                overtimeGoals: skater.seasons[i].overtime_goals,
                                shots: skater.seasons[i].shots,
                                shootingPercentage: skater.seasons[i].shooting_percentage,
                                faceoffPercentage: skater.seasons[i].faceoff_percentage
                            });         
                        }
                        for (i = 0; i < skater.playoffs.length; i++) {
                            player.playoffs.push({
                                season: skater.playoffs[i].season,
                                team: skater.playoffs[i].team,
                                gamesPlayed: skater.playoffs[i].games_played,
                                goals: skater.playoffs[i].goals,
                                assists: skater.playoffs[i].assists,
                                points: skater.playoffs[i].points,
                                plusMinus: skater.playoffs[i].plus_minus,
                                penaltyMinutes: skater.playoffs[i].penalty_minutes,
                                powerplayGoals: skater.playoffs[i].powerplay_goals,
                                powerplayPoints: skater.playoffs[i].powerplay_points,
                                shortHandedGoals: skater.playoffs[i].shorthanded_goals,
                                shortHandedPoints: skater.playoffs[i].shorthanded_points,
                                timeOnIcePerGame: skater.playoffs[i].time_on_ice_per_game,
                                gameWinningGoals: skater.playoffs[i].game_winning_goals,
                                overtimeGoals: skater.playoffs[i].overtime_goals,
                                shots: skater.playoffs[i].shots,
                                shootingPercentage: skater.playoffs[i].shooting_percentage,
                                faceoffPercentage: skater.playoffs[i].faceoff_percentage
                            });         
                        }
                        localStorage.setItem('player', JSON.stringify(player));

                        addEditSeasonButton('Skater');
                    }              
                },
                error: function() {
                    alert('Error - skater not found');
                }
            });
        }
        else if (team == '') {
            alert('Error - team cannot be blank');
        }
        else if (season == '') {
            alert('Error - season cannot be blank');
        }
        else {
            alert('Error - season is not valid');
        }
    };

    modalContent.appendChild(submitButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function editGoalie() {
    // prompt the user for the skater's name
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal_content');

    var skaterNameFieldContainer = document.createElement('div');
    skaterNameFieldContainer.classList.add('gaolie_name_field_container')
    
    var nameLabel = document.createElement('label');
    nameLabel.innerText = 'Name: ';
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'modal_name';

    var nameField = document.createElement('div');
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);

    skaterNameFieldContainer.appendChild(nameField);

    modalContent.appendChild(skaterNameFieldContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal_submit_button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var name = document.getElementById('modal_name').value;
        if (name != '') {
            document.body.removeChild(modal);

            $.ajax({
                type: 'POST',
                url: '/get_goalie_stats',
                data: JSON.stringify({
                    name: name
                }),
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                    var goalies = response.goalies;
                    if (goalies.length > 1) {
                        // TO-DO: provide system for the user to choose between the players
                    }
                    else if (goalies.length == 1) {
                        var goalie = goalies[0];
                        // re-populate the fields so they can be updated
                        document.getElementById('name').value = name;
                        document.getElementById('team').value = goalie.team;
                        document.getElementById('number').value = goalie.number;
                        document.getElementById('height').value = goalie.height;
                        document.getElementById('weight').value = goalie.weight;
                        document.getElementById('birthday').value = goalie.birthday;
                        document.getElementById('handedness').value = goalie.handedness;
                        document.getElementById('draft_position').value = goalie.draft_position;

                        // restore the player object
                        var player = {
                            name: name,
                            team: goalie.team,
                            number: goalie.number,
                            height: goalie.height,
                            weight: goalie.weight,
                            birthday: goalie.birthday,
                            handedness: goalie.handedness,
                            draftPosition: goalie.draft_position,
                            seasons: [],
                            playoffs: [],
                        };

                        for (i = 0; i < goalie.seasons.length; i++) {
                            player.seasons.push({
                                season: goalie.seasons[i].season,
                                team: goalie.seasons[i].team,
                                gamesPlayed: goalie.seasons[i].games_played,
                                gamesStarted: goalie.seasons[i].games_started,
                                wins: goalie.seasons[i].wins,
                                losses: goalie.seasons[i].losses,
                                ties: goalie.seasons[i].ties,
                                overtimeLosses: goalie.seasons[i].overtime_losses,
                                shotsAgainst: goalie.seasons[i].shots_against,
                                goalsAgainstAverage: goalie.seasons[i].goals_against_average,
                                savePercentage: goalie.seasons[i].save_percentage,
                                shutouts: goalie.seasons[i].shutouts,
                                goals: goalie.seasons[i].goals,
                                assists: goalie.seasons[i].assists,
                                penaltyMinutes: goalie.seasons[i].penalty_minutes,
                                timeOnIce: goalie.seasons[i].time_on_ice
                            });         
                        }
                        for (i = 0; i < goalie.playoffs.length; i++) {
                            player.playoffs.push({
                                season: goalie.playoffs[i].season,
                                team: goalie.playoffs[i].team,
                                gamesPlayed: goalie.playoffs[i].games_played,
                                gamesStarted: goalie.playoffs[i].games_started,
                                wins: goalie.playoffs[i].wins,
                                losses: goalie.playoffs[i].losses,
                                ties: goalie.playoffs[i].ties,
                                overtimeLosses: goalie.playoffs[i].overtime_losses,
                                shotsAgainst: goalie.playoffs[i].shots_against,
                                goalsAgainstAverage: goalie.playoffs[i].goals_against_average,
                                savePercentage: goalie.playoffs[i].save_percentage,
                                shutouts: goalie.playoffs[i].shutouts,
                                goals: goalie.playoffs[i].goals,
                                assists: goalie.playoffs[i].assists,
                                penaltyMinutes: goalie.playoffs[i].penalty_minutes,
                                timeOnIce: goalie.playoffs[i].time_on_ice
                            });         
                        }
                        localStorage.setItem('player', JSON.stringify(player));

                        addEditSeasonButton('Goalie');
                    }
                    else {
                        alert('Error - goalie not found');
                    }           
                },
                error: function() {
                    alert('Error - goalie not found');
                }
            });
        }
        else if (team == '') {
            alert('Error - team cannot be blank');
        }
        else if (season == '') {
            alert('Error - season cannot be blank');
        }
        else {
            alert('Error - season is not valid');
        }
    };

    modalContent.appendChild(submitButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function addEditSeasonButton(playerType) {
    var editSeasonButton = document.createElement('button');
    editSeasonButton.className = 'edit_button';
    editSeasonButton.id = 'edit_season_button';
    editSeasonButton.textContent = 'Edit Season';
    editSeasonButton.onclick = function () {
        editSeason(playerType);
    };

    // Insert before the Submit Player button
    var container = document.getElementById('stat_adding_container');
    var submitButton = container.querySelector('.confirm_button');
    container.insertBefore(editSeasonButton, submitButton);
}

function editSeason(playerType) {
    // prompt the user for the skater's name
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal_content');

    var seasonTypeFieldContainer = document.createElement('div');
    seasonTypeFieldContainer.id = 'season_type_field_container';
    
    var regularSeasonButton = document.createElement('button');
    regularSeasonButton.innerText = 'Regular Season';
    regularSeasonButton.id = 'regular_season_season_type_button';
    var playoffsButton = document.createElement('button');
    playoffsButton.innerText = 'Playoffs';
    playoffsButton.id = 'playoffs_season_type_button';

    var seasonType = null;
    regularSeasonButton.addEventListener('click', function () {
        seasonType = 'Regular Season';
        
        // hover colour
        regularSeasonButton.style.backgroundColor = '#e0e0e0';
        regularSeasonButton.addEventListener('mouseenter', function() {
            regularSeasonButton.style.backgroundColor = '#c0c0c0';
        });
        regularSeasonButton.addEventListener('mouseleave', function() {
            regularSeasonButton.style.backgroundColor = '#e0e0e0';
        });
        playoffsButton.style.backgroundColor = 'white';
        playoffsButton.addEventListener('mouseenter', function() {
            playoffsButton.style.backgroundColor = '#c0c0c0';
        });
        playoffsButton.addEventListener('mouseleave', function() {
            playoffsButton.style.backgroundColor = 'white';
        });
    });

    playoffsButton.addEventListener('click', function () {
        seasonType = 'Playoffs';
        
        // hover colour
        playoffsButton.style.backgroundColor = '#e0e0e0';
        playoffsButton.addEventListener('mouseenter', function() {
            playoffsButton.style.backgroundColor = '#c0c0c0';
        });
        playoffsButton.addEventListener('mouseleave', function() {
            playoffsButton.style.backgroundColor = '#e0e0e0';
        });
        regularSeasonButton.style.backgroundColor = 'white';
        regularSeasonButton.addEventListener('mouseenter', function() {
            regularSeasonButton.style.backgroundColor = '#c0c0c0';
        });
        regularSeasonButton.addEventListener('mouseleave', function() {
            regularSeasonButton.style.backgroundColor = 'white';
        });
    });

    seasonTypeFieldContainer.appendChild(regularSeasonButton);
    seasonTypeFieldContainer.appendChild(playoffsButton);

    var seasonLabel = document.createElement('label');
    seasonLabel.innerText = 'Season: ';
    var seasonInput = document.createElement('input');
    seasonInput.type = 'text';
    seasonInput.id = 'modal_season';

    var seasonField = document.createElement('div');
    seasonField.appendChild(seasonLabel);
    seasonField.appendChild(seasonInput);

    modalContent.appendChild(seasonTypeFieldContainer);
    modalContent.appendChild(seasonField);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal_submit_button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var season = document.getElementById('modal_season').value;
        if (seasonType != null && isValidSeason(season)) {
            document.body.removeChild(modal);

            var teams = [];

            var player = JSON.parse(localStorage.getItem('player'));
            if (seasonType == 'Regular Season') {
                for (i = 0; i < player.seasons.length; i++) {
                    if (player.seasons[i].season == season) {
                        teams.push(player.seasons[i].team);
                    }
                }
            }
            else {
                for (i = 0; i < player.playoffs.length; i++) {
                    if (player.playoffs[i].season == season) {
                        teams.push(player.playoffs[i].team);
                    }
                }
            }

            if (teams.length > 1) {
                localStorage.setItem('season', JSON.stringify(season));
                createTeamSelectModal(player.name, season, teams, seasonType);
            }
            else if (teams.length == 1) {
                localStorage.setItem('season', JSON.stringify(season));
                localStorage.setItem('team', JSON.stringify(teams[0]));
                if (seasonType == 'Regular Season') {
                    if (playerType == 'Skater') {
                        window.location.href = 'add_skater_regular_season.html';
                    }
                    else {
                        window.location.href = 'add_goalie_regular_season.html';
                    }
                }
                else {
                    if (playerType == 'Skater') {
                        window.location.href = 'add_skater_playoffs.html';
                    }
                    else {
                        window.location.href = 'add_goalie_playoffs.html';
                    }
                }              
            }
            else {
                alert('Error: This player has no stats for that season.');
            }
        }
    };

    modalContent.appendChild(submitButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function createTeamSelectModal(name, season, teams, seasonType) {
    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'team_select_modal';

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal_content');

    var seasonLabel = document.createElement('label');
    seasonLabel.innerText = name + ' played for ' + teams.length + ' teams during the ' + season + 
                                ' season. ' + '\nPlease select the one whose stats you want to enter:\n';
    modalContent.appendChild(seasonLabel);

    var teamSelectContainer = document.createElement('div');
    teamSelectContainer.id = 'team_select_container';
    
    var buttons = [];
    for (i = 0; i < teams.length; i++) {
        var teamButton = document.createElement('button');
        teamButton.innerText = teams[i];
        teamButton.classList.add('team_button');
        teamSelectContainer.appendChild(teamButton);
        buttons.push(teamButton);
    }

    var team = null;
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            team = button.innerText;
            
            // hover colour
            button.style.backgroundColor = '#e0e0e0';
            button.addEventListener('mouseenter', function() {
                button.style.backgroundColor = '#c0c0c0';
            });
            button.addEventListener('mouseleave', function() {
                button.style.backgroundColor = '#e0e0e0';
            });

            buttons.forEach(innerButton => {
                if (innerButton != button) {
                    innerButton.style.backgroundColor = 'white';
                    innerButton.addEventListener('mouseenter', function() {
                        innerButton.style.backgroundColor = '#c0c0c0';
                    });
                    innerButton.addEventListener('mouseleave', function() {
                        innerButton.style.backgroundColor = 'white';
                    });
                }
            });
        });
    });

    modalContent.appendChild(teamSelectContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal_submit_button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        if (team != null) {
            localStorage.setItem('team', JSON.stringify(team));
            var pageName = window.location.pathname.split('/').pop().split('.')[0];
            
            if (pageName == 'add_skater') {
                    if (seasonType == 'Regular Season') {
                    window.location.href = 'add_skater_regular_season.html';
                }
                else {
                    window.location.href = 'add_skater_playoffs.html';
                }
            }
            else {
                if (seasonType == 'Regular Season') {
                    window.location.href = 'add_goalie_regular_season.html';
                }
                else {
                    window.location.href = 'add_goalie_playoffs.html';
                }
            }
        }
    };
    modalContent.appendChild(submitButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function isFaceoffPercentageSeason(season) {
    if (getFirstYear(season) >= 1997) {
        return true
    }
    return false;
}

function isTimeOnIcePerGameSeason(season) {
    if (getFirstYear(season) >= 1997) {
        return true;
    }
    return false;
}

function isPlusMinusSeason(season) {
    if (getFirstYear(season) >= 1959) {
        return true;
    }
    return false;
}

function isShotsSeason(season) {
    if (getFirstYear(season) >= 1959) {
        return true;
    }
    return false;
}

function isShootingPercentageSeason(season) {
    if (getFirstYear(season) >= 1959) {
        return true;
    }
    return false;
}

function isShotsAgainstSeason(season) {
    if (getFirstYear(season) >= 1955) {
        return true;
    }
    return false;
}

function isSkaterSpecialTeamsStatsSeason(season) {
    if (getFirstYear(season) >= 1933) {
        return true;
    }
    return false;
}

function isSavePercentageSeason(season) {
    if (getFirstYear(season) >= 1955) {
        return true;
    }
    return false;
}

function isGoalieTiesInPlayoffsSeason(season) {
    if (getFirstYear(season) <= 1934) {
        return true;
    }

    return false;
}