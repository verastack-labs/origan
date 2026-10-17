//! Lesson 11: tries and prefix search.

// region: trie-build
use std::collections::BTreeMap;

/// One step in a word. It says which letters can come next, and whether a
/// word ends right here.
#[derive(Default)]
pub struct TrieNode {
    pub children: BTreeMap<char, TrieNode>,
    pub is_word: bool,
}

/// A trie: a tree of letters, where each word is a path from the root.
#[derive(Default)]
pub struct Trie {
    root: TrieNode,
}

impl Trie {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn root(&self) -> &TrieNode {
        &self.root
    }

    /// Walks down the word, adding a node for each letter that is missing.
    pub fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.is_word = true;
    }

    /// Follows `prefix` down from the root. `None` means the path breaks off.
    fn find(&self, prefix: &str) -> Option<&TrieNode> {
        let mut node = &self.root;
        for c in prefix.chars() {
            node = node.children.get(&c)?;
        }
        Some(node)
    }

    /// True only for a whole word that was inserted.
    pub fn contains(&self, word: &str) -> bool {
        self.find(word).is_some_and(|node| node.is_word)
    }

    /// True if any inserted word begins with `prefix`.
    pub fn starts_with(&self, prefix: &str) -> bool {
        self.find(prefix).is_some()
    }
}
// endregion

// region: trie-suggest
impl Trie {
    /// Every stored word that begins with `prefix`, in alphabetical order.
    pub fn suggestions(&self, prefix: &str) -> Vec<String> {
        let mut found = Vec::new();
        if let Some(node) = self.find(prefix) {
            let mut word = prefix.to_string();
            collect_words(node, &mut word, &mut found);
        }
        found
    }
}

