//! Every Rust snippet shown on the "DSA in Rust" pages lives in this crate.
//!
//! The lesson pages (`src/content/learn/rust-dsa/*.mdx`) do not contain Rust
//! text of their own. They name a file and a region, and the build copies the
//! lines between `// region: <name>` and `// endregion` onto the page. So the
//! code a reader sees is exactly the code `cargo test` ran.
//!
//! Conventions:
//!
//! - One module per lesson.
//! - A region named `x-demo` is the body of a `main` function. The Playground
//!   link for region `x` wraps it in `fn main() { ... }` and appends it.
//! - Practice problems have a `starters` module (signatures with `todo!()`,
//!   checked to compile but never run) and a `solutions` module (tested).

pub mod lesson0_setup;
pub mod lesson1_vec;
pub mod lesson2_strings;
pub mod lesson3_linked_list;
pub mod lesson4_stack;
pub mod lesson5_queue;
pub mod lesson6_hash;
pub mod lesson7_tree;
pub mod lesson8_heap;
pub mod lesson9_ordered;
pub mod lesson10_graph;
pub mod lesson11_trie;
pub mod lesson12_union_find;
pub mod lesson13_sorting;
pub mod lesson14_binary_search;
pub mod lesson15_two_pointers;
pub mod lesson16_backtracking;
