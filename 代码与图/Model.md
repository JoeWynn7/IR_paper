# Indirect reciprocity with inertial reputation updating

## 1. Population, interactions, and behavioral strategies

The model describes indirect reciprocity in a well-mixed population playing a donation game. In each interaction, a donor chooses whether to cooperate with a recipient. Successful cooperation gives the recipient a benefit $b$ and costs the donor $c$, with $b>c>0$. Defection provides no benefit and incurs no cost. Individuals receive help from others according to their reputations.

The population contains three behavioral strategies:

| Strategy | Intended behavior |
|---|---|
| Unconditional cooperator, $\mathrm{ALLC}$ | Cooperate with every recipient. |
| Unconditional defector, $\mathrm{ALLD}$ | Defect against every recipient. |
| Discriminator, $\mathrm{DISC}$ | Cooperate if the donor regards the recipient as good; otherwise defect. |

Their population frequencies are $f_{\mathrm{ALLC}}$, $f_{\mathrm{ALLD}}$, and $f_{\mathrm{DISC}}$, respectively, with $f_I\geq0$ and $\sum_I f_I=1$. A social norm and a reputation-updating rule are shared within each population. Strategy evolution changes the frequencies of behavioral strategies while holding the norm and reputation-rule parameters fixed.

## 2. Private reputations and social assessment

Each observer $i$ maintains an internal reputation record $L_{ij}$ for a target $j$. When the record is consulted, it produces a binary image $M_{ij}\in\{\mathrm G,\mathrm B\}$, meaning good or bad. Different observers maintain separate records and may disagree about the same target.

A DISC donor chooses its intended action using its own image of the recipient. An observer evaluates the donor's realized action using the observer's own image of that recipient. Thus, the donor's action and the observer's assessment can reflect different private judgments.

The assessment rule depends on the donor's action and the observer's image of the recipient. Let $n(a,R)$ be the probability that the norm prescribes a positive assessment for realized action $a\in\{\mathrm C,\mathrm D\}$ toward a recipient regarded as $R\in\{\mathrm G,\mathrm B\}$. The norms considered satisfy

$$
n(\mathrm C,\mathrm G)=1,\qquad
n(\mathrm D,\mathrm G)=0,\qquad
n(\mathrm C,\mathrm B)=p,\qquad
n(\mathrm D,\mathrm B)=q.
$$

The four norms differ in how they assess actions toward recipients regarded as bad:

| Norm | Abbreviation | $p=n(\mathrm C,\mathrm B)$ | $q=n(\mathrm D,\mathrm B)$ |
|---|---|---:|---:|
| Scoring | SC | 1 | 0 |
| Shunning | SH | 0 | 0 |
| Stern Judging | SJ | 0 | 1 |
| Simple Standing | SS | 1 | 1 |

### Implementation and assessment errors

An intended cooperative action fails and becomes defection with probability $e_1$. Intended defection is implemented without error. Benefits and costs are incurred only when cooperation is successfully implemented.

After the norm is applied to the realized action, the prescribed assessment is reversed with probability $e_2$. The two errors are independent, with $0\leq e_1,e_2<1/2$.

Let $A_{aR}$ denote the probability of a recorded positive assessment, conditional on the donor's **intended** action $a$ and the observer's binary image $R$ of the recipient. Define

$$
\epsilon=(1-e_1)(1-e_2)+e_1e_2.
$$

Integrating over both errors gives

$$
\begin{aligned}
A_{\mathrm{CG}}&=\epsilon,\\
A_{\mathrm{DG}}&=e_2,\\
A_{\mathrm{CB}}&=p(\epsilon-e_2)+q(1-\epsilon-e_2)+e_2,\\
A_{\mathrm{DB}}&=q(1-2e_2)+e_2.
\end{aligned}
$$

These effective probabilities already include implementation error.

## 3. Internal states and directional inertia

The internal record contains two established states and two possible sequences of intermediate states:

$$
\mathcal L=
\{\mathrm G,\mathrm W_1,\ldots,\mathrm W_{k_1},
\mathrm B,\mathrm S_1,\ldots,\mathrm S_{k_2}\},
$$

