## Homework 2 Journal - Tito Reinhart

### Preface

I faced some unexpected challenges this past week. Despite them, I feel that I did my best to implement as much as I can, and try and diagnose / troubleshoot issues with web resources and class discord. There is something with my implementations that I haven't been able to piece together. As far as I can tell, they are "correct", but there I think are some gaps in a working solution and my present implementation. 

```Challenge 1```: Tore my Hamstring. I have been in a moderate amount of pain since the assignment was due as a result of a rock climbing injury. I had several doctors appointments in addition to trying to keep up my course work. 

```Challenge 2```: It just so happens that I have work coming due in my 2 other classes (3 Classes total), and keeping up has been challenging. 

```Challenge 3```: I work full-time, and have been doing my best to manage all the pieces of my life to do the best I can to learn as much as possible. I find Fullstack interesting and enjoy these assignments. However, it is definitely challenging trying to keep up with every aspect of my life. 

6 days for a project like this I feel is more than sufficient in the case of having 2 classes and working at most part-time. This unfortunately is just not my reality as a student. I did the best I could. 


### Process

First mistake I made was pulling from 1 commit too far on the upstream repository. Posted a fix in the discord for anyone else who may benefit from my mistake. 

One part that took me awhile to comprehend was the migration component of the assignment. I think I set it up correctly following the steps outlined from lecture. Additionally, It appeared that I had the correct migrations initialized based on what I saw in `./backend/db/migrations`. Additioanlly, I was able to launch `docker-compose` (I love Docker), and connect the server to the database correctly. 

I then went through and started implementing the baseline methods 1 - 6. I started off basically looking at the `app.<method>("/profiles")` implementations, and basing my initial `/match` methods on those. I felt from there I had a pretty good place to refine the implementations to get them to work. I realized something however - I'm not super familiar with how to test in this kind of environment. I ran a profile_seeder to fill up the profile database, but was confused because I didn't see any of it populated in my running Docker container. 

I resolved instead to try and find solutions online, but that proved more confusing than helpful, unfortunately. I resolved basically to carefully think through the prompts and how I would write the code (coming from Python) in Typescript. I found little clues here and there in the Discord, however it is a bit challenging trying to keep up wtih the stream of issues and changes in the chat. However, I feel that I found enough clues where my implementations are at least close. They are at least comprehensible to discern what I am trying to do. If I were working on this with a senior developer, I feel maybe only minor changes would need to be made. 

I was able to complete implementations 1 - 6, albeit they are not as well tested as I'd like them to be. I Attempted to complete a portion of the first bonus question. One of the challenges in completing this bonus is how a message object gets added as a data member to the Match model. Thi stook some thinking, and while I don't think it is entirely how it would be implemented, I think that it is pretty close. The other part I missed is connecting with the naughty words API (Google stole it from George Carlin). However, assuming for a minute I did get that, I'd brute force every word in the message against the naughty words list. Another strategy would be to save the naughty words list in a hashmap and scan through the words in the message for any collisions. 

I look forward to the solutions and any time that can be made on how to set up test environments would be greatly appreciated. As always, thanks for your help. 