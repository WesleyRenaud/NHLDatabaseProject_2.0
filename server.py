from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sys
from urllib.parse import urlparse

import Database, NHL

class MyHandler( BaseHTTPRequestHandler ):    
    database = Database.Database()
    database.createDB()
    nhl_util = NHL.NHLUtil()

    def do_GET( self ):
        parsed = urlparse( self.path )

        if parsed.path in ['/view_stats.html']:
            fp = open( './pages/view_stats.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/player_season_stats.html']:
            fp = open( './pages/player_season_stats.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/player_playoff_stats.html']:
            fp = open( './pages/player_playoff_stats.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/skater_lookup.html']:
            fp = open( './pages/skater_lookup.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/goalie_lookup.html']:
            fp = open( './pages/goalie_lookup.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/standings.html']:
            fp = open( './pages/standings.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/team_season_stats.html']:
            fp = open( './pages/team_season_stats.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/team_playoff_stats.html']:
            fp = open( './pages/team_playoff_stats.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/team_lookup.html']:
            fp = open( './pages/team_lookup.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_stats.html']:
            fp = open( './pages/add_stats.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_skater.html']:
            fp = open( './pages/add_skater.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_skater_regular_season.html']:
            fp = open( './pages/add_skater_regular_season.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_skater_playoffs.html']:
            fp = open( './pages/add_skater_playoffs.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_goalie.html']:
            fp = open( './pages/add_goalie.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_goalie_regular_season.html']:
            fp = open( './pages/add_goalie_regular_season.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_goalie_playoffs.html']:
            fp = open( './pages/add_goalie_playoffs.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_team_regular_season.html']:
            fp = open( './pages/add_team_regular_season.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path in ['/add_team_playoffs.html']:
            fp = open( './pages/add_team_playoffs.html' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/html' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path == '/styles/styles.css':
            fp = open( './styles/styles.css', 'r' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/css' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif parsed.path == '/scripts/scripts.js':
            fp = open( './scripts/scripts.js', 'r' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'text/css' )
            self.send_header( 'Content-length', len( content ) )
            self.end_headers()
            self.wfile.write( bytes( content, 'utf-8' ) )


        elif 'png' in parsed.path:
            image_path = parsed.path.replace( '%20', ' ' )
            image_path = image_path[1:]

            fp = open( image_path, 'rb' )
            content = fp.read()

            self.send_response( 200 )
            self.send_header( 'Content-type', 'image/png' )
            self.send_header( 'Content-length', str( len( content ) ) )
            self.end_headers()
            self.wfile.write( content )


    def do_POST( self ):
        if self.path == '/add_team':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            team_data = json.loads( post_data.decode( 'utf-8' ) )
            season = team_data.get( 'season' )

            team = NHL.Team( team_data.get( 'type' ), team_data.get( 'season' ), team_data.get( 'city' ), 
                             team_data.get( 'name' ), team_data.get( 'gamesPlayed' ), team_data.get( 'wins' ),
                             team_data.get( 'losses' ), team_data.get( 'ties' ), team_data.get( 'overtimeLosses' ), 
                             team_data.get( 'points' ), team_data.get( 'pointsPercentage' ), team_data.get( 'regulationWins' ),
                             team_data.get( 'regulationAndOvertimeWins'), team_data.get( 'goalsFor' ), team_data.get( 'goalsAgainst' ),
                             team_data.get( 'goalDifferential' ), team_data.get( 'home' ), team_data.get( 'away' ),
                             team_data.get( 'shootout' ), team_data.get( 'last10' ), team_data.get( 'streak' ),
                             team_data.get( 'shootoutWins' ), team_data.get( 'goalsForPerGame' ), team_data.get( 'goalsAgainstPerGame' ),
                             team_data.get( 'powerplayPercentage' ), team_data.get( 'penaltyKillPercentage' ),
                             team_data.get( 'netPowerplayPercentage' ), team_data.get( 'netPenaltyKillPercentage' ),
                             team_data.get( 'faceoffWinPercentage' ) )
            
            self.database.add_team( team )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'status': 'success'}
            self.wfile.write(json.dumps(response).encode('utf-8'))


        if self.path == '/add_skater':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            skater_data = json.loads( post_data.decode( 'utf-8' ) )

            skater = NHL.Skater( skater_data.get( 'name' ), skater_data.get( 'team' ), skater_data.get( 'number' ),
                                 skater_data.get( 'position' ), skater_data.get( 'height' ), skater_data.get( 'weight' ),
                                 skater_data.get( 'birthday' ), skater_data.get( 'handedness' ), skater_data.get( 'draftPosition' ) )
            
            seasons = skater_data.get( 'seasons' )
            for i in range( len( seasons ) ):
                skater.add_season( seasons[i].get( 'season' ), seasons[i].get( 'team' ), seasons[i].get( 'gamesPlayed' ), 
                                   seasons[i].get( 'goals' ), seasons[i].get( 'assists' ), seasons[i].get( 'points' ), 
                                   seasons[i].get( 'plusMinus' ), seasons[i].get( 'penaltyMinutes' ), 
                                   seasons[i].get( 'powerplayGoals' ), seasons[i].get( 'powerplayPoints' ), 
                                   seasons[i].get( 'shortHandedGoals' ), seasons[i].get( 'shortHandedPoints' ), 
                                   seasons[i].get( 'timeOnIcePerGame' ), seasons[i].get( 'gameWinningGoals' ), 
                                   seasons[i].get( 'overtimeGoals' ), seasons[i].get( 'shots' ), 
                                   seasons[i].get( 'shootingPercentage' ), seasons[i].get( 'faceoffPercentage' ) )

            playoffs = skater_data.get( 'playoffs' )
            for i in range( len( playoffs ) ):
                skater.add_playoffs( playoffs[i].get( 'season' ), playoffs[i].get( 'team' ), playoffs[i].get( 'gamesPlayed' ),
                                     playoffs[i].get( 'goals' ), playoffs[i].get( 'assists' ), playoffs[i].get( 'points' ),
                                     playoffs[i].get( 'plusMinus' ), playoffs[i].get( 'penaltyMinutes' ), 
                                     playoffs[i].get( 'powerplayGoals' ), playoffs[i].get( 'powerplayPoints' ),
                                     playoffs[i].get( 'shortHandedGoals' ), playoffs[i].get( 'shortHandedPoints' ),
                                     playoffs[i].get( 'timeOnIcePerGame' ), playoffs[i].get( 'gameWinningGoals' ),
                                     playoffs[i].get( 'overtimeGoals' ), playoffs[i].get( 'shots' ), 
                                     playoffs[i].get( 'shootingPercentage' ), playoffs[i].get( 'faceoffPercentage' ) )
                
            self.database.add_skater( skater )


        elif self.path == '/add_goalie':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            goalie_data = json.loads( post_data.decode( 'utf-8' ) )

            goalie = NHL.Goalie( goalie_data.get( 'name' ), goalie_data.get( 'team' ), goalie_data.get( 'number' ),
                                 goalie_data.get( 'height' ), goalie_data.get( 'weight' ), goalie_data.get( 'birthday' ),
                                 goalie_data.get( 'handedness' ), goalie_data.get( 'draftPosition' ) )
            
            seasons = goalie_data.get( 'seasons' )
            for i in range( len( seasons ) ):
                goalie.add_season( seasons[i].get( 'season' ), seasons[i].get( 'team' ), seasons[i].get( 'gamesPlayed' ), 
                                   seasons[i].get( 'gamesStarted' ), seasons[i].get( 'wins' ), seasons[i].get( 'losses' ),
                                   seasons[i].get( 'ties' ), seasons[i].get( 'overtimeLosses' ), seasons[i].get( 'shotsAgainst' ),
                                   seasons[i].get( 'goalsAgainstAverage' ), seasons[i].get( 'savePercentage' ),
                                   seasons[i].get( 'shutouts' ), seasons[i].get( 'goals' ), seasons[i].get( 'assists' ),
                                   seasons[i].get( 'penaltyMinutes' ), seasons[i].get( 'timeOnIce' ) )

            playoffs = goalie_data.get( 'playoffs' )
            for i in range( len( playoffs ) ):
                goalie.add_playoffs( playoffs[i].get( 'season' ), playoffs[i].get( 'team' ), playoffs[i].get( 'gamesPlayed' ), 
                                     playoffs[i].get( 'gamesStarted' ), playoffs[i].get( 'wins' ), playoffs[i].get( 'losses' ),
                                     playoffs[i].get( 'ties' ), playoffs[i].get( 'overtimeLosses' ), playoffs[i].get( 'shotsAgainst' ),
                                     playoffs[i].get( 'goalsAgainstAverage' ), playoffs[i].get( 'savePercentage' ),
                                     playoffs[i].get( 'shutouts' ), playoffs[i].get( 'goals' ), playoffs[i].get( 'assists' ),
                                     playoffs[i].get( 'penaltyMinutes' ), playoffs[i].get( 'timeOnIce' ) )
                
            self.database.add_goalie( goalie )


        elif self.path == '/get_wildcard_standings':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )
            
            season = data.get( 'season' )

            teams = self.database.get_standings_stats( season )
            logos = []

            wildcard_standings = self.nhl_util.get_wildcard_standings( season, teams )
            for i in range( len( wildcard_standings ) ):
                if isinstance( wildcard_standings[i], NHL.Team ):
                    # get the image for each team based on the season
                    team_name = wildcard_standings[i].get_full_name()
                    team_logo_path = self.nhl_util.get_team_logo_path( team_name, season )
                    logos.append( team_logo_path )

                    wildcard_standings[i] = wildcard_standings[i].to_dict()

            # get the clinching markers
            clinching_markers = self.nhl_util.get_clinching_markers( season, teams )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'status': 'success',
                'wildcard_standings': wildcard_standings,
                'logos': logos,
                'clinching_markers': clinching_markers
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))


        elif self.path == '/get_division_standings':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )
            
            season = data.get( 'season' )
            
            stat = data.get( 'stat' )
            multiplier = data.get( 'multiplier' )

            teams = self.database.get_standings_stats( season )

            logos = []

            if stat and multiplier:
                division_standings = self.nhl_util.get_division_standings( season, teams, stat, multiplier )
            else:
                division_standings = self.nhl_util.get_division_standings( season, teams )
            
            for i in range( len( division_standings ) ):
                if isinstance( division_standings[i], NHL.Team ):
                    # get the image for each team based on the season
                    team_name = division_standings[i].get_full_name()
                    team_logo_path = self.nhl_util.get_team_logo_path( team_name, season )
                    logos.append( team_logo_path )

                    division_standings[i] = division_standings[i].to_dict()

            # get the clinching markers
            clinching_markers = self.nhl_util.get_clinching_markers( season, teams )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'status': 'success',
                'division_standings': division_standings,
                'logos': logos,
                'clinching_markers': clinching_markers
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))


        elif self.path == '/get_conference_standings':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )
            
            season = data.get( 'season' )
            
            stat = data.get( 'stat' )
            multiplier = data.get( 'multiplier' )

            teams = self.database.get_standings_stats( season )
            logos = []

            if stat and multiplier:
                conference_standings = self.nhl_util.get_conference_standings( season, teams, stat, multiplier )
            else:
                conference_standings = self.nhl_util.get_conference_standings( season, teams )
            
            for i in range( len( conference_standings ) ):
                if isinstance( conference_standings[i], NHL.Team ):
                    # get the image for each team based on the season
                    team_name = conference_standings[i].get_full_name()
                    team_logo_path = self.nhl_util.get_team_logo_path( team_name, season )
                    logos.append( team_logo_path )
                    
                    conference_standings[i] = conference_standings[i].to_dict()

            # get the clinching markers
            clinching_markers = self.nhl_util.get_clinching_markers( season, teams )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'status': 'success',
                'conference_standings': conference_standings,
                'logos': logos,
                'clinching_markers': clinching_markers
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))


        elif self.path == '/get_league_standings':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )
            
            type = data.get( 'type' )
            season = data.get( 'season' )
            
            stat = data.get( 'stat' )
            multiplier = data.get( 'multiplier' )

            teams = self.database.get_standings_stats( season )
            logos = []

            if stat and multiplier:
                league_standings = self.nhl_util.get_league_standings( type, season, teams, stat, multiplier )
            else:
                league_standings = self.nhl_util.get_league_standings( type, season, teams )
            
            for i in range( len( league_standings ) ):
                if isinstance( league_standings[i], NHL.Team ):
                    # get the image for each team based on the season
                    team_name = league_standings[i].get_full_name()
                    team_logo_path = self.nhl_util.get_team_logo_path( team_name, season )
                    logos.append( team_logo_path )

                    league_standings[i] = league_standings[i].to_dict()

            # get the clinching markers
            clinching_markers = self.nhl_util.get_clinching_markers( season, teams )

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'status': 'success',
                'league_standings': league_standings,
                'logos': logos,
                'clinching_markers': clinching_markers
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))


        elif self.path == '/get_team_stats':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )

            type = data.get( 'type' )
            team = data.get( 'team' )
            first_season = data.get( 'first_season' )
            last_season = data.get( 'last_season' )
            stat = data.get( 'stat' )
            multiplier = data.get( 'multiplier' )

            if team != 'all':
                if first_season != None:
                    season = first_season
                    team_stats = self.database.get_team_stats_for_one_team_for_one_season( type, team, season )

                else:
                    team_stats = self.database.get_team_stats_for_one_team( team )
                    if not stat:
                        self.nhl_util.sort_seasons_by_season( team_stats )

            else:
                if first_season == last_season:
                    season = first_season
                    team_stats = self.database.get_team_stats_for_one_season( type, season )

                else:
                    team_stats = self.database.get_team_stats( type, first_season, last_season )

            if type == 'Regular Season':
                if team == 'all' or first_season != last_season:
                    self.nhl_util.sort_teams_by_points( team_stats )

            else:
                if team == 'all' or first_season != last_season:
                    self.nhl_util.sort_teams_by_wins( team_stats )

            if stat and multiplier:
                team_stats = self.nhl_util.get_league_standings( type, None, team_stats, stat, multiplier )

            if team == 'all':
                logos = []
                for i in range( len( team_stats ) ):
                    # get the image for each team based on the season
                    team_name = team_stats[i].get_full_name()
                    team_logo_path = self.nhl_util.get_team_logo_path( team_name, team_stats[i].season )
                    logos.append( team_logo_path )                

            if isinstance( team_stats, list ):
                for i in range( len( team_stats ) ):
                    team_stats[i] = team_stats[i].to_dict()
            else:
                team_stats = team_stats.to_dict()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
        
            if team == 'all':
                response = {
                    'status': 'success',
                    'first_season': first_season,
                    'last_season': last_season,
                    'team_stats': team_stats,
                    'logos': logos
                }
            else:
                response = {
                    'status': 'success',
                    'team_stats': team_stats
                }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))


        elif self.path == '/get_skater_stats':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )

            name = data.get( 'name' )
            type = data.get( 'type' )
            team = data.get( 'team' )
            first_season = data.get( 'first_season' )
            last_season = data.get( 'last_season' )
            stat = data.get( 'stat' )
            multiplier = data.get( 'multiplier' )

            if name != None:
                skaters = self.database.get_skater_stats_for_one_player( name )

                for skater in skaters:
                    if stat and multiplier:
                        self.nhl_util.get_sorted_skater_stats( skater.seasons, stat, multiplier )
                        self.nhl_util.get_sorted_skater_stats( skater.playoffs, stat, multiplier )
                    else:
                        self.nhl_util.sort_seasons_by_season( skater.seasons )
                        self.nhl_util.sort_seasons_by_season( skater.playoffs )

                skaters = [skater.to_dict() for skater in skaters]

            else:
                position = data.get( 'position' )

                if first_season == last_season:
                    season = first_season
                    skater_stats = self.database.get_skater_stats_for_one_season( type, season, team, position )
                else:
                    skater_stats = self.database.get_skater_stats( type, first_season, last_season, team, position )

                if stat and multiplier:
                    self.nhl_util.get_sorted_skater_stats( skater_stats, stat, multiplier )
                else:
                    self.nhl_util.get_sorted_skater_stats( skater_stats )

                logos = []
                if isinstance( skater_stats, list ):
                    for i in range( len( skater_stats ) ):
                        team_name = skater_stats[i].team

                        if first_season == last_season:
                            team_logo_path = self.nhl_util.get_team_logo_path( team_name, season )
                        else:
                            #print( team_name, skater_stats[i].season )
                            team_logo_path = self.nhl_util.get_team_logo_path( team_name, skater_stats[i].season )
                        logos.append( team_logo_path )

                        skater_stats[i] = skater_stats[i].to_dict()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            if name != None:
                response = {
                    'status': 'success',
                    'skaters': skaters
                }

            else:
                response = {
                    'status': 'success',
                    'first_season': first_season,
                    'last_season': last_season,
                    'skater_stats': skater_stats,
                    'logos': logos
                }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))


        elif self.path == '/get_goalie_stats':
            content_length = int( self.headers[ 'Content-Length'] )
            post_data = self.rfile.read( content_length )
            data = json.loads( post_data.decode( 'utf-8' ) )

            name = data.get( 'name' )
            type = data.get( 'type' )
            team = data.get( 'team' )
            first_season = data.get( 'first_season' )
            last_season = data.get( 'last_season' )
            stat = data.get( 'stat' )
            multiplier = data.get( 'multiplier' )

            if name != None:
                goalies = self.database.get_goalie_stats_for_one_player( name )

                for goalie in goalies:
                    if stat and multiplier:
                        self.nhl_util.get_sorted_goalie_stats( goalie.seasons, stat, multiplier )
                        self.nhl_util.get_sorted_goalie_stats( goalie.playoffs, stat, multiplier )
                    else:
                        self.nhl_util.sort_seasons_by_season( goalie.seasons )
                        self.nhl_util.sort_seasons_by_season( goalie.playoffs )

                goalies = [goalie.to_dict() for goalie in goalies]

            else:
                if first_season == last_season:
                    season = first_season
                    goalie_stats = self.database.get_goalie_stats_for_one_season( type, season, team )
                else:
                    goalie_stats = self.database.get_goalie_stats( type, first_season, last_season, team )

                if stat and multiplier:
                    self.nhl_util.get_sorted_goalie_stats( goalie_stats, stat, multiplier )
                else:
                    self.nhl_util.get_sorted_goalie_stats( goalie_stats )

                logos = []
                if isinstance( goalie_stats, list ):
                    for i in range( len( goalie_stats ) ):
                        team_name = goalie_stats[i].team

                        if first_season == last_season:
                            team_logo_path = self.nhl_util.get_team_logo_path( team_name, season )
                        else:
                            team_logo_path = self.nhl_util.get_team_logo_path( team_name, goalie_stats[i].season )
                        logos.append( team_logo_path )

                        goalie_stats[i] = goalie_stats[i].to_dict()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            if name != None:
                response = {
                    'status': 'success',
                    'goalies': goalies
                }

            else:
                response = {
                    'status': 'success',
                    'first_season': first_season,
                    'last_season': last_season,
                    'goalie_stats': goalie_stats,
                    'logos': logos
                }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))  


if __name__ == '__main__':
    httpd = HTTPServer( ( 'localhost', int(sys.argv[1]) ), MyHandler )
    print( 'Server listing in port:  ', int(sys.argv[1]) )
    httpd.serve_forever()