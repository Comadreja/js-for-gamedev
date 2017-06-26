# The work environment

## The command line

The command line is an application for communicating with the operating system through written commands. A major part of web development tools are console applications, that is, applications whose interface is conceived to be used through a command line.

Generally speaking, you need not install command lines from 3rd-party developers because operating systems feature their own. Check one of these guides on how to launch these applications depending on your operating system:

- In case you are working on  [Windows](http://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10/).

- In case you are working on [Mac OS](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line).

- In case you are working on [Linux](http://askubuntu.com/questions/183775/how-do-i-open-a-terminal).

It would be advisable to become familiar with the commands available to the different operating systems. Linux and Mac OS offer very similar utility sets based on the [POSIX](https://en.wikipedia.org/wiki/POSIX) standard. However, the Windows command set is radically different.

In accordance to your operating system, use one of the following guides to learn the most typical commands in each environment:

- If your operating system is Windows, use the http://dosprompt.info/ guide.

- If your operating system is Mac OS or Linux, use the guide from [_The Linux Information
Project_](http://www.linfo.org/command_line_lesson_1.html).

You can also make it so that Windows offers the same utilities as Linux or Mac OS by installing [Cygwin](https://www.cygwin.com/).

## Node

JavaScript is the Web's programming language and it is run, mainly, within a browser-integrated virtual machine. Nevertheless, this is not the only environment we can use JavaScript in.

Node is a JavaScript interpreter based upon V8, the virtual machine in Google's browser, Chrome. Node is widely utilized in the development of server-side applications and it is in Node that we will learn JavaScript, in order to emphasize its independence from the browser.

In order to carry out the exercises and practices proposed in this guide, we recommend [the installation of any version of Node 6](https://nodejs.org/en/).

## The text editor

It is convenient to keep in mind that, in order to begin programing in JavaScript, all you need is a plain text editor. However, it is recommendable to choose an editor with some advanced capabilities that allow us to be more productive.

**Notice**: it is important not to mistake a plain text editor (such as Notepad), for a word processor (such as Microsoft Word).

The editor [Atom](https://atom.io/) is very popular among web developers. It is a good option due to being free, open-source and extensible (in addition, it has been programmed in JavaScript).

If you choose Atom, we recommend you install the following _add-on_: [`linter-jshint`](https://github.com/AtomLinter/linter-jshint). It is a _linter_, a piece of software that will analyze your JavaScript code. Not only will it check your style (for instance, preventing lines from exceeding a certain amount of characters), but it will also warn you of certain poor practices that could cause _bugs_ (for instance, using a variable without having declared it beforehand).

### Console editors

It is convenient to know at least one console editor, since you will not always be working with desktop environments. There are several good ones, among them [Vim](http://www.vim.org/).

In any case, if you have never worked with a console editor before, _we strongly recommend you use Atom_ or any other editor with a visual interface. It is the quickest way to get started, since the learning curve for Vim is very steep.

If, despite our warnings, you choose to use Vim, do not forget to play [Vim Adventures](http://vim-adventures.com/) and complete the tutorial from http://www.openvim.com, both of which will help you become familiar with the editor. Vim is also highly configurable and there are several guides on how to enhance the programming experience.

## The browser

**Any modern browser** will do and, in fact, we recommend you install several so that you can verify that your game is compatible across browsers.

You must learn how to enable the **developer tools** in your browser, since those will help you debug your game, analyze its performance, etc. In this guide we shall feature [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/), which is a special version of Firefox for web developers, featuring tools and options unavailable in the normal version of Firefox.
