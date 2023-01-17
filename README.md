# New Order DAO App

This is the frontend codebase for the New Order DAO's Dapp that can be found here: [https://dao.neworder.network/](https://dao.neworder.network/).

All documentation about the DAO can be found on our gitbook page here: [https://docs.neworder.network/new-order/](https://docs.neworder.network/new-order/)

## Contributing to the Project

New Order welcomes contributors to our open-sourced DAO app.

Join New Order DAO's discord server to get more help from other contributors on our `Engineering Workstream` channels. Join our discord server by clicking the invite link here: [https://discord.gg/tyr6hyyJKC](https://discord.gg/tyr6hyyJKC)

## Issues

Feel free to submit issues and enhancement requests [here](https://github.com/new-order-network/new-order-app-ui/issues).

## Contributing

### Before Contributing

1. You'll need Git, Node, and Yarn installed before starting.
2. Please refer to the project's style and contribution guidelines for submitting patches and additions.
3. In general, we follow the "fork-and-pull" Git workflow.

### Setup and Compiling

Steps 1-6 only need to be done once to get set up.

1. Fork the repo on GitHub
2. Clone the project onto your machine
3. Create a `.env.local` file and ping a current dev for the contents
4. `$ git remote add upstream https://github.com/new-order-network/new-order-app-ui.git`
   1. This adds a link to your parent repo so you can easily pull from it
5. `$ nvm use`
   1. This sets your Node to the right version
6. `$ yarn install`
   1. This tells yarn to install the necessary packages
7. `$ yarn start`
   1. This builds the project and watches for changes
   2. Now, at localhost:3000, you should see the site
   3. Any changes you make to the code should cause an auto-update as the files are being watched

### Committing Changes

1. `$ git checkout -b <branch_name>`
   1. This makes and checks out a local branch for you to develop on
   2. For naming, we prefer to format it this way: `[ISSUE-TAG]/[ISSUE-NUMBER]-[A-MEANINGFUL-TITLE]`
      1. So for example, we have an issue called "Update README" with a tag of "feature" and issue number of 1, the ideal branch name could be: `feat/1-update-readme`
   3. Name it descriptively in the format described above, e.g. "bug/fix-logo"
2. `$ git push origin <branch_name>`
   1. This creates a matching branch in your remote repository
3. Make changes to the code as needed and `$ git add <blah>` any files you've modified
4. `$ git commit -m "<descriptive_comment>"`
   1. This commits your changes to your local branch
   2. We also highly recommend the use of [commitizen](https://github.com/commitizen/cz-cli) to automate the structure of your commits
5. `$ git checkout main; git pull upstream main; git checkout <branch_name>; git merge main`
   1. This series of commands will pull the latest changes from the parent repo, merge them into your forked repo's main branch, then rebase your new branch on top of those changes
6. Repeat step 2 to push your changes to your remote branch
7. Now, go to GitHub's UI and submit a pull request to merge your changes with the parent repo's main branch
