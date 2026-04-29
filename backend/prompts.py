def build_analysis_prompt(transcript: str) -> str:
    return f"""You are a rigorous performance assessment engine for DeepThought CultureTech Ventures. Your task is to analyze a supervisor's transcript about a DT Fellow (intern) and produce a structured JSON assessment.

=== DOMAIN KNOWLEDGE ===

--- THE 8 KPIs ---
Supervisors NEVER use the word "KPI". They use plain language. You must map what they say to these IDs:
1. lead_generation - "Lead Generation" - New potential customers identified or contacted
2. lead_conversion - "Lead Conversion" - Leads that become paying customers
3. upselling - "Upselling" - Selling more to existing customers
4. cross_selling - "Cross-selling" - Selling additional products to existing customers
5. nps - "NPS" - Customer satisfaction and likelihood to recommend (e.g., "fewer complaints", "customers are happier")
6. pat - "PAT" - Profit After Tax / bottom-line profitability (e.g., "costs came down", "savings", "wastage reduced")
7. tat - "TAT" - Turnaround Time / process completion speed (e.g., "dispatch is faster", "we finish earlier", "cycle time reduced")
8. quality - "Quality" - Defect rates, rejection rates, customer complaints (e.g., "rejection rate dropped", "fewer defects", "quality improved")

--- THE RUBRIC (1-10) ---

BAND 1: Need Attention (scores 1-3)
- Score 1 "Not Interested": Disengaged, no effort, doesn't attempt work
- Score 2 "Lacks Discipline": Works only when told, no self-initiative, does minimum
- Score 3 "Motivated but Directionless": Enthusiastic but unfocused, wants to help but doesn't know how

BAND 2: Productivity (scores 4-6)
- Score 4 "Careless and Inconsistent": Output exists but quality varies, sometimes good sometimes sloppy
- Score 5 "Consistent Performer": Reliable, does what's asked, meets standards, doesn't exceed scope
- Score 6 "Reliable and Productive": High trust, supervisor gives task and forgets it, efficient execution

BAND 3: Performance (scores 7-10)
- Score 7 "Problem Identifier": Spots patterns, flags issues proactively, notices what others miss, EXPANDS scope beyond assignments
- Score 8 "Problem Solver": Identifies AND implements fixes, builds tools or processes
- Score 9 "Innovative and Experimental": Tests approaches, iterates on solutions, builds new things that didn't exist
- Score 10 "Exceptional Performer": Flawless execution, others learn from their work, creates replicable systems

CRITICAL SCORING RULE — 6 vs 7 boundary:
- Score 6: Takes initiative WITHIN assigned scope. Does tasks without being asked. Example: "He does everything I give him. I don't have to follow up."
- Score 7: EXPANDS the scope. Identifies problems the supervisor hadn't articulated. Example: "She noticed our rejection rate goes up on Mondays and started tracking why."
The key test: Did the Fellow only execute defined tasks? → Max 6. Did the Fellow identify new problems or opportunities? → At least 7.

--- LAYER 1 vs LAYER 2 (CRITICAL) ---

Layer 1 (Execution — necessary but NOT sufficient for high scores):
- Attending meetings, tracking output, following up on delays
- Coordinating between departments
- Handling operational tasks: data entry, vendor calls, reports
- Being physically present and responsive

Layer 2 (Systems Building — the actual mandate for high performance):
- Creating SOPs for recurring tasks
- Building trackers, dashboards, workflows
- Designing accountability structures
- Documenting processes that CONTINUE WORKING after the Fellow leaves

KEY TEST: "If the Fellow left tomorrow, would anything they built keep running?"
If transcript shows ONLY Layer 1 activities → CAP the score at 6, regardless of how enthusiastic the supervisor sounds.

--- SUPERVISOR BIASES TO DETECT ---

1. Helpfulness bias: "She handles all my calls now" sounds impressive but is actually task absorption (Layer 1), not systems building.
2. Presence bias: "He's always on the floor" gets rated higher than "She builds trackers" — physical presence ≠ performance.
3. Halo effect: One impressive story colors the entire assessment. Check for gaps in other dimensions.
4. Recency bias: Supervisor talks about last 2 weeks, ignores the full tenure.
5. Dependency trap: Supervisor is happy because their workload dropped — but if Fellow left, everything collapses. This is a red flag, not a positive signal.

=== YOUR TASK ===

Analyze this transcript carefully. Extract evidence, score the Fellow, and map their work to KPIs.

TRANSCRIPT:
\"\"\"
{transcript}
\"\"\"

=== INSTRUCTIONS ===

1. Extract 4-8 direct quotes from the transcript as evidence items. For each quote:
   - Assign signal: "positive", "negative", or "neutral"
   - Assign dimension: "execution", "systems_building", "kpi_impact", or "change_management"
   - Write a 1-sentence interpretation that flags any supervisor bias if present

2. Score the Fellow 1-10 using the rubric above. Apply these rules strictly:
   - First check: Does transcript show Layer 1 only or also Layer 2? Layer 1 only → cap at 6.
   - Apply the 6 vs 7 boundary strictly: did the Fellow expand scope or just execute within it?
   - Note which supervisor biases are present.
   - Set confidence: "high" (clear, unambiguous evidence), "medium" (mixed signals or sparse data), "low" (insufficient data to assess confidently)
   - Write a justification paragraph citing specific quotes from the transcript.

3. Map the Fellow's work to relevant KPIs from the 8 KPI list. For each KPI identified:
   - Note what in the transcript supports this KPI connection
   - Determine if the impact comes from a SYSTEM the Fellow built (systemOrPersonal: "system") or from the Fellow's personal work that would stop if they left (systemOrPersonal: "personal")

Return ONLY valid JSON. No commentary, no markdown, no explanation before or after. Start your response with {{ and end with }}.

Return this exact JSON structure:
{{
  "score": {{
    "value": <integer 1-10>,
    "label": <exact rubric label string>,
    "band": <"Need Attention" or "Productivity" or "Performance">,
    "justification": <paragraph citing specific evidence from transcript>,
    "confidence": <"high" or "medium" or "low">
  }},
  "evidence": [
    {{
      "quote": <exact quote from transcript>,
      "signal": <"positive" or "negative" or "neutral">,
      "dimension": <"execution" or "systems_building" or "kpi_impact" or "change_management">,
      "interpretation": <one sentence interpretation, flag biases if present>
    }}
  ],
  "kpiMapping": [
    {{
      "kpi": <one of: lead_generation, lead_conversion, upselling, cross_selling, nps, pat, tat, quality>,
      "evidence": <what in transcript supports this KPI connection>,
      "systemOrPersonal": <"system" or "personal">
    }}
  ]
}}"""


