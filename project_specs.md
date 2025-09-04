##               NHL Database Project               ##


# Overview #
 * This project consists of an interface that allows users to retrieve NHL stats in a variety of forms


# Features #

Text UI:
 * Allows owners to add stats to the database

GUI:
 * See standings from a specific season sorted by any of the fields in the Team table and league-wide, 
   by conference, division, or of the wildcard race
 * See team stats for a specific playoffs by any of the fields in the Team table, and league-wide or 
   by conference
 * See league leaders for a season for any of the skater categories in the SkaterSeason table, or for 
   any of the goalie ategories in the GoalieSeason table
 * See the team leaders for a season in any of the skater categories in the SkaterSeason table, or in 
   any of the goalie categories in the GoalieSeason table
 * See all-time league-wide leaders or current league-wide leaders in any of the skater categories in 
   the SkaterSeason table, or in any of the goalie categories in the GoalieSeason table


# Implementation Details #


Database (a Python class that uses SQLite):
  Tables:
   * Skater: SKATERID, NAME, TEAM (NULL for retired players), NUMBER, POSITION, HEIGHT, WEIGHT, 
     BIRTHDAY, HANDEDNESS, DRAFT_POSITION
   * SkaterSeason: SKATERSEASONID, SKATERID, TYPE ('Regular Season' or 'Playoffs'), SEASON, 
     TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS, 
     POWERPLAY_POINTS, SHORTHANDED_GOALS, SHORTHANDED_POINTS, TIME_ON_ICE_PERGAME, GAME_, 
     WINNING_GOALS, OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE
   * Goalie: GOALIEID, NAME, TEAM (NULL for retired players), NUMBER, HEIGHT, WEIGHT, BIRTHDAY, 
     HANDEDNESS, DRAFT_POSITION
   * GoalieSeason: GOALIESEASONID, GOALIEID, TYPE ('Regular Season' or 'Playoffs'), SEASON, TEAM
     GAMES_PLAYED, GAMES_STARTED, WINS, LOSES, TIES, OVERTIME_LOSSES, SHOTS_AGAINST, 
     GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, TIME_ON_ICE
   * Team: TYPE ('Regular Season' or 'Playoffs'), SEASON, TEAMID, CITY, NAME, GAMES_PLAYED, WINS, 
     LOSES, TIES, OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
     REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT,
     LAST_10, STREAK, SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE,
     PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE, 
     FACEOFF_WIN_PERCENTAGE
   Methods:
   * init( reset ): creates a database connection to 'phylib.db', deleting the old database if reset
     is true
   * create_tables(): makes any of the tables listed above which do not already exist in the database
   * add_skater( skater ): adds a skater to the database by first adding their personal details to 
     the Skater table, then adding their regular season and playoff stats to the SkaterSeason table
   * add_goalie( goalie ): adds a goalie to the database by first adding their personal details to 
     the Goalie table, then adding their regular season and playoff stats to the GoalieSeason table
   * add_team( teams ): adds a team stats in either the regular season or the playoffs for a certin 
     season
   * get_standings_data( season ): returns a list of 'Team' objects with the fields needed for the 
     standings view from a given season
   * get_team_stats_for_one_team_for_one_season( type, team, season ): returns a Team object with all 
     of the stats for the given team in the given season
   * get_team_stats_for_one_team( team ): returns a list of Team objects with all of the stats for
     the given team for all the seasons which the team was active
     stats for all teams for the given season
   * get_team_stats( type, first_season, last_season ): returns a list of Team objects with all of
     the stats for all of the teams from the given first season up until the last season
   * get_skater_stats_for_one_season( type, season, team, position ): returns a list of SkaterSeason
     objects with all of the stats for all of the skaters for the given season, team, if 'team' is
     defined and for all teams otherwise, and position, if 'position' is defined and for all positions
     otherwise
   * get_skater_stats_for_one_player( name ): returns a list of Skaters objects with all of the stats
     of the skaters with the given name
   * get_skater_stats( type, first_season, last_season, team, position ): returns a list of 
     SkaterSeason objects with all of the stats for all of the skaters from the given first season up
     until the last season, team if 'team' is defined and for all teams otherwise, and position, if
     'position' is defined, and for all positions otherwise
   * get_goalie_stats_for_one_season( type, season, team ): returns a list of GoalieSeason objects
     with all of the stats for all of the goalies for the given season team and team, if 'team' is
     defined and for all teams otherwise
   * get_goalies_stats_for_one_player( name ): returns a list of Goalie objects with all of the stats
     of the goalies with the given name
   * get_goalie_stats( type, first_season, last_season, team ): returns a list of GoalieSeason
     objects with all of the stats for all of the goalies from the given first season up until the
     last season and team, if 'team' is defined and for all teams otherwise


