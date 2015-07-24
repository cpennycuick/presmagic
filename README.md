# PresMagic
Presenter Magic: Presenter and lyric software built as a Chrome Application.

## Project Management
Use GitHub issue tracker for tasks and bugs.
Use Trello (https://trello.com/b/VlYfchYj/presmagic) for higher level project management.

## Installation
1. Go to "chrome://extensions/".
2. Turn "Developer mode" on.
3. Then click "Load unpacked extension..." and select the root folder of the project.

## Useful links
https://developer.chrome.com/apps/api_index

## GIT Help
These are things I have searched multiple times, so this is a list for easy reference.

**Create Branch with remote tracking**  
git branch [branchname]  
git push origin [branchname]  
git branch -u origin/[branchname] [branchname]  

**Checkout remote branch**  
git checkout -b [branchname] --track origin/[branchname]  

**Show all branches local and remote**  
git branch -avv  

**Mark all changes for commit**  
git add -A  

**Commit changes to local**  
git commit -m "[message]"  

**Push changes to remote tracking branch**  
git push [branchname]  

**Update tracking branches to show remote changes**  
git fetch  

**Update local branch to remote**  
git pull [branchname]  

**Delete local branch**  
git branch -d [branchname]  

**Delete remote branch**  
git push origin --delete [branchname]  

**Show summary of changes**  
git status  
