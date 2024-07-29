document.getElementById('run-lottery').addEventListener('click', runLottery);

const teams = {
    "Detroit": 14.0,
    "Washington": 14.0,
    "Charlotte": 13.3,
    "Portland": 13.2,
    "San Antonio": 10.5,
    "Toronto": 9.0,
    "Memphis": 7.5,
    "Utah": 6.0,
    "Brooklyn": 4.5,
    "Atlanta": 3.0,
    "Chicago": 2.0,
    "Houston": 1.5,
    "Sacramento": 0.8,
    "Golden State": 0.7
};

const protections = {
    "Toronto": ["Spurs", 6],
    "Detroit": ["Knicks", 18],
    "Indiana": ["Raptors", 3],
    "Charlotte": ["Spurs", 14],
    "Washington": ["Knicks", 12],
    "Portland": ["Bulls", 14],
    "Golden State": ["Trail Blazers", 4],
    "Sacramento": ["Hawks", 14],
    "Dallas": ["Knicks", 10],
    "Houston": ["Thunder", 4],
    "Utah": ["Thunder", 10]
};

const lottery_odds = {
    "Detroit": [14.0, 13.4, 12.7, 12.0, 11.2, 10.4, 9.6, 8.9, 8.1, 7.3, 6.5, 5.7, 4.9, 4.1],
    "Washington": [14.0, 13.4, 12.7, 12.0, 11.2, 10.4, 9.6, 8.9, 8.1, 7.3, 6.5, 5.7, 4.9, 4.1],
    "Charlotte": [13.3, 12.6, 11.9, 11.2, 10.4, 9.6, 8.9, 8.1, 7.3, 6.5, 5.7, 4.9, 4.1, 3.4],
    "Portland": [13.2, 12.5, 11.8, 11.1, 10.3, 9.5, 8.8, 8.0, 7.2, 6.4, 5.6, 4.8, 4.0, 3.2],
    "San Antonio": [10.5, 10.5, 10.5, 10.5, 10.5, 9.0, 8.1, 7.2, 6.3, 5.4, 4.5, 3.6, 2.7, 1.8],
    "Toronto": [9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.5],
    "Memphis": [7.5, 7.5, 7.5, 7.5, 7.5, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.5, 0.2],
    "Utah": [6.0, 6.0, 6.0, 6.0, 6.0, 5.5, 4.5, 3.5, 2.5, 1.5, 1.0, 0.5, 0.2, 0.1],
    "Brooklyn": [4.5, 4.5, 4.5, 4.5, 4.5, 4.0, 3.0, 2.0, 1.0, 0.5, 0.3, 0.2, 0.1, 0.05],
    "Atlanta": [3.0, 3.0, 3.0, 3.0, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.05],
    "Chicago": [2.0, 2.0, 2.0, 2.0, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
    "Houston": [1.5, 1.5, 1.5, 1.5, 1.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005],
    "Sacramento": [0.8, 0.8, 0.8, 0.8, 0.8, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002],
    "Golden State": [0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002]
};

const fixedPicks = [
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
];

function runLottery() {
    const lotteryOrder = draftLottery(teams, protections);
    const fullDraftOrder = lotteryOrder.slice(0, 14).concat(fixedPicks.slice(0, 30 - lotteryOrder.length));
    displayResults(fullDraftOrder);

}

function draftLottery(teams, protections) {
    const draftOrder = [];
    const teamsOdds = Object.entries(teams);

    while (teamsOdds.length > 0) {
        const totalOdds = teamsOdds.reduce((sum, [, odds]) => sum + odds, 0);
        const pick = Math.random() * totalOdds;
        let cumulative = 0;
        for (let i = 0; i < teamsOdds.length; i++) {
            const [team, odds] = teamsOdds[i];
            cumulative += odds;
            if (pick <= cumulative) {
                draftOrder.push(team);
                teamsOdds.splice(i, 1);
                break;
            }
        }
    }

    return applyProtections(draftOrder, protections);
}

function applyProtections(draftOrder, protections) {
    const finalDraftOrder = [];
    for (let i = 0; i < draftOrder.length; i++) {
        const pickPosition = i + 1;
        const team = draftOrder[i];
        if (protections[team]) {
            const [toTeam, protection] = protections[team];
            if (pickPosition <= protection) {
                finalDraftOrder.push(`${team} (was top ${protection} protected in deal with ${toTeam})`);
            } else {
                finalDraftOrder.push(`${team} (traded to ${toTeam})`);
            }
        } else {
            finalDraftOrder.push(team);
        }
    }
    return finalDraftOrder;
}

function displayResults(draftOrder) {
    const resultsList = document.getElementById('draft-results');
    resultsList.innerHTML = '';
    draftOrder.forEach((team, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Pick ${index + 1}: ${team}`;
        resultsList.appendChild(listItem);
    });
}