NHL (Python module that contains the classes associated with the data in the database):
  skater_stats, goalie_stats: tuples of all of the stat names for each type of player 
  Classes:
   * Player:
      Attributes:
       * name, team (None for retired players), number (None for retired players), position, height, 
         weight, birthday, handedness, draft_position (None for undrafted)
   * Skater (extends Player):
      Attributes:
       * seasons (list of SkaterSeasons)
       * playoffs (list of SkaterSeasons)
      Methods:
       * add_season( season, team, games_played, goals, assists, points, plus_minus, penalty_minutes,
                     powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, 
                     time_on_ice_per_game, game_winning_goals, overtime_goals, shots, 
                     shooting_percentage, faceoff_percentage )
       * add_playoffs( season, team, games_played, goals, assists, points, plus_minus, 
                       penalty_minutes, powerplay_goals, powerplay_points, shorthanded_goals,
                       shorthanded_points, time_on_ice_per_game, game_winning_goals, overtime_goals,
                       shots, shooting_percentage, faceoff_percentage )
   * Goalie (extends Player):
      Attributes:
       * seasons (list of GoalieSeasons)
       * playoffs (list of GoalieSeasons)
      Methods:
       * add_season( season, team, games_played, games_started, wins, losses, ties, overtime_losses,
                     shots_against, goals_against_average, save_percentage, shutouts, goals, assists,
                     penalty_minutes, time_on_ice )
       * add_playoffs( season, team, games_played, games_started, wins, losses, ties, overtime_losses,
                       shots_against, goals_against_average, save_percentage, shutouts, goals, 
                       assists, penalty_minutes, time_on_ice )
   * SkaterSeason:
      Attributes:
       * type, season, team, games_played, goals, assists, points, plus_minus, penalty_minutes, 
         powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, 
         time_on_ice/game, game_winning_goals, overtime_goals, shots, shooting_percentage, 
         faceoff_percentage, name
   * GoalieSeason:
      Attributes:
       * type, season, games_played, games_started, wins, loses, ties, overtime_losses, shots_against, 
         goals_against_average, save_percentage, shutouts, goals, assists, penalty_minutes, 
         time_on_ice
   * Team:
      Attributes:
       * type, season, city, name, games_played, wins, loses, ties, overtime_losses, points, 
         points_percentage, regulation_wins, regulation_and_overtime_wins, goals_for, goals_against,
         goal_differential, home, away, shootout, last_10, streak, shootout_wins, goals_for_per_game,
         goals_against_per_game, powerplay_percentage, penalty_kill_percentage, 
         net_powerplay_percentage, net_penalty_kill_percentage, faceoff_win_percentage
      Methods:
       * get_full_name(): returns the city plus a whitespace plus the team name
   * NHLUtil:
      Methods:
       * get_division_standings( season, teams, stat, multiplier ): takes a list of teams and a 
         season, and using a season_to_teams_mapping file, creates a new list with the teams sorted
         into their divisions, sorted by a stat and a mutlipier (1 == descending, -1 == ascending)
         when given 
       * sort_teams_into_divisions( season, teams ): helper method that takes a list of teams and a
         season and sorts the teams into a 2-D array where each 'row' contains the team for one 
         division, and the teams in the rows are also sorted in the descending order of their number
         of points
       * get_conference_standings( season, teams, stat, multiplier ): takes a list of teams and a
         season, and using a season_to_teams_mapping file, creates a new list with the teams sorted
         into their conferences, sorted by a stat and a mutlipier (1 == descending, -1 == ascending)
         when given 
       * sort_teams_into_conferences( season, teams ): helper method that takes a list of teams and a
         season and sorts the teams into a 2-D array where each 'row' contains the team for one 
         conference, and the teams in the rows are also sorted in the descending order of their 
         number of points 
       * get_wildcard_standings( season, teams ): takes a list of teams and a season, and using a 
         season_to_teams_mapping file, creates a new list of teams with them sorted with their 
         divisions conferences to present the wildcard standings
       * get_team_logo_path( team, season ): returns the path to local image for the specified team
         in the specified season
       * get_first_season( file_name ): returns the first season from the name of a file representing
         a team's logo between two seasons, and the file name is of the form s1y1-s1y2_s2y1-s2y2.png
       * get_second_season( file_name ): returns the second season from the name of a file representing
         a team's logo between two seasons, and the file name is of the form s1y1-s1y2_s2y1-s2y2.png
       * is_in_between_seasons( target_season, first_season, second_season ): checks if the target 
         season is during the window between the first season and the second season, inclusively
       * get_clinching_markers( season, teams ): returns a list of clinching markers where the 
         clinching marker at each index in the list is the marker corresponding to the team at that
         index in the teams list, given the season which the teams are in
       * get_league_standings( season, teams, stat, multiplier ): takes a list of teams and a
         season, and sorts the teams in order of points, plus additional tie breakers when applicable
         or by a stat and a mutlipier (1 == descending, -1 == ascending) when given
       * team_stat_compare( team1, team2, stat, multiplier ): defines how to compare certain NHL team 
         stats which do not work using the standard formula (value2 - value1)
       * is_conference_season( season ): returns 'True' if the given season had conferences and 'False'
         if it did not
       * is_division_season( season ): returns 'True' if the given season had divisions and 'False'
         if it did not
       * get_first_year( season ): returns the first year from a season string in the form y1y1-y2y2
       * get_city( full_name ): takes the full name of a team (city and name) and returns the city 
         part, or None if the full name given is not valid
       * get_name( full_name ): takes the full name of a team (city and name) and returns the name 
         part, or None if the full name given is not valid
       * is_overtime_losses_season( type, season ): returns 'True' if the given season had overtime
         losses and no ties and 'False' otherwise
       * is_overtime_losses_and_ties_season( season ): returns 'True' if the given season had overtime 
         losses and ties and 'False' otherwise
       * is_ties_season( season ): returns 'True' if the given season had overtime loses and no ties
         and 'False' otherwise
       * is_faceoff_win_percentage_season( season ): returns 'True' if the given season tracked
         faceoff win percentage and 'False' otherwise
       * is_special_teams_season( season ): returns 'True' if the given season tracked special teams
         stats and 'False' otherwise
       * sort_teams_by_points( teams ): sorts a given list of teams by points percentage, then points, 
         then regulation wins, then regulation and overtime wins, and finally goals for
       * seasons_fall_in_ties_period( first_season ): returns 'True' if there was one or more seasons
         in from the first season onwards where ties were recorded, and 'False' otherwise
       * seasons_fall_in_overtime_losses_period( last_season ): returns 'True' if there was one or 
         more 
         seasons in between the first season and the last season where overtime losses were recorded,
         and 'False' otherwise
       * seasons_fall_in_faceoff_win_percentage_period( last_season ): returns 'True' if there was one 
         or more seasons in between the first season and the last season where faceoff win percetage 
         was recorded, and 'False' otherwise
       * seasons_fall_in_special_teams_period( last_season ): returns 'True' if there was one or more 
         seasons in between the first season and the last season where special teams stats were 
         recorded, and 'False' otherwise
       * seasons_fall_in_shootout_period( last_season ): returns 'True' if there was one or more 
         seasons from the last season or before where the shootout was active, and 'False' otherwise
       * sort_teams_by_wins( teams ): sorts a given list of teams by wins, and then points percentage
       * is_ties_in_playoffs_season( season ): returns 'True' if the given season had ties in the 
         playoffs and 'False' otherwise
       * seasons_fall_in_overtime_losses_in_playoffs_period( first_season, last_season ): returns 
         'True' if there was one or more seasons in between the first season and the last season 
         where overtime losses occurred during the playoffs, and 'False' otherwise
       * seasons_fall_in_ties_in_playoffs_period( first_season ): returns 'True' if there was one or
         more seasons in between the first season and the last season where ties occurred during the
         playoffs, and 'False' otherwise
       * get_sorted_skater_stats( skater_seasons, stat, multiplier ): sorts a given list of skater 
         seasons by points, and then goals if 'stat' and 'multiplier' are null, and by the stat in
         descending order if 'multiplier' equals 1, and in descending order if 'multiplier' equals
         -1
       * sort_seasons_by_season( seasons ): sorts a given list of seasons in ascending order
       * get_sorted_goalie_stats( goalie_seasons, stat, multiplier ): sorts a given list of goalie
         seasons by wins, and then save percentage if 'stat' and 'multiplier' are null, and by the
         stat in descending order if 'multiplier' equals 1, and in descending order if 'multiplier'
         equals -1
       * is_faceoff_percentage_season( season ): returns 'True' if the given season tracked faceoff
         percentage and 'False' otherwise
       * is_time_one_ice_per_game_season( season ): returns 'True' if the given season tracked time
         on ice per game and 'False' otherwise
       * is_plus_minus_season( season ): returns 'True' if the given season tracked plus-minus and
         'False' otherwise
       * is_shots_season( season ): returns 'True' if the given season tracked shots and 'False'
         otherwise
       * is_shooting_percentage_season( season ): returns 'True' if the given season tracked shooting
         percentage and 'False' otherwise
       * is_skater_special_teams_stats_season( season ): returns 'True' if the given season tracked
         skater special team stats and 'False' otherwise
       * is_shots_against_season( season ): returns 'True' if the given season tracked shots against
         and 'False' otherwise
       * is_save_percentage_season( season ): returns 'True' if the given season tracked save
         percentage and 'False' otherwise
       * skater_stat_compare( season1, season2, stat, multiplier ): defines how to compare certain NHL
         skater stats which do not work using the standard formula (value2 - value1)
       * goalie_stat_compare( season1, season2, stat, multiplier ): defines how to compare certain NHL
         goalie stats which do not work using the standard formula (value2 - value1)


