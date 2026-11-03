"""Single content specification for the presentation.

Both the Beamer source (make_beamer.py) and the PowerPoint version
(make_pptx.js, via deck.json) are generated from this file, so the two decks
share structure, wording, equations and figures.

Inline markup in text strings:
  $...$     inline math (LaTeX)
  **...**   bold
  !!...!!   accent color (orange)
Display equations are referenced by id from EQUATIONS.
"""

# ---------------------------------------------------------------------------
# Display equations (LaTeX).  size: normal (10 pt in Beamer), small, footnotesize
# ---------------------------------------------------------------------------
EQUATIONS = {
    "assess1": (r"P^{+}_{\mathrm{C|G}}=\varepsilon,\quad P^{+}_{\mathrm{D|G}}=e_2,\quad P^{+}_{\mathrm{D|B}}=e_2+(1-2e_2)\,q", "small"),
    "assess2": (r"P^{+}_{\mathrm{C|B}}=e_2+(1-2e_2)\bigl[(1-e_1)\,p+e_1\,q\bigr],\quad \varepsilon=(1-e_1)(1-e_2)+e_1e_2", "small"),
    "sigma": (r"\sigma(\mathrm{G})=1,\qquad \sigma(\mathrm{W}_m)=\alpha^m", "small"),
    "sigma2": (r"\sigma(\mathrm{B})=0,\qquad \sigma(\mathrm{S}_n)=1-\beta^n", "small"),
    "recog": (r"\Delta g=\frac{g_{\mathrm{DISC}}+g_{\mathrm{ALLC}}}{2}-g_{\mathrm{ALLD}},\qquad \bar d=\sum_I\frac{n_I}{N}\,d_I", "normal"),
    "paths": (r"\pi_{\mathrm{W}_m}=v^m\,\pi_{\mathrm{G}},\qquad \pi_{\mathrm{S}_n}=u^n\,\pi_{\mathrm{B}}", "small"),
    "flux": (r"v^{k_1+1}\,\pi_{\mathrm{G}}=u^{k_2+1}\,\pi_{\mathrm{B}}", "small"),
    "pi": (r"\pi_{\mathrm{G}}=\frac{u^{k_2+1}}{Z(u)},\qquad \pi_{\mathrm{B}}=\frac{v^{k_1+1}}{Z(u)},\qquad Z(u)=v^{k_1}+u^{k_2}-v^{k_1}u^{k_2}", "small"),
    "map": (r"\mathscr{R}(u)=\sum_{\ell}\pi_\ell(u)\,\sigma(\ell)=\frac{u^{k_2+1}\sum_{m=0}^{k_1}(\alpha v)^m+v^{k_1+1}\sum_{n=1}^{k_2}u^n(1-\beta^n)}{v^{k_1}+u^{k_2}-v^{k_1}u^{k_2}}", "small"),
    "full": (r"\mathscr{R}(u)=\frac{u^{k_2}\bigl(1-v^{k_1+1}\bigr)}{Z(u)}=\frac{\mathbb{E}[\Theta_{\mathrm{G}\to\mathrm{B}}]}{\mathbb{E}[\Theta_{\mathrm{G}\to\mathrm{B}}]+\mathbb{E}[\Theta_{\mathrm{B}\to\mathrm{G}}]}", "small"),
    "slope": (r"1-\mathscr{R}(1-v)=(1-\alpha)\,v+O(v^2),\qquad \mathscr{R}'(1)=1-\alpha", "small"),
    "uI": (r"u_{\mathrm{ALLC}}=\Phi_{\mathrm{C}}(\bar r),\quad u_{\mathrm{ALLD}}=\Phi_{\mathrm{D}}(\bar r),\quad u_{\mathrm{DISC}}=h_{\mathrm{GG}}P^{+}_{\mathrm{C|G}}+h_{\mathrm{GB}}\bigl(P^{+}_{\mathrm{C|B}}+P^{+}_{\mathrm{D|G}}\bigr)+h_{\mathrm{BB}}P^{+}_{\mathrm{D|B}}", "small"),
    "sc": (r"r_I^*=\mathscr{R}\bigl(u_I(\boldsymbol{r}^*;\boldsymbol{f})\bigr),\qquad \frac{\mathrm{d}r_I}{\mathrm{d}\tau}=\mathscr{R}(u_I)-r_I,\quad r_I(0)=1", "small"),
    "res": (r"u_{\mathrm{R}}(r)=r\,\Phi_{\mathrm{C}}(r)+(1-r)\,\Phi_{\mathrm{D}}(r),\qquad F(r)=\mathscr{R}\bigl[u_{\mathrm{R}}(r)\bigr]-r", "small"),
    "pay": (r"\Pi_I=(1-e_1)\bigl[b\,(f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\,r_I^*)-c\,\chi_I\bigr],\qquad \chi_{\mathrm{ALLC}}=1,\ \chi_{\mathrm{ALLD}}=0,\ \chi_{\mathrm{DISC}}=\bar r^*", "small"),
    "rep": (r"\dot f_I=f_I\bigl(\Pi_I-\bar\Pi\bigr),\qquad \bar\rho\approx\omega_{\mathrm{C}}\,\bar\rho_{\mathrm{C}}", "small"),
    "mut": (r"\Lambda_{\mathrm{X}}=\frac{\Pi_{\mathrm{X}}-\Pi_{\mathrm{R}}}{c(1-e_1)}=\bigl(r_{\mathrm{R}}^*-\chi_{\mathrm{X}}\bigr)-\frac{b}{c}\bigl(r_{\mathrm{R}}^*-r_{\mathrm{X}}^*\bigr),\qquad r_{\mathrm{X}}^*=\mathscr{R}(u_{\mathrm{X}})", "small"),
    "win": (r"R_{\mathrm{L}}=\frac{r_{\mathrm{R}}^*}{r_{\mathrm{R}}^*-\mathscr{R}(\Phi^*_{\mathrm{D}})}<\frac{b}{c}<\frac{1-r_{\mathrm{R}}^*}{\mathscr{R}(\Phi^*_{\mathrm{C}})-r_{\mathrm{R}}^*}=R_{\mathrm{U}}", "small"),
    "chord": (r"R_{\mathrm{L}}<R_{\mathrm{U}}\iff r_{\mathrm{R}}^*\,\mathscr{R}(\Phi^*_{\mathrm{C}})+(1-r_{\mathrm{R}}^*)\,\mathscr{R}(\Phi^*_{\mathrm{D}})<\mathscr{R}(u_{\mathrm{R}}^*)", "small"),
    "lam": (r"\Lambda(\delta)=\delta\,r_{\mathrm{R}}^*-\frac{b}{c}\bigl[r_{\mathrm{R}}^*-r_{\mathrm{X}}^*(\delta)\bigr],\qquad u_{\mathrm{X}}(\delta)=u_{\mathrm{R}}^*-\delta\,r_{\mathrm{R}}^*\,\Delta\Phi^*", "small"),
    "slope0": (r"\Lambda'(0)=r_{\mathrm{R}}^*\Bigl[1-\frac{b}{c}\,\Delta\Phi^*\,\mathscr{R}'(u_{\mathrm{R}}^*)\Bigr]", "small"),
    "hmin": (r"H_{\min}=\min_{0\leq\delta\leq1}\frac{r_{\mathrm{R}}^*-r_{\mathrm{X}}^*(\delta)}{\delta\,r_{\mathrm{R}}^*}\geq\frac{c}{b}", "small"),
    "errfree": (r"e_1=e_2=0,\ \beta=1,\ k_1\geq1:\qquad \text{every O-DISC excluded}\iff\alpha\leq1-\frac{c}{b}", "small"),
}


