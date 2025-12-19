var pageName = window.location.pathname.split('/').pop().split('.')[0];

function enableSingleSeasonSelect() {
    var singleSeasonButton = document.querySelector('#single-season-button');
    var multipleSeasonsButton = document.querySelector('#multiple-seasons-button');

    singleSeasonButton.classList.add('button-selected');
    multipleSeasonsButton.classList.remove('button-selected');

    // Enable the season dropdown button
    var seasonDropdownButton = document.querySelector('#season-dropdown-button');
    seasonDropdownButton.disabled = false;

    // Disable the multiple season text fields
    var startingSeasonTextField = document.querySelector('#starting-season-text-field');
    var endingSeasonTextField = document.querySelector('#ending-season-text-field');
    startingSeasonTextField.disabled = true;
    startingSeasonTextField.value = '';
    endingSeasonTextField.disabled = true;
    endingSeasonTextField.value = '';

    var teamDropdownButton = document.querySelector('#team-dropdown-button');
    if (teamDropdownButton != null) {
        teamDropdownButton.textContent = 'Select Team';
    }

    document.querySelector('#checkbox-sum-results-between-seasons').disabled = true;
}

function enableMultipleSeasonSelect() {
    var singleSeasonButton = document.querySelector('#single-season-button');
    var multipleSeasonsButton = document.querySelector('#multiple-seasons-button');

    singleSeasonButton.classList.remove('button-selected');
    multipleSeasonsButton.classList.add('button-selected');

    // Disable the season dropdown button
    var seasonDropdownButton = document.querySelector('#season-dropdown-button');
    seasonDropdownButton.disabled = true;
    seasonDropdownButton.textContent = 'Select Season';

    // Enable the multiple season text fields
    var startingSeasonTextField = document.querySelector('#starting-season-text-field');
    var endingSeasonTextField = document.querySelector('#ending-season-text-field');
    startingSeasonTextField.disabled = false;
    endingSeasonTextField.disabled = false;

    var teamDropdownButton = document.querySelector('#team-dropdown-button');
    if (teamDropdownButton != null) {
        teamDropdownButton.textContent = 'Select Team';
    }

    document.querySelector('#checkbox-sum-results-between-seasons').disabled = false;
}

function displaySeasons() {
    var seasonDropdownItems = document.querySelectorAll('.season-dropdown-option');
    var seasonSelector = document.querySelector('#season-selector');
    var seasonDropdownButton = document.querySelector('#season-dropdown-button');

    seasonDropdownItems.forEach(item => {
        item.style.display = 'block';
    });
    
    seasonSelector.style.display = 'block';

    seasonDropdownItems.forEach(seasonDropdownItem => {
        seasonDropdownItem.addEventListener('click', function () {
            seasonSelector.style.display = 'none';
            seasonDropdownItems.forEach(item => {
                item.style.display = 'none';
            });

            seasonDropdownButton.textContent = seasonDropdownItem.textContent;
        });

        var teamDropdownButton = document.querySelector('#team-dropdown-button');
        if (teamDropdownButton != null) {
            teamDropdownButton.textContent = 'Select Team';
        }
    });
}

function displayPositions() {
    var positionDropdownItems = document.querySelectorAll('.position-dropdown-option');
    var positionSelector = document.querySelector('#position-selector');
    var positionDropdownButton = document.querySelector('#position-dropdown-button');

    positionDropdownItems.forEach(item => {
        item.style.display = 'block';
    });
    
    positionSelector.style.display = 'block';

    positionDropdownItems.forEach(positionDropdownItem => {
        positionDropdownItem.addEventListener('click', function () {
            positionSelector.style.display = 'none';
            positionDropdownItems.forEach(item => {
                item.style.display = 'none';
            });

            positionDropdownButton.textContent = positionDropdownItem.textContent;
        });
    });
}

function displayTeams() {
    // First check if a season/multiple seasons have been selected
    var singleSeasonButton = document.querySelector('#single-season-button');
    var multipleSeasonsButton = document.querySelector('#multiple-seasons-button');
    if (!singleSeasonButton.classList.contains('button-selected') && !multipleSeasonsButton.classList.contains('button-selected')) {
        alert('Error - a season must be selected first');
        return;
    }
    else if (singleSeasonButton.classList.contains('button-selected')) {
        var season = document.querySelector('#season-dropdown-button').textContent;
        if (!isValidSeason(season)) {
            alert('Error - a season must be selected first');
            return;
        }
        var startingSeason = season;
        var endingSeason = season;
    }
    else {
        var startingSeason = document.querySelector('#starting-season-text-field').value;
        var endingSeason = document.querySelector('#ending-season-text-field').value;
        if (!isValidSeason(startingSeason)) {
            alert('Error - invalid starting season');
            return;
        }
        else if (!isValidSeason(endingSeason)) {
            alert('Error - invalid ending season');
            return
        }
    }

    // Get all of the teams
    var teamDropdownItems = document.querySelectorAll('.team-dropdown-option');
    var teamSelector = document.querySelector('#team-selector');
    var teamDropdownButton = document.querySelector('#team-dropdown-button');

    teamDropdownItems.forEach(teamDropdownItem => {
        var team = teamDropdownItem.textContent;
        // Check if the team played during the season
        if (didTeamPlayInRange(team, startingSeason, endingSeason)) {
            teamDropdownItem.style.display = 'block';
        }
    });
    
    teamSelector.style.display = 'block';

    teamDropdownItems.forEach(teamDropdownItem => {
        teamDropdownItem.addEventListener('click', function () {
            teamSelector.style.display = 'none';

            teamDropdownItems.forEach(item => {
                item.style.display = 'none';
            });

            teamDropdownButton.textContent = teamDropdownItem.textContent;
            teamDropdownButton.style.fontSize = '10px';
        });
    });
}

var checkboxCombineSeasonsOnDifferentTeams = document.querySelector('#checkbox-combine-seasons-on-different-teams');
if (checkboxCombineSeasonsOnDifferentTeams != null) {
    checkboxCombineSeasonsOnDifferentTeams.addEventListener('change', e => {
        if (e.target.checked === false) {
            var checkBoxSumResultsBetweenSeasons = document.querySelector('#checkbox-sum-results-between-seasons');
            checkBoxSumResultsBetweenSeasons.checked = false;
        }
    });
}

var checkBoxSumResultsBetweenSeasons = document.querySelector('#checkbox-sum-results-between-seasons');
if (checkBoxSumResultsBetweenSeasons != null) {
    checkBoxSumResultsBetweenSeasons.addEventListener('change', e => {
        if (e.target.checked === true) {
            var checkboxCombineSeasonsOnDifferentTeams = document.querySelector('#checkbox-combine-seasons-on-different-teams');
            checkboxCombineSeasonsOnDifferentTeams.checked = true;
        }
    });
}

