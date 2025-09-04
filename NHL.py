import os
from functools import cmp_to_key


################################################################################

skater_stats = ('skater_games_played', 'skater_goals', 'skater_assists', 'points', 'plus_minus', 'skater_\
                 penalty_minutes', 'powerplay_goals', 'powerplay_points', 'shorthanded_goals', 'short\
                 handed_points', 'time_on_ice/game', 'game_winning_goals', 'overtime_goals', 'shots', 'shooting\
                 _perecentage', 'faceoff_percentage')

goalie_stats = ('goalie_games_played', 'games_started', 'wins', 'losses', 'ties', 'overtime_losses', 'shots_\
                 against', 'goals_against_average', 'save_percentage', 'shutouts', 'goalie_goals', 'goalie_\
                 assists', 'goalie_penalty_minutes', 'time_on_ice')


################################################################################

class Player():

    def __init__( self, name, team, number, position, height, weight, birthday, handedness, draft_position ):
        self.name = name
        self.team = team
        self.number = number
        self.position = position
        self.height = height
        self.weight = weight
        self.birthday = birthday
        self.handedness = handedness
        self.draft_position = draft_position


################################################################################

class Skater( Player ):

    def __init__( self, name, team, number, position, height, weight, birthday, handedness, draft_position ):
        super().__init__( name, team, number, position, height, weight, birthday, handedness, draft_position)
        self.seasons = []
        self.playoffs = []


    def add_season( self, season, team, games_played, goals, assists, points, plus_minus, penalty_minutes,
                    powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, time_on_ice_per_game,
                    game_winning_goals, overtime_goals, shots, shooting_percentage, faceoff_percentage ):
        self.seasons.append( SkaterSeason( 'Regular Season', season, team, games_played, goals, assists, 
                                           points, plus_minus, penalty_minutes,powerplay_goals, powerplay_points, 
                                           shorthanded_goals, shorthanded_points, time_on_ice_per_game, 
                                           game_winning_goals, overtime_goals, shots, shooting_percentage, 
                                           faceoff_percentage ) )


    def add_playoffs( self, season, team, games_played, goals, assists, points, plus_minus, penalty_minutes,
                      powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, time_on_ice_per_game,
                      game_winning_goals, overtime_goals, shots, shooting_percentage, faceoff_percentage ):
        self.playoffs.append( SkaterSeason( 'Playoffs', season, team, games_played, goals, assists, points, 
                                            plus_minus, penalty_minutes,powerplay_goals, powerplay_points, 
                                            shorthanded_goals, shorthanded_points, time_on_ice_per_game, 
                                            game_winning_goals, overtime_goals, shots, shooting_percentage, 
                                            faceoff_percentage ) )
        

    def to_dict( self ):
        return {
            'name': self.name,
            'team': self.team,
            'number': self.number,
            'position': self.position,
            'height': self.height,
            'weight': self.weight,
            'birthday': self.birthday,
            'handedness': self.handedness,
            'draft_position': self.draft_position,
            'seasons': [season.to_dict() for season in self.seasons],
            'playoffs': [playoff.to_dict() for playoff in self.playoffs]
        }


################################################################################

class Goalie( Player ):

    def __init__( self, name, team, number, height, weight, birthday, handedness, draft_position ):
        super().__init__( name, team, number, 'goaltender', height, weight, birthday, handedness,
                          draft_position )
        self.seasons = []
        self.playoffs = []


    def add_season( self, season, team, games_played, games_started, wins, losses, ties, overtime_losses,
                    shots_against, goals_against_average, save_percentage, shutouts, goals, assists,
                    penalty_minutes, time_on_ice ):
        self.seasons.append( GoalieSeason( 'Regular Season', season, team, games_played, games_started, wins, 
                                           losses, ties, overtime_losses, shots_against, goals_against_average,
                                           save_percentage, shutouts, goals, assists, penalty_minutes,
                                           time_on_ice ) ) 


    def add_playoffs( self, season, team, games_played, games_started, wins, losses, ties, overtime_losses,
                      shots_against, goals_against_average, save_percentage, shutouts, goals, assists,
                      penalty_minutes, time_on_ice ):
        self.playoffs.append( GoalieSeason( 'Playoffs', season, team, games_played, games_started, wins, 
                                           losses, ties, overtime_losses, shots_against, goals_against_average,
                                           save_percentage, shutouts, goals, assists, penalty_minutes,
                                           time_on_ice ) )
        
    
    def to_dict( self ):
        return {
            'name': self.name,
            'team': self.team,
            'number': self.number,
            'height': self.height,
            'weight': self.weight,
            'birthday': self.birthday,
            'handedness': self.handedness,
            'draft_positon': self.draft_position,
            'seasons': [season.to_dict() for season in self.seasons],
            'playoffs': [playoff.to_dict() for playoff in self.playoffs]
        }


################################################################################

class SkaterSeason():

    def __init__( self, type, season, team, games_played, goals, assists, points, plus_minus, penalty_minutes,
                  powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, time_on_ice_per_game,
                  game_winning_goals, overtime_goals, shots, shooting_percentage, faceoff_percentage, name=None ):
        self.type = type
        self.season = season
        self.team = team
        self.games_played = games_played
        self.goals = goals
        self.assists = assists
        self.points = points
        self.plus_minus = plus_minus
        self.penalty_minutes = penalty_minutes
        self.powerplay_goals = powerplay_goals
        self.powerplay_points = powerplay_points
        self.shorthanded_goals = shorthanded_goals
        self.shorthanded_points = shorthanded_points
        self.time_on_ice_per_game = time_on_ice_per_game
        self.game_winning_goals = game_winning_goals
        self.overtime_goals = overtime_goals
        self.shots = shots
        self.shooting_percentage = shooting_percentage
        self.faceoff_percentage = faceoff_percentage
        self.name = name


    def to_dict( self ):
        if self.name != None:
            return {
                'name': self.name,
                'type': self.type,
                'season': self.season,
                'team': self.team,
                'games_played': self.games_played,
                'goals': self.goals,
                'assists': self.assists,
                'points': self.points,
                'plus_minus': self.plus_minus,
                'penalty_minutes': self.penalty_minutes,
                'powerplay_goals': self.powerplay_goals,
                'powerplay_points': self.powerplay_points,
                'shorthanded_goals': self.shorthanded_goals,
                'shorthanded_points': self.shorthanded_points,
                'time_on_ice_per_game': self.time_on_ice_per_game,
                'game_winning_goals': self.game_winning_goals,
                'overtime_goals': self.overtime_goals,
                'shots': self.shots,
                'shooting_percentage': self.shooting_percentage,
                'faceoff_percentage': self.faceoff_percentage
            }
        else:
            return {
                'type': self.type,
                'season': self.season,
                'team': self.team,
                'games_played': self.games_played,
                'goals': self.goals,
                'assists': self.assists,
                'points': self.points,
                'plus_minus': self.plus_minus,
                'penalty_minutes': self.penalty_minutes,
                'powerplay_goals': self.powerplay_goals,
                'powerplay_points': self.powerplay_points,
                'shorthanded_goals': self.shorthanded_goals,
                'shorthanded_points': self.shorthanded_points,
                'time_on_ice_per_game': self.time_on_ice_per_game,
                'game_winning_goals': self.game_winning_goals,
                'overtime_goals': self.overtime_goals,
                'shots': self.shots,
                'shooting_percentage': self.shooting_percentage,
                'faceoff_percentage': self.faceoff_percentage
            }