# ---------------------------------------------------------------------------
# Element constructors
# ---------------------------------------------------------------------------
def bullets(*items, size="normal"):
    return {"type": "bullets", "items": list(items), "size": size}

def text(s, size="normal", color=None, bold=False):
    return {"type": "text", "text": s, "size": size, "color": color, "bold": bold}

def eq(eid, lead=None):
    return {"type": "eq", "id": eid, "lead": lead}

def card(title, items=None, body=None, style="plain"):
    return {"type": "card", "title": title, "items": items or [], "body": body, "style": style}

def cards(*cs):
    return {"type": "cards", "cards": list(cs)}

def takeaway(s):
    return {"type": "takeaway", "text": s}

def figure(file, h, caption=None):
    # h: height as a fraction of the content area height
    return {"type": "figure", "file": file, "h": h, "caption": caption}

def caption(s):
    return {"type": "caption", "text": s}

def note(s):
    return {"type": "note", "text": s}

def table(header, rows, widths, size="small", first_bold=True):
    return {"type": "table", "header": header, "rows": rows, "widths": widths,
            "size": size, "first_bold": first_bold}

def flow(nodes, connectors):
    return {"type": "flow", "nodes": nodes, "connectors": connectors}

def sequence(assess, images):
    return {"type": "sequence", "assess": assess, "images": images}

def agenda(items):
    return {"type": "agenda", "items": items}

def qa(rows):
    return {"type": "qa", "rows": rows}


# ---------------------------------------------------------------------------
# Slides
# ---------------------------------------------------------------------------
SLIDES = []

def slide(**kw):
    SLIDES.append(kw)


# ----------------------------------------------------------------- title
slide(kind="title",
      title="Indirect reciprocity with inertial reputation updating",
      subtitle="How reputations accumulate and express behavioral evidence",
      author="Wenqiang Zhu",
      institute="School of Artificial Intelligence, Beihang University",
      date="Discussion with Christian Hilbe · November 2026")

