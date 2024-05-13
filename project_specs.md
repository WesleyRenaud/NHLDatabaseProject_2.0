##               NHL Database Project               ##


# Overview #
 * This project consists of an interface that allows users to retrieve NHL stats in a variety of forms


# Features #

Text UI:
 * Allows owners to add stats to the database

GUI:
 * See standings from a specific season sorted by any of the fields in the Team table and league-wide, by 
   conference, division, or of the wildcard race
 * See team stats for a specific playoffs by any of the fields in the Team table, and league-wide or by 
   conference
 * See league leaders for a season for any of the skater categories in the SkaterSeason table, or for any 
   of the goalie ategories in the GoalieSeason table
 * See the team leaders for a season in any of the skater categories in the SkaterSeason table, or in any 
   of the goalie categories in the GoalieSeason table
 * See all-time league-wide leaders or current league-wide leaders in any of the skater categories in the 
   SkaterSeason table, or in any of the goalie categories in the GoalieSeason table


# Implementation Details #


Database (a Python class that uses SQLite):
  Tables:
   * Skater: SKATERID, NAME, TEAM (NULL for retired players), NUMBER (NULL for retired players), POSITION, 
     HEIGHT, WEIGHT, BIRTHDAY, HANDEDNESS, DRAFT_POSITION (NULL for undrafted players)
   * SkaterSeasons: SKATERID, SKATERSEASONID
   * SkaterPlayoffs: SKATERID, SKATERPLAYOFFSID
   * SkaterSeason: SKATERSEASONID, SEASON, GAMES_PLAYED, GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
     POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, SHORTHANDED_POINTS, TIME_ON_ICE_PERGAME, GAME_
     WINNING_GOALS, OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE
   * Goalie: GOALIEID, NAME, TEAM (NULL for retired players), NUMBER (NULL for retired players), HEIGHT, 
     WEIGHT, BIRTHDAY, HANDEDNESS, DRAFT_POSITION (NULL for undrafted players)
   * GoalieSeasons: GOALIEID, GOALIESEASONID
   * GoaliePlayoffs: GOALIE, GOALIEPLAYOFFSID
   * GoalieSeason: GOALIESEASONID, SEASON, GAMES_PLAYED, GAMES_STARTED, WINS, LOSES, TIES (NULL for seasons
     with no ties), OVERTIME_LOSES (NULL for seasons with no overtime), SHOTS_AGAINST, GOALS_AGAINST_AVERAGE, 
     SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, TIME_ON_ICE
   * Standings: STANDINGSID, SEASON
   * StandingsTeam: STANDINGSID, TEAMID
   * Team: TEAMID, CITY, NAME, GAMES_PLAYED, WINS, LOSES, TIES (NULL for seasons with no ties), OVERTIME_LOSES
     (NULL for seasons with no overtime), POINTS, POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_ 
     WINS, GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK
   * Playoffs: PlayoffsID, Season
   * PlayoffsTeam: PlayoffsID, TeamID
   Methods:
   * init( reset ): creates a database connection to 'phylib.db', deleting the old database if reset is true
   * create_tables(): makes any of the tables listed above which do not already exist in the database
   * add_player( player ): adds a player to the database by first checking whether they are a skater or a 
     goalie, then adding their personal details to either the Skater or the Goalie table, then adding their
     regular season and playoff stats to the appropriate tables
   * add_standings( teams, season ): adds a set of standings to the database given the season the standings
     occurred in and a list of the teams' performances during said season
   * add_playoffs( teams, season ): adds a set of playoffs to the database given the season the playoffs
     occurred in and a list of the teams' performances during said playoffs
   * get_player( player_name ): returns a 'Player' object with all of the stats and attributes of the player 
     as specified in the database
   * get_team_leaders( season, team, stat, multiplier ): returns a list of all of the players on the team 
     given as input in the season given as input sorted by the stat given as input in ascending order if 
     'multiplier' s positive, and descending order if 'multiplier' is negative
   * get_league_leaders( season, stat, num_players, multipler ): returns a list of 'num_players' players 
     in the season given as input sorted by the stat given as input in ascending order if 'multiplier' is 
     positive, and descending order if 'multiplier' is negative
   * get_standings( season, stat, view, multiplier ): returns a list of teams representing the standings
     from the season given as input, sorted by the stat given as input in ascending order if 'multiplier' 
     is positive, and descending order if 'multiplier' is negative. If 'view' is 'league' we get the league-
     wide standings. If 'view' is wildcard' we get the wildcard standings. If 'view' is division we get the
     divisional standings, and if 'view' is 'conference' we get the standings by conference.
     get_playoffs( season, stat, view, multiplier ): returns a list of teams representing their playoffs
     stats from the season given as input, sorted by the stat given as input in ascending order if 'multiplier' 
     is positive, and descending order if 'multiplier' is negative. If 'view' is 'league' we get the league-
     wide standings. If 'view' is 'conference' we get the standings by conference.
   * sort_by_division( teams, season ): sorts a list of teams by division, based on the season, and while
     maintaining the relative ordering of teams within those divisions
     sort_by_conference( teams, season ): sorts a list of teams by conference, based on the season, and while
     maintaining the relative ordering of teams within those divisions
     sort_by_wildcard( teams, season ): sorts a list of teams according to the wildcard race, based on the 
     season, and while maintaining the relative ordering of teams within those divisions