NHLTextUI (Python class that allows the user to add data into the database):
  Attributes:
   * database: a instance of NHLDatabase
  Methods:
   * init(): sets up the database instance variable (without reseting the databases)
   * add_player(): prompts the user to add either a skater or goalie, then enter information for said
     skater/goalie, creates a Skater/Goalie object, and then repeatedly prompts the user regular 
     season stats for the player, and then playoff stats -> finally we add this player to the database
     via the database class variable
   * add_standings(): adds a year of standings to the database by prompting the user to enter the
     season, the number of teams in the league during the season, and then the stats for each of
     those teams add_playoffs(): adds a year of playoff standings to the database by prompting the
     user to enter the season, the number of teams in the playoffs during the season, and then the
     stats for each of those teams


NHLServer (Python class that receives get requests to display the data):

NHLUI (HTML-based user interface for the application, see the wireframe for details):

Main Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team 
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen which will have the options to filter the stats by
   team, season/seasons, player position, etc.
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen used to
   display the stats


"Regular Season Skater Stats" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen with the following tools:
    * A dropdown menu to select the season to view the stats of and two text fields with the options
      to enter the first and last seasons for the range of seasons to view the stats of
    * Dropdown menus to filter by the team (only available when viewing the stats for a singular
      season), and the position to view the stats of
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen used to
   display the stats with attributes as buttons to sort the stats by

