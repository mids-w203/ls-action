const year = '22';
const semester = 'su';
const sections = {
    2: [1,2,3,4],
    3: [5,7],
    4: [8,9],
    5: [6,10]
};
const mids_weeks = [
    18,19,20,21,22,23,24,25,26,27,28,29,30,31
];

process.env.TZ = 'America/Los_Angeles' 
const core = require('@actions/core');
const axios = require('axios');

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}
release = function(sections = [], repo, year, semester, w203_secret, slack_token) {
    console.log("sections: " + sections);
    sections.forEach( sec => {
        const team = semester + "_" + year + "_section_" + sec.toString().padStart(2, '0');
        const channel="datasci-203-20" + year + "-" + semester + "-sec-" 
        + sec.toString().padStart(2, '0');
        
        console.log("team: " + team);
        console.log("channel: " + channel);
        
        const request_github = axios({
            method: 'put',
            url: 'https://api.github.com/orgs/mids-w203/teams/'
                 + team + "/repos/mids-w203/" + repo,
            data: { permission: 'pull' },
            headers: {
                'Authorization': "token " + w203_secret,
                'Accept': "application/vnd.github.inertia-preview+json"
            }
        });

        const request_slack = axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            data: { channel: channel, text:  "Released https://github.com/mids-w203/" + repo },
            headers: {
                'Authorization': "Bearer " + slack_token,
                'Content-Type': "application/json"
            }
        });
    });
}
const main = async () => {
    const slack_token = core.getInput('slack_token', { required: true });
    const w203_secret = core.getInput('w203_secret', { required: true });
   
    const date = new Date();
    
    if( !mids_weeks.includes(date.getWeek()) )
        return;
    
    const mids_week = mids_weeks.indexOf(date.getWeek()) + 1;
    const ls_repo = "unit_" + mids_week.toString().padStart(2, '0') + "_ls_sol";
    const day = date.getDay();
    
    // LS Solutions
    console.log("ls_repo: " + ls_repo);
    //console.log(sections[day - 1]);
    release(sections[day - 1], ls_repo, year, semester, w203_secret, slack_token);

    // HW Solutions
    if( day <= 2 )
        hw_week = mids_week - 2;
    else 
        hw_week = mids_week - 1;
    
    const hw_repo = "unit_" + hw_week.toString().padStart(2, '0') + "_hw_sol";

    //console.log("hw_repo: " + hw_repo);
    //release(sections[(day + 5) % 7], ls_repo, year, semester, w203_secret, slack_token);
}

main();