function fetchSkaterStats(stat, multiplier) {
    if (pageName == 'skater-season-stats') {
        var type = 'Regular Season';
    }
    else {
        var type = 'Playoffs';
    }

    // Get the season(s)
    var singleSeasonButton = document.querySelector('#single-season-button');
    var multipleSeasonsButton = document.querySelector('#multiple-seasons-button');
    if (!singleSeasonButton.classList.contains('button-selected') && !multipleSeasonsButton.classList.contains('button-selected')) {
        alert('Error - no season selected');
        return;
    }
    else if (singleSeasonButton.classList.contains('button-selected')) {
        var season = document.querySelector('#season-dropdown-button').textContent;
        if (!isValidSeason(season)) {
            alert('Error - no season selected');
            return;
        }
        var firstSeason = season;
        var lastSeason = season;
    }
    else {
        var firstSeason = document.querySelector('#starting-season-text-field').value;
        var lastSeason = document.querySelector('#ending-season-text-field').value;
        if (!isValidSeason(firstSeason)) {
            alert('Error - invalid starting season');
            return;
        }
        else if (!isValidSeason(lastSeason)) {
            alert('Error - invalid ending season');
            return
        }
    }

    // Get the position
    var position = document.querySelector('#position-dropdown-button').textContent;
    if (position == 'Select Position') {
        position = null;
    }
    else {
        position = getPositionAbbreviation(position);
    }

    // Get the team
    var team = document.querySelector('#team-dropdown-button').textContent;
    if (team == 'Select Team' || team == 'All' || team == 'all') {
        team = null;
    }

    var combineSeasonsOnDifferentTeams = document.querySelector('#checkbox-combine-seasons-on-different-teams').checked;
    var sumResultsBetweenSeasons = document.querySelector('#checkbox-sum-results-between-seasons').checked;

    $.ajax({
        type: 'POST',
        url: '/get-skater-stats',
        data: JSON.stringify({
            type: type,
            first_season: firstSeason,
            last_season: lastSeason,
            position: position,
            team: team,
            combine_seasons_on_different_teams: combineSeasonsOnDifferentTeams,
            sum_results_between_seasons: sumResultsBetweenSeasons,
            stat: stat,
            multiplier: multiplier,
        }),
        contentType: 'application/json',
        success: function(response) {
            displaySkaterStats(response);

            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var button = Array.from(statSortingButtons).find(btn =>
                    btn.textContent.trim() === abbreviation
                );
                button.classList.add('sorted-by-stat');

                // Mark all of the successive stats in the column
                var th = button.parentElement;

                var table = document.querySelector('table');
                var headerRow = table.querySelector('thead tr');

                var thIndex = [...headerRow.children].indexOf(th);

                var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                tds.forEach(td => {
                    td.classList.add('sorted-by-stat');
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchSkaterStats(stat, multiplier);
                });
            });
        },
        error: function() {
            alert('Error - data entry is not complete yet');
        }
    });
}

