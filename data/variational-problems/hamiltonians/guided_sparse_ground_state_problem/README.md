# The Guided Sparse Ground State Problem

These are synthetic Hamiltonians designed to be classically challenging for some range of classical methods, while still possessing a guiding state so that quantum methods are formally efficient. See (link here) for a detailed description of this construction. A problem specification consists of two components:

- a local Hamiltonian expressed as a list of pairs `(P,c)`, where `P` is a string identifying a Pauli operator (with the qubits in Qiskit ordering) and `c` is a coefficient.
- the index (in Qiskit ordering) of a computational basis state that is the guiding state (has overlap with the true ground state)
  Both can be loaded using `np.load`.

The goal is to find the lowest possible variational energy estimate. Quantum solution submissions include the circuits used, which can provide additional information that could potentially be used by classical solvers. For example, a Trotterized time-evolution circuit provides a suggested mapping of the Hamiltonian onto a two-dimensional qubit layout.
