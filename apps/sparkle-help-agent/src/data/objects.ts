import type { FormItem, ScreenId } from '../types';

export const JOB = {
  id: 'J-000234',
  templateName: 'Antena installation template',
  siteName: 'PT - 100 PEARL STREET',
  address: '100 Pearl Street',
  city: 'Denver, Colorado 99999',
};

export const PROJECT = {
  id: 'P-009341',
  name: 'Jenney',
  status: '--',
  templateName: 'Site Lightning',
};

/** The form opened from a list — carries the doc-generation blocker. */
export const FORM_DETAIL = {
  name: 'Site Check-Out Form from Template ID: a0gf6000000ZOUMAA4',
  siteName: 'WeWork Prestige Central',
  status: 'Complete',
  section: 'General',
};

export const SITE = {
  id: 'site-1',
  name: '10 Executive Drive',
  type: 'Warehouse',
  county: 'Bergen County',
  city: 'Fairfield, New Jersey',
};

export const FORMS: FormItem[] = [
  { name: 'OSHA Compliant 4.2', siteName: 'Mahwah - 100 Corporate Drive', status: 'In Progress' },
  { name: 'OSHA Compliant 4.6', siteName: 'Mahwah - 100 Corporate Drive', status: 'Not Started' },
  { name: 'OSHA Compliant SSI 4.3', siteName: 'Mahwah - 100 Corporate Drive', status: 'Not Started' },
  { name: 'OSHA Compliant 4.5', siteName: 'Mahwah - 100 Corporate Drive', status: 'Completed' },
];

export const QUICK_ACTION_GROUPS: string[][] = [
  ['Create new job', 'Create RFI', 'Create new Form'],
  ['Check In/Out', 'Log Time', 'Log new field assets'],
];

/**
 * Screen-context Help agent answers. When the user taps "Help me with the
 * problem on my screen", Scout replies with the solution for the current
 * screen's blocker. Populated with the real Help-agent responses as they land;
 * screens with no entry fall back to the generic "taking a look" reply.
 */