slide(kind="content", title="Overview",
      body=[agenda([
          ("1", "Motivation and research gap", "Two candidate storylines (Introduction V1 and V2)"),
          ("2", "Model and methods", "Inertial records, stationary reputation map, population theory, invasion analysis"),
          ("3", "Results", "Main-text Figs. 2–5"),
          ("4", "Conclusion", "Answers to the research gap and points for discussion"),
          ("5", "Supplementary results", "Extended Data and analytical results (backup)"),
      ])])

# ----------------------------------------------------------------- 1 motivation
slide(kind="section", title="Motivation and research gap", number="1")

slide(kind="content", title="Two candidate storylines",
      body=[cards(
          card("Storyline A · Introduction V1",
               ["Start from the failure of classical norms under private assessment",
                "Identify overwrite updating as a root cause of the fragility",
                "End with two explicit open questions about evidence"],
               style="blue"),
          card("Storyline B · Introduction V2",
               ["Start from reputation as a currency of social life",
                "Ask how a reputation system should integrate evidence over time",
                "Motivate directional inertia by human evaluation and institutions"],
               style="accent")),
            text("Both storylines lead to the same framework and the same results. The following slides present each line in turn, then compare them.",
                 size="small", color="muted")])

slide(kind="content", tag="Storyline A · Intro V1",
      title="Classical norms need reputations that are shared",
      body=[bullets(
          "Helping others raises one's standing and the chance of being helped by third parties (indirect reciprocity).",
          "The leading-eight norms stabilize cooperation when reputations are public, even with occasional errors.",
          "Under private, noisy assessment, observers hold different views of the same person, and most leading-eight norms fail."),
            flow(["Accurate reputations\n(cooperators vs defectors)",
                  "Shared reputations\n(observers agree)",
                  "Stable cooperation"], ["+", "→"]),
            takeaway("Central problem: under private assessment, reputations must remain both **accurate** and **shared**.")],
      source="Nowak & Sigmund 1998, 2005; Ohtsuki & Iwasa 2004, 2006; Hilbe et al. 2018; Fujimoto & Ohtsuki 2022, 2023")

slide(kind="content", tag="Storyline A · Intro V1",
      title="Part of the fragility lies in how reputations are updated",
      body=[bullets(
          "In the standard binary framework, every new assessment replaces the previous image.",
          "A single error can reverse a reputation built over many interactions, and the next observation can reverse it again.",
          "Under private assessment these flips spread. Discriminators are condemned when observers disagree about the recipient."),
            sequence(["+", "+", "+", "+", "−", "+", "+"], ["G", "G", "G", "G", "B", "G", "G"]),
            takeaway("Cooperation depends not only on **which norm** is used, but also on **how much evidence** is required before a judgment is revised.")],
      source="Ohtsuki & Iwasa 2004; Hilbe et al. 2018; Radzvilavicius et al. 2019; Okada 2020")

slide(kind="content", tag="Storyline A · Intro V1",
      title="Existing remedies treat losing and regaining standing alike",
      body=[cards(
          card("Restore agreement",
               ["Public institutions", "Gossip", "Empathetic evaluation", "Opinion synchronization"]),
          card("Integrate more information",
               ["Generous or stochastic assessment", "Graded reputations, reasoning about errors",
                "Quantitative scores", "Aggregation of observations"])),
            text("Using more than the latest observation helps but needs tolerance, and tolerance can also forgive deliberate defection. Loss and recovery of standing are governed by one score, threshold or window.",
                 size="small"),
            card("Open questions", [
                "Should losing and regaining standing require different amounts of evidence?",
                "How should accumulating but inconclusive evidence affect how a person is treated?"],
                style="accent")],
      source="Radzvilavicius et al. 2019, 2021; Kawakatsu et al. 2024; Murase & Hilbe 2023, 2024; Tham et al. 2026; Schmid et al. 2021, 2023; Clark et al. 2020; Michel-Mata et al. 2024")

slide(kind="content", tag="Storyline A · Intro V1",
      title="Societies separate an accumulating record from a verdict",
      body=[cards(
          card("Institutions",
               ["Graduated sanctions escalate with repeated violations",
                "Online markets summarize long feedback histories",
                "Criminal records stop signaling risk only after years"]),
          card("Impression formation",
               ["Impressions are updated as behavior unfolds",
                "The weight of new evidence depends on its diagnostic value",
                "Asymmetries run both ways: trust is lost faster, beliefs about bad people are volatile"])),
            takeaway("Standing can persist while contrary evidence accumulates, and losing and regaining it need not require the same evidence.")],
      source="Ostrom 1990; Cox et al. 2010; Tadelis 2016; Blumstein & Nakamura 2009; Mende-Siedlecki et al. 2013; Slovic 1993; Siegel et al. 2018")