"Playoff Skater Stats" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team 
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen with the following tools:
    * A dropdown menu to select the playoffs to view the stats of and two text fields with the 
      options to enter the first and last playoffs for the range of playoffs to view the stats of
    * Dropdown menus to filter by the team (only available when viewing the stats for a singular
      playoffs), and the position to view the stats of
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen used to
   display the stats with attributes as buttons to sort the stats by

"Skater Lookup" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team 
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen that displays the current player's name, image, and 
   basic information
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen which is
   divided into two parts: 
    * A region above to display the search bar, centered, and a button in the top right labelled
      "Playoffs" to view the playoff stats
    * A region below used to display the stats and with attributes as buttons to sort the stats by

"Standings" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen with a dropdown menu to select the season to view the
   stats of and two text fields with the options to enter the first and last seasons for the range
   of seasons to view the stats of
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen used to
   display the standings and with buttons at the top that read "Wildcard", "Division", "Conference",
   and "League" which each bring up the standings in the format which the button reads

"Team Season Stats" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen with a dropdown menu to select the season to view the
   stats of and two text fields with the options to enter the first and last seasons for the range
   of seasons to view the stats of
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen used to
   display the stats and with buttons at the top that read "Conference", and "League" which each
   bring up the standings in the format which the button reads

"Team Playoff Stats" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options:
   Skater Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team
   Playoff Stats, Team Lookup
 * A Panel along the left side of the screen with a dropdown menu to select the playoffs to view
   the stats of and two text fields with the options to enter the first and last playoffs for the
   range of playoffs to view the stats of
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen used to
   display the stats and with buttons at the top that read "Conference", and "League" which each
   bring up the standings in the format which the button reads

