# Welcome to NHLDB! #

* Updated as of 12/30/2025

## How to use the Program ##
 * Clone the repository locally.
 * Run ```python3 ingestor``` and ```1``` to fetch most recent data.
 * Run ```python3 server.py 4000``` and navigate to ```http://localhost:4000/home.html``` to view the stats.

## Edge Cases
 * When viewing skater stats grouped by the skater, 'average fields' like TOI/G and faceoff percentage are calculated using the data from
   the seasons which they are available.

## Known Bugs/Limited Functionality
 * Currently, the stats are fetched by season, and not by season and team, so filtering by team does not work for individual seasons for
   players who played for multiple teams during that season, or over multiple seasons, for skaters who played for multiple teams during
   any season.
 * Clinching markers are shown for the current season
 * Table columns must be adjusted for cumulative stats, and possibly playoff stats (if we wish to remove fields like home, away, S/O,   
   etc.)

## Sources ##

 * https://www.sportslogos.net/ (team logos)
 * https://freebiesupply.com/ (team logos)
 * https://seeklogo.com/ (team logos)
 * https://en.wikipedia.org/wiki/Main_Page (team logos)
 * https://www.remove.bg/uploads (transparent backgrounds for images)
 * https://www5.lunapic.com/editor/ (transparent backgrounds for images)
 * https://logos-world.net/arizona-coyotes-logo/ (Winnipeg Jets old logo)