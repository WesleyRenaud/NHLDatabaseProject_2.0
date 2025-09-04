import Database
import NHL


################################################################################

class NHLTextUI:
    # This method sets up the database instance variable (without reseting the databases).
    def __init__( self ):
        # connect to the database without reseting the database
        self.database = Database.Database( True )
        self.database.createDB()


    # This method prompts the user to add either a skater or goalie, then enter information for said 
    # skater/goalie, creates a Skater/Goalie object, and then repeatedly prompts the user regular 
    # season stats for the player, and then playoff stats -> finally we add this player to the database 
    # via the database class variable
    def add_player( self ):
        # check if we are adding a skater or a goalie
        player_type = input( " ~ Are you adding a skater or a goalie ? " )

        if player_type == 'skater' or player_type == 'Skater':
            # get the skater's attributes
            name = input( " * Enter the player's name >> " )
            team = input( " * Enter the player's current team if they are active or 'None' if they are inactive >> " )
            number = (int)(input( " * Enter the player's current number if they are active or 'None' if they are inactive >> " ))
            position = input( " * Enter they player's position >> " )
            height = input( " * Enter they player's height >> " )
            weight = input( " * Enter the player's weight >> " )
            birthday = input( " * Enter the player's birthday (YYYY-MM-DD) >> " )
            handedness = input( " * Enter the player's handedness >> " )
            draft_position = input( " * Enter the player's draft position >> " )
            player = NHL.Skater( name, team, number, position, height, weight, birthday, handedness, draft_position )
            
            # get the skater's regular season stats
            print()
            print( "Time to enter seasons for the player ..." )
            finished_adding_seasons = False
            while not finished_adding_seasons: # loop until the user is done adding their seasons
                season = input( " * Enter the season being added (Y1Y1-Y2Y2) >> " )
                games_played = (int)(input( " * Enter the number of games played during the season >> " ))
                goals = (int)(input( " * Enter the number of goals scored during the season >> " ))
                assists = (int)(input( " * Enter the number of assists during the season >> " ))
                points = (int)(input( " * Enter the number of points during the season >> " ))
                plus_minus = (int)(input( " * Enter the plus-minus during the season >> " ))
                penalty_minutes = (int)(input( " * Enter the number of penalty minutes taken during the season >> " ))
                powerplay_goals = (int)(input( " * Enter the number of powerplay goals scored during the season >> " ))
                powerplay_points = (int)(input( " * Enter the number of powerplay points during the season >> " ))
                shorthanded_goals = (int)(input( " * Enter the number of shorthanded goals scored during the season >> " ))
                shorthanded_points = (int)(input( " * Enter the number of shorthanded points during the season >> " ))
                time_on_ice_per_game = input( " * Enter the time on ice/game during the season >> " )
                game_winning_goals = (int)(input( " * Enter the number of game winning goals scored during the season >> " ))
                overtime_goals = (int)(input( " * Enter the number of overtime goals scored during the season >> " ))
                shots = (int)(input( " * Enter the number of shots during the season >> " ))
                shooting_percentage = (float)(input( " * Enter the shooting percentage during the season >> " ))
                faceoff_percentage = (float)(input( " * Enter the faceoff percentage during the season >> " ))
                player.add_season( season, games_played, goals, assists, points, plus_minus, penalty_minutes, 
                                   powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, 
                                   time_on_ice_per_game, game_winning_goals, overtime_goals, shots, 
                                   shooting_percentage, faceoff_percentage )

                choice = input( " * Press any key to enter another season or 'q'/'Q' to quit >> " )
                if choice == 'q' or choice == 'Q':
                    finished_adding_seasons = True
                else:
                    print()

            # get the skater's playoff stats
            print()
            been_in_playoffs = input( " ~ Has the player made the playoffs yet ? ")
            if been_in_playoffs == 'yes' or been_in_playoffs == 'Yes':
                print( "Time to enter playoffs for the player ..." )
                finished_adding_playoffs = False
                while not finished_adding_playoffs: # loop until the user is done adding their seasons
                    season = input( " * Enter the season being added (Y1Y1-Y2Y2) >> " )
                    games_played = (int)(input( " * Enter the number of games played during the season >> " ))
                    goals = (int)(input( " * Enter the number of goals scored during the season >> " ))
                    assists = (int)(input( " * Enter the number of assists during the season >> " ))
                    points = (int)(input( " * Enter the number of points during the season >> " ))
                    plus_minus = (int)(input( " * Enter the plus-minus during the season >> " ))
                    penalty_minutes = (int)(input( " * Enter the number of penalty minutes taken during the season >> " ))
                    powerplay_goals = (int)(input( " * Enter the number of powerplay goals scored during the season >> " ))
                    powerplay_points = (int)(input( " * Enter the number of powerplay points during the season >> " ))
                    shorthanded_goals = (int)(input( " * Enter the number of shorthanded goals scored during the season >> " ))
                    shorthanded_points = (int)(input( " * Enter the number of shorthanded points during the season >> " ))
                    time_on_ice_per_game = input( " * Enter the time on ice/game during the season >> " )
                    game_winning_goals = (int)(input( " * Enter the number of game winning goals scored during the season >> " ))
                    overtime_goals = (int)(input( " * Enter the number of overtime goals scored during the season >> " ))
                    shots = (int)(input( " * Enter the number of shots during the season >> " ))
                    shooting_percentage = (float)(input( " * Enter the shooting percentage during the season >> " ))
                    faceoff_percentage = (float)(input( " * Enter the faceoff percentage during the season >> " ))
                    player.add_playoffs( season, games_played, goals, assists, points, plus_minus, penalty_minutes, 
                                        powerplay_goals, powerplay_points, shorthanded_goals, shorthanded_points, 
                                        time_on_ice_per_game, game_winning_goals, overtime_goals, shots, 
                                        shooting_percentage, faceoff_percentage )

                    choice = input( " * Press any key to enter another season or 'q'/'Q' to quit >> " )
                    if choice == 'q' or choice == 'Q':
                        finished_adding_playoffs = True
                    else:
                        print()

        else: # we are adding a goalie
            # get the goalie's attributes
            name = input( " * Enter the player's name >> " )
            team = input( " * Enter the player's current team if they are active or 'None' if they are inactive >> " )
            number = (int)(input( " * Enter the player's current number if they are active or 'None' if they are inactive >> " ))
            height = input( " * Enter they player's height >> " )
            weight = (int)(input( " * Enter the player's weight >> " ))
            birthday = input( " * Enter the player's birthday (YYYY-MM-DD) >> " )
            handedness = input( " * Enter the player's handedness >> " )
            draft_position = input( " * Enter the player's draft position >> " )
            player = NHL.Goalie( name, team, number, height, weight, birthday, handedness, 
                                 draft_position )
            
            # get the player's regular season stats
            print()
            print( "Time to enter seasons for the player ..." )
            finished_adding_seasons = False
            while not finished_adding_seasons: # loop until the user is done adding their seasons
                season = input( " * Enter the season being added (Y1Y1-Y2Y2) >> " )
                games_played = (int)(input( " * Enter the number of games played during the season >> " ))
                games_started = (int)(input( " * Enter the number of games started during the season >> " ))
                wins = (int)(input( " * Enter the number of wins during the season >> " ))
                Losses = (int)(input( " * Enter the number of Losses during the season >> " ))
                ties = (int)(input( " * Enter the number of ties during the season or 'None' if there are no ties in this season >> " ))
                overtime_Losses = (int)(input( " * Enter the number of overtime Losses during the season or 'None' if there are no " + 
                                        " overtime Losses in the season >> " ))
                shots_against = (int)(input( " * Enter the number of shots against during the season >> " ))
                goals_against_average = (float)(input( " * Enter the goals against average during the season >> " ))
                save_percentage = (float)(input( " * Enter the save percentage during the season >> " ))
                shutouts = (int)(input( " * Enter the number of shutouts during the season >> " ))
                goals = (int)(input( " * Enter the number of goals scored during the season >> " ))
                assists = (int)(input( " * Enter the number of assists during the season >> " ))
                penalty_minutes = (int)(input( " * Enter the number of penalty minutes taken during the season >> " ))
                time_on_ice = (int)(input( " * Enter the time of ice during the season >> " ))
                player.add_season( season, games_played, games_started, wins, Losses, ties, overtime_Losses, 
                                   shots_against, goals_against_average, save_percentage, shutouts, goals, 
                                   assists, penalty_minutes, time_on_ice )                    

                choice = input( " * Press any key to enter another season or 'q'/'Q' to quit >> " )
                if choice == 'q' or choice == 'Q':
                    finished_adding_seasons = True
                else:
                    print()

            # get the skater's playoff stats
            print()
            print( "Time to enter playoffs for the player ..." )
            finished_adding_playoffs = False
            while not finished_adding_playoffs: # loop until the user is done adding their seasons
                season = input( " * Enter the season being added (Y1Y1-Y2Y2) >> " )
                games_played = (int)(input( " * Enter the number of games played during the season >> " ))
                games_started = (int)(input( " * Enter the number of games started during the season >> " ))
                wins = (int)(input( " * Enter the number of wins during the season >> " ))
                Losses = (int)(input( " * Enter the number of Losses during the season >> " ))
                ties = (int)(input( " * Enter the number of ties during the season or 'None' if there are no ties in this season >> " ))
                overtime_Losses = (int)(input( " * Enter the number of overtime Losses during the season or 'None' if there are no " + 
                                        " overtime Losses in the season >> " ))
                shots_against = (int)(input( " * Enter the number of shots against during the season >> " ))
                goals_against_average = (float)(input( " * Enter the goals against average during the season >> " ))
                save_percentage = (float)(input( " * Enter the save percentage during the season >> " ))
                shutouts = (int)(input( " * Enter the number of shutouts during the season >> " ))
                goals = (int)(input( " * Enter the number of goals scored during the season >> " ))
                assists = (int)(input( " * Enter the number of assists during the season >> " ))
                penalty_minutes = (int)(input( " * Enter the number of penalty minutes taken during the season >> " ))
                time_on_ice = (int)(input( " * Enter the time of ice during the season >> " ))
                player.add_playoffs( season, games_played, games_started, wins, Losses, ties, overtime_Losses, 
                                     shots_against, goals_against_average, save_percentage, shutouts, goals, 
                                     assists, penalty_minutes, time_on_ice )

                choice = input( " * Press any key to enter another season or 'q'/'Q' to quit >> " )
                if choice == 'q' or choice == 'Q':
                    finished_adding_playoffs = True
                else:
                    print() 
        
        self.database.add_player( player )


    # This method adds a year of standings to the database by prompting the user to enter the season, 
    # the number of teams in the league during the season, and then the stats for each of those team.
    def add_standings( self ):
        season = input( " * Enter the season whose stats are being entered >> " )
        num_teams = input( " * Enter the number of teams that were in the league during the %s season >> " % season )
        teams = []

        for i in range( num_teams ):
            print( " * Entering the stats for team %d ..." % (i + 1) )
            city = input( " * Enter the city of team %d >> " % (i + 1) )
            name = input( " * Enter the name of team %d >> " % (i + 1) )
            games_played = (int)(input( " * Enter the number of games played for the %s >> " % (city + " " + name) ))
            wins = (int)(input( " * Enter the number of wins for the %s >> " % (city + " " + name ) ))
            Losses = (int)(input( " * Enter the number of Losses for %s >> " % (city + " " + name) ))
            overtime_Losses = (int)(input( " * Enter the number of overtime Losses for %s or 'None' if there are no overtime " +
                                    " Losses during the season >> " % (city + " " + name) ))
            ties = (int)(input( " * Enter the number of ties for %s or 'None' if there are no ties during the season >> " 
                          % (city + " " + name) ))
            points = (int)(input( " * Enter the number of points for %s >> " % (city + " " + name) ))
            points_percentage = (float)(input( " * Enter the points percentage for %s >> " % (city + " " + name) ))
            regulation_wins = (int)(input( " * Enter the number of regulation wins for %s >> " % (city + " " + name ) ))
            regulation_and_overtime_wins = (int)(input( " * Enter the number of regulation and overtime wins for %s >> " 
                                                  % (city + " " + name ) ))
            goals_for = (int)(input( " * Enter the number of goals for %s >> " % (city + " " + name) ))
            goals_against = (int)(input( " * Enter the number of goals against for %s >> " % (city + " " + name) ))
            goal_differential = (int)(input( " * Enter the goal differential for %s >> " % (city + " " + name) ))
            home = input( " * Enter the home record for %s >> " % (city + " " + name) )
            away = input( " * Enter the away record for %s >> " % (city + " " + name) )
            shootout = input( " * Enter the shootout record for %s >> " % (city + " " + name) )
            last_10 = input( " * Enter the last 10 for %s >> " % (city + " " + name) )
            streak = input( " * Enter the streak for %s >> " % (city + " " + name) )
            shootout_wins = (int)(input( " * Enter the number of shootout wins for %s >> " % (city + " " + name) ))
            goals_for_per_game = (float)(input( " * Enter the goals for per game for %s >> " % (city + " " + name) ))
            goals_against_per_game = (float)(input( " * Enter the goals against per game for %s >> " % (city + " " + name) ))
            powerplay_percentage = (float)(input( " * Enter the powerplay percentage for %s >> " % (city + " " + name) ))
            penalty_kill_percentage = (float)(input( " * Enter the penalty kill percentage for %s >> " % (city + " " + name) ))
            net_powerplay_percentage = (float)(input( " * Enter the net powerplay percentage for %s >> " % (city + " " + name) ))
            net_penalty_kill_percentage = (float)(input( " * Enter the net penalty kill percentage for %s >> " % (city + " " + name) ))
            faceoff_win_percentage = (float)(input( " * Enter the faceoff win percentage for %s >> " % (city + " "  + name) ))

            teams.append( NHL.team( city, name, games_played, wins, Losses, overtime_Losses, ties, points, 
                                    points_percentage, regulation_wins, regulation_and_overtime_wins, 
                                    goals_for, goals_against, goal_differential, home, away, shootout,
                                    last_10, streak, shootout_wins, goals_for_per_game, goals_against_per_game,
                                    powerplay_percentage, penalty_kill_percentage, net_powerplay_percentage,
                                    net_penalty_kill_percentage, faceoff_win_percentage ) )
            
        self.database.add_standings( teams )
            
    
    # This method adds a year of playoff standings to the database by prompting the user to enter the 
    # season, the number of teams in the playoffs during the season, and then the stats for each of those 
    # teams.
    def add_playoffs( self ):
        season = input( " * Enter the season whose stats are being entered >> " )
        num_teams = input( " * Enter the number of teams that were in the playoffs during the %s season >> " % season )
        teams = []

        for i in range( num_teams ):
            print( " * Entering the stats for team %d ..." % (i + 1) )
            city = input( " * Enter the city of team %d >> " % (i + 1) )
            name = input( " * Enter the name of team %d >> " % (i + 1) )
            games_played = (int)(input( " * Enter the number of games played for the %s >> " % (city + " " + name) ))
            wins = (int)(input( " * Enter the number of wins for the %s >> " % (city + " " + name ) ))
            Losses = (int)(input( " * Enter the number of Losses for %s >> " % (city + " " + name) ))
            overtime_Losses = (int)(input( " * Enter the number of overtime Losses for %s or 'None' if there are no overtime " +
                                    " Losses during the season >> " % (city + " " + name) ))
            ties = (int)(input( " * Enter the number of ties for %s or 'None' if there are no ties during the season >> " 
                          % (city + " " + name) ))
            points = (int)(input( " * Enter the number of points for %s >> " % (city + " " + name) ))
            points_percentage = (float)(input( " * Enter the points percentage for %s >> " % (city + " " + name) ))
            regulation_wins = (int)(input( " * Enter the number of regulation wins for %s >> " % (city + " " + name ) ))
            regulation_and_overtime_wins = (int)(input( " * Enter the number of regulation and overtime wins for %s >> " 
                                                  % (city + " " + name ) ))
            goals_for = (int)(input( " * Enter the number of goals for %s >> " % (city + " " + name) ))
            goals_against = (int)(input( " * Enter the number of goals against for %s >> " % (city + " " + name) ))
            goal_differential = (int)(input( " * Enter the goal differential for %s >> " % (city + " " + name) ))
            home = input( " * Enter the home record for %s >> " % (city + " " + name) )
            away = input( " * Enter the away record for %s >> " % (city + " " + name) )
            shootout = input( " * Enter the shootout record for %s >> " % (city + " " + name) )
            last_10 = input( " * Enter the last 10 for %s >> " % (city + " " + name) )
            streak = input( " * Enter the streak for %s >> " % (city + " " + name) )
            shootout_wins = (int)(input( " * Enter the number of shootout wins for %s >> " % (city + " " + name) ))
            goals_for_per_game = (float)(input( " * Enter the goals for per game for %s >> " % (city + " " + name) ))
            goals_against_per_game = (float)(input( " * Enter the goals against per game for %s >> " % (city + " " + name) ))
            powerplay_percentage = (float)(input( " * Enter the powerplay percentage for %s >> " % (city + " " + name) ))
            penalty_kill_percentage = (float)(input( " * Enter the penalty kill percentage for %s >> " % (city + " " + name) ))
            net_powerplay_percentage = (float)(input( " * Enter the net powerplay percentage for %s >> " % (city + " " + name) ))
            net_penalty_kill_percentage = (float)(input( " * Enter the net penalty kill percentage for %s >> " % (city + " " + name) ))
            faceoff_win_percentage = (float)(input( " * Enter the faceoff win percentage for %s >> " % (city + " "  + name) ))

            teams.append( NHL.team( city, name, games_played, wins, Losses, overtime_Losses, ties, points, 
                                    points_percentage, regulation_wins, regulation_and_overtime_wins, 
                                    goals_for, goals_against, goal_differential, home, away, shootout,
                                    last_10, streak, shootout_wins, goals_for_per_game, goals_against_per_game,
                                    powerplay_percentage, penalty_kill_percentage, net_powerplay_percentage,
                                    net_penalty_kill_percentage, faceoff_win_percentage ) )
            
        self.database.add_playoffs( teams )

    
if __name__ == "__main__":
    textUI = NHLTextUI()
    while True == True:
        print( "Printing Menu ..." )
        print( " [1] Add New Player" )
        print( " [2] Add New Standings" )
        choice = (int)(input( " * Enter Choice >> " ))

        if choice == 1:
            textUI.add_player()
        elif choice == 2:
            textUI.add_standings()
        else:
            print( " ! Error - Invalid Choice !" )