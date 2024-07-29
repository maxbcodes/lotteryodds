"""
TEAM LOTTERY ODDS
Detroit	14.0%
Washington	14.0%
Charlotte	13.3%
Portland	13.2%
San Antonio	10.5%
Toronto	9.0%
Memphis	7.5%
Utah	6.0%
Brooklyn (to Houston)	4.5%
Atlanta	3.0%
Chicago	2.0%
Houston	1.5%
Sacramento	0.8%
Golden State	0.7%

15. Heat
16. 76ers
17. Lakers
18. Magic
19. Raptors
20. Cavs
21. Pelicans
22. Suns
23. Bucks
24. Knicks
25. Knicks
26. Wizards
27. TWolves
28. Nuggets
29. Jazz
30. Celtics
31. Raptors
32. Jazz
33. Bucks
34. Trailblazers
35. Spurs
36. Pacers
37. TWolves
38. Knicks
39. Grizzlies
40. Trailblazers
41. 76ers
42. Hornets
43. Heat
44. Rockets
45. Kings
46. Clippers
47. Magic
48. Spurs
49. Pacers
50. Pacers
51. Knicks
52. Warriors
53. Pistons
54. Celtics
55. Lakers
56. Suns
57. Grizzlies
58. Mavs
"""
import random

# Lottery odds
teams = {
    "Detroit": 14.0,
    "Washington": 14.0,
    "Charlotte": 13.3,
    "Portland": 13.2,
    "San Antonio": 10.5,
    "Toronto": 9.0,
    "Memphis": 7.5,
    "Utah": 6.0,
    "Brooklyn (to Houston)": 4.5,
    "Atlanta": 3.0,
    "Chicago": 2.0,
    "Houston": 1.5,
    "Sacramento": 0.8,
    "Golden State": 0.7
}

# Trade protections
protections = {
    "Toronto": ("Spurs", 6),  # top-6 protected
    "Detroit": ("Knicks", 18),  # top-18 protected
    "Indiana": ("Raptors", 3),  # top-3 protected
    "Charlotte": ("Spurs", 14),  # top-14 protected
    "Washington": ("Knicks", 12),  # top-12 protected
    "Portland": ("Bulls", 14),  # top-14 protected
    "Golden State": ("Trail Blazers", 4),  # top-4 protected
    "Sacramento": ("Hawks", 14),  # top-14 protected
    "Dallas": ("Knicks", 10),  # top-10 protected
    "Houston": ("Thunder", 4),  # top-4 protected
    "Utah": ("Thunder", 10)  # top-10 protected
}

# Fixed picks after lottery (only up to 30th pick)
fixed_picks = [
    "Miami Heat",
    "Philadelphia 76ers",
    "Los Angeles Lakers",
    "Orlando Magic",
    "Toronto Raptors",
    "Cleveland Cavaliers",
    "New Orleans Pelicans",
    "Phoenix Suns",
    "Milwaukee Bucks",
    "New York Knicks",
    "New York Knicks",
    "Washington Wizards",
    "Minnesota Timberwolves",
    "Denver Nuggets",
    "Utah Jazz",
    "Boston Celtics"
]


# Function to perform the draft lottery
def draft_lottery(teams, protections):
    draft_order = []
    teams_odds = [(team, odds) for team, odds in teams.items()]

    while teams_odds:
        total_odds = sum(odds for _, odds in teams_odds)
        pick = random.uniform(0, total_odds)
        cumulative = 0
        for i, (team, odds) in enumerate(teams_odds):
            cumulative += odds
            if pick <= cumulative:
                draft_order.append(team)
                teams_odds.pop(i)
                break

    # Apply trade protections
    final_draft_order = []
    for pick_position, team in enumerate(draft_order, start=1):
        if team in protections:
            to_team, protection = protections[team]
            if pick_position <= protection:
                final_draft_order.append((team, team))
            else:
                final_draft_order.append((team, to_team))
        else:
            final_draft_order.append((team, team))

    return final_draft_order


# Generate the lottery order
lottery_order = draft_lottery(teams, protections)

# Combine lottery picks with fixed picks (only top 30)
full_draft_order = [(team, new_team) for team, new_team in lottery_order] + [(team, team) for team in
                                                                             fixed_picks[:30 - len(lottery_order)]]

# Display the top 30 picks
for i, (original_team, new_team) in enumerate(full_draft_order[:30], start=1):
    if original_team == new_team:
        print(f"Pick {i}: {original_team}")
    else:
        print(f"Pick {i}: {original_team} (to {new_team})")