def build_gap_prompt(transcript: str) -> str:
    return f"""You are a performance assessment quality-control engine for DeepThought CultureTech Ventures. Your task is to identify what is MISSING from a supervisor transcript and generate targeted follow-up questions.

=== THE 4 ASSESSMENT DIMENSIONS ===

1. execution — "Driving Execution"
   What it covers: Getting things done on time, following up without reminders, initiating work independently, being reliable without supervision.
   Signs it IS covered: Supervisor talks about Fellow's punctuality, follow-through, task completion, reliability.
   Signs it is MISSING: No mention of whether Fellow needs hand-holding, unclear if Fellow initiates or waits.

2. systems_building — "Building Systems"
   What it covers: Creating tools, trackers, SOPs, processes that persist AFTER the Fellow leaves.
   KEY TEST: "If the Fellow left tomorrow, would anything they built keep running?"
   Signs it IS covered: Supervisor mentions dashboards, sheets, SOPs, workflows, documented processes.
   Signs it is MISSING: All work seems personal/manual, nothing about lasting artifacts or institutional memory.

3. kpi_impact — "KPI Impact"
   What it covers: Connecting work to measurable business outcomes — speed, quality, costs, satisfaction, revenue.
   Signs it IS covered: Supervisor mentions specific numbers, improvements, or measurable changes (even in plain language like "dispatch is faster", "fewer complaints").
   Signs it is MISSING: Only soft praise ("he's helpful", "good attitude") with no link to business metrics.

4. change_management — "Change Management"
   What it covers: Getting floor workers to adopt new processes, handling resistance from experienced staff.
   Context: This is where most Fellows fail — a 23-year-old asking a 45-year-old operator to change habits.
   Signs it IS covered: Supervisor mentions how workers responded, any resistance, the Fellow's approach to adoption.
   Signs it is MISSING: No mention of how workers received the Fellow's work, silent on team dynamics.

=== YOUR TASK ===

Review this transcript:

TRANSCRIPT:
\"\"\"
{transcript}
\"\"\"

=== INSTRUCTIONS ===

1. For each of the 4 dimensions (execution, systems_building, kpi_impact, change_management), evaluate whether the transcript adequately covers it.
   - "Adequately covered" means the supervisor gave specific, actionable information about that dimension.
   - Vague praise ("he's good", "I'm happy") does NOT count as coverage.
   - If a dimension IS adequately covered, do NOT include it in gaps.
   - If a dimension is NOT adequately covered, include it as a gap with a specific description of what's missing.

2. Generate 3-5 follow-up questions targeting the identified gaps. Each question must:
   - Be conversational — how a DT intern would naturally ask a factory owner or business owner
   - Target a specific gap dimension
   - Include a "lookingFor" field explaining what a GOOD answer would reveal about the Fellow's performance
   - NOT use jargon — no "KPI", no "systems building", no "execution"

Return ONLY valid JSON. No commentary, no markdown. Start with {{ end with }}.

Return this exact JSON structure:
{{
  "gaps": [
    {{
      "dimension": <"execution" or "systems_building" or "kpi_impact" or "change_management">,
      "detail": <specific description of what the transcript did NOT adequately cover about this dimension>
    }}
  ],
  "followUpQuestions": [
    {{
      "question": <conversational question in plain language>,
      "targetGap": <dimension_id>,
      "lookingFor": <what a good answer would reveal about the Fellow's performance>
    }}
  ]
}}"""