fn collect_words(node: &TrieNode, word: &mut String, found: &mut Vec<String>) {
    if node.is_word {
        found.push(word.clone());
    }
    // A BTreeMap hands its children back in letter order, so the words do too.
    for (&c, child) in &node.children {
        word.push(c);
        collect_words(child, word, found);
        word.pop(); // undo the letter, so the next sibling starts clean
    }
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trie_demo() {
        // region: trie-build-demo
        let mut trie = Trie::new();
        for word in ["cat", "car", "cap", "dog", "do"] {
            trie.insert(word);
        }

        assert!(trie.contains("car"));
        assert!(!trie.contains("ca")); // a prefix, but not a word
        assert!(trie.starts_with("ca"));
        assert!(!trie.starts_with("cb"));
        assert!(trie.contains("do") && trie.contains("dog"));
        println!("{}", trie.contains("cat"));
        // endregion
    }

    #[test]
    fn suggestions_demo() {
        // region: trie-suggest-demo
        let mut trie = Trie::new();
        for word in ["cat", "car", "cap", "dog", "do"] {
            trie.insert(word);
        }

        println!("{:?}", trie.suggestions("ca"));
        assert_eq!(trie.suggestions("ca"), ["cap", "car", "cat"]);
        assert_eq!(trie.suggestions("do"), ["do", "dog"]); // the prefix is a word too
        assert!(trie.suggestions("x").is_empty());
        // endregion
    }

    #[test]
    fn empty_trie_and_empty_prefix() {
        let mut trie = Trie::default();
        assert!(!trie.contains(""));
        assert!(trie.starts_with("")); // every word starts with nothing
        assert!(trie.suggestions("").is_empty());
        trie.insert("b");
        trie.insert("a");
        trie.insert("a"); // twice does no harm
        assert_eq!(trie.suggestions(""), ["a", "b"]);
    }

    #[test]
    fn works_with_any_characters() {
        let mut trie = Trie::new();
        trie.insert("héllo");
        trie.insert("hello");
        assert!(trie.contains("héllo"));
        assert!(trie.starts_with("hé"));
        assert_eq!(trie.suggestions("h"), ["hello", "héllo"]);
    }

    #[test]
    fn btree_set_prefix_search() {
        // region: prefix-with-btree-set
        use std::collections::BTreeSet;

        let words: BTreeSet<&str> = ["cap", "car", "cat", "do", "dog"].into_iter().collect();
        let prefix = "ca";

        // Words that share a prefix sit side by side in sorted order. Jump to
        // where the prefix would go, then stop at the first word that differs.
        let found: Vec<&str> = words
            .range(prefix..)
            .take_while(|word| word.starts_with(prefix))
            .copied()
            .collect();
        println!("{:?}", found);
        assert_eq!(found, ["cap", "car", "cat"]);
        // endregion
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    use super::{Trie, TrieNode};

    // region: count-words-start
    pub fn count_words(node: &TrieNode) -> usize {
        todo!("how many words end at or below this node?")
    }
    // endregion

    // region: count-with-prefix-start
    pub fn count_with_prefix(trie: &Trie, prefix: &str) -> usize {
        todo!("how many stored words begin with the prefix?")
    }
    // endregion

    // region: matches-start
    pub fn matches(trie: &Trie, pattern: &str) -> bool {
        todo!("does any stored word fit the pattern, where . is any letter?")
    }
    // endregion

    fn demos() {
        // region: count-words-start-demo
        let mut trie = Trie::new();
        for word in ["cat", "car", "dog"] {
            trie.insert(word);
        }
        println!("{}", count_words(trie.root()));
        // endregion
        // region: count-with-prefix-start-demo
        let mut trie = Trie::new();
        for word in ["cat", "car", "dog"] {
            trie.insert(word);
        }
        println!("{}", count_with_prefix(&trie, "ca"));
        // endregion
        // region: matches-start-demo
        let mut trie = Trie::new();
        for word in ["cat", "car", "dog"] {
            trie.insert(word);
        }
        println!("{}", matches(&trie, "c.t"));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    use super::{Trie, TrieNode};

    // region: count-words
    pub fn count_words(node: &TrieNode) -> usize {
        // This node counts once if a word ends here. Then add each child's total.
        let here = usize::from(node.is_word);
        let below: usize = node.children.values().map(count_words).sum();
        here + below
    }
    // endregion

    // region: count-with-prefix
    pub fn count_with_prefix(trie: &Trie, prefix: &str) -> usize {
        let mut node = trie.root();
        for c in prefix.chars() {
            match node.children.get(&c) {
                Some(next) => node = next,
                None => return 0, // the path breaks off, so nothing starts this way
            }
        }
        // Everything below this node starts with the prefix.
        count_words(node)
    }
    // endregion

    // region: matches
    pub fn matches(trie: &Trie, pattern: &str) -> bool {
        fn walk(node: &TrieNode, pattern: &[char]) -> bool {
            let Some((&first, rest)) = pattern.split_first() else {
                return node.is_word; // the pattern is used up: does a word end here?
            };
            if first == '.' {
                // A dot could be any letter, so try every branch.
                node.children.values().any(|child| walk(child, rest))
            } else {
                node.children
                    .get(&first)
                    .is_some_and(|child| walk(child, rest))
            }
        }

        let chars: Vec<char> = pattern.chars().collect();
        walk(trie.root(), &chars)
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        fn trie_of(words: &[&str]) -> Trie {
            let mut trie = Trie::new();
            for word in words {
                trie.insert(word);
            }
            trie
        }

        #[test]
        fn counting_words() {
            // region: count-words-demo
            let mut trie = Trie::new();
            for word in ["cat", "car", "dog"] {
                trie.insert(word);
            }
            println!("{}", count_words(trie.root()));
            assert_eq!(count_words(trie.root()), 3);
            // endregion

            assert_eq!(count_words(Trie::new().root()), 0);
            // Inserting a word twice does not make it two words.
            assert_eq!(count_words(trie_of(&["a", "a", "ab"]).root()), 2);
            assert_eq!(count_words(trie_of(&["do", "dog", "dot"]).root()), 3);
        }

        #[test]
        fn counting_prefixes() {
            // region: count-with-prefix-demo
            let mut trie = Trie::new();
            for word in ["cat", "car", "dog"] {
                trie.insert(word);
            }
            println!("{}", count_with_prefix(&trie, "ca"));
            assert_eq!(count_with_prefix(&trie, "ca"), 2);
            assert_eq!(count_with_prefix(&trie, "d"), 1);
            assert_eq!(count_with_prefix(&trie, "x"), 0);
            // endregion

            let trie = trie_of(&["do", "dog", "dot", "cat"]);
            assert_eq!(count_with_prefix(&trie, "do"), 3); // "do" itself counts
            assert_eq!(count_with_prefix(&trie, "dogs"), 0);
            assert_eq!(count_with_prefix(&trie, ""), 4);
            assert_eq!(count_with_prefix(&Trie::new(), "a"), 0);
        }

        #[test]
        fn wildcard_matching() {
            // region: matches-demo
            let mut trie = Trie::new();
            for word in ["cat", "car", "dog"] {
                trie.insert(word);
            }
            println!("{}", matches(&trie, "c.t"));
            assert!(matches(&trie, "c.t"));
            assert!(matches(&trie, "..g"));
            assert!(!matches(&trie, "c.")); // too short: no two-letter word
            assert!(!matches(&trie, "cats"));
            // endregion

            assert!(matches(&trie, "cat")); // no dots at all
            assert!(matches(&trie, "..."));
            assert!(!matches(&trie, "...."));
            assert!(!matches(&trie, ""));
            assert!(!matches(&Trie::new(), "."));
            assert!(matches(&trie_of(&[""]), "")); // the empty word
        }
    }
}