export const SCREEN_HELP: Partial<Record<ScreenId, string>> = {
  home: `Here's what's going on and how to get unblocked.

## What This Means

As a mobile user with a Standard license, you're trying to access the **Calendar** in Sitetracker Mobile, but you haven't been set up as a **Resource** yet. Resources are users who can be assigned to jobs and scheduled work.

## How to Solve It

**You can't fix this yourself** — it needs administrator action.

### What your admin needs to do:
1. **Add you as a Resource** in Sitetracker
  - Open the Resource object in Salesforce
  - Create a new Resource record linked to your User account
  - Make sure the Resource is marked as Active
2. **Verify your permissions** include access to:
  - Resource records
  - Calendar / scheduling features
  - Job assignments

### What you should do:
Contact your Sitetracker Administrator and tell them:
- You need to be added as a Resource in the system
- You're getting this error opening the Calendar in Sitetracker Mobile
- Your username: **mehul.k@sitetracker.com**

Once you're added as a Resource, you'll be able to view the Calendar, be assigned to jobs, and see your scheduled work in the mobile app.`,
  site: `You're seeing **"Inventory Management is not enabled in your organization"** because this is an org-level feature that hasn't been turned on yet.

## How to Solve It

As a **mobile user with a standard license**, you can't enable this feature yourself.

### What your admin needs to do:
1. **Enable Inventory Management** in your Sitetracker org settings
2. **Assign you a permission set** that includes inventory access
3. Ensure your profile / permission set includes:
  - Read/Write access to Inventory objects
  - Mobile app permissions for Inventory features

### What you can do:
1. **Contact your Sitetracker Administrator** and request:
  - Inventory Management to be enabled for the organization
  - The permissions to be added to your account
2. **Give them**:
  - Your username / email
  - The site or project where you need inventory access
  - Your use case (what inventory tasks you need to do)

### After your admin enables it:
- Log out and back into the Sitetracker Mobile app
- The Inventory section should then be accessible

**Note:** Standard license users get access once the feature is enabled and permissions are granted — they just can't enable it themselves.

Want me to draft a message to your admin requesting this access?`,
  'form-detail': `This is a **permissions issue** with the document template (ID: a0gf6000000Z0UMA4) for the Site Check-Out Form. As a mobile user with a standard license, here's how to solve it.

## Immediate solutions
1. **Contact your Salesforce / Sitetracker administrator** — the most direct fix. The error means one of:
  - The template has been deleted or moved
  - Your profile / permission set doesn't have access to the template
  - The template's sharing settings exclude your user
2. **Try the web version** — log into Sitetracker on desktop and generate the document there. If it works on web but not mobile, it's likely a mobile-specific permission issue.

## What your admin needs to check
- **Template exists**: verify template ID a0gf6000000Z0UMA4 still exists in the org
- **Template permissions**: your profile / permission set has access to document generation
- **Folder permissions**: the template's folder is shared with you
- **License limitations**: your standard license includes document generation

## Workaround (if urgent)
- Your form data is safe — the form already shows COMPLETE
- Capture screenshots or notes for now
- Generate the document later from the web, or once permissions are fixed

Want me to help identify who your Sitetracker admin is, or find alternative templates you can access?`,
  job: `## The Problem

**Job J-006417 is unscheduled**, which blocks time tracking in Sitetracker Mobile. As a field worker with a standard license, you have **read-only access** to scheduling and time tracking — you can't schedule jobs or log time yourself. Only your manager / dispatcher can create the Calendar Event Assignment that unlocks time tracking for you.

---

## The Solution

**Post a Chatter message on job J-006417 and tag your manager.** They'll schedule the job and assign you as the resource, which enables time tracking in your mobile app.

---

## Step-by-Step

### Step 1: Navigate to Job J-006417
- Open Sitetracker Mobile
- Go to the job record for J-006417 (WeWork Prestige Central)

### Step 2: Open the Chatter feed
- Tap the **Chatter** tab on the job record
- Tap the text box to create a new post

### Step 3: Post this message
Customize the parts in [brackets]:

@[Manager Name] — I need this job scheduled so I can track time from mobile.

**Job Details:**
• Job: J-006417
• Site: WeWork Prestige Central, Bengaluru
• Location: 36, Infantry Rd, Tasker Town, Bengaluru, 560001

**Request:**
1. Please schedule this job for me
  - Proposed: [July 9, 2026, 9:00 AM – 5:00 PM] *← adjust to your actual date/time*
  - Assign me (Mehul Kundu) as the resource
2. Enable time tracking so I can log hours from mobile

**Current Issue:** Mobile shows "This job has not been scheduled" under SCHEDULE and MY TIMETRACKING. I can't log time until it's scheduled.

**Urgency:** [I'm at the site now / Work starts tomorrow / Needed by end of week] *← pick one*

Thanks!

### Step 4: Tag your manager
- Type **@** and start typing your manager's name
- Select them from the dropdown to create the mention (sends an immediate notification)

### Step 5: Post
- Tap **Share** / **Post** to publish

---

## What Happens Next
Your manager will:
1. Create a **Calendar Event** for job J-006417
2. Create a **Calendar Event Assignment** linking you to that event
3. Set the assignment status to **"Assigned"**

Once complete, you'll see:
- ✅ The job appears under **SCHEDULE**
- ✅ Time tracking enabled under **MY TIMETRACKING**
- ✅ You can log hours against the job

**Timeline:** usually a few hours to 1 business day, depending on your manager's availability.

---

Chatter is faster than email and leaves an audit trail on the job record — your manager gets notified right away and can act on it immediately.`,
  project: `I can see files uploading to project P-009341 (Jenney) stuck on **"Uploading files: 0/1"** — the upload is either stalled or progressing very slowly.

As a field user, here's how to speed it up:

**Immediate fixes**
1. **Check your network** — switch between WiFi and cellular to see which is faster. Field sites often have poor connectivity.
2. **Reduce file size** — if uploading photos, lower the image quality / resolution in your camera settings before shooting.
3. **Upload one file at a time** — try individual uploads instead of a batch.
4. **Cancel and retry** — force-close Sitetracker Mobile, reopen it, and try again.

**Network-related**
5. **Move to a better signal area** — even a few feet can improve reception on site.
6. **Use WiFi when available** — connect to site WiFi before uploading.
7. **Wait for better connectivity** — save uploads for when you have a stronger signal.

**App-related**
8. **Clear the app cache** — Settings > Apps > Sitetracker > Storage > Clear Cache (this won't delete your data).
9. **Update the app** — make sure you're on the latest version.
10. **Check available storage** — ensure your phone has enough free space.

Your license type (Standard User) shouldn't affect upload speed — this is almost always a network or file-size issue, not a permissions problem.

If it persists after these steps, contact your Sitetracker admin — there may be org-level settings or file-size limits affecting mobile uploads.`,
};

export const SPARKLE_GREETINGS: Record<string, string> = {
  'Create new job': "Let's create a new job. Which site is this job for?",
  'Create RFI': "I can help you raise an RFI. What's the question, and which job or site does it relate to?",
  'Create new Form': 'Sure — which form template would you like to start? I can pull the ones assigned to you.',
  'Check In/Out': "I can check you in or out of a site. You're near PT - 100 Pearl Street — check in there?",
  'Log Time': 'How much time would you like to log, and against which job?',
  'Log new field assets': "Let's log new field assets. You can describe them or snap a photo and I'll fill in the details.",
  'Help Agent': "Hi, I'm your Help Agent ✨ — ask me anything about your jobs, sites, or forms.",
};
