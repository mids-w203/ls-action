# release-action

"At the beginning of the semester update `index.js` (not the one in `dist`)

Update everything in this section:

Date information is based on ISO 8601 format. Importantly:
- 1 is Monday, 2 is Tuesday, ... 7 is Sunday
  - https://help.tableau.com/current/pro/desktop/en-us/dates_calendar.htm
- Weeks are the ISO week of the year. See this calendar from East Carolina University
  - https://myweb.ecu.edu/mccartyr/isowdcal.html

```javascript
const year = '23';       // 2 digit year as string (e.g. '23' for 2023)
const semester = 'fall'; // long name ('fall','spring', or 'summer')
const sem = 'fa'         // short name ('fa','sp', or 'su') 
const sections = {
// day: [section numbers]
// day - Monday is 1 thru Sunday is 7
    2: [1,2,3,4],        // Tuesday sections
    3: [5,6],            // Wednesday sections
    4: [7,8,9]           // Thursday sections
};
const mids_weeks = [
    // Iso weeks where we have class
    // first entry will be week 1 for hw/ls, second will be week 2, etc.
    19,20,21,22,23,24,25,26,27,28,29,30,31,32
];
const hw_sol_release_weeks = [
    // Weeks where we have homeworks released to students
    2,3,5
]; 
const hw_release_day = 4 // Monday = 1, etc.

```
