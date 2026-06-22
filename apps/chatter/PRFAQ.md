# PR/FAQ — Chatter on Sitetracker Mobile

*Amazon "Working Backwards" PR + FAQ. Internal document for leadership review. Not for external distribution.*

*Drafted: 2026-04-17.*

---

## PRESS RELEASE

### Chatter comes to Sitetracker Mobile: every Project, Site, and Job now has its conversation on the phone

**Field crews and ops managers can now read, post, @mention, and attach media to Salesforce Chatter feeds directly from the Sitetracker mobile app — closing the longest-standing gap between our web and mobile experience and unlocking the mobile adoption story for our largest field-ops customers.**

Today, Sitetracker is bringing **Chatter** — the Salesforce-native collaboration feed already built into the web product — to the mobile app. Starting with **Project, Site, and Job** records, every record in Sitetracker now carries its own conversation wherever the work happens.

Until now, Chatter was web-only on Sitetracker. A site supervisor standing on a tower site could open a Job on their phone to see the scope, the dates, the checklist — but not the conversation. To read the last comment from the PM, or post a photo of a blocker, they had to switch to the web app on a laptop, text a teammate, or wait until they were back at a desk. For our largest field-ops customers, that single gap was the reason Chatter adoption stalled at the office.

With Chatter on mobile, a supervisor can open a Job from a truck, read the last three posts, @mention the project manager with a photo of the issue, subscribe for follow-up updates, and keep moving. The PM gets a notification, responds, and the exchange stays anchored to the Job record — forever, visible to the next person who opens it.

This is the feature our customers have asked for more than any other. One of our largest field-ops accounts has flagged mobile Chatter as their #1 parity gap in every QBR since they rolled out. With this release, that gap closes.

> "Sitetracker's differentiator has always been that the work lives on the record. Mobile Chatter is how we keep that promise for the teams who don't work at desks. This is the foundation of the next wave of mobile adoption."
> — *[VP of Product, placeholder]*

> "I used to keep a paper notebook for every site because the real decisions happened in texts and calls I couldn't find later. Now I just open the Site on my phone and read back. When a new crew member shows up, the history is right there."
> — *[Field Operations Lead, placeholder customer]*

Chatter on Sitetracker Mobile is available today to every customer with Chatter enabled on web, at no additional cost. The Project, Site, and Job objects are live now; Permit, RFI, Lease, Incident Log, and other high-value modules are on the expansion roadmap.

---

## FAQ

### Customer FAQ

**What is Chatter?**
Chatter is the Salesforce-native collaboration feed that's been part of Sitetracker web for years. It's the conversation thread attached to a specific record — a Project, a Site, a Job — not a general chat app. No DMs. No ad-hoc channels. Just the comment section for the work itself.

**How is mobile Chatter different from web Chatter?**
It isn't. That's the entire point of this release. Same feeds, same @mentions, same notifications, same subscription model, same files — read and written on the device your field team already carries.

**Which records support Chatter on mobile today?**
Project, Site, and Job. These were chosen because they're the records field crews open most and where conversations have the highest business value. Other objects will follow (see roadmap below).

**Where do I find Chatter on mobile?**
Open any Project, Site, or Job record. There's a Chatter tab/section on the record screen. Tap to open, scroll the feed, post from the composer.

**Can I start a 1:1 chat or a new group?**
No. Chatter on Sitetracker is deliberately record-scoped only. If your team needs general chat, keep using whatever you use today (Slack, Teams, WhatsApp). Chatter is for work anchored to a record.

**How do @mentions work?**
Type `@` and pick a teammate. They get notified whether or not they're subscribed to that record. This matches web Chatter behavior exactly.

**How do notifications work?**
Three triggers, all matching web: (1) someone @mentions you, (2) you're subscribed to the record, (3) you're a default participant. "Subscribe" is the opt-in for "tell me about everything on this record."

**What can I attach?**
Photos and files, same as web Chatter. Media stays attached to the Chatter feed on the record.

**Can I edit or delete a post?**
Same as web Chatter — follows the Salesforce Chatter permission model your org has configured.

**Does this work on low or intermittent connectivity?**
Yes — this was a core design requirement given how many Sitetracker users work in poor-signal environments. Posts queue locally and send when connectivity returns. More on the low-connectivity engineering story in the internal FAQ.

---

### Leadership / Internal FAQ

**Why are we building this now?**
Two drivers. (1) Mobile Chatter is the #1 parity gap in our largest field-ops customer's renewal conversation and a recurring ask in QBRs across multiple accounts. We're losing mobile-adoption momentum every quarter we ship without it. (2) Our mobile-first strategy requires that the record — not the web page — is the center of gravity. As long as Chatter is web-only, we're implicitly telling customers their conversations don't belong on the record itself.

**What is the single hero benefit we're leading with?**
**Institutional memory on every record.** Not "chat on the go." Not "faster communication." The thesis: every decision, question, photo, and blocker stays attached to the Project/Site/Job it's about, forever, and is accessible from anywhere. That's what makes a platform sticky — and Chatter on mobile is what makes that promise real for field teams. Lead every exec conversation with this, not with feature enumeration.

