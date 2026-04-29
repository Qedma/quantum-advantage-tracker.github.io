# Circuit instance description (Random Graph State Sampling):

We present circuits to prepare random graph states and measure in a rotated (non-Clifford) basis. We show experimental results towards classically-verifiable quantum advantage by high-fidelity sampling on a quantum computer.

`nq70_depth70_checks27_basis_fstate.qasm`: This prepares a random graph state using a 70 X 70 circuit (70 qubits with CZ-depth 70). The 70 logical qubits are arranged on a 1D lattice (LNN), and 27 ancilla qubits are used for error detection. A layer of non-Clifford basis rotations is applied at the end, which is designed to maximize the stabilizer extent. The best known Schmidt rank is $2^{30}$ and the best known stabilizer extent is $2^{23.97}$.

- `nq70_depth70_checks27_basis_fstate_checks.qasm`: This includes the ancilla Pauli checks for the above circuit.

- `samples_nq70_depth70_checks27_basis_fstate.npy`: 3376 samples for the above circuit.


## A. Computational Complexity

Our work, like [random circuit sampling (RCS)](https://www.nature.com/articles/s41586-019-1666-5), relies on the asymptotic hardness of classical algorithms for random quantum state sampling. However, instead of Haar-random states, we focus on random graph states which permit both error detection and verifiability in the experiment.

It [has been shown](https://arxiv.org/pdf/2412.07058) that sampling random *regular* graph states in a random product basis is average-case #P-hard. This implies that this task is hard for *any* classical algorithm, unless there is a collapse in the polynomial hierarchy. The problem can also be reduced to the simulation of measurement-based quantum computing (MBQC). 

In this work we prepare random graph states and conjecture that they are also #P-hard to sample from.


## B. Hardness of classical simulation

For the specific problem size that we ran, we quantify hardness of simulation through two quantities: entanglement and magic. The former leads to the difficulty of tensor network-based methods, and the latter the difficulty of Clifford-based methods.
In random graph state sampling, both of these properties scale with the system size, implying that classical simulations using known methods will become effectively intractable past some finite circuit size.

### `Quantifying Entanglement`

We quantify the entanglement of the graph state by estimating the Schmidt rank, the $GF(2)$ rank of its adjacency matrix, across random bipartitions. For an $n$-qubit graph state, the Schmidt rank is upper bounded by $2^{n/2}$. 

As this corresponds exactly to the bond dimension, the contraction cost of tensor network simulations will scale exponentially with this quantity.

To maximize the entanglement in our graph state, we use an ansatz of repeating layers of odd/even CZ gates (brickwork layout), followed by random $\sqrt{X}$ or $S;\ \sqrt{X}$ rotations on each qubit. We do this until reaching a CZ-depth of $n$. It is known that this depth is enough to prepare *any* graph state on an LNN architecture (to appear).

By taking the minimum over 100 million random bipartitions, we numerically verify that our circuit nearly saturates the entanglement upper bound with a Schmidt rank of $2^{30}$.

### `Quantifying non-stabilizerness`

Alternatively, stabilizer rank algorithms can be used which are oblivious to the amount of entanglement, but instead scale exponentially with the amount of magic (non-stabilizerness) in the circuit. These methods decompose quantum states into a sum of stabilizers which can be efficiently simulated. 

The complexity therefore scales with the minimum number of states used in this decomposition, i. e. the stabilizer rank. For circuits consisting of only Clifford and T gates, the [best known upper bound](https://arxiv.org/pdf/2106.07740v1) is given by

$$stabilizer\ rank \leq 2^{0.3963 \cdot (T\ count)}$$

[Brayvi et. al](https://arxiv.org/pdf/1808.00128) also describe a method of quantifying the nonstabilizerness with the stabilizer extent, or the minimum $\| c \|^2$ over all stabilizer decompositions, which more naturally bounds the complexity of approximate error simuations. As described in their work, we use non-Clifford rotations to prepare a "face-state" which has maximal stabilizer extent:

$$stabilizer\ extent = 2^{0.3424 \cdot n}$$

So, as claimed, the nonstabilizerness increases exponentially with the system size.

We also make note of [Clifford Augmented Matrix Product State (CAMPS) simulators](https://arxiv.org/pdf/2412.17209), which combine tensor networks with tableau simulators. These algorithms reduce the bond dimension necessary to represent the state by propagating non-Clifford gates to the front of the circuit, using a tableau for the entangled Clifford bulk and a smaller bond dimension MPS for the non-Clifford layer. After the first $n$ magic gates however, the upper bound on the bond dimension necessary for the MPS increases exponentially, as well as the maximum bond dimension necessary to sample bitstring probabilities.

To the best of our knowledge, then, the large Schmidt rank and stabilizer extent of our rotated graph states will be adversarial for exact or naive approximate simulations.

## C. Verifiability

For sampling-based experiments, it suffices to show that samples can be drawn from a quantum computer with greater fidelity than through classical means. We claim that, with random graph state sampling, we have a more direct measure of the state fidelity that, relative to prior RCS-style experiments, requires fewer assumptions about the noise in our circuit.

For comparison, RCS uses the fact that the outcome probabilties of Haar-random states is described by the Porter-Thomas distribution, a distinctly non-classical model. The closeness of the samples to Porter-Thomas is quantified with the linear cross-entropy benchmarking (XEB) score, which compares the output distribution (in the Z-basis) of each sampled output $x$ to its quantum probability

$$F_{XEB} =  \frac{2^n}{M} \sum_i^M | \bra{0} C \ket{x_i} |^2 - 1$$

As samples drawn noiselessly from the Porter-Thomas distribution have $F_{XEB} = 1$ and samples drawn from the (classical) uniform distribution have $F_{XEB} = 0$, a non-zero fidelity is evidence of quantum behavior.

A key detail is that XEB requires classical simulations for the outcome probabilities, hence can only be extrapolated for the full-depth circuit. The authors present arguments for why this can be extrapolated from smaller depth or less entangled circuits. XEB also is only close to state fidelity under assumptions of weak noise.

[Quantinuum's RCS experiments](https://journals.aps.org/prx/abstract/10.1103/PhysRevX.15.021052) also employ measure a proxy for fidelity, running a mirrored version of their circuit with half-depth and calculating the probability of return (mirror fidelity) to the expected state.

### `Error detection`

To avoid the problem of vanishing fidelities with large circuits, we use the [spacetime error detection protocol](https://arxiv.org/pdf/2504.15725) and mitigate noise in our samples. As the graph state is prepared with Clifford gates, it is possible to augment the circuit with ancilla qubits and insert spacetime Pauli checks at various locations on their support. While these Pauli checks collectively stabilize the circuit, errors occuring in the circuit will not generally commute with these checks, manifesting as a "syndrome" error on the ancillas. These errored shots can be detected and post-selected out which, as illustrated in the reference above, can result in order of magnitude improvements over bare state fidelity, all with a significantly lower sampling overhead than PEC.

Our circuits are mapped onto a one dimensional chain with ancillas attached to exactly one data qubit. On IBM's heavy-hex architecture used in their Heron devices, it is likely that every other qubit will have degree 3. This dense placement of ancillas enables effective error detection, and guarantees that the number of ancillas can scale with the size of the circuit.

### `Measuring Fidelity`

As the graph states can be prepared with high fidelity with error detection, it is efficient to use [direct fidelity estimation](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.106.230501). The fidelity for target state $\sigma$ and noisy output state $\rho$ can be approximated by randomly sampling the expectation values of $M$ random Paulis $P$:

$$F \approx \frac{1}{M} \sum_k^M \braket{P_k}_{\rho} \braket{P_k}_{\sigma} $$

For stabilizer states, whose expectation values can be bounded, this requires only a constant shot overhead. Using the $O(1/M)$ scaling in uncertainty, we choose enough random stabilizers to bound the fidelity above 1% with 95% confidence.

For non-stabilizer states, expectation values can become arbitrarily small, which requires a commensurately large shot overhead. We argue, however, that the fidelity of the graph state is equivalent whether measured in a stabilizer or non-stabilizer basis:

- The graph state and rotated state share all the same gates, the only exception being the angle of the final Z rotations, which toggle between the stabilizer and non-stabilizer bases.
- On IBM's devices, Z gates are [virtually implemented](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.96.022330) as framechanges, hence are noiseless and cannot add incoherent error.
- We employ Pauli twirling, or randomized compiling, on the graph state preparation circuit. With the assumption of independent error on the single qubit gates, this is enough to ensure that the [fidelity of the rotated graph state](https://arxiv.org/pdf/2503.05943) is equal (up to first order) to the average graph state fidelity.

Provided that classical simulations fail to efficiently sample from our state, we can demonstrate quantum advantage by showing the fidelity of the rotated graph state is bounded away from zero.

## Institutions

IBM, UChicago
