# Trade-offs

## Public menu visibility vs restricted interaction

**Problem:**
Determining appropriate access control for viewing menus.

**Solution:**
Frictionless public access without mandatory authentication.

**Decision taken:**
Public, frictionless access allowing anyone (user or non-user) to open the app (via URL/PWA) and check the menu.

**Tradeoff taken:**
Menu data is publicly accessible to anyone with the link.

**Reason:**
Low barrier to entry; allows easy access via bookmarks or PWA for quick checking.

## Anonymous voting vs vote integrity

**Problem:**
Balancing user privacy with vote tracking and future personalization.

**Solution:**
Decoupled vote storage with separate identity mapping.

**Decision taken:**
Votes are stored as separate documents and are anonymous by default. User identity is NOT directly attached to votes; a separate mapping collection exists between user ID and voter ID.

**Tradeoff taken:**
Harder to audit individual user voting history for debugging; decoupling of data.

**Reason:**
Prevents administrators from knowing exactly who voted for what (preserves privacy) while enabling future consensual recommendation features and preventing duplicates.

## One-vote-per-voter-ID vs full abuse prevention

**Problem:**
Implementing vote validation without excessive complexity.

**Solution:**
Basic constraint on voter ID.

**Decision taken:**
Restriction of one vote per voter ID.

**Tradeoff taken:**
Susceptible to manipulation if a user can generate multiple voter IDs.

**Reason:**
Simplicity of implementation; sufficient for intended scope.

## Discarding votes when menus are updated

**Problem:**
Handling votes when the underlying menu item changes.

**Solution:**
Invalidate votes on update to ensure data consistency.

**Decision taken:**
Votes are discarded if the menu item they correspond to is updated/modified.

**Tradeoff taken:**
Loss of user engagement data; users may need to re-vote.

**Reason:**
Ensures vote tally reflects the exact current state of the menu item (integrity of feedback vs item).

## AI-based structuring vs manual or deterministic parsing

**Problem:**
Converting human-readable menu inputs into structured data.

**Solution:**
AI-driven normalization.

**Decision taken:**
Google Gemini API is used to normalize natural language inputs into the JSON schema.

**Tradeoff taken:**
Dependency on external API; process is non-deterministic (requires review).

**Reason:**
"Ease of management"; handles improved structuring of human-readable data better than rigid parsing.

## Formatted text input vs direct PDF ingestion

**Problem:**
Ingesting menu data into the system.

**Solution:**
Simplified text input interface.

**Decision taken:**
Inputting menu data via formatted text (natural language/simplified description).

**Tradeoff taken:**
Manual copy-paste step required if source data is in PDF.

**Reason:**
Simplifies the input processing layer compared to complex PDF parsing.

## Temporary text-export workflow vs robust ingestion pipelines

**Problem:**
Handling menu PDFs reliably given OCR limitations.

**Solution:**
Manual human-in-the-loop text extraction workflow.

**Decision taken:**
A manual workflow where menu PDFs are opened in a reader (e.g., Okular), text is copied with preserved spacing, and pasted into the admin interface for Gemini processing.

**Tradeoff taken:**
Manual, multi-step process for administrators.

**Reason:**
Ensures higher quality input for the AI by relying on human selection; bypasses known OCR reliability issues. Note: Pre-save UI validations are planned.

## Future multi-input ingestion vs current AI dependency

**Problem:**
Delivering ingestion capabilities quickly vs building a comprehensive engine.

**Solution:**
Start with AI dependency.

**Decision taken:**
Current dependency on AI for the ingestion pipeline.

**Tradeoff taken:**
Single point of failure (AI) for current ingestion.

**Reason:**
Faster initial feature delivery. Note: Structured inputs may bypass AI in the future.

## camelCase-derived food identifiers for voting

**Problem:**
Generating unique identifiers for food items during voting.

**Solution:**
Deterministic ID generation from food names.

**Decision taken:**
Food identifiers used for voting are derived by converting the food name to camelCase.

**Tradeoff taken:**
Tighter coupling between menu updates and food identifiers; renaming a food item changes its identifier, breaking association with previous votes.

**Reason:**
Reduces database write frequency; simplifies vote aggregation; fewer backend database operations compared to stable UUIDs.

## Reduced database writes vs menu update complexity

**Problem:**
Optimizing database performance during menu updates.

**Solution:**
Write-minimization strategy.

**Decision taken:**
Optimization strategy focused on reducing database writes.

**Tradeoff taken:**
Increased complexity in the update logic to calculate deltas or specific fields.

**Reason:**
Lower database load and costs.

## Automated food register creation via schema hooks

**Problem:**
Maintaining the food registry as new items are added.

**Solution:**
Database-level automation.

**Decision taken:**
Creating food registry entries automatically using database schema hooks.

**Tradeoff taken:**
Logic is hidden in the database layer (hooks); less explicit flow control.

**Reason:**
Ensures registry is always in sync with creation; zero-configuration for new items.

## Time-based meal slicing tied to IST

**Problem:**
Determining meal times for the active user base.

**Solution:**
Hardcoded Indian Standard Time (IST) logic.

**Decision taken:**
Logic for slicing meals by time is tied to Indian Standard Time (IST).

**Tradeoff taken:**
Global incompatibility; server logic is timezone-dependent.

**Reason:**
Correct meal-time slicing for the primary deployment context (India). Note: Future expectation is to include user-specific timezones.

## Composite menu identity using week start date

**Problem:**
Uniquely identifying menu schedules.

**Solution:**
Date-based identification.

**Decision taken:**
Menus are identified by their "week start date".

**Tradeoff taken:**
Inflexible if schedules don't align with standard weeks.

**Reason:**
Logical grouping for weekly dietary schedules.

## Feature-first delivery vs architectural completeness

**Problem:**
Balancing speed of delivery with system robustness.

**Solution:**
Prioritize user-facing features.

**Decision taken:**
Prioritizing the delivery of user-facing features (voting, viewing) over administrative "quality of life" features.

**Tradeoff taken:**
Missing features for admins (like pre-checks) and accumulation of "temporary" workflows.

**Reason:**
Immediate value to users.

## Simple vote count aggregation vs weighted scoring

**Problem:**
Aggregating votes to determine popular items.

**Solution:**
Count-based aggregation with simple tie-breaking.

**Decision taken:**
Aggregation based primarily on the total number of votes for a food item. Tie-breaker is "like percentage" when counts are equal.

**Tradeoff taken:**
Lacks nuance (e.g., volume vs sentiment balance).

**Reason:**
Simplicity and transparency of the metric; clear "winner" determination.