################################################################################

class GoalieSeason():

    def __init__( self, type, season, team, games_played, games_started, wins, losses, ties, 
                  overtime_losses, shots_against, goals_against_average, save_percentage, shutouts,
                  goals, assists, penalty_minutes, time_on_ice, name=None ):
        self.type = type
        self.season = season
        self.team = team
        self.games_played = games_played
        self.games_started = games_started
        self.wins = wins
        self.losses = losses
        self.ties = ties
        self.overtime_losses = overtime_losses
        self.shots_against = shots_against
        self.goals_against_average = goals_against_average
        self.save_percentage = save_percentage
        self.shutouts = shutouts
        self.goals = goals
        self.assists = assists
        self.penalty_minutes = penalty_minutes
        self.time_on_ice = time_on_ice
        self.name = name


    def to_dict( self ):
        if self.name != None:
            return {
                'name': self.name,
                'type': self.type,
                'season': self.season,
                'team': self.team,
                'games_played': self.games_played,
                'games_started': self.games_started,
                'wins': self.wins,
                'losses': self.losses,
                'ties': self.ties,
                'overtime_losses': self.overtime_losses,
                'shots_against': self.shots_against,
                'goals_against_average': self.goals_against_average,
                'save_percentage': self.save_percentage,
                'shutouts': self.shutouts,
                'goals': self.goals,
                'assists': self.assists,
                'penalty_minutes': self.penalty_minutes,
                'time_on_ice': self.time_on_ice
            }
        else:
            return {
                'type': self.type,
                'season': self.season,
                'team': self.team,
                'games_played': self.games_played,
                'games_started': self.games_started,
                'wins': self.wins,
                'losses': self.losses,
                'ties': self.ties,
                'overtime_losses': self.overtime_losses,
                'shots_against': self.shots_against,
                'goals_against_average': self.goals_against_average,
                'save_percentage': self.save_percentage,
                'shutouts': self.shutouts,
                'goals': self.goals,
                'assists': self.assists,
                'penalty_minutes': self.penalty_minutes,
                'time_on_ice': self.time_on_ice
            }


################################################################################


################################################################################

class Team():

    def __init__( self, type, season, city, name, games_played, wins, losses, ties, overtime_losses, points,
                  points_percentage, regulation_wins, regulation_and_overtime_wins, goals_for, goals_against, 
                  goal_differential, home, away, shootout, last_10, streak, shootout_wins, goals_for_per_game, 
                  goals_against_per_game, powerplay_percentage, penalty_kill_percentage, net_powerplay_percentage, 
                  net_penalty_kill_percentage, faceoff_win_percentage ):
        self.type = type
        self.season = season
        self.city = city
        self.name = name
        self.games_played = games_played
        self.wins = wins
        self.losses = losses
        self.ties = ties
        self.overtime_losses = overtime_losses
        self.points =  points
        self.points_percentage = points_percentage
        self.regulation_wins = regulation_wins
        self.regulation_and_overtime_wins = regulation_and_overtime_wins
        self.goals_for = goals_for
        self.goals_against = goals_against
        self.goal_differential = goal_differential
        self.home = home
        self.away = away
        self.shootout = shootout
        self.last_10 = last_10
        self.streak = streak
        self.shootout_wins = shootout_wins
        self.goals_for_per_game = goals_for_per_game
        self.goals_against_per_game = goals_against_per_game
        self.powerplay_percentage = powerplay_percentage
        self.penalty_kill_percentage = penalty_kill_percentage
        self.net_powerplay_percentage = net_powerplay_percentage
        self.net_penalty_kill_percentage = net_penalty_kill_percentage
        self.faceoff_win_percentage = faceoff_win_percentage


    def to_dict( self ):
        return {
            'type': self.type,
            'season': self.season,
            'city': self.city,
            'name': self.name,
            'games_played': self.games_played,
            'wins': self.wins,
            'losses': self.losses,
            'ties': self.ties,
            'overtime_losses': self.overtime_losses,
            'points': self.points,
            'points_percentage': self.points_percentage,
            'regulation_wins': self.regulation_wins,
            'regulation_and_overtime_wins': self.regulation_and_overtime_wins,
            'goals_for': self.goals_for,
            'goals_against': self.goals_against,
            'goal_differential': self.goal_differential,
            'home': self.home,
            'away': self.away,
            'shootout': self.shootout,
            'last_10': self.last_10,
            'streak': self.streak,
            'shootout_wins': self.shootout_wins,
            'goals_for_per_game': self.goals_for_per_game,
            'goals_against_per_game': self.goals_against_per_game,
            'powerplay_percentage': self.powerplay_percentage,
            'penalty_kill_percentage': self.penalty_kill_percentage,
            'net_powerplay_percentage': self.net_powerplay_percentage,
            'net_penalty_kill_percentage': self.net_penalty_kill_percentage,
            'faceoff_win_percentage': self.faceoff_win_percentage
        }
    

    # returns the city plus a whitespace plus the team name
    def get_full_name( self ): 
        return self.city + ' ' + self.name
    

################################################################################

