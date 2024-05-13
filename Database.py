import os
import sqlite3

import NHL


################################################################################

class Database():

    # creates a database connection to 'phylib.db', deleting the old database if reset = True
    def __init__( self, reset = False ):
        if reset == True and os.path.exists( 'stats.db' ):
            os.remove( 'stats.db' )

        self.conn = sqlite3.connect( 'stats.db' )


    # creates all of the tables for the database
    def createDB( self ):
        cur = self.conn.cursor()

        # create the Ball table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Skater'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific ball at a specific time
            cur.execute( """ CREATE TABLE Skater
                              ( SKATERID        INTEGER     PRIMARY KEY     NOT NULL,
                                NAME            VARCHAR(64) NOT NULL,
                                TEAM            VARCHAR(64),
                                NUMBER          INTEGER,
                                POSITION        VARCHAR(64) NOT NULL,
                                HEIGHT          VARCHAR(64) NOT NULL,
                                WEIGHT          INTEGER     NOT NULL,
                                BIRTHDAY        VARCHAR(64) NOT NULL,
                                HANDEDNESS      VARCHAR(64) NOT NULL,
                                DRAFT_POSITION  VARCHAR(64) ); """ )
        

        # create the TTable table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'SkaterSeasons'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific table at a specific time
            cur.execute( """ CREATE TABLE SkaterSeasons
                              ( SKATERID        INTEGER     NOT NULL,
                                SKATERSEASONID  INTEGER     NOT NULL, 
                                FOREIGN KEY (SKATERID)          REFERENCES Skater,
                                FOREIGH KEY (SKATERSEASONID)    REFERENCES SkaterSeason ); """ )
        

        # create the BallTable table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'SkaterSeason'; """ ).fetchall()
        if table == []:
            # this table connects the balls to the tables via their IDs
            cur.execute( """CREATE TABLE SkaterSeason 
                              ( SKATERSEASONID      INTEGER     PRIMARY KEY NOT NULL,
                                SEASON              VARCHAR(64) NOT NULL,
                                GAMES_PLAYED        INTEGER     NOT NULL,
                                GOALS               INTEGER     NOT NULL,
                                ASSISTS             INTEGER     NOT NULL,
                                POINTS              INTEGER     NOT NULL,
                                PLUS-MINUS          INTEGER     NOT NULL,
                                PENALTY_MINUTES     INTEGER     NOT NULL,
                                POWERPLAY_GOALS     INTEGER     NOT NULL,
                                POWERPLAY_POINTS    INTEGER     NOT NULL,
                                SHORTHANDED_GOALS   INTEGER     NOT NULL,
                                SHORTHANDED_POINTS  INTEGER     NOT NULL,
                                TIME_ONE_ICE/GAME   FLOAT       NOT NULL,
                                GAME_WINNING_GOALS  INTEGER     NOT NULL,
                                OVERTIME_GOALS      INTEGER     NOT NULL,
                                SHOTS               INTEGER     NOT NULL,
                                SHOOTING_PERCENTAGE FLOAT       NOT NULL,
                                FACEOFF_PERCENTAGE  FLOAT       NOT NULL ); """ )


        # create the Shot table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Goalie'; """ ).fetchall()
        if table == []:
            # a row in this table represents one shot through the player and the game
            # which it occurs; shots are assumed to be in order of the SHOTIDs
            cur.execute( """CREATE TABLE Goalie
                              ( GOALIE          INTEGER     PRIMARY KEY   NOT NULL,
                                NAME            VARCHAR(64) NOT NULL,
                                TEAM            VARCHAR(64),
                                NUMBER          INTEGER,
                                HEIGHT          VARCHAR(64) NOT NULL,
                                WEIGHT          INTEGER     NOT NULL,
                                BIRTHDAY        VARCHAR(64) NOT NULL,
                                HANDEDNESS      VARCHAR(64) NOT NULL,
                                DRAFT_POSITION  VARCHAR(64) ); """ )
        

        # create the TableShot table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'GoalieSeasons'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific table at a specific time
            cur.execute( """ CREATE TABLE GoalieSeasons
                              ( GOALIEID        INTEGER     NOT NULL,
                                GOALIESEASONID  INTEGER     NOT NULL, 
                                FOREIGN KEY (GOALIEID)          REFERENCES Goalie,
                                FOREIGH KEY (GOALIESEASONID)    REFERENCES GoalieSeason ); """ )
        

        # create the Game table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'GoalieSeason'; """ ).fetchall() 
        if table == []:     
            # this table connects game IDs to game names
            cur.execute( """CREATE TABLE GoalieSeason
                              ( GOALIESEASONID          INTEGER     PRIMARY KEY   NOT NULL,
                                SEASON                  VARCHAR(64) NOT NULL,
                                GAMES_PLAYED            INTEGER     NOT NULL,
                                GAMES_STARTED           INTEGER     NOT NULL,
                                WINS                    INTEGER     NOT NULL,
                                LOSES                   INTEGER     NOT NULL,
                                TIES                    INTEGER,
                                OVERTIME_LOSES          INTEGER,
                                SHOTS_AGAINST           INTEGER     NOT NULL,
                                GOALS_AGAINST_AVERAGE   FLOAT       NOT NULL,
                                SAVE_PERCENTAGE         FLOAT       NOT NULL,
                                SHUTOUTS                INTEGER     NOT NULL,
                                GOALS                   INTEGER     NOT NULL,
                                ASSISTS                 INTEGER     NOT NULL,
                                PENALTY_MINUTES         INTEGER     NOT NULL,
                                TIME_ON_ICE             INTEGER     NOT NULL ); """ )


        # create the Player table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Standings'; """ ).fetchall() 
        if table == []: 
            # this table connects players to games, and assumes players with smaller
            # IDs go first
            cur.execute( """CREATE TABLE Standings
                              ( STANDINGSID INTEGER     PRIMARY KEY   NOT NULL,
                                SEASON      VARCHAR(64) NOT NULL ); """ )


        # create the TableShot table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'StandingsTeam'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific table at a specific time
            cur.execute( """ CREATE TABLE StandingsTeam
                              ( STANDINGSID INTEGER     NOT NULL,
                                TEAMID      INTEGER     NOT NULL, 
                                FOREIGN KEY (STANDINGSID)       REFERENCES Standings,
                                FOREIGH KEY (TEAMID)            REFERENCES Team ); """ )


        # create the TableShot table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Team'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific table at a specific time
            cur.execute( """ CREATE TABLE Team
                              ( TEAMID                          INTEGER     PRIMARY KEY     NOT NULL,
                                CITY                            VARCHAR(64) NOT NULL,
                                NAME                            VARCHAR(64) NOT NULL,
                                GAMES_PLAYED                    INTEGER     NOT NULL,
                                WINS                            INTEGER     NOT NULL,
                                LOSES                           INTEGER     NOT NULL,
                                TIES                            INTEGER,
                                OVERTIME_LOSES                  INTEGER,
                                POINTS                          INTEGER     NOT NULL,
                                POINTS_PERCENTAGE               FLOAT       NOT NULL,
                                REGULATION_WINS                 INTEGER     NOT NULL,
                                REGULATION_AND_OVERTIME_WINS    INTEGER     NOT NULL,
                                GOALS_FOR                       INTEGER     NOT NULL,
                                GOALS_AGAINST                   INTEGER     NOT NULL,
                                GOAL_DIFFERENTIAL               INTEGER     NOT NULL,
                                HOME                            VARCHAR(64) NOT NULL,
                                AWAY                            VARCHAR(64) NOT NULL,
                                SHOOTOUT                        VARCHAR(64) NOT NULL,
                                LAST_10                         VARCHAR(64) NOT NULL,
                                STREAK                          VARCHAR(64) NOT NULL ); """ )


        # create the TableShot table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Playoffs'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific table at a specific time
            cur.execute( """ CREATE TABLE Playoffs 
                              ( STANDINGSID INTEGER     PRIMARY KEY   NOT NULL,
                                SEASON      VARCHAR(64) NOT NULL ); """ )


        # create the TableShot table
        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'PlayoffsTeam'; """ ).fetchall()
        if table == []:
            # each row in this table represents a specific table at a specific time
            cur.execute( """ CREATE TABLE PlayoffsTeam
                              ( PLAYOFFSID  INTEGER     NOT NULL,
                                TEAMID      INTEGER     NOT NULL, 
                                FOREIGN KEY (PLAYOFFSID)    REFERENCES Standings,
                                FOREIGH KEY (TEAMID)        REFERENCES Team ); """ )

        cur.close()
        self.conn.commit()


    # TO-DO: write methods for adding to the database
    # This method adds a player to the database by first checking whether they are a skater or a goalie, 
    # then adding their personal details to either the Skater or the Goalie table, then adding their
    # regular season and playoff stats to the appropriate tables.
    def add_player( self, player ):
        cur = self.conn.cursor()

        if player.__class__ == NHL.Skater:
            # put the details into the Skater table
            cur.execute( """ INSERT
                                INTO Skater ( SKATERID, NAME, TEAM, NUMBER, POSITION, HEIGHT, WEIGHT, BIRTHDAY, 
                                              HANDEDNESS, DRAFT_POSITION )
                                     VALUES ( %s, %s, %d, %s, %s, %d, %s, %s, %s ); """ % 
                                            ( player.name, player.team, player.number, player.position,
                                              player.height, player.weight, player.birthday, player.handedness,
                                              player.draft_position ) )
            skater_id = cur.lastrowid

            # Put the regular season stats in the SkaterSeason table and connect each entry to the skater 
            # via the SkaterSeasons table.
            for i in range( player.seasons.size ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERSEASONID, SEASON, GAMES_PLAYED, GOALS, ASSISTS,
                                                        POINTS, PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                                        POWERPLAY_POINTS, SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                                        TIME_ON_ICE_PER_GAME, GAME_WINNING_GOALS, OVERTIME_GOALS
                                                        SHOTS, SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %f, %d,
                                                        %d, %d, %f, %f ); """ %
                                                      ( player.seasons[i].season, player.seasons[i].games_played,
                                                        player.seasons[i].goals, player.seasons[i].assists, 
                                                        player.seasons[i].points, player.seasons[i].plus_minus,
                                                        player.seasons[i].penalty_minutes, player.seasons[i].powerplay_goals,
                                                        player.seasons[i].powerplay_points, player.seasons[i].shorthanded_goals,
                                                        player.seasons[i].shorthanded_points, player.seasons[i].time_one_ice_per_game,
                                                        player.seasons[i].game_winning_goals, player.seasons[i].overtime_goals,
                                                        player.seasons[i].shots, player.seasons[i].shooting_percentage,
                                                        player.seasons[i].faceoff_percentage ) )
                skater_season_id = cur.lastrowid

                cur.execute( """ INSERT
                                    INTO SkaterSeasons ( SKATERID, SKATERSEASONID )
                                            VALUES     ( %d, %d ); """ % ( skater_id, skater_season_id ) )

            # do the same thing for the playoffs
            for i in range( player.playoffs.size ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERSEASONID, SEASON, GAMES_PLAYED, GOALS, ASSISTS,
                                                        POINTS, PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                                        POWERPLAY_POINTS, SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                                        TIME_ON_ICE_PER_GAME, GAME_WINNING_GOALS, OVERTIME_GOALS
                                                        SHOTS, SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %f, %d,
                                                        %d, %d, %f, %f ); """ %
                                                      ( player.seasons[i].season, player.seasons[i].games_played,
                                                        player.seasons[i].goals, player.seasons[i].assists, 
                                                        player.seasons[i].points, player.seasons[i].plus_minus,
                                                        player.seasons[i].penalty_minutes, player.seasons[i].powerplay_goals,
                                                        player.seasons[i].powerplay_points, player.seasons[i].shorthanded_goals,
                                                        player.seasons[i].shorthanded_points, player.seasons[i].time_one_ice_per_game,
                                                        player.seasons[i].game_winning_goals, player.seasons[i].overtime_goals,
                                                        player.seasons[i].shots, player.seasons[i].shooting_percentage,
                                                        player.seasons[i].faceoff_percentage ) )
                skater_season_id = cur.lastrowid

                cur.execute( """ INSERT
                                    INTO SkaterPlayoffs ( SKATERID, SKATERSEASONID )
                                            VALUES     ( %d, %d ); """ % ( skater_id, skater_season_id ) )

        else:
            # put the details into the Goalie table
            cur.execute( """ INSERT
                                INTO Goalie ( GOALIEID, NAME, TEAM, NUMBER, HEIGHT, WEIGHT, BIRTHDAY, 
                                              HANDEDNESS, DRAFT_POSITION )
                                     VALUES ( %s, %s, %d, %s, %s, %d, %s, %s, %s ); """ % 
                                            ( player.name, player.team, player.number, player.height, 
                                              player.weight, player.birthday, player.handedness,
                                              player.draft_position ) )
            goalie_id = cur.lastrowid

            # Put the regular season stats in the GoalieSeason table and connect each entry to the goalie 
            # via the GoalieSeasons table.
            for i in range( player.seasons.size ):
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIESEASONID, SEASON, GAMES_PLAYED, GAMES_STARTED,
                                                        WINS, LOSES, TIES, OVERTIME_LOSES, SHOTS_AGAINST,
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE, SHUTOUTS, 
                                                        GOALS, ASSISTS, PENALTY_MINUTES, TIME_ON_ICE )
                                               VALUES ( %s, %d, %d, %d, %d, %d, %d, %d, %f, %f, %d, %d, %d
                                                        %d, %d ); """ %
                                                      ( player.seasons[i].season, player.seasons[i].games_played,
                                                        player.seasons[i].games_started, player.seasons[i].wins, 
                                                        player.seasons[i].loses, player.seasons[i].overtime_loses,
                                                        player.seasons[i].shots_against, player.seasons[i].goals_against_average,
                                                        player.seasons[i].save_percentage, player.seasons[i].shutouts,
                                                        player.seasons[i].goals, player.seasons[i].assists,
                                                        player.seasons[i].penalty_minutes, player.seasons[i].time_on_ice ) )
                goalie_season_id = cur.lastrowid

                cur.execute( """ INSERT
                                    INTO GoalieSeasons ( GOALIEID, GOALIESEASONID )
                                            VALUES     ( %d, %d ); """ % ( goalie_id, goalie_season_id ) )

            # do the same thing for the playoffs
            for i in range( player.playoffs.size ):
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIESEASONID, SEASON, GAMES_PLAYED, GAMES_STARTED,
                                                        WINS, LOSES, TIES, OVERTIME_LOSES, SHOTS_AGAINST,
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE, SHUTOUTS, 
                                                        GOALS, ASSISTS, PENALTY_MINUTES, TIME_ON_ICE )
                                               VALUES ( %s, %d, %d, %d, %d, %d, %d, %d, %f, %f, %d, %d, %d
                                                        %d, %d ); """ %
                                                      ( player.seasons[i].season, player.seasons[i].games_played,
                                                        player.seasons[i].games_started, player.seasons[i].wins, 
                                                        player.seasons[i].loses, player.seasons[i].overtime_loses,
                                                        player.seasons[i].shots_against, player.seasons[i].goals_against_average,
                                                        player.seasons[i].save_percentage, player.seasons[i].shutouts,
                                                        player.seasons[i].goals, player.seasons[i].assists,
                                                        player.seasons[i].penalty_minutes, player.seasons[i].time_on_ice ) )
                goalie_season_id = cur.lastrowid

                cur.execute( """ INSERT
                                    INTO GoaliePlayoffs ( GOALIEID, GOALIESEASONID )
                                             VALUES     ( %d, %d ); """ % ( goalie_id, goalie_season_id ) )

        cur.close()
        self.conn.commit()


    # Adds a set of standings to the database given the season the standings occurred in and a list of the 
    # teams' performances during said season.
    def add_standings( self, teams, season ): 
        cur = self.conn.cursor()

        # start by adding the season to the Standings table
        cur.execute( """ INSERT
                            INTO Standings ( STANDINGSID, SEASON )
                                    VALUES ( %s ); """ % ( season ) )
        standings_id = cur.lastrowid

        # add each team to the database and link the to the Standings table using the StandingsTeam table
        for i in range( teams.size ):
            cur.execute( """ INSERT
                                INTO Team ( TEAMID, CITY, NAME, GAMES_PLAYED, WINS, LOSES, TIES, OVERTIME_LOSES,
                                            POINTS, POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, 
                                            GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, 
                                            LAST_10, STREAK) 
                                   VALUES ( %s, %s, %d, %d, %d, %d, %d, %d, %f, %d, %d, %d, %d, %d, %s,
                                            %s, %s, %s, %s ); """ %
                                          ( teams[i].city, teams[i].name, teams[i].games_played, teams[i].wins,
                                            teams[i].loses, teams[i].ties, teams[i].overtime_loses,
                                            teams[i].points, teams[i].points_percentage, teams[i].regulation_wins,
                                            teams[i].regulation_and_overtime_wins, teams[i].goals_for,
                                            teams[i].goals_against, teams[i].goal_differential, teams[i].home,
                                            teams[i].away, teams[i].shootout, teams[i].last_10, teams[i].streak ) )
            team_id = cur.lastrowid
            cur.execute( """ INSERT
                                INTO StandingsTeam ( STANDINGSID, TEAMID )
                                            VALUES ( %d, %d ); """ % ( standings_id, team_id ) )

        cur.close()
        self.conn.commit()


    # Adds a set of playoffs to the database given the season the playoffs occurred in and a list of the 
    # teams' performances during said playoffs.
    def add_playoffs( self, teams, season ): 
        cur = self.conn.cursor()

        # start by adding the season to the Standings table
        cur.execute( """ INSERT
                            INTO PLAYOFFS ( PLAYOFFSID, SEASON )
                                   VALUES ( %s ); """ % ( season ) )
        playoffs_id = cur.lastrowid

        # add each team to the database and link the to the Standings table using the StandingsTeam table
        for i in range( teams.size ):
            cur.execute( """ INSERT
                                INTO Team ( TEAMID, CITY, NAME, GAMES_PLAYED, WINS, LOSES, TIES, OVERTIME_LOSES,
                                            POINTS, POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, 
                                            GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, 
                                            LAST_10, STREAK) 
                                   VALUES ( %s, %s, %d, %d, %d, %d, %d, %d, %f, %d, %d, %d, %d, %d, %s,
                                            %s, %s, %s, %s ); """ %
                                          ( teams[i].city, teams[i].name, teams[i].games_played, teams[i].wins,
                                            teams[i].loses, teams[i].ties, teams[i].overtime_loses,
                                            teams[i].points, teams[i].points_percentage, teams[i].regulation_wins,
                                            teams[i].regulation_and_overtime_wins, teams[i].goals_for,
                                            teams[i].goals_against, teams[i].goal_differential, teams[i].home,
                                            teams[i].away, teams[i].shootout, teams[i].last_10, teams[i].streak ) )
            team_id = cur.lastrowid
            cur.execute( """ INSERT
                                INTO PlayoffsTeam ( PLAYOFFSID, TEAMID )
                                           VALUES ( %d, %d ); """ % ( playoffs_id, team_id ) )

        cur.close()
        self.conn.commit()


    # This method returns a 'Player' object with all of the stats and attributes of the player as specified 
    # in the database.
    def get_player( self, player_name ):
        cur = self.conn.cursor()
        players = []

        # check if the player is in the skater table
        data = cur.execute( """ SELECT * FROM Skater
                                    WHERE Skater.NAME = %s; """ % player_name )
        
        if data != None: # if they are, parse the data from it
            for i in range( data.count ): # there may be more than one player
                row = data.fetchone()
                skater = NHL.Skater( row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],\
                                     row[9] )
                skater_id = cur.lastrowid

                # get the skater's regular seasons
                seasons = cur.execute( """ SELECT * FROM SkaterSeasons, SkaterSeason
                                            WHERE SkaterSeasons.SKATERID = %d 
                                              AND SkaterSeasons.SKATERSEASONID = 
                                                  SkaterSeason.SKATERSEASONID; """ % skater_id ).fetchall()
                for i in range( data.count ):
                    skater.add_season( seasons[i][3], seasons[i][4], seasons[i][5], seasons[i][6],\
                                       seasons[i][7], seasons[i][8], seasons[i][9], seasons[i][10],\
                                       seasons[i][11], seasons[i][12], seasons[i][13], seasons[i][14],\
                                       seasons[i][15], seasons[i][16], seasons[i][17], seasons[i][18],\
                                       seasons[i][19] )
                    
                # get the skater's playoffs
                seasons = cur.execute( """ SELECT * FROM SkaterPlayoffs, SkaterSeason
                                            WHERE SkaterPlayoffs.SKATERID = %d 
                                              AND SkaterPlayoffs.SKATERPLAYOFFSID = 
                                                  SkaterSeason.SKATERSEASONID; """ % skater_id ).fetchall()
                for i in range( data.count ):
                    skater.add_playoffs( seasons[i][3], seasons[i][4], seasons[i][5], seasons[i][6],\
                                         seasons[i][7], seasons[i][8], seasons[i][9], seasons[i][10],\
                                         seasons[i][11], seasons[i][12], seasons[i][13], seasons[i][14],\
                                         seasons[i][15], seasons[i][16], seasons[i][17], seasons[i][18],\
                                         seasons[i][19] )
                    
                players.append( skater )
                return players
                
        else: # else, check if they are a skater and if they are, parse the data from there
            data = cur.execute( """ SELECT * FROM Goalie
                                    WHERE Goalie.NAME = %s; """ % player_name )
            if data != None:
                for i in range( data.count ): # there may be more than one player
                    row = data.fetchone()
                    goalie = NHL.Goalie( row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8] )
                    goalie_id = cur.lastrowid

                    # get the skater's regular seasons
                    seasons = cur.execute( """ SELECT * FROM GoalieSeasons, GoalieSeason
                                                WHERE GoalieSeasons.GOALIEID = %d 
                                                  AND GoalieSeasons.GOALIESEASONID = 
                                                      GoalieSeason.GOALIESEASONID; """ % goalie_id ).fetchall()
                    for i in range( data.count ):
                        goalie.add_season( seasons[i][3], seasons[i][4], seasons[i][5], seasons[i][6],\
                                           seasons[i][7], seasons[i][8], seasons[i][9], seasons[i][10],\
                                           seasons[i][11], seasons[i][12], seasons[i][13], seasons[i][14],\
                                           seasons[i][15], seasons[i][16], seasons[i][17] )
                        
                    # get the skater's playoffs
                    seasons = cur.execute( """ SELECT * FROM GoaliePlayoffs, GoalieSeason
                                                WHERE GoaliePlayoffs.GOALIEID = %d 
                                                  AND GoaliePlayoffs.GOALIEPLAYOFFSID = 
                                                      GoalieSeason.GOALIESEASONID; """ % goalie_id ).fetchall()
                    for i in range( data.count ):
                        goalie.add_playoffs( seasons[i][3], seasons[i][4], seasons[i][5], seasons[i][6],\
                                             seasons[i][7], seasons[i][8], seasons[i][9], seasons[i][10],\
                                             seasons[i][11], seasons[i][12], seasons[i][13], seasons[i][14],\
                                             seasons[i][15], seasons[i][16], seasons[i][17] )
                        
                    players.append( goalie )
                    return players
        cur.close()


    # This method returns a list of all of the players on the team given as input in the season given as input 
    # sorted by the stat given as input in ascending order if 'multiplier' is positive, and descending order 
    # if 'multiplier' is negative.
    def get_team_leaders( self, season, team, stat, multiplier ):
        cur = self.conn.cursor()
        players = []

        # check if the stat is a skater stat or a goalie stat
        if NHL.skater_stats.__contains__( stat ):
            # consider if we are getting the stats in ascending or descending order
            if multiplier > 0:
                skaters = cur.execute( """ SELECT * FROM Skater, SkaterSeasons, SkaterSeason
                                            WHERE SkaterSeason.SEASON = %s 
                                            AND SkaterSeason.SKATERSEASONID = SkaterSeasons.SKATERSEASONID 
                                            AND SkaterSeasons.SKATERID = Skater.SKATERID
                                            AND Skater.TEAM = %s
                                            ORDER BY SKATERSEASON.%s ASC; """ % ( season, team, stat ) ).fetchall()
            else:
                skaters = cur.execute( """ SELECT * FROM Skater, SkaterSeasons, SkaterSeason
                                            WHERE SkaterSeason.SEASON = %s 
                                            AND SkaterSeason.SKATERSEASONID = SkaterSeasons.SKATERSEASONID 
                                            AND SkaterSeasons.SKATERID = Skater.SKATERID
                                            AND Skater.TEAM = %s
                                            ORDER BY SKATERSEASON.%s DESC; """ % ( season, team, stat ) ).fetchall()
                
            for i in range( skaters.count ): # get the first skater and add them to the list
                players.append( self.get_player( skaters[i][1] ) )
            cur.close()
            return players
        
        else:
            if multiplier > 0:
                goalies = cur.execute( """ SELECT * FROM Goalie, GoalieSeasons, GoalieSeason
                                            WHERE GoalieSeason.SEASON = %s 
                                            AND GoalieSeason.GOALIESEASONID = GoalieSeasons.GOALIESEASONID 
                                            AND GoalieSeasons.GOALIEID = Goalie.GOALIEID
                                            AND Goalie.TEAM = %s
                                            ORDER BY GOALIESEASON.%s ASC; """ % ( season, team, stat ) ).fetchall()
            else:
                goalies = cur.execute( """ SELECT * FROM Goalie, GoalieSeasons, GoalieSeason
                                            WHERE GoalieSeason.SEASON = %s 
                                            AND GoalieSeason.GOALIESEASONID = GoalieSeasons.GOALIESEASONID 
                                            AND GoalieSeasons.GOALIEID = Goalie.GOALIEID
                                            AND Goalie.TEAM = %s
                                            ORDER BY GOALIESEASON.%s DESC; """ % ( season, team, stat ) ).fetchall()
                
            for i in range( goalies.count ): # get the first goalie and add them to the list
                players.append( self.get_player( goalies[i][1] ) )
            cur.close()
            return players


    # This method returns a list of 'num_players' players in the season given as input sorted by the stat 
    # given as input in ascending order if 'multiplier' is positive, and descending order if 'multiplier' 
    # is negative.
    def get_league_leaders( self, season, stat, num_players, multiplier ): 
        cur = self.conn.cursor()
        players = []

        # check if the stat is a skater stat or a goalie stat
        if NHL.skater_stats.__contains__( stat ):
            # consider if we are getting the stats in ascending or descending order
            if multiplier > 0:
                skaters = cur.execute( """ SELECT * FROM Skater, SkaterSeasons, SkaterSeason
                                            WHERE SkaterSeason.SEASON = %s 
                                            AND SkaterSeason.SKATERSEASONID = SkaterSeasons.SKATERSEASONID 
                                            AND SkaterSeasons.SKATERID = Skater.SKATERID
                                           ORDER BY SKATERSEASON.%s ASC; """ % ( season, stat ) )
            else:
                skaters = cur.execute( """ SELECT * FROM Skater, SkaterSeasons, SkaterSeason
                                            WHERE SkaterSeason.SEASON = %s 
                                            AND SkaterSeason.SKATERSEASONID = SkaterSeasons.SKATERSEASONID 
                                            AND SkaterSeasons.SKATERID = Skater.SKATERID
                                           ORDER BY SKATERSEASON.%s DESC; """ % ( season, stat ) )
                
            for i in range( num_players ): # get the first skater and add them to the list
                skater = skaters.fetchone()
                players.append( self.get_player( skater[1] ) )
            cur.close()
            return players
        
        else:
            # consider if we are getting the stats in ascending or descending order
            if multiplier > 0:
                goalies = cur.execute( """ SELECT * FROM Goalie, GoalieSeasons, GoalieSeason
                                            WHERE GoalieSeason.SEASON = %s 
                                              AND GoalieSeason.GOALIESEASONID = GoalieSeasons.GOALIESEASONID 
                                              AND GoalieSeasons.GOALIEID = Goalie.GOALIEID
                                            ORDER BY GOALIESEASON.%s ASC; """ % ( season, stat ) )
            else:
                goalies = cur.execute( """ SELECT * FROM Goalie, GoalieSeasons, GoalieSeason
                                            WHERE GoalieSeason.SEASON = %s 
                                              AND GoalieSeason.GOALIESEASONID = GoalieSeasons.GOALIESEASONID 
                                              AND GoalieSeasons.GOALIEID = Goalie.GOALIEID
                                            ORDER BY GOALIESEASON.%s DESC; """ % ( season, stat ) )
                
            for i in range( num_players ): # get the first goalie and add them to the list
                goalie = goalies.fetchone()
                goalies.append( self.get_player( goalie[1] ) )
            cur.close()
            return players


    # This method eturns a list of teams representing the standings from the season given as input, sorted 
    # by the stat given as input in ascending order if 'multiplier' is positive, and descending order if 
    # 'multiplier' is negative. If 'view' is 'league' we get the league-wide standings. If 'view' is wildcard' 
    # we get the wildcard standings. If 'view' is division we get the divisional standings, and if 'view' is 
    # 'conference' we get the standings by conference.
    def get_standings( self, season, stat, view, multiplier ): 
        cur = self.conn.cursor()
        teams = []

        # consider if we are getting the stats in ascending or descending order
        if multiplier > 0:
            seasons = cur.execute( """ SELECT * FROM Standings, StandingsTeam, Team
                                        WHERE Standings.SEASON = %s 
                                          AND Standings.STANDINGSID = StandingsTeam.STANDINGSID 
                                          AND StandingsTeam.TEAMID = Team.TEAMID
                                        ORDER BY Team.%s ASC; """ % ( season, stat ) ).fetchall()
        else:
            seasons = cur.execute( """ SELECT * FROM Standings, StandingsTeam, Team
                                        WHERE Standings.SEASON = %s 
                                          AND Standings.STANDINGSID = StandingsTeam.STANDINGSID 
                                          AND StandingsTeam.TEAMID = Team.TEAMID
                                        ORDER BY Team.%s DESC; """ % ( season, stat ) ).fetchall()
        # add the teams to the list
        for i in range( seasons.count ):
            teams.append( NHL.Team( seasons[i][5], seasons[i][6], seasons[i][7], seasons[i][8],\
                                    seasons[i][9], seasons[i][10], seasons[i][11], seasons[i][12],\
                                    seasons[i][13], seasons[i][14], seasons[i][15], seasons[i][16],\
                                    seasons[i][17], seasons[i][18], seasons[i][19], seasons[i][20],\
                                    seasons[i][21], seasons[i][22], seasons[i][23] ) )
            
        # consider the view
        if view == 'league':
            pass # the list needs no more sorting
        elif view == 'division':
            self.sort_by_division( teams, season )
        elif view == 'conference':
            self.sort_by_conference( teams, season )
        else:
            self.sort_by_wildcard( teams, season )

        cur.close()
        return teams


    # This method returns a list of teams representing their playoffs stats from the season given as input, 
    # sorted by the stat given as input in ascending order if 'multiplier' is positive, and descending order
    # if 'multiplier' is negative. If 'view' is 'league' we get the league-wide standings. If 'view' is 
    # 'conference' we get the standings by conference.
    def get_playoffs( self, season, stat, view, multiplier ):
        cur = self.conn.cursor()
        teams = []

        # consider if we are getting the stats in ascending or descending order
        if multiplier > 0:
            seasons = cur.execute( """ SELECT * FROM Playoffs, PlayoffsTeam, Team
                                        WHERE Playoffs.SEASON = %s 
                                          AND Playoffs.PLAYOFFSID = PlayoffsTeam.PLAYOFFSID 
                                          AND PlayoffsTeam.TEAMID = Team.TEAMID
                                        ORDER BY Team.%s ASC; """ % ( season, stat ) ).fetchall()
        else:
            seasons = cur.execute( """ SELECT * FROM Playoffs, PlayoffsTeam, Team
                                        WHERE Playoffs.SEASON = %s 
                                          AND Playoffs.PLAYOFFSID = PlayoffsTeam.PLAYOFFSID 
                                          AND PlayoffsTeam.TEAMID = Team.TEAMID
                                        ORDER BY Team.%s DESC; """ % ( season, stat ) ).fetchall()
        # add the teams to the list
        for i in range( seasons.count ):
            teams.append( NHL.Team( seasons[i][5], seasons[i][6], seasons[i][7], seasons[i][8],\
                                    seasons[i][9], seasons[i][10], seasons[i][11], seasons[i][12],\
                                    seasons[i][13], seasons[i][14], seasons[i][15], seasons[i][16],\
                                    seasons[i][17], seasons[i][18], seasons[i][19], seasons[i][20],\
                                    seasons[i][21], seasons[i][22], seasons[i][23] ) )
            
        # consider the view
        if view == 'league':
            pass # the list needs no more sorting
        else:
            self.sort_by_conference( teams, season )

        cur.close()
        return teams


    # This method sorts a list of teams by division, based on the season, and while maintaining the 
    # relative ordering of teams within those divisions.
    def sort_by_division( self, teams, season ):
        # which teams go into which division depends on the season we are dealing with
        if season <= '2023-2024' and season >= '2021-2022': # Seattle and Arizona era
            atlantic = ['Boston Bruins', 'Buffalo Sabres', 'Detroit Red Wings', 'Florida Panthers', 
                        'Montreal Canadiens', 'Ottawa Senators', 'Tampa Bay Lightning', 
                        'Toronto Maple Leafs']
            metropolitan = ['Carolina Hurricanes', 'Columbus Blue Jackets', 'New Jersey Devils',
                            'New York Islanders', 'New York Rangers', 'Philadelphia Flyers',
                            'Pittsburgh Penguins', 'Washington Capitals']
            central = ['Arizona Coyotes', 'Chicago Blackhawks', 'Colorado Avalanche', 'Dallas Stars',
                       'Minnesota Wild', 'Nashville Predators', 'St. Louis Blues', 'Winnipeg Jets']
            pacific = ['Anaheim Ducks', 'Calgary Flames', 'Edmonton Oilers', 'Los Angeles Kings',
                       'San Jose Sharks', 'Seattle Kraken', 'Vancouver Canucks', 'Vegas Golden Knights']
            divisions = [atlantic, metropolitan, central, pacific]

        elif season == '2021': # Shortened, COVID year
            east = ['Boston Bruins', 'Buffalo Sabres', 'New Jersey Devils', 'New York Islanders', 
                    'New York Rangers', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'Washington Capitals']
            south = ['Carolina Hurricanes', 'Chicago Blackhawks', 'Columbus Blue Jackets', 'Dallas Stars',
                     'Detroit Red Wings' 'Florida Panthers', 'Nashville Predators', 'Tampa Bay Lightning']
            west = ['Anaheim Ducks', 'Arizona Coyotes', 'Colorado Avalanche', 'Los Angeles Kings',
                    'Minnesota Wild', 'San Jose Sharks', 'St. Louis Blues', 'Vegas Golden Knights']
            north = ['Calgary Flames', 'Edmonton Oilers', 'Montreal Canadiens', 'Ottawa Senators',
                     'Toronto Maple Leafs', 'Vancouver Canucks', 'Winnipeg Jets']
            divisions = [east, south, west, north]

        elif season <= '2019-2020' and season >= '2017-2018': # Vegas era
            atlantic = ['Boston Bruins', 'Buffalo Sabres', 'Detroit Red Wings', 'Florida Panthers', 
                        'Montreal Canadiens', 'Ottawa Senators', 'Tampa Bay Lightning', 
                        'Toronto Maple Leafs']
            metropolitan = ['Carolina Hurricanes', 'Columbus Blue Jackets', 'New Jersey Devils',
                            'New York Islanders', 'New York Rangers', 'Philadelphia Flyers',
                            'Pittsburgh Penguins', 'Washington Capitals']
            central = ['Chicago Blackhawks', 'Colorado Avalanche', 'Dallas Stars', 'Minnesota Wild', 
                       'Nashville Predators', 'St. Louis Blues', 'Winnipeg Jets']
            pacific = ['Anaheim Ducks', 'Arizona Coyotes', 'Calgary Flames', 'Edmonton Oilers', 
                       'Los Angeles Kings','San Jose Sharks', 'Vancouver Canucks', 'Vegas Golden Knights']
            divisions = [atlantic, metropolitan, central, pacific]

        # For each team in the given list we check which division they belong to and add them to a
        # separate list which will contain all of the teams from that division.

        # make a list of lists for separating the teams by division
        sorting_divisions = []
        for i in range( divisions.count ):
            sorting_divisions.append( [] )

        # compare each team in the list to each team in each division in the given season
        i = 0
        found = 0
        while i < teams.count and found == 0:
            j = 0
            while j < divisions.count and found == 0:
                curr_division = divisions[j]
                k = 0
                while k < curr_division.count and found == 0:
                    if teams[i] == curr_division[k]: 
                        # we found a match (the current team belongs in the division)
                        sorting_divisions[j].append( teams[i] )
                        found = 1

        # Create a new list by adding the teams by division in the order which the divisions appear in 
        # the list of division, and then by the order in which the teams appear in those sub-lists.
        new_list = []
        for i in range( sorting_divisions.count ):
            curr_division = sorting_divisions[i]
            for j in range( sorting_divisions[i].count ):
                new_list.append( curr_division[j] )


    # This method sorts a list of teams by conference, based on the season, and while maintaining the 
    # relative ordering of teams within those divisions.
    def sort_by_conference( self, teams, season ):
        # which teams go into which conference depends on the season we are dealing with
        if season <= '2023-2024' and season >= '2021-2022': # Seattle and Arizona era
            eastern = ['Boston Bruins', 'Buffalo Sabres', 'Carolina Hurricanes', 'Columbus Blue Jackets', 
                       'Detroit Red Wings', 'Florida Panthers', 'Montreal Canadiens', 'New Jersey Devils',
                       'New York Islanders', 'New York Rangers', 'Ottawa Senators', 'Philadelphia Flyers',
                       'Pittsburgh Penguins', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 
                        'Washington Capitals']
            western = ['Anaheim Ducks', 'Arizona Coyotes', 'Calgary Flames', 'Chicago Blackhawks', 
                       'Colorado Avalanche', 'Dallas Stars', 'Edmonton Oilers', 'Los Angeles Kings',
                       'Minnesota Wild', 'Nashville Predators', 'San Jose Sharks', 'Seattle Kraken'
                       'St. Louis Blues', 'Vancouver Canucks', 'Vegas Golden Knights''Winnipeg Jets', ]
            conferences = [eastern, western]

        elif season <= '2019-2020' and season >= '2017-2018': # Vegas era
            eastern = ['Boston Bruins', 'Buffalo Sabres', 'Carolina Hurricanes', 'Columbus Blue Jackets', 
                       'Detroit Red Wings', 'Florida Panthers', 'Montreal Canadiens', 'New Jersey Devils',
                       'New York Islanders', 'New York Rangers', 'Ottawa Senators', 'Philadelphia Flyers',
                       'Pittsburgh Penguins', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 
                        'Washington Capitals']
            western = ['Anaheim Ducks', 'Arizona Coyotes', 'Calgary Flames', 'Chicago Blackhawks', 
                       'Colorado Avalanche', 'Dallas Stars', 'Edmonton Oilers', 'Los Angeles Kings',
                       'Minnesota Wild', 'Nashville Predators', 'San Jose Sharks', 'St. Louis Blues', 
                       'Vancouver Canucks', 'Vegas Golden Knights', 'Winnipeg Jets',]
            conferences = [eastern, western]

        # For each team in the given list we check which conference they belong to and add them to a
        # separate list which will contain all of the teams from that conference.

        # make a list of lists for separating the teams by conference
        sorting_conferences = []
        for i in range( conferences.count ):
            sorting_conferences.append( [] )

        # compare each team in the list to each team in each conference in the given season
        i = 0
        found = 0
        while i < teams.count and found == 0:
            j = 0
            while j < conferences.count and found == 0:
                curr_conference = conferences[j]
                k = 0
                while k < curr_conference.count and found == 0:
                    if teams[i] == curr_conference[k]: 
                        # we found a match (the current team belongs in the division)
                        sorting_conferences[j].append( teams[i] )
                        found = 1

        # Create a new list by adding the teams by conference in the order which the conference appear 
        # in the list of conference, and then by the order in which the teams appear in those sub-lists.
        new_list = []
        for i in range( sorting_conferences.count ):
            curr_conference = sorting_conferences[i]
            for j in range( sorting_conferences[i].count ):
                new_list.append( curr_conference[j] )


    # This method sorts a list of teams according to the wildcard race, based on the season, and while 
    # maintaining the relative ordering of teams within those divisions.
    def sort_by_wildcard( self, teams, season ):
        # start by sorting the teams by division
        self.sort_by_division( teams, season )
        new_list = []

        # We can now organize the list to present the wildcard race since we know which teams placing in
        # which position in which season is given by the season and the pre-determined which the divisions
        # appear: atlantic, metro, central, pacific.
        if season <= '2023-2024' and season >= '2021-2022': # 32-team era
            # The first, second, and third place atlantic teams will be the first three in the list. The 
            # top three metro teams will be in spots 8, 9, 10 and will be put afterwards.
            for i in range( 3 ):
                new_list.append( teams[i] )

            for i in range( 8, 11 ):
                new_list.append( teams[i] )

            # We have to add the teams in positions 3 to 7 and the teams in position 11 to 15 to the new
            # list in order of points.
            atlantic_index = 3
            metropolitan_index = 11
            for i in range( 10 ): # there are 10 teams remaining in the conference
                if atlantic_index > 7: # if we have no more atlantic teams to compare, break
                    break
                if metropolitan_index > 15: # if we have no more metro teams to compare, break
                    break

                if teams[atlantic_index].points >= teams[metropolitan_index].points:
                    new_list.append( teams[atlantic_index] )
                else:
                    new_list.append( teams[metropolitan_index] )

            # if we've cycled through all of the metro teams but we have more atlantic teams, add them
            for i in range( atlantic_index, 8 ):
                new_list.append( teams[atlantic_index] )
            # if we've cycled through all of the atlantic teams but we have more metro teams, add them
            for i in range( metropolitan_index, 15 ):
                new_list.append( teams[metropolitan_index] )

            # The first, second, and third place central teams are in positions 16, 17, and 18. The top 
            # three pacific teams will be in spots 24, 25, 26 and will be put afterwards.
            for i in range( 16, 19 ):
                new_list.append( teams[i] )

            for i in range( 24, 27 ):
                new_list.append( teams[i] )

            # We have to add the teams in positions 19 to 23 and the teams in position 27 to 31 to the 
            # new list in order of points.
            central_index = 19
            pacific_index = 27
            for i in range( 10 ):  # there are 10 teams remaining in the conference
                if central_index > 23: # if we have no more central teams to compare, break
                    break
                if pacific_index > 31: # if we have no more pacific teams to compare, break
                    break

                if teams[central_index].points >= teams[pacific_index].points:
                    new_list.append( teams[central_index] )
                else:
                    new_list.append( teams[pacific_index] )

            # if we've cycled through all of the pacific teams but we have more central teams, add them
            for i in range( central_index, 24 ):
                new_list.append( teams[central_index] )
            # if we've cycled through all of the atlantic teams but we have more metro teams, add them
            for i in range( pacific_index, 31 ):
                new_list.append( teams[pacific_index] )


        elif season <= '2019-2020' and season >= '2017-2018': # 31-team era
            # The first, second, and third place atlantic teams will be the first three in the list. The 
            # top three metro teams will be in spots 8, 9, 10 and will be put afterwards.
            for i in range( 3 ):
                new_list.append( teams[i] )

            for i in range( 8, 11 ):
                new_list.append( teams[i] )

            # We have to add the teams in positions 3 to 7 and the teams in position 11 to 15 to the new
            # list in order of points.
            atlantic_index = 3
            metropolitan_index = 11
            for i in range( 10 ): # there are 10 teams remaining in the conference
                if atlantic_index > 7: # if we have no more atlantic teams to compare, break
                    break
                if metropolitan_index > 15: # if we have no more metro teams to compare, break
                    break

                if teams[atlantic_index].points >= teams[metropolitan_index].points:
                    new_list.append( teams[atlantic_index] )
                else:
                    new_list.append( teams[metropolitan_index] )

            # if we've cycled through all of the metro teams but we have more atlantic teams, add them
            for i in range( atlantic_index, 8 ):
                new_list.append( teams[atlantic_index] )
            # if we've cycled through all of the atlantic teams but we have more metro teams, add them
            for i in range( metropolitan_index, 15 ):
                new_list.append( teams[metropolitan_index] )

            # The first, second, and third place central teams are in positions 16, 17, and 18. The top 
            # three pacific teams will be in spots 23, 24, 25 and will be put afterwards.
            for i in range( 16, 19 ):
                new_list.append( teams[i] )

            for i in range( 23, 26 ):
                new_list.append( teams[i] )

            # We have to add the teams in positions 19 to 23 and the teams in position 27 to 31 to the 
            # new list in order of points.
            central_index = 19
            pacific_index = 26
            for i in range( 10 ):  # there are 10 teams remaining in the conference
                if central_index > 23: # if we have no more central teams to compare, break
                    break
                if pacific_index > 30: # if we have no more pacific teams to compare, break
                    break

                if teams[central_index].points >= teams[pacific_index].points:
                    new_list.append( teams[central_index] )
                else:
                    new_list.append( teams[pacific_index] )

            # if we've cycled through all of the pacific teams but we have more central teams, add them
            for i in range( central_index, 24 ):
                new_list.append( teams[central_index] )
            # if we've cycled through all of the atlantic teams but we have more metro teams, add them
            for i in range( pacific_index, 30 ):
                new_list.append( teams[pacific_index] )

        teams = new_list


    # this method calls commit and close on the connection
    def close( self ):
        self.conn.commit()
        self.conn.close()
    

    # this method resets the database (deletes 'phylib.db')
    def reset( self ):
        if os.path.exists( 'stats.db' ):
            os.remove( 'stats.db' )

        self.conn = sqlite3.connect( 'stats.db' )
        self.createDB()

################################################################################