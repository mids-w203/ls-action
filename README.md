# release-action
This repo has the code that automatically grants student access to the homework 
and lecture slide solutions. This README documents how to use it.

# Semesterly update steps

## Update `index.js`
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

## Recompile the code to update `dist/index.js`

We update the "regular" `index.js` becasue its' a lot more compact and easy to work with.
However, the actual file that gets run is `dist/index.js`. The `dist/index.js` file has
the index.js file **plus** all of the JavaScript libraries that `index.js` needs to run
built right in. Here's how we update `dist/index.js` with just the lines from `index.js`.

1. Clone this repo to your local machine
2. Run `git pull` if it's already there
3. Navigate to the directory that you just cloned
4. Run `docker compose up` in that directory
5. Make sure that the output from that command ends with a line that says `release-action-node-1 exited with code 0`
6. Run `git add -A` to stage your changes for commit
7. Run `git status` to see the changed files. make sure that you have changes staged in `dist/index.js`
8. Run `git diff --cached` to see the changes in `dist/index.js` the changed lines should be the ones that you chagned in `index.js`
9. Run `git commit -m "Update for new semester"` to commit your changes
10. Run `git push` to update the action on the github site. 


# Code Runner 

Note that the actual action that runs this code is in instructor_central. 
It's at https://github.com/mids-w203/instructor_central/blob/master/.github/workflows/release_ls_sol.yml

# Issue Log

## Updater not running spring 2024

In spring 2024 (and fall 2023 in retrospect) we had an issue where the repo wasn't updating. The issue was that we 
were only updating the repo.js and not recompiling the packages. We need to recompile
to propogate those updates to `dist/index.js` which is the file that actually gets run.
The `dist/index.js` file has the config that we define in `index.js` **plus** the code
for all of the libraries that it depends on. All those libraries` codes are requrired
because the VM that our github action gets run on is more or less of a blank slate
each time it gets run.

[I interrogated ChatGPT a whole lot to get this thing fixed. Here's the link](https://chat.openai.com/share/8153607d-55f1-434d-b444-7083d1c81f9c)