class NHLUtil():
    # This method takes a list of teams and a season, and using a season_to_teams_mapping file, creates a 
    # new list with the teams sorted into their divisions, sorted by a stat and a mutlipier (1 == 
    # descending, -1 == ascending) when given.
    def get_division_standings( self, season, teams, stat=None, multiplier=None ): 
        teams = self.sort_teams_into_divisions( season, teams )

        if stat and multiplier:
            for division in teams:
                division.sort( key=cmp_to_key( lambda team1, team2: self.team_stat_compare( team1, team2, stat, multiplier ) ) )

        file = open( 'season_to_teams_mapping/%s.txt' % season, 'r' )
        teams_by_division = []
        current_division_index = -1
        for line in file:
            if 'Conference' in line:
                teams_by_division.append( line )

            elif 'Division' in line:
                teams_by_division.append( line )
                current_division_index += 1

                for j in range( len( teams[current_division_index] ) ):
                    teams_by_division.append( teams[current_division_index][j] )

        return teams_by_division


    # This is a helper method that takes a list of teams and a season and sorts the teams into a 2-D array 
    # where each 'row' contains the team for one division, and the teams in the rows are also sorted in the 
    # descending order of their number of points.
    def sort_teams_into_divisions( self, season, teams ):
        file = open( 'season_to_teams_mapping/%s.txt' % season, 'r' )

        teams_by_division = []

        current_division_index = -1
        for line in file:
            line = line.replace('\n', '')

            if 'Division' in line:
                current_division_index += 1
                teams_by_division.append( [] )

            elif not 'Conference' in line:
                for i in range( len( teams ) ):
                    if line == teams[i].get_full_name():
                        teams_by_division[current_division_index].append( teams[i] )

        for j in range( len( teams_by_division ) ):
            teams_by_division[j] = self.get_league_standings( 'Regular Season', season, teams_by_division[j] )

        return teams_by_division
    

    # This method takes a list of teams and a season, and using a season_to_teams_mapping file, creates a 
    # new list with the teams sorted into their conferences, sorted by a stat and a mutlipier (1 == 
    # descending, -1 == ascending) when given.
    def get_conference_standings( self, season, teams, stat=None, multiplier=None ): 
        teams = self.sort_teams_into_conferences( season, teams )

        if stat and multiplier:
            for conference in teams:
                conference.sort( key=cmp_to_key( lambda team1, team2: self.team_stat_compare( team1, team2, stat, multiplier ) ) )

        file = open( 'season_to_teams_mapping/%s.txt' % season, 'r' )
        teams_by_conference = []
        current_conference_index = -1
        for line in file:
            if 'Conference' in line:
                teams_by_conference.append( line )
                current_conference_index += 1

                for j in range( len( teams[current_conference_index] ) ):
                    teams_by_conference.append( teams[current_conference_index][j] )                

        return teams_by_conference

    
    # This is a helper method that takes a list of teams and a season and sorts the teams into a 2-D array
    # where each 'row' contains the team for one conference, and the teams in the rows are also sorted in 
    # the descending order of their number of points.
    def sort_teams_into_conferences( self, season, teams ):
        file = open( 'season_to_teams_mapping/%s.txt' % season, 'r' )

        teams_by_conference = []

        current_conference_index = -1
        for line in file:
            line = line.replace( '\n', '' )

            if 'Conference' in line:
                current_conference_index += 1
                teams_by_conference.append( [] )

            elif not 'Division' in line:
                for i in range( len( teams ) ):
                    if line == teams[i].get_full_name():
                        teams_by_conference[current_conference_index].append( teams[i] )

        for j in range( len( teams_by_conference ) ):
            teams_by_conference[j] = self.get_league_standings( 'Regular Season', season, teams_by_conference[j] )

        return teams_by_conference
         

    # This method takes a list of teams and a season, and using a season_to_teams_mapping file, creates a 
    # new list of teams with them sorted with their divisions conferences to present the wildcard standings.
    def get_wildcard_standings( self, season, teams ): 
        teams_by_division = self.sort_teams_into_divisions( season, teams )
        teams_by_conference = self.sort_teams_into_conferences( season, teams )

        # for the wildcard era, the standings are always done in the same way: the top three teams from 
        # the first division in the first conference, the top three teams in the seoncd (only other) division 
        # in the first conference, then the rest of the teams in the first conference, etc.
        file = open( 'season_to_teams_mapping/%s.txt' % season, 'r' )
        teams = []
        current_conference_index = -1
        current_division_index = -1
        for line in file:
            if 'Conference' in line:
                teams.append( line )
                current_conference_index += 1

            elif 'Division' in line:
                teams.append( line )
                current_division_index += 1

                for i in range( 3 ):
                    teams.append( teams_by_division[current_division_index][i] )

                if current_division_index % 2 == 1:
                    teams.append( 'Wildcard' )
                    for i in range( 3, len( teams_by_conference[current_conference_index] ) ):
                        if not teams_by_conference[current_conference_index][i] in teams:
                            teams.append( teams_by_conference[current_conference_index][i] )

        return teams
    

    # This method returns the path to local image for the specified team in the specified season.
    def get_team_logo_path( self, team_name, season ):
        folder = 'images/team_logos'

        if os.path.exists( folder ):
            for file_name in os.listdir( folder ):
                if team_name in file_name:
                    folder += '/' + file_name

                    if os.path.exists( folder ):
                        for file_name in os.listdir( folder ):
                            if file_name.endswith('.png'):
                                first_season = self.get_first_season( file_name )
                                second_season = self.get_second_season( file_name )
                                
                                if self.is_in_between_seasons( season, first_season, second_season ):
                                    return folder + '/' + file_name


    # This method returns the first season from the name of a file representing a team's logo between two 
    # seasons, and the file name is of the form s1y1-s1y2_s2y1-s2y2.png.
    def get_first_season( self, file_name ):
        first_season = file_name[:9]

        return first_season
    

    # returns the second season from the name of a file representing a team's logo between two seasons, 
    # and the file name is of the form s1y1-s1y2_s2y1-s2y2.png.
    def get_second_season( self, file_name ):
        second_season = file_name[10:19]
        
        if len( second_season ) == 9:
            return second_season

        return None
    
    # checks if the target season is during the window between the first season and the second season,
    # inclusively.
    def is_in_between_seasons( self, target_season, first_season, second_season ): 
        if second_season == None: # we only have one season
            if target_season == first_season:
                return True
            
            return False
        
        else:
            target_season_year1 = target_season[:4]
            first_season_year1 = first_season[:4]
            second_season_year1 = second_season[:4]

            if target_season_year1 >= first_season_year1 and target_season_year1 <= second_season_year1:
                return True
            
            return False
        
    # This method get_clinching_markers( season, teams ): returns a list of clinching markers where the 
    # clinching marker at each index in the list is the marker corresponding to the team at that index in 
    # the teams list, given the season which the teams are in.
    def get_clinching_markers( self, season, teams ):
        clinching_markers = {}
        league_standings = self.get_league_standings( 'Regular Season', season, teams )

        # presidents trophy winner ('p')
        clinching_markers[league_standings[0].get_full_name()] = 'p'

        # conference winners ('z')
        if self.is_conference_season( season ):
            teams_by_conference = self.sort_teams_into_conferences( season, teams )
            for i in range( len( teams_by_conference ) ):
                if not teams_by_conference[i][0].get_full_name() in clinching_markers:
                    clinching_markers[teams_by_conference[i][0].get_full_name()] = 'z'

        # divisional winners ('y')
        if self.is_division_season( season ):
            teams_by_division = self.sort_teams_into_divisions( season, teams )
            for i in range( len( teams_by_division ) ):
                if not teams_by_division[i][0].get_full_name() in clinching_markers:
                    clinching_markers[teams_by_division[i][0].get_full_name()] = 'y'

        # other playoff teams ('x')
        first_year = int( season[:4] )
        
        if first_year >= 2013 and first_year != 2019 and first_year != 2020:
            wildcard_standings = self.get_wildcard_standings( season, teams )
            wildcard_standings = [item for item in wildcard_standings if not isinstance( item, str )]

            for i in range( 8 ):
                if not wildcard_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[wildcard_standings[i].get_full_name()] = 'x'

            for i in range( 16, 24 ):
                if not wildcard_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[wildcard_standings[i].get_full_name()] = 'x'

            for i in range( len( teams ) ):
                if not teams[i].get_full_name() in clinching_markers:
                    clinching_markers[teams[i].get_full_name()] = None

        elif first_year == 2019:
            for i in range( len( teams_by_conference ) ):
                for j in range( 12 ):
                    if not teams_by_conference[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_conference[i][j].get_full_name()] = 'x'

        elif first_year == 2020:
            for i in range( len( teams_by_division ) ):
                for j in range( 4 ):
                    if not teams_by_division[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_division[i][j].get_full_name()] = 'x'

        elif first_year >= 1992:
            for i in range( len( teams_by_conference ) ):
                for j in range( 8 ):
                    if not teams_by_conference[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_conference[i][j].get_full_name()] = 'x'

        elif first_year >= 1979:
            for i in range( len( teams_by_division ) ):
                for j in range( 4 ):
                    if not teams_by_division[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_division[i][j].get_full_name()] = 'x'

        elif first_year >= 1977:
            for i in range( len( teams_by_division ) ):
                for j in range( 2 ):
                    if not teams_by_division[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_division[i][j].get_full_name()] = 'x'

            count = 0
            i = 0
            while count < 4:
                if not league_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[league_standings[i].get_full_name()] = 'x'
                    count += 1

                i += 1

        elif first_year >= 1974:
            for i in range( len( teams_by_division ) ):
                for j in range( 3 ):
                    if not teams_by_division[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_division[i][j].get_full_name()] = 'x'

        elif first_year >= 1967:
            for i in range( len( teams_by_division ) ):
                for j in range( 4 ):
                    if not teams_by_division[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_division[i][j].get_full_name()] = 'x'

        elif first_year >= 1942:
            count = 0
            i = 0
            while count < 3:
                if not league_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[league_standings[i].get_full_name()] = 'x'
                    count += 1

                i += 1

        elif first_year >= 1938:
            count = 0
            i = 0
            while count < 5:
                if not league_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[league_standings[i].get_full_name()] = 'x'
                    count += 1

                i += 1

        elif first_year >= 1926:
            for i in range( len( teams_by_division ) ):
                for j in range( 3 ):
                    if not teams_by_division[i][j].get_full_name() in clinching_markers:
                        clinching_markers[teams_by_division[i][j].get_full_name()] = 'x'

        elif first_year >= 1924:
            count = 0
            i = 0
            while count < 2:
                if not league_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[league_standings[i].get_full_name()] = 'x'
                    count += 1

                i += 1

        elif first_year >= 1919:
            count = 0
            i = 0
            while count < 1:
                if not league_standings[i].get_full_name() in clinching_markers:
                    clinching_markers[league_standings[i].get_full_name()] = 'x'
                    count += 1

                i += 1

        elif first_year == 1918:
            for i in range( len( league_standings ) ):
                if league_standings[i].get_full_name() == 'Montreal Canadiens':
                    clinching_markers[league_standings[i].get_full_name()] = 'x'

        elif first_year == 1917:
            for i in range( len( league_standings ) ):
                if league_standings[i].get_full_name() == 'Toronto Arenas':
                    clinching_markers[league_standings[i].get_full_name()] = 'x'

        return clinching_markers
    
    
    # This method takes a list of teams and a season, and sorts the teams in order of points, plus 
    # additional tie breakers when applicable or  by a stat and a mutlipier (1 == descending, -1 == 
    # ascending) when given.
    def get_league_standings( self, type, season, teams, stat=None, multiplier=None ):
        league_standings = []
        for i in range( len( teams ) ):
            league_standings.append( teams[i] )

        if stat and multiplier:
            league_standings.sort( key=cmp_to_key( lambda team1, team2: self.team_stat_compare( team1, team2, stat, multiplier ) ) )

        else:
            if type == 'Regular Season':
                if self.get_first_year( season ) >= 2019:
                    league_standings.sort( key=lambda team: (team.points_percentage, team.points , team.regulation_wins, team.regulation_and_overtime_wins, team.goals_for), reverse=True )
            
                elif self.is_overtime_losses_season( type, season ):
                    
                    league_standings.sort( key=lambda team: (team.points_percentage, team.points , team.regulation_and_overtime_wins, team.goals_for), reverse=True )

                else:
                    league_standings.sort( key=lambda team: (team.points_percentage, team.points , team.wins, team.goals_for), reverse=True )

            else:
                league_standings.sort( key=lambda team: ( team.wins, team.points_percentage ) )

        return league_standings
    

    # This method defines how to compare certain NHL team stats which do not work using the standard 
    # formula (value2 - value1).
    def team_stat_compare( self, team1, team2, stat, multiplier ):
        if multiplier == -1:
            dummy_team = team1
            team1 = team2
            team2 = dummy_team

        value1 = getattr( team1, stat )
        value2 = getattr( team2, stat )

        if value1 == '--' or value1 == 'null' or value1 == 'None' or value1 == None:
                return 1
        elif value2 == '--' or value2 == 'null' or value2 == 'None' or value2 == None:
            return -1

        if stat == 'season':
            season1_first_year = self.get_first_year( value1 )
            season2_first_year = self.get_first_year( value2 )
            return season2_first_year - season1_first_year

        elif stat == 'home':
            home1 = value1.split( '-' )

            wins1 = int( home1[0] )
            losses1 = int( home1[1] )

            if len( home1 ) == 3:
                overtime_losses_or_ties1 = int( home1[2] )
                points1 = 2 * wins1 + overtime_losses_or_ties1
                games_played1 = wins1 + losses1 + overtime_losses_or_ties1

            else:
                ties1 = int( home1[2] )
                overtime_losses1 = int( home1[3] )
                points1 = 2 * wins1 + ties1 + overtime_losses1
                games_played1 = wins1 + losses1 + ties1 + overtime_losses1
            
            points_percentage1 = points1 / (2 * games_played1)

            home2 = value2.split( '-' )

            wins2 = int( home2[0] )
            losses2 = int( home2[1] )

            if len( home2 ) == 3:
                overtime_losses_or_ties2 = int( home2[2] )
                points2 = 2 * wins2 + overtime_losses_or_ties2
                games_played2 = wins2 + losses2 + overtime_losses_or_ties2

            else:
                ties2 = int( home2[2] )
                overtime_losses2 = int( home2[3] )
                points2 = 2 * wins2 + ties2 + overtime_losses2
                games_played2 = wins2 + losses2 + ties2 + overtime_losses2
            
            points_percentage2 = points2 / (2 * games_played2)

            return points_percentage2 - points_percentage1
        
        elif stat == 'away':
            away1 = value1.split( '-' )

            wins1 = int( away1[0] )
            losses1 = int( away1[1] )

            if len( away1 ) == 3:
                overtime_losses_or_ties1 = int( away1[2] )
                points1 = 2 * wins1 + overtime_losses_or_ties1
                games_played1 = wins1 + losses1 + overtime_losses_or_ties1

            else:
                ties1 = int( away1[2] )
                overtime_losses1 = int( away1[3] )
                points1 = 2 * wins1 + ties1 + overtime_losses1
                games_played1 = wins1 + losses1 + ties1 + overtime_losses1
            
            points_percentage1 = points1 / (2 * games_played1)

            away2 = value2.split( '-' )

            wins2 = int( away2[0] )
            losses2 = int( away2[1] )

            if len( away2 ) == 3:
                overtime_losses_or_ties2 = int( away2[2] )
                points2 = 2 * wins2 + overtime_losses_or_ties2
                games_played2 = wins2 + losses2 + overtime_losses_or_ties2

            else:
                ties2 = int( away2[2] )
                overtime_losses2 = int( away2[3] )
                points2 = 2 * wins2 + ties2 + overtime_losses2
                games_played2 = wins2 + losses2 + ties2 + overtime_losses2
            
            points_percentage2 = points2 / (2 * games_played2)

            return points_percentage2 - points_percentage1
        
        elif stat == 'shootout':
            if value1 != '0-0' and value2 != '0-0':
                shootout1 = value1.split( '-' )
                shootout2 = value2.split( '-' )

                wins1 = int( shootout1[0] )
                losses1 = int( shootout1[1] )

                games_played1 = wins1 + losses1
                win_percentage1 = wins1 / games_played1

                wins2 = int( shootout2[0] )
                losses2 = int( shootout2[1] )

                games_played2 = wins2 + losses2
                win_percentage2 = wins2 / games_played2

                if win_percentage1 == win_percentage2:
                    return wins2 - wins1
                
                else:
                    return win_percentage2 - win_percentage1
                
            elif value1 != '0-0':
                return -1
            
            elif value2 != '0-0':
                return 1
            
            else:
                return 0
            
        elif stat == 'last_10':
            last_10_1 = value1.split( '-' )

            wins1 = int( last_10_1[0] )
            losses1 = int( last_10_1[1] )

            if len( last_10_1 ) == 3:
                overtime_losses_or_ties1 = int( last_10_1[2] )
                points1 = 2 * wins1 + overtime_losses_or_ties1
                games_played1 = wins1 + losses1 + overtime_losses_or_ties1

            else:
                ties1 = int( last_10_1[2] )
                overtime_losses1 = int( last_10_1[3] )
                points1 = 2 * wins1 + ties1 + overtime_losses1
                games_played1 = wins1 + losses1 + ties1 + overtime_losses1
                
            points_percentage1 = points1 / (2 * games_played1)

            last_10_2 = value2.split( '-' )

            wins2 = int( last_10_2[0] )
            losses2 = int( last_10_2[1] )

            if len( last_10_2 ) == 3:
                overtime_losses_or_ties2 = int( last_10_2[2] )
                points2 = 2 * wins2 + overtime_losses_or_ties2
                games_played2 = wins2 + losses2 + overtime_losses_or_ties2

            else:
                ties2 = int( last_10_2[2] )
                overtime_losses2 = int( last_10_2[3] )
                points2 = 2 * wins2 + ties2 + overtime_losses2
                games_played2 = wins2 + losses2 + ties2 + overtime_losses2
                
            points_percentage2 = points2 / (2 * games_played2)

            return points_percentage2 - points_percentage1

        elif stat == 'streak':
            if value1[0] == 'W':
                if value2[0] != 'W':
                    return -1
                
                else:
                    wins1 = int( value1[1:] )
                    wins2 = int( value2[1:] )
                    return wins2 - wins1
                
            elif value1[0] == 'T':
                if value2[0] != 'T':
                    if value2[0] == 'W':
                        return 1
                    
                    else:
                        return -1
                    
                else:
                    ties1 = int( value1[1:] )
                    ties2 = int( value2[1:] )
                    return ties1 - ties2
                
            elif value1[0] == 'O':
                if value2[0] != 'O':
                    if value2[0] == 'W' or value2[0] == 'T':
                        return 1
                    
                    else:
                        return -1
                
                else:
                    overtime_losses1 = int( value1[2:] )
                    overtime_losses2 = int( value2[2:] )
                    return overtime_losses1 - overtime_losses2
                
            else:
                if value2[0] != 'L':
                    return 1
                
                else:
                    losses1 = int( value1[1:] )
                    losses2 = int( value2[1:] )
                    return losses1 - losses2
                
        else:
            value1 = getattr( team1, stat )
            value2 = getattr( team2, stat )

            return value2 - value1
        

    # This method returns 'True' if the given season had conferences and 'False' if if it did not.
    def is_conference_season( self, season ): 
        first_year = self.get_first_year( season )
        if first_year >= 1974 and first_year != 2020:
            return True
        
        return False
    

    # This method returns 'True' if the given season had divisions and 'False' if it did not.
    def is_division_season( self, season ): 
        first_year = self.get_first_year( season )
        if first_year >= 1967 or (first_year <= 1937 and first_year >= 1926):
            return True
        
        return False


    # This method returns the first year from a season string in the form y1y1-y2y2.
    def get_first_year( self, season ):
        return int( season[:4] )
    
    # This method takes the full name of a team (city and name) and returns the city part, or None if 
    # the full name given is not valid.
    def get_city( self, full_name ):
        if full_name == 'Anaheim Ducks':
           return 'Anaheim'
       
        elif full_name == 'Arizona Coyotes':
           return 'Arizona'
        
        elif full_name == 'Atlanta Flames':
            return 'Atlanta'
        
        elif full_name == 'Atlanta Thrashers':
            return 'Atlanta'

        elif full_name == 'Boston Bruins':
            return 'Boston'
        
        elif full_name == 'Brooklyn Americans':
            return 'Brooklyn'

        elif full_name == 'Buffalo Sabres':
            return 'Buffalo'
        
        elif full_name == 'Calgary Flames':
            return 'Calgary'
        
        elif full_name == 'California Golden Seals':
            return 'California'
        
        elif full_name == 'Carolina Hurricanes':
            return 'Carolina'
        
        elif full_name == 'Chicago Blackhawks':
            return 'Chicago'
        
        elif full_name == 'Cleveland Barons':
            return 'Cleveland'
        
        elif full_name == 'Colorado Avalanche':
            return 'Colorado'
        
        elif full_name == 'Colorado Rockies':
            return 'Colorado'

        elif full_name == 'Columbus Blue Jackets':
            return 'Columbus'
        
        elif full_name == 'Dallas Stars':
            return 'Dallas'
        
        elif full_name == 'Detroit Cougars':
            return 'Detroit'
        
        elif full_name == 'Detroit Falcons':
            return 'Detroit'
        
        elif full_name == 'Detroit Red Wings':
            return 'Detroit'
        
        elif full_name == 'Edmonton Oilers':
            return 'Edmonton'
        
        elif full_name == 'Hamilton Tigers':
            return 'Hamilton'
        
        elif full_name == 'Florida Panthers':
            return 'Florida'
        
        elif full_name == 'Hartford Whalers':
            return 'Hartford'
        
        elif full_name == 'Los Angeles Kings':
            return 'Los Angeles'
        
        elif full_name == 'Minnesota North Stars':
            return 'Minnesota'
        
        elif full_name == 'Minnesota Wild':
            return 'Minnesota'
        
        elif full_name == 'Montreal Canadiens':
            return 'Montreal'
        
        elif full_name == 'Montreal Maroons':
            return 'Montreal'
        
        elif full_name == 'Montreal Wanderers':
            return 'Montreals'
        
        elif full_name == 'Nashville Predators':
            return 'Nashville'
        
        elif full_name == 'New Jersey Devils':
            return 'New Jersey'
        
        elif full_name == 'New York Americans':
            return 'New York'
        
        elif full_name == 'New York Islanders':
            return 'New York'
        
        elif full_name == 'New York Rangers':
            return 'New York'
        
        elif full_name == 'Quebec Athletics':
            return 'Quebec'
        
        elif full_name == 'Quebec Nordiques':
            return 'Quebec'

        elif full_name == 'Ottawa Senators':
            return 'Ottawa'
        
        elif full_name == 'Philadelphia Flyers':
            return 'Philadelphia'
        
        elif full_name == 'Philadelphia Quakers':
            return 'Philadelphia'
        
        elif full_name == 'Pittsburgh Penguins':
            return 'Pittsburgh'
        
        elif full_name == 'Pittsburgh Pirates':
            return 'Pittsburgh'
        
        elif full_name == 'San Jose Sharks':
            return 'San Jose'
        
        elif full_name == 'Seattle Kraken':
            return 'Seattle'
        
        elif full_name == 'St. Louis Blues':
            return 'St. Louis'
        
        elif full_name == 'St. Louis Eagle':
            return 'St. Louis'
        
        elif full_name == 'Tampa Bay Lightning':
            return 'Tampa Bay'
        
        elif full_name == 'Toronto Maple Leafs':
            return 'Toronto'
        
        elif full_name == 'Vancouver Canucks':
            return 'Vancouver'
        
        elif full_name == 'Vegas Golden Knights':
            return 'Vegas'
        
        elif full_name == 'Washington Capitals':
            return 'Washington'
        
        elif full_name == 'Winnipeg Jets':
            return 'Winnipeg'


    # This method takes the full name of a team (city and name) and returns the name part, or None if 
    # the full name was not valid.
    def get_name( self, full_name ):
        if full_name == 'Anaheim Ducks':
           return 'Ducks'
       
        elif full_name == 'Arizona Coyotes':
           return 'Coyotes'
        
        elif full_name == 'Atlanta Flames':
            return 'Flames'
        
        elif full_name == 'Atlanta Thrashers':
            return 'Thrashers'

        elif full_name == 'Boston Bruins':
            return 'Bruins'
        
        elif full_name == 'Brooklyn Americans':
            return 'Americans'

        elif full_name == 'Buffalo Sabres':
            return 'Sabres'
        
        elif full_name == 'Calgary Flames':
            return 'Flames'
        
        elif full_name == 'California Golden Seals':
            return 'Golden Seals'
        
        elif full_name == 'Carolina Hurricanes':
            return 'Hurricanes'
        
        elif full_name == 'Chicago Blackhawks':
            return 'Blackhawks'
        
        elif full_name == 'Cleveland Barons':
            return 'Barons'
        
        elif full_name == 'Colorado Avalanche':
            return 'Avalanche'
        
        elif full_name == 'Colorado Rockies':
            return 'Rockies'

        elif full_name == 'Columbus Blue Jackets':
            return 'Blue Jackets'
        
        elif full_name == 'Dallas Stars':
            return 'Stars'
        
        elif full_name == 'Detroit Cougars':
            return 'Cougars'
        
        elif full_name == 'Detroit Falcons':
            return 'Falcons'
        
        elif full_name == 'Detroit Red Wings':
            return 'Red Wings'
        
        elif full_name == 'Edmonton Oilers':
            return 'Oilers'
        
        elif full_name == 'Florida Panthers':
            return 'Panthers'
        
        elif full_name == 'Hamilton Tigers':
            return 'Tigers'
        
        elif full_name == 'Hartford Whalers':
            return 'Whalers'
        
        elif full_name == 'Los Angeles Kings':
            return 'Kings'
        
        elif full_name == 'Minnesota North Stars':
            return 'North Stars'
        
        elif full_name == 'Minnesota Wild':
            return 'Wild'
        
        elif full_name == 'Montreal Canadiens':
            return 'Canadiens'
        
        elif full_name == 'Montreal Maroons':
            return 'Maroons'
        
        elif full_name == 'Montreal Wanderers':
            return 'Wanderers'
        
        elif full_name == 'Nashville Predators':
            return 'Predators'
        
        elif full_name == 'New Jersey Devils':
            return 'Devils'
        
        elif full_name == 'New York Americans':
            return 'Americans'
        
        elif full_name == 'New York Islanders':
            return 'Islanders'
        
        elif full_name == 'New York Rangers':
            return 'Rangers'
        
        elif full_name == 'Quebec Athletics':
            return 'Athletics'
        
        elif full_name == 'Quebec Nordiques':
            return 'Nordiques'
        
        elif full_name == 'Ottawa Senators':
            return 'Senators'
        
        elif full_name == 'Philadelphia Flyers':
            return 'Flyers'
        
        elif full_name == 'Philadelphia Quakers':
            return 'Quakers'
        
        elif full_name == 'Pittsburgh Penguins':
            return 'Penguins'
        
        elif full_name == 'Pittsburgh Pirates':
            return 'Pirates'
        
        elif full_name == 'San Jose Sharks':
            return 'Sharks'
        
        elif full_name == 'Seattle Kraken':
            return 'Kraken'
        
        elif full_name == 'St. Louis Blues':
            return 'Blues'
        
        elif full_name == 'St. Louis Eagles':
            return 'Eagles'
        
        elif full_name == 'Tampa Bay Lightning':
            return 'Lightning'
        
        elif full_name == 'Toronto Maple Leafs':
            return 'Maple Leafs'
        
        elif full_name == 'Vancouver Canucks':
            return 'Canucks'
        
        elif full_name == 'Vegas Golden Knights':
            return 'Golden Knights'
        
        elif full_name == 'Washington Capitals':
            return 'Capitals'
        
        elif full_name == 'Winnipeg Jets':
            return 'Jets'
        

    # This method returns 'True' if the given season had overtime losses and no ties and 'False' otherwise.
    def is_overtime_losses_season( self, type, season ):
        if type == 'Regular Season':
            if self.get_first_year( season ) >= 2005:
                return True
        else:
            if self.get_first_year( season ) == 2019:
                return True
       
        return False

    # This method returns 'True' if the given season had overtime losses and ties and 'False' otherwise.
    def is_overtime_losses_and_ties_season( self, season ):
        first_year = self.get_first_year( season )

        if first_year >= 1999 and first_year <= 2003:
            return True
        
        return False


    # This method returns 'True' if the given season had overtime losses and no ties and 'False' otherwise.
    def is_ties_season( self, season ): 
        if self.get_first_year( season ) <= 1998:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked faceoff win percentage and 'False' otherwise.
    def is_faceoff_win_percentage_season( self, season ): 
        if self.get_first_year( season ) >= 1997:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked special teams stats and 'False' otherwise.
    def is_special_teams_season( self, season ):
        if self.get_first_year( season ) >= 1977:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked faceoff percentage and 'False' otherwise.
    def is_faceoff_percentage_season( self, season ):
       if self.get_first_year( season ) >= 1997:
           return True
       
       return False
    

    # This method returns 'True' if the given season tracked time on ice per game and 'False' otherwise.
    def is_time_on_ice_per_game_season( self, season ):
        if self.get_first_year( season ) >= 1997:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked plus-minus and 'False' otherwise.
    def is_plus_minus_season( self, season ): 
        if self.get_first_year( season ) >= 1959:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked shots and 'False' otherwise.
    def is_shots_season( self, season ):
        if self.get_first_year( season ) >= 1959:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked shooting percentage and 'False' 
    # otherwise.
    def is_shooting_percentage_season( self, season ): 
        if self.get_first_year( season ) >= 1959:
            return True
        
        return False


    # This method returns 'True' if the given season tracked skater special team stats and
    # 'False' otherwise.
    def is_skater_special_teams_stats_season( self, season ): 
        if self.get_first_year( season ) >= 1933:
            return True
        
        return False


    # This method returns 'True' if the given season tracked shots against and 'False' otherwise.
    def is_shots_against_season( self, season ):
        if self.get_first_year( season ) >= 1955:
            return True
        
        return False
    

    # This method returns 'True' if the given season tracked save percentage and 'False' otherwise.
    def is_save_percentage_season( self, season ):
        if self.get_first_year( season ) >= 1955:
            return True
        
        return False


    # This method sorts a given list of teams by points percentage, then points, then regulation wins, 
    # then regulation and overtime wins, and finally goals for.
    def sort_teams_by_points( self, teams ):
        teams.sort( key=lambda team: ( team.points_percentage, team.points , team.regulation_wins, team.regulation_and_overtime_wins, team.goals_for), reverse=True )


    # This method returns 'True' if there was one or more seasons in from the first season onwards where 
    # ties were recorded, and 'False' otherwise.
    def seasons_fall_in_ties_period( self, first_season ): 
        first_season_first_year = self.get_first_year( first_season )
        if first_season_first_year <= 2003:
            return True
        
        return False

    
    # This method returns 'True' if a there was one or more seasons in between the first season and the 
    # last season where overtime losses were recorded, and 'False' otherwise.
    def seasons_fall_in_overtime_losses_period( self, last_season ):
        last_season_first_year = self.get_first_year( last_season )

        if last_season_first_year >= 1999:
            return True
        
        return False
    

    # This method returns 'True' if a there was one or more seasons in between the first season and the 
    # last season where  faceoff win percetage was recorded, and 'False' otherwise.
    def seasons_fall_in_faceoff_win_percentage_period( self, last_season ):
        last_season_first_year = self.get_first_year( last_season )

        if last_season_first_year >= 1997:
            return True
        
        return False
    

    # This method returns 'True' if a there was one or more seasons in between the first season and the 
    # last season where special teams stats were recorded, and 'False' otherwise.
    def seasons_fall_in_special_teams_period( self, last_season ):
        last_season_first_year = self.get_first_year( last_season )

        if last_season_first_year >= 1977:
            return True
        
        return False
    

    # This method returns 'True' if there was one or more seasons from the last season or before where the 
    # shootout was active, and 'False' otherwise.
    def seasons_fall_in_shootout_period( self, last_season ):
        last_season_first_year = self.get_first_year( last_season )
        if last_season_first_year >= 2005:
            return True
        
        return False
    

    # This method sorts a given list of teams by wins, and then points percentage.
    def sort_teams_by_wins( self, teams ):
        teams.sort( key=lambda team: ( team.wins, team.points_percentage ), reverse=True )


    # This method returns 'True' if the given season had ties in the playoffs and 'False' otherwise.
    def is_ties_in_playoffs_season( self, season ):
        first_year = self.get_first_year( season )

        if first_year <= 1950:
            return True
        
        return False
    

    # This method returns 'True' if there was one or more seasons in between the first season and the 
    # last season where overtimelosses occurred during the playoffs, and 'False' otherwise.
    def seasons_fall_in_overtime_losses_in_playoffs_period( self, first_season, last_season ):
        first_season_first_year = self.get_first_year( first_season )
        last_season_first_year = self.get_first_year( last_season )

        if first_season_first_year <= 2019 and last_season_first_year >= 2019:
            return True
        
        return False
    

    # This method returns 'True' if there was one or more seasons in between the first season and the
    # last season where ties occurred during the playoffs, and 'False' otherwise.
    def seasons_fall_in_ties_in_playoffs_period( self, first_season ): 
        first_season_first_year = self.get_first_year( first_season )

        if first_season_first_year <= 1950:
            return True
        
        return False
    

    # This method sorts a given list of skater seasons by points, and then goals if 'stat' and
    # 'multiplier' are null, and by the stat in descending order if 'multiplier' equals 1, and in
    # descending order if 'multiplier' equals -1.
    def get_sorted_skater_stats( self, skater_seasons, stat=None, multiplier=None ):
        if stat and multiplier:
            skater_seasons.sort( key=cmp_to_key( lambda season1, season2: self.skater_stat_compare( season1, season2, stat, multiplier ) ) )

        else:
            skater_seasons.sort( key=lambda skater_season: ( skater_season.points, skater_season.goals ), reverse=True )


    # This method sorts a given list of seasons in ascending order.
    def sort_seasons_by_season( self, seasons ): 
        seasons.sort( key=lambda season: ( self.get_first_year( season.season ) ), reverse=False )


    # This method defines how to compare certain NHL skater stats which do not work using the 
    # standard formula (value2 - value1).
    def skater_stat_compare( self, season1, season2, stat, multiplier ):
        if multiplier == -1:
            dummy_season = season1
            season1 = season2
            season2 = dummy_season

        value1 = getattr( season1, stat )
        value2 = getattr( season2, stat )

        if value1 == '--' or value1 == 'null':
            return 1
        elif value2 == '--' or value2 == 'null':
            return -1

        if stat == 'season':
            season1_first_year = self.get_first_year( value1 )
            season2_first_year = self.get_first_year( value2 )
            return season2_first_year - season1_first_year

        elif stat == 'time_on_ice_per_game':
            colon_index1 = value1.index(':')
            minutes1 = int(value1[:colon_index1])
            seconds1 = int(value1[colon_index1 + 1:])

            colon_index2 = value2.index(':')
            minutes2 = int(value2[:colon_index2])
            seconds2 = int(value2[colon_index2 + 1:])

            if minutes1 != minutes2:
                return minutes2 - minutes1
            return seconds2 - seconds1
        else:
            return value2 - value1
        

    # This method sorts a given list of goalie seasons by wins, and then save percentage if 'stat'
    # and 'multiplier' are null, and by the stat in descending order if 'multiplier' equals 1, and
    # in descending order if 'multiplier' equals -1.
    def get_sorted_goalie_stats( self, goalie_seasons, stat=None, multiplier=None ):
        if stat and multiplier:
            goalie_seasons.sort( key=cmp_to_key( lambda season1, season2: self.goalie_stat_compare( season1, season2, stat, multiplier ) ) )

        else:
            goalie_seasons.sort( key=lambda goalie_season: ( goalie_season.wins, goalie_season.save_percentage ), reverse=True )


    # This method defines how to compare certain NHL goalie stats which do not work using the 
    # standard formula (value2 - value1).
    def goalie_stat_compare( self, season1, season2, stat, multiplier ):
        if multiplier == -1:
            dummy_season = season1
            season1 = season2
            season2 = dummy_season

        value1 = getattr( season1, stat )
        value2 = getattr( season2, stat )

        if value1 == '--' or value1 == 'null':
            return 1
        elif value2 == '--' or value2 == 'null':
            return -1

        if stat == 'season':
            season1_first_year = self.get_first_year( value1 )
            season2_first_year = self.get_first_year( value2 )
            return season2_first_year - season1_first_year

        elif stat == 'time_on_ice':
            colon_index1 = value1.index(':')
            minutes1 = int(value1[:colon_index1])
            seconds1 = int(value1[colon_index1 + 1:])

            colon_index2 = value2.index(':')
            minutes2 = int(value2[:colon_index2])
            seconds2 = int(value2[colon_index2 + 1:])

            if minutes1 != minutes2:
                return minutes2 - minutes1
            return seconds2 - seconds1
        
        else:
            return value2 - value1