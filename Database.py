import os
import sqlite3

import NHL


################################################################################

class Database():

    def __init__( self, reset = False ):
        if reset == True and os.path.exists( 'stats.db' ):
            os.remove( 'stats.db' )

        self.conn = sqlite3.connect( 'stats.db' )
        self.nhl_util = NHL.NHLUtil()


    # creates all of the tables for the database
    def createDB( self ):
        cur = self.conn.cursor()

        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Skater'; """ ).fetchall()
        if table == []:
            cur.execute( """ CREATE TABLE Skater
                              ( SKATERID        INTEGER     PRIMARY KEY     NOT NULL,
                                NAME            VARCHAR(64) NOT NULL,
                                TEAM            VARCHAR(64),
                                NUMBER          INTEGER,
                                POSITION        VARCHAR(64) NOT NULL,
                                HEIGHT          VARCHAR(64) NOT NULL,
                                WEIGHT          VARCHAR(64) NOT NULL,
                                BIRTHDAY        VARCHAR(64) NOT NULL,
                                HANDEDNESS      VARCHAR(64) NOT NULL,
                                DRAFT_POSITION  VARCHAR(64) NOT NULL); """ )


        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'SkaterSeason'; """ ).fetchall()
        if table == []:
            cur.execute( """ CREATE TABLE SkaterSeason
                              ( SKATERSEASONID          INTEGER     PRIMARY KEY NOT NULL,
                                SKATERID                INTEGER     NOT NULL,
                                TYPE                    VARCHAR(64) NOT NULL,
                                SEASON                  VARCHAR(64) NOT NULL,
                                TEAM                    VARCHAR(64) NOT NULL,
                                GAMES_PLAYED            INTEGER     NOT NULL,
                                GOALS                   INTEGER     NOT NULL,
                                ASSISTS                 INTEGER     NOT NULL,
                                POINTS                  INTEGER     NOT NULL,
                                PLUS_MINUS              INTEGER     NOT NULL,
                                PENALTY_MINUTES         INTEGER     NOT NULL,
                                POWERPLAY_GOALS         INTEGER     NOT NULL,
                                POWERPLAY_POINTS        INTEGER     NOT NULL,
                                SHORTHANDED_GOALS       INTEGER     NOT NULL,
                                SHORTHANDED_POINTS      INTEGER     NOT NULL,
                                TIME_ON_ICE_PER_GAME    VARCHAR(64) NOT NULL,
                                GAME_WINNING_GOALS      INTEGER     NOT NULL,
                                OVERTIME_GOALS          INTEGER     NOT NULL,
                                SHOTS                   INTEGER     NOT NULL,
                                SHOOTING_PERCENTAGE     FLOAT       NOT NULL,
                                FACEOFF_PERCENTAGE      FLOAT       NOT NULL,
                                FOREIGN KEY (SKATERID)          REFERENCES Skater ); """ )


        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Goalie'; """ ).fetchall()
        if table == []:
            cur.execute( """CREATE TABLE Goalie
                              ( GOALIEID        INTEGER     PRIMARY KEY   NOT NULL,
                                NAME            VARCHAR(64) NOT NULL,
                                TEAM            VARCHAR(64),
                                NUMBER          INTEGER,
                                HEIGHT          VARCHAR(64) NOT NULL,
                                WEIGHT          VARCHAR(64) NOT NULL,
                                BIRTHDAY        VARCHAR(64) NOT NULL,
                                HANDEDNESS      VARCHAR(64) NOT NULL,
                                DRAFT_POSITION  VARCHAR(64) NOT NULL); """ )
            

        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'GoalieSeason'; """ ).fetchall() 
        if table == []:     
            cur.execute( """ CREATE TABLE GoalieSeason
                              ( GOALIESEASONID          INTEGER     PRIMARY KEY   NOT NULL,
                                GOALIEID                INTEGER     NOT NULL,
                                TYPE                    VARCHAR(64) NOT NULL,
                                SEASON                  VARCHAR(64) NOT NULL,
                                TEAM                    VARCHAR(64) NOT NULL,
                                GAMES_PLAYED            INTEGER     NOT NULL,
                                GAMES_STARTED           INTEGER     NOT NULL,
                                WINS                    INTEGER     NOT NULL,
                                LOSSES                  INTEGER     NOT NULL,
                                TIES                    INTEGER,
                                OVERTIME_LOSSES         INTEGER,
                                SHOTS_AGAINST           INTEGER     NOT NULL,
                                GOALS_AGAINST_AVERAGE   FLOAT       NOT NULL,
                                SAVE_PERCENTAGE         FLOAT       NOT NULL,
                                SHUTOUTS                INTEGER     NOT NULL,
                                GOALS                   INTEGER     NOT NULL,
                                ASSISTS                 INTEGER     NOT NULL,
                                PENALTY_MINUTES         INTEGER     NOT NULL,
                                TIME_ON_ICE             VARCHAR(64) NOT NULL ); """ )


        table = cur.execute( """ SELECT NAME FROM sqlite_master
                                    WHERE NAME = 'Team'; """ ).fetchall()
        if table == []:
            cur.execute( """ CREATE TABLE Team
                              ( TEAMID                          INTEGER     PRIMARY KEY     NOT NULL,
                                TYPE                            VARCHAR(64) NOT NULL,
                                SEASON                          VARCHAR(64) NOT NULL,
                                CITY                            VARCHAR(64) NOT NULL,
                                NAME                            VARCHAR(64) NOT NULL,
                                GAMES_PLAYED                    INTEGER     NOT NULL,
                                WINS                            INTEGER     NOT NULL,
                                LOSSES                          INTEGER     NOT NULL,
                                TIES                            INTEGER,
                                OVERTIME_LOSSES                 INTEGER,
                                POINTS                          INTEGER     NOT NULL,
                                POINTS_PERCENTAGE               FLOAT       NOT NULL,
                                REGULATION_WINS                 INTEGER     NOT NULL,
                                REGULATION_AND_OVERTIME_WINS    INTEGER     NOT NULL,
                                GOALS_FOR                       INTEGER     NOT NULL,
                                GOALS_AGAINST                   INTEGER     NOT NULL,
                                GOAL_DIFFERENTIAL               INTEGER     NOT NULL,
                                HOME                            VARCHAR(64),
                                AWAY                            VARCHAR(64),
                                SHOOTOUT                        VARCHAR(64),
                                LAST_10                         VARCHAR(64),
                                STREAK                          VARCHAR(64),
                                SHOOTOUT_WINS                   INTEGER,
                                GOALS_FOR_PER_GAME              FLOAT       NOT NULL,
                                GOALS_AGAINST_PER_GAME          FLOAT       NOT NULL,
                                POWERPLAY_PERCENTAGE            FLOAT,
                                PENALTY_KILL_PERCENTAGE         FLOAT,
                                NET_POWERPLAY_PERCENTAGE        FLOAT,
                                NET_PENALTY_KILL_PERCENTAGE     FLOAT,
                                FACEOFF_WIN_PERCENTAGE          FLOAT ); """ )

        cur.close()
        self.conn.commit()


    # This method adds a skater to the database by first adding their personal details to the Skater table, 
    # then adding their regular season and playoff stats to the  table.
    def add_skater( self, skater ):
        cur = self.conn.cursor()

        # remove any previous stats from the skater
        data = cur.execute( """ SELECT SKATERID FROM Skater
                                    WHERE NAME = '%s' AND BIRTHDAY = '%s'; """ % 
                                    ( skater.name, skater.birthday ) )
        if data != None:
            rows = data.fetchall()
            for i in range( len( rows ) ):
                skater_id = rows[i][0]
                cur.execute( """ DELETE FROM SkaterSeason WHERE SKATERID = %d; """ % skater_id )
        

        cur.execute( """ DELETE FROM Skater WHERE NAME = '%s' AND BIRTHDAY = '%s'; """ % 
                    ( skater.name, skater.birthday ) )
        
        # put the details into the Skater table
        cur.execute( """ INSERT
                                INTO Skater ( NAME, TEAM, NUMBER, POSITION, HEIGHT, WEIGHT, BIRTHDAY, 
                                              HANDEDNESS, DRAFT_POSITION )
                                     VALUES ( '%s', '%s', %d, '%s', '%s', '%s', '%s', '%s', '%s' ); """ % 
                                            ( skater.name, skater.team, skater.number, skater.position,
                                              skater.height.replace("'", "''"), skater.weight, skater.birthday, 
                                              skater.handedness, skater.draft_position ) )
        skater_id = cur.lastrowid

        # Put the regular season stats in the  table and connect each entry to the skater 
        # via the s table.
        for i in range( len( skater.seasons ) ):
            if self.nhl_util.is_faceoff_percentage_season( skater.seasons[i].season )\
                and self.nhl_util.is_time_on_ice_per_game_season( skater.seasons[i].season ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, %d, %d, 
                                                        %d, %d, %d, %d, '%s', %d, %d, %d, %f, %f ); """ %
                                                      ( skater_id, 'Regular Season', skater.seasons[i].season, 
                                                        skater.seasons[i].team, skater.seasons[i].games_played, 
                                                        skater.seasons[i].goals, skater.seasons[i].assists, 
                                                        skater.seasons[i].points, skater.seasons[i].plus_minus, 
                                                        skater.seasons[i].penalty_minutes, skater.seasons[i].powerplay_goals, 
                                                        skater.seasons[i].powerplay_points, skater.seasons[i].shorthanded_goals, 
                                                        skater.seasons[i].shorthanded_points, skater.seasons[i].time_on_ice_per_game, 
                                                        skater.seasons[i].game_winning_goals, skater.seasons[i].overtime_goals, 
                                                        skater.seasons[i].shots, skater.seasons[i].shooting_percentage, 
                                                        skater.seasons[i].faceoff_percentage ) )
            elif self.nhl_util.is_plus_minus_season( skater.seasons[i].season )\
                and self.nhl_util.is_shots_season( skater.seasons[i].season)\
                and self.nhl_util.is_shooting_percentage_season( skater.seasons[i].season ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, %d, %d, 
                                                        %d, %d, %d, %d, '%s', %d, %d, %d, %f, '%s' ); """ %
                                                      ( skater_id, 'Regular Season', skater.seasons[i].season, 
                                                        skater.seasons[i].team, skater.seasons[i].games_played, 
                                                        skater.seasons[i].goals, skater.seasons[i].assists, 
                                                        skater.seasons[i].points, skater.seasons[i].plus_minus, 
                                                        skater.seasons[i].penalty_minutes, skater.seasons[i].powerplay_goals, 
                                                        skater.seasons[i].powerplay_points, skater.seasons[i].shorthanded_goals, 
                                                        skater.seasons[i].shorthanded_points, skater.seasons[i].time_on_ice_per_game, 
                                                        skater.seasons[i].game_winning_goals, skater.seasons[i].overtime_goals, 
                                                        skater.seasons[i].shots, skater.seasons[i].shooting_percentage, 
                                                        skater.seasons[i].faceoff_percentage ) )
            elif self.nhl_util.is_skater_special_teams_stats_season( skater.seasons[i].season ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s',
                                                        %d, %d, %d, %d, %d, '%s', %d, %d, '%s', '%s',
                                                        '%s' ); """ %
                                                      ( skater_id, 'Regular Season', skater.seasons[i].season, 
                                                        skater.seasons[i].team, skater.seasons[i].games_played, 
                                                        skater.seasons[i].goals, skater.seasons[i].assists, 
                                                        skater.seasons[i].points, skater.seasons[i].plus_minus, 
                                                        skater.seasons[i].penalty_minutes, skater.seasons[i].powerplay_goals, 
                                                        skater.seasons[i].powerplay_points, skater.seasons[i].shorthanded_goals, 
                                                        skater.seasons[i].shorthanded_points, skater.seasons[i].time_on_ice_per_game, 
                                                        skater.seasons[i].game_winning_goals, skater.seasons[i].overtime_goals, 
                                                        skater.seasons[i].shots, skater.seasons[i].shooting_percentage, 
                                                        skater.seasons[i].faceoff_percentage ) )
            else:
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s',
                                                        %d, '%s', '%s', '%s', '%s', '%s', %d, %d,
                                                        '%s', '%s', '%s' ); """ %
                                                      ( skater_id, 'Regular Season', skater.seasons[i].season, 
                                                        skater.seasons[i].team, skater.seasons[i].games_played, 
                                                        skater.seasons[i].goals, skater.seasons[i].assists, 
                                                        skater.seasons[i].points, skater.seasons[i].plus_minus, 
                                                        skater.seasons[i].penalty_minutes, skater.seasons[i].powerplay_goals, 
                                                        skater.seasons[i].powerplay_points, skater.seasons[i].shorthanded_goals, 
                                                        skater.seasons[i].shorthanded_points, skater.seasons[i].time_on_ice_per_game, 
                                                        skater.seasons[i].game_winning_goals, skater.seasons[i].overtime_goals, 
                                                        skater.seasons[i].shots, skater.seasons[i].shooting_percentage, 
                                                        skater.seasons[i].faceoff_percentage ) )
            
        # do the same thing for the playoffs
        for i in range( len( skater.playoffs ) ):
            if self.nhl_util.is_faceoff_percentage_season( skater.playoffs[i].season )\
                and self.nhl_util.is_time_on_ice_per_game_season( skater.playoffs[i].season ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, %d,
                                                        %d, %d, %d, %d, %d, '%s', %d, %d, %d, %f,
                                                        %f ); """ %
                                                      ( skater_id, 'Playoffs', skater.playoffs[i].season,
                                                        skater.playoffs[i].team, skater.playoffs[i].games_played, 
                                                        skater.playoffs[i].goals, skater.playoffs[i].assists, 
                                                        skater.playoffs[i].points, skater.playoffs [i].plus_minus, 
                                                        skater.playoffs[i].penalty_minutes, skater.playoffs[i].powerplay_goals, 
                                                        skater.playoffs[i].powerplay_points, skater.playoffs[i].shorthanded_goals, 
                                                        skater.playoffs[i].shorthanded_points, skater.playoffs[i].time_on_ice_per_game, 
                                                        skater.playoffs[i].game_winning_goals, skater.playoffs[i].overtime_goals, 
                                                        skater.playoffs[i].shots, skater.playoffs[i].shooting_percentage, 
                                                        skater.playoffs[i].faceoff_percentage ) )
            elif self.nhl_util.is_plus_minus_season( skater.playoffs[i].season )\
                and self.nhl_util.is_shots_season( skater.playoffs[i].season)\
                and self.nhl_util.is_shooting_percentage_season( skater.playoffs[i].season ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, %d,
                                                        %d, %d, %d, %d, %d, '%s', %d, %d, %d, %f,
                                                        '%s' ); """ %
                                                      ( skater_id, 'Playoffs', skater.playoffs[i].season,
                                                        skater.playoffs[i].team, skater.playoffs[i].games_played, 
                                                        skater.playoffs[i].goals, skater.playoffs[i].assists, 
                                                        skater.playoffs[i].points, skater.playoffs [i].plus_minus, 
                                                        skater.playoffs[i].penalty_minutes, skater.playoffs[i].powerplay_goals, 
                                                        skater.playoffs[i].powerplay_points, skater.playoffs[i].shorthanded_goals, 
                                                        skater.playoffs[i].shorthanded_points, skater.playoffs[i].time_on_ice_per_game, 
                                                        skater.playoffs[i].game_winning_goals, skater.playoffs[i].overtime_goals, 
                                                        skater.playoffs[i].shots, skater.playoffs[i].shooting_percentage, 
                                                        skater.playoffs[i].faceoff_percentage ) )
            elif self.nhl_util.is_skater_special_teams_stats_season( skater.playoffs[i].season ):
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s', 
                                                        %d, %d, %d, %d, %d, '%s', %d, %d, '%s', '%s',
                                                        '%s' ); """ %
                                                      ( skater_id, 'Playoffs', skater.playoffs[i].season,
                                                        skater.playoffs[i].team, skater.playoffs[i].games_played, 
                                                        skater.playoffs[i].goals, skater.playoffs[i].assists, 
                                                        skater.playoffs[i].points, skater.playoffs [i].plus_minus, 
                                                        skater.playoffs[i].penalty_minutes, skater.playoffs[i].powerplay_goals, 
                                                        skater.playoffs[i].powerplay_points, skater.playoffs[i].shorthanded_goals, 
                                                        skater.playoffs[i].shorthanded_points, skater.playoffs[i].time_on_ice_per_game, 
                                                        skater.playoffs[i].game_winning_goals, skater.playoffs[i].overtime_goals, 
                                                        skater.playoffs[i].shots, skater.playoffs[i].shooting_percentage, 
                                                        skater.playoffs[i].faceoff_percentage ) )
            else:
                cur.execute( """ INSERT 
                                    INTO SkaterSeason ( SKATERID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, 
                                                        POWERPLAY_GOALS, POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                                        SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, 
                                                        SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s', 
                                                        %d, '%s', '%s', '%s', '%s', '%s', %d, %d,
                                                        '%s', '%s', '%s' ); """ %
                                                      ( skater_id, 'Playoffs', skater.playoffs[i].season,
                                                        skater.playoffs[i].team, skater.playoffs[i].games_played, 
                                                        skater.playoffs[i].goals, skater.playoffs[i].assists, 
                                                        skater.playoffs[i].points, skater.playoffs [i].plus_minus, 
                                                        skater.playoffs[i].penalty_minutes, skater.playoffs[i].powerplay_goals, 
                                                        skater.playoffs[i].powerplay_points, skater.playoffs[i].shorthanded_goals, 
                                                        skater.playoffs[i].shorthanded_points, skater.playoffs[i].time_on_ice_per_game, 
                                                        skater.playoffs[i].game_winning_goals, skater.playoffs[i].overtime_goals, 
                                                        skater.playoffs[i].shots, skater.playoffs[i].shooting_percentage, 
                                                        skater.playoffs[i].faceoff_percentage ) )
                
        cur.close()
        self.conn.commit()
                

    # This method adds a goalie to the database by first adding their personal details to the Goalie table, 
    # then adding their regular season and playoff stats to the GoalieSeason table.
    def add_goalie( self, goalie ):
        cur = self.conn.cursor()

        # remove any previous stats from the skater
        data = cur.execute( """ SELECT GOALIEID FROM Goalie
                                    WHERE NAME = '%s' AND BIRTHDAY = '%s'; """ % 
                                    ( goalie.name, goalie.birthday ) )
        
        if data != None:
            rows = data.fetchall()
            for i in range( len( rows ) ):
                goalie_id = rows[i][0]
                cur.execute( """ DELETE FROM GoalieSeason WHERE GOALIEID = %d; """ % goalie_id )
        

        cur.execute( """ DELETE FROM Goalie WHERE NAME = '%s' AND BIRTHDAY = '%s'; """ % 
                    ( goalie.name, goalie.birthday ) )
        
        # put the details into the Goalie table
        cur.execute( """ INSERT
                            INTO Goalie ( NAME, TEAM, NUMBER, HEIGHT, WEIGHT, BIRTHDAY, HANDEDNESS, 
                                          DRAFT_POSITION )
                                 VALUES ( '%s', '%s', %d, '%s', '%s', '%s', '%s', '%s' ); """ % 
                                        ( goalie.name, goalie.team, goalie.number, goalie.height.replace("'", "''"), 
                                          goalie.weight, goalie.birthday, goalie.handedness,
                                          goalie.draft_position ) )
        goalie_id = cur.lastrowid

        # Put the regular season stats in the GoalieSeason table and connect each entry to the goalie 
        # via the GoalieSeasons table.
        for i in range( len( goalie.seasons ) ):
            if goalie.seasons[i].save_percentage ==  None:
                goalie.seasons[i].save_percentage = 0

            if self.nhl_util.is_overtime_losses_season( 'Regular Season', goalie.seasons[i].season ):
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIEID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GAMES_STARTED, WINS, LOSSES, TIES, 
                                                        OVERTIME_LOSSES, SHOTS_AGAINST, 
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE, 
                                                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                        TIME_ON_ICE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s', 
                                                        %d, %d, %f, %f, %d, %d, %d, %d, '%s' ); """ %
                                                      ( goalie_id, 'Regular Season', goalie.seasons[i].season,
                                                        goalie.seasons[i].team, goalie.seasons[i].games_played,
                                                        goalie.seasons[i].games_started, goalie.seasons[i].wins,
                                                        goalie.seasons[i].losses, goalie.seasons[i].ties,
                                                        goalie.seasons[i].overtime_losses, goalie.seasons[i].shots_against,
                                                        goalie.seasons[i].goals_against_average, goalie.seasons[i].save_percentage,
                                                        goalie.seasons[i].shutouts, goalie.seasons[i].goals,
                                                        goalie.seasons[i].assists, goalie.seasons[i].penalty_minutes,
                                                        goalie.seasons[i].time_on_ice ) )
            elif self.nhl_util.is_shots_against_season( goalie.seasons[i].season )\
                and self.nhl_util.is_save_percentage_season( goalie.seasons[i].season):
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIEID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GAMES_STARTED, WINS, LOSSES, TIES, 
                                                        OVERTIME_LOSSES, SHOTS_AGAINST, 
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, 
                                                        TIME_ON_ICE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, %d, 
                                                        '%s', %d, %f, %f, %d, %d, %d, %d, '%s' ); """ %
                                                      ( goalie_id, 'Regular Season', goalie.seasons[i].season,
                                                        goalie.seasons[i].team, goalie.seasons[i].games_played,
                                                        goalie.seasons[i].games_started, goalie.seasons[i].wins,
                                                        goalie.seasons[i].losses, goalie.seasons[i].ties,
                                                        goalie.seasons[i].overtime_losses, goalie.seasons[i].shots_against,
                                                        goalie.seasons[i].goals_against_average, goalie.seasons[i].save_percentage,
                                                        goalie.seasons[i].shutouts, goalie.seasons[i].goals,
                                                        goalie.seasons[i].assists, goalie.seasons[i].penalty_minutes,
                                                        goalie.seasons[i].time_on_ice ) )
            else:
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIEID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GAMES_STARTED, WINS, LOSSES, TIES, 
                                                        OVERTIME_LOSSES, SHOTS_AGAINST, 
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, 
                                                        TIME_ON_ICE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, %d, 
                                                        '%s', '%s', %f, '%s', %d, %d, %d, %d, '%s' ); """ %
                                                      ( goalie_id, 'Regular Season', goalie.seasons[i].season,
                                                        goalie.seasons[i].team, goalie.seasons[i].games_played,
                                                        goalie.seasons[i].games_started, goalie.seasons[i].wins,
                                                        goalie.seasons[i].losses, goalie.seasons[i].ties,
                                                        goalie.seasons[i].overtime_losses, goalie.seasons[i].shots_against,
                                                        goalie.seasons[i].goals_against_average, goalie.seasons[i].save_percentage,
                                                        goalie.seasons[i].shutouts, goalie.seasons[i].goals,
                                                        goalie.seasons[i].assists, goalie.seasons[i].penalty_minutes,
                                                        goalie.seasons[i].time_on_ice ) )

        # do the same thing for the playoffs
        for i in range( len( goalie.playoffs ) ):
            if goalie.playoffs[i].save_percentage ==  None:
                goalie.playoffs[i].save_percentage = 0

            if self.nhl_util.is_overtime_losses_season( 'Playoffs', goalie.playoffs[i].season ):
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIEID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GAMES_STARTED, WINS, LOSSES, TIES, 
                                                        OVERTIME_LOSSES, SHOTS_AGAINST, 
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, 
                                                        TIME_ON_ICE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s',
                                                        %d, %d, %f, %f, %d, %d, %d, %d, '%s' ); """ %
                                                      ( goalie_id, 'Playoffs', goalie.playoffs[i].season,
                                                        goalie.playoffs[i].team, goalie.playoffs[i].games_played,
                                                        goalie.playoffs[i].games_started, goalie.playoffs[i].wins,
                                                        goalie.playoffs[i].losses, goalie.playoffs[i].ties,
                                                        goalie.playoffs[i].overtime_losses, goalie.playoffs[i].shots_against,
                                                        goalie.playoffs[i].goals_against_average, goalie.playoffs[i].save_percentage,
                                                        goalie.playoffs[i].shutouts, goalie.playoffs[i].goals,
                                                        goalie.playoffs[i].assists, goalie.playoffs[i].penalty_minutes,
                                                        goalie.playoffs[i].time_on_ice ) )

            elif self.nhl_util.is_shots_against_season( goalie.playoffs[i].season )\
                and self.nhl_util.is_save_percentage_season( goalie.playoffs[i].season ):
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIEID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GAMES_STARTED, WINS, LOSSES, TIES, 
                                                        OVERTIME_LOSSES, SHOTS_AGAINST, 
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, 
                                                        TIME_ON_ICE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s',
                                                        '%s', %d, %f, %f, %d, %d, %d, %d, '%s' ); """ %
                                                      ( goalie_id, 'Playoffs', goalie.playoffs[i].season,
                                                        goalie.playoffs[i].team, goalie.playoffs[i].games_played,
                                                        goalie.playoffs[i].games_started, goalie.playoffs[i].wins,
                                                        goalie.playoffs[i].losses, goalie.playoffs[i].ties,
                                                        goalie.playoffs[i].overtime_losses, goalie.playoffs[i].shots_against,
                                                        goalie.playoffs[i].goals_against_average, goalie.playoffs[i].save_percentage,
                                                        goalie.playoffs[i].shutouts, goalie.playoffs[i].goals,
                                                        goalie.playoffs[i].assists, goalie.playoffs[i].penalty_minutes,
                                                        goalie.playoffs[i].time_on_ice ) )
            else:
                cur.execute( """ INSERT 
                                    INTO GoalieSeason ( GOALIEID, TYPE, SEASON, TEAM, GAMES_PLAYED, 
                                                        GAMES_STARTED, WINS, LOSSES, TIES, 
                                                        OVERTIME_LOSSES, SHOTS_AGAINST, 
                                                        GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, 
                                                        TIME_ON_ICE )
                                               VALUES ( %d, '%s', '%s', '%s', %d, %d, %d, %d, '%s',
                                                        '%s', '%s', %f, '%s', %d, %d, %d, %d, '%s' ); """ %
                                                      ( goalie_id, 'Playoffs', goalie.playoffs[i].season,
                                                        goalie.playoffs[i].team, goalie.playoffs[i].games_played,
                                                        goalie.playoffs[i].games_started, goalie.playoffs[i].wins,
                                                        goalie.playoffs[i].losses, goalie.playoffs[i].ties,
                                                        goalie.playoffs[i].overtime_losses, goalie.playoffs[i].shots_against,
                                                        goalie.playoffs[i].goals_against_average, goalie.playoffs[i].save_percentage,
                                                        goalie.playoffs[i].shutouts, goalie.playoffs[i].goals,
                                                        goalie.playoffs[i].assists, goalie.playoffs[i].penalty_minutes,
                                                        goalie.playoffs[i].time_on_ice ) )
                
        cur.close()
        self.conn.commit()


    # This method adds a team stats in either the regular season or the playoffs for a certin season.
    def add_team( self, team ):
        cur = self.conn.cursor()

        cur.execute( """ DELETE FROM Team WHERE TYPE = '%s' AND SEASON = '%s' AND CITY = '%s' AND NAME = '%s'; """ % 
                    ( team.type, team.season, team.city, team.name ) )

        if team.type == 'Regular Season':
            if self.nhl_util.is_overtime_losses_season( team.type, team.season ):
                cur.execute( """ INSERT
                                    INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                FACEOFF_WIN_PERCENTAGE ) 
                                       VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, '%s', %d, %d, %f,
                                                %d, %d, %d, %d, %d, '%s', '%s', '%s', '%s', '%s', %d,
                                                %f, %f, %f, %f, %f, %f, %f ); """ %
                                              ( team.type, team.season, team.city, team.name, team.games_played, 
                                                team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
                
            elif self.nhl_util.is_overtime_losses_and_ties_season( team.season ):
                cur.execute( """ INSERT
                                    INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                FACEOFF_WIN_PERCENTAGE ) 
                                       VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, %d, %d, %d, %f, %d,
                                                %d, %d, %d, %d, '%s', '%s', '%s', '%s', '%s', '%s', %f,
                                                %f, %f, %f, %f, %f, %f ); """ %
                                              ( team.type, team.season, team.city, team.name, team.games_played, 
                                                team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
                
            else:
                if self.nhl_util.is_faceoff_win_percentage_season( team.season ):
                    cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, %d, '%s', %d,
                                                    %f, %d, %d, %d, %d, %d, '%s', '%s', '%s', '%s',
                                                    '%s', '%s', %f, %f, %f, %f,  %f, %f, %f ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
                    
                elif self.nhl_util.is_special_teams_season( team.season ):
                    cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, %d, '%s', %d,
                                                    %f, %d, %d, %d, %d, %d, '%s', '%s', '%s', '%s',
                                                    '%s', '%s', %f, %f, %f, %f, %f, %f, '%s' ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
                    
                else:
                    cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, %d, '%s', %d,
                                                    %f, %d, %d, %d, %d, %d, '%s', '%s', '%s', '%s',
                                                    '%s', '%s', %f, %f, '%s', '%s', '%s', '%s', '%s' ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
        
        else:
            if self.nhl_util.is_faceoff_win_percentage_season( team.season )and team.overtime_losses == 'null':
                cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, '%s', '%s', 
                                                    %d, %f, %d, %d, %d, %d, %d, '%s', '%s', '%s',
                                                    '%s', '%s', '%s', %f, %f, %f, %f, %f, %f, %f ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
            
            elif self.nhl_util.is_faceoff_win_percentage_season( team.season ):
                cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, '%s', %d, %d,
                                                    %f, %d, %d, %d, %d, %d, '%s', '%s', '%s', '%s',
                                                    '%s', '%s', %f, %f, %f, %f, %f, %f, %f ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )

            elif self.nhl_util.is_special_teams_season( team.season ):
                cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, '%s', '%s',
                                                    %d, %f, %d, %d, %d, %d, %d, '%s', '%s', '%s',
                                                    '%s', '%s', '%s', %f, %f, %f, %f, %f, %f, %s ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )
                
            else:
                cur.execute( """ INSERT
                                        INTO Team ( TYPE, SEASON, CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                    OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                    REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                    GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                                    SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                    POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                    NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                    FACEOFF_WIN_PERCENTAGE ) 
                                           VALUES ( '%s', '%s', '%s', '%s', %d, %d, %d, '%s', '%s',
                                                    %d, %f, %d, %d, %d, %d, %d, '%s', '%s', '%s',
                                                    '%s', '%s', '%s', %f, %f, '%s', '%s', '%s',
                                                    '%s', '%s' ); """ %
                                                  ( team.type, team.season, team.city, team.name, team.games_played, 
                                                    team.wins, team.losses, team.ties, team.overtime_losses, team.points, 
                                                    team.points_percentage, team.regulation_wins, team.regulation_and_overtime_wins, 
                                                    team.goals_for, team.goals_against, team.goal_differential, team.home,
                                                    team.away, team.shootout, team.last_10, team.streak, team.shootout_wins,
                                                    team.goals_for_per_game, team.goals_against_per_game, team.powerplay_percentage,
                                                    team.penalty_kill_percentage, team.net_powerplay_percentage,
                                                    team.net_penalty_kill_percentage, team.faceoff_win_percentage ) )

                
            cur.close()
        self.conn.commit()


    # This method returns a list of SkaterSeason objects with all of the stats for all of the skaters
    # for the given season, team, if 'team' is defined and for all teams otherwise, and position, if
    # 'position' is defined and for all positions otherwise.
    def get_skater_stats_for_one_season( self, type, season, team, position ):
        cur = self.conn.cursor()

        if self.nhl_util.is_faceoff_percentage_season( season ) and self.nhl_util.is_time_on_ice_per_game_season( season ):
            if team != 'all':
                data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                               PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS, 
                                               POWERPLAY_POINTS, SHORTHANDED_GOALS, 
                                               SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME,
                                               GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS,
                                               SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE
                                               FROM SkaterSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, season, team ) )
            else:
                data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                               PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS, 
                                               POWERPLAY_POINTS, SHORTHANDED_GOALS,
                                               SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME,
                                               GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS,
                                               SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE
                                               FROM SkaterSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
        elif self.nhl_util.is_plus_minus_season( season ) and self.nhl_util.is_shots_season( season )\
                                                          and self.nhl_util.is_shooting_percentage_season( season ):
            if team != 'all':
                data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                               PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                               POWERPLAY_POINTS, SHORTHANDED_GOALS,
                                               SHORTHANDED_POINTS, GAME_WINNING_GOALS,
                                               OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE
                                               FROM SkaterSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, season, team ) )
            else:
                data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                               PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                               POWERPLAY_POINTS, SHORTHANDED_GOALS,
                                               SHORTHANDED_POINTS, GAME_WINNING_GOALS,
                                               OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE
                                               FROM SkaterSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
        else:
            if team != 'all':
                data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                               PENALTY_MINUTES, POWERPLAY_GOALS, POWERPLAY_POINTS, 
                                               SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                               GAME_WINNING_GOALS, OVERTIME_GOALS
                                               FROM SkaterSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, season, team ) )
            else:
                data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                               PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                               POWERPLAY_POINTS, SHORTHANDED_GOALS,
                                               SHORTHANDED_POINTS, GAME_WINNING_GOALS,
                                               OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE
                                               FROM SkaterSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )

        skater_data = data.fetchall()
        
        skater_stats = []
        for skater in skater_data:
            skater_id = skater[0]

            data = cur.execute( """ SELECT NAME, POSITION FROM Skater
                                    WHERE SKATERID = %d; """ % skater_id )
            
            data = data.fetchall()
            name = data[0][0]
            curr_position = data[0][1]

            if position == 'Forward' and (curr_position == 'LW' or curr_position == 'RW' or curr_position == 'C')\
                or position != None and curr_position == position or position == None:

                if self.nhl_util.is_faceoff_percentage_season( season ) and self.nhl_util.is_time_on_ice_per_game_season( season ):
                    skater_season = NHL.SkaterSeason( type=type, season=None, team=skater[1], 
                                                    games_played=skater[2], goals=skater[3], 
                                                    assists=skater[4], points=skater[5], 
                                                    plus_minus=skater[6], penalty_minutes=skater[7], 
                                                    powerplay_goals=skater[8], powerplay_points=skater[9], 
                                                    shorthanded_goals=skater[10], shorthanded_points=skater[11], 
                                                    time_on_ice_per_game=skater[12], game_winning_goals=skater[13], 
                                                    overtime_goals=skater[14], shots=skater[15], 
                                                    shooting_percentage=skater[16], faceoff_percentage=skater[17], 
                                                    name=name )
                elif self.nhl_util.is_plus_minus_season( season ) and self.nhl_util.is_shots_season( season )\
                                                                and self.nhl_util.is_shooting_percentage_season( season ):
                    skater_season = NHL.SkaterSeason( type=type, season=None, team=skater[1], 
                                                    games_played=skater[2], goals=skater[3], 
                                                    assists=skater[4], points=skater[5], 
                                                    plus_minus=skater[6], penalty_minutes=skater[7], 
                                                    powerplay_goals=skater[8], powerplay_points=skater[9], 
                                                    shorthanded_goals=skater[10], shorthanded_points=skater[11], 
                                                    time_on_ice_per_game=None, game_winning_goals=skater[12], 
                                                    overtime_goals=skater[13], shots=skater[14], 
                                                    shooting_percentage=skater[15], faceoff_percentage=None, 
                                                    name=name )
                else:
                    skater_season = NHL.SkaterSeason( type=type, season=None, team=skater[1], 
                                                    games_played=skater[2], goals=skater[3], 
                                                    assists=skater[4], points=skater[5], 
                                                    plus_minus=None, penalty_minutes=skater[6], 
                                                    powerplay_goals=skater[7], powerplay_points=skater[8], 
                                                    shorthanded_goals=skater[9], shorthanded_points=skater[10], 
                                                    time_on_ice_per_game=None, game_winning_goals=skater[11], 
                                                    overtime_goals=skater[12], shots=None, 
                                                    shooting_percentage=None, faceoff_percentage=None, 
                                                    name=name )
                skater_stats.append( skater_season )

        return skater_stats
    

    # This method returns a list of Player objects with all of the stats of the players with the given 
    # name.
    def get_skater_stats_for_one_player( self, name ): 
        cur = self.conn.cursor()

        cur.execute( """ UPDATE SkaterSeason SET TEAM = 'Montreal Maroons' WHERE SKATERSEASONID = 38237;""" )
        cur.execute( """ UPDATE SkaterSeason SET TEAM = 'Montreal Maroons' WHERE SKATERSEASONID = 38238;""" )
        cur.execute( """ UPDATE SkaterSeason SET TEAM = 'Montreal Maroons' WHERE SKATERSEASONID = 38239;""" )
        self.conn.commit()

        data = cur.execute( """ SELECT SKATERID, TEAM, NUMBER, POSITION, HEIGHT, WEIGHT, BIRTHDAY,
                                       HANDEDNESS, DRAFT_POSITION
                                       FROM Skater
                                       WHERE NAME = '%s'; """ % name )

        skater_data = data.fetchall()
        
        skaters = []
        for skater in skater_data:
            skater_id = skater[0]
            curr_skater = NHL.Skater( name=name, team=skater[1], number=skater[2], position=skater[3], 
                                      height=skater[4], weight=skater[5], birthday=skater[6], 
                                      handedness=skater[7], draft_position=skater[8] )

            skater_id = skater[0]

            data = cur.execute( """ SELECT TYPE, SEASON, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS,
                                           PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS, POWERPLAY_POINTS, 
                                           SHORTHANDED_GOALS, SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, 
                                           GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE, 
                                           FACEOFF_PERCENTAGE
                                           FROM SkaterSeason
                                           WHERE SKATERID = %d; """ % skater_id )
            season_data = data.fetchall()
            for season in season_data:
                if season[0] == 'Regular Season':
                    curr_skater.add_season( season=season[1], team=season[2], games_played=season[3],
                                            goals=season[4], assists=season[5], points=season[6], 
                                            plus_minus=season[7], penalty_minutes=season[8],
                                            powerplay_goals=season[9], powerplay_points=season[10],
                                            shorthanded_goals=season[11], shorthanded_points=season[12],
                                            time_on_ice_per_game=season[13], game_winning_goals=season[14],
                                            overtime_goals=season[15], shots=season[16], shooting_percentage=season[17],
                                            faceoff_percentage=season[18] )
                else:
                    curr_skater.add_playoffs( season=season[1], team=season[2], games_played=season[3],
                                              goals=season[4], assists=season[5], points=season[6], 
                                              plus_minus=season[7], penalty_minutes=season[8],
                                              powerplay_goals=season[9], powerplay_points=season[10],
                                              shorthanded_goals=season[11], shorthanded_points=season[12],
                                              time_on_ice_per_game=season[13], game_winning_goals=season[14],
                                              overtime_goals=season[15], shots=season[16], 
                                              shooting_percentage=season[17], faceoff_percentage=season[18] )

            skaters.append( curr_skater )
            
        return skaters
    

    # This method returns a list of SkaterSeason objects with all of the stats for all of the skaters
    # from the given first season up until the last season, team if 'team' is defined and for all
    # teams otherwise, and position, if 'position' is defined, and for all positions otherwise.
    def get_skater_stats( self, type, first_season, last_season, team, position ):
        cur = self.conn.cursor()

        always_include_faceoff_percentage = self.nhl_util.is_faceoff_percentage_season( last_season )
        always_include_time_on_ice_per_game = self.nhl_util.is_time_on_ice_per_game_season( last_season )
        always_include_plus_minus = self.nhl_util.is_plus_minus_season( last_season )
        always_include_shots = self.nhl_util.is_shots_season( last_season )
        always_include_shooting_percentage = self.nhl_util.is_shooting_percentage_season( last_season )

        first_season_first_year = self.nhl_util.get_first_year( first_season )
        last_season_first_year = self.nhl_util.get_first_year( last_season )

        skater_stats = []
        for i in range( first_season_first_year, last_season_first_year + 1 ):
            curr_season = str( i ) + '-' + str( i + 1 )

            if self.nhl_util.is_faceoff_percentage_season( curr_season ) and self.nhl_util.is_time_on_ice_per_game_season( curr_season ):
                if team != 'all':
                    data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS,
                                                   POINTS, PLUS_MINUS, PENALTY_MINUTES,
                                                   POWERPLAY_GOALS, POWERPLAY_POINTS,
                                                   SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                                   TIME_ON_ICE_PER_GAME, GAME_WINNING_GOALS,
                                                   OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE,
                                                   FACEOFF_PERCENTAGE
                                                   FROM SkaterSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
                else:
                    data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS,
                                                   POINTS, PLUS_MINUS, PENALTY_MINUTES,
                                                   POWERPLAY_GOALS, POWERPLAY_POINTS,
                                                   SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                                   TIME_ON_ICE_PER_GAME, GAME_WINNING_GOALS,
                                                   OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE,
                                                   FACEOFF_PERCENTAGE
                                                   FROM SkaterSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
            elif self.nhl_util.is_plus_minus_season( curr_season ) and self.nhl_util.is_shots_season( curr_season )\
                                                                   and self.nhl_util.is_shooting_percentage_season( curr_season ):
                if team != 'all':
                    data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS,
                                                   POINTS, PLUS_MINUS, PENALTY_MINUTES,
                                                   POWERPLAY_GOALS, POWERPLAY_POINTS,
                                                   SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                                   GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS,
                                                   SHOOTING_PERCENTAGE
                                                   FROM SkaterSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
                else:
                    data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS,
                                                   POINTS, PLUS_MINUS, PENALTY_MINUTES,
                                                   POWERPLAY_GOALS, POWERPLAY_POINTS,
                                                   SHORTHANDED_GOALS, SHORTHANDED_POINTS,
                                                   GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS,
                                                   SHOOTING_PERCENTAGE
                                                   FROM SkaterSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
            else:
                if team != 'all':
                    data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS,
                                                   POINTS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                                   POWERPLAY_POINTS, SHORTHANDED_GOALS,
                                                   SHORTHANDED_POINTS, GAME_WINNING_GOALS,
                                                   OVERTIME_GOALS
                                                   FROM SkaterSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
                else:
                    data = cur.execute( """ SELECT SKATERID, TEAM, GAMES_PLAYED, GOALS, ASSISTS,
                                                   POINTS, PENALTY_MINUTES, POWERPLAY_GOALS,
                                                   POWERPLAY_POINTS, SHORTHANDED_GOALS,
                                                   SHORTHANDED_POINTS, GAME_WINNING_GOALS,
                                                   OVERTIME_GOALS
                                                   FROM SkaterSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )

            skater_data = data.fetchall()
            
            for skater in skater_data:
                skater_id = skater[0]

                data = cur.execute( """ SELECT NAME, POSITION FROM Skater
                                        WHERE SKATERID = %d; """ % skater_id )
                data = data.fetchall()
                name = data[0][0]
                curr_position = data[0][1]

                if position == 'Forward' and (curr_position == 'LW' or curr_position == 'RW' or curr_position == 'C')\
                    or position != None and curr_position == position or position == None:
                    if self.nhl_util.is_faceoff_percentage_season( curr_season ) and self.nhl_util.is_time_on_ice_per_game_season( curr_season ):
                        skater_season = NHL.SkaterSeason( type=type, season=curr_season, team=skater[1], 
                                                          games_played=skater[2], goals=skater[3], 
                                                          assists=skater[4], points=skater[5], 
                                                          plus_minus=skater[6], penalty_minutes=skater[7], 
                                                          powerplay_goals=skater[8], powerplay_points=skater[9], 
                                                          shorthanded_goals=skater[10], shorthanded_points=skater[11], 
                                                          time_on_ice_per_game=skater[12], game_winning_goals=skater[13], 
                                                          overtime_goals=skater[14], shots=skater[15], 
                                                          shooting_percentage=skater[16], faceoff_percentage=skater[17], 
                                                          name=name )
                    elif self.nhl_util.is_plus_minus_season( curr_season ) and self.nhl_util.is_shots_season( curr_season )\
                                                                        and self.nhl_util.is_shooting_percentage_season( curr_season ):
                        skater_season = NHL.SkaterSeason( type=type, season=curr_season, team=skater[1], 
                                                          games_played=skater[2], goals=skater[3], 
                                                          assists=skater[4], points=skater[5], plus_minus=skater[6],
                                                          penalty_minutes=skater[7], powerplay_goals=skater[8],
                                                          powerplay_points=skater[9], shorthanded_goals=skater[10],
                                                          shorthanded_points=skater[11], time_on_ice_per_game='--'
                                                          if always_include_time_on_ice_per_game else None,
                                                          game_winning_goals=skater[12], overtime_goals=skater[13],
                                                          shots=skater[14], shooting_percentage=skater[15], 
                                                          faceoff_percentage='--' if always_include_faceoff_percentage else None, 
                                                          name=name )
                    else:
                        skater_season = NHL.SkaterSeason( type=type, season=curr_season, team=skater[1], 
                                                          games_played=skater[2], goals=skater[3], 
                                                          assists=skater[4], points=skater[5], 
                                                          plus_minus='--' if always_include_plus_minus else None,
                                                          penalty_minutes=skater[6], powerplay_goals=skater[7],
                                                          powerplay_points=skater[8], shorthanded_goals=skater[9],
                                                          shorthanded_points=skater[10], time_on_ice_per_game='--'
                                                          if always_include_time_on_ice_per_game else None,
                                                          game_winning_goals=skater[11], overtime_goals=skater[12],
                                                          shots='--' if always_include_shots else None, 
                                                          shooting_percentage='--' if always_include_shooting_percentage else None, 
                                                          faceoff_percentage='--' if always_include_faceoff_percentage else None, 
                                                          name=name )

                    skater_stats.append( skater_season )
            
        return skater_stats
    

    # This method returns a list of GoalieSeason objects with all of the stats for all of the goalies
    # for the given season and team, if 'team' is defined and for all teams otherwise.
    def get_goalie_stats_for_one_season( self, type, season, team ):
        cur = self.conn.cursor()
        
        self.conn.commit()

        if type == 'Regular Season':
            if self.nhl_util.is_overtime_losses_season( type, season ):
                if team != 'all':
                    data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                   WINS, LOSSES, OVERTIME_LOSSES, SHOTS_AGAINST,
                                                   GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                   SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                   TIME_ON_ICE
                                                   FROM GoalieSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, season, team ) )
                else:
                    data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                   WINS, LOSSES, OVERTIME_LOSSES, SHOTS_AGAINST,
                                                   GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                   SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                   TIME_ON_ICE
                                                   FROM GoalieSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
            else:
                if team != 'all':
                    data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                   WINS, LOSSES, TIES, SHOTS_AGAINST,
                                                   GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                   SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                   TIME_ON_ICE
                                                   FROM GoalieSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, season, team ) )
                else:
                    data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                   WINS, LOSSES, TIES, SHOTS_AGAINST,
                                                   GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                   SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                   TIME_ON_ICE
                                                   FROM GoalieSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
        else:
            if team != 'all':
                data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED, WINS,
                                               LOSSES, SHOTS_AGAINST, GOALS_AGAINST_AVERAGE,
                                               SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS,
                                               PENALTY_MINUTES, TIME_ON_ICE
                                               FROM GoalieSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, season, team ) )
            else:
                data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED, WINS,
                                               LOSSES, SHOTS_AGAINST, GOALS_AGAINST_AVERAGE,
                                               SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS,
                                               PENALTY_MINUTES, TIME_ON_ICE
                                               FROM GoalieSeason
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )

        goalie_data = data.fetchall()
        
        goalies_stats = []
        for goalie in goalie_data:
            goalie_id = goalie[0]

            data = cur.execute( """ SELECT NAME FROM Goalie
                                    WHERE GOALIEID = %d; """ % goalie_id )
            
            data = data.fetchall()
            name = data[0][0]
        
            if type == 'Regular Season':
                if self.nhl_util.is_overtime_losses_season( type, season ):
                    goalie_season = NHL.GoalieSeason( type=type, season=None, team=goalie[1],
                                                      games_played=goalie[2], games_started=goalie[3],
                                                      wins=goalie[4], losses=goalie[5], ties=None,
                                                      overtime_losses=goalie[6], shots_against=goalie[7],
                                                      goals_against_average=goalie[8], save_percentage=goalie[9],
                                                      shutouts=goalie[10], goals=goalie[11],
                                                      assists=goalie[12], penalty_minutes=goalie[13],
                                                      time_on_ice=goalie[14], name=name )
                else:
                    goalie_season = NHL.GoalieSeason( type=type, season=None, team=goalie[1],
                                                      games_played=goalie[2], games_started=goalie[3],
                                                      wins=goalie[4], losses=goalie[5], 
                                                      ties=goalie[6], overtime_losses=None,
                                                      shots_against=goalie[7], goals_against_average=goalie[8],
                                                      save_percentage=goalie[9], shutouts=goalie[10],
                                                      goals=goalie[11], assists=goalie[12],
                                                      penalty_minutes=goalie[13], time_on_ice=goalie[14],
                                                      name=name )
            else:
                goalie_season = NHL.GoalieSeason( type=type, season=None, team=goalie[1],
                                                  games_played=goalie[2], games_started=goalie[3],
                                                  wins=goalie[4], losses=goalie[5], ties=None,
                                                  overtime_losses=None, shots_against=goalie[6],
                                                  goals_against_average=goalie[7], save_percentage=goalie[8],
                                                  shutouts=goalie[9], goals=goalie[10],
                                                  assists=goalie[11], penalty_minutes=goalie[12],
                                                  time_on_ice=goalie[13], name=name )
    
            goalies_stats.append( goalie_season )

        return goalies_stats
    

    # This method returns a list of Goalie objects with all of the stats of the goalies with the
    # given name.
    def get_goalie_stats_for_one_player( self, name ): 
        cur = self.conn.cursor()

        data = cur.execute( """ SELECT GOALIEID, TEAM, NUMBER, HEIGHT, WEIGHT, BIRTHDAY,
                                       HANDEDNESS, DRAFT_POSITION
                                       FROM Goalie
                                       WHERE NAME = '%s'; """ % name )

        goalie_data = data.fetchall()
        
        goalies = []
        for goalie in goalie_data:
            goalie_id = goalie[0]
            curr_goalie = NHL.Goalie( name=name, team=goalie[1], number=goalie[2], height=goalie[3],
                                      weight=goalie[4], birthday=goalie[5], handedness=goalie[6],
                                      draft_position=goalie[7] )

            goalie_id = goalie[0]

            data = cur.execute( """ SELECT TYPE, SEASON, TEAM, GAMES_PLAYED, GAMES_STARTED, WINS, 
                                    LOSSES, TIES, OVERTIME_LOSSES, SHOTS_AGAINST, GOALS_AGAINST_AVERAGE,
                                    SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                    TIME_ON_ICE
                                    FROM GoalieSeason 
                                    WHERE GOALIEID = %d; """ % goalie_id )
            season_data = data.fetchall()
            for season in season_data:
                if season[0] == 'Regular Season':
                    curr_goalie.add_season( season=season[1], team=season[2], games_played=season[3],
                                            games_started=season[4], wins=season[5], losses=season[6], 
                                            ties=season[7], overtime_losses=season[8],
                                            shots_against=season[9], goals_against_average=season[10],
                                            save_percentage=season[11], shutouts=season[12],
                                            goals=season[13], assists=season[14], 
                                            penalty_minutes=season[15], time_on_ice=season[16] )
                else:
                    curr_goalie.add_playoffs( season=season[1], team=season[2], games_played=season[3],
                                              games_started=season[4], wins=season[5], losses=season[6], 
                                              ties=season[7], overtime_losses=season[8], 
                                              shots_against=season[9], goals_against_average=season[10],
                                              save_percentage=season[11], shutouts=season[12],
                                              goals=season[13], assists=season[14],
                                              penalty_minutes=season[15], time_on_ice=season[16] )

            goalies.append( curr_goalie )
            
        return goalies
    

    # This method returns a list of GoalieSeason objects with all of the stats for all of the goalies
    # from the given first season up until the ast season and team, if 'team' is defined and for all
    # teams otherwise.
    def get_goalie_stats( self, type, first_season, last_season, team ):
        cur = self.conn.cursor()

        if type == 'Regular Season':
            always_include_overtime_losses = self.nhl_util.is_overtime_losses_season( type, last_season )
            always_include_ties = not self.nhl_util.is_overtime_losses_season( type, first_season )

        first_season_first_year = self.nhl_util.get_first_year( first_season )
        last_season_first_year = self.nhl_util.get_first_year( last_season )

        goalie_stats = []
        for i in range( first_season_first_year, last_season_first_year + 1 ):
            curr_season = str( i ) + '-' + str( i + 1 )

            if type == 'Regular Season':
                if self.nhl_util.is_overtime_losses_season( type, curr_season ):
                    if team != 'all':
                        data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                       WINS, LOSSES, OVERTIME_LOSSES,
                                                       SHOTS_AGAINST, GOALS_AGAINST_AVERAGE,
                                                       SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS,
                                                       PENALTY_MINUTES, TIME_ON_ICE
                                                       FROM GoalieSeason
                                                       WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
                    else:
                        data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                       WINS, LOSSES, OVERTIME_LOSSES,
                                                       SHOTS_AGAINST, GOALS_AGAINST_AVERAGE,
                                                       SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS,
                                                       PENALTY_MINUTES, TIME_ON_ICE
                                                       FROM GoalieSeason
                                                       WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
                else:
                    if team != 'all':
                        data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                       WINS, LOSSES, TIES, SHOTS_AGAINST,
                                                       GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                       SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                       TIME_ON_ICE
                                                       FROM GoalieSeason
                                                       WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
                    else:
                        data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                       WINS, LOSSES, TIES, SHOTS_AGAINST,
                                                       GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                       SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                       TIME_ON_ICE
                                                       FROM GoalieSeason
                                                       WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
            else:
                if team != 'all':
                    data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                   WINS, LOSSES, SHOTS_AGAINST, 
                                                   GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                   SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                   TIME_ON_ICE
                                                   FROM GoalieSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
                else:
                    data = cur.execute( """ SELECT GOALIEID, TEAM, GAMES_PLAYED, GAMES_STARTED,
                                                   WINS, LOSSES, SHOTS_AGAINST, 
                                                   GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                                                   SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES,
                                                   TIME_ON_ICE
                                                   FROM GoalieSeason
                                                   WHERE TYPE = '%s' AND SEASON = '%s' AND TEAM = '%s'; """ % ( type, curr_season, team ) )
        
            goalie_data = data.fetchall()
            
            for goalie in goalie_data:
                goalie_id = goalie[0]

                data = cur.execute( """ SELECT NAME FROM Goalie
                                        WHERE GOALIEID = %d; """ % goalie_id )
                data = data.fetchall()
                name = data[0][0]

                if type == 'Regular Season':
                    if self.nhl_util.is_overtime_losses_season( type, curr_season ):
                        goalie_season = NHL.GoalieSeason( type=type, season=curr_season, 
                                                          team=goalie[1], games_played=goalie[2], 
                                                          games_started=goalie[3], wins=goalie[4],
                                                          losses=goalie[5], overtime_losses=goalie[6],
                                                          ties='--' if always_include_ties else None,
                                                          shots_against=goalie[7], goals_against_average=goalie[8],
                                                          save_percentage=goalie[9], shutouts=goalie[10],
                                                          goals=goalie[11], assists=goalie[12],
                                                          penalty_minutes=goalie[13], time_on_ice=goalie[14],
                                                          name=name )
                    else:
                        goalie_season = NHL.GoalieSeason( type=type, season=curr_season, 
                                                          team=goalie[1], games_played=goalie[2], 
                                                          games_started=goalie[3], wins=goalie[4],
                                                          losses=goalie[5], overtime_losses='--'
                                                          if always_include_overtime_losses else None,
                                                          ties=goalie[6], shots_against=goalie[7],
                                                          goals_against_average=goalie[8], save_percentage=goalie[9],
                                                          shutouts=goalie[10], goals=goalie[11],
                                                          assists=goalie[12], penalty_minutes=goalie[13],
                                                          time_on_ice=goalie[14], name=name )
                else:
                    goalie_season = NHL.GoalieSeason( type=type, season=curr_season, team=goalie[1],
                                                      games_played=goalie[2], games_started=goalie[3],
                                                      wins=goalie[4], losses=goalie[5],
                                                      overtime_losses=None, ties=None,
                                                      shots_against=goalie[6], goals_against_average=goalie[7],
                                                      save_percentage=goalie[8], shutouts=goalie[9],
                                                      goals=goalie[10], assists=goalie[11],
                                                      penalty_minutes=goalie[12], time_on_ice=goalie[13],
                                                      name=name )

                goalie_stats.append( goalie_season )
            
        return goalie_stats

    
    # This method returns a list of 'Team' objects with the fields needed for the standings view from a 
    # given season.
    def get_standings_stats( self, season ):
        cur = self.conn.cursor()
        teams = []

        self.conn.commit()
        
        if self.nhl_util.is_overtime_losses_season( 'Regular Season', season ):
            data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, OVERTIME_LOSSES,
                                           POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                           REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                           GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK
                                           FROM Team
                                           WHERE TYPE = 'Regular Season' AND SEASON = '%s'; """ % season )
            
        elif self.nhl_util.is_overtime_losses_and_ties_season( season ):
            data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, OVERTIME_LOSSES, 
                                           POINTS, POINTS_PERCENTAGE, GOALS_FOR, GOALS_AGAINST, 
                                           GOAL_DIFFERENTIAL, HOME, AWAY, LAST_10, STREAK
                                           FROM Team
                                           WHERE TYPE = 'Regular Season' AND SEASON = '%s'; """ % season )
            
        else:
            data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, POINTS, 
                                           POINTS_PERCENTAGE, GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL,
                                           HOME, AWAY, LAST_10, STREAK
                                           FROM Team
                                           WHERE TYPE = 'Regular Season' AND SEASON = '%s'; """ % season )

        if data != None and data != []:
            rows = data.fetchall()

            if self.nhl_util.is_overtime_losses_season( 'Regular Season', season ):
                for i in range( len( rows ) ):
                    current_team = rows[i]

                    teams.append( NHL.Team( type=None, season=None, city=current_team[0], name=current_team[1],
                                            games_played=current_team[2], wins=current_team[3], 
                                            losses=current_team[4], ties=None, overtime_losses=current_team[5], 
                                            points=current_team[6], points_percentage=current_team[7], 
                                            regulation_wins=current_team[8], regulation_and_overtime_wins=current_team[9], 
                                            goals_for=current_team[10], goals_against=current_team[11], 
                                            goal_differential=current_team[12], home=current_team[13], 
                                            away=current_team[14], shootout=current_team[15], last_10=current_team[16], 
                                            streak=current_team[17], shootout_wins=None, goals_for_per_game=None, 
                                            goals_against_per_game=None, powerplay_percentage=None, 
                                            penalty_kill_percentage=None, net_powerplay_percentage=None,
                                            net_penalty_kill_percentage=None, faceoff_win_percentage=None ) )
                    
            elif self.nhl_util.is_overtime_losses_and_ties_season( season ):
                for i in range( len( rows ) ):  
                    current_team = rows[i]
                      
                    teams.append( NHL.Team( type=None, season=None, city=current_team[0], name=current_team[1],
                                            games_played=current_team[2], wins=current_team[3], 
                                            losses=current_team[4], ties=current_team[5], overtime_losses=current_team[6], 
                                            points=current_team[7], points_percentage=current_team[8], 
                                            regulation_wins=None, regulation_and_overtime_wins=None, 
                                            goals_for=current_team[9], goals_against=current_team[10], 
                                            goal_differential=current_team[11], home=current_team[12], 
                                            away=current_team[13], shootout=None, last_10=current_team[14], 
                                            streak=current_team[15], shootout_wins=None, goals_for_per_game=None, 
                                            goals_against_per_game=None, powerplay_percentage=None, 
                                            penalty_kill_percentage=None, net_powerplay_percentage=None,
                                            net_penalty_kill_percentage=None, faceoff_win_percentage=None ) )
                    
            else:
                for i in range( len( rows ) ):  
                    current_team = rows[i]
                      
                    teams.append( NHL.Team( type=None, season=None, city=current_team[0], name=current_team[1],
                                            games_played=current_team[2], wins=current_team[3], 
                                            losses=current_team[4], ties=current_team[5], overtime_losses=None, 
                                            points=current_team[6], points_percentage=current_team[7], 
                                            regulation_wins=None, regulation_and_overtime_wins=None, 
                                            goals_for=current_team[8], goals_against=current_team[9], 
                                            goal_differential=current_team[10], home=current_team[11], 
                                            away=current_team[12], shootout=None, last_10=current_team[13], 
                                            streak=current_team[14], shootout_wins=None, goals_for_per_game=None, 
                                            goals_against_per_game=None, powerplay_percentage=None, 
                                            penalty_kill_percentage=None, net_powerplay_percentage=None,
                                            net_penalty_kill_percentage=None, faceoff_win_percentage=None ) )

        cur.close()

        return teams
    

    # This method returns a Team object with all of the stats for the given team in the given season.
    def get_team_stats_for_one_team_for_one_season( self, type, team, season ): 
        cur = self.conn.cursor()

        city = self.nhl_util.get_city( team )
        name = self.nhl_util.get_name( team )

        if type == 'Regular Season':
            if self.nhl_util.is_overtime_losses_season( type, season ):
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, OVERTIME_LOSSES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS,
                                               GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY,
                                               SHOOTOUT, LAST_10, STREAK, SHOOTOUT_WINS, GOALS_FOR_PER_GAME,
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ %
                                                                                     ( type, city, name, season ) )
                
            elif self.nhl_util.is_overtime_losses_and_ties_season( season ):
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, TIES, OVERTIME_LOSSES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS
                                               GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, 
                                               LAST_10, STREAK, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                               POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                               NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE, 
                                               FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )
                
            else:
                if self.nhl_util.is_faceoff_win_percentage_season( season ):
                    data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, TIES, POINTS, 
                                                   POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS,
                                                   GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, 
                                                   LAST_10, STREAK, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME,
                                                   POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                   NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE, 
                                                   FACEOFF_WIN_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )

                elif self.nhl_util.is_special_teams_season( season ):
                    data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, TIES, POINTS, 
                                                   POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, 
                                                   GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, 
                                                   LAST_10, STREAK, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME,
                                                   POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                   NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )

                else:
                    data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, TIES, POINTS, POINTS_PERCENTAGE, 
                                                   REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                                   GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, LAST_10, 
                                                   STREAK, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )
        
        else:
            if season == '2019-2020':
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, OVERTIME_LOSSES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS,
                                               GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME,
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE,  
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )
                    
            elif self.nhl_util.is_faceoff_win_percentage_season( season ):
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, POINTS, POINTS_PERCENTAGE, 
                                               REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                               GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )

            elif self.nhl_util.is_special_teams_season( season ):
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, POINTS, POINTS_PERCENTAGE, 
                                               REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                               GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )
                
            elif self.nhl_util.is_ties_in_playoffs_season( season ):
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, TIES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS,
                                               GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME,
                                               GOALS_AGAINST_PER_GAME
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )

            else:
                data = cur.execute( """ SELECT GAMES_PLAYED, WINS, LOSSES, POINTS, POINTS_PERCENTAGE, 
                                               REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                               GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                               GOALS_AGAINST_PER_GAME
                                               FROM Team 
                                               WHERE TYPE = '%s' AND CITY = '%s' AND NAME = '%s' AND SEASON = '%s'; """ % 
                                                                                    ( type, city, name, season ) )

        team = data.fetchone()
        if team != None:
            if type == 'Regular Season':
                if self.nhl_util.is_overtime_losses_season( type, season ):
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=None, overtime_losses=team[3], 
                                     points=team[4], points_percentage=team[5], regulation_wins=team[6], 
                                     regulation_and_overtime_wins=team[7], goals_for=team[8], goals_against=team[9], 
                                     goal_differential=team[10], home=team[11], away=team[12], shootout=team[13], 
                                     last_10=team[14], streak=team[15], shootout_wins=team[16], 
                                     goals_for_per_game=team[17], goals_against_per_game=team[18],
                                     powerplay_percentage=team[19], penalty_kill_percentage=team[20], 
                                     net_powerplay_percentage=team[21], net_penalty_kill_percentage=team[22], 
                                     faceoff_win_percentage=team[23] )
                    
                elif self.nhl_util.is_overtime_losses_and_ties_season( season ):
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=team[3], overtime_losses=team[4], 
                                     points=team[5], points_percentage=team[6], regulation_wins=team[7], 
                                     regulation_and_overtime_wins=team[8], goals_for=team[9], goals_against=team[10], 
                                     goal_differential=team[11], home=team[12], away=team[13], shootout=None, 
                                     last_10=team[14], streak=team[15], shootout_wins=None, goals_for_per_game=team[16],
                                     goals_against_per_game=team[17], powerplay_percentage=team[18], 
                                     penalty_kill_percentage=team[19], net_powerplay_percentage=team[20], 
                                     net_penalty_kill_percentage=team[21], faceoff_win_percentage=team[22] )
                    
                else:
                    if self.nhl_util.is_faceoff_win_percentage_season( season ):
                        team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                         wins=team[1], losses=team[2], ties=team[3], overtime_losses=None, 
                                         points=team[4], points_percentage=team[5], regulation_wins=team[6], 
                                         regulation_and_overtime_wins=team[7], goals_for=team[8], goals_against=team[9], 
                                         goal_differential=team[10], home=team[11], away=team[12], shootout=None, 
                                         last_10=team[13], streak=team[14], shootout_wins=None, goals_for_per_game=team[15],
                                         goals_against_per_game=team[16], powerplay_percentage=team[17], 
                                         penalty_kill_percentage=team[18], net_powerplay_percentage=team[19], 
                                         net_penalty_kill_percentage=team[20], faceoff_win_percentage=team[21] )
                        
                    elif self.nhl_util.is_special_teams_season( season ):
                        team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                         wins=team[1], losses=team[2], ties=team[3], overtime_losses=None, 
                                         points=team[4], points_percentage=team[5], regulation_wins=team[6], 
                                         regulation_and_overtime_wins=team[7], goals_for=team[8], goals_against=team[9], 
                                         goal_differential=team[10], home=team[11], away=team[12], shootout=None, 
                                         last_10=team[13], streak=team[14], shootout_wins=None, goals_for_per_game=team[15],
                                         goals_against_per_game=team[16], powerplay_percentage=team[17], 
                                         penalty_kill_percentage=team[18], net_powerplay_percentage=team[19], 
                                         net_penalty_kill_percentage=team[20], faceoff_win_percentage=None )
                    
                    else:
                        team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                         wins=team[1], losses=team[2], ties=team[3], overtime_losses=None, 
                                         points=team[4], points_percentage=team[5], regulation_wins=team[6], 
                                         regulation_and_overtime_wins=team[7], goals_for=team[8], goals_against=team[9], 
                                         goal_differential=team[10], home=team[11], away=team[12], shootout=None, 
                                         last_10=team[13], streak=team[14], shootout_wins=None, goals_for_per_game=team[15],
                                         goals_against_per_game=team[16], powerplay_percentage=None, 
                                         penalty_kill_percentage=None, net_powerplay_percentage=None, 
                                         net_penalty_kill_percentage=None, faceoff_win_percentage=None )
            
            else:
                if season == '2019-2020':
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=None, overtime_losses=team[3], points=team[4], 
                                     points_percentage=team[5], regulation_wins=team[6], regulation_and_overtime_wins=team[7], 
                                     goals_for=team[8], goals_against=team[9], goal_differential=team[10], home=None, 
                                     away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[11], goals_against_per_game=team[12], powerplay_percentage=team[13], 
                                     penalty_kill_percentage=team[14], net_powerplay_percentage=team[15], 
                                     net_penalty_kill_percentage=team[16], faceoff_win_percentage=team[17] )

                elif self.nhl_util.is_faceoff_win_percentage_season( season ):
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=None, overtime_losses=None, points=team[3], 
                                     points_percentage=team[4], regulation_wins=team[5], regulation_and_overtime_wins=team[6], 
                                     goals_for=team[7], goals_against=team[8], goal_differential=team[9], home=None, 
                                     away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[10], goals_against_per_game=team[11], powerplay_percentage=team[12], 
                                     penalty_kill_percentage=team[13], net_powerplay_percentage=team[14], 
                                     net_penalty_kill_percentage=team[15], faceoff_win_percentage=team[16] )

                elif self.nhl_util.is_special_teams_season( season ):
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=None, overtime_losses=None, points=team[3], 
                                     points_percentage=team[4], regulation_wins=team[5], regulation_and_overtime_wins=team[6], 
                                     goals_for=team[7], goals_against=team[8], goal_differential=team[9], home=None, 
                                     away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[10], goals_against_per_game=team[11], powerplay_percentage=team[12], 
                                     penalty_kill_percentage=team[13], net_powerplay_percentage=team[14], 
                                     net_penalty_kill_percentage=team[15], faceoff_win_percentage=None )
                    
                elif self.nhl_util.is_ties_in_playoffs_season( season ):
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=team[3], overtime_losses=None, points=team[4], 
                                     points_percentage=team[5], regulation_wins=team[6], regulation_and_overtime_wins=team[7], 
                                     goals_for=team[8], goals_against=team[9], goal_differential=team[10], home=None, 
                                     away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[11], goals_against_per_game=team[12], powerplay_percentage=None, 
                                     penalty_kill_percentage=None, net_powerplay_percentage=None, 
                                     net_penalty_kill_percentage=None, faceoff_win_percentage=None )

                else:
                    team = NHL.Team( type=None, season=season, city=city, name=name, games_played=team[0],
                                     wins=team[1], losses=team[2], ties=None, overtime_losses=None, points=team[3], 
                                     points_percentage=team[4], regulation_wins=team[5], regulation_and_overtime_wins=team[6], 
                                     goals_for=team[7], goals_against=team[8], goal_differential=team[9], home=None, 
                                     away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[10], goals_against_per_game=team[11], powerplay_percentage=None, 
                                     penalty_kill_percentage=None, net_powerplay_percentage=None, 
                                     net_penalty_kill_percentage=None, faceoff_win_percentage=None )
                    
            return team
        

    # This method returns a list of Team objects with all of the stats for the given team for all
    # the seasons which the team was active.
    def get_team_stats_for_one_team( self, team ):
        cur = self.conn.cursor()

        cur.execute( """ UPDATE Team SET TIES = 'null' WHERE TIES = 'None'; """ )
        cur.execute( """ UPDATE Team SET TIES = 'null' WHERE TIES IS NULL; """ )
        self.conn.commit()

        city = self.nhl_util.get_city( team )
        name = self.nhl_util.get_name( team )

        data = cur.execute( """ SELECT TYPE, SEASON, GAMES_PLAYED, WINS, LOSSES, TIES,
                                       OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, REGULATION_WINS,
                                       REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST,
                                       GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK,
                                       SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                       POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE,
                                       NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                       FACEOFF_WIN_PERCENTAGE
                                       FROM Team 
                                       WHERE CITY = '%s' AND NAME = '%s'; """ % 
                                                            ( city, name ) )
        
        data = data.fetchall()
        
        teams = []
        for team in data:
            if team != None:
                if team[0] == 'Regular Season':
                    if self.nhl_util.is_overtime_losses_season( team[0], team[1] ):
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], points=team[7],
                                         points_percentage=team[8], regulation_wins=team[9], 
                                         regulation_and_overtime_wins=team[10], goals_for=team[11],
                                         goals_against=team[12], goal_differential=team[13],
                                         home=team[14], away=team[15], shootout=team[16], 
                                         last_10=team[17], streak=team[18],
                                         shootout_wins=team[19], goals_for_per_game=team[20],
                                         goals_against_per_game=team[21], powerplay_percentage=team[22],
                                         penalty_kill_percentage=team[23], net_powerplay_percentage=team[24],
                                         net_penalty_kill_percentage=team[25], faceoff_win_percentage=team[26] )
                        
                    elif self.nhl_util.is_overtime_losses_and_ties_season( team[1] ):
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], 
                                         points=team[7], points_percentage=team[8],
                                         regulation_wins=team[9], regulation_and_overtime_wins=team[10],
                                         goals_for=team[11], goals_against=team[12],
                                         goal_differential=team[13], home=team[14],
                                         away=team[15], shootout=team[16], last_10=team[17],
                                         streak=team[18], shootout_wins=team[19],
                                         goals_for_per_game=team[20], goals_against_per_game=team[21],
                                         powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                         net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                         faceoff_win_percentage=team[26] )
                        
                    else:
                        if self.nhl_util.is_faceoff_win_percentage_season( team[1] ):
                            team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                             games_played=team[2], wins=team[3], losses=team[4],
                                             ties=team[5], overtime_losses=team[6],
                                             points=team[7], points_percentage=team[8],
                                             regulation_wins=team[9], regulation_and_overtime_wins=team[10],
                                             goals_for=team[11], goals_against=team[12],
                                             goal_differential=team[13], home=team[14],
                                             away=team[15], shootout=team[16], last_10=team[17],
                                             streak=team[18], shootout_wins=team[19],
                                             goals_for_per_game=team[20], goals_against_per_game=team[21],
                                             powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                             net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                             faceoff_win_percentage=team[26] )
                            
                        elif self.nhl_util.is_special_teams_season( team[1] ):
                            team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                             games_played=team[2], wins=team[3], losses=team[4],
                                             ties=team[5], overtime_losses=team[6],
                                             points=team[7], points_percentage=team[8],
                                             regulation_wins=team[9], regulation_and_overtime_wins=team[10],
                                             goals_for=team[11], goals_against=team[12],
                                             goal_differential=team[13], home=team[14],
                                             away=team[15], shootout=team[16], last_10=team[17],
                                             streak=team[18], shootout_wins=team[19],
                                             goals_for_per_game=team[20],goals_against_per_game=team[21],
                                             powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                             net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                             faceoff_win_percentage=team[26] )
                            
                        else:
                            team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                             games_played=team[2], wins=team[3], losses=team[4],
                                             ties=team[5], overtime_losses=team[6],
                                             points=team[7], points_percentage=team[8],
                                             regulation_wins=team[9], regulation_and_overtime_wins=team[10],
                                             goals_for=team[11], goals_against=team[12],
                                             goal_differential=team[13], home=team[14],
                                             away=team[15], shootout=team[16], last_10=team[17],
                                             streak=team[18], shootout_wins=team[19],
                                             goals_for_per_game=team[20], goals_against_per_game=team[21],
                                             powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                             net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                             faceoff_win_percentage=team[26] )
                    
                else:
                    if team[1] == '2019-2020':
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], points=team[7], 
                                         points_percentage=team[8], regulation_wins=team[9],
                                         regulation_and_overtime_wins=team[10], goals_for=team[11],
                                         goals_against=team[12], goal_differential=team[13],
                                         home=team[14], away=team[15], shootout=team[16],
                                         last_10=team[17], streak=team[18], shootout_wins=team[19],
                                         goals_for_per_game=team[20], goals_against_per_game=team[21],
                                         powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                         net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                         faceoff_win_percentage=team[26] )

                    elif self.nhl_util.is_faceoff_win_percentage_season( team[1] ):
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], points=team[7], 
                                         points_percentage=team[8], regulation_wins=team[9],
                                         regulation_and_overtime_wins=team[10], goals_for=team[11],
                                         goals_against=team[12], goal_differential=team[13],
                                         home=team[14], away=team[15], shootout=team[16],
                                         last_10=team[17], streak=team[18], shootout_wins=team[19], 
                                         goals_for_per_game=team[20], goals_against_per_game=team[21],
                                         powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                         net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                         faceoff_win_percentage=team[26] )

                    elif self.nhl_util.is_special_teams_season( team[1] ):
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], points=team[7], 
                                         points_percentage=team[8], regulation_wins=team[9],
                                         regulation_and_overtime_wins=team[10], goals_for=team[11],
                                         goals_against=team[12], goal_differential=team[13],
                                         home=team[14], away=team[15], shootout=team[16],
                                         last_10=team[17], streak=team[18], shootout_wins=team[19],
                                         goals_for_per_game=team[20], goals_against_per_game=team[21],
                                         powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                         net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                         faceoff_win_percentage=team[26] )
                        
                    elif self.nhl_util.is_ties_in_playoffs_season( team[1] ):
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], points=team[7], 
                                         points_percentage=team[8], regulation_wins=team[9],
                                         regulation_and_overtime_wins=team[10], goals_for=team[11],
                                         goals_against=team[12], goal_differential=team[13],
                                         home=team[14], away=team[15], shootout=team[16],
                                         last_10=team[17], streak=team[18], shootout_wins=team[19],
                                         goals_for_per_game=team[20], goals_against_per_game=team[21],
                                         powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                         net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                         faceoff_win_percentage=team[26] )

                    else:
                        team = NHL.Team( type=team[0], season=team[1], city=city, name=name,
                                         games_played=team[2], wins=team[3], losses=team[4],
                                         ties=team[5], overtime_losses=team[6], points=team[7], 
                                         points_percentage=team[8], regulation_wins=team[9],
                                         regulation_and_overtime_wins=team[10], goals_for=team[11],
                                         goals_against=team[12], goal_differential=team[13],
                                         home=team[14], away=team[15], shootout=team[16],
                                         last_10=team[17], streak=team[18], shootout_wins=team[19], 
                                         goals_for_per_game=team[20], goals_against_per_game=team[21],
                                         powerplay_percentage=team[22], penalty_kill_percentage=team[23],
                                         net_powerplay_percentage=team[24], net_penalty_kill_percentage=team[25],
                                         faceoff_win_percentage=team[26] )

            teams.append( team )
                    
        return teams
    

    # This method returns a list of Team objects with all of the stats for the given season.
    def get_team_stats_for_one_season( self, type, season ):
        cur = self.conn.cursor()

        if type == 'Regular Season':
            if self.nhl_util.is_overtime_losses_season( type, season ):
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, OVERTIME_LOSSES,
                                               POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                               REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                               GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT, LAST_10, STREAK, 
                                               SHOOTOUT_WINS, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME,
                                               POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                               NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                               FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
                
            elif self.nhl_util.is_overtime_losses_and_ties_season( season ):
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                               OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, 
                                               REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, GOALS_FOR,
                                               GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, LAST_10, 
                                               STREAK, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                               POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                               NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE, 
                                               FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
                
            else:
                if self.nhl_util.is_faceoff_win_percentage_season( season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, POINTS,
                                                   POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                   GOAL_DIFFERENTIAL, HOME, AWAY, LAST_10, STREAK, 
                                                   GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                   POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                   NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                   FACEOFF_WIN_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
            
                elif self.nhl_util.is_special_teams_season( season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, POINTS,
                                                   POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                   GOAL_DIFFERENTIAL, HOME, AWAY, LAST_10, STREAK, 
                                                   GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME, 
                                                   POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                   NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
                    
                else:
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, POINTS,
                                                   POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                                   GOAL_DIFFERENTIAL, HOME, AWAY, LAST_10, STREAK, 
                                                   GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )          
        
        else:
            if season == '2019-2020':
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, OVERTIME_LOSSES,
                                               POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                               REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST,
                                               GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE,
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )

            elif self.nhl_util.is_faceoff_win_percentage_season( season ):
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, 
                                               REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                               GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )

            elif self.nhl_util.is_special_teams_season( season ):
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, 
                                               REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                               GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                               GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                               PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                               NET_PENALTY_KILL_PERCENTAGE
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )
                
            elif self.nhl_util.is_ties_in_playoffs_season( season ):
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, 
                                               REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                               GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )

            else:
                data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, POINTS, 
                                               POINTS_PERCENTAGE, REGULATION_WINS, 
                                               REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST, 
                                               GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME 
                                               FROM Team 
                                               WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, season ) )

        data = data.fetchall()
        
        teams = []

        if type == 'Regular Season':
            if self.nhl_util.is_overtime_losses_season( type, season ):
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=None, overtime_losses=team[5], 
                                     points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                     regulation_and_overtime_wins=team[9], goals_for=team[10], goals_against=team[11], 
                                     goal_differential=team[12], home=team[13], away=team[14], shootout=team[15], 
                                     last_10=team[16], streak=team[17], shootout_wins=team[18], 
                                     goals_for_per_game=team[19], goals_against_per_game=team[20],
                                     powerplay_percentage=team[21], penalty_kill_percentage=team[22], 
                                     net_powerplay_percentage=team[23], net_penalty_kill_percentage=team[24], 
                                     faceoff_win_percentage=team[25] )
                    teams.append( team )

            elif self.nhl_util.is_overtime_losses_and_ties_season( season ):
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=team[5], overtime_losses=team[6], 
                                     points=team[7], points_percentage=team[8], regulation_wins=team[9], 
                                     regulation_and_overtime_wins=team[10], goals_for=team[11], goals_against=team[12], 
                                     goal_differential=team[13], home=team[14], away=team[15], shootout=None, 
                                     last_10=team[16], streak=team[17], shootout_wins=None, 
                                     goals_for_per_game=team[18], goals_against_per_game=team[19],
                                     powerplay_percentage=team[20], penalty_kill_percentage=team[21], 
                                     net_powerplay_percentage=team[22], net_penalty_kill_percentage=team[23], 
                                     faceoff_win_percentage=team[24] )
                    teams.append( team )

            else:
                if self.nhl_util.is_faceoff_win_percentage_season( season ):
                    for team in data:
                        team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                         wins=team[3], losses=team[4], ties=team[5], overtime_losses=None, 
                                         points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                         regulation_and_overtime_wins=team[9], goals_for=team[10], goals_against=team[11], 
                                         goal_differential=team[12], home=team[13], away=team[14], shootout=None, 
                                         last_10=team[15], streak=team[16], shootout_wins=None, 
                                         goals_for_per_game=team[17], goals_against_per_game=team[18],
                                         powerplay_percentage=team[19], penalty_kill_percentage=team[20], 
                                         net_powerplay_percentage=team[21], net_penalty_kill_percentage=team[22], 
                                         faceoff_win_percentage=team[23] )
                        teams.append( team )

                elif self.nhl_util.is_special_teams_season( season ):
                    for team in data:
                        team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                         wins=team[3], losses=team[4], ties=team[5], overtime_losses=None, 
                                         points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                         regulation_and_overtime_wins=team[9], goals_for=team[10], goals_against=team[11], 
                                         goal_differential=team[12], home=team[13], away=team[14], shootout=None, 
                                         last_10=team[15], streak=team[16], shootout_wins=None, 
                                         goals_for_per_game=team[17], goals_against_per_game=team[18],
                                         powerplay_percentage=team[19], penalty_kill_percentage=team[20], 
                                         net_powerplay_percentage=team[21], net_penalty_kill_percentage=team[22], 
                                         faceoff_win_percentage=None )
                        teams.append( team )

                else:
                    for team in data:
                        team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                         wins=team[3], losses=team[4], ties=team[5], overtime_losses=None, 
                                         points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                         regulation_and_overtime_wins=team[9], goals_for=team[10], goals_against=team[11], 
                                         goal_differential=team[12], home=team[13], away=team[14], shootout=None, 
                                         last_10=team[15], streak=team[16], shootout_wins=None, 
                                         goals_for_per_game=team[17], goals_against_per_game=team[18],
                                         powerplay_percentage=None, penalty_kill_percentage=None, 
                                         net_powerplay_percentage=None, net_penalty_kill_percentage=None, 
                                         faceoff_win_percentage=None )
                        teams.append( team )

        else:
            if season == '2019-2020':
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=None, overtime_losses=team[5], 
                                     points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                     regulation_and_overtime_wins=team[9], goals_for=team[10], 
                                     goals_against=team[11], goal_differential=team[12], home=None, away=None, 
                                     shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[13], goals_against_per_game=team[14], 
                                     powerplay_percentage=team[15], penalty_kill_percentage=team[16], 
                                     net_powerplay_percentage=team[17], net_penalty_kill_percentage=team[18], 
                                     faceoff_win_percentage=team[19] )
                    teams.append( team )

            elif self.nhl_util.is_faceoff_win_percentage_season( season ):
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=None, overtime_losses=None, points=team[5], 
                                     points_percentage=team[6], regulation_wins=team[7], regulation_and_overtime_wins=team[8], 
                                     goals_for=team[9], goals_against=team[10], goal_differential=team[11], 
                                     home=None, away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[12], goals_against_per_game=team[13], 
                                     powerplay_percentage=team[14], penalty_kill_percentage=team[15], 
                                     net_powerplay_percentage=team[16], net_penalty_kill_percentage=team[17], 
                                     faceoff_win_percentage=team[18] )
                    teams.append( team )

            elif self.nhl_util.is_special_teams_season( season ):
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=None, overtime_losses=None, points=team[5], 
                                     points_percentage=team[6], regulation_wins=team[7], regulation_and_overtime_wins=team[8], 
                                     goals_for=team[9], goals_against=team[10], goal_differential=team[11], 
                                     home=None, away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[12], goals_against_per_game=team[13], 
                                     powerplay_percentage=team[14], penalty_kill_percentage=team[15], 
                                     net_powerplay_percentage=team[16], net_penalty_kill_percentage=team[17], 
                                     faceoff_win_percentage=None )
                    teams.append( team )

            elif self.nhl_util.is_ties_in_playoffs_season( season ):
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=team[5], overtime_losses=None, points=team[6], 
                                     points_percentage=team[7], regulation_wins=team[8], regulation_and_overtime_wins=team[9], 
                                     goals_for=team[10], goals_against=team[11], goal_differential=team[12], 
                                     home=None, away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[13], goals_against_per_game=team[14], 
                                     powerplay_percentage=None, penalty_kill_percentage=None, 
                                     net_powerplay_percentage=None, net_penalty_kill_percentage=None, 
                                     faceoff_win_percentage=None )
                    teams.append( team )

            else:
                for team in data:
                    team = NHL.Team( type=None, season=None, city=team[0], name=team[1], games_played=team[2],
                                     wins=team[3], losses=team[4], ties=None, overtime_losses=None, points=team[5], 
                                     points_percentage=team[6], regulation_wins=team[7], regulation_and_overtime_wins=team[8], 
                                     goals_for=team[9], goals_against=team[10], goal_differential=team[11], 
                                     home=None, away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                     goals_for_per_game=team[12], goals_against_per_game=team[13], 
                                     powerplay_percentage=None, penalty_kill_percentage=None, 
                                     net_powerplay_percentage=None, net_penalty_kill_percentage=None, 
                                     faceoff_win_percentage=None )
                    teams.append( team )
                
        return teams
    

    # This method returns a list of Team objects with all of the stats for all of the teams from the 
    # given first season up until the last season.
    def get_team_stats( self, type, first_season, last_season ): 
        cur = self.conn.cursor()

        always_include_ties = self.nhl_util.seasons_fall_in_ties_period( first_season )
        if type == 'Regular Season':
            always_include_overtime_losses = self.nhl_util.seasons_fall_in_overtime_losses_period( last_season )
        else:
            always_include_overtime_losses = self.nhl_util.seasons_fall_in_overtime_losses_in_playoffs_period( first_season, last_season )
        always_include_faceoff_win_percentage = self.nhl_util.seasons_fall_in_faceoff_win_percentage_period( last_season )
        always_include_special_teams_stats = self.nhl_util.seasons_fall_in_special_teams_period( last_season )
        always_include_shootout = self.nhl_util.seasons_fall_in_shootout_period( last_season )
        if type == 'Playoffs':
            always_include_ties = self.nhl_util.seasons_fall_in_ties_in_playoffs_period( first_season )

        first_season_first_year = self.nhl_util.get_first_year( first_season )
        last_season_first_year = self.nhl_util.get_first_year( last_season )

        teams = []
        for i in range( first_season_first_year, last_season_first_year + 1 ):
            curr_season = str( i ) + '-' + str( i + 1 )

            if type == 'Regular Season':
                if self.nhl_util.is_overtime_losses_season( type, curr_season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, 
                                                   OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, 
                                                   REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, 
                                                   GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, 
                                                   HOME, AWAY, SHOOTOUT, LAST_10, STREAK, 
                                                   SHOOTOUT_WINS, GOALS_FOR_PER_GAME, 
                                                   GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                                   PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                                   NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
                    
                elif self.nhl_util.is_overtime_losses_and_ties_season( curr_season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                   OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, 
                                                   REGULATION_WINS, REGULATION_AND_OVERTIME_WINS,
                                                   GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, 
                                                   HOME, AWAY, LAST_10, STREAK, GOALS_FOR_PER_GAME, 
                                                   GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                                   PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE,
                                                   NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
                    
                else:
                    if self.nhl_util.is_faceoff_win_percentage_season( curr_season ):
                        data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                       POINTS, POINTS_PERCENTAGE, REGULATION_WINS,
                                                       REGULATION_AND_OVERTIME_WINS, GOALS_FOR,
                                                       GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY,
                                                       LAST_10, STREAK, GOALS_FOR_PER_GAME,
                                                       GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE,
                                                       PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE,
                                                       NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                                       FROM Team 
                                                       WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
                        
                    elif self.nhl_util.is_special_teams_season( curr_season ):
                        data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES,
                                                       POINTS, POINTS_PERCENTAGE, REGULATION_WINS,
                                                       REGULATION_AND_OVERTIME_WINS, GOALS_FOR,
                                                       GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY,
                                                       LAST_10, STREAK, GOALS_FOR_PER_GAME, 
                                                       GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE,
                                                       PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE,
                                                       NET_PENALTY_KILL_PERCENTAGE
                                                       FROM Team 
                                                       WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )

                    else:
                        data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                       POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                       REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                                       GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY,
                                                       LAST_10, STREAK, GOALS_FOR_PER_GAME, 
                                                       GOALS_AGAINST_PER_GAME
                                                       FROM Team 
                                                       WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )

            else:
                if curr_season == '2019-2020':
                        data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, 
                                                       OVERTIME_LOSSES, POINTS, POINTS_PERCENTAGE, 
                                                       REGULATION_WINS, REGULATION_AND_OVERTIME_WINS, 
                                                       GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, 
                                                       GOALS_FOR_PER_GAME, GOALS_AGAINST_PER_GAME,
                                                       POWERPLAY_PERCENTAGE, PENALTY_KILL_PERCENTAGE, 
                                                       NET_POWERPLAY_PERCENTAGE, NET_PENALTY_KILL_PERCENTAGE,
                                                       FACEOFF_WIN_PERCENTAGE
                                                       FROM Team 
                                                       WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )

                elif self.nhl_util.is_faceoff_win_percentage_season( curr_season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, POINTS, 
                                                   POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                                   GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME,
                                                   GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE, 
                                                   PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                                   NET_PENALTY_KILL_PERCENTAGE, FACEOFF_WIN_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
                                        
                elif self.nhl_util.is_special_teams_season( curr_season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, POINTS, 
                                                   POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST,
                                                   OAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                                   GOALS_AGAINST_PER_GAME, POWERPLAY_PERCENTAGE,
                                                   PENALTY_KILL_PERCENTAGE, NET_POWERPLAY_PERCENTAGE, 
                                                   NET_PENALTY_KILL_PERCENTAGE
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )
                    
                elif self.nhl_util.is_ties_in_playoffs_season( curr_season ):
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, 
                                                   POINTS, POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, GOALS_AGAINST,
                                                   GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME, 
                                                   GOALS_AGAINST_PER_GAME
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )

                else:
                    data = cur.execute( """ SELECT CITY, NAME, GAMES_PLAYED, WINS, LOSSES, POINTS, 
                                                   POINTS_PERCENTAGE, REGULATION_WINS, 
                                                   REGULATION_AND_OVERTIME_WINS, GOALS_FOR, 
                                                   GOALS_AGAINST, GOAL_DIFFERENTIAL, GOALS_FOR_PER_GAME,
                                                   GOALS_AGAINST_PER_GAME
                                                   FROM Team 
                                                   WHERE TYPE = '%s' AND SEASON = '%s'; """ % ( type, curr_season ) )

            data = data.fetchall()

            for team in data:
                if type == 'Regular Season':
                    if self.nhl_util.is_overtime_losses_season( type, curr_season ):
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], games_played=team[2],
                                         wins=team[3], losses=team[4], ties='--' if always_include_ties else None, 
                                         overtime_losses=team[5], points=team[6], points_percentage=team[7], 
                                         regulation_wins=team[8], regulation_and_overtime_wins=team[9], goals_for=team[10], 
                                         goals_against=team[11], goal_differential=team[12], home=team[13], 
                                         away=team[14], shootout=team[15], last_10=team[16], streak=team[17], 
                                         shootout_wins=team[18], goals_for_per_game=team[19], goals_against_per_game=team[20],
                                         powerplay_percentage=team[21], penalty_kill_percentage=team[22], 
                                         net_powerplay_percentage=team[23], net_penalty_kill_percentage=team[24], 
                                         faceoff_win_percentage=team[25] )

                    elif self.nhl_util.is_overtime_losses_and_ties_season( curr_season ):
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], games_played=team[2],
                                         wins=team[3], losses=team[4], ties=team[5], overtime_losses=team[6], 
                                         points=team[7], points_percentage=team[8], regulation_wins=team[9], 
                                         regulation_and_overtime_wins=team[10], goals_for=team[11], goals_against=team[12], 
                                         goal_differential=team[13], home=team[14], away=team[15], 
                                         shootout='--' if always_include_shootout else None, last_10=team[16], 
                                         streak=team[17], shootout_wins='--' if always_include_shootout else None, 
                                         goals_for_per_game=team[18], goals_against_per_game=team[19],
                                         powerplay_percentage=team[20], penalty_kill_percentage=team[21], 
                                         net_powerplay_percentage=team[22], net_penalty_kill_percentage=team[23], 
                                         faceoff_win_percentage=team[24] )

                    else:
                        if self.nhl_util.is_faceoff_win_percentage_season( curr_season ):
                            team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], games_played=team[2],
                                             wins=team[3], losses=team[4], ties=team[5], 
                                             overtime_losses='--' if always_include_overtime_losses else None, 
                                             points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                             regulation_and_overtime_wins=team[9], goals_for=team[10], 
                                             goals_against=team[11], goal_differential=team[12], home=team[13], 
                                             away=team[14], shootout='--' if always_include_shootout else None, 
                                             last_10=team[15], streak=team[16], shootout_wins='--' if always_include_shootout else None, 
                                             goals_for_per_game=team[17], goals_against_per_game=team[18],
                                             powerplay_percentage=team[19], penalty_kill_percentage=team[20], 
                                             net_powerplay_percentage=team[21], net_penalty_kill_percentage=team[22], 
                                             faceoff_win_percentage=team[23] )

                        elif self.nhl_util.is_special_teams_season( curr_season ):
                            team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], games_played=team[2],
                                             wins=team[3], losses=team[4], ties=team[5], 
                                             overtime_losses='--' if always_include_overtime_losses else None, 
                                             points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                             regulation_and_overtime_wins=team[9], goals_for=team[10], goals_against=team[11], 
                                             goal_differential=team[12], home=team[13], away=team[14], 
                                             shootout='--' if always_include_shootout else None, last_10=team[15], 
                                             streak=team[16], shootout_wins='--' if always_include_shootout else None, 
                                             goals_for_per_game=team[17], goals_against_per_game=team[18],
                                             powerplay_percentage=team[19], penalty_kill_percentage=team[20], 
                                             net_powerplay_percentage=team[21], net_penalty_kill_percentage=team[22], 
                                             faceoff_win_percentage='--' if always_include_faceoff_win_percentage else None )

                        else:
                            team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], games_played=team[2],
                                             wins=team[3], losses=team[4], ties=team[5],
                                             overtime_losses='--' if always_include_overtime_losses else None, 
                                             points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                             regulation_and_overtime_wins=team[9], goals_for=team[10], goals_against=team[11], 
                                             goal_differential=team[12], home=team[13], away=team[14], 
                                             shootout='--' if always_include_shootout else None, last_10=team[15], 
                                             streak=team[16], shootout_wins='--' if always_include_shootout else None, 
                                             goals_for_per_game=team[17], goals_against_per_game=team[18],
                                             powerplay_percentage='--' if always_include_special_teams_stats else None,
                                             penalty_kill_percentage='--' if always_include_special_teams_stats else None, 
                                             net_powerplay_percentage='--' if always_include_special_teams_stats else None,
                                             net_penalty_kill_percentage='--' if always_include_special_teams_stats else None, 
                                             faceoff_win_percentage='--' if always_include_faceoff_win_percentage else None )

                else:
                    if curr_season == '2019-2020':
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], 
                                         games_played=team[2], wins=team[3], losses=team[4], 
                                         ties='--' if always_include_ties else None, overtime_losses=team[5], 
                                         points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                         regulation_and_overtime_wins=team[9], goals_for=team[10], 
                                         goals_against=team[11], goal_differential=team[12], home=None, 
                                         away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                         goals_for_per_game=team[13], goals_against_per_game=team[14],
                                         powerplay_percentage=team[15], penalty_kill_percentage=team[16], 
                                         net_powerplay_percentage=team[17], net_penalty_kill_percentage=team[18], 
                                         faceoff_win_percentage=team[19] )

                    elif self.nhl_util.is_faceoff_win_percentage_season( curr_season ):
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], 
                                         games_played=team[2], wins=team[3], losses=team[4], 
                                         ties='--' if always_include_ties else None, 
                                         overtime_losses='--' if always_include_overtime_losses else None,
                                         points=team[5], points_percentage=team[6], regulation_wins=team[7], 
                                         regulation_and_overtime_wins=team[8], goals_for=team[9], 
                                         goals_against=team[10], goal_differential=team[11], home=None, 
                                         away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                         goals_for_per_game=team[12], goals_against_per_game=team[13],
                                         powerplay_percentage=team[14], penalty_kill_percentage=team[15], 
                                         net_powerplay_percentage=team[16], net_penalty_kill_percentage=team[17], 
                                         faceoff_win_percentage=team[18] )

                    elif self.nhl_util.is_special_teams_season( curr_season ):
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], 
                                         games_played=team[2], wins=team[3], losses=team[4], 
                                         ties='--' if always_include_ties else None, 
                                         overtime_losses='--' if always_include_overtime_losses else None,
                                         points=team[5], points_percentage=team[6], regulation_wins=team[7], 
                                         regulation_and_overtime_wins=team[8], goals_for=team[9], 
                                         goals_against=team[10], goal_differential=team[11], home=None, 
                                         away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                         goals_for_per_game=team[12], goals_against_per_game=team[13],
                                         powerplay_percentage=team[14], penalty_kill_percentage=team[15], 
                                         net_powerplay_percentage=team[16], net_penalty_kill_percentage=team[17], 
                                         faceoff_win_percentage='--' if always_include_faceoff_win_percentage else None )
                        
                    elif self.nhl_util.is_ties_in_playoffs_season( curr_season ):
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], 
                                         games_played=team[2], wins=team[3], losses=team[4], ties=team[5], 
                                         overtime_losses='--' if always_include_overtime_losses else None, 
                                         points=team[6], points_percentage=team[7], regulation_wins=team[8], 
                                         regulation_and_overtime_wins=team[9], goals_for=team[10], 
                                         goals_against=team[11], goal_differential=team[12], home=None, 
                                         away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                         goals_for_per_game=team[13], goals_against_per_game=team[14],
                                         powerplay_percentage='--' if always_include_special_teams_stats else None,
                                         penalty_kill_percentage='--' if always_include_special_teams_stats else None, 
                                         net_powerplay_percentage='--' if always_include_special_teams_stats else None, 
                                         net_penalty_kill_percentage='--' if always_include_special_teams_stats else None, 
                                         faceoff_win_percentage='--' if always_include_faceoff_win_percentage else None )

                    else:
                        team = NHL.Team( type=None, season=curr_season, city=team[0], name=team[1], 
                                         games_played=team[2], wins=team[3], losses=team[4], 
                                         ties='--' if always_include_ties else None, 
                                         overtime_losses='--' if always_include_overtime_losses else None, 
                                         points=team[5], points_percentage=team[6], regulation_wins=team[7], 
                                         regulation_and_overtime_wins=team[8], goals_for=team[9], 
                                         goals_against=team[10], goal_differential=team[11], home=None, 
                                         away=None, shootout=None, last_10=None, streak=None, shootout_wins=None, 
                                         goals_for_per_game=team[12], goals_against_per_game=team[13],
                                         powerplay_percentage='--' if always_include_special_teams_stats else None, 
                                         penalty_kill_percentage='--' if always_include_special_teams_stats else None, 
                                         net_powerplay_percentage='--' if always_include_special_teams_stats else None, 
                                         net_penalty_kill_percentage='--' if always_include_special_teams_stats else None, 
                                         faceoff_win_percentage='--' if always_include_faceoff_win_percentage else None )
                
                teams.append( team )    
                
        return teams


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