# Circuit instance description:

`nq70_depth70_checks27_basis_fstate.qasm`: This prepares a random graph state on a 70 X 70 circuit, arranged on a 1D lattice (LNN) and equipped with 27 ancillas. A layer of non-Clifford basis rotations is applied at the end, which is designed to maximize the stabilizer rank. The best known Schmidt rank is $2^{30}$ and the best known stabilizer extent is $2^{23.9}$. After post-selection, 0.10% of the shots remain, and the state fidelity is $0.37 \pm 0.02$ ($ \geq 0.092$ with 95% confidence).

- `nq70_depth70_checks27_basis_fstate_checks.qasm`: This includes the ancillas and spacetime Pauli checks for the above circuit.

- `samples_nq70_depth70_checks27_basis_fstate.npy`: This includes 1726 samples for the graph state in the non-Clifford basis.

# `Random Graph State Sampling`

We present circuits to prepare random graph states and measure in a non-Clifford basis. We aim to show that we can sample with high enough fidelity to certify quantum advantage.

## `Computational Complexity`

Our work, like [random circuit sampling (RCS)](https://www.nature.com/articles/s41586-019-1666-5), relies on the asymptotic hardness of classical algorithms for random quantum state sampling. At a high level, quantum states are difficult to simulate if they exhibit (1) high fidelity, long-range entanglement - nonlocal correlations are difficult to predict without exponentially many classical resources - and, since Clifford circuits can generate highly entangled states while being simulable in polynomial time, (2) nonstabilizerness or magic. We argue that for random graph state sampling, both of these properties scale with the system size, implying that there is a finite limit past which classical simulations will become effectively intractable. For the specific case of sampling from [k-regular graphs in a random X-Y basis](https://arxiv.org/pdf/2412.07058), this has been proven exactly to be #P-hard, with outcomes exhibiting other desired properties such as anticoncentration.

### `Quantifying Entanglement`

We quantify the entanglement of the graph state by measuring the Schmidt rank, the $GF(2)$ rank of the adjacency matrix, across random bipartitions. For a state with size $N$,

$$ Schmidt\ rank \leq 2^{N/2}$$

As this corresponds exactly to the bond dimension, the contraction cost of tensor network simulations will, in the worst case, scale exponentially with the state size.

To maximize the entanglement in our graph states, we use an ansatz of an odd/even layer of CZ gates (brickwork layout) followed by a layer of random $SX$ or $S;\ SX$ rotations on each qubit. We numerically verify that this is close to saturating the entanglement bound and report the Schmidt rank as the minimum over 100 million random bipartitions.

### `Nonstabilizerness`

Alternatively, stabilizer rank algorithms decompose magic states into superpositions of stabilizer states, which can be efficiently simulated.

$$\ket{\psi} = \sum_i c_i \ket{\phi_i}$$

The complexity therefore scales with the minimum number of states used in this decomposition, i. e. the stabilizer rank. For circuits consisting of only Clifford and T gates, the [best known upper bound](https://arxiv.org/pdf/2106.07740v1) is given by

$$stabilizer\ rank \leq 2^{0.3963 \cdot (T\ count)}$$

[Brayvi et. al](https://arxiv.org/pdf/1808.00128) also describe a method of quantifying the nonstabilizerness with the stabilizer extent, or the minimum $\| c \|^2$ over all stabilizer decompositions, which more naturally bounds the complexity of approximate error simuations. As described in their work, we use non-Clifford rotations to prepare a "face-state" which has maximal stabilizer extent:

$$stabilizer\ extent = 2^{0.3424 \cdot N}$$

So, as claimed, the nonstabilizerness increases exponentially with the system size.

We also make note of [Clifford Augmented Matrix Product State (CAMPS) simulators](https://arxiv.org/pdf/2412.17209), which combine tensor networks with Clifford tableau simulators. These algorithms reduce the bond dimension necessary to represent the state by propagating magic gates to the front of the circuit, using a tableau for the entangled Clifford bulk and a smaller bond dimension MPS for the magic layer. After the first $N$ magic gates however, the upper bound on the bond dimension necessary for the MPS increases exponentially, as well as the maximum bond dimension necessary to sample bitstring probabilities.

To the best of our knowledge, then, the large Schmidt and stabilizer extent of our rotated graph states will be adversarial for exact classical simulations.

## `Verifiability`

For sampling-based experiments, it suffices to show that samples can be drawn from a quantum computer with greater fidelity than through classical means. With random graph state sampling, we claim to have a more direct measure of the state fidelity that, relative to prior RCS-style experiments, requires fewer assumptions about the noise in our circuit.

For comparison, RCS uses the fact that the outcome probabilties of Haar-random states is described by the Porter-Thomas distribution, a distinctly non-classical model. The closeness to of the sample distribution to the Porter-Thomas is quantified with the linear cross-entropy benchmarking (XEB) score, which compares the output distribution (in the Z-basis) of each sampled output $x$ to its quantum probability

$$F_{XEB} =  \frac{2^N}{M} \sum_i^M | \bra{0} C \ket{x_i} |^2 - 1$$

As samples drawn noiselessly from the Porter-Thomas distribution have $F_{XEB} = 1$ and samples drawn from the (classical) uniform distribution have $F_{XEB} = 0$, a non-zero fidelity is evidence of quantum behavior.

A key detail is that XEB requires classical simulations for the outcome probabilities, hence can only be approximated for the full-depth circuit - the authors present arguments for why this can be extrapolated from smaller depth or less entangled circuits. XEB also is only close to state fidelity under assumptions of weak noise.

[Quantinuum's RCS experiments](https://journals.aps.org/prx/abstract/10.1103/PhysRevX.15.021052) also measure a proxy for fidelity, running a mirrored version of their circuit with half the depth and calculating the probability of return to the expected state (mirror fidelity).

### `Error detection`

To avoid the problem of non-vanishing fidelities with large circuits, we use the [error detection protocol](https://arxiv.org/pdf/2504.15725) and mitigate noise in our samples. As the graph state is prepared with Clifford gates, it is possible to augment the circuit with ancilla qubits and insert spacetime Pauli checks on their support at various depths. While these Pauli checks collectively add to the identity, errors occuring in the circuit will not generally commute with these checks, manifesting as a "syndrome" error on the ancillas. These errored shots can be detected and post-selected out which, as illustrated in the reference above, can result in order of magnitude improvements over bare state fidelity, all with a lower sampling overhead than PEC.

Our circuits are mapped onto a one dimensional chain with ancillas attached to exactly one data qubit. On IBM's Heron devices, which have the heavy-hex architecture, it is likely that every other qubit will have degree 3. This dense placement of ancillas enables effective error detection, and guarantees that the number of ancillas can scale with the size of the circuit.

### `Measuring Fidelity`

As the graph states can be prepared with high fidelity with error detection, it is efficient to use [direct fidelity estimation](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.106.230501). The fidelity for target state $\sigma$ and noisy output state $\rho$ can be approximated by randomly sampling the expectation values of $M$ random Paulis $P$:

$$F \approx \frac{1}{M} \sum_k^M \braket{P_k}_{\rho} \braket{P_k}_{\sigma} $$

For stabilizer states, whose expectation values can be bounded, this requires only a constant shot overhead. Using the $O(1/M)$ scaling in uncertainty, we choose enough random stabilizers to bound the fidelity above 1% with 95% confidence.

For non-stabilizer states, expectation values can become arbitrarily small, which requires a commensurately large shot overhead. We argue, however, that the fidelity of the graph state is equivalent whether measured in a stabilizer or non-stabilizer basis:

- The graph state and rotated state share all the same gates, the only exception being the angle of Z rotations which toggle between the stabilizer and non-stabilizer bases.
- On IBM's devices, Z gates are [virtually implemented](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.96.022330) as framechanges, hence are noiseless and cannot add incoherent error.
- We employ Pauli twirling, or randomized compiling, on the graph state preparation circuit. With the assumption of independent error on the single qubit gates, this is enough to ensure that the [fidelity of the rotated graph state](https://arxiv.org/pdf/2503.05943) is equal (up to first order) to the average graph state fidelity.

Provided that classical simulations fail to faithfully sample from our state, we can certify quantum advantage by showing that the fidelity of the rotated graph state is bounded above zero.

## Institutions

IBM, UChicago
