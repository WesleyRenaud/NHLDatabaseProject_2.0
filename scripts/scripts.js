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
    teamDropdownButton.textContent = 'Select Team';
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
    teamDropdownButton.textContent = 'Select Team';
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
        if (sortedByStat != null && field === sortedByStat) {
            th.classList.add('sorted-by-stat-button');
        }

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

            if (sortedByStat != null && field === sortedByStat) {
                td.classList.add('sorted-by-stat-button');
            }

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
    if (sortedByStat != null) {
        sortedByStat = sortedByStat.replace('-', '-');
    }
    fields.forEach(function(field) {
        var th = document.createElement('th');
        if (sortedByStat != null && field === sortedByStat) {
            th.classList.add('sorted-by-stat-button');
        }

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

            if (sortedByStat != null && field === sortedByStat) {
                td.classList.add('sorted-by-stat-button');
            }

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
                    textSpan.classList.add('standings-rank-and-team');

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
                else if (field === 'points-percentage') {
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
                
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted-by-stat-button');
                    }

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

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted-by-stat-button');
                }

                if (field === 'rank-and-team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings-rank-and-team');

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
                else if (field === 'points-percentage') {
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
            season: season
        }),
        contentType: 'application/json',
        success: function(response) {
            stat = null;
            multiplier = -1;
            resetStatsScreen();
            displayConferenceStandings(response, season);
        
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
        }
    });
}

