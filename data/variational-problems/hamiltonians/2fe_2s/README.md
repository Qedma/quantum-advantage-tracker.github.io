# `2fe_2s`

This repository contains data for the [2Fe-2S] cluster, specifically the synthetic [Fe2S2(SCH3)4]2- complex [_Low-energy spectrum of iron–sulfur clusters directly from many-particle quantum mechanics_](https://www.nature.com/articles/nchem.2041). This cluster serves as a prototypical model for evaluating the low-energy electronic spectrum of strongly correlated systems directly from many-particle quantum mechanics, bypassing the need for phenomenological model assumptions [_Spin-Projected Matrix Product States: Versatile Tool for Strongly Correlated Systems_](https://pubs.acs.org/doi/abs/10.1021/acs.jctc.7b00270)

## Active Space Generation

The active spaces utilized here are based on the configurations described by Li and Chan [_Spin-Projected Matrix Product States: Versatile Tool for Strongly Correlated Systems_](https://pubs.acs.org/doi/abs/10.1021/acs.jctc.7b00270). They were constructed using the following computational methodology:

- **Method:** Localized Density Functional Theory (DFT).
- **Functional:** BP86 density functional.
- **Basis Set:** TZP-DKH basis set.
- **Hamiltonian:** sf-X2C (spin-free exact two-component) Hamiltonian, which is applied to incorporate scalar relativistic effects.
