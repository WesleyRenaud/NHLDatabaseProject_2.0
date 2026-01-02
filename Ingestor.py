import unicodedata
import requests, time
from nhlpy import NHLClient

import Database, NHL

class Ingestor:
    database = Database.Database()
    nhl_util = NHL.NHLUtil()    
        

    def get_all_skater_data( self ):
        # Get all the season data
        url = 'https://api.nhle.com/stats/rest/en/skater/summary'
        skaters = []
        for year in range( 1917, 2026 ):
            season = f'{year}{year + 1}'

            for season_type in range( 2, 4 ): # 2 = regular season, 3 = playoffs
                params = {
                    'cayenneExp': f'seasonId={season} and gameTypeId={season_type}',
                    'limit': -1  # request all rows
                }

                response = requests.get( url, params=params )
                response.raise_for_status()

                data = response.json().get( 'data', [] )
                time.sleep( 0.1 )

                if season_type == 2:
                    season_type_string = 'Regular Season'
                else:
                    season_type_string = 'Playoffs'

                print( f'Fetched {len( data )} skater records for the {season} {season_type_string}' )

                for skater in data:
                    if not any( s.id == skater['playerId'] for s in skaters ):
                        skaters.append( NHL.Skater(
                            name = skater['skaterFullName'],
                            team = None,
                            number = None,
                            position = skater['positionCode'],
                            height = None,
                            weight = None,
                            birthday = None,
                            handedness = skater['shootsCatches'] if skater['shootsCatches'] != None else '--',
                            draft_position = None,
                            id = skater['playerId']
                        ) )

                    curr_skater = next( (s for s in skaters if s.id == skater['playerId']), None )
                    curr_skater.add_season(
                        type = season_type_string,
                        season = f'{season[:4]}-{season[4:]}',
                        team = self.nhl_util.get_full_team_name_from_abbreviation( skater['teamAbbrevs'] ),
                        games_played = skater['gamesPlayed'],
                        goals = skater['goals'],
                        assists = skater['assists'],
                        points = skater['points'],
                        plus_minus = skater['plusMinus'],
                        penalty_minutes = skater['penaltyMinutes'],
                        powerplay_goals = skater['ppGoals'],
                        powerplay_points = skater['ppPoints'],
                        shorthanded_goals = skater['shGoals'],
                        shorthanded_points = skater['shPoints'],
                        time_on_ice_per_game = (
                            f"{int(skater['timeOnIcePerGame']) // 60}:"
                            f"{int(skater['timeOnIcePerGame']) % 60:02d}"
                            if skater['timeOnIcePerGame'] != None
                            else None
                        ),
                        game_winning_goals = skater['gameWinningGoals'],
                        overtime_goals = skater['otGoals'],
                        shots = skater['shots'],
                        shooting_percentage = skater['shootingPct'] * 100 if skater['shootingPct'] != None else None,
                        faceoff_percentage = skater['faceoffWinPct'] * 100 if skater['faceoffWinPct'] != None else None
                    )                  
        # Get the prolific data for the players
        i = 0
        client = NHLClient()
        for skater in skaters:
            profile = client.stats.player_career_stats( player_id=skater.id )
            try:
                skater.team = profile['teamName']
            except:
                skater.team = 'N/A'

            try:
                skater.number = profile['sweaterNumber']
            except:
                skater.number = None

            try:
                skater.height = f"{profile['heightInInches'] // 12}'{profile['heightInInches'] % 12}\""
            except:
                skater.height = '--'

            try:
                skater.weight = f"{profile['weightInPounds']} lb"
            except:
                skater.weight = '--'

            skater.birthday = profile['birthDate']

            # Draft position
            try:
                draft_year = int( profile['DraftYear'] )
                draft_team = profile['DraftTeam']
                draft_overall = int( profile['Overall'] )
                draft_round = int( profile['Round'] )
                draft_pick = int( profile['Pick'] )

                draft_position = (
                    f'{draft_year}, {draft_team} '
                    f'({self.nhl_util.ordinal( draft_overall )} overall), '
                    f'{self.nhl_util.ordinal( draft_round )} round, '
                    f'{self.nhl_util.ordinal( draft_pick )} pick'
                )
                skater.draft_position = draft_position
            except:
                skater.draft_position = 'Undrafted'

            # Add the skater into the database
            self.database.add_skater( skater )

            i += 1
            if i % 100 == 0:
                print( f'Inserted {i} skaters' )


    def get_current_season_skater_data( self, curr_season ):
        # Get all the season data
        url = 'https://api.nhle.com/stats/rest/en/skater/summary'
        skaters = []

        for season_type in range( 2, 4 ): # 2 = regular season, 3 = playoffs
            params = {
                'cayenneExp': f'seasonId={curr_season} and gameTypeId={season_type}',
                'limit': -1  # request all rows
            }

            response = requests.get( url, params=params )
            response.raise_for_status()

            data = response.json().get( 'data', [] )
            time.sleep( 0.1 )

            if season_type == 2:
                season_type_string = 'Regular Season'
            else:
                season_type_string = 'Playoffs'

            print( f'Fetched {len( data )} skater records for the {curr_season} {season_type_string}' )

            for skater in data:
                if not any( s.id == skater['playerId'] for s in skaters ):
                    skaters.append( NHL.Skater(
                        name = skater['skaterFullName'],
                        team = None,
                        number = None,
                        position = skater['positionCode'],
                        height = None,
                        weight = None,
                        birthday = None,
                        handedness = skater['shootsCatches'] if skater['shootsCatches'] != None else '--',
                        draft_position = None,
                        id = skater['playerId']
                    ) )

                curr_skater = next( (s for s in skaters if s.id == skater['playerId']), None )
                curr_skater.add_season(
                    type = season_type_string,
                    season = f'{curr_season[:4]}-{curr_season[4:]}',
                    team = self.nhl_util.get_full_team_name_from_abbreviation( skater['teamAbbrevs'] ),
                    games_played = skater['gamesPlayed'],
                    goals = skater['goals'],
                    assists = skater['assists'],
                    points = skater['points'],
                    plus_minus = skater['plusMinus'],
                    penalty_minutes = skater['penaltyMinutes'],
                    powerplay_goals = skater['ppGoals'],
                    powerplay_points = skater['ppPoints'],
                    shorthanded_goals = skater['shGoals'],
                    shorthanded_points = skater['shPoints'],
                    time_on_ice_per_game = (
                        f"{int(skater['timeOnIcePerGame']) // 60}:"
                        f"{int(skater['timeOnIcePerGame']) % 60:02d}"
                        if skater['timeOnIcePerGame'] != None
                        else None
                    ),
                    game_winning_goals = skater['gameWinningGoals'],
                    overtime_goals = skater['otGoals'],
                    shots = skater['shots'],
                    shooting_percentage = skater['shootingPct'] * 100 if skater['shootingPct'] != None else None,
                    faceoff_percentage = skater['faceoffWinPct'] * 100 if skater['faceoffWinPct'] != None else None
                )

        # Get the prolific data for the players
        i = 0
        client = NHLClient()
        for skater in skaters:
            profile = client.stats.player_career_stats( player_id=skater.id )
            try:
                skater.team = profile['teamName']
            except:
                skater.team = 'N/A'

            try:
                skater.number = profile['sweaterNumber']
            except:
                skater.number = None

            try:
                skater.height = f"{profile['heightInInches'] // 12}'{profile['heightInInches'] % 12}\""
            except:
                skater.height = '--'

            try:
                skater.weight = f"{profile['weightInPounds']} lb"
            except:
                skater.weight = '--'

            skater.birthday = profile['birthDate']

            # Draft position
            try:
                draft_year = int( profile['DraftYear'] )
                draft_team = profile['DraftTeam']
                draft_overall = int( profile['Overall'] )
                draft_round = int( profile['Round'] )
                draft_pick = int( profile['Pick'] )

                draft_position = (
                    f'{draft_year}, {draft_team} '
                    f'({self.nhl_util.ordinal( draft_overall )} overall), '
                    f'{self.nhl_util.ordinal( draft_round )} round, '
                    f'{self.nhl_util.ordinal( draft_pick )} pick'
                )
                skater.draft_position = draft_position
            except:
                skater.draft_position = 'Undrafted'

            # Add the skater into the database
            self.database.add_skater( skater )

            i += 1
            if i % 100 == 0:
                print( f'Inserted {i} skaters' )


    def get_all_goalie_data( self ):
        # Get all the season data
        url = 'https://api.nhle.com/stats/rest/en/goalie/summary'
        goalies = []
        for year in range( 1917, 2026 ):
            season = f'{year}{year + 1}'

            for season_type in range( 2, 4 ): # 2 = regular season, 3 = playoffs
                params = {
                    'cayenneExp': f'seasonId={season} and gameTypeId={season_type}',
                    'limit': -1  # request all rows
                }

                response = requests.get( url, params=params )
                response.raise_for_status()

                data = response.json().get( 'data', [] )
                time.sleep( 0.1 )

                if season_type == 2:
                    season_type_string = 'Regular Season'
                else:
                    season_type_string = 'Playoffs'

                print( f'Fetched {len( data )} goalie records for the {season} {season_type_string}' )

                for goalie in data:
                    if not any( g.id == goalie['playerId'] for g in goalies ):
                        goalies.append( NHL.Goalie(
                            name = goalie['goalieFullName'],
                            team = None,
                            number = None,
                            height = None,
                            weight = None,
                            birthday = None,
                            handedness = goalie['shootsCatches'] if goalie['shootsCatches'] != None else '--',
                            draft_position = None,
                            id = goalie['playerId']
                        ) )

                    curr_goalie = next( (g for g in goalies if g.id == goalie['playerId']), None )
                    curr_goalie.add_season(
                        type = season_type_string,
                        season = f'{season[:4]}-{season[4:]}',
                        team = self.nhl_util.get_full_team_name_from_abbreviation( goalie['teamAbbrevs'] ),
                        games_played = goalie['gamesPlayed'],
                        games_started = goalie['gamesStarted'],
                        wins = goalie['wins'],
                        losses = goalie['losses'],
                        ties = goalie['ties'],
                        overtime_losses = goalie['otLosses'],
                        shots_against = goalie['shotsAgainst'],
                        goals_against_average = goalie['goalsAgainstAverage'],
                        save_percentage = goalie['savePct'],
                        shutouts = goalie['shutouts'],
                        goals = goalie['goals'],
                        assists = goalie['assists'],
                        penalty_minutes = goalie['penaltyMinutes'],
                        time_on_ice = f"{goalie['timeOnIce'] // 60}:{goalie['timeOnIce'] % 60:02d}"
                    )
                
        # Get the prolific data for the players
        i = 0
        client = NHLClient()
        for goalie in goalies:
            profile = client.stats.player_career_stats( player_id=goalie.id )

            try:
                goalie.team = profile['teamName']
            except:
                goalie.team = 'N/A'

            try:
                goalie.number = profile['sweaterNumber']
            except:
                goalie.number = None

            try:
                goalie.height = f"{profile['heightInInches'] // 12}'{profile['heightInInches'] % 12}\""
            except:
                goalie.height = '--'

            try:
                goalie.weight = f"{profile['weightInPounds']} lb"
            except:
                goalie.weight = '--'
                
            goalie.birthday = profile['birthDate']

            # Draft position
            try:
                draft_year = int( profile['DraftYear'] )
                draft_team = profile['DraftTeam']
                draft_overall = int( profile['Overall'] )
                draft_round = int( profile['Round'] )
                draft_pick = int( profile['Pick'] )

                draft_position = (
                    f'{draft_year}, {draft_team} '
                    f'({self.nhl_util.ordinal( draft_overall )} overall), '
                    f'{self.nhl_util.ordinal( draft_round )} round, '
                    f'{self.nhl_util.ordinal( draft_pick )} pick'
                )
                goalie.draft_position = draft_position
            except:
                goalie.draft_position = 'Undrafted'

            # Add the skater into the database
            self.database.add_goalie( goalie )

            i += 1
            if i % 100 == 0:
                print( f'Inserted {i} goalies' )


    def get_current_season_goalie_data( self, curr_season ):
        # Get all the season data
        url = 'https://api.nhle.com/stats/rest/en/goalie/summary'
        goalies = []

        for season_type in range( 2, 4 ): # 2 = regular season, 3 = playoffs
            params = {
                'cayenneExp': f'seasonId={curr_season} and gameTypeId={season_type}',
                'limit': -1  # request all rows
            }

            response = requests.get( url, params=params )
            response.raise_for_status()

            data = response.json().get( 'data', [] )
            time.sleep( 0.1 )

            if season_type == 2:
                season_type_string = 'Regular Season'
            else:
                season_type_string = 'Playoffs'

            print( f'Fetched {len( data )} goalie records for the {curr_season} {season_type_string}' )

            for goalie in data:
                if not any( g.id == goalie['playerId'] for g in goalies ):
                    goalies.append( NHL.Goalie(
                        name = goalie['goalieFullName'],
                        team = None,
                        number = None,
                        height = None,
                        weight = None,
                        birthday = None,
                        handedness = goalie['shootsCatches'] if goalie['shootsCatches'] != None else '--',
                        draft_position = None,
                        id = goalie['playerId']
                    ) )

                curr_goalie = next( (g for g in goalies if g.id == goalie['playerId']), None )
                curr_goalie.add_season(
                    type = season_type_string,
                    season = f'{curr_season[:4]}-{curr_season[4:]}',
                    team = self.nhl_util.get_full_team_name_from_abbreviation( goalie['teamAbbrevs'] ),
                    games_played = goalie['gamesPlayed'],
                    games_started = goalie['gamesStarted'],
                    wins = goalie['wins'],
                    losses = goalie['losses'],
                    ties = goalie['ties'],
                    overtime_losses = goalie['otLosses'],
                    shots_against = goalie['shotsAgainst'],
                    goals_against_average = goalie['goalsAgainstAverage'],
                    save_percentage = goalie['savePct'],
                    shutouts = goalie['shutouts'],
                    goals = goalie['goals'],
                    assists = goalie['assists'],
                    penalty_minutes = goalie['penaltyMinutes'],
                    time_on_ice = f"{goalie['timeOnIce'] // 60}:{goalie['timeOnIce'] % 60:02d}"
                )
                    
        # Get the prolific data for the players
        i = 0
        client = NHLClient()
        for goalie in goalies:
            profile = client.stats.player_career_stats( player_id=goalie.id )

            try:
                goalie.team = profile['teamName']
            except:
                goalie.team = 'N/A'

            try:
                goalie.number = profile['sweaterNumber']
            except:
                goalie.number = None

            try:
                goalie.height = f"{profile['heightInInches'] // 12}'{profile['heightInInches'] % 12}\""
            except:
                goalie.height = '--'

            try:
                goalie.weight = f"{profile['weightInPounds']} lb"
            except:
                goalie.weight = '--'
                
            goalie.birthday = profile['birthDate']

            # Draft position
            try:
                draft_year = int( profile['DraftYear'] )
                draft_team = profile['DraftTeam']
                draft_overall = int( profile['Overall'] )
                draft_round = int( profile['Round'] )
                draft_pick = int( profile['Pick'] )

                draft_position = (
                    f'{draft_year}, {draft_team} '
                    f'({self.nhl_util.ordinal( draft_overall )} overall), '
                    f'{self.nhl_util.ordinal( draft_round )} round, '
                    f'{self.nhl_util.ordinal( draft_pick )} pick'
                )
                goalie.draft_position = draft_position
            except:
                goalie.draft_position = 'Undrafted'

            # Add the skater into the database
            self.database.add_goalie( goalie )

            i += 1
            if i % 100 == 0:
                print( f'Inserted {i} goalies' )


    def get_all_team_data( self ):
        # Regular season data
        client = NHLClient()
        for year in range( 1917, 2026 ):
            season = f'{year}{year + 1}'

            regular_season_teams = []
            if season != '20042005':
                data = client.standings.league_standings( season=season )

                print( f"Fetched {len( data['standings'] )} teams records for the {season} Regular Season" )

                for team in data['standings']:
                    team_name = team['teamName']['default'].split( '(' )[0].strip()
                    team_name = ''.join(
                        c for c in unicodedata.normalize( 'NFD', team_name )
                        if unicodedata.category( c ) != 'Mn'
                    )

                    curr_team = NHL.Team(
                        type = 'Regular Season',                    
                        season = f"{str( team['seasonId'] )[:4]}-{str( team['seasonId'] )[4:]}",
                        team_name = team_name,
                        games_played = team['gamesPlayed'],
                        wins = team['wins'],
                        losses = team['losses'],
                        ties = team['ties'],
                        overtime_losses = team['otLosses'],
                        points = team['points'],
                        points_percentage = team['pointPctg'],
                        regulation_wins = team['regulationWins'],
                        regulation_and_overtime_wins = team['regulationPlusOtWins'],
                        goals_for = team['goalFor'],
                        goals_against = team['goalAgainst'],
                        goal_differential = team['goalFor'] - team['goalAgainst'],

                        # Home and away records as "W-L-OT"
                        home = f"{team['homeWins']}-{team['homeLosses']}-{team['homeOtLosses']}",
                        away = f"{team['roadWins']}-{team['roadLosses']}-{team['roadOtLosses']}",
                        shootout = f"{team['shootoutWins']}-{team['shootoutLosses']}" if team['shootoutWins'] != None else None,

                        # Last 10 games as "W-L-OT"
                        last_10 = f"{team['l10Wins']}-{team['l10Losses']}-{team['l10OtLosses']}",

                        # Streak
                        streak = f"{team['streakCode']}{team['streakCount']}",

                        shootout_wins = team['shootoutWins'],
                        goals_for_per_game = team['goalFor'] / team['gamesPlayed'],
                        goals_against_per_game = team['goalAgainst'] / team['gamesPlayed'],

                        # Special teams percentages
                        powerplay_percentage = team.get( 'powerPlayPct' ) or None,
                        penalty_kill_percentage = team.get( 'penaltyKillPct' ) or None,
                        net_powerplay_percentage = team.get ( 'powerPlayNetPct' ) or None,
                        net_penalty_kill_percentage = team.get( 'penaltyKillNetPct' ) or None,
                        faceoff_win_percentage = team.get( 'faceoffWinPct' ) or None,
                        id = f"{season}{team['teamAbbrev']}"
                    )

                    regular_season_teams.append( curr_team )

                # Special teams data
                special_teams_url = 'https://api.nhle.com/stats/rest/en/team/summary'
                params = {
                    'cayenneExp': f'seasonId={season} and gameTypeId=2',
                    'limit': -1  # request all rows
                }

                response = requests.get( special_teams_url, params=params )
                response.raise_for_status()

                data = response.json().get( 'data', [] )
                time.sleep( 0.1 )

                for team in data:
                    team_name = team['teamFullName'].split( '(' )[0].strip()
                    team_name = ''.join(
                        c for c in unicodedata.normalize( 'NFD', team_name )
                        if unicodedata.category( c ) != 'Mn'
                    )
                    season = f"{str( team['seasonId'] )[:4]}-{str( team['seasonId'] )[4:]}"

                    curr_team = next( (t for t in regular_season_teams if t.team_name == team_name and t.season == season), None )

                    curr_team.powerplay_percentage = team['powerPlayPct'] * 100 if team['powerPlayPct'] != None else None
                    curr_team.penalty_kill_percentage = team['penaltyKillPct'] * 100 if team['penaltyKillPct'] != None else None
                    curr_team.net_powerplay_percentage = team['powerPlayNetPct'] * 100 if team['powerPlayNetPct'] != None else None
                    curr_team.net_penalty_kill_percentage = team['penaltyKillNetPct'] * 100 if team['penaltyKillNetPct'] != None else None
                    curr_team.faceoff_win_percentage = team['faceoffWinPct'] * 100 if team['faceoffWinPct'] != None else None

                    self.database.add_team( curr_team )

        # Playoffs data
        summary_url = 'https://api.nhle.com/stats/rest/en/team/summary'
        for year in range( 1917, 2026 ):
            season = f'{year}{year + 1}'

            params = {
                'cayenneExp': f'seasonId={season} and gameTypeId=3',
                'limit': -1  # request all rows
            }

            response = requests.get( summary_url, params=params )
            response.raise_for_status()

            data = response.json().get( 'data', [] )
            time.sleep( 0.1 )

            print( f"Fetched {len( data )} team records for the {season} 'Playoffs'" )

            for team in data:
                team_name = team['teamFullName'].split( '(' )[0].strip()
                team_name = ''.join(
                    c for c in unicodedata.normalize( 'NFD', team_name )
                    if unicodedata.category( c ) != 'Mn'
                )

                curr_team = NHL.Team(
                    type = 'Playoffs',
                    season = f"{str( team['seasonId'] )[:4]}-{str( team['seasonId'] )[4:]}",
                    team_name = team_name,
                    games_played = team['gamesPlayed'],
                    wins = team['wins'],
                    losses = team['losses'],
                    ties = team['ties'],
                    overtime_losses = team['otLosses'],
                    points = team['points'],
                    points_percentage = team['pointPct'],
                    regulation_wins = team['winsInRegulation'],
                    regulation_and_overtime_wins = team['regulationAndOtWins'],
                    goals_for = team['goalsFor'],
                    goals_against = team['goalsAgainst'],
                    goal_differential = team['goalsFor'] - team['goalsAgainst'],
                    home = None,
                    away = None,
                    shootout = None,
                    last_10 = None,
                    streak = None,
                    shootout_wins = team['winsInShootout'],
                    goals_for_per_game = team['goalsForPerGame'],
                    goals_against_per_game = team['goalsAgainstPerGame'],
                    powerplay_percentage = team['powerPlayPct'] * 100 if team['powerPlayPct'] != None else None,
                    penalty_kill_percentage = team['penaltyKillPct'] * 100 if team['penaltyKillPct'] != None else None,
                    net_powerplay_percentage = team['powerPlayNetPct'] * 100 if team['powerPlayNetPct'] != None else None,
                    net_penalty_kill_percentage = team['penaltyKillNetPct'] * 100 if team['penaltyKillNetPct'] != None else None,
                    faceoff_win_percentage = team['faceoffWinPct'] * 100 if team['faceoffWinPct'] != None else None,
                    id = f"{season}{team['teamId']}"
                )

                self.database.add_team( curr_team )


    def get_current_season_team_data( self, curr_season ):
        season = f"{curr_season[:4]}-{curr_season[4:]}"
        
        # Regular season data
        client = NHLClient()

        data = client.standings.league_standings( season=curr_season )
        print( f"Fetched {len( data['standings'] )} teams records for the {curr_season} Regular Season" )

        regular_season_teams = []
        for team in data['standings']:
            team_name = team['teamName']['default'].split( '(' )[0].strip()
            team_name = ''.join(
                c for c in unicodedata.normalize( 'NFD', team_name )
                if unicodedata.category( c ) != 'Mn'
            )
    
            curr_team = NHL.Team(
                type = 'Regular Season',                    
                season = season,
                team_name = team_name,
                games_played = team['gamesPlayed'],
                wins = team['wins'],
                losses = team['losses'],
                ties = team['ties'],
                overtime_losses = team['otLosses'],
                points = team['points'],
                points_percentage = team['pointPctg'],
                regulation_wins = team['regulationWins'],
                regulation_and_overtime_wins = team['regulationPlusOtWins'],
                goals_for = team['goalFor'],
                goals_against = team['goalAgainst'],
                goal_differential = team['goalFor'] - team['goalAgainst'],

                # Home and away records as "W-L-OT"
                home = f"{team['homeWins']}-{team['homeLosses']}-{team['homeOtLosses']}",
                away = f"{team['roadWins']}-{team['roadLosses']}-{team['roadOtLosses']}",
                shootout = f"{team['shootoutWins']}-{team['shootoutLosses']}" if team['shootoutWins'] != None else None,

                # Last 10 games as "W-L-OT"
                last_10 = f"{team['l10Wins']}-{team['l10Losses']}-{team['l10OtLosses']}",

                # Streak
                streak = f"{team['streakCode']}{team['streakCount']}",

                shootout_wins = team['shootoutWins'],
                goals_for_per_game = team['goalFor'] / team['gamesPlayed'],
                goals_against_per_game = team['goalAgainst'] / team['gamesPlayed'],

                # Special teams percentages
                powerplay_percentage = team.get( 'powerPlayPct' ) or None,
                penalty_kill_percentage = team.get( 'penaltyKillPct' ) or None,
                net_powerplay_percentage = team.get ( 'powerPlayNetPct' ) or None,
                net_penalty_kill_percentage = team.get( 'penaltyKillNetPct' ) or None,
                faceoff_win_percentage = team.get( 'faceoffWinPct' ) or None,
                id = f"{curr_season}{team['teamAbbrev']}"
            )

            regular_season_teams.append( curr_team )

        # Special teams data
        special_teams_url = 'https://api.nhle.com/stats/rest/en/team/summary'
        params = {
            'cayenneExp': f'seasonId={curr_season} and gameTypeId=2',
            'limit': -1  # request all rows
        }

        response = requests.get( special_teams_url, params=params )
        response.raise_for_status()

        data = response.json().get( 'data', [] )
        time.sleep( 0.1 )

        for team in data:
            team_name = team['teamFullName'].split( '(' )[0].strip()
            team_name = ''.join(
                c for c in unicodedata.normalize( 'NFD', team_name )
                if unicodedata.category( c ) != 'Mn'
            )

            curr_team = next( (t for t in regular_season_teams if t.team_name == team_name and t.season == season), None )

            curr_team.powerplay_percentage = team['powerPlayPct'] * 100 if team['powerPlayPct'] != None else None
            curr_team.penalty_kill_percentage = team['penaltyKillPct'] * 100 if team['penaltyKillPct'] != None else None
            curr_team.net_powerplay_percentage = team['powerPlayNetPct'] * 100 if team['powerPlayNetPct'] != None else None
            curr_team.net_penalty_kill_percentage = team['penaltyKillNetPct'] * 100 if team['penaltyKillNetPct'] != None else None
            curr_team.faceoff_win_percentage = team['faceoffWinPct'] * 100 if team['faceoffWinPct'] != None else None

            self.database.add_team( curr_team )

        # Playoffs data
        summary_url = 'https://api.nhle.com/stats/rest/en/team/summary'
        params = {
            'cayenneExp': f'seasonId={curr_season} and gameTypeId=3',
            'limit': -1  # request all rows
        }

        response = requests.get( summary_url, params=params )
        response.raise_for_status()

        data = response.json().get( 'data', [] )
        time.sleep( 0.1 )

        print( f"Fetched {len( data )} team records for the {curr_season} 'Playoffs'" )

        for team in data:
            team_name = team['teamFullName']['default'].split( '(' )[0].strip()
            team_name = ''.join(
                c for c in unicodedata.normalize( 'NFD', team_name )
                if unicodedata.category( c ) != 'Mn'
            )
            
            curr_team = NHL.Team(
                type = 'Playoffs',
                season = season,
                team_name = team_name,
                games_played = team['gamesPlayed'],
                wins = team['wins'],
                losses = team['losses'],
                ties = team['ties'],
                overtime_losses = team['otLosses'],
                points = team['points'],
                points_percentage = team['pointPct'],
                regulation_wins = team['winsInRegulation'],
                regulation_and_overtime_wins = team['regulationAndOtWins'],
                goals_for = team['goalsFor'],
                goals_against = team['goalsAgainst'],
                goal_differential = team['goalsFor'] - team['goalsAgainst'],
                home = None,
                away = None,
                shootout = None,
                last_10 = None,
                streak = None,
                shootout_wins = team['winsInShootout'],
                goals_for_per_game = team['goalsForPerGame'],
                goals_against_per_game = team['goalsAgainstPerGame'],
                powerplay_percentage = team['powerPlayPct'] * 100 if team['powerPlayPct'] != None else None,
                penalty_kill_percentage = team['penaltyKillPct'] * 100 if team['penaltyKillPct'] != None else None,
                net_powerplay_percentage = team['powerPlayNetPct'] * 100 if team['powerPlayNetPct'] != None else None,
                net_penalty_kill_percentage = team['penaltyKillNetPct'] * 100 if team['penaltyKillNetPct'] != None else None,
                faceoff_win_percentage = team['faceoffWinPct'] * 100 if team['faceoffWinPct'] != None else None,
                id = f"{curr_season}{team['teamId']}"
            )

            self.database.add_team( curr_team )


    def get_all_data( self ):
        completed = False

        while not completed:
            try:
                self.database.reset_database()

                self.get_all_skater_data()
                self.get_all_goalie_data()
                self.get_all_team_data()

                completed = True
            except Exception as ex:
                print( ex )


    def get_current_season_data( self ):
        completed = False

        while not completed:
            try:
                curr_season = self.nhl_util.get_current_season().replace( '-', '' )

                self.get_current_season_skater_data( curr_season )
                self.get_current_season_goalie_data( curr_season )
                self.get_current_season_team_data( curr_season )

                completed = True
            except Exception as ex:
                print( ex )


if __name__ == '__main__':
    ingestor = Ingestor()

    print( '(1) Update current season data' )
    print( "(2) Update all seasons' data" )
    choice = input( '>> ' )

    if choice == '1':
        ingestor.get_current_season_data()
    elif choice == '2':
        ingestor.get_all_data()
    else:
        print( 'Error - invalid choice.' )