**Why not build our own chat system from scratch?**
Because we'd lose on every axis. Salesforce Chatter already exists inside the platform, already has the permissions/sharing/compliance model enterprises demand, already has mobile APIs in the Salesforce mobile stack, and already has years of customer muscle memory on our web product. Building a proprietary chat would be expensive, duplicative, and strategically unwound — the point of Sitetracker is being deeply native to the Salesforce record model. Chatter *is* that model's conversation layer.

**What is the scope of v1 (Phase 1)?**
Three objects: **Project (`strk__Project__c`), Site (`strk__Site__c`), Job (`strk__Job__c`)**. Happy-path flows: read feed, post, @mention, attach media, subscribe/unsubscribe, receive notifications. Parity with web Chatter behavior on these objects — no new capabilities invented on top.

**What's explicitly NOT in v1?**
- Chatter on other Sitetracker objects (see expansion roadmap below)
- 1:1 or group Chatter (not a Sitetracker use case — Salesforce supports it, we're not surfacing it on mobile)
- Creating ad-hoc Chatter groups from the mobile app
- Global Chatter search across all records
- External Chatter collaboration (partner/contractor access) — evaluated per object in a later phase
- Feed tracking configuration UI on mobile (stays an admin task on web)

These are deliberate cuts. They ship the parity story cleanly and leave expansion work obvious.

**Who is the target customer?**
Primary persona: **field operations leads and site supervisors** who live inside Project/Site/Job records daily on mobile. Secondary persona: **ops managers and PMs** coordinating from the office, who need to trust that their mobile teammates will see and act on what they post. Both personas must be productive for the release to land.

**Which objects are on the expansion roadmap, and why these?**
Based on the 60+ object feasibility analysis, the prioritized sequence is:

- **Phase 2 (High-impact, next release window):** Permit, RFI, Lease, Incident Log, Maintenance Schedule, Attachment, Submittal Package, Punch List, Program
- **Phase 3 (Medium-impact):** Activity, Milestone, Finance, Field Asset, Timesheet, Calendar Event, Crew Resource, Alert
- **Phase 4 (Long tail):** Lower-volume objects selected based on customer demand

Phase 2 is selected on business-value density: regulatory/compliance (Permit, RFI, Incident Log), long-cycle stakeholder coordination (Lease, Submittal Package), and quality control (Punch List). These are also the objects where the *cost of a lost conversation* is highest — exactly where institutional memory pays back most.

**What objects are NOT good Chatter candidates, and why flag this?**
High-volume transactional objects (Timesheet Entry, Inventory Transaction, Approval Action, Annotation Comment) and sensitive-data objects (Lease Payment, Vendor Payment) are either subsumed by parent-object Chatter or governed by compliance constraints. Flagging this upfront so leadership understands the roadmap is intentionally *not* "Chatter on every object" — it's "Chatter where collaboration actually lives."

**What's the success metric?**
- **Primary:** % of mobile DAU who read or post in Chatter within a session, on Chatter-enabled orgs.
- **Secondary:** Reduction in mobile ↔ web session-switching among customers where both are enabled.
- **Leading indicator:** @mention notification open rate on mobile.
- **Adoption proxy:** Chatter post volume on Project/Site/Job records post-release vs. baseline.

**What are the biggest risks?**
1. **Notification fatigue.** Chatter notifications on a phone are louder than on web. Conservative defaults + clear subscribe controls are non-negotiable. Mitigation already in scope.
2. **Low / intermittent connectivity.** Sitetracker field teams work in poor-signal environments (tower sites, remote utility infra, rural solar, underground). Posts must queue, retry, reconcile cleanly. This is a core reliability bet, not polish. (This feature is the hero case study for the broader low-connectivity research track — see below.)
3. **Feed tracking discipline.** If admins leave feed tracking on noisy fields (e.g. forecast date recalcs), mobile users get drowned in system-generated posts. Release must ship with recommended feed-tracking defaults documented for customer admins.
4. **Permissions / sharing edge cases.** Salesforce Chatter inherits record-level sharing. Mobile must respect this exactly — any leakage on mobile is a security incident.

**How does this connect to the low-connectivity research track?**
Directly. Chatter is the most conversationally dense surface in the mobile product, which makes it the highest-signal testbed for offline-first queuing, optimistic UI, conflict reconciliation, and background sync. Patterns proven here inform every subsequent mobile feature — Checklists, Punch Lists, Inspections, and beyond. Shipping Chatter mobile is simultaneously a feature launch *and* an infrastructure investment.

**What's the commercial model?**
Included at no additional cost for customers who already have Chatter enabled in their Sitetracker org. This is a parity release, not a new SKU. No pricing change, no separate entitlement.

**What's the integration story with Salesforce Chatter itself?**
Mobile Chatter consumes the same Salesforce Chatter APIs the web app already uses. No parallel data model, no shadow store. Posts made on mobile appear on web and vice versa in real time. Permissions, moderation, compliance export, and audit trails all continue to work through existing Salesforce mechanisms.

**What's the ask from leadership in this review?**
1. Sign-off on the Phase 1 scope (Project, Site, Job) and the explicit v1 cut list.
2. Agreement on the hero benefit framing (institutional memory) so marketing, sales, and CS tell the same story.
3. Green-light for the Phase 2 object sequence, contingent on Phase 1 adoption hitting the primary success metric.
