################################################################################

skater_stats = ('skater_games_played', 'skater_goals', 'skater_assists', 'points', 'plus-minus', 'skater_\
                 penalty_minutes', 'powerplay_goals', 'powerplay_points', 'shorthanded_goals', 'short\
                 handed_points', 'time_on_ice/game', 'game_winning_goals', 'overtime_goals', 'shots', 'shooting\
                 _perecentage', 'faceoff_percentage')

goalie_stats = ('goalie_games_played', 'games_started', 'wins', 'loses', 'ties', 'overtime_loses', 'shots_\
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

    def __init__( self, name, retired, team, number, position, height, weight, birthday, handedness,\
                  draft_position ):
        super().__init__( name, retired, team, number, position, height, weight, birthday, handedness,\
                          draft_position)
        self.seasons = []
        self.playoffs = []


    def add_season( self, season, games_played, goals, assists, points, plus_minus, penalty_minutes,\
                  powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, time_on_ice_per_game,\
                  game_winning_goals, overtime_goals, shots, shooting_percentage, faceoff_percentage ):
        self.seasons.append( SkaterSeason( season, games_played, goals, assists, points, plus_minus,\
                                           penalty_minutes,powerplay_goals, powerplay_points, shorthanded_goals,\
                                           shorthanded_points, time_on_ice_per_game, game_winning_goals,\
                                           overtime_goals, shots, shooting_percentage, faceoff_percentage ) )


    def add_playoffs( self, season, games_played, goals, assists, points, plus_minus, penalty_minutes,\
                  powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, time_on_ice_per_game,\
                  game_winning_goals, overtime_goals, shots, shooting_percentage, faceoff_percentage ):
        self.playoffs.append( SkaterSeason( season, games_played, goals, assists, points, plus_minus,\
                                           penalty_minutes,powerplay_goals, powerplay_points, shorthanded_goals,\
                                           shorthanded_points, time_on_ice_per_game, game_winning_goals,\
                                           overtime_goals, shots, shooting_percentage, faceoff_percentage ) )


################################################################################

class Goalie( Player ):

    def __init__( self, name, team, number, height, weight, birthday, handedness, draft_position ):
        super().__init__( name, team, number, 'goaltender', height, weight, birthday, handedness,\
                          draft_position )
        self.seasons = []
        self.playoffs = []


    def add_season( self, season, games_played, games_started, wins, loses, ties, overtime_loses,\
                  shots_against, goals_against_average, save_percentage, shutouts, goals, assists,\
                  penalty_minutes, time_on_ice ):
        self.seasons.append( GoalieSeason( season, games_played, games_started, wins, loses, ties,\
                                           overtime_loses, shots_against, goals_against_average,\
                                           save_percentage, shutouts, goals, assists, penalty_minutes,\
                                            time_on_ice ) ) 


    def add_playoffs( self, season, games_played, games_started, wins, loses, ties, overtime_loses,\
                  shots_against, goals_against_average, save_percentage, shutouts, goals, assists,\
                  penalty_minutes, time_on_ice ):
        self.playoffs.append( GoalieSeason( season, games_played, games_started, wins, loses, ties,\
                                           overtime_loses, shots_against, goals_against_average,\
                                           save_percentage, shutouts, goals, assists, penalty_minutes,\
                                            time_on_ice ) ) 


################################################################################

class SkaterSeason():

    def __init__( self, season, games_played, goals, assists, points, plus_minus, penalty_minutes,\
                  powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, time_on_ice_per_game,\
                  game_winning_goals, overtime_goals, shots, shooting_percentage, faceoff_percentage ):
        self.season = season
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


################################################################################

class GoalieSeason():

    def __init__( self, season, games_played, games_started, wins, loses, ties, overtime_loses,\
                  shots_against, goals_against_average, save_percentage, shutouts, goals, assists,\
                  penalty_minutes, time_on_ice ):
        self.season = season
        self.games_played = games_played
        self.games_started = games_started
        self.wins = wins
        self.loses = loses
        self.ties = ties
        self.overtime_loses = overtime_loses
        self.shots_against = shots_against
        self.goals_against_average = goals_against_average
        self.save_percentage = save_percentage
        self.shutouts = shutouts
        self.goals = goals
        self.assists = assists
        self.penalty_minutes = penalty_minutes
        self.time_on_ice = time_on_ice


################################################################################

class Team():

    def __init__( self, city, name, games_played, wins, loses, ties, overtime_loses, points,\
                  points_percentage, regulation_wins, regulation_and_overtime_wins, goals_for,\
                  goals_against, goal_differential, home, away, shootout, last_10, streak ):
        self.city = city
        self.name = name
        self.games_played = games_played
        self.wins = wins
        self.loses = loses
        self.ties = ties
        self.overtime_loses = overtime_loses
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

    # returns the city plus a whitespace plus the team name
    def get_full_name( self ): 
        return self.city + ' ' + self.name