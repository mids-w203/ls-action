// Build: npm run build
//
const year = '23';       // 2 digit year as string (e.g. '23' for 2023)
const semester = 'fall'; // long name ('fall','spring', or 'summer')
const sem = 'fa'         // short name ('fa','sp', or 'su') 
const sections = {
    2: [1,2,3,98],
    3: [4,5,6],
    4: [7,99]
};
const mids_weeks = [
    // Iso weeks where we have class
    // first entry will be week 1 for hw/ls, second will be week 2, etc.
    35,36,37,38,39,40,41,42,43,44,46,48,49,50
]; 
const hw_sol_release_weeks = [
    // Weeks where we have homeworks released to students
    2,3,5
]; 
const hw_release_day = 4 // Monday = 1, etc.

process.env.TZ = 'America/Los_Angeles' ;
const core = require('@actions/core');
const axios = require('axios');
const slack_token = core.getInput('slack_token', { required: true });
const w203_secret = core.getInput('w203_secret', { required: true });
var exec = require('child_process').exec;

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

release_ls = function(sections = [], repo) {
    console.log("sections: " + sections);
    sections.forEach( sec => {
        const team = sem + "_" + year + "_section_" + sec.toString().padStart(2, '0');
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

release_hw = function(repo) {
    const channel="datasci-203-20" + year + "-" + semester; 
    const team = semester + "_" + year + "_students";

    console.log("channel: " + channel);
    console.log("team: " + team);
        
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
}

const main = async () => {
    const date = new Date();
    
    if( !mids_weeks.includes(date.getWeek()) )
        return;
    
    const mids_week= 1 //mids_weeks.indexOf(date.getWeek()) + 1;
    const ls_repo = "unit_" + mids_week.toString().padStart(2, '0') + "_ls_sol";
    const day = 3 //date.getDay();
    
    // LS Solutions
    console.log("ls_repo: " + ls_repo);
    //console.log(sections[day - 1]);

    console.log("day: " + day);
    release_ls(sections[day], ls_repo);

    // HW Solutions
    if(day == hw_release_day && hw_sol_release_weeks.includes(mids_week)) {
        const hw_repo = "unit_" + (mids_week - 1).toString().padStart(2, '0') + "_hw_sol";
        console.log("hw_repo: " + hw_repo);
        release_hw(hw_repo);
    }
}

main();

