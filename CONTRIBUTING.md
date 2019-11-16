# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

## Create a Metamask Account
This project is a Decentralized App which means it needs to connect to the Ethereum Blockchain. We do that through Metamask.

1. Install the [Metamask](https://metamask.io/) browser plugin. This is necessary to allow your browser to connect
   to the ethereum blockchain.
2. Change the network that Metamask is connected to from 'Main Ethereum Network' to 'Rinkeby Test Network'. You can
   get some test Ethereum from the [sink](https://faucet.rinkeby.io/). Copy your account address from Metamask(This 
   is a hex string staring with 'Ox') and make a post on either Facebook or Twitter containing your address, and copy
   the url for that post into the Rinkeby Authenticated Faucet. The Ether should appear in your acount after half a minute.
3. When you start the development server and open the webpage, metamask will ask you to login in order to connect to
   the site.
4. You are now setup for development!

## <a name="tldr"></a> TL;DR Contributing Guide

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository and clone your fork.
1. Make a patch branch.
1. Make changes, commit and push.
1. Submit a pull request and your changes will be reviewed and merged.

## Contributing Guide

First, `fork` the repository,

Next, `clone` your `fork`:

```bash
git clone <your fork url>
```

Navigate into the directory using `cd`.

Now we want to add the original repository we forked from as a remote upstream, this way we can sync back up with it later without deleting the fork:

```bash
git remote add upstream <original repository URL>
```

To confirm, let's list our remotes:

```bash
git remote -v
```

Then, `checkout` a new `branch` from `master`:

```bash
git checkout -b <new branch> master
```

Make some changes! Any time you make a change be sure to `commit` with a detailed message:

```bash
git commit -am "commit message here"
```

- the `-a` command line option will automatically "add" and "rm" edited files.
- the `-m` command line option will specify that your commit message follows in quotes.

When you are done making changes, `push` your changes on your branch to `Github`:

```bash
git push origin <new branch>
```

Now submit a pull request! We'll review the request and either accept it or ask you to make some changes.

After your pull request is merged, you can delete your branch on Github:

```bash
git push origin --delete
```

Switch back to your `master` branch:

```bash
git checkout master -f
```

And delete your local fix branch branch:

```bash
git branch -D <new branch>
```

Finally, update your fork with the master branch of the original repo:

```bash
git pull -ff upstream master
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. We are using semantic versioning schema; vMajor.Minor.Patch.
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## <a name="resources"></a> Git & Github Resources

If you are new to `git`, Github has several tutorials on what a fork is, how to fork, configure a remote and sync with a remote repository:

- [About Forks](https://help.github.com/articles/about-forks/)
- [How to fork a Repo](https://help.github.com/articles/fork-a-repo/).

They have a pretty great guide overall about a fork workflow:

- [Working with Forks](https://help.github.com/articles/working-with-forks/)

This article includes how to configure a remote for a fork, and how to sync a fork with the original repo:

- [Configuring a remote for a fork](https://help.github.com/articles/configuring-a-remote-for-a-fork/)
- [Syncing a Fork](https://help.github.com/articles/syncing-a-fork/)

Finally, if you are not sure how to make a pull request, this article may help you:

- [About Pull Requests](https://help.github.com/articles/about-pull-requests/)