function fetchGoalieStats(stat, multiplier) {
    if (pageName == 'goalie-season-stats') {
        var type = 'Regular Season';
    }
    else {
        var type = 'Playoffs';
    }

    // Get the season(s)
    var singleSeasonButton = document.querySelector('#single-season-button');
    var multipleSeasonsButton = document.querySelector('#multiple-seasons-button');
    if (!singleSeasonButton.classList.contains('button-selected') && !multipleSeasonsButton.classList.contains('button-selected')) {
        alert('Error - no season selected');
        return;
    }
    else if (singleSeasonButton.classList.contains('button-selected')) {
        var season = document.querySelector('#season-dropdown-button').textContent;
        if (!isValidSeason(season)) {
            alert('Error - no season selected');
            return;
        }
        var firstSeason = season;
        var lastSeason = season;
    }
    else {
        var firstSeason = document.querySelector('#starting-season-text-field').value;
        var lastSeason = document.querySelector('#ending-season-text-field').value;
        if (!isValidSeason(firstSeason)) {
            alert('Error - invalid starting season');
            return;
        }
        else if (!isValidSeason(lastSeason)) {
            alert('Error - invalid ending season');
            return
        }
    }

    // Get the team
    var team = document.querySelector('#team-dropdown-button').textContent;
    if (team == 'Select Team' || team == 'All' || team == 'all') {
        team = null;
    }

    var combineSeasonsOnDifferentTeams = document.querySelector('#checkbox-combine-seasons-on-different-teams').checked;
    var sumResultsBetweenSeasons = document.querySelector('#checkbox-sum-results-between-seasons').checked;

    $.ajax({
        type: 'POST',
        url: '/get-goalie-stats',
        data: JSON.stringify({
            type: type,
            team: team,
            first_season: firstSeason,
            last_season: lastSeason,
            combine_seasons_on_different_teams: combineSeasonsOnDifferentTeams,
            sum_results_between_seasons: sumResultsBetweenSeasons,
            stat,
            multiplier
        }),
        contentType: 'application/json',
        success: function(response) {   
            displayGoalieStats(response, type);
            
            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var button = Array.from(statSortingButtons).find(btn =>
                    btn.textContent.trim() === abbreviation
                );
                button.classList.add('sorted-by-stat');

                // Mark all of the successive stats in the column
                var th = button.parentElement;

                var table = document.querySelector('table');
                var headerRow = table.querySelector('thead tr');

                var thIndex = [...headerRow.children].indexOf(th);

                var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                tds.forEach(td => {
                    td.classList.add('sorted-by-stat');
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchGoalieStats(stat, multiplier);
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
    var statViewingContainer = document.querySelector('#stat-viewing-container');

    var fields = [];    
    // Add the fields to the table
    for (var key in skaterStats[0]) {
        if (skaterStats[0].hasOwnProperty(key) && skaterStats[0][key] !== null && key != 'type') {
            if (key == 'name') {
                fields.push('rank-and-name');
            }
            else {
                fields.push(key);
            }
        }
    }

    var table = document.createElement('table');
    if (response.first_season == response.last_season) {
        table.classList.add('skater-stats-table');
    }
    else if (response.name == null) {
        table.classList.add('skater-stats-table-with-seasons');
    }
    else {
        table.classList.add('skater-stats-table-without-names');
    }

    var thead = document.createElement('thead');

    var headerRow = document.createElement('tr');
    fields.forEach(function(field) {
        var th = document.createElement('th');
        if (field === 'rank-and-name' || field === 'team') {
            th.style.position = 'relative';
            th.style.left = '5px';

            if (field === 'rank-and-name') {
                th.textContent = 'Name';

            }
            else {
                th.textContent = 'Team';
            }
        }
        else {
            var button = document.createElement('button');
            button.textContent = getFieldAbbreviation(field);
            button.classList.add('stat-sorting-button');
            
            th.textContent = '';
            th.appendChild(button);
        }
        
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    statViewingContainer.appendChild(table);      

    for (var i = 0; i < skaterStats.length; i++) {       
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
            var td = document.createElement('td');

            if (field === 'rank-and-name') {
                td.classList.add('name-field');

                var rankSpan = document.createElement('span');
                rankSpan.innerHTML = (i + 1) + ".";

                var nameSpan = document.createElement('span');
                nameSpan.id = 'player-name';
                nameSpan.innerHTML = skaterStats[i].name;

                td.append(rankSpan);
                td.append(nameSpan);
            }
            else if (field === 'team') {
                td.classList.add('team-field');
                var textSpan = document.createElement('span');
                textSpan.textContent = skaterStats[i].team;

                if (response.name == null && skaterStats[i].team != 'N/A') {
                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('skater-stats-table-logo-container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[i];
                    teamLogo.alt = skaterStats[i].team + ' Logo';
                    teamLogo.classList.add('team-logo');
                    
                    teamLogoContainer.appendChild(teamLogo);   

                    td.appendChild(teamLogoContainer);
                }
                
                td.appendChild(textSpan);
            }
            else {
                if ((field == 'shooting_percentage' || field == 'faceoff_percentage') && skaterStats[i][field] != '--') {
                    td.textContent = round(parseFloat(skaterStats[i][field]), 3).toFixed(1);
                }
                else {
                    td.textContent = skaterStats[i][field];
                }
            }

            dataRow.appendChild(td);
        });

        tbody.appendChild(dataRow);
    }                      
}

function displayGoalieStats(response) {
    resetStatsScreen();

    var goalieStats = response.goalie_stats;
    var statViewingContainer = document.querySelector('#stat-viewing-container');

    var fields = [];

    // Add the fields to the table
    for (var key in goalieStats[0]) {
        if (goalieStats[0].hasOwnProperty(key) && goalieStats[0][key] !== null && key != 'type') {
            if (key == 'name') {
                fields.push('rank-and-name');
            }
            else {
                fields.push(key);
            }
        }
    }

    var table = document.createElement('table');
    if (response.first_season == response.last_season) {
        table.classList.add('goalie-stats-table');
    }
    else if (response.name == null) {
        table.classList.add('goalie-stats-table-with-seasons');
    } else {
        table.classList.add('goalie-stats-table-without-names');
    }                

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    fields.forEach(function(field) {
        var th = document.createElement('th');

        if (field === 'rank-and-name' || field === 'team') {
            th.style.position = 'relative';
            th.style.left = '5px';

            if (field === 'rank-and-name') {
                th.textContent = 'Name';

            }
            else {
                th.textContent = 'Team';
            }
        }
        else {
            var button = document.createElement('button');
            button.textContent = getFieldAbbreviation(field);
            button.classList.add('stat-sorting-button');
            
            th.textContent = '';
            th.appendChild(button);
        }
        
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    statViewingContainer.appendChild(table);      

    for (var i = 0; i < goalieStats.length; i++) {       

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
            var td = document.createElement('td');

            if (field === 'rank-and-name') {
                td.classList.add('name-field');

                var rankSpan = document.createElement('span');
                rankSpan.innerHTML = (i + 1) + ".";

                var nameSpan = document.createElement('span');
                nameSpan.id = 'player-name';
                nameSpan.innerHTML = goalieStats[i].name;

                td.append(rankSpan);
                td.append(nameSpan);
            }
            else if (field === 'team') {
                td.classList.add('team-field');
                var textSpan = document.createElement('span');
                textSpan.textContent = goalieStats[i].team;

                if (response.name == null && goalieStats[i].team != 'N/A') {
                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('goalie-stats-table-logo-container');
    
                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[i];
                    teamLogo.alt = goalieStats[i].team + ' Logo';
                    teamLogo.classList.add('team-logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                
    
                    td.appendChild(teamLogoContainer);
                }

                td.appendChild(textSpan);
            }
            else {
                if (goalieStats[i][field] != '--' && field == 'goals_against_average') {
                    td.textContent = round(parseFloat(goalieStats[i][field]), 2).toFixed(2);
                }
                else if (goalieStats[i][field] != '--' && field == 'save_percentage') {
                    td.textContent = round(parseFloat(goalieStats[i][field]), 3).toFixed(3);
                }
                else {
                    td.textContent = goalieStats[i][field];
                }
            }

            dataRow.appendChild(td);
        });

        tbody.appendChild(dataRow);
    }                      
}

var choice = null;
var skaterSearchBar = document.querySelector('#skater-search-bar');
if (skaterSearchBar != null) {
    skaterSearchBar.addEventListener('keypress', function(event) {
        var seasonTypeChangeButton = document.querySelector('#season-type-change-button');
        if (event.key === 'Enter') {
            choice = null; 
            seasonTypeChangeButton.style.visibility = 'visible';
            seasonTypeChangeButton.textContent = 'Playoffs';

            searchSkater(skaterSearchBar.value, 'Regular Season');
        }
    });
}

function searchSkaterToggleType() {
    var seasonTypeChangeButton = document.querySelector('#season-type-change-button');
    var skaterName = document.querySelector('#skater-search-bar').value;

    if (seasonTypeChangeButton.textContent == 'Regular Season') {
        seasonTypeChangeButton.textContent = 'Playoffs';
        searchSkater(skaterName, 'Regular Season');
    }
    else {
        seasonTypeChangeButton.textContent = 'Regular Season';
        searchSkater(skaterName, 'Playoffs');
    }
}

function searchSkater(skaterName, type, stat, multiplier) {
    if (skaterName != '') {
        $.ajax({
            type: 'POST',
            url: '/get-skater-stats-for-one-skater',
            data: JSON.stringify({
                name: skaterName,
                type: type,
                stat: stat,
                multiplier: multiplier
            }),
            contentType: 'application/json',
            success: function(response) {
                var skaters = response.skaters;
                
                if (skaters.length == 0) {
                    alert('Error - skater not found');
                    return;
                }
                if (skaters.length > 1) {
                    if (choice == null) {
                        choice = -1;

                        while (!(choice >= 1 && choice <= skaters.length)) {
                            var message = `Which + '${skaterName}' would you like to select?`;
                            for (var i = 0; i < skaters.length; i++) {
                                message += `\n (${i+1}) ${skaters[i].birthday}`;
                                if (skaters[i] != skaters[skaters.length - 1]) {
                                    message += ',';
                                }
                            }
                            
                            choice = prompt(message);
                            if (!(choice >= 1 && choice <= skaters.length)) {
                                alert(`Error - choice must be between 1 and ${skaters.length}.`);
                            }
                        }
                    }
                    var skater = skaters[choice - 1];
                }
                else {
                    var skater = skaters[0];
                }
                
                if (type == 'Regular Season') {
                    var skater_stats = skater.seasons;
                }
                else {
                    var skater_stats = skater.playoffs;
                }

                var response = {
                    skater_stats: skater_stats,
                    name: skaterName
                }

                displaySkaterStats(response);

                // Mark the stat we are sorting by as such
                if (stat != null) {
                    var abbreviation = getFieldAbbreviation(stat);
                    var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                    var button = Array.from(statSortingButtons).find(btn =>
                        btn.textContent.trim() === abbreviation
                    );
                    button.classList.add('sorted-by-stat');

                    // Mark all of the successive stats in the column
                    var th = button.parentElement;

                    var table = document.querySelector('table');
                    var headerRow = table.querySelector('thead tr');

                    var thIndex = [...headerRow.children].indexOf(th);

                    var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                    tds.forEach(td => {
                        td.classList.add('sorted-by-stat');
                    });
                }
                
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                statSortingButtons.forEach(function(button) {                
                    button.addEventListener('click', function() {
                        var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                        if (sortedByStatButton == button) {
                            multiplier *= -1;
                        }
                        else {
                            multiplier = 1;
                        }

                        var stat = getStatNameFromAbbreviation(button.textContent);
                        searchSkater(skaterName, type, stat, multiplier, choice);
                    });
                });
            },
            error: function() {
                alert('Error - skater not found');
            }
        });
    }
    else {
        alert('Error - no skater name provided.');
    }
}

var choice = null;
var goalieSearchBar = document.querySelector('#goalie-search-bar');
if (goalieSearchBar != null) {
    goalieSearchBar.addEventListener('keypress', function(event) {
        var seasonTypeChangeButton = document.querySelector('#season-type-change-button');
        if (event.key === 'Enter') {
            choice = null;
            seasonTypeChangeButton.style.visibility = 'visible';
            seasonTypeChangeButton.textContent = 'Playoffs';

            searchGoalie(goalieSearchBar.value, 'Regular Season');
        }
    });
}

function searchGoalieToggleType() {
    var seasonTypeChangeButton = document.querySelector('#season-type-change-button');
    var goalieName = document.querySelector('#goalie-search-bar').value;

    if (seasonTypeChangeButton.textContent == 'Regular Season') {
        seasonTypeChangeButton.textContent = 'Playoffs';
        searchGoalie(goalieName, 'Regular Season');
    }
    else {
        seasonTypeChangeButton.textContent = 'Regular Season';
        searchGoalie(goalieName, 'Playoffs');
    }
}

function searchGoalie(goalieName, type, stat, multiplier) {
    if (goalieName != '') {
        $.ajax({
            type: 'POST',
            url: '/get-goalie-stats-for-one-goalie',
            data: JSON.stringify({
                name: goalieName,
                type: type,
                stat: stat,
                multiplier: multiplier
            }),
            contentType: 'application/json',
            success: function(response) {
                var goalies = response.goalies;
                if (goalies.length == 0) {
                    alert('Error - goalie not found');
                    return;
                }
                else if (goalies.length > 1) {
                    choice = -1;

                    while (!(choice >= 1 && choice <= goalies.length)) {
                        var message = `Which + '${goalieName}' would you like to select?`;
                        for (var i = 0; i < goalies.length; i++) {
                            message += `\n (${i+1}) ${goalies[i].birthday}`;
                            if (goalies[i] != goalies[goalies.length - 1]) {
                                message += ',';
                            }
                        }
                        
                        choice = prompt(message);
                        if (!(choice >= 1 && choice <= goalies.length)) {
                            alert(`Error - choice must be between 1 and ${goalies.length}.`);
                        }
                    }
                    var goalie = goalies[choice - 1];
                }
                else {
                    var goalie = goalies[0];
                }
                
                if (type == 'Regular Season') {
                    var goalie_stats = goalie.seasons;
                }
                else {
                    var goalie_stats = goalie.playoffs;
                }

                var response = {
                    goalie_stats: goalie_stats,
                    name: goalieName
                }

                displayGoalieStats(response);

                // Mark the stat we are sorting by as such
                if (stat != null) {
                    var abbreviation = getFieldAbbreviation(stat);
                    var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                    var button = Array.from(statSortingButtons).find(btn =>
                        btn.textContent.trim() === abbreviation
                    );
                    button.classList.add('sorted-by-stat');

                    // Mark all of the successive stats in the column
                    var th = button.parentElement;

                    var table = document.querySelector('table');
                    var headerRow = table.querySelector('thead tr');

                    var thIndex = [...headerRow.children].indexOf(th);

                    var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                    tds.forEach(td => {
                        td.classList.add('sorted-by-stat');
                    });
                }
                
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                statSortingButtons.forEach(function(button) {                
                    button.addEventListener('click', function() {
                        var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                        if (sortedByStatButton == button) {
                            multiplier *= -1;
                        }
                        else {
                            multiplier = 1;
                        }

                        var stat = getStatNameFromAbbreviation(button.textContent);                    
                        searchGoalie(goalieName, type, stat, multiplier);
                    });
                });
            },
            error: function() {
                alert('Error - goalie not found');
            }
        });
    }
    else {
        alert('Error - no goalie name provided.');
    }
}

function displayStandingsTypes() {
    var season = document.querySelector('#season-dropdown-button').textContent;
    if (!isValidSeason(season)) {
        alert('Error - a season must be selected first');
        return;
    }

    // Get all of the standings types
    var standingsTypeDropdownItems = document.querySelectorAll('.standings-type-dropdown-option');
    var standingsTypeSelector = document.querySelector('#standings-type-selector');
    var standingsTypeDropdownButton = document.querySelector('#standings-type-dropdown-button');

    standingsTypeDropdownItems.forEach(standingsTypeDropdownItem => {
        var standingsType = standingsTypeDropdownItem.textContent;
        if (didStandingsTypeExistInSeason(standingsType, season)) {
            standingsTypeDropdownItem.style.display = 'block';
        }
    });
    
    standingsTypeSelector.style.display = 'block';

    standingsTypeDropdownItems.forEach(standingsTypeDropdownItem => {
        standingsTypeDropdownItem.addEventListener('click', function () {
            standingsTypeSelector.style.display = 'none';

            standingsTypeDropdownItems.forEach(item => {
                item.style.display = 'none';
            });

            standingsTypeDropdownButton.textContent = standingsTypeDropdownItem.textContent;
            standingsTypeDropdownButton.style.fontSize = '14px';
        });
    });
}

function fetchStandings() {
    var standingsType = document.querySelector('#standings-type-dropdown-button').textContent;
    var season = document.querySelector('#season-dropdown-button').textContent;

    if (standingsType == 'Wildcard') {
        fetchWildcardStandings(season);
    }
    else if (standingsType == 'Division') {
        fetchDivisionStandings(season);
    }
    else if (standingsType == 'Conference') {
        fetchConferenceStandings(season);
    }
    else {
        fetchLeagueStandings(season);
    }
}

function fetchWildcardStandings(season) {
    $.ajax({
        type: 'POST',
        url: '/get-wildcard-standings',
        data: JSON.stringify({
            season: season
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = null;
            multiplier = -1;
            resetStatsScreen();
            displayWildcardStandings(response);
        }
    });
}

function displayWildcardStandings(response) {
    resetStatsScreen();

    var standings = response.wildcard_standings;
    var statViewingContainer = document.querySelector('#stat-viewing-container');
    
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
                fields.push('rank-and-team');
                for (var key in standings[i]) {
                    if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                        if (key !== 'city' && key !== 'name') {
                            fields.push(key);
                        }
                    }
                }
        
                var table = document.createElement('table');
                table.classList.add('standings-table');
                var thead = document.createElement('thead');
        
                var headerRow = document.createElement('tr');
                fields.forEach(function(field) {
                    var th = document.createElement('th');
                
                    if (field === 'rank-and-team') {
                        th.classList.add('name-field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat-sorting-button');
                        
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
                if (field === 'rank-and-team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings-team');

                    // check if the team has a clinching marker
                    var clinchingMarker = document.createElement('span');
                    if (response.clinching_markers[fullTeamName] != null) {
                        clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                        clinchingMarker.classList.add('clinching-marker');
                    }
                    else {
                        clinchingMarker.classList.add('clinching-marker-placeholder');
                    } 

                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('standings-table-logo-container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[teamIndex];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team-logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name-field');
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

function fetchDivisionStandings(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get-division-standings',
        data: JSON.stringify({
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            resetStatsScreen();
            displayDivisionStandings(response, season);
        
            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var buttons = Array.from(statSortingButtons).filter(btn =>
                    btn.textContent.trim() === abbreviation
                );

                buttons.forEach(button => {
                    button.classList.add('sorted-by-stat');

                    // Mark all of the successive stats in the column
                    var th = button.parentElement;

                    var table = document.querySelector('table');
                    var headerRow = table.querySelector('thead tr');

                    var thIndex = [...headerRow.children].indexOf(th);

                    var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                    tds.forEach(td => {
                        td.classList.add('sorted-by-stat');
                    });
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchDivisionStandings(season, stat, multiplier);
                });
            });
        }
    });
}

function displayDivisionStandings(response) {
    resetStatsScreen();

    var standings = response.division_standings;
    var statViewingContainer = document.querySelector('#stat-viewing-container');
    
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
                fields.push('rank-and-team');
                for (var key in standings[i]) {
                    if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                        if (key !== 'city' && key !== 'name') {
                            fields.push(key);
                        }
                        
                    }
                }
        
                var table = document.createElement('table');
                table.classList.add('standings-table');

                var thead = document.createElement('thead');
        
                var headerRow = document.createElement('tr');
                fields.forEach(function(field) {
                    var th = document.createElement('th');

                    if (field === 'rank-and-team') {
                        th.classList.add('name-field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat-sorting-button');
                        
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

                if (field === 'rank-and-team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings-team');

                    // check if the team has a clinching marker
                    var clinchingMarker = document.createElement('span');
                    if (response.clinching_markers[fullTeamName] != null) {
                        clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                        clinchingMarker.classList.add('clinching-marker');
                    }
                    else {
                        clinchingMarker.classList.add('clinching-marker-placeholder');
                    } 

                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('standings-table-logo-container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[teamIndex];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team-logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name-field');
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

function fetchConferenceStandings(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get-conference-standings',
        data: JSON.stringify({
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            resetStatsScreen();
            displayConferenceStandings(response, season);
        
            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var buttons = Array.from(statSortingButtons).filter(btn =>
                    btn.textContent.trim() === abbreviation
                );

                buttons.forEach(button => {
                    button.classList.add('sorted-by-stat');

                    // Mark all of the successive stats in the column
                    var th = button.parentElement;

                    var table = button.closest('table');
                    var headerRow = table.querySelector('thead tr');

                    var thIndex = [...headerRow.children].indexOf(th);

                    var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                    tds.forEach(td => {
                        td.classList.add('sorted-by-stat');
                    });
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchConferenceStandings(season, stat, multiplier);
                });
            });
        }
    });
}

function displayConferenceStandings(response) {
    resetStatsScreen();

    var standings = response.conference_standings;
    var statViewingContainer = document.querySelector('#stat-viewing-container');
    
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
                fields.push('rank-and-team');
                for (var key in standings[i]) {
                    if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                        if (key !== 'city' && key !== 'name') {
                            fields.push(key);
                        }
                        
                    }
                }
        
                var table = document.createElement('table');
                table.classList.add('standings-table');

                var thead = document.createElement('thead');
        
                var headerRow = document.createElement('tr');
                fields.forEach(function(field) {
                    var th = document.createElement('th');

                    if (field === 'rank-and-team') {
                        th.classList.add('name-field');
                        th.textContent = getFieldAbbreviation(field);
                    } 
                    else {
                        var button = document.createElement('button');
                        button.textContent = getFieldAbbreviation(field);
                        button.classList.add('stat-sorting-button');
                        
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

                if (field === 'rank-and-team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings-team');

                    // check if the team has a clinching marker
                    var clinchingMarker = document.createElement('span');
                    if (response.clinching_markers[fullTeamName] != null) {
                        clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                        clinchingMarker.classList.add('clinching-marker');
                    }
                    else {
                        clinchingMarker.classList.add('clinching-marker-placeholder');
                    } 

                    var teamLogoContainer = document.createElement('span');
                    teamLogoContainer.classList.add('standings-table-logo-container');

                    var teamLogo = document.createElement('img');
                    teamLogo.src = response.logos[teamIndex];
                    teamLogo.alt = fullTeamName + ' Logo';
                    teamLogo.classList.add('team-logo');
                    
                    teamLogoContainer.appendChild(teamLogo);                                

                    td.appendChild(rankSpan);
                    td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                    td.appendChild(teamLogoContainer);
                    td.appendChild(textSpan);

                    td.classList.add('name-field');
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

function fetchLeagueStandings(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get-league-standings',
        data: JSON.stringify({
            type: 'Regular Season',
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            resetStatsScreen();
            displayLeagueStandings(response, season);
        
            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var buttons = Array.from(statSortingButtons).filter(btn =>
                    btn.textContent.trim() === abbreviation
                );

                buttons.forEach(button => {
                    button.classList.add('sorted-by-stat');

                    // Mark all of the successive stats in the column
                    var th = button.parentElement;

                    var table = button.closest('table');
                    var headerRow = table.querySelector('thead tr');

                    var thIndex = [...headerRow.children].indexOf(th);

                    var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                    tds.forEach(td => {
                        td.classList.add('sorted-by-stat');
                    });
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchLeagueStandings(season, stat, multiplier);
                });
            });
        }
    });
}

function displayLeagueStandings(response) {
    resetStatsScreen();

    var standings = response.league_standings;
    var statViewingContainer = document.querySelector('#stat-viewing-container');
    
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
            fields.push('rank-and-team');
            for (var key in standings[i]) {
                if (standings[i].hasOwnProperty(key) && standings[i][key] !== null) {
                    if (key !== 'city' && key !== 'name') {
                        fields.push(key);
                    }
                    
                }
            }
    
            var table = document.createElement('table');
            table.classList.add('standings-table');

            var thead = document.createElement('thead');
    
            var headerRow = document.createElement('tr');
            fields.forEach(function(field) {
                var th = document.createElement('th');

                if (field === 'rank-and-team') {
                    th.classList.add('name-field');
                    th.textContent = getFieldAbbreviation(field);
                } 
                else {
                    var button = document.createElement('button');
                    button.textContent = getFieldAbbreviation(field);
                    button.classList.add('stat-sorting-button');
                    
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

            if (field === 'rank-and-team') {
                var fullTeamName = standings[i].city + ' ' + standings[i].name

                var rankSpan = document.createElement('span');
                rankSpan.innerHTML = rank + '. ';

                var textSpan = document.createElement('span');
                textSpan.textContent = fullTeamName;
                textSpan.classList.add('standings-team');

                // check if the team has a clinching marker
                var clinchingMarker = document.createElement('span');
                if (response.clinching_markers[fullTeamName] != null) {
                    clinchingMarker.textContent = response.clinching_markers[fullTeamName];
                    clinchingMarker.classList.add('clinching-marker');
                }
                else {
                    clinchingMarker.classList.add('clinching-marker-placeholder');
                } 

                var teamLogoContainer = document.createElement('span');
                teamLogoContainer.classList.add('standings-table-logo-container');

                var teamLogo = document.createElement('img');
                teamLogo.src = response.logos[teamIndex];
                teamLogo.alt = fullTeamName + ' Logo';
                teamLogo.classList.add('team-logo');
                
                teamLogoContainer.appendChild(teamLogo);                                

                td.appendChild(rankSpan);
                td.appendChild(clinchingMarker); // adds the actual marker or a blank placeholder
                td.appendChild(teamLogoContainer);
                td.appendChild(textSpan);

                td.classList.add('name-field');
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

function fetchTeamStats() {
    if (pageName == 'team-season-stats') {
        var type = 'Regular Season';
    }
    else {
        var type = 'Playoffs';
    }

    // Get the season(s)
    var singleSeasonButton = document.querySelector('#single-season-button');
    var multipleSeasonsButton = document.querySelector('#multiple-seasons-button');
    if (!singleSeasonButton.classList.contains('button-selected') && !multipleSeasonsButton.classList.contains('button-selected')) {
        alert('Error - no season selected');
        return;
    }
    else if (singleSeasonButton.classList.contains('button-selected')) {
        var season = document.querySelector('#season-dropdown-button').textContent;
        if (!isValidSeason(season)) {
            alert('Error - no season selected');
            return;
        }
        var firstSeason = season;
        var lastSeason = season;
    }
    else {
        var firstSeason = document.querySelector('#starting-season-text-field').value;
        var lastSeason = document.querySelector('#ending-season-text-field').value;
        if (!isValidSeason(firstSeason)) {
            alert('Error - invalid starting season');
            return;
        }
        else if (!isValidSeason(lastSeason)) {
            alert('Error - invalid ending season');
            return
        }
    }

    if (firstSeason == lastSeason) {
        fetchTeamStatsForOneSeason(type, season);
    }
    else {
        var sumResultsBetweenSeasons = document.querySelector('#checkbox-sum-results-between-seasons').checked;
        fetchTeamStatsForMultipleSeasons(type, firstSeason, lastSeason, sumResultsBetweenSeasons);
    }
}

function fetchTeamStatsForOneSeason(type, season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get-team-stats-for-one-season',
        data: JSON.stringify({
            type: type,
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {            
            displayTeamStats(response);

            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var button = Array.from(statSortingButtons).find(btn =>
                    btn.textContent.trim() === abbreviation
                );
                button.classList.add('sorted-by-stat');

                // Mark all of the successive stats in the column
                var th = button.parentElement;

                var table = document.querySelector('table');
                var headerRow = table.querySelector('thead tr');

                var thIndex = [...headerRow.children].indexOf(th);

                var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                tds.forEach(td => {
                    td.classList.add('sorted-by-stat');
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchTeamStatsForOneSeason(type, season, stat, multiplier);
                });
            });
        },
        error: function() {
            alert('Error - data entry is not complete yet');
        }
    });
}

function fetchTeamStatsForMultipleSeasons(type, firstSeason, lastSeason, sumResultsBetweenSeasons, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get-team-stats-for-multiple-seasons',
        data: JSON.stringify({
            type: type,
            first_season: firstSeason,
            last_season: lastSeason,
            sum_results_between_seasons: sumResultsBetweenSeasons,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {            
            displayTeamStats(response);

            // Mark the stat we are sorting by as such
            if (stat != null) {
                var abbreviation = getFieldAbbreviation(stat);
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                var button = Array.from(statSortingButtons).find(btn =>
                    btn.textContent.trim() === abbreviation
                );
                button.classList.add('sorted-by-stat');

                // Mark all of the successive stats in the column
                var th = button.parentElement;

                var table = document.querySelector('table');
                var headerRow = table.querySelector('thead tr');

                var thIndex = [...headerRow.children].indexOf(th);

                var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                tds.forEach(td => {
                    td.classList.add('sorted-by-stat');
                });
            }
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

            statSortingButtons.forEach(function(button) {                
                button.addEventListener('click', function() {
                    var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                    if (sortedByStatButton == button) {
                        multiplier *= -1;
                    }
                    else {
                        multiplier = 1;
                    }

                    var stat = getStatNameFromAbbreviation(button.textContent);                    
                    fetchTeamStatsForMultipleSeasons(type, firstSeason, lastSeason, sumResultsBetweenSeasons, stat, multiplier);
                });
            });
        },
        error: function() {
            alert('Error - data entry is not complete yet');
        }
    });
}

function displayTeamStats(response) {
    resetStatsScreen();

    var teamStats = response.team_stats;
    var statViewingContainer = document.querySelector('#stat-viewing-container');

    var fields = [];

    // Add the fields to the table
    if (response.team == null) {
        fields.push('rank-and-team');
    }
    for (var key in teamStats[0]) {
        if (teamStats[0].hasOwnProperty(key) && teamStats[0][key] !== null) {
            if (key !== 'city' && key !== 'name' && key !== 'type') {
                fields.push(key);
            }
        }
    }

    var table = document.createElement('table');
    if (response.team != null) {
        table.classList.add('team-stats-table-without-names');   
    }
    else if (response.first_season == response.last_season) {
        table.classList.add('team-stats-table');   
    }
    else {
        table.classList.add('team-stats-table-with-seasons');   
    }      

    var thead = document.createElement('thead');

    var headerRow = document.createElement('tr');
    fields.forEach(function(field) {
        var th = document.createElement('th');

        if (field === 'rank-and-team') {
            th.classList.add('name-field');
            th.textContent = getFieldAbbreviation(field);
        } 
        else {
            var button = document.createElement('button');
            button.textContent = getFieldAbbreviation(field);
            button.classList.add('stat-sorting-button');
            
            th.textContent = '';
            th.appendChild(button);
        }
        
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    statViewingContainer.appendChild(table);      

    for (var i = 0; i < teamStats.length; i++) {       
        var table = document.querySelector('table');

        var tbody = table.querySelector('tbody');
    
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }
        var tbody = table.querySelector('tbody');

        var dataRow = document.createElement('tr');
        fields.forEach(function(field) {
            var td = document.createElement('td');

            if (field === 'rank-and-team') {
                var fullTeamName = teamStats[i].city + ' ' + teamStats[i].name

                var rankSpan = document.createElement('span');
                rankSpan.innerHTML = (i + 1) + '. ';

                var textSpan = document.createElement('span');
                textSpan.textContent = fullTeamName;
                textSpan.classList.add('team-stats-team');

                var teamLogoContainer = document.createElement('span');
                teamLogoContainer.classList.add('team-stats-table-logo-container');

                var teamLogo = document.createElement('img');
                teamLogo.src = response.logos[i];
                teamLogo.alt = fullTeamName + ' Logo';
                teamLogo.classList.add('team-logo');
                
                teamLogoContainer.appendChild(teamLogo);                                

                td.appendChild(rankSpan);
                td.appendChild(teamLogoContainer);
                td.appendChild(textSpan);

                td.classList.add('name-field');
            }
            else {
                if ((field === 'powerplay_percentage' || field === 'penalty_kill_percentage' ||
                    field === 'net_powerplay_percentage' || field === 'net_penalty_kill_percentage'
                    || field === 'faceoff_win_percentage') && teamStats[i][field] != '--') {
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
            dataRow.appendChild(td);
        });

        tbody.appendChild(dataRow);
    }
}

var choice = null;
var teamSearchBar = document.querySelector('#team-search-bar');
if (teamSearchBar != null) {
    teamSearchBar.addEventListener('keypress', function(event) {
        var seasonTypeChangeButton = document.querySelector('#season-type-change-button');
        if (event.key === 'Enter') {
            choice = null; 
            seasonTypeChangeButton.style.visibility = 'visible';
            seasonTypeChangeButton.textContent = 'Playoffs';

            searchTeam(teamSearchBar.value, 'Regular Season');
        }
    });
}

function searchTeamToggleType() {
    var seasonTypeChangeButton = document.querySelector('#season-type-change-button');
    var team = document.querySelector('#team-search-bar').value;

    if (seasonTypeChangeButton.textContent == 'Regular Season') {
        seasonTypeChangeButton.textContent = 'Playoffs';
        searchTeam(team, 'Regular Season');
    }
    else {
        seasonTypeChangeButton.textContent = 'Regular Season';
        searchTeam(team, 'Playoffs');
    }
}

function searchTeam(team, type, stat, multiplier) {
    if (team != '') {
        $.ajax({
            type: 'POST',
            url: '/get-team-stats-for-one-team',
            data: JSON.stringify({
                team: team,
                type: type,
                stat: stat,
                multiplier: multiplier
            }),
            contentType: 'application/json',
            success: function(response) {
                displayTeamStats(response);

                // Mark the stat we are sorting by as such
                if (stat != null) {
                    var abbreviation = getFieldAbbreviation(stat);
                    var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                    var button = Array.from(statSortingButtons).find(btn =>
                        btn.textContent.trim() === abbreviation
                    );
                    button.classList.add('sorted-by-stat');

                    // Mark all of the successive stats in the column
                    var th = button.parentElement;

                    var table = document.querySelector('table');
                    var headerRow = table.querySelector('thead tr');

                    var thIndex = [...headerRow.children].indexOf(th);

                    var tds = table.querySelectorAll(`tbody tr td:nth-child(${thIndex + 1})`);

                    tds.forEach(td => {
                        td.classList.add('sorted-by-stat');
                    });
                }
                
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

                statSortingButtons.forEach(function(button) {                
                    button.addEventListener('click', function() {
                        var sortedByStatButton = document.querySelector('button.sorted-by-stat');

                        if (sortedByStatButton == button) {
                            multiplier *= -1;
                        }
                        else {
                            multiplier = 1;
                        }

                        var stat = getStatNameFromAbbreviation(button.textContent);
                        searchTeam(team, type, stat, multiplier);
                    });
                });
            },
            error: function() {
                alert('Error - team not found');
            }
        });
    }
    else {
        alert('Error - no team provided.');
    }
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

function getFieldAbbreviation(stat) {
    switch (stat) {
        case 'rank-and-team':
            return 'Team';
        case 'rank_and_team':
            return 'Team';

        case 'season':
            return 'Season';

        case 'name':
            return 'Name';

        case 'team':
            return 'Team';

        case 'games-played':
            return 'GP';
        case 'games_played':
            return 'GP';

        case 'wins':
            return 'W';
            
        case 'losses':
            return 'L';

        case 'ties':
            return 'T'

        case 'overtime-losses':
            return 'OTL';
        case 'overtime_losses':
            return 'OTL';

        case 'points':
            return 'PTS';

        case 'points-percentage':
            return 'P%';
        case 'points_percentage':
            return 'P%';

        case 'regulation-wins':
            return 'RW';
        case 'regulation_wins':
            return 'RW';

        case 'regulation-and-overtime-wins':
            return 'ROW';
        case 'regulation_and_overtime_wins':
            return 'ROW';

        case 'goals-for':
            return 'GF';
        case 'goals_for':
            return 'GF';

        case 'goals-against':
            return 'GA';
        case 'goals_against':
            return 'GA';

        case 'goal-differential':
            return 'DIFF';
        case 'goal_differential':
            return 'DIFF';

        case 'home':
            return 'HOME';

        case 'away':
            return 'AWAY';

        case 'shootout':
            return 'S/O';
        
        case 'last-10':
            return 'L10';
        case 'last_10':
            return 'L10';
            
        case 'streak':
            return 'STRK';

        case 'shootout-wins':
            return 'SOW';
        case 'shootout_wins':
            return 'SOW';

        case 'goals-for-per-game':
            return 'GF/GP';
        case 'goals_for_per_game':
            return 'GF/GP';

        case 'goals-against-per-game':
            return 'GA/GP';
        case 'goals_against_per_game':
            return 'GA/GP';

        case 'powerplay-percentage':
            return 'PP%';
        case 'powerplay_percentage':
            return 'PP%';

        case 'penalty-kill-percentage':
            return 'PK%';
        case 'penalty_kill_percentage':
            return 'PK%';

        case 'net-powerplay-percentage':
            return 'NPP%';
        case 'net_powerplay_percentage':
            return 'NPP%';

        case 'net-penalty-kill-percentage':
            return 'NPK%';
        case 'net_penalty_kill_percentage':
            return 'NPK%';
        
        case 'faceoff-win-percentage':
            return 'FOW%';
        case 'faceoff_win_percentage':
            return 'FOW%';

        case 'goals':
            return 'G';

        case 'assists':
            return 'A';

        case 'plus-minus':
            return '+/-';
        case 'plus_minus':
            return '+/-';

        case 'penalty-minutes':
            return 'PIM';
        case 'penalty_minutes':
            return 'PIM';

        case 'powerplay-goals':
            return 'PPG';
        case 'powerplay_goals':
            return 'PPG';

        case 'powerplay-points':
            return 'PPP';
        case 'powerplay_points':
            return 'PPP';

        case 'shorthanded-goals':
            return 'SHG';
        case 'shorthanded_goals':
            return 'SHG';

        case 'shorthanded-points':
            return 'SHP';
        case 'shorthanded_points':
            return 'SHP';

        case 'time-on-ice-per-game':
            return 'TOI/G';
        case 'time_on_ice_per_game':
            return 'TOI/G';

        case 'game-winning-goals':
            return 'GWG';
        case 'game_winning_goals':
            return 'GWG';

        case 'overtime-goals':
            return 'OTG';
        case 'overtime_goals':
            return 'OTG';

        case 'shots':
            return 'S';

        case 'shooting-percentage':
            return 'S%';
        case 'shooting_percentage':
            return 'S%';

        case 'faceoff-percentage':
            return 'FO%';
        case 'faceoff_percentage':
            return 'FO%';

        case 'games-started':
            return 'GS';
        case 'games_started':
            return 'GS';

        case 'shots-against':
            return 'SA';
        case 'shots_against':
            return 'SA';

        case 'goals-against-average':
            return 'GAA';
        case 'goals_against_average':
            return 'GAA';

        case 'save-percentage':
            return 'SV%';
        case 'save_percentage':
            return 'SV%';

        case 'shutouts':
            return 'SO';

        case 'time-on-ice':
            return 'TOI';
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
            return 'games-played';

        case 'W':
            return 'wins';

        case 'L':
            return 'losses';

        case 'T':
            return 'ties';

        case 'OTL':
            return 'overtime-losses';

        case 'PTS':
            return 'points';

        case 'P%':
            return 'points-percentage';

        case 'RW':
            return 'regulation-wins';

        case 'ROW':
            return 'regulation-and-overtime-wins';

        case 'GF':
            return 'goals-for';

        case 'GA':
            return 'goals-against';

        case 'DIFF':
            return 'goal-differential';

        case 'HOME':
            return 'home';

        case 'AWAY':
            return 'away';

        case 'S/O':
            return 'shootout';

        case 'L10':
            return 'last-10';

        case 'STRK':
            return 'streak';

        case 'SOW':
            return 'shootout-wins';

        case 'GF/GP':
            return 'goals-for-per-game';

        case 'GA/GP':
            return 'goals-against-per-game';

        case 'PP%':
            return 'powerplay-percentage';

        case 'PK%':
            return 'penalty-kill-percentage';

        case 'NPP%':
            return 'net-powerplay-percentage';

        case 'NPK%':
            return 'net-penalty-kill-percentage';
        
        case 'FOW%':
            return 'faceoff-win-percentage';

        case 'G':
            return 'goals';

        case 'A':
            return 'assists';

        case '+/-':
            return 'plus-minus';

        case 'PIM':
            return 'penalty-minutes';

        case 'PPG':
            return 'powerplay-goals';

        case 'PPP':
            return 'powerplay-points';

        case 'SHG':
            return 'shorthanded-goals';

        case 'SHP':
            return 'shorthanded-points';

        case 'TOI/G':
            return 'time-on-ice-per-game';

        case 'GWG':
            return 'game-winning-goals';

        case 'OTG':
            return 'overtime-goals';

        case 'S':
            return 'shots';

        case 'S%':
            return 'shooting-percentage';

        case 'FO%':
            return 'faceoff-percentage';

        case 'GS':
            return 'games-started';

        case 'SA':
            return 'shots-against';

        case 'GAA':
            return 'goals-against-average';

        case 'SV%':
            return 'save-percentage';

        case 'SO':
            return 'shutouts';

        case 'TOI':
            return 'time-on-ice';
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

function resetStatsScreen() {
    var statViewingContainer = document.querySelector('#stat-viewing-container');

    if (pageName != 'skater-lookup' && pageName != 'goalie-lookup' && pageName != 'team-lookup') {
        statViewingContainer.innerHTML = '';
    }
    else {
        document.querySelectorAll("table").forEach(table => table.remove());
    }
}

function getFirstYear(season) {
    return parseInt(season.substring(0, 4), 10);
}

function round(num, places) {
    var factor = Math.pow(10, places);
    return Math.round(num * factor + 0.0000001) / factor;
}

function didTeamPlayInRange(team, firstSeason, lastSeason) {
    var firstSeasonFirstYear = getFirstYear(firstSeason);
    var lastSeasonFirstYear = getFirstYear(lastSeason);

    switch (team) {
        case 'All':
            return true;

        case 'Anaheim Ducks':
            if (firstSeasonFirstYear >= 1993 || lastSeasonFirstYear >= 1993) {
                return true;
            }
            return false;
        
        case 'Arizona Coyotes':
            if (firstSeasonFirstYear <= 2023 && lastSeasonFirstYear >= 2014) {
                return true;
            }
            return false;

        case 'Atlanta Flames':
            if (firstSeasonFirstYear <= 1979 && lastSeasonFirstYear >= 1972) {
                return true;
            }
            return false;
        
        case 'Atlanta Thrashers':
            if (firstSeasonFirstYear <= 2010 && lastSeasonFirstYear >= 1999) {
                return true;
            }
            return false;

        case 'Boston Bruins':
            if (firstSeasonFirstYear >= 1924 || lastSeasonFirstYear >= 1924) {
                return true;
            }
            return false;

        case 'Buffalo Sabres':
            if (firstSeasonFirstYear >= 1970 || lastSeasonFirstYear >= 1970) {
                return true;
            }
            return false;

        case 'Calgary Flames':
            if (firstSeasonFirstYear >= 1980 || lastSeasonFirstYear >= 1980) {
                return true;
            }
            return false;

        case 'California Golden Seals':
            if (firstSeasonFirstYear <= 1975 && lastSeasonFirstYear >= 1970) {
                return true;
            }
            return false;

        case 'Carolina Hurricanes':
            if (firstSeasonFirstYear >= 1997 || lastSeasonFirstYear >= 1997) {
                return true;
            }
            return false;

        case 'Chicago Blackhawks':
            if (firstSeasonFirstYear >= 1926 || lastSeasonFirstYear >= 1926) {
                return true;
            }
            return false;

        case 'Cleveland Barons':
            if (firstSeasonFirstYear <= 1977 && lastSeasonFirstYear >= 1976) {
                return true;
            }
            return false;

        case 'Colorado Avalanche':
            if (firstSeasonFirstYear >= 1995 || lastSeasonFirstYear >= 1995) {
                return true;
            }
            return false;

        case 'Colorado Rockies':
            if (firstSeasonFirstYear <= 1981 && lastSeasonFirstYear >= 1976) {
                return true;
            }
            return false;

        case 'Columbus Blue Jackets':
            if (firstSeasonFirstYear >= 1999 || lastSeasonFirstYear >= 1999) {
                return true;
            }
            return false;

        case 'Dallas Stars':
            if (firstSeasonFirstYear >= 1993 || lastSeasonFirstYear >= 1993) {
                return true;
            }
            return false;

        case 'Detroit Cougars':
            if (firstSeasonFirstYear <= 1929 && lastSeasonFirstYear >= 1926) {
                return true;
            }
            return false;

        case 'Detroit Falcons':
            if (firstSeasonFirstYear <= 1931 && lastSeasonFirstYear >= 1930) {
                return true;
            }
            return false;

        case 'Detroit Red Wings':
            if (firstSeasonFirstYear >= 1932 || lastSeasonFirstYear >= 1932) {
                return true;
            }
            return false;

        case 'Edmonton Oilers':
            if (firstSeasonFirstYear >= 1972 || lastSeasonFirstYear >= 1972) {
                return true;
            }
            return false;

        case 'Florida Panthers':
            if (firstSeasonFirstYear >= 1993 || lastSeasonFirstYear >= 1993) {
                return true;
            }
            return false;

        case 'Hamilton Tigers':
            if (firstSeasonFirstYear <= 1924 && lastSeasonFirstYear >= 1920) {
                return true;
            }
            return false;

        case 'Hartford Whalers':
            if (firstSeasonFirstYear <= 1996 && lastSeasonFirstYear >= 1979) {
                return true;
            }
            return false;

        case 'Kansas City Scouts':
            if (firstSeasonFirstYear <= 1975 && lastSeasonFirstYear >= 1974) {
                return true;
            }
            return false;

        case 'Los Angeles Kings':
            if (firstSeasonFirstYear >= 1967 || lastSeasonFirstYear >= 1967) {
                return true;
            }
            return false;

        case 'Minnesota North Stars':
            if (firstSeasonFirstYear <= 1992 && lastSeasonFirstYear >= 1967) {
                return true;
            }
            return false;

        case 'Minnesota Wild':
            if (firstSeasonFirstYear >= 1999 || lastSeasonFirstYear >= 1999) {
                return true;
            }
            return false;

        case 'Montreal Canadiens':
            return true;

        case 'Montreal Maroons':
            if (firstSeasonFirstYear <= 1937 && lastSeasonFirstYear >= 1924) {
                return true;
            }
            return false;
        
        case 'Montreal Wanderers':
            if (firstSeasonFirstYear <= 1917 || lastSeasonFirstYear <= 1917) {
                return true;
            }
            return false;

        case 'Nashville Predators':
            if (firstSeasonFirstYear >= 1998 || lastSeasonFirstYear >= 1998) {
                return true;
            }
            return false;

        case 'New Jersey Devils':
            if (firstSeasonFirstYear >= 1982 || lastSeasonFirstYear >= 1982) {
                return true;
            }
            return false;

        case 'New York Americans': 
            if (firstSeasonFirstYear <= 1940 && lastSeasonFirstYear >= 1925) {
                return true;
            }
            return false;

        case 'Brooklyn Americans':
            if (firstSeasonFirstYear <= 1942 && lastSeasonFirstYear >= 1941) {
                return true;
            }
            return false;

        case 'New York Islanders':
            if (firstSeasonFirstYear >= 1972 || lastSeasonFirstYear >= 1972) {
                return true;
            }
            return false;

        case 'New York Rangers':
            if (firstSeasonFirstYear >= 1926 || lastSeasonFirstYear >= 1926) {
                return true;
            }
            return false;

        case 'Oakland Seals':
            if (firstSeasonFirstYear <= 1969 && lastSeasonFirstYear >= 1967) {
                return true;
            }
            return false;

        case 'California Golden Seals':
            if (firstSeasonFirstYear <= 1975 && lastSeasonFirstYear >= 1970) {
                return true;
            }
            return false;

        case 'Ottawa Senators':
            if (firstSeasonFirstYear <= 1933 && lastSeasonFirstYear >= 1917 ||
                firstSeasonFirstYear >= 1992 || lastSeasonFirstYear >= 1992) {
                return true;
            }
            return false;

        case 'Philadelphia Flyers':
            if (firstSeasonFirstYear >= 1967 || lastSeasonFirstYear >= 1967) {
                return true;
            }
            return false;

        case 'Philadelphia Quakers':
            if (firstSeasonFirstYear <= 1930 && lastSeasonFirstYear >= 1930) {
                return true;
            }
            return false;

        case 'Phoenix Coyotes':
            if (firstSeasonFirstYear <= 2013 && lastSeasonFirstYear >= 1996) {
                return true;
            }
            return false;

        case 'Arizona Coyotes':
            if (firstSeasonFirstYear <= 2023 && lastSeasonFirstYear >= 2014) {
                return true;
            }
            return false;

        case 'Pittsburgh Penguins':
            if (firstSeasonFirstYear >= 1967 || lastSeasonFirstYear >= 1967) {
                return true;
            }
            return false;

        case 'Pittsburgh Pirates':
            if (firstSeasonFirstYear <= 1929 && lastSeasonFirstYear >= 1925) {
                return true;
            }
            return false;

        case 'Quebec Bulldogs':
            if (firstSeasonFirstYear <= 1919 && lastSeasonFirstYear >= 1919) {
                return true;
            }
            return false;

        case 'Quebec Nordiques':
            if (firstSeasonFirstYear <= 1994 && lastSeasonFirstYear >= 1972) {
                return true;
            }
            return false;

        case 'San Jose Sharks':
            if (firstSeasonFirstYear >= 1991 || lastSeasonFirstYear >= 1991) {
                return true;
            }
            return false;

        case 'Seattle Kraken':
            if (firstSeasonFirstYear >= 2022 || lastSeasonFirstYear >= 2022) {
                return true;
            }
            return false;

        case 'St. Louis Blues':
            if (firstSeasonFirstYear >= 1967 || lastSeasonFirstYear >= 1967) {
                return true;
            }
            return false;

        case 'St. Louis Eagles':
            if (firstSeasonFirstYear <= 1934 && lastSeasonFirstYear >= 1934) {
                return true;
            }
            return false;

        case 'Tampa Bay Lightning':
            if (firstSeasonFirstYear >= 1992 || lastSeasonFirstYear >= 1992) {
                return true;
            }
            return false;

        case 'Toronto Arenas':
            if (firstSeasonFirstYear <= 1918 && lastSeasonFirstYear >= 1917) {
                return true;
            }
            return false;

        case 'Toronto St. Patricks':
            if (firstSeasonFirstYear <= 1926 && lastSeasonFirstYear >= 1920) {
                return true;
            }
            return false;

        case 'Toronto Maple Leafs':
            if (firstSeasonFirstYear >= 1927 || lastSeasonFirstYear >= 1927) {
                return true;
            }
            return false;

        case 'Utah Hockey Club':
            if (firstSeasonFirstYear <= 2024 && lastSeasonFirstYear >= 2024) {
                return true;
            }
            return false;

        case 'Utah Mammoth':
            if (firstSeasonFirstYear >= 2025 || lastSeasonFirstYear >= 2025) {
                return true;
            }
            return false;

        case 'Vancouver Canucks':
            if (firstSeasonFirstYear >= 1970 || lastSeasonFirstYear >= 1970) {
                return true;
            }
            return false;

        case 'Vegas Golden Knights':
            if (firstSeasonFirstYear >= 2017 || lastSeasonFirstYear >= 2017) {
                return true;
            }
            return false;

        case 'Washington Capitals':
            if (firstSeasonFirstYear >= 1974 || lastSeasonFirstYear >= 1974) {
                return true;
            }
            return false;

        case 'Winnipeg Jets':
            if (firstSeasonFirstYear <= 1995 && lastSeasonFirstYear >= 1979 ||
                firstSeasonFirstYear >= 2011 || lastSeasonFirstYear >= 2011) {
                return true;
            }
            return false;
    }
    return false;
}

function didStandingsTypeExistInSeason(type, season) {
    switch (type) {
        case 'Wildcard':
            return isWildcardSeason(season);

        case 'Division':
            return isDivisionSeason(season);
            
        case 'Conference':
            return isConferenceSeason(season);

        case 'League':
            return true;
    }
    return false;
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