CORAL HACKATHON — PERSONAL AGENT TRACK
=======================================
jotted ideas / brain dump


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDEA 1 — CHIEF OF STAFF MORNING BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

what it does:
- reads your gmail inbox (unread threads)
- checks google calendar (today's meetings + time blocks)
- scans notion tasks (due today / overdue)
- cross-joins all three and spits out exactly 3 priority actions for the morning

cool angle:
- if an email and a meeting are about the same thing → that floats to the top
- ranks by urgency not just deadline
- feels like having a personal assistant who read everything before you woke up

tools needed:
- Gmail
- Google Calendar
- Notion

query logic:
- unread emails + today's events + open tasks
- JOIN on keywords / subjects
- LIMIT 3 ordered by priority

demo moment:
- run it live on your actual gmail in front of judges
- show "here are your 3 things right now" — personal and immediate

expand later:
- send the brief as a daily email/notification
- add voice readout
- let agent auto-snooze low priority emails


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDEA 2 — CONTENT CREATOR TRUTH DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

what it does:
- joins youtube video analytics with twitter/x post engagement on upload days
- also joins discord member join events on those same days
- finds which content caused cross-platform spikes
- tells you your "golden formula" — topic + format that works everywhere

cool angle:
- no creator tool does cross-platform correlation today
- "compound virality score" = views + tweet impressions + discord joins on same day
- reverse engineering your own best content

tools needed:
- YouTube
- Twitter / X
- Discord

query logic:
- JOIN on date of upload
- rank by combined engagement score
- surface top 5 videos and what made them work

demo moment:
- show a real channel's data, rank videos by cross-platform score
- highlight the one video that spiked everywhere vs ones that flopped on two platforms

expand later:
- add Reddit / TikTok
- auto-generate content brief based on top performers
- weekly email report


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDEA 3 — STUDY DEBT COLLECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

what it does:
- reads google calendar for study blocks + class schedule
- reads notion for assignment tracker and notes
- reads google drive for when files were last opened
- calculates: how many study blocks were fake (scheduled but skipped)
- surfaces: what's due in 48hrs that you haven't touched

cool angle:
- "study debt" = hours behind on topics you keep skipping
- tells you exactly which subject you're procrastinating on
- last opened timestamp is brutal — "you haven't opened this PDF in 9 days, exam tomorrow"

tools needed:
- Google Calendar
- Notion
- Google Drive

query logic:
- calendar events vs actual file open timestamps
- assignments table JOIN notes JOIN drive files
- flag anything due soon with zero recent activity

demo moment:
- live demo on your own calendar/drive
- show the gap between "I planned to study this" and "I never opened the file"

NEW FEATURE — CHAT INTELLIGENCE LAYER:
- connect whatsapp / telegram / discord group chats
- agent scans selected groups for important signals:
    - class canceled tomorrow
    - assignment deadline changed
    - prof moved the exam
    - group project meeting rescheduled
    - "hey the submission portal is down"
- surfaces these as alerts BEFORE your morning brief
- you pick which groups to monitor (family/friends groups excluded)
- keyword filters: cancel, postpone, deadline, exam, submission, reminder, urgent

why this wins:
- every student misses these messages buried in 200+ chat notifications
- nobody has built "extract important logistics from group chats" as a study agent
- massive demo appeal — judges all relate to missing a class cancellation text

tools needed (extended):
- WhatsApp (via integration or export)
- Telegram
- Discord (already in coral ecosystem)
- Slack (for university workspaces)

query logic for chat layer:
- scan messages from last 24hrs in selected groups
- keyword match: cancel / postpone / exam / deadline / reminder / urgent / reschedule
- de-duplicate + rank by recency
- prepend to morning brief as "ALERTS" section


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMBINED SUPER-AGENT IDEA
(if you want to go big)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

name idea: "FIRST LIGHT" — your agent that runs every morning

flow:
1. scan group chats → extract urgent alerts (class canceled, deadline moved)
2. check calendar → what's happening today
3. check gmail → anything urgent unread
4. check notion → what's due / overdue
5. check drive → what you haven't touched that you should have
6. output: ALERTS (from chats) + 3 PRIORITIES (from everything else)

why this is hackathon-winning:
- uses the most integrations = best demo of coral's cross-source JOIN
- relatable to every single person in the room
- solves a REAL daily pain (information overload across 5 apps)
- has a clear "before vs after" — before: scroll 5 apps. after: one brief.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPACE FOR MORE IDEAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ idea slot 4 ]
- name:
- what it does:
- tools:
- demo moment:
- expand later:

[ idea slot 5 ]
- name:
- what it does:
- tools:
- demo moment:
- expand later:

[ idea slot 6 ]
- name:
- what it does:
- tools:
- demo moment:
- expand later:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOOLS CHECKLIST (what coral supports for personal agent track)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

confirmed in hackathon brief:
[ ] Gmail
[ ] Google Calendar
[ ] Notion
[ ] YouTube
[ ] Twitter / X
[ ] Discord
[ ] GitHub
[ ] Slack
[ ] Apple Health
[ ] Google Sheets
[ ] Google Drive

to verify / confirm with organizers:
[ ] WhatsApp
[ ] Telegram
[ ] Reddit
[ ] TikTok


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JUDGING CRITERIA (guesses — verify with hackathon page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- use of coral (cross-source JOINs > single source queries)
- real-world usefulness
- demo quality (live > screenshots)
- creativity of integration
- technical depth


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTES / RANDOM THOUGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- the more tools you JOIN the more impressive the coral demo looks
- live demo > slides every time
- pick something you'd personally use — that passion shows when you present
- "study debt collector + chat alerts" is probably the most original idea here
  because nobody has done "extract logistics from group chats" before
- the chat intelligence layer could be its own product honestly

These are Coral's official tracks. Here are Lumis-native tracks you could offer users — same format, your product:

The Freelancer's Control Room · Gmail + Notion + Google Calendar
Tracks proposals sent, follow-ups due, project deadlines, and unpaid invoices. One place to see if your business is healthy or on fire.

The Founder's Pulse · Gmail + GitHub + Notion + Slack
Morning snapshot: what shipped, what broke, who's blocked, what needs a decision from you today. Replaces your standup.

The Job Seeker's Pipeline · Gmail + Notion + Google Calendar
Tracks every application, interview, and follow-up. Tells you who went cold, what's coming up, and drafts your next check-in email.

The Student's Second Brain · Google Calendar + Google Drive + Notion
Joins your class schedule, lecture notes, and assignment list. Tells you what's due this week, what you haven't revised, and where you're behind.

The Content Creator's Scoreboard · YouTube + Twitter + Notion
Weekly report of what performed, what flopped, and what ideas in your Notion backlog match your top-performing topics.

The Open Source Maintainer · GitHub + Gmail
New issues triaged, stale PRs flagged, release notes drafted. Runs every morning without you asking.

The Sales Rep's Assistant · Gmail + Google Calendar + Notion
Surfaces deals gone cold, preps you for today's calls with last-email context, and logs meeting outcomes automatically.

The Remote Team Lead · Slack + GitHub + Notion
Tells you who's blocked, what shipped yesterday, and writes the weekly update to your manager so you don't have to.