slide(kind="content", tag="Storyline B · Intro V2",
      title="Private information makes reputations fragile",
      layout="two", ratio=0.56,
      left=[bullets(
          "Reputation lets past behavior shape future opportunities, and social norms turn behavior into moral standing.",
          "Classical norms sustain cooperation when observers agree on each other's standing.",
          "In reality, information is noisy and privately interpreted, so observers disagree whether an action was justified.",
          "In binary models each assessment overwrites the image, so a single mistake can undo a long record.")],
      right=[card("Recent remedies", [
          "**Restore agreement:** institutions, gossip, empathy, opinion synchronization",
          "**Use more information:** generosity, graded reputations, reasoning about errors, quantitative scores, aggregation"]),
             text("These approaches show that information beyond the latest observation can stabilize cooperation.", size="small", color="muted")],
      source="Milinski 2016; Nowak & Sigmund 2005; Hilbe et al. 2018; Murase & Hilbe 2024; Schmid et al. 2023; Michel-Mata et al. 2024")

slide(kind="content", tag="Storyline B · Intro V2",
      title="Gap: how should reputations integrate evidence over time?",
      layout="two", ratio=0.52,
      left=[bullets(
          "Accumulating information is not the same as using more of it.",
          "A good reputation may persist while contrary evidence accumulates, and recovery may follow a different process.",
          "Existing approaches treat losing and regaining standing as one process, with one score, threshold or window.")],
      right=[card("Human evaluation is directional", [
          "Impressions are revised over sequences of behavior",
          "Good and bad individuals are updated asymmetrically",
          "Graduated sanctions escalate with repeated violations",
          "Restoring standing after a criminal record takes years"])],
      bottom=[takeaway("Standing should have inertia, and the inertia of losing standing may differ from that of regaining it.")],
      source="Schmid et al. 2023; Michel-Mata et al. 2024; Yamamoto et al. 2025; Siegel et al. 2018; Ostrom 1990; Blumstein & Nakamura 2009")

slide(kind="content", title="The two storylines at a glance",
      body=[table(["", "Storyline A (Introduction V1)", "Storyline B (Introduction V2)"], [
          ["Opening", "Leading-eight norms fail under private assessment", "Reputation as a currency of social life"],
          ["Central problem", "Reputations must be accurate and shared", "How should evidence be integrated over time?"],
          ["Diagnosis", "Overwrite updating triggers disagreement cascades", "Loss and recovery are treated as one process"],
          ["Gap", "Two explicit questions: evidence asymmetry and the role of inconclusive evidence", "Directional inertia, motivated by human evaluation and institutions"],
          ["Tone", "Problem-driven, close to the private-assessment literature", "Conceptual, aimed at a broad readership"]],
          widths=[0.18, 0.41, 0.41], size="small")])

slide(kind="content", title="This work: separate accumulation from interpretation of evidence",
      layout="two", ratio=0.46,
      left=[card("Evidence accumulation", body="Depths $k_1$, $k_2$ determine how much consistent evidence changes an established reputation.", style="blue"),
            card("Evidence interpretation", body="Strengths $\\alpha$, $\\beta$ determine how strongly incomplete evidence already affects treatment.", style="accent")],
      right=[text("**Main findings**"),
             bullets(
                 "The **allocation** of inertia between losing and regaining standing determines whether private reputations are accurate and shared.",
                 "Compact, norm-specific architectures make cooperation **stable and accessible**. Allocation matters more than amount.",
                 "Tolerance **shelters occasional defectors**. Giving warning states partial consequences restores deterrence.")])

# ----------------------------------------------------------------- 2 model
slide(kind="section", title="Model and methods", number="2")

slide(kind="content", title="Donation game with private assessment",
      layout="two", ratio=0.6,
      left=[bullets(
          "A donor pays $c$ and the recipient gains $b>c$. Strategies: ALLC, ALLD and DISC (helps recipients it regards as good).",
          "A random observer judges the action with **its own** image of the recipient (private assessment).",
          "Errors: failed cooperation ($e_1$) and reversed assessment ($e_2$).", size="small")],
      right=[table(["Norm", "$p$", "$q$"],
                   [["Scoring (SC)", "1", "0"], ["Shunning (SH)", "0", "0"],
                    ["Stern Judging (SJ)", "0", "1"], ["Simple Standing (SS)", "1", "1"]],
                   widths=[0.7, 0.15, 0.15], size="footnotesize"),
             text("$p$, $q$: probability that C or D towards a recipient regarded as bad is assessed as good. C towards a good recipient is good, D is bad.", size="footnotesize", color="muted")],
      bottom=[eq("assess1", lead="Positive recorded assessment, given intended action and the observer's image of the recipient:"),
              eq("assess2")],
      source="Reference parameters: $b/c=5$, $e_1=e_2=0.02$")

