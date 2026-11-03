# Framing the research question, and replacement texts for the results

This note goes with two drafts in this folder.

- `Introduction_V2_reframed.tex` / `.pdf` is Introduction version 2, rebuilt around a new central question (664 words, 39 references).
- `Introduction_V1_refined.tex` / `.pdf` is Introduction version 1, edited for concision and flow. Its argument and references are unchanged (845 words, 43 references).

Both drafts compile against `../latex_file/references.bib`. Five references used only by version 1 were added to that file: perret2021, fujimoto2022, okada2017, tadelis2016 and slovic1993.

---

## 1. Why the current question is weak

The current version 2 asks "how should a reputation system integrate behavioral evidence over time". This question has three problems.

1. **It has no stakes.** It reads as a design question. Nothing in it says what goes wrong if the answer is wrong.
2. **It has already been answered in part.** Scores, aggregation and graded reputations all integrate evidence over time. An editor may conclude that the question is already settled by Schmid et al. 2023 and Michel-Mata et al. 2024.
3. **It hides the paper's novelty.** The new element is directionality, meaning that losing and regaining standing can require different amounts of evidence. The current question does not mention it.

Strong framings in *Nature*, *Nature Human Behaviour* and *PNAS* usually share three features. They name an assumption that the field makes without noticing. They state a question that a non-specialist can answer with an intuition. They show that the intuition, or the assumption, can be wrong in a way that matters.

## 2. Three candidate framings

### A. The hidden symmetry (recommended as the central question)

> *Should losing a good reputation require as much evidence as regaining one?*

- **Assumption it exposes.** Every existing mechanism uses one rule for both directions, whether a single score, a single threshold or a single observation window.
- **Why it resonates.** Readers know from daily life that trust is lost quickly and regained slowly. They also know that institutions such as graduated sanctions and expiring criminal records treat the two directions differently.
- **How it maps to the results.** Directionality is the question, and Figs. 2–4 answer it. The beneficial direction depends on the norm, and allocating memory to the wrong path can remove cooperation entirely.
- **Risk.** Low. Every claim the framing needs is already shown in the main figures.

### B. Forgiving without excusing (recommended as the stakes)

> *Can a reputation system forgive honest mistakes without excusing deliberate defection?*

- **Why it resonates.** It names a dilemma that applies to courts, marketplaces and platforms, not only to models.
- **How it maps to the results.** Mainly Fig. 5. Tolerance invites occasional defectors, and partial consequences of warning states restore deterrence.
- **Risk.** Moderate if used alone. Exploitation is tested against one family of opportunists (O-DISC), so a framing built only on B promises more generality than the paper shows. Used as the second question, B raises the stakes of A without overreaching.

### C. Consensus without communication (not recommended)

> *Can private observers reach a shared view of others without gossip or institutions?*

- **Why it is weaker.** Michel-Mata et al. 2024 already frame aggregation in these terms. The framing also makes directionality invisible again.

### Recommendation

Use A as the central question and B as its consequence. The reframed version 2 does this. A sets up Figs. 1–4, B sets up Fig. 5, and the closing sentence of the introduction joins them.

### One-line alternatives for the title, abstract or cover letter

- "Should a reputation be as hard to regain as it is to lose?"
- "Reputations are lost and regained by different rules in human societies, but by the same rule in models of cooperation."
- "Does it matter for cooperation how fast reputations are lost and how fast they recover?"

---

## 3. Structure of the reframed version 2

| ¶ | Role | Content |
|---|---|---|
| 1 | Hook | In human societies, losing and regaining standing follow different rules (trust, graduated sanctions, criminal records, impression updating). |
| 2 | Why it matters | Indirect reciprocity needs shared reputations. Private, noisy observation breaks this under most norms. |
| 3 | Root cause and hidden assumption | Overwrite updating causes the fragility. Existing remedies fall into two groups, and both use one rule for loss and recovery. |
| 4 | The two questions | (A) Should loss require as much evidence as recovery? (B) How should incomplete evidence affect treatment? Each has a cost on both sides. Ends with "forgive honest mistakes without excusing deliberate defection". |
| 5 | Approach | Separate warning and recovery paths (Fig. 1). Two design choices, namely how much evidence changes a reputation and how strongly incomplete evidence is expressed. |
| 6 | Findings and implication | Direction matters more than amount. The beneficial direction is norm-specific. The wrong direction can remove cooperation. Tolerance invites opportunists, and partial consequences close the loophole. |

The claim "adding memory in the wrong direction can eliminate cooperation altogether" was checked against the verified data. Recovery-only allocations give zero mean cooperation under SC, SH and SJ.

If you adopt this version, the gap sentence of the abstract should change to match. A possible replacement is: "Existing models let reputations be lost and regained by the same rule, and it is unclear whether the two directions should require the same amount of evidence."

## 4. Changes made to version 1

The argument, the order of paragraphs and the citations are unchanged. The edits are as follows.

