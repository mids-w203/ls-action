const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    const slack_token = core.getInput('slack_token', { required: true });
    const w203_secret = core.getInput('w203_secret', { required: true });

    const octokit = new github.getOctokit(token);
}

main();