function fetchLeagueStandings(season, stat, multiplier) {
    $.ajax({
        type: 'POST',
        url: '/get-league-standings',
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
        }
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

var sortedByStat = null;
var multiplier = -1;

function search(stat, type) {
    var searchBarValue = searchBar.value;

    $.ajax({
        type: 'POST',
        url: '/get-team-stats',
        data: JSON.stringify({
            team: searchBarValue,
            stat: sortedByStat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            var teamStats = response.team-stats;
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

                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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
            draftPosition: document.getElementById('draft-position').value,
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
        player.draftPosition = document.getElementById('draft-position').value;
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

    var gamesPlayed = document.getElementById('games-played').value;
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

    var plusMinus = document.getElementById('plus-minus').value;
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

    var penaltyMinutes = document.getElementById('penalty-minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var powerplayGoals = document.getElementById('powerplay-goals').value;
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

    var powerplayPoints = document.getElementById('powerplay-points').value;
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

    var shortHandedGoals = document.getElementById('shorthanded-goals').value;
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

    var shortHandedPoints = document.getElementById('shorthanded-points').value;
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

    var timeOnIcePerGame = document.getElementById('time-on-ice-per-game').value;
    if (isTimeOnIcePerGameSeason(season)) {
        if ((timeOnIcePerGame.length != 4 && timeOnIcePerGame.length != 5 || timeOnIcePerGame[timeOnIcePerGame.length - 3] != ':') &&
             timeOnIcePerGame != '--') {
            invalidFields.push('Time On Ice/Game');
        }
    }
    else {
        if (timeOnIcePerGame != 'null') {
            invalidFields.push('Time On Ice/Game');
        }
    }

    var gameWinningGoals = document.getElementById('game-winning-goals').value;
    gameWinningGoals = Number(gameWinningGoals);
    if (!Number.isInteger(gameWinningGoals) || gameWinningGoals > goals) {
        invalidFields.push('Game-Winning Goals');
    }

    var overtimeGoals = document.getElementById('overtime-goals').value;
    overtimeGoals = Number(overtimeGoals);
    if (!Number.isInteger(overtimeGoals) || overtimeGoals > goals) {
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

    var shootingPercentage = document.getElementById('shooting-percentage').value;
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

    var faceoffPercentage = document.getElementById('faceoff-percentage').value;
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

        window.location.href = 'add-skater.html';
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

    var gamesPlayed = document.getElementById('games-played').value;
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

    var plusMinus = document.getElementById('plus-minus').value;
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

    var penaltyMinutes = document.getElementById('penalty-minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var powerplayGoals = document.getElementById('powerplay-goals').value;
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

    var powerplayPoints = document.getElementById('powerplay-points').value;
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

    var shortHandedGoals = document.getElementById('shorthanded-goals').value;
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

    var shortHandedPoints = document.getElementById('shorthanded-points').value;
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

    var timeOnIcePerGame = document.getElementById('time-on-ice-per-game').value;
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

    var gameWinningGoals = document.getElementById('game-winning-goals').value;
    gameWinningGoals = Number(gameWinningGoals);
    if (!Number.isInteger(gameWinningGoals) || gameWinningGoals > goals) {
        invalidFields.push('Game-Winning Goals');
    }

    var overtimeGoals = document.getElementById('overtime-goals').value;
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

    var shootingPercentage = document.getElementById('shooting-percentage').value;
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

    var faceoffPercentage = document.getElementById('faceoff-percentage').value;
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

        window.location.href = 'add-skater.html';
    }
}

window.onload = function() {
    if (pageName == 'add-skater') {
        restoreSkaterStats();
    }
    else if (pageName == 'add-skater-regular-season') {
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
    else if (pageName == 'add-skater-playoffs') {
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
    else if (pageName == 'add-goalie') {
        restoreGoalieStats();
    }
    else if (pageName == 'add-goalie-regular-season') {
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
    else if (pageName == 'add-goalie-playoffs') {
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
        document.getElementById('draft-position').value = player.draftPosition;

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
    document.getElementById('games-played').value = skaterSeason.gamesPlayed;
    document.getElementById('goals').value = skaterSeason.goals;
    document.getElementById('assists').value = skaterSeason.assists;
    document.getElementById('points').value = skaterSeason.points;
    document.getElementById('plus-minus').value = skaterSeason.plusMinus;
    document.getElementById('penalty-minutes').value = skaterSeason.penaltyMinutes;
    document.getElementById('powerplay-goals').value = skaterSeason.powerplayGoals;
    document.getElementById('powerplay-points').value = skaterSeason.powerplayPoints;
    document.getElementById('shorthanded-goals').value = skaterSeason.shortHandedGoals;
    document.getElementById('shorthanded-points').value = skaterSeason.shortHandedPoints;
    document.getElementById('time-on-ice-per-game').value = skaterSeason.timeOnIcePerGame;
    document.getElementById('game-winning-goals').value = skaterSeason.gameWinningGoals;
    document.getElementById('overtime-goals').value = skaterSeason.overtimeGoals;
    document.getElementById('shots').value = skaterSeason.shots;
    if (isShootingPercentageSeason(season)) {
        document.getElementById('shooting-percentage').value = round(skaterSeason.shootingPercentage, 1).toFixed(1);
    }
    else {
        document.getElementById('shooting-percentage').value = skaterSeason.shootingPercentage;
    }
    if (isFaceoffPercentageSeason(season)) {
        document.getElementById('faceoff-percentage').value = round(skaterSeason.faceoffPercentage, 1).toFixed(1);
    }
    else {
        document.getElementById('faceoff-percentage').value = skaterSeason.faceoffPercentage;
    }
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
            url: '/add-skater',
            data: JSON.stringify(player),
            contentType: 'application/json',
            success: function() {
                emptyFields();
            }
        });
        
        emptyFields();
        var modal = document.getElementById('team-select-modal');
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
            draftPosition: document.getElementById('draft-position').value,
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
        player.draftPosition = document.getElementById('draft-position').value;
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

    var gamesPlayed = document.getElementById('games-played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0 || gamesPlayed >= 100) {
        invalidFields.push('Games Played');
    }

    var gamesStarted = document.getElementById('games-started').value;
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
    var overtimeLosses = document.getElementById('overtime-losses').value;
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

    var shotsAgainst = document.getElementById('shots-against').value;
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

    var goalsAgainstAverage = document.getElementById('goals-against-average').value;
    goalsAgainstAverage = Number(goalsAgainstAverage);
    if (goalsAgainstAverage < 0) {
        invalidFields.push('Goals Against Average');
    }

    var savePercentage = document.getElementById('save-percentage').value;
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

    var penaltyMinutes = document.getElementById('penalty-minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var timeOnIce = document.getElementById('time-on-ice').value;

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

        window.location.href = 'add-goalie.html';
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

    var gamesPlayed = document.getElementById('games-played').value;
    gamesPlayed = Number(gamesPlayed);
    if (!Number.isInteger(gamesPlayed) || gamesPlayed <= 0 || gamesPlayed >= 50) {
        invalidFields.push('Games Played');
    }

    var gamesStarted = document.getElementById('games-started').value;
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

    var overtimeLosses = document.getElementById('overtime-losses').value;
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

    var shotsAgainst = document.getElementById('shots-against').value;
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

    var goalsAgainstAverage = document.getElementById('goals-against-average').value;
    goalsAgainstAverage = Number(goalsAgainstAverage);
    if (goalsAgainstAverage < 0) {
        invalidFields.push('Goals Against Average');
    }

    var savePercentage = document.getElementById('save-percentage').value;
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

    var penaltyMinutes = document.getElementById('penalty-minutes').value;
    penaltyMinutes = Number(penaltyMinutes);
    if (!Number.isInteger(penaltyMinutes) || penaltyMinutes < 0) {
        invalidFields.push('Penalty Minutes');
    }

    var timeOnIce = document.getElementById('time-on-ice').value;

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

        window.location.href = 'add-goalie.html';
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
        document.getElementById('draft-position').value = player.draftPosition;

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
    document.getElementById('games-played').value = goalieSeason.gamesPlayed;
    document.getElementById('games-started').value = goalieSeason.gamesStarted;
    document.getElementById('wins').value = goalieSeason.wins;
    document.getElementById('losses').value = goalieSeason.losses;
    document.getElementById('ties').value = goalieSeason.ties;
    if (goalieSeason.overtimeLosses == null){
        document.getElementById('overtime-losses').value = 'null';
    }
    else {
        document.getElementById('overtime-losses').value = goalieSeason.overtimeLosses;
    }
    document.getElementById('shots-against').value = goalieSeason.shotsAgainst;
    document.getElementById('goals-against-average').value = round(goalieSeason.goalsAgainstAverage, 2).toFixed(2);
    document.getElementById('save-percentage').value = round(goalieSeason.savePercentage, 3).toFixed(3);
    document.getElementById('shutouts').value = goalieSeason.shutouts;
    document.getElementById('goals').value = goalieSeason.goals;
    document.getElementById('assists').value = goalieSeason.assists;
    document.getElementById('penalty-minutes').value = goalieSeason.penaltyMinutes;
    document.getElementById('time-on-ice').value = goalieSeason.timeOnIce;
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
            url: '/add-goalie',
            data: JSON.stringify(player),
            contentType: 'application/json',
            success: function() {
                emptyFields();
            }
        });
        
        emptyFields();
        var modal = document.getElementById('team-select-modal');
        if (modal) {
            modal.remove();
        }
                
        player = null;
        localStorage.setItem('player', JSON.stringify(player));
    }
}

if (document.getElementById('faceoff-win-percentage') != null) {
    document.getElementById('faceoff-win-percentage').addEventListener('keydown', function(event) {
        if (event.key === 'Tab' && event.key != 'Shift') {
            event.preventDefault();
            document.getElementsByClassName('confirm-button')[0].focus();
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

    var gamesPlayed = document.getElementById('games-played').value;
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
    var overtimeLosses = document.getElementById('overtime-losses').value;
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

    var pointsPercentage = document.getElementById('points-percentage').value;
    pointsPercentage = Number(pointsPercentage);
    if (pointsPercentage < 0 || pointsPercentage > 1 || round(pointsPercentage, 3) != round((points / (2 * gamesPlayed)), 3)) {
        invalidFields.push('Points Percentage');
    }

    var regulationWins = document.getElementById('regulation-wins').value;
    regulationWins = Number(regulationWins);
    if (!Number.isInteger(regulationWins) || regulationWins < 0 || regulationWins > 82 || regulationWins > wins) {
        invalidFields.push('Regulation Wins');
    }

    var regulationAndOvertimeWins = document.getElementById('regulation-and-overtime-wins').value;
    regulationAndOvertimeWins = Number(regulationAndOvertimeWins);
    if (!Number.isInteger(regulationAndOvertimeWins) || regulationAndOvertimeWins < 0 || regulationAndOvertimeWins > 82
        || regulationAndOvertimeWins < regulationWins || regulationAndOvertimeWins > wins) {
        invalidFields.push('Regulation/Overtime Wins');
    }

    var goalsFor = document.getElementById('goals-for').value;
    goalsFor = Number(goalsFor);
    if (!Number.isInteger(goalsFor) || goalsFor < 0) {
        invalidFields.push('Goals For');
    }

    var goalsAgainst = document.getElementById('goals-against').value;
    goalsAgainst = Number(goalsAgainst);
    if (!Number.isInteger(goalsAgainst) || goalsAgainst < 0) {
        invalidFields.push('Goals Against');
    }

    var goalDifferential = document.getElementById('goal-differential').value;
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

    var shootoutWins = document.getElementById('shootout-wins').value;
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

    var last10 = document.getElementById('last-10').value;
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

    var goalsForPerGame = document.getElementById('goals-for-per-game').value;
    goalsForPerGame = Number(goalsForPerGame);
    if (round(goalsForPerGame, 2) != round((goalsFor / gamesPlayed), 2)) {
        invalidFields.push('Goals For/Game');
    }

    var goalsAgainstPerGame = document.getElementById('goals-against-per-game').value;
    goalsAgainstPerGame = Number(goalsAgainstPerGame);
    if (round(goalsAgainstPerGame, 2) != round((goalsAgainst / gamesPlayed), 2)) {
        invalidFields.push('Goals Against/Game');
    }

    var powerplayPercentage = document.getElementById('powerplay-percentage').value;
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

    var penaltyKillPercentage = document.getElementById('penalty-kill-percentage').value;
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

    var netPowerplayPercentage = document.getElementById('net-powerplay-percentage').value;
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

    var netPenaltyKillPercentage = document.getElementById('net-penalty-kill-percentage').value;
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

    var faceoffWinPercentage = document.getElementById('faceoff-win-percentage').value;
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
            url: '/add-team',
            data: JSON.stringify(team),
            contentType: 'application/json',
            success: function() {
                emptyFields();
            }
        });
    }
}

function areEmptyFields() {
    var statFields = document.querySelectorAll('.stat-field');

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
    var statFields = document.querySelectorAll('.stat-field');

    for (var field of statFields) {
        var input = field.querySelector('input');
        if (input) {
            input.value = '';
        }
    }
}


function displayStandings(season) {
    sortedByStat = null;
    multiplier = -1;

    if (isWildcardSeason(season)) {
        $.ajax({
            type: 'POST',
            url: '/get-wildcard-standings',
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
            url: '/get-division-standings',
            data: JSON.stringify({
                season: season
            }),
            contentType: 'application/json',
            success: function(response) {
                sortedByStat = null;
                multiplier = -1;
                resetStatsScreen();
                displayDivisionStandings(response, season);
                
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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
            url: '/get-league-standings',
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
                
                var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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

function displayConferenceStandings(response, season) {
    resetStatsScreen();

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
                
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted-by-stat-button');
                    }

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

                if (sortedByStat != null && field === sortedByStat) {
                    td.classList.add('sorted-by-stat-button');
                }

                if (field === 'rank-and-team') {
                    var fullTeamName = standings[i].city + ' ' + standings[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = rank + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    textSpan.classList.add('standings-rank-and-team');

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
                else if (field === 'points-percentage') {
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
            
                if (sortedByStat != null && field === sortedByStat) {
                    th.classList.add('sorted-by-stat-button');
                }

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

            if (sortedByStat != null && field === sortedByStat) {
                td.classList.add('sorted-by-stat-button');
            }

            if (field === 'rank-and-team') {
                var fullTeamName = standings[i].city + ' ' + standings[i].name

                var rankSpan = document.createElement('span');
                rankSpan.innerHTML = rank + '. ';

                var textSpan = document.createElement('span');
                textSpan.textContent = fullTeamName;
                textSpan.classList.add('standings-rank-and-team');

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
            else if (field === 'points-percentage') {
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

function getFieldAbbreviation(stat) {
    switch (stat) {
        case 'rank-and-team':
            return '\u00A0\u00A0Rank\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Team';
        case 'rank_and_team':
            return '\u00A0\u00A0Rank\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Team';

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

function getDivisionStandingsByStat(season, stat, multiplier) {
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
            sortedByStat = stat;

            displayDivisionStandings(response, season);
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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
        url: '/get-conference-standings',
        data: JSON.stringify({
            season: season,
            stat: stat,
            multiplier: multiplier
        }),
        contentType: 'application/json',
        success: function(response) {
            sortedByStat = stat;

            displayConferenceStandings(response, season);
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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
        url: '/get-league-standings',
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
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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
    var statViewingContainer = document.querySelector('#stat-viewing-container');

    if (pageName == 'standings') {
        //statViewingContainer.appendChild(statViewButtonContainer);
    }

    if (pageName != 'skater-lookup' && pageName != 'goalie-lookup' && pageName != 'team-lookup') {
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

function editTeam(type) {
    // prompt the user for the team and the season
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var teamAndSeasonFieldsContainer = document.createElement('div');
    teamAndSeasonFieldsContainer.classList.add('team-and-season-fields-container')
    
    var teamLabel = document.createElement('label');
    teamLabel.innerText = 'Team: ';
    var teamInput = document.createElement('input');
    teamInput.type = 'text';
    teamInput.id = 'modal-team';

    var teamField = document.createElement('div');
    teamField.appendChild(teamLabel);
    teamField.appendChild(teamInput);

    var seasonLabel = document.createElement('label');
    seasonLabel.innerText = 'Season: ';
    var seasonInput = document.createElement('input');
    seasonInput.type = 'text';
    seasonInput.id = 'modal-season';

    var seasonField = document.createElement('div');
    seasonField.appendChild(seasonLabel);
    seasonField.appendChild(seasonInput);

    teamAndSeasonFieldsContainer.appendChild(teamField);
    teamAndSeasonFieldsContainer.appendChild(seasonField);

    modalContent.appendChild(teamAndSeasonFieldsContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal-submit-button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var team = document.getElementById('modal-team').value;
        var season = document.getElementById('modal-season').value;

        if (team != '' && isValidSeason(season)) {
            document.body.removeChild(modal);

            $.ajax({
                type: 'POST',
                url: '/get-team-stats',
                data: JSON.stringify({
                    type: type,
                    team: team,
                    first_season: season,
                    last_season: season
                }),
                contentType: 'application/json',
                success: function(response) {
                    var teamStats = response.team-stats;
                    // re-populate the fields so they can be updated
                    document.getElementById('season').value = teamStats.season;
                    document.getElementById('city').value = teamStats.city;
                    document.getElementById('name').value = teamStats.name;
                    document.getElementById('games-played').value = teamStats.games_played;
                    document.getElementById('wins').value = teamStats.wins;
                    document.getElementById('losses').value = teamStats.losses;
                    if (type == 'Regular Season') {
                        if (isOvertimeLossesSeason(type, season)) {
                            document.getElementById('ties').value = 'null';
                            document.getElementById('overtime-losses').value = teamStats.overtime_losses;
                        }
                        else if (isTiesAndOvertimeLossesSeason(season)) {
                            document.getElementById('ties').value = team-stats.ties;
                            document.getElementById('overtime-losses').value = teamStats.overtime_losses;
                        }
                        else {
                            document.getElementById('ties').value = teamStats.ties;
                            document.getElementById('overtime-losses').value = 'null';
                        }
                    }
                    else {
                        document.getElementById('ties').value = 'null';
                        document.getElementById('overtime-losses').value = 'null';
                    }
                    document.getElementById('points').value = teamStats.points;
                    document.getElementById('points-percentage').value = teamStats.points_percentage.toFixed(3);
                    document.getElementById('regulation-wins').value = teamStats.regulation_wins;
                    document.getElementById('regulation-and-overtime-wins').value = teamStats.regulation_and_overtime_wins;
                    document.getElementById('goals-for').value = teamStats.goals_for;
                    document.getElementById('goals-against').value = teamStats.goals_against;
                    if (team.goal-differential > 0) {
                        document.getElementById('goal-differential').value = '+' + teamStats.goal_differential;
                    }
                    else {
                        document.getElementById('goal-differential').value = teamStats.goal_differential;
                    }
                    if (type == 'Regular Season') {
                        document.getElementById('home').value = teamStats.home;
                        document.getElementById('away').value = teamStats.away;
                    }
                    else {
                        document.getElementById('home').value = 'null';
                        document.getElementById('away').value = 'null';
                    }
                    if (type == 'Regular Season' && isOvertimeLossesSeason(type, season)) {
                        document.getElementById('shootout').value = teamStats.shootout;
                    }
                    else {
                        document.getElementById('shootout').value = 'null';
                    }
                    if (type == 'Regular Season') {
                        document.getElementById('last-10').value = teamStats.last_10;
                        document.getElementById('streak').value = teamStats.streak;
                    }
                    else {
                        document.getElementById('last-10').value = 'null';
                        document.getElementById('streak').value = 'null';
                    }
                    if (type == 'Regular Season' && isOvertimeLossesSeason(type, season)) {
                        document.getElementById('shootout-wins').value = teamStats.shootout_wins;
                    }
                    else {
                        document.getElementById('shootout-wins').value = 'null';
                    }
                    document.getElementById('goals-for-per-game').value = round(teamStats.goals_for_per_game, 2).toFixed(2);
                    document.getElementById('goals-against-per-game').value = round(teamStats.goals_against_per_game, 2).toFixed(2);
                    if (isTeamSpecialTeamsSeason(season)) {
                        document.getElementById('powerplay-percentage').value = round(teamStats.powerplay_percentage, 1).toFixed(1);
                        document.getElementById('penalty-kill-percentage').value = round(teamStats.penalty_kill_percentage, 1).toFixed(1);
                        document.getElementById('net-powerplay-percentage').value = round(teamStats.net_powerplay_percentage, 1).toFixed(1);
                        document.getElementById('net-penalty-kill-percentage').value = round(teamStats.net_penalty_kill_percentage, 1).toFixed(1);
                    }
                    else {
                        document.getElementById('powerplay-percentage').value = 'null';
                        document.getElementById('penalty-kill-percentage').value = 'null';
                        document.getElementById('net-powerplay-percentage').value = 'null';
                        document.getElementById('net-penalty-kill-percentage').value = 'null';
                    }
                    
                    if (isOvertimeLossesSeason(type, season)) {
                        document.getElementById('faceoff-win-percentage').value = round(teamStats.faceoff_win_percentage, 1).toFixed(1);
                    }
                    else {
                        document.getElementById('faceoff-win-percentage').value = 'null';
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


function isPeriodWithSkaterStat(stat, season) {
    switch (stat) {
        case 'plus-minus':
            if (isPlusMinusSeason(season)) {
                return true;
            }
            return false;

        case 'time-on-ice-per-game':
            if (isTimeOnIcePerGameSeason(season)) {
                return true;
            }
            return false;

        case 'shots':
            if (isShotsSeason(season)) {
                return true;
            }
            return false;

        case 'shooting-percentage':
            if (isShootingPercentageSeason(season)) {
                return true;
            }
            return false;

        case 'faceoff-percentage':
            if (isFaceoffPercentageSeason(season)) {
                return true;
            }
            return false;

        default:
            return true;
    }
}




function isPeriodWithGoalieStat(stat, season, type) {
    switch (stat) {
        case 'overtime-losses':
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


function getTeamStats(type, team, firstSeason, lastSeason) {
    sortedByStat = null;
    multiplier = -1;

    $.ajax({
        type: 'POST',
        url: '/get-team-stats',
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
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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

    var teamStats = response.team-stats;

    if (response.first_season == response.last_season && response.first_season == '1919-1920') {
        alert('There are no stats for the selected season.');
    }
    for (var i = 0; i < teamStats.length; i++) {       
        if (i == 0) {
            var fields = [];
    
            // Add the fields to the table
            if (response.team == null) {
                fields.push('rank-and-team');
            }
            for (var key in teamStats[i]) {
                if (teamStats[i].hasOwnProperty(key) && teamStats[i][key] !== null) {
                    if (key !== 'city' && key !== 'name' && key !== 'type') {
                        fields.push(key);
                    }
                }
            }
    
            var table = document.createElement('table');
            table.classList.add('team-stats-table');            

            var thead = document.createElement('thead');
    
            var headerRow = document.createElement('tr');
            fields.forEach(function(field) {
                if (response.team == 'all' || isPeriodWithTeamStat(field, response.first_season, response.last_season, type)) {
                    var th = document.createElement('th');
            
                    if (sortedByStat != null && field === sortedByStat) {
                        th.classList.add('sorted-by-stat-button');
                    }

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
                    td.classList.add('sorted-by-stat-button');
                }

                if (field === 'rank-and-team') {
                    var fullTeamName = teamStats[i].city + ' ' + teamStats[i].name

                    var rankSpan = document.createElement('span');
                    rankSpan.innerHTML = (i + 1) + '. ';

                    var textSpan = document.createElement('span');
                    textSpan.textContent = fullTeamName;
                    if (type == 'Regular Season') {
                        textSpan.classList.add('team-stats-rank-and-team');
                    }
                    else {
                        textSpan.classList.add('team-playoff-stats-rank-and-team');
                    }

                    var teamLogoContainer = document.createElement('span');
                    if (type == 'Regular Season') {
                        teamLogoContainer.classList.add('team-stats-table-logo-container');
                    }
                    else {
                        teamLogoContainer.classList.add('team-playoff-stats-table-logo-container');
                    }

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
                    if (teamStats[i][field] == 'null' || teamStats[i][field] == 'None' || teamStats[i][field] == null) {
                        td.textContent = '--';
                    }
                    else{
                        if ((field === 'powerplay-percentage' || field === 'penalty-kill-percentage' || field === 'net-powerplay-percentage' ||
                             field === 'net-penalty-kill-percentage' || field === 'faceoff-win-percentage') && teamStats[i][field] != '--') {
                            td.textContent = round(parseFloat(teamStats[i][field]), 2).toFixed(1);
                        }
                        else if (field === 'goals-for-per-game' || field === 'goals-against-per-game') {
                            td.textContent = round(parseFloat(teamStats[i][field]), 2).toFixed(2);
                        }
                        else if (field === 'points-percentage') {
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
        case 'overtime-losses':
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

        case 'shootout-wins':
            if (type == 'Playoffs') {
                return false;
            }
            else {
                if (seasonsFallInShootoutPeriod(lastSeason)) {
                    return true;
                }
                return false
            }

        case 'faceoff-win-percentage':
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

        case 'last-10':
            if (type == 'Playoffs') {
                return false;
            }
            return true;

        case 'streak':
            if (type == 'Playoffs') {
                return false;
            }
            return true;

        case 'powerplay-percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'penalty-kill-percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'net-powerplay-percentage':
            if (isTeamSpecialTeamsSeason(lastSeason)) {
                return true;
            }
            return false;

        case 'net-penalty-kill-percentage':
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
        url: '/get-team-stats',
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
            
            var statSortingButtons = document.querySelectorAll('.stat-sorting-button');

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
    modalContent.classList.add('modal-content');

    var skaterNameFieldContainer = document.createElement('div');
    skaterNameFieldContainer.classList.add('skater-name-field-container')
    
    var nameLabel = document.createElement('label');
    nameLabel.innerText = 'Name: ';
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'modal-name';

    var nameField = document.createElement('div');
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);

    skaterNameFieldContainer.appendChild(nameField);

    modalContent.appendChild(skaterNameFieldContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal-submit-button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var name = document.getElementById('modal-name').value;
        if (name != '') {
            document.body.removeChild(modal);

            $.ajax({
                type: 'POST',
                url: '/get-skater-stats',
                data: JSON.stringify({
                    name: name
                }),
                contentType: 'application/json',
                success: function(response) {
                    var skaters = response.skaters;
                    if (skaters.length > 1) {
                        // TO-DO: provide system for the user to choose between the players
                    }
                    else if (skaters.length == 1) {
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
                        document.getElementById('draft-position').value = skater.draft-position;

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
                            draftPosition: skater.draft-position,
                            seasons: [],
                            playoffs: [],
                        };

                        for (i = 0; i < skater.seasons.length; i++) {
                            player.seasons.push({
                                season: skater.seasons[i].season,
                                team: skater.seasons[i].team,
                                gamesPlayed: skater.seasons[i].games-played,
                                goals: skater.seasons[i].goals,
                                assists: skater.seasons[i].assists,
                                points: skater.seasons[i].points,
                                plusMinus: skater.seasons[i].plus-minus,
                                penaltyMinutes: skater.seasons[i].penalty-minutes,
                                powerplayGoals: skater.seasons[i].powerplay-goals,
                                powerplayPoints: skater.seasons[i].powerplay-points,
                                shortHandedGoals: skater.seasons[i].shorthanded-goals,
                                shortHandedPoints: skater.seasons[i].shorthanded-points,
                                timeOnIcePerGame: skater.seasons[i].time-on-ice-per-game,
                                gameWinningGoals: skater.seasons[i].game-winning-goals,
                                overtimeGoals: skater.seasons[i].overtime-goals,
                                shots: skater.seasons[i].shots,
                                shootingPercentage: skater.seasons[i].shooting-percentage,
                                faceoffPercentage: skater.seasons[i].faceoff-percentage
                            });         
                        }
                        for (i = 0; i < skater.playoffs.length; i++) {
                            player.playoffs.push({
                                season: skater.playoffs[i].season,
                                team: skater.playoffs[i].team,
                                gamesPlayed: skater.playoffs[i].games-played,
                                goals: skater.playoffs[i].goals,
                                assists: skater.playoffs[i].assists,
                                points: skater.playoffs[i].points,
                                plusMinus: skater.playoffs[i].plus-minus,
                                penaltyMinutes: skater.playoffs[i].penalty-minutes,
                                powerplayGoals: skater.playoffs[i].powerplay-goals,
                                powerplayPoints: skater.playoffs[i].powerplay-points,
                                shortHandedGoals: skater.playoffs[i].shorthanded-goals,
                                shortHandedPoints: skater.playoffs[i].shorthanded-points,
                                timeOnIcePerGame: skater.playoffs[i].time-on-ice-per-game,
                                gameWinningGoals: skater.playoffs[i].game-winning-goals,
                                overtimeGoals: skater.playoffs[i].overtime-goals,
                                shots: skater.playoffs[i].shots,
                                shootingPercentage: skater.playoffs[i].shooting-percentage,
                                faceoffPercentage: skater.playoffs[i].faceoff-percentage
                            });         
                        }
                        localStorage.setItem('player', JSON.stringify(player));

                        addEditSeasonButton('Skater');
                    }
                    else {
                        alert('Error - skater not found');
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
    modalContent.classList.add('modal-content');

    var skaterNameFieldContainer = document.createElement('div');
    skaterNameFieldContainer.classList.add('gaolie-name-field-container')
    
    var nameLabel = document.createElement('label');
    nameLabel.innerText = 'Name: ';
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'modal-name';

    var nameField = document.createElement('div');
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);

    skaterNameFieldContainer.appendChild(nameField);

    modalContent.appendChild(skaterNameFieldContainer);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal-submit-button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var name = document.getElementById('modal-name').value;
        if (name != '') {
            document.body.removeChild(modal);

            $.ajax({
                type: 'POST',
                url: '/get-goalie-stats',
                data: JSON.stringify({
                    name: name
                }),
                contentType: 'application/json',
                success: function(response) {
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
                        document.getElementById('draft-position').value = goalie.draft_position;

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
    editSeasonButton.className = 'edit-button';
    editSeasonButton.id = 'edit-season-button';
    editSeasonButton.textContent = 'Edit Season';
    editSeasonButton.onclick = function () {
        editSeason(playerType);
    };

    // Insert before the Submit Player button
    var container = document.getElementById('stat-adding-container');
    var submitButton = container.querySelector('.confirm-button');
    container.insertBefore(editSeasonButton, submitButton);
}

function editSeason(playerType) {
    // prompt the user for the skater's name
    var modal = document.createElement('div');
    modal.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var seasonTypeFieldContainer = document.createElement('div');
    seasonTypeFieldContainer.id = 'season-type-field-container';
    
    var regularSeasonButton = document.createElement('button');
    regularSeasonButton.innerText = 'Regular Season';
    regularSeasonButton.id = 'regular-season-season-type-button';
    var playoffsButton = document.createElement('button');
    playoffsButton.innerText = 'Playoffs';
    playoffsButton.id = 'playoffs-season-type-button';

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
    seasonInput.id = 'modal-season';

    var seasonField = document.createElement('div');
    seasonField.appendChild(seasonLabel);
    seasonField.appendChild(seasonInput);

    modalContent.appendChild(seasonTypeFieldContainer);
    modalContent.appendChild(seasonField);

    var submitButton = document.createElement('button');
    submitButton.classList.add('modal-submit-button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        var season = document.getElementById('modal-season').value;
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
                        window.location.href = 'add-skater-regular-season.html';
                    }
                    else {
                        window.location.href = 'add-goalie-regular-season.html';
                    }
                }
                else {
                    if (playerType == 'Skater') {
                        window.location.href = 'add-skater-playoffs.html';
                    }
                    else {
                        window.location.href = 'add-goalie-playoffs.html';
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
    modal.id = 'team-select-modal';

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var seasonLabel = document.createElement('label');
    seasonLabel.innerText = name + ' played for ' + teams.length + ' teams during the ' + season + 
                                ' season. ' + '\nPlease select the one whose stats you want to enter:\n';
    modalContent.appendChild(seasonLabel);

    var teamSelectContainer = document.createElement('div');
    teamSelectContainer.id = 'team-select-container';
    
    var buttons = [];
    for (i = 0; i < teams.length; i++) {
        var teamButton = document.createElement('button');
        teamButton.innerText = teams[i];
        teamButton.classList.add('team-button');
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
    submitButton.classList.add('modal-submit-button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = function() {
        if (team != null) {
            localStorage.setItem('team', JSON.stringify(team));
            
            if (pageName == 'add-skater') {
                    if (seasonType == 'Regular Season') {
                    window.location.href = 'add-skater-regular-season.html';
                }
                else {
                    window.location.href = 'add-skater-playoffs.html';
                }
            }
            else {
                if (seasonType == 'Regular Season') {
                    window.location.href = 'add-goalie-regular-season.html';
                }
                else {
                    window.location.href = 'add-goalie-playoffs.html';
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

function isGoalieTiesSeason(type, season) {
    if (type == 'Regular Season') {
        if (getFirstYear(season) <= 2003) {
            return true;
        }
    }
    else {
        if (getFirstYear(season) >= 1950) {
            return true;
        }
    }
    return false;
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