1. **Paragraph 1.** A colon is removed, and the sentence is split in two.
2. **Paragraph 2.** The disagreement cascade is made concrete: "A discriminator who refuses to help a recipient it regards as bad may itself be condemned by an observer who regards that recipient as good."
3. **Paragraph 3.** The two open questions are now separate sentences. They are "Should losing and regaining standing require different amounts of evidence?" and "How should evidence that is accumulating, but not yet conclusive, affect how a person is treated?"
4. **Paragraph 4.** It opens with a topic sentence: "Human societies already separate an accumulating record from a final verdict."
5. **Terminology.** "Readout" is replaced by "how strongly these intermediate states are expressed".
6. **"Here we" paragraph.** It is split into an approach paragraph and a findings paragraph, so that the model and the results are not compressed into one block.

Version 1 is the safer choice for a specialist audience, because it follows the field's own logic from leading-eight norms to private assessment. Version 2 is the stronger choice for a broad journal, because it states its question before its literature.

---

## 5. Replacement texts for the results

Each figure has a **headline** and a **key message**. The headline states the finding as a full sentence. The key message gives the evidence behind it in one or two sentences.

These texts replace the result-slide titles and takeaways in `Slides/build/deck_spec.py`. They can also serve as figure-legend titles or as opening sentences of the Results subsections.

### Main figures

**Fig. 2**
- *Headline.* Where inertia sits decides whether private reputations are accurate and shared.
- *Key message.* Without inertia, or with the same small inertia in both directions, private observers either disagree or agree on the wrong verdict. Placing inertia in the norm-appropriate direction makes observers agree and still tell cooperators from defectors.

**Fig. 3**
- *Headline.* Directional inertia makes cooperation both stable and easy to reach.
- *Key message.* Inertia in both directions already stabilizes discriminators, but only a narrow range of starting conditions leads there under Shunning and Stern Judging. The reputation-selected architectures make cooperation the outcome for most initial conditions under all four norms.

**Fig. 4**
- *Headline.* Allocation matters more than the amount of memory.
- *Key message.* With the same number of intermediate states, cooperation ranges from absent to high depending on which path receives them, and adding states beyond a few brings little further gain. The architectures chosen only for reputational quality are the best allocations at their depth.

**Fig. 5**
- *Headline.* Forgiveness can shelter opportunists, and partial consequences restore deterrence.
- *Key message.* Mechanisms that forgive isolated negative assessments, including aggregation and quantitative scores, exclude unconditional defectors but can be invaded by individuals who defect only occasionally. Letting warning states carry partial consequences removes this loophole over a bounded range of tolerance strengths while cooperation stays high.

### Extended Data figures

**ED Fig. 1**
- *Headline.* The selected architectures are not an artifact of the thresholds.
- *Key message.* Changing the selection criteria changes the exact depths, but the qualifying architectures stay compact and keep the same qualitative pattern.

**ED Fig. 2**
- *Headline.* Directional inertia removes history dependence.
- *Key message.* With one-step inertia, discriminator populations are bistable, so cooperation depends on how reputations start. The selected architectures have a single high-reputation state, and cooperation is nearly insensitive to initial reputations.

**ED Fig. 3**
- *Headline.* Depth and strength shape reputation states differently across norms.
- *Key message.* High reputation and bistability depend jointly on the norm, the direction of inertia and how strongly intermediate states are expressed.

**ED Fig. 4**
- *Headline.* Inertia keeps discriminators' reputation intact when defectors are common.
- *Key message.* Under one-step inertia, discriminators lose their reputation abruptly once they become rare. Directional inertia delays or removes this collapse, so cooperation is reached from a wider range of starting points.

**ED Fig. 5**
- *Headline.* The advantage of directional inertia holds across benefit-to-cost ratios.
- *Key message.* Under Simple Standing, cooperation stays high through a cooperative mixture of discriminators and unconditional cooperators, even where pure discriminator populations can be invaded by unconditional cooperators.

**ED Fig. 6**
- *Headline.* Tolerance and strictness are not interchangeable.
- *Key message.* Tolerance stabilizes cooperative discriminators under every norm. Strict recovery alone does not, and its effect depends on the norm.

**ED Fig. 7**
- *Headline.* Directional inertia widens the error range in which discriminators are protected.
- *Key message.* Under Shunning and Stern Judging, defectors invade almost everywhere without inertia or with one-step inertia. The selected architectures exclude them over most error rates.

**ED Fig. 8**
- *Headline.* High cooperation and local protection are different properties.
- *Key message.* Cooperation follows the same norm-specific directions as in Fig. 4, but the depths that protect pure discriminator populations are not the same as those that give the most cooperation.

**ED Fig. 9**
- *Headline.* Protective tolerance strengths exist for every norm.
- *Key message.* Each norm admits a range of tolerance strengths that excludes opportunists while cooperation stays high. The range narrows at low benefit-to-cost ratios and closes under Shunning at b/c = 2.

### Notes on wording

- The headlines avoid numbers. Specific values (basin sizes, cooperation levels, the secure tolerance range) belong in the legends and in the Results text.
- "Directional inertia" refers to the selected architectures, SC (2,0), SH (3,0), SJ (4,3) and SS (1,2). If you prefer a neutral term, "the selected architectures" can replace it in every headline without changing the meaning.
- "Readout" does not appear in any of the texts.