slide(kind="content", title="Inertial reputation updating",
      layout="two", ratio=0.44,
      left=[figure("Fig1_model", 0.68,
                   caption="**Fig. 1** | **a**, instantaneous updating. **b**, inertial updating with warning and recovery paths. An assessment in the opposite direction returns the record to the established state.")],
      right=[bullets(
          "Tolerance depth $k_1$: warning states $\\mathrm{W}_m$. Strictness depth $k_2$: recovery states $\\mathrm{S}_n$.",
          "Loss needs $k_1+1$ consecutive negative assessments, recovery $k_2+1$ positive ones.", size="small"),
             eq("sigma", lead="A consulted record is interpreted as good with probability"),
             eq("sigma2"),
             card("Compared settings ($\\alpha=\\beta=1$)", [
                 "No inertia $(0,0)$ and one-step $(1,1)$",
                 "Selected: SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$"])])

slide(kind="content", title="Two levels of analysis",
      body=[flow(["Finite-population\nsimulations",
                  "Select architectures\n(reputation only)",
                  "Mean-field theory\n(stationary reputations)",
                  "Evolution and\ninvasion"], ["→", "→", "→"]),
            cards(
                card("Reputation formation (Fig. 2)", [
                    "$N=150$, equal numbers of ALLC, ALLD and DISC",
                    "Every DISC keeps a record of everyone; no closure",
                    "30 replicates and a drift check for the selection"]),
                card("Evolutionary analysis (Figs. 3–5)", [
                    "Reputations equilibrate faster than strategies",
                    "Replicator dynamics from 512 area-uniform initial compositions",
                    "Local invasion by rare ALLC, ALLD and O-DISC mutants"]))])

slide(kind="content", title="Measuring recognition and agreement",
      body=[bullets(
          "$g_I$: probability that a DISC observer regards a type-$I$ individual as good.",
          "$d_I$: probability that two DISC observers disagree about the same type-$I$ individual."),
            eq("recog"),
            bullets(
                "**Selection rule:** among allocations with $\\Delta g\\geq0.8$ and $\\bar d\\leq0.1$, take the smallest total depth $K=k_1+k_2$.",
                "**Selected:** SC $(2,0)$, SH $(3,0)$, SJ $(4,3)$, SS $(1,2)$, chosen without reference to evolutionary outcomes."),
            takeaway("Agreement alone is not enough: observers can agree that everyone is bad.")])

slide(kind="content", title="The stationary reputation map",
      body=[text("A record with independent assessments, positive with probability $u$ ($v=1-u$), is a Markov chain $T(u)=uT^{+}+vT^{-}$.", size="small"),
            eq("paths", lead="**1** Path states are entered only from their predecessor:"),
            eq("flux", lead="**2** Flux balance between good and bad standing:"),
            eq("pi", lead="**3** Normalization:"),
            eq("map", lead="**4** Reputation map (stationary probability of being regarded as good):")])

slide(kind="content", title="Properties of the reputation map",
      layout="two", ratio=0.55,
      left=[bullets("No inertia: $\\mathscr{R}(u)=u$.", "Full strengths ($\\alpha=\\beta=1$): fraction of time in good standing,", size="small"),
            eq("full"),
            bullets("Mostly good record ($k_1\\geq1$):", size="small"),
            eq("slope"),
            bullets("$\\mathscr{R}$ increases with $\\alpha$ and decreases with $\\beta$, and it is concave when $k_2=0$.", size="small"),
            takeaway("With full tolerance strength, rare negative evidence barely changes a good reputation.")],
      right=[figure("reputation_map", 0.84,
                    caption="$\\mathscr{R}(u)$ for SJ architectures. Inset: near $u=1$ the slope is $1-\\alpha$.")])

slide(kind="content", title="From single records to population reputations",
      body=[text("**Mean-field closure.** (A1) Donor and observer images of a recipient are independent given its strategy. (A2) Assessments entering a record are independent with probability $u_I$.", size="small"),
            eq("uI"),
            eq("sc", lead="Self-consistency, with the branch reached from initially good records:"),
            eq("res", lead="Homogeneous DISC population:"),
            text("Stable roots have $F'<0$, and folds satisfy $F=F'=0$. The resident reputation $r_{\\mathrm{R}}^*$ is the highest strictly stable root.", size="small")])

slide(kind="content", title="Strategy evolution and measures of cooperation",
      body=[eq("pay", lead="Payoffs per unit time, with stationary reputations recomputed at every composition:"),
            eq("rep", lead="Replicator dynamics and cooperation:"),
            bullets(
                "Intended cooperation $\\rho_{\\mathrm{int}}=f_{\\mathrm{ALLC}}+f_{\\mathrm{DISC}}\\,\\bar r^*$; realized $\\rho=(1-e_1)\\rho_{\\mathrm{int}}\\leq0.98$.",
                "$\\bar\\rho$: mean long-run cooperation over 512 area-uniform initial compositions; $\\omega_{\\mathrm{C}}$: cooperative basin; $\\bar\\rho_{\\mathrm{C}}$: cooperation within it.",
                size="small")])

