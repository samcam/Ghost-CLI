module.exports.displayReleaseNotes = async (ctx, task) => {
    const got = require('got');
    const response = await got('https://api.github.com/repos/TryGhost/Ghost/releases', {json: true});
    const relevantNotes = response.body.filter(note => note.tag_name === ctx.version)[0];

    task.title = 'Fetched release notes';

    if (!relevantNotes) {
        return;
    }

    ctx.releaseNotesContainWarning = relevantNotes.body.includes('⚠️');
    ctx.ui.log('\n' + relevantNotes.body + '\n', 'green');
};

module.exports.checkForConfirmation = async (ctx) => {
    const {CliError} = require('../errors');

    const question = 'The release notes contain a ⚠️, which indicates an issue with the release. Are you sure you want to continue?';
    const answer = await ctx.ui.confirm(question, true);

    if (answer) {
        return;
    }

    throw new CliError({
        message: 'Confirmation is needed to continue - aborting.'
    });
};
