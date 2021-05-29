# ig-growth-bot
An IG bot which goes through given hashTags and likes the most recent N number of posts.

configs.ts: Contains IG userId, password, list of string hashtags, min and max of intervals where the bot is run and noOfPostsToLike in each hashTag.
ig_script.sh - simple script which runs the node file while outputting logs into output.log
telegram_send.sh - Additional functionality if you have a telegram bot + channel which can notify you on each iteration completion