slide(kind="content", title="Local stability against rare unconditional mutants",
      body=[eq("mut", lead="A rare mutant X that intends to help with probability $\\chi_{\\mathrm{X}}$ (ALLD: $\\chi=0$, ALLC: $\\chi=1$):"),
            eq("win", lead="Pure DISC resists both ALLD and ALLC if and only if"),
            eq("chord", lead="The window is open if and only if $\\mathscr{R}$ lies above its chord:"),
            takeaway("Without inertia $\\mathscr{R}$ is linear, so no $b/c$ protects pure DISC. Inertia bends $\\mathscr{R}$ and opens the window.")])

slide(kind="content", title="Opportunistic discriminators (O-DISC)",
      body=[text("O-DISC withholds help from a recipient it regards as good with probability $\\delta$ ($\\delta=0$: DISC, $\\delta=1$: ALLD).", size="small"),
            eq("lam"),
            eq("slope0", lead="Weak opportunism invades when the reputation response is flat:"),
            eq("hmin", lead="Every O-DISC mutant is excluded if and only if"),
            card("Exact result in the error-free limit", body="$e_1=e_2=0$, $\\beta=1$, $k_1\\geq1$: every O-DISC mutant is excluded if and only if $\\alpha\\leq1-c/b$ (i.e. $\\alpha\\leq0.8$ at $b/c=5$), for all four norms and all $k_2$.",
                 style="accent")])

# ----------------------------------------------------------------- 3 results
slide(kind="section", title="Results", number="3")

slide(kind="figure", title="Directional inertia restores recognition and agreement",
      fig="Fig2", side=True,
      caption="**Fig. 2** | **a–d**, private image matrices (rows: DISC observers; columns: DISC, ALLC, ALLD targets; blue: good) without inertia, with one-step inertia and with the selected architectures. **e–h**, separation $\\Delta g$ (color) and disagreement $\\bar d$ (circle area) across $k_1$, $k_2$. Stars: smallest $K$ with $\\Delta g\\geq0.8$ and $\\bar d\\leq0.1$.",
      takeaway="One-step inertia fails: SH agrees that everyone is bad, and SJ keeps disagreeing. Norm-specific allocations achieve both recognition and agreement.")

slide(kind="figure", title="Selected architectures make cooperation stable and accessible",
      fig="Fig3", side=True,
      caption="**Fig. 3** | Replicator dynamics of ALLC, ALLD and DISC without inertia (**a**), with one-step inertia (**b**) and with the selected architectures (**c**). Filled and open circles: stable and unstable equilibria. Shading: basin of a cooperative state. Percentages: intended cooperation. $b/c=5$, $e_1=e_2=0.02$.",
      takeaway="Cooperative basins grow from 8% (SH) and 23% (SJ) under one-step inertia to 70–88% under the selected architectures. Under SS, the attractor is a stable DISC–ALLC mixture.",
      note="SC panel in **a** to be redrawn as a single line of equilibria.")

slide(kind="figure", title="Allocation, not amount, determines cooperation",
      fig="Fig4_verified", side=True,
      caption="**Fig. 4** | Mean realized cooperation $\\bar\\rho$ (512 initial compositions) for every allocation $(k_1,k_2)$ at total depth $K$. Color: tolerance fraction $k_1/K$. Black line: best allocation at each $K$. $\\alpha=\\beta=1$, $b/c=5$.",
      takeaway="At fixed depth, cooperation ranges from none to high depending on direction. The reputation-selected architectures are the best allocations at their depths, and extra depth saturates.",
      note="Rendered from the verified data; manuscript artwork to be updated.")

slide(kind="figure", title="Tolerance invites opportunism; lower tolerance strength restores deterrence",
      fig="Fig5", side=False,
      caption="**Fig. 5** | **a**, invasion payoff $\\Lambda(\\delta)$ of O-DISC under SJ: one-step inertia, $(4,3)$ with $\\alpha=1$ and $0.8$, aggregation and a quantitative score. **b**, $(4,3)$ against $\\alpha$: invasion endpoint $\\delta_c$ (top) and resident cooperation (bottom). Green: secure range $\\alpha_{\\mathrm{L}}<\\alpha\\leq\\alpha_{\\mathrm{U}}$. $\\beta=1$, $b/c=5$.",
      takeaway="All mechanisms exclude ALLD, yet partial opportunists invade ($0<\\delta<0.365$ for $(4,3)$ at $\\alpha=1$). For $0.57<\\alpha\\leq0.80$, every O-DISC mutant is excluded and cooperation stays high.")

# ----------------------------------------------------------------- 4 conclusion
slide(kind="section", title="Conclusion", number="4")

slide(kind="content", title="Back to the research gap",
      body=[qa([
          ("How should reputations integrate evidence over time?",
           "Separately for losing and regaining standing. The **allocation** of inertia, not its amount, decides whether private reputations are accurate and shared."),
          ("Does this matter for the evolution of cooperation?",
           "Yes. Compact architectures selected on reputational criteria alone make cooperation **stable and accessible** under all four norms."),
          ("Is tolerance safe?",
           "No. Tolerance **shelters occasional defectors** even when ALLD is excluded. Partial consequences of warning states ($\\alpha<1$) restore deterrence while cooperation stays high.")])])