where $k_1,k_2\in\{0,1,2,\ldots\}$. State $\mathrm G$ represents established good standing and $\mathrm B$ established bad standing. Warning states $\mathrm W_m$ record consecutive negative assessments challenging good standing. Suspicious states $\mathrm S_n$ lie on the recovery path and record consecutive positive assessments challenging bad standing.

Negative assessments advance the record along

$$
\mathrm G\longrightarrow\mathrm W_1\longrightarrow\cdots
\longrightarrow\mathrm W_{k_1}\longrightarrow\mathrm B,
$$

whereas positive assessments advance it along

$$
\mathrm B\longrightarrow\mathrm S_1\longrightarrow\cdots
\longrightarrow\mathrm S_{k_2}\longrightarrow\mathrm G.
$$

An assessment supporting the established judgment resets the entire corresponding path: any $\mathrm W_m$ receiving a positive assessment returns directly to $\mathrm G$, and any $\mathrm S_n$ receiving a negative assessment returns directly to $\mathrm B$. Positive assessments leave $\mathrm G$ unchanged; negative assessments leave $\mathrm B$ unchanged.

For positive depths, the transitions are

| Current state | Positive assessment | Negative assessment |
|---|---|---|
| $\mathrm G$ | $\mathrm G$ | $\mathrm W_1$ |
| $\mathrm W_m$, $1\leq m<k_1$ | $\mathrm G$ | $\mathrm W_{m+1}$ |
| $\mathrm W_{k_1}$ | $\mathrm G$ | $\mathrm B$ |
| $\mathrm B$ | $\mathrm S_1$ | $\mathrm B$ |
| $\mathrm S_n$, $1\leq n<k_2$ | $\mathrm S_{n+1}$ | $\mathrm B$ |
| $\mathrm S_{k_2}$ | $\mathrm G$ | $\mathrm B$ |

When $k_1=0$, a negative assessment changes $\mathrm G$ directly to $\mathrm B$. When $k_2=0$, a positive assessment changes $\mathrm B$ directly to $\mathrm G$.

Losing established good standing therefore requires $k_1+1$ consecutive negative assessments; recovering established good standing requires $k_2+1$ consecutive positive assessments. Consecutiveness refers to the assessments recorded by a particular observer about a particular target. These assessments depend on behavior, private recipient images, the social norm, and errors.

The total depth is $K=k_1+k_2$, giving $K+2$ internal states. The one-step model has $k_1=k_2=1$.

## 4. Probabilistic binary readout

The internal state determines the probability that a target is currently regarded as good. Define $\sigma_\ell=\Pr(M_{ij}=\mathrm G\mid L_{ij}=\ell)$, with

$$
\sigma_{\mathrm G}=1,\qquad
\sigma_{\mathrm W_m}=\alpha^m,\qquad
\sigma_{\mathrm B}=0,\qquad
\sigma_{\mathrm S_n}=1-\beta^n,
$$

where $0\leq\alpha,\beta\leq1$.

Larger $\alpha$ preserves a good binary image while negative evidence accumulates along the warning path. Larger $\beta$ delays the restoration of a good binary image along the recovery path. Depth controls when the internal record completes a reversal; readout controls how intermediate evidence affects current treatment.

The internal record persists between assessment events. A fresh binary readout is sampled independently whenever the record is consulted for action choice or assessment, conditional on its current internal state. Consulting a record leaves the internal state unchanged.

At $\alpha=\beta=1$, all warning states are read as good and all recovery states as bad, so the established image persists until the corresponding path is completed. At $\alpha=\beta=0$, the binary image after each recorded assessment agrees with that assessment, recovering instantaneous binary updating for any depths. Instantaneous updating is also obtained with $k_1=k_2=0$.

For the one-step internal structure, $(\alpha,\beta)=(1,0)$ gives tolerance-only readout and $(0,1)$ strictness-only readout. Changing readout parameters retains the underlying internal states; the depths and readout parameters are separate model choices.

## 5. Stationary reputation response

