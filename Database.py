import os
import sqlite3

import NHL


################################################################################

class Database():
    max_num_results = 1000

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
                                PLUS_MINUS              INTEGER,
                                PENALTY_MINUTES         INTEGER     NOT NULL,
                                POWERPLAY_GOALS         INTEGER,
                                POWERPLAY_POINTS        INTEGER,
                                SHORTHANDED_GOALS       INTEGER,
                                SHORTHANDED_POINTS      INTEGER,
                                TIME_ON_ICE_PER_GAME    VARCHAR(64),
                                GAME_WINNING_GOALS      INTEGER     NOT NULL,
                                OVERTIME_GOALS          INTEGER     NOT NULL,
                                SHOTS                   INTEGER,
                                SHOOTING_PERCENTAGE     FLOAT,
                                FACEOFF_PERCENTAGE      FLOAT,
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
                                SHOTS_AGAINST           INTEGER,
                                SAVES,                  INTEGER,
                                GOALS_AGAINST           INTEGER,
                                GOALS_AGAINST_AVERAGE   FLOAT       NOT NULL,
                                SAVE_PERCENTAGE         FLOAT,
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


    def add_skater( self, skater ):
        cur = self.conn.cursor()

        # remove any previous stats from the skater
        data = cur.execute( """ SELECT SKATERID FROM Skater
                                    WHERE NAME = '? AND BIRTHDAY = ?; """, 
                                    ( skater.name, skater.birthday, ) )
        if data != None:
            rows = data.fetchall()
            for i in range( len( rows ) ):
                skater_id = rows[i][0]
                cur.execute( """ DELETE FROM SkaterSeason WHERE SKATERID = ?; """, ( skater_id, ) )
        

        cur.execute( """ DELETE FROM Skater WHERE NAME = ? AND BIRTHDAY = ?; """ ,
                    ( skater.name, skater.birthday, ) )
        
        # put the details into the Skater table
        cur.execute( """ INSERT
                                INTO Skater ( NAME, TEAM, NUMBER, POSITION, HEIGHT, WEIGHT, BIRTHDAY, 
                                              HANDEDNESS, DRAFT_POSITION )
                                     VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, '? ); """, 
                                            ( skater.name, skater.team, skater.number, skater.position,
                                              skater.height.replace("'", "''"), skater.weight, skater.birthday, 
                                              skater.handedness, skater.draft_position, ) )
        skater_id = cur.lastrowid

        # Put the regular season stats in the  table and connect each entry to the skater 
        # via the s table.
        for i in range( len( skater.seasons ) ):
            cur.execute( 
                """ INSERT 
                        INTO SkaterSeason (
                            SKATERID,
                            TYPE,
                            SEASON,
                            TEAM,
                            GAMES_PLAYED, 
                            GOALS,
                            ASSISTS,
                            POINTS,
                            PLUS_MINUS,
                            PENALTY_MINUTES, 
                            POWERPLAY_GOALS,
                            POWERPLAY_POINTS,
                            SHORTHANDED_GOALS, 
                            SHORTHANDED_POINTS,
                            TIME_ON_ICE_PER_GAME, 
                            GAME_WINNING_GOALS,
                            OVERTIME_GOALS,
                            SHOTS, 
                            SHOOTING_PERCENTAGE,
                            FACEOFF_PERCENTAGE )
                        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); """, ( 
                            skater_id,
                            'Regular Season',
                            skater.seasons[i].season, 
                            skater.seasons[i].team,
                            skater.seasons[i].games_played, 
                            skater.seasons[i].goals,
                            skater.seasons[i].assists, 
                            skater.seasons[i].points,
                            skater.seasons[i].plus_minus, 
                            skater.seasons[i].penalty_minutes,
                            skater.seasons[i].powerplay_goals, 
                            skater.seasons[i].powerplay_points,
                            skater.seasons[i].shorthanded_goals, 
                            skater.seasons[i].shorthanded_points, 
                            skater.seasons[i].time_on_ice_per_game, 
                            skater.seasons[i].game_winning_goals, 
                            skater.seasons[i].overtime_goals, 
                            skater.seasons[i].shots,
                            skater.seasons[i].shooting_percentage, 
                            skater.seasons[i].faceoff_percentage, ) )
            
        # do the same thing for the playoffs
        for i in range( len( skater.playoffs ) ):
            cur.execute(
                """ INSERT 
                        INTO SkaterSeason (
                            SKATERID,
                            TYPE,
                            SEASON,
                            TEAM,
                            GAMES_PLAYED, 
                            GOALS,
                            ASSISTS,
                            POINTS,
                            PLUS_MINUS,
                            PENALTY_MINUTES, 
                            POWERPLAY_GOALS,
                            POWERPLAY_POINTS,
                            SHORTHANDED_GOALS, 
                            SHORTHANDED_POINTS,
                            TIME_ON_ICE_PER_GAME, 
                            GAME_WINNING_GOALS,
                            OVERTIME_GOALS, SHOTS, 
                            SHOOTING_PERCENTAGE,
                            FACEOFF_PERCENTAGE )
                        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); """, (
                            skater_id,
                            'Playoffs',
                            skater.playoffs[i].season,
                            skater.playoffs[i].team,
                            skater.playoffs[i].games_played, 
                            skater.playoffs[i].goals,
                            skater.playoffs[i].assists, 
                            skater.playoffs[i].points,
                            skater.playoffs [i].plus_minus, 
                            skater.playoffs[i].penalty_minutes,
                            skater.playoffs[i].powerplay_goals, 
                            skater.playoffs[i].powerplay_points,
                            skater.playoffs[i].shorthanded_goals, 
                            skater.playoffs[i].shorthanded_points,
                            skater.playoffs[i].time_on_ice_per_game, 
                            skater.playoffs[i].game_winning_goals,
                            skater.playoffs[i].overtime_goals, 
                            skater.playoffs[i].shots,
                            skater.playoffs[i].shooting_percentage, 
                            skater.playoffs[i].faceoff_percentage, ) )

        cur.close()
        self.conn.commit()
                

    def add_goalie( self, goalie ):
        cur = self.conn.cursor()

        # remove any previous stats from the skater
        data = cur.execute( """ SELECT GOALIEID FROM Goalie
                                    WHERE NAME = ? AND BIRTHDAY = ?; """, 
                                    ( goalie.name, goalie.birthday, ) )
        
        if data != None:
            rows = data.fetchall()
            for i in range( len( rows ) ):
                goalie_id = rows[i][0]
                cur.execute( """ DELETE FROM GoalieSeason WHERE GOALIEID = ?; """, ( goalie_id, ) )
        

        cur.execute( """ DELETE FROM Goalie WHERE NAME = ? AND BIRTHDAY = ?; """, 
                    ( goalie.name, goalie.birthday, ) )
        
        # put the details into the Goalie table
        cur.execute( """ INSERT
                            INTO Goalie ( NAME, TEAM, NUMBER, HEIGHT, WEIGHT, BIRTHDAY, HANDEDNESS, 
                                          DRAFT_POSITION )
                                 VALUES ( ?, ?, ?, ?, ?, ?, ?, ? ); """,
                                        ( goalie.name, goalie.team, goalie.number, goalie.height.replace("'", "''"), 
                                          goalie.weight, goalie.birthday, goalie.handedness,
                                          goalie.draft_position, ) )
        goalie_id = cur.lastrowid

        # Put the regular season stats in the GoalieSeason table and connect each entry to the goalie 
        # via the GoalieSeasons table.
        for i in range( len( goalie.seasons ) ):
            cur.execute(
                """ INSERT 
                        INTO GoalieSeason (
                            GOALIEID,
                            TYPE,
                            SEASON,
                            TEAM,
                            GAMES_PLAYED, 
                            GAMES_STARTED,
                            WINS,
                            LOSSES,
                            TIES, 
                            OVERTIME_LOSSES,
                            SHOTS_AGAINST, 
                            GOALS_AGAINST_AVERAGE,
                            SAVE_PERCENTAGE, 
                            SHUTOUTS,
                            GOALS,
                            ASSISTS,
                            PENALTY_MINUTES,
                            TIME_ON_ICE )
                        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); """, (
                            goalie_id,
                            'Regular Season',
                            goalie.seasons[i].season,
                            goalie.seasons[i].team,
                            goalie.seasons[i].games_played,
                            goalie.seasons[i].games_started,
                            goalie.seasons[i].wins,
                            goalie.seasons[i].losses,
                            goalie.seasons[i].ties,
                            goalie.seasons[i].overtime_losses,
                            goalie.seasons[i].shots_against,
                            goalie.seasons[i].goals_against_average,
                            goalie.seasons[i].save_percentage,
                            goalie.seasons[i].shutouts,
                            goalie.seasons[i].goals,
                            goalie.seasons[i].assists,
                            goalie.seasons[i].penalty_minutes,
                            goalie.seasons[i].time_on_ice, ) )

        # do the same thing for the playoffs
        for i in range( len( goalie.playoffs ) ):
                cur.execute(
                    """ INSERT 
                        INTO GoalieSeason (
                            GOALIEID,
                            TYPE,
                            SEASON,
                            TEAM,
                            GAMES_PLAYED, 
                            GAMES_STARTED,
                            WINS,
                            LOSSES,
                            TIES, 
                            OVERTIME_LOSSES,
                            SHOTS_AGAINST, 
                            GOALS_AGAINST_AVERAGE,
                            SAVE_PERCENTAGE,
                            SHUTOUTS,
                            GOALS,
                            ASSISTS,
                            PENALTY_MINUTES, 
                            TIME_ON_ICE )
                        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); """, (
                            goalie_id,
                            'Playoffs',
                            goalie.playoffs[i].season,
                            goalie.playoffs[i].team,
                            goalie.playoffs[i].games_played,
                            goalie.playoffs[i].games_started,
                            goalie.playoffs[i].wins,
                            goalie.playoffs[i].losses,
                            goalie.playoffs[i].ties,
                            goalie.playoffs[i].overtime_losses,
                            goalie.playoffs[i].shots_against,
                            goalie.playoffs[i].goals_against_average,
                            goalie.playoffs[i].save_percentage,
                            goalie.playoffs[i].shutouts,
                            goalie.playoffs[i].goals,
                            goalie.playoffs[i].assists,
                            goalie.playoffs[i].penalty_minutes,
                            goalie.playoffs[i].time_on_ice, ) )
                
        cur.close()
        self.conn.commit()


    def add_team( self, team ):
        cur = self.conn.cursor()

        cur.execute( """ DELETE FROM Team WHERE TYPE = ? AND SEASON = ? AND CITY = ? AND NAME = ?; """, 
                    ( team.type, team.season, team.city, team.name, ) )

        cur.execute(
            """ INSERT
                    INTO Team (
                        TYPE,
                        SEASON,
                        CITY,
                        NAME,
                        GAMES_PLAYED,
                        WINS,
                        LOSSES,
                        TIES, 
                        OVERTIME_LOSSES,
                        POINTS,
                        POINTS_PERCENTAGE,
                        REGULATION_WINS, 
                        REGULATION_AND_OVERTIME_WINS,
                        GOALS_FOR,
                        GOALS_AGAINST, 
                        GOAL_DIFFERENTIAL,
                        HOME,
                        AWAY,
                        SHOOTOUT,
                        LAST_10,
                        STREAK,
                        SHOOTOUT_WINS,
                        GOALS_FOR_PER_GAME,
                        GOALS_AGAINST_PER_GAME, 
                        POWERPLAY_PERCENTAGE,
                        PENALTY_KILL_PERCENTAGE, 
                        NET_POWERPLAY_PERCENTAGE,
                        NET_PENALTY_KILL_PERCENTAGE,
                        FACEOFF_WIN_PERCENTAGE ) 
                    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); """, (
                        team.type,
                        team.season,
                        team.city,
                        team.name,
                        team.games_played, 
                        team.wins,
                        team.losses,
                        team.ties,
                        team.overtime_losses,
                        team.points, 
                        team.points_percentage,
                        team.regulation_wins,
                        team.regulation_and_overtime_wins, 
                        team.goals_for,
                        team.goals_against,
                        team.goal_differential,
                        team.home,
                        team.away,
                        team.shootout,
                        team.last_10,
                        team.streak,
                        team.shootout_wins,
                        team.goals_for_per_game,
                        team.goals_against_per_game,
                        team.powerplay_percentage,
                        team.penalty_kill_percentage,
                        team.net_powerplay_percentage,
                        team.net_penalty_kill_percentage,
                        team.faceoff_win_percentage ) )
                
        cur.close()
        self.conn.commit()


    def get_skater_stats_for_one_skater( self, name, type, stat, multiplier ): 
        cur = self.conn.cursor()

        data = cur.execute( """ SELECT SKATERID, TEAM, NUMBER, POSITION, HEIGHT, WEIGHT, BIRTHDAY,
                                HANDEDNESS, DRAFT_POSITION
                                FROM Skater
                                WHERE NAME = ?; """, ( name, ) )

        skater_data = data.fetchall()

        if stat == None:
            stat = 'season'
        stat = stat.replace( '-', '_' )

        if multiplier == 1 or multiplier == None:
            order_direction = 'DESC'
        else:
            order_direction = 'ASC'

        nullable_stats = ['plus_minus', 'powerplay_goals', 'powerplay_points', 'shorthanded_goals', 'shorthanded_points', 
                          'time_on_ice_per_game', 'shots', 'shooting_percentage', 'faceoff_percentage']
        if stat == 'time_on_ice_per_game':
            order_clause = \
                f"""
                    TIME_ON_ICE_PER_GAME IS NULL,
                    (
                        CAST(SUBSTR(TIME_ON_ICE_PER_GAME, 1,
                            INSTR(TIME_ON_ICE_PER_GAME, ':') - 1) AS INTEGER) * 60
                        +
                        CAST(SUBSTR(TIME_ON_ICE_PER_GAME,
                            INSTR(TIME_ON_ICE_PER_GAME, ':') + 1) AS INTEGER)
                    ) {order_direction}
                """
        elif stat in nullable_stats:
            order_clause = f"""
                {stat} IS NULL,
                {stat} {order_direction}
            """
        else:
            order_clause = f"{stat} {order_direction}"

        skaters = []
        for skater in skater_data:
            skater_id = skater[0]
            curr_skater = NHL.Skater( name=name, team=skater[1], number=skater[2], position=skater[3], 
                                      height=skater[4], weight=skater[5], birthday=skater[6], 
                                      handedness=skater[7], draft_position=skater[8] )

            skater_id = skater[0]

            data = cur.execute(
                f""" SELECT
                        SEASON, TEAM, GAMES_PLAYED, GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                        POWERPLAY_POINTS, SHORTHANDED_GOALS, SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME, GAME_WINNING_GOALS,
                        OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE
                    FROM   
                        SkaterSeason
                    WHERE
                        SKATERID = ?
                        AND TYPE = ?
                    ORDER BY
                        {order_clause}; """ ,
                    ( skater_id, type, ) )
            
            season_data = data.fetchall()
            if type == 'Regular Season':
                for season in season_data:
                    curr_skater.add_season(
                        season=season[0],
                        team=season[1],
                        games_played=season[2],
                        goals=season[3],
                        assists=season[4],
                        points=season[5], 
                        plus_minus=season[6] if season[6] != None else '--',
                        penalty_minutes=season[7],
                        powerplay_goals=season[8] if season[8] != None else '--',
                        powerplay_points=season[9] if season[9] != None else '--',
                        shorthanded_goals=season[10] if season[10] != None else '--',
                        shorthanded_points=season[11] if season[11] != None else '--',
                        time_on_ice_per_game=season[12] if season[12] != None else '--',
                        game_winning_goals=season[13],
                        overtime_goals=season[14],
                        shots=season[15] if season[15] != None else '--',
                        shooting_percentage=season[16] if season[16] != None else '--',
                        faceoff_percentage=season[17] if season[17] != None else '--' )
            else:
                for season in season_data:
                    curr_skater.add_playoffs(
                        season=season[0],
                        team=season[1],
                        games_played=season[2],
                        goals=season[3],
                        assists=season[4],
                        points=season[5], 
                        plus_minus=season[6] if season[6] != None else '--',
                        penalty_minutes=season[7],
                        powerplay_goals=season[8] if season[8] != None else '--',
                        powerplay_points=season[9] if season[9] != None else '--',
                        shorthanded_goals=season[10] if season[10] != None else '--',
                        shorthanded_points=season[11] if season[11] != None else '--',
                        time_on_ice_per_game=season[12] if season[12] != None else '--',
                        game_winning_goals=season[13],
                        overtime_goals=season[14],
                        shots=season[15] if season[15] != None else '--',
                        shooting_percentage=season[16] if season[16] != None else '--',
                        faceoff_percentage=season[17] if season[17] != None else '--' )

            skaters.append( curr_skater )
            
        cur.close()
        return skaters
    

    def get_skater_stats( self, type, first_season, last_season, position, team, combine_seasons_on_different_teams,
                            sum_results_between_seasons, stat, multiplier ):
        cur = self.conn.cursor()

        if stat == None:
            stat = 'points'
        stat = stat.replace( '-', '_' )

        if multiplier == 1 or multiplier == None:
            order_direction = 'DESC'
        else:
            order_direction = 'ASC'

        nullable_stats = ['plus_minus', 'powerplay_goals', 'powerplay_points', 'shorthanded_goals', 'shorthanded_points', 
                          'time_on_ice_per_game', 'shots', 'shooting_percentage', 'faceoff_percentage']
        
        if stat == 'time_on_ice_per_game':
            order_clause = \
                f"""
                    TIME_ON_ICE_PER_GAME IS NULL,
                    (
                        CAST(SUBSTR(TIME_ON_ICE_PER_GAME, 1,
                            INSTR(TIME_ON_ICE_PER_GAME, ':') - 1) AS INTEGER) * 60
                        +
                        CAST(SUBSTR(TIME_ON_ICE_PER_GAME,
                            INSTR(TIME_ON_ICE_PER_GAME, ':') + 1) AS INTEGER)
                    ) {order_direction}
                """
        elif stat in nullable_stats:
            order_clause = f"""
                {stat} IS NULL,
                {stat} {order_direction}
            """
        else:
            order_clause = f"{stat} {order_direction}"

        if not combine_seasons_on_different_teams and not sum_results_between_seasons:
                        data = cur.execute(
                f""" SELECT
                        NAME, POSITION, SEASON, SkaterSeason.TEAM AS SEASON_TEAM, GAMES_PLAYED,
                        GOALS, ASSISTS, POINTS, PLUS_MINUS, PENALTY_MINUTES, POWERPLAY_GOALS,
                        POWERPLAY_POINTS, SHORTHANDED_GOALS, SHORTHANDED_POINTS, TIME_ON_ICE_PER_GAME,
                        GAME_WINNING_GOALS, OVERTIME_GOALS, SHOTS, SHOOTING_PERCENTAGE, FACEOFF_PERCENTAGE
                    FROM
                        Skater JOIN SkaterSeason ON Skater.SKATERID = SkaterSeason.SKATERID 
                    WHERE
                        TYPE = ?
                        AND SEASON >= ? AND SEASON <= ?
                        AND (? IS NULL OR Skater.POSITION = ?)
                        AND (? IS NULL OR SkaterSeason.TEAM = ?)
                    ORDER BY
                        {order_clause}
                    LIMIT ?; """
                    ,( 
                        type,
                        first_season, last_season,
                        position, position,
                        team, team,
                        self.max_num_results ) 
                    )  
        else:
            if sum_results_between_seasons:
                group_by_clause = 'SS.SKATERID'
            else:
                group_by_clause = 'SS.SKATERID, SS.SEASON'

            data = cur.execute(
                f""" SELECT
                        NAME,
                        POSITION,
                        SEASON,
                        SEASON_TEAM,
                        GAMES_PLAYED,
                        GOALS,
                        ASSISTS,
                        POINTS,
                        PLUS_MINUS,
                        PENALTY_MINUTES,
                        POWERPLAY_GOALS,
                        POWERPLAY_POINTS,
                        SHORTHANDED_GOALS,
                        SHORTHANDED_POINTS,

                        -- Format seconds → MM:SS
                        CAST(AVG_TOI_SECONDS / 60 AS INTEGER)
                            || ':' ||
                        printf('%02d', CAST(AVG_TOI_SECONDS % 60 AS INTEGER))
                            AS TIME_ON_ICE_PER_GAME,

                        GAME_WINNING_GOALS,
                        OVERTIME_GOALS,
                        SHOTS,
                        SHOOTING_PERCENTAGE,
                        FACEOFF_PERCENTAGE

                    FROM (
                        SELECT
                            NAME,
                            POSITION,

                            CASE
                                WHEN COUNT(DISTINCT SS.SEASON) > 1 THEN 'N/A'
                                ELSE MIN(SS.SEASON)
                            END AS SEASON,

                            CASE
                                WHEN COUNT(DISTINCT SS.SEASON) > 1 THEN 'N/A'
                                WHEN COUNT(DISTINCT SS.TEAM) > 1 THEN 'Multiple'
                                ELSE MIN(SS.TEAM)
                            END AS SEASON_TEAM,

                            SUM(GAMES_PLAYED) AS GAMES_PLAYED,
                            SUM(GOALS) AS GOALS,
                            SUM(ASSISTS) AS ASSISTS,
                            SUM(POINTS) AS POINTS,
                            SUM(PLUS_MINUS) AS PLUS_MINUS,
                            SUM(PENALTY_MINUTES) AS PENALTY_MINUTES,
                            SUM(POWERPLAY_GOALS) AS POWERPLAY_GOALS,
                            SUM(POWERPLAY_POINTS) AS POWERPLAY_POINTS,
                            SUM(SHORTHANDED_GOALS) AS SHORTHANDED_GOALS,
                            SUM(SHORTHANDED_POINTS) AS SHORTHANDED_POINTS,

                            (
                                SUM(
                                    (CAST(SUBSTR(SS.TIME_ON_ICE_PER_GAME,1,INSTR(SS.TIME_ON_ICE_PER_GAME,':')-1) AS INTEGER) * 60
                                    + CAST(SUBSTR(SS.TIME_ON_ICE_PER_GAME,INSTR(SS.TIME_ON_ICE_PER_GAME,':')+1) AS INTEGER))
                                    * SS.GAMES_PLAYED
                                ) * 1.0 / SUM(SS.GAMES_PLAYED)
                            ) AS AVG_TOI_SECONDS,

                            SUM(GAME_WINNING_GOALS) AS GAME_WINNING_GOALS,
                            SUM(OVERTIME_GOALS) AS OVERTIME_GOALS,
                            SUM(SHOTS) AS SHOTS,

                            CASE WHEN SUM(SS.SHOTS) > 0 THEN
                                ROUND(SUM(SS.GOALS * 1.0) / SUM(SS.SHOTS) * 100, 2)
                            ELSE NULL END AS SHOOTING_PERCENTAGE,

                            CASE WHEN SUM(SS.FACEOFF_PERCENTAGE * SS.GAMES_PLAYED) IS NOT NULL THEN
                                ROUND(SUM(SS.FACEOFF_PERCENTAGE * SS.GAMES_PLAYED) / SUM(SS.GAMES_PLAYED), 2)
                            ELSE NULL END AS FACEOFF_PERCENTAGE

                        FROM Skater S
                        JOIN SkaterSeason SS ON S.SKATERID = SS.SKATERID
                        WHERE
                            TYPE = ?
                            AND SEASON >= ? AND SEASON <= ?
                            AND (? IS NULL OR S.POSITION = ?)
                            AND (? IS NULL OR SS.TEAM = ?)
                        GROUP BY {group_by_clause}
                    )
                    ORDER BY {order_clause}
                    LIMIT ?; """
                    ,( 
                        type,
                        first_season, last_season,
                        position, position,
                        team, team,
                        self.max_num_results ) 
                    )
            
        skater_data = data.fetchall()
        skater_stats = []

        for skater_season in skater_data:
            skater_season = NHL.SkaterSeason( 
                type=type,
                name=skater_season[0],
                season=skater_season[2] if first_season!=last_season else None,
                team=skater_season[3],
                games_played=skater_season[4],
                goals=skater_season[5],
                assists=skater_season[6],
                points=skater_season[7],
                plus_minus=skater_season[8] if skater_season[8] != None else '--',
                penalty_minutes=skater_season[9],
                powerplay_goals=skater_season[10] if skater_season[10] != None else '--',
                powerplay_points=skater_season[11] if skater_season[11] != None else '--',
                shorthanded_goals=skater_season[12] if skater_season[12] != None else '--',
                shorthanded_points=skater_season[13] if skater_season[13] != None else '--',
                time_on_ice_per_game=skater_season[14] if skater_season[14] != None else '--',
                game_winning_goals=skater_season[15],
                overtime_goals=skater_season[16],
                shots=skater_season[17] if skater_season[17] != None else '--',
                shooting_percentage=skater_season[18] if skater_season[18] != None else '--',
                faceoff_percentage=skater_season[19] if skater_season[19] != None else '--' )

            skater_stats.append( skater_season )
            
        cur.close()
        return skater_stats
    

    def get_goalie_stats_for_one_goalie( self, name, type, stat, multiplier ): 
        cur = self.conn.cursor()

        data = cur.execute( """ SELECT GOALIEID, TEAM, NUMBER, HEIGHT, WEIGHT, BIRTHDAY,
                                       HANDEDNESS, DRAFT_POSITION
                                       FROM Goalie
                                       WHERE NAME = ?; """, ( name, ) )

        goalie_data = data.fetchall()

        if stat == None:
            stat = 'season'
        stat = stat.replace( '-', '_' )

        if multiplier == 1 or multiplier == None:
            order_direction = 'DESC'
        else:
            order_direction = 'ASC'

        nullable_stats = ['ties', 'overtime_losses', 'shots_against', 'save_percentage', 'time_on_ice']
        if stat == 'time_on_ice':
            order_clause = f"""
                time_on_ice IS NULL,
                (
                    CAST(SUBSTR(time_on_ice, 1,
                        INSTR(time_on_ice, ':') - 1) AS INTEGER) * 60
                    +
                    CAST(SUBSTR(time_on_ice,
                        INSTR(time_on_ice, ':') + 1) AS INTEGER)
                ) {order_direction}
            """
        elif stat in nullable_stats:
            order_clause = f"""
                {stat} IS NULL,
                {stat} {order_direction}
            """
        else:
            order_clause = f"{stat} {order_direction}"
        
        goalies = []
        for goalie in goalie_data:
            goalie_id = goalie[0]
            curr_goalie = NHL.Goalie( name=name, team=goalie[1], number=goalie[2], height=goalie[3],
                                      weight=goalie[4], birthday=goalie[5], handedness=goalie[6],
                                      draft_position=goalie[7] )

            goalie_id = goalie[0]

            data = cur.execute(
                f""" SELECT
                        SEASON, TEAM, GAMES_PLAYED, GAMES_STARTED, WINS, LOSSES, TIES,
                        OVERTIME_LOSSES, SHOTS_AGAINST, GOALS_AGAINST_AVERAGE, SAVE_PERCENTAGE,
                        SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, TIME_ON_ICE
                    FROM
                        GoalieSeason 
                    WHERE
                        GOALIEID = ?
                        AND TYPE = ?
                    ORDER BY
                        {order_clause}; """,
                    ( goalie_id, type ) )
            
            season_data = data.fetchall()
            if type == 'Regular Season':
                for season in season_data:
                    curr_goalie.add_season(
                        season=season[0],
                        team=season[1],
                        games_played=season[2],
                        games_started=season[3],
                        wins=season[4],
                        losses=season[5], 
                        ties=season[6] if season[6] != None else '--',
                        overtime_losses=season[7] if season[7] != None else '--',
                        shots_against=season[8] if season[8] != None else '--',
                        goals_against_average=season[9],
                        save_percentage=season[10] if season[10] != None else '--',
                        shutouts=season[11],
                        goals=season[12],
                        assists=season[13], 
                        penalty_minutes=season[14],
                        time_on_ice=season[15] if season[15] != None else '--' )
            else:
                for season in season_data:
                    curr_goalie.add_playoffs(
                        season=season[0],
                        team=season[1],
                        games_played=season[2],
                        games_started=season[3],
                        wins=season[4],
                        losses=season[5], 
                        ties=season[6] if season[6] != None else '--',
                        overtime_losses=season[7] if season[7] != None else '--',
                        shots_against=season[8] if season[8] != None else '--',
                        goals_against_average=season[9],
                        save_percentage=season[10] if season[10] != None else '--',
                        shutouts=season[11],
                        goals=season[12],
                        assists=season[13], 
                        penalty_minutes=season[14],
                        time_on_ice=season[15] if season[15] != None else '--' )

            goalies.append( curr_goalie )
            
        cur.close()
        return goalies


    def get_goalie_stats( self, type, first_season, last_season, team, combine_seasons_on_different_teams,
                            sum_results_between_seasons, stat, multiplier ):
        cur = self.conn.cursor()

        if stat == None:
            stat = 'wins'
        stat = stat.replace( '-', '_' )

        if multiplier == 1 or multiplier == None:
            order_direction = 'DESC'
        else:
            order_direction = 'ASC'

        nullable_stats = ['ties', 'overtime_losses', 'shots_against', 'save_percentage', 'time_on_ice']

        if stat == 'time_on_ice':
            order_clause = f"""
                TIME_ON_ICE IS NULL,
                (
                    CAST(SUBSTR(TIME_ON_ICE, 1,
                        INSTR(TIME_ON_ICE, ':') - 1) AS INTEGER) * 60
                    +
                    CAST(SUBSTR(TIME_ON_ICE,
                        INSTR(TIME_ON_ICE, ':') + 1) AS INTEGER)
                ) {order_direction}
            """
        elif stat in nullable_stats:
            order_clause = f"""
                {stat} IS NULL,
                {stat} {order_direction}
            """
        else:
            order_clause = f"{stat} {order_direction}"

        if not combine_seasons_on_different_teams and not sum_results_between_seasons:
            data = cur.execute(
                f""" SELECT
                        NAME, SEASON, GoalieSeason.TEAM AS SEASON_TEAM, GAMES_PLAYED, GAMES_STARTED,
                        WINS, LOSSES, TIES, OVERTIME_LOSSES, SHOTS_AGAINST, GOALS_AGAINST_AVERAGE,
                        SAVE_PERCENTAGE, SHUTOUTS, GOALS, ASSISTS, PENALTY_MINUTES, TIME_ON_ICE
                    FROM
                        Goalie JOIN GoalieSeason ON Goalie.GOALIEID = GoalieSeason.GOALIEID 
                    WHERE
                        TYPE = ?
                        AND (? IS NULL OR GoalieSeason.TEAM = ?)
                        AND SEASON >= ? AND SEASON <= ?
                    ORDER BY
                        {order_clause}
                    LIMIT ?; """
                    ,( 
                        type,
                        team, team,
                        first_season, last_season,
                        self.max_num_results )
                    )
        else:
            if sum_results_between_seasons:
                group_by_clause = 'GS.GOALIEID'
            else:
                group_by_clause = 'GS.GOALIEID, GS.SEASON'

            data = cur.execute(
                f""" SELECT
                        NAME,
                        SEASON,
                        SEASON_TEAM,
                        GAMES_PLAYED,
                        GAMES_STARTED,
                        WINS,
                        LOSSES,
                        TIES,
                        OVERTIME_LOSSES,
                        SHOTS_AGAINST,
                        GOALS_AGAINST_AVERAGE,
                        SAVE_PERCENTAGE,
                        SHUTOUTS,
                        GOALS,
                        ASSISTS,
                        PENALTY_MINUTES,

                        -- Format total TOI in MM:SS
                        CAST(AVG_TOI_SECONDS / 60 AS INTEGER)
                            || ':' ||
                        printf('%02d', CAST(AVG_TOI_SECONDS % 60 AS INTEGER))
                            AS TIME_ON_ICE

                    FROM (
                        SELECT
                            NAME,

                            CASE
                                WHEN COUNT(DISTINCT GS.SEASON) > 1 THEN 'N/A'
                                ELSE MIN(GS.SEASON)
                            END AS SEASON,

                            CASE
                                WHEN COUNT(DISTINCT GS.SEASON) > 1 THEN 'N/A'
                                WHEN COUNT(DISTINCT GS.TEAM) > 1 THEN 'Multiple'
                                ELSE MIN(GS.TEAM)
                            END AS SEASON_TEAM,

                            SUM(GAMES_PLAYED) AS GAMES_PLAYED,
                            SUM(GAMES_STARTED) AS GAMES_STARTED,
                            SUM(WINS) AS WINS,
                            SUM(LOSSES) AS LOSSES,
                            SUM(TIES) AS TIES,
                            SUM(OVERTIME_LOSSES) AS OVERTIME_LOSSES,
                            SUM(SHOTS_AGAINST) AS SHOTS_AGAINST,

                            NULL AS GOALS_AGAINST_AVERAGE,
                            NULL AS SAVE_PERCENTAGE,

                            SUM(SHUTOUTS) AS SHUTOUTS,
                            SUM(GOALS) AS GOALS,
                            SUM(ASSISTS) AS ASSISTS,
                            SUM(PENALTY_MINUTES) AS PENALTY_MINUTES,

                            -- Total TOI in seconds
                            SUM(
                                CAST(SUBSTR(GS.TIME_ON_ICE,1,INSTR(GS.TIME_ON_ICE,':')-1) AS INTEGER) * 60
                                + CAST(SUBSTR(GS.TIME_ON_ICE,INSTR(GS.TIME_ON_ICE,':')+1) AS INTEGER)
                            ) AS AVG_TOI_SECONDS

                        FROM Goalie G
                        JOIN GoalieSeason GS ON G.GOALIEID = GS.GOALIEID
                        WHERE
                            TYPE = ?
                            AND SEASON >= ? AND SEASON <= ?
                            AND (? IS NULL OR GS.TEAM = ?)
                        GROUP BY {group_by_clause}
                    )
                    ORDER BY {order_clause}
                    LIMIT ?; """
                    ,( 
                        type,
                        first_season, last_season,
                        team, team,
                        self.max_num_results ) 
                    )

        goalie_data = data.fetchall()
        goalie_stats = []
    
        for goalie in goalie_data:
            goalie_season = NHL.GoalieSeason(
                type=type,
                name=goalie[0],
                season=goalie[1] if first_season!=last_season else None,
                team=goalie[2],
                games_played=goalie[3],
                games_started=goalie[4],
                wins=goalie[5],
                losses=goalie[6],
                ties=goalie[7] if goalie[7] != None else '--',
                overtime_losses=goalie[8] if goalie[8] != None else '--',
                shots_against=goalie[9] if goalie[9] != None else '--',
                goals_against_average=goalie[10] if goalie[10] != None else '--',
                save_percentage=goalie[11] if goalie[11] != None else '--',
                shutouts=goalie[12],
                goals=goalie[13],
                assists=goalie[14],
                penalty_minutes=goalie[15],
                time_on_ice=goalie[16] )

            goalie_stats.append( goalie_season )
            
        cur.close()
        return goalie_stats


    def get_standings_stats( self, season ):
        cur = self.conn.cursor()
        teams = []
        
        data = cur.execute(
            """ SELECT 
                    CITY, NAME, GAMES_PLAYED, WINS, LOSSES, TIES, OVERTIME_LOSSES, POINTS,
                    POINTS_PERCENTAGE, REGULATION_WINS, REGULATION_AND_OVERTIME_WINS,
                    GOALS_FOR, GOALS_AGAINST, GOAL_DIFFERENTIAL, HOME, AWAY, SHOOTOUT,
                    LAST_10, STREAK
                FROM
                    Team
                WHERE
                    TYPE = 'Regular Season'
                    AND SEASON = ?; """,
                    ( season, )
                )

        team_data = data.fetchall()
        teams = []

        for curr_team in team_data:
            team = NHL.Team(
                type=None,
                season=None,
                city=curr_team[0],
                name=curr_team[1],
                games_played=curr_team[2],
                wins=curr_team[3], 
                losses=curr_team[4],
                ties=curr_team[5] if curr_team[5] != None else '--',
                overtime_losses=curr_team[6] if curr_team[6] != None else '--', 
                points=curr_team[7],
                points_percentage=curr_team[8], 
                regulation_wins=curr_team[9] if curr_team[9] != None else '--', 
                regulation_and_overtime_wins=curr_team[10] if curr_team[10] != None else '--', 
                goals_for=curr_team[11],
                goals_against=curr_team[12], 
                goal_differential=curr_team[13],
                home=curr_team[14], 
                away=curr_team[15],
                shootout=curr_team[16],
                last_10=curr_team[17], 
                streak=curr_team[18],
                shootout_wins=None,
                goals_for_per_game=None, 
                goals_against_per_game=None,
                powerplay_percentage=None, 
                penalty_kill_percentage=None,
                net_powerplay_percentage=None,
                net_penalty_kill_percentage=None,
                faceoff_win_percentage=None )
            
            teams.append( team )
            
        cur.close()
        return teams
    

    def get_team_stats_for_one_season( self, type, season ): 
        cur = self.conn.cursor()

        data = cur.execute(
            f""" SELECT
                    CITY,
                    NAME,
                    GAMES_PLAYED,
                    WINS,
                    LOSSES,
                    TIES, 
                    OVERTIME_LOSSES,
                    POINTS,
                    POINTS_PERCENTAGE, 
                    REGULATION_WINS,
                    REGULATION_AND_OVERTIME_WINS, 
                    GOALS_FOR,
                    GOALS_AGAINST,
                    GOAL_DIFFERENTIAL, 
                    HOME,
                    AWAY,
                    SHOOTOUT,
                    LAST_10,
                    STREAK, 
                    SHOOTOUT_WINS,
                    GOALS_FOR_PER_GAME, 
                    GOALS_AGAINST_PER_GAME,
                    POWERPLAY_PERCENTAGE, 
                    PENALTY_KILL_PERCENTAGE,
                    NET_POWERPLAY_PERCENTAGE, 
                    NET_PENALTY_KILL_PERCENTAGE,
                    FACEOFF_WIN_PERCENTAGE
                FROM
                    Team 
                WHERE
                    TYPE = ?
                    AND SEASON = ?
                ORDER BY
                    POINTS, WINS, REGULATION_WINS DESC; """
                ,( 
                    type,
                    season ) 
                )
        
        team_data = data.fetchall()
        teams = []

        for curr_team in team_data:
            team = NHL.Team(
                type=None,
                season=None,
                city=curr_team[0],
                name=curr_team[1],
                games_played=curr_team[2],
                wins=curr_team[3],
                losses=curr_team[4],
                ties=curr_team[5] if curr_team[5]!=None else '--',
                overtime_losses=curr_team[6] if curr_team[6]!=None else '--',
                points=curr_team[7],
                points_percentage=curr_team[8], 
                regulation_wins=curr_team[9],
                regulation_and_overtime_wins=curr_team[10],
                goals_for=curr_team[11], 
                goals_against=curr_team[12],
                goal_differential=curr_team[13],
                home=curr_team[14] if curr_team[14] != None else '--', 
                away=curr_team[15] if curr_team[15] != None else '--',
                shootout=curr_team[16] if curr_team[16]!=None else '--',
                last_10=curr_team[17] if curr_team[17] != None else '--',
                streak=curr_team[18] if curr_team[18] != None else '--', 
                shootout_wins=curr_team[19] if curr_team[19]!=None else '--',
                goals_for_per_game=curr_team[20],
                goals_against_per_game=curr_team[21],
                powerplay_percentage=curr_team[22] if curr_team[22]!=None else '--',
                penalty_kill_percentage=curr_team[23] if curr_team[23]!=None else '--', 
                net_powerplay_percentage=curr_team[24] if curr_team[24]!=None else '--',
                net_penalty_kill_percentage=curr_team[25] if curr_team[25]!=None else '--', 
                faceoff_win_percentage=curr_team[26] if curr_team[26]!=None else '--' )

            teams.append( team )    
                
        return teams
    

    def get_team_stats_for_multiple_seasons( self, type, first_season, last_season, sum_results_between_seasons, stat, multiplier ): 
        cur = self.conn.cursor()

        if not sum_results_between_seasons:
            if stat == None:
                stat = 'points'
            stat = stat.replace( '-', '_' )

            if multiplier == 1 or multiplier == None:
                order_direction = 'DESC'
            else:
                order_direction = 'ASC'

            nullable_stats = ['ties', 'overtime_losses', 'home', 'away', 'shootout', 'last_10', 'streak', 'shootout_wins',
                                'powerplay_percentage', 'penalty_kill_percentage', 'net_powerplay_percentage',
                                'net_penalty_kill_percentage', 'faceoff_win_percentage']
            
            if stat == 'home':
                order_clause = f"""
                    HOME is NULL,
                        (
                            -- Wins
                            2 * CAST(
                                SUBSTR(HOME, 1, INSTR(HOME, '-') - 1)
                                AS INTEGER
                            )

                            +

                            -- OTL (always after second dash)
                            CAST(
                                SUBSTR(
                                    SUBSTR(HOME, INSTR(HOME, '-') + 1),
                                    INSTR(SUBSTR(HOME, INSTR(HOME, '-') + 1), '-') + 1,
                                    CASE
                                        WHEN LENGTH(HOME) - LENGTH(REPLACE(HOME, '-', '')) = 2
                                        THEN LENGTH(HOME)
                                        ELSE
                                            INSTR(
                                                SUBSTR(
                                                    SUBSTR(HOME, INSTR(HOME, '-') + 1),
                                                    INSTR(SUBSTR(HOME, INSTR(HOME, '-') + 1), '-') + 1
                                                ),
                                                '-'
                                            ) - 1
                                    END
                                )
                                AS INTEGER
                            )

                            +

                            -- Ties (only if present)
                            CASE
                                WHEN LENGTH(HOME) - LENGTH(REPLACE(HOME, '-', '')) = 3
                                THEN CAST(
                                    SUBSTR(
                                        HOME,
                                        INSTR(HOME, '-') 
                                        + INSTR(SUBSTR(HOME, INSTR(HOME, '-') + 1), '-')
                                        + INSTR(
                                            SUBSTR(
                                                SUBSTR(HOME, INSTR(HOME, '-') + 1),
                                                INSTR(SUBSTR(HOME, INSTR(HOME, '-') + 1), '-') + 1
                                            ),
                                            '-'
                                        )
                                        + 1
                                    )
                                    AS INTEGER
                                )
                                ELSE 0
                            END
                        ) {order_direction}
                    """
            elif stat == 'away':
                order_clause = f"""
                    AWAY is NULL,
                        (
                            -- Wins
                            2 * CAST(
                                SUBSTR(AWAY, 1, INSTR(AWAY, '-') - 1)
                                AS INTEGER
                            )

                            +

                            -- OTL (always after second dash)
                            CAST(
                                SUBSTR(
                                    SUBSTR(AWAY, INSTR(AWAY, '-') + 1),
                                    INSTR(SUBSTR(AWAY, INSTR(AWAY, '-') + 1), '-') + 1,
                                    CASE
                                        WHEN LENGTH(AWAY) - LENGTH(REPLACE(AWAY, '-', '')) = 2
                                        THEN LENGTH(AWAY)
                                        ELSE
                                            INSTR(
                                                SUBSTR(
                                                    SUBSTR(AWAY, INSTR(AWAY, '-') + 1),
                                                    INSTR(SUBSTR(AWAY, INSTR(AWAY, '-') + 1), '-') + 1
                                                ),
                                                '-'
                                            ) - 1
                                    END
                                )
                                AS INTEGER
                            )

                            +

                            -- Ties (only if present)
                            CASE
                                WHEN LENGTH(AWAY) - LENGTH(REPLACE(AWAY, '-', '')) = 3
                                THEN CAST(
                                    SUBSTR(
                                        AWAY,
                                        INSTR(AWAY, '-') 
                                        + INSTR(SUBSTR(AWAY, INSTR(AWAY, '-') + 1), '-')
                                        + INSTR(
                                            SUBSTR(
                                                SUBSTR(AWAY, INSTR(AWAY, '-') + 1),
                                                INSTR(SUBSTR(AWAY, INSTR(AWAY, '-') + 1), '-') + 1
                                            ),
                                            '-'
                                        )
                                        + 1
                                    )
                                    AS INTEGER
                                )
                                ELSE 0
                            END
                        ) {order_direction}
                    """
            elif stat == 'shootout':
                loss_sort_dir = 'ASC' if order_direction == 'DESC' else 'DESC'

                order_clause = f"""
                    SHOOTOUT IS NULL,
                        CASE
                            WHEN
                                CAST(SUBSTR(SHOOTOUT, 1, INSTR(SHOOTOUT, '-') - 1) AS INTEGER)
                                +
                                CAST(SUBSTR(SHOOTOUT, INSTR(SHOOTOUT, '-') + 1) AS INTEGER)
                                = 0
                            THEN 0
                            ELSE
                                CAST(SUBSTR(SHOOTOUT, 1, INSTR(SHOOTOUT, '-') - 1) AS REAL)
                                /
                                (
                                    CAST(SUBSTR(SHOOTOUT, 1, INSTR(SHOOTOUT, '-') - 1) AS REAL)
                                    +
                                    CAST(SUBSTR(SHOOTOUT, INSTR(SHOOTOUT, '-') + 1) AS REAL)
                                )
                        END {order_direction},

                        CAST(SUBSTR(SHOOTOUT, 1, INSTR(SHOOTOUT, '-') - 1) AS INTEGER) {order_direction},

                        CAST(SUBSTR(SHOOTOUT, INSTR(SHOOTOUT, '-') + 1) AS INTEGER) {loss_sort_dir}
                    """
            elif stat == 'last_10':
                order_clause = f"""
                    LAST_10 is NULL,
                        (
                            -- Wins
                            2 * CAST(
                                SUBSTR(LAST_10, 1, INSTR(LAST_10, '-') - 1)
                                AS INTEGER
                            )

                            +

                            -- OTL (always after second dash)
                            CAST(
                                SUBSTR(
                                    SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1),
                                    INSTR(SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1), '-') + 1,
                                    CASE
                                        WHEN LENGTH(LAST_10) - LENGTH(REPLACE(LAST_10, '-', '')) = 2
                                        THEN LENGTH(LAST_10)
                                        ELSE
                                            INSTR(
                                                SUBSTR(
                                                    SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1),
                                                    INSTR(SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1), '-') + 1
                                                ),
                                                '-'
                                            ) - 1
                                    END
                                )
                                AS INTEGER
                            )

                            +

                            -- Ties (only if present)
                            CASE
                                WHEN LENGTH(LAST_10) - LENGTH(REPLACE(LAST_10, '-', '')) = 3
                                THEN CAST(
                                    SUBSTR(
                                        LAST_10,
                                        INSTR(LAST_10, '-') 
                                        + INSTR(SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1), '-')
                                        + INSTR(
                                            SUBSTR(
                                                SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1),
                                                INSTR(SUBSTR(LAST_10, INSTR(LAST_10, '-') + 1), '-') + 1
                                            ),
                                            '-'
                                        )
                                        + 1
                                    )
                                    AS INTEGER
                                )
                                ELSE 0
                            END
                        ) {order_direction}
                    """
            elif stat == 'streak':
                order_clause = f"""
                    STREAK IS NULL,

                    -- Letter rank: W > T > OT > L
                    CASE 
                        WHEN SUBSTR(STREAK, 1, 2) = 'OT' THEN 2
                        WHEN SUBSTR(STREAK, 1, 1) = 'W' THEN 4
                        WHEN SUBSTR(STREAK, 1, 1) = 'T' THEN 3
                        WHEN SUBSTR(STREAK, 1, 1) = 'L' THEN 1
                        ELSE 0
                    END {order_direction},

                    -- Numeric part: higher N better only for W, lower N better for T/OT/L
                    CASE
                        WHEN SUBSTR(STREAK, 1, 1) = 'W' THEN CAST(SUBSTR(STREAK, 2) AS INTEGER)
                        WHEN SUBSTR(STREAK, 1, 1) = 'T' THEN -CAST(SUBSTR(STREAK, 2) AS INTEGER)
                        WHEN SUBSTR(STREAK, 1, 2) = 'OT' THEN -CAST(SUBSTR(STREAK, 3) AS INTEGER)
                        WHEN SUBSTR(STREAK, 1, 1) = 'L' THEN -CAST(SUBSTR(STREAK, 2) AS INTEGER)
                        ELSE 0
                    END {order_direction}
                """
            elif stat in nullable_stats:
                order_clause = f"""
                    {stat} IS NULL,
                    {stat} {order_direction}
                """
            else:
                order_clause = f"{stat} {order_direction}"

            data = cur.execute(
                f""" SELECT
                        SEASON,
                        CITY,
                        NAME,
                        GAMES_PLAYED,
                        WINS,
                        LOSSES,
                        TIES, 
                        OVERTIME_LOSSES,
                        POINTS,
                        POINTS_PERCENTAGE, 
                        REGULATION_WINS,
                        REGULATION_AND_OVERTIME_WINS, 
                        GOALS_FOR,
                        GOALS_AGAINST,
                        GOAL_DIFFERENTIAL, 
                        HOME,
                        AWAY,
                        SHOOTOUT,
                        LAST_10,
                        STREAK, 
                        SHOOTOUT_WINS,
                        GOALS_FOR_PER_GAME, 
                        GOALS_AGAINST_PER_GAME,
                        POWERPLAY_PERCENTAGE, 
                        PENALTY_KILL_PERCENTAGE,
                        NET_POWERPLAY_PERCENTAGE, 
                        NET_PENALTY_KILL_PERCENTAGE,
                        FACEOFF_WIN_PERCENTAGE
                    FROM
                        Team 
                    WHERE
                        TYPE = ?
                        AND SEASON >= ? AND SEASON <= ?
                    ORDER BY
                        {order_clause}
                    LIMIT ?; """
                    ,( 
                        type,
                        first_season, last_season,
                        self.max_num_results ) 
                    )
        else:
                data = cur.execute(
                f""" SELECT
                        SEASON,
                        CITY,
                        NAME,
                        GAMES_PLAYED,
                        WINS,
                        LOSSES,
                        TIES, 
                        OVERTIME_LOSSES,
                        POINTS,
                        POINTS_PERCENTAGE, 
                        REGULATION_WINS,
                        REGULATION_AND_OVERTIME_WINS, 
                        GOALS_FOR,
                        GOALS_AGAINST,
                        GOAL_DIFFERENTIAL, 
                        HOME,
                        AWAY,
                        SHOOTOUT,
                        LAST_10,
                        STREAK, 
                        SHOOTOUT_WINS,
                        GOALS_FOR_PER_GAME, 
                        GOALS_AGAINST_PER_GAME,
                        POWERPLAY_PERCENTAGE, 
                        PENALTY_KILL_PERCENTAGE,
                        NET_POWERPLAY_PERCENTAGE, 
                        NET_PENALTY_KILL_PERCENTAGE,
                        FACEOFF_WIN_PERCENTAGE
                    FROM
                        Team 
                    WHERE
                        TYPE = ?
                        AND SEASON >= ? AND SEASON <= ?; """
                    ,( 
                        type,
                        first_season, last_season, ) 
                    )

        
        team_data = data.fetchall()
        teams = []

        for curr_team in team_data:
            team = NHL.Team(
                type=None,
                season=curr_team[0] if first_season != last_season else None,
                city=curr_team[1],
                name=curr_team[2],
                games_played=curr_team[3],
                wins=curr_team[4],
                losses=curr_team[5],
                ties=curr_team[6] if curr_team[6]!=None else '--',
                overtime_losses=curr_team[7] if curr_team[7]!=None else '--',
                points=curr_team[8],
                points_percentage=curr_team[9], 
                regulation_wins=curr_team[10],
                regulation_and_overtime_wins=curr_team[11],
                goals_for=curr_team[12], 
                goals_against=curr_team[13],
                goal_differential=curr_team[14],
                home=curr_team[15] if curr_team[15] != None else '--', 
                away=curr_team[16] if curr_team[16] != None else '--',
                shootout=curr_team[17] if curr_team[17]!=None else '--',
                last_10=curr_team[18] if curr_team[18] != None else '--',
                streak=curr_team[19] if curr_team[19] != None else '--', 
                shootout_wins=curr_team[20] if curr_team[20]!=None else '--',
                goals_for_per_game=curr_team[21],
                goals_against_per_game=curr_team[22],
                powerplay_percentage=curr_team[23] if curr_team[23]!=None else '--',
                penalty_kill_percentage=curr_team[24] if curr_team[24]!=None else '--', 
                net_powerplay_percentage=curr_team[25] if curr_team[25]!=None else '--',
                net_penalty_kill_percentage=curr_team[26] if curr_team[26]!=None else '--', 
                faceoff_win_percentage=curr_team[27] if curr_team[27]!=None else '--' )

            teams.append( team )    
                
        return teams
    

    def get_team_stats_for_one_team( self, type, team ): 
        cur = self.conn.cursor()

        city = self.nhl_util.get_city( team )
        name = self.nhl_util.get_name( team )

        data = cur.execute(
            f""" SELECT
                    SEASON,
                    GAMES_PLAYED,
                    WINS,
                    LOSSES,
                    TIES, 
                    OVERTIME_LOSSES,
                    POINTS,
                    POINTS_PERCENTAGE, 
                    REGULATION_WINS,
                    REGULATION_AND_OVERTIME_WINS, 
                    GOALS_FOR,
                    GOALS_AGAINST,
                    GOAL_DIFFERENTIAL, 
                    HOME,
                    AWAY,
                    SHOOTOUT,
                    LAST_10,
                    STREAK, 
                    SHOOTOUT_WINS,
                    GOALS_FOR_PER_GAME, 
                    GOALS_AGAINST_PER_GAME,
                    POWERPLAY_PERCENTAGE, 
                    PENALTY_KILL_PERCENTAGE,
                    NET_POWERPLAY_PERCENTAGE, 
                    NET_PENALTY_KILL_PERCENTAGE,
                    FACEOFF_WIN_PERCENTAGE
                FROM
                    Team 
                WHERE
                    TYPE = ?
                    AND CITY = ?
                    AND NAME = ?
                ORDER BY
                    POINTS, WINS, REGULATION_WINS DESC; """
                ,( 
                    type,
                    city,
                    name ) 
                )
        
        team_data = data.fetchall()
        teams = []

        for curr_team in team_data:
            team = NHL.Team(
                type=None,
                season=curr_team[0],
                city=None,
                name=None,
                games_played=curr_team[1],
                wins=curr_team[2],
                losses=curr_team[3],
                ties=curr_team[4] if curr_team[4]!=None else '--',
                overtime_losses=curr_team[5] if curr_team[5]!=None else '--',
                points=curr_team[6],
                points_percentage=curr_team[7], 
                regulation_wins=curr_team[8],
                regulation_and_overtime_wins=curr_team[9],
                goals_for=curr_team[10], 
                goals_against=curr_team[11],
                goal_differential=curr_team[12],
                home=curr_team[13] if curr_team[13] != None else '--', 
                away=curr_team[14] if curr_team[14] != None else '--',
                shootout=curr_team[15] if curr_team[15]!=None else '--',
                last_10=curr_team[16] if curr_team[16] != None else '--',
                streak=curr_team[17] if curr_team[17] != None else '--', 
                shootout_wins=curr_team[18] if curr_team[18]!=None else '--',
                goals_for_per_game=curr_team[19],
                goals_against_per_game=curr_team[20],
                powerplay_percentage=curr_team[21] if curr_team[21]!=None else '--',
                penalty_kill_percentage=curr_team[22] if curr_team[22]!=None else '--', 
                net_powerplay_percentage=curr_team[23] if curr_team[23]!=None else '--',
                net_penalty_kill_percentage=curr_team[24] if curr_team[24]!=None else '--', 
                faceoff_win_percentage=curr_team[25] if curr_team[25]!=None else '--' )

            teams.append( team )    
                
        return teams


    def clear_database( self ):
        cur = self.conn.cursor()

        cur.execute( "DELETE * FROM Skater;" )
        cur.execute( "DELETE * FROM SkaterSeason;" )
        cur.execute( "DELETE * FROM Goalie;" )
        cur.execute( "DELETE * FROM GoalieSeason;" )
        cur.execute( "DELETE * FROM Team;" )

        self.conn.commit()


    def close( self ):
        self.conn.commit()
        self.conn.close()
    

    def reset( self ):
        if os.path.exists( 'stats.db' ):
            os.remove( 'stats.db' )

        self.conn = sqlite3.connect( 'stats.db' )
        self.createDB()

################################################################################