slide(kind="standout",
      title="Reputation-based cooperation depends not only on which behaviors are judged good, but also on how reputations accumulate and express behavioral evidence.",
      chips=["**Conceptual:** accumulation versus interpretation of evidence",
             "**Analytical:** closed-form reputation map, chord and family criteria",
             "**Evolutionary:** norm-specific architectures and the tolerance–accountability trade-off"])

slide(kind="content", title="Points for discussion",
      body=[cards(
          card("Narrative and venue", ["Storyline A or B?", "Target journal and framing"]),
          card("Evolving architectures", ["Let $k_1$, $k_2$, $\\alpha$, $\\beta$ evolve", "Co-evolution with norms"]),
          card("Strategic opportunism", ["Defections timed to the record", "Temporally correlated omissions"])),
            cards(
          card("Beyond mean field", ["Simultaneous reputation and strategy change", "Structured populations"]),
          card("Combining mechanisms", ["Inertia plus opinion synchronization", "Dual (recipient) assessment"]),
          card("Empirical tests", ["Partial distrust after a single lapse", "Norm-dependent asymmetric updating"]))])

# ----------------------------------------------------------------- 5 supplementary
slide(kind="section", title="Supplementary results", number="5", appendix=True)

slide(kind="figure", title="Selection is robust across criteria", fig="ED_Fig1", side=True, backup=True,
      caption="**Extended Data Fig. 1** | **a–d**, $\\Delta g$ against $\\bar d$ for all depth pairs (30 replicates; color: total depth $K$); stars: selected pairs. **e–h**, minimum-depth pair selected as the separation and disagreement thresholds vary; orange: default criteria.",
      takeaway="Exact depth pairs depend on the thresholds, but compact, norm-specific architectures qualify over a wide range of criteria.")

slide(kind="figure", title="One-step inertia is bistable; the selected architectures are not", fig="ED_Fig2", side=True, backup=True,
      caption="**Extended Data Fig. 2** | **a–d**, reputation dynamics in homogeneous DISC populations (gray: none; blue: one-step; red: selected). **e–h**, mean cooperation $\\bar\\rho$ after all-good (solid) and all-bad (hatched) initial reputations.",
      takeaway="One-step inertia leaves SC, SH and SJ bistable, so cooperation under SH and SJ collapses from all-bad records. The selected architectures have a single high-reputation state.")

slide(kind="figure", title="Strengths and depths jointly shape reputation equilibria", fig="ED_Fig3", side=True, backup=True,
      caption="**Extended Data Fig. 3** | Highest stable reputation of a homogeneous DISC population across $(\\alpha,\\beta)$ at one-step depths (**a–d**) and across $(k_1,k_2)$ with $\\alpha=\\beta=1$ (**e–h**). Hatching: bistability; stars: selected architectures.",
      takeaway="Reputation levels and bistability depend on the norm and on the direction and strength of inertia.")

slide(kind="figure", title="Why basins expand: the ALLD–DISC edge", fig="ED_Fig4", side=True, backup=True,
      caption="**Extended Data Fig. 4** | **a–d**, DISC reputation along the ALLD–DISC edge (solid: stable; dashed: unstable; diamonds: folds). **e–h**, payoff advantage of DISC over ALLD on the all-good branch.",
      takeaway="Under one-step inertia DISC loses its good reputation abruptly when rare. The selected architectures shift (SH) or remove (SC, SJ) this fold.")

slide(kind="figure", title="Benefit-to-cost ratio and local protection", fig="ED_Fig5", side=True, backup=True,
      caption="**Extended Data Fig. 5** | Mean cooperation $\\bar\\rho$ against $b/c$. Solid: pure DISC resists ALLC and ALLD ($R_{\\mathrm{L}}<b/c<R_{\\mathrm{U}}$); dashed: not protected. Means over eight samples of 512 initial compositions.",
      takeaway="The selected architectures give the most cooperation across $b/c$. Under SS, cooperation stays high even above $R_{\\mathrm{U}}\\approx4$.")

slide(kind="figure", title="Tolerance and strictness strengths act differently", fig="ED_Fig6", side=True, backup=True,
      caption="**Extended Data Fig. 6** | One-step depths. **a–d**, dynamics with tolerance only, $(\\alpha,\\beta)=(1,0)$ (top), and strictness only, $(0,1)$ (bottom). **e–h**, mean cooperation over the $(\\alpha,\\beta)$ plane. **i–l**, local invasion classes.",
      takeaway="Tolerance only stabilizes highly cooperative DISC populations under all four norms. Strictness only does not, and its effect depends on the norm.")