Consider a stationary assessment environment in which successive recorded assessments are independent and positive with probability $u$. Let $T_+$ and $T_-$ be the transition matrices specified by the positive and negative updates above. The internal record follows the Markov chain

$$
T(u)=uT_+ +(1-u)T_-.
$$

Its stationary distribution $\boldsymbol\pi(u)$ satisfies $\boldsymbol\pi T=\boldsymbol\pi$ and $\sum_\ell\pi_\ell=1$. For $0<u<1$, let $v=1-u$ and define

$$
Z(u)=v^{k_1}+u^{k_2}-v^{k_1}u^{k_2}.
$$

The stationary probabilities are

$$
\pi_{\mathrm G}=\frac{u^{k_2+1}}{Z(u)},\qquad
\pi_{\mathrm W_m}=v^m\pi_{\mathrm G},\qquad
\pi_{\mathrm B}=\frac{v^{k_1+1}}{Z(u)},\qquad
\pi_{\mathrm S_n}=u^n\pi_{\mathrm B}.
$$

Weighting these states by their good-readout probabilities gives the stationary reputation response

$$
\mathcal R(u)=\sum_{\ell\in\mathcal L}\pi_\ell(u)\sigma_\ell
=
\frac{
u^{k_2+1}\left[1+\sum_{m=1}^{k_1}(\alpha v)^m\right]
+v^{k_1+1}\sum_{n=1}^{k_2}u^n(1-\beta^n)
}{Z(u)}.
$$

Empty sums are zero. The endpoints satisfy $\mathcal R(0)=0$ and $\mathcal R(1)=1$. For $k_1=k_2=1$,

$$
\mathcal R(u)=
\frac{u^2[1+\alpha(1-u)]+u(1-u)^2(1-\beta)}{1-u+u^2}.
$$

For instantaneous binary updating, $\mathcal R(u)=u$.

## 6. Mean-field reputation self-consistency

In the infinite-population description, let $r_I$ be the probability that a type-$I$ individual is regarded as good by an observer using the shared assessment rule. Define the population average

$$
\bar r=\sum_I f_Ir_I.
$$

The mean-field closure treats the donor's and observer's private images of a recipient as conditionally independent given that recipient's strategy. Under this approximation,

$$
h_{\mathrm{GG}}=\sum_I f_Ir_I^2,\qquad
h_{\mathrm{GB}}=\sum_I f_Ir_I(1-r_I),\qquad
h_{\mathrm{BB}}=\sum_I f_I(1-r_I)^2.
$$

Each ordered disagreement, donor-good/observer-bad or donor-bad/observer-good, has probability $h_{\mathrm{GB}}$. Their combined probability is $2h_{\mathrm{GB}}$.

The probabilities that the three donor strategies receive positive recorded assessments are

$$
\begin{aligned}
\varphi_{\mathrm{ALLC}}
&=\bar r A_{\mathrm{CG}}+(1-\bar r)A_{\mathrm{CB}},\\
\varphi_{\mathrm{ALLD}}
&=\bar r A_{\mathrm{DG}}+(1-\bar r)A_{\mathrm{DB}},\\
\varphi_{\mathrm{DISC}}
&=h_{\mathrm{GG}}A_{\mathrm{CG}}
+h_{\mathrm{GB}}(A_{\mathrm{CB}}+A_{\mathrm{DG}})
+h_{\mathrm{BB}}A_{\mathrm{DB}}.
\end{aligned}
$$

For DISC, these terms account for agreement that the recipient is good, the two directions of disagreement, and agreement that the recipient is bad.

At fixed strategy frequencies, stationary reputations satisfy

$$
r_I^*=\mathcal R\!\left(\varphi_I(\boldsymbol r^*,\boldsymbol f)\right).
$$

The analysis uses initially good records. A self-consistent branch can be selected from $r_I(0)=1$ using the auxiliary relaxation

$$
\frac{\mathrm d r_I}{\mathrm d\tau}
=\mathcal R(\varphi_I)-r_I.
$$

Here $\tau$ is auxiliary equilibration time. This equation defines a route to stationary self-consistency; the transient dynamics of the internal record require tracking the full state distribution. The conditional-independence closure is a theoretical approximation. Finite-population simulations retain individual private records and the correlations generated by their interactions.

