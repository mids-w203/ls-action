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
    // Should be the unit number + 1 
    // i.e. when you put 2 in the list, repo hw_1_sol will get released week 2. 
    2,3,4,6,10,12,13 
]; 
const hw_release_day = 4 // Monday = 1, etc.
```

## Code Runner 

Note that the actual action that runs this code is in instructor_central. It's at https://github.com/mids-w203/instructor_central/blob/master/.github/workflows/release_ls_sol.yml