slide(kind="figure", title="Local protection across error rates", fig="ED_Fig7", side=True, backup=True,
      caption="**Extended Data Fig. 7** | Local invasion classes over implementation error $e_1$ and assessment error $e_2$ without inertia (**a**), with one-step inertia (**b**) and with the selected architectures (**c**). Pink: ALLD invades; purple: ALLC invades; green: DISC resists both.",
      takeaway="The selected architectures exclude ALLD over most error rates under SH and SJ, and protect DISC against both mutants over most of the plane under SC and SH.")

slide(kind="figure", title="Cooperation and protection across the depth plane", fig="ED_Fig8", side=False, backup=True,
      caption="**Extended Data Fig. 8** | Mean cooperation $\\bar\\rho$ over $(k_1,k_2)$; dots: pure DISC resists rare ALLC and ALLD. $\\alpha=\\beta=1$, $b/c=5$.",
      takeaway="High cooperation follows norm-specific directions, and local protection of pure DISC does not coincide with high population-level cooperation.")

slide(kind="figure", title="Secure tolerance strengths across norms and benefit-to-cost ratios", fig="ED_Fig9", side=True, backup=True,
      caption="**Extended Data Fig. 9** | **a**, secure intervals of $\\alpha$ at $b/c=5$ for one-step and selected architectures (black frames; shading: resident cooperation). **b–e**, security across $\\alpha$ and $b/c$; circles: $(\\alpha,b/c)=(0.8,5)$.",
      takeaway="At $\\alpha=0.8$ all selected architectures resist O-DISC with high cooperation. Protective ranges shrink as $b/c$ decreases and close under SH at $b/c=2$.")

slide(kind="content", title="Analytical highlights", backup=True,
      body=[table(["Result", "Statement"], [
          ["No window without inertia", "If $\\mathscr{R}(u)=u$, then $R_{\\mathrm{L}}=R_{\\mathrm{U}}=1/\\Delta\\Phi^*$, so no $b/c$ protects pure DISC against both ALLD and ALLC."],
          ["Chord condition", "The protection window is open if and only if $\\mathscr{R}$ lies above its chord between $\\Phi^*_{\\mathrm{D}}$ and $\\Phi^*_{\\mathrm{C}}$ at $u_{\\mathrm{R}}^*$."],
          ["Worst opportunist", "If $\\mathscr{R}$ is concave (e.g. $k_2=0$), $H$ is non-decreasing in $\\delta$, so $\\Lambda'(0)\\leq0$ excludes the whole O-DISC family."],
          ["Error-free threshold", "With $\\beta=1$ and $k_1\\geq1$, an all-good resident excludes every O-DISC mutant if and only if $\\alpha\\leq1-c/b$."],
          ["Closing of secure intervals", "Near a fold the interval closes at $b/c=u_{\\mathrm{R}}'/\\Delta\\Phi$, which equals 2 under SH for all errors and depths."],
          ["SC without inertia", "A line of equilibria at $f_{\\mathrm{DISC}}=c/[b(\\varepsilon-e_2)]$, attracting on the ALLC side and repelling on the ALLD side."]],
          widths=[0.24, 0.76], size="small")])

slide(kind="content", title="Reference values", backup=True,
      layout="two", ratio=0.44,
      left=[text("**Local protection thresholds** ($\\alpha=\\beta=1$)", size="small"),
            table(["Norm", "Setting", "$r_{\\mathrm{R}}^*$", "$R_{\\mathrm{U}}$"], [
                ["SC", "one-step", "0.9963", "6.31"], ["", "selected (2,0)", "0.9999", "230"],
                ["SH", "one-step", "0.9953", "5.64"], ["", "selected (3,0)", "1.0000", "4410"],
                ["SJ", "one-step", "0.9953", "5.69"], ["", "selected (4,3)", "1.0000", "20910"],
                ["SS", "one-step", "0.9963", "6.34"], ["", "selected (1,2)", "0.9937", "4.00"]],
                widths=[0.15, 0.37, 0.23, 0.23], size="footnotesize"),
            text("$R_{\\mathrm{L}}$ lies between 1.00 and 1.08 in all inertial cases.", size="small", color="muted")],
      right=[text("**Basin $\\omega_{\\mathrm{C}}$ and mean cooperation $\\bar\\rho$**", size="small"),
             table(["Norm", "None", "One-step", "Selected"], [
                 ["SC", "0.63 / 0.61", "0.61 / 0.59", "0.88 / 0.87"],
                 ["SH", "0 / 0", "0.08 / 0.08", "0.71 / 0.69"],
                 ["SJ", "0 / 0", "0.23 / 0.22", "0.71 / 0.70"],
                 ["SS", "0.56 / 0.54", "0.71 / 0.70", "0.76 / 0.74"]],
                 widths=[0.13, 0.29, 0.29, 0.29], size="footnotesize"),
             text("512 initial compositions, $b/c=5$.", size="small", color="muted")])

slide(kind="references", title="References", backup=True)