## 7. Payoffs, strategy evolution, and cooperation

Reputations are assumed to adjust faster than behavioral strategy frequencies. At each strategy composition, the selected stationary reputations determine payoffs on the slower evolutionary timescale.

A type-$I$ recipient receives intended cooperation with probability

$$
\kappa_I^{\mathrm{in}}=f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}r_I^*.
$$

The probabilities of intending cooperation as a donor are

$$
\kappa_{\mathrm{ALLC}}^{\mathrm{out}}=1,\qquad
\kappa_{\mathrm{ALLD}}^{\mathrm{out}}=0,\qquad
\kappa_{\mathrm{DISC}}^{\mathrm{out}}=\bar r^*.
$$

Expected payoffs are

$$
\Pi_I=(1-e_1)\left(b\kappa_I^{\mathrm{in}}-c\kappa_I^{\mathrm{out}}\right).
$$

Strategy frequencies evolve according to the replicator equations

$$
\frac{\mathrm d f_I}{\mathrm dt}=f_I(\Pi_I-\bar\Pi),\qquad
\bar\Pi=\sum_Jf_J\Pi_J.
$$

The stationary reputation problem is evaluated for the current strategy composition before calculating these payoffs. The two time variables distinguish reputation equilibration from strategy evolution.

The population's intended cooperation rate is

$$
\rho_{\mathrm{int}}=f_{\mathrm{ALLC}}+f_{\mathrm{DISC}}\bar r^*,
$$

and its realized cooperation rate is

$$
\rho_{\mathrm C}=(1-e_1)\rho_{\mathrm{int}}.
$$

In a homogeneous DISC population, $\rho_{\mathrm{int}}=r_{\mathrm{DISC}}^*$.

## 8. Finite-population reputation process

Finite-population simulations examine reputation formation at fixed counts of ALLC, ALLD, and DISC individuals. The population contains $N$ individuals, of whom $n_{\mathrm{DISC}}$ use DISC. Records are stored for DISC observers, whose private judgments determine conditional behavior and assessment. All stored records, including self-images, start in state $\mathrm G$.

Each event proceeds as follows:

1. Select a donor uniformly from the population and a recipient uniformly from the remaining individuals.
2. Select one observer uniformly from the DISC individuals, independently of the donor and recipient. The observer may coincide with either participant.
3. Determine the donor's intended action from its strategy. A DISC donor samples its current private binary image of the recipient.
4. Apply implementation error to intended cooperation, producing the realized action.
5. The observer independently samples its own binary image of the recipient and applies the shared social norm to the realized action.
6. Reverse the prescribed assessment with probability $e_2$.
7. Update only the observer's internal record of the donor using the positive or negative transition rule.

One sweep consists of $n_{\mathrm{DISC}}N$ events. Behavioral strategies remain fixed during this reputation process; the replicator equations describe their evolution separately.

The reputation-recognition analyses use equal numbers of the three strategies, with $n_{\mathrm{ALLC}}=n_{\mathrm{ALLD}}=n_{\mathrm{DISC}}=N/3$.

For measuring reputation, let $s_{ij}=\sigma_{L_{ij}}$ be the current probability that observer $i$ reads target $j$ as good. For a target strategy $I$, $g_I$ is the average of $s_{ij}$ over DISC observers and type-$I$ targets, with time averaging over the chosen sampling window when applicable.

For a target $j$, with $n_{\mathrm{DISC}}>1$, the probability that two distinct DISC observers give different binary readouts is

$$
d_j=\frac{1}{n_{\mathrm{DISC}}(n_{\mathrm{DISC}}-1)}
\sum_{i\ne \ell}
\left[s_{ij}(1-s_{\ell j})+(1-s_{ij})s_{\ell j}\right].
$$

Let $d_I$ denote its average over type-$I$ targets and the sampling window. Reputation separation and mean observer disagreement are defined as