"Team Lookup" Screen:
 * "NHL DB" title
 * A button "Add Stats" in the top right corner of the screen to switch to "stat adding" mode
 * A series of tabs/buttons along the top, filling the screen from left to right with the options: 
   Skater
   Season Stats, Skater Playoff Stats, Skater Lookup, Standings, Team Season Stats, Team Playoff 
   Stats, Team Lookup
 * A Panel along the left side of the screen with a dropdown menu to select the seasons to view the
   stats of and two text fields with the options to enter the first and last playoffs for the range
   of seasons to view the stats of, the team's current logo, and text for the year the team was
   estasblished
 * A panel covering up the other ~2/3 of the lower middle/middle-right part of the screen which is
   divided into two parts: 
    * A region above to display the search bar, centered, and a button in the top right labelled
      "Playoffs" to view the playoff stats
    * A region below used to display the stats and with attributes as buttons to sort the stats by


"Add Stats" Screen:
 * "NHL DB" title
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right

 "Add Skater" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter the data for the skater (not including their stats)
    * A pair of buttons in the top right corner that are stacked on top of each other which read
      "Add Regular Season" and "Add Playoffs"
    * A button in the bottom right corner that reads "Submit"

"Add Regular Season" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter stats for the regular season
    * A button in the bottom right corner that reads "Submit"

"Add Playoffs" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter stats for the playoffs
    * A button in the bottom right corner that reads "Submit"

"Add Goalie" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter the data for the goalie (not including their stats)
    * A pair of buttons in the top right corner that are stacked on top of each other which read
      "Add Regular Season" and "Add Playoffs"
    * A button in the bottom right corner that reads "Submit"

"Add Regular Season" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter stats for the regular season
    * A button in the bottom right corner that reads "Submit"

"Add Playoffs" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter stats for the playoffs
    * A button in the bottom right corner that reads "Submit"

"Add Team" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter the data for the team (not including their stats)
    * A pair of buttons in the top right corner that are stacked on top of each other which read
      "Add Regular Season" and "Add Playoffs"
    * A button in the bottom right corner that reads "Submit"

"Add Regular Season" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with
   the following elements: 
    * fields to enter stats for the regular season
    * A button in the bottom right corner that reads "Submit"

"Add Playoffs" Screen:
 * A button "View Stats" in the top right corner of the screen to switch to "stat viewing" mode
 * A set of three buttons along the top portion of the page that read "Add Skater", "Add Goaltender",
   and "Add Team"
 * A panel filling up the lower ~2/3 of the screen, stretching from left to right with fields with'
   the following elements: 
    * fields to enter stats for the playoffs
    * A button in the bottom right corner that reads "Submit"


# Sources #

 * https://www.sportslogos.net/ (team logos)
 * https://freebiesupply.com/ (team logos)
 * https://seeklogo.com/ (team logos)
 * https://en.wikipedia.org/wiki/Main_Page (team logos)
 * https://www.remove.bg/uploads (transparent backgrounds for images)
 * https://www5.lunapic.com/editor/ (transparent backgrounds for images)
 * https://logos-world.net/arizona-coyotes-logo/ (Winnipeg Jets old logo)