NHL (Python module that contains the classes associated with the data in the database):
  skater_stats, goalie_stats: tuples of all of the stat names for each type of player 
  Classes:
   * Player:
      Attributes:
       * name, team (None for retired players), number (None for retired players), position, height, weight, 
         birthday, handedness, draft_position (None for undrafted)
   * Skater (extends Player):
      Attributes:
       * seasons (list of SkaterSeasons)
       * playoffs (list of SkaterSeasons)
      Methods:
       * add_season( season )
       * add_playoffs( playoffs )
   * Goalie (extends Player):
      Attributes:
       * seasons (list of GoalieSeasons)
       * playoffs (list of GoalieSeasons)
      Methods:
       * add_season( season )
       * add_playoffs( playoffs )
   * SkaterSeason:
      Attributes:
       * season, games_played, goals, assists, points, plus-minus, penalty_minutes, powerplay_goals, powerplay
         _points, shorthanded_goals, short-handed_points, time_on_ice/game, game_winning_goals, overtime_goals,
         shots, shooting_percentage, faceoff_percentage
   * GoalieSeason:
      Attributes:
       * Season, games_played, games_started, wins, loses, ties, overtime_loses, shots_against, goals_against_
         average, save_percentage, shutouts, goals, assists, penalty_minutes, time_on_ice
   * Team:
      Attributes:
       * city, name, games_played, wins, loses, ties, overtime_loses, points, points_percentage, regulation_wins, 
         regulation_and_overtime_wins, goals_for, goals_against, goal_differential, home, away, shootout, last
         _10, streak
      Methods:
       * get_full_name(): returns the city plus a whitespace plus the team name


NHLTextUI (Python class that allows the user to add data into the database):
  Attributes:
   * database: a instance of NHLDatabase
  Methods:
   * init(): sets up the database instance variable (without reseting the databases)
   * add_player(): prompts the user to add either a skater or goalie, then enter information for said
     skater/goalie, creates a Skater/Goalie object, and then repeatedly prompts the user regular season
     stats for the player, and then playoff stats -> finally we add this player to the database via the
     database class variable
   * add_standings(): adds a year of standings to the database by prompting the user to enter the season, 
     the number of teams in the league during the season, and then the stats for each of those teams
     add_playoffs(): adds a year of playoff standings to the database by prompting the user to enter the 
     season, the number of teams in the playoffs during the season, and then the stats for each of those 
     teams


NHLServer (Python class that receives get requests to display the data):