$$
\Delta g=\frac{g_{\mathrm{DISC}}+g_{\mathrm{ALLC}}}{2}-g_{\mathrm{ALLD}},
\qquad
\bar d=\frac{d_{\mathrm{DISC}}+d_{\mathrm{ALLC}}+d_{\mathrm{ALLD}}}{3}.
$$

These observables quantify how differently cooperative strategies and unconditional defectors are regarded, and how often observers disagree about the same target.

## 9. Rare opportunistic discriminators

The model also considers a rare opportunistic discriminator, O-DISC, in a homogeneous DISC resident population. It intends to cooperate with a recipient it regards as good with probability $1-\delta$, and defects against a recipient it regards as bad:

$$
\Pr_{\mathrm X}(\mathrm C\mid\mathrm G)=1-\delta,\qquad
\Pr_{\mathrm X}(\mathrm C\mid\mathrm B)=0,
\qquad 0\leq\delta\leq1.
$$

The omission decision is independent at each interaction. At $\delta=0$ this strategy behaves as DISC; at $\delta=1$ it behaves as ALLD. The mutant is sufficiently rare to leave the resident assessment environment unchanged.

Let $r_{\mathrm R}$ be the selected resident good-reputation probability, and define

$$
\begin{aligned}
a_{\mathrm C}&=r_{\mathrm R}A_{\mathrm{CG}}+(1-r_{\mathrm R})A_{\mathrm{CB}},\\
a_{\mathrm D}&=r_{\mathrm R}A_{\mathrm{DG}}+(1-r_{\mathrm R})A_{\mathrm{DB}},\\
u_{\mathrm R}&=r_{\mathrm R}a_{\mathrm C}+(1-r_{\mathrm R})a_{\mathrm D}.
\end{aligned}
$$

Under the same mean-field closure, the mutant's positive-assessment probability and stationary reputation are

$$
u_{\mathrm X}=u_{\mathrm R}-\delta r_{\mathrm R}(a_{\mathrm C}-a_{\mathrm D}),
\qquad r_{\mathrm X}=\mathcal R(u_{\mathrm X}).
$$

The resident and mutant payoffs are

$$
\Pi_{\mathrm R}=(1-e_1)(b-c)r_{\mathrm R},\qquad
\Pi_{\mathrm X}=(1-e_1)\left[br_{\mathrm X}-c(1-\delta)r_{\mathrm R}\right].
$$

The normalized invasion payoff difference is

$$
\Lambda(\delta)=\frac{\Pi_{\mathrm X}-\Pi_{\mathrm R}}{c(1-e_1)}
=\delta r_{\mathrm R}-\frac bc\left(r_{\mathrm R}-r_{\mathrm X}\right).
$$

A positive value indicates a payoff advantage for the tested rare mutant. Resistance to this family requires $\Lambda(\delta)\leq0$ for every $\delta\in(0,1]$; $\delta=0$ is neutral.

## 10. Parameters

| Symbol | Meaning | Domain or reference value |
|---|---|---|
| $b,c$ | Benefit and cost of successfully implemented cooperation | $b>c>0$; reference $b=5$, $c=1$ |
| $e_1$ | Probability that intended cooperation fails | $[0,1/2)$; reference $0.02$ |
| $e_2$ | Probability that the prescribed assessment is reversed | $[0,1/2)$; reference $0.02$ |
| $p,q$ | Positive-assessment probabilities for cooperation and defection toward a bad recipient | Fixed by the chosen norm |
| $k_1$ | Number of warning states on the loss-of-standing path | Non-negative integer |
| $k_2$ | Number of suspicious states on the recovery path | Non-negative integer |
| $K$ | Total internal depth | $k_1+k_2$ |
| $\alpha$ | Good-readout parameter for warning states | $[0,1]$ |
| $\beta$ | Bad-readout parameter for recovery states | $[0,1]$ |
| $f_I$ | Frequency of behavioral strategy $I$ | $f_I\geq0$, $\sum_I f_I=1$ |
| $N,n_{\mathrm{DISC}}$ | Finite population size and number of DISC observers | Set by the finite-population configuration |
| $\delta$ | Probability that O-DISC omits cooperation toward a recipient it regards as good | $[0,1]$ |
