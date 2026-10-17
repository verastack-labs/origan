//! Lesson 2: strings.

// region: first-word
/// The text up to the first space, or all of it if there is no space.
/// The result borrows from `text`: it is a window onto the same bytes.
pub fn first_word(text: &str) -> &str {
    match text.find(' ') {
        Some(end) => &text[..end],
        None => text,
    }
}
// endregion

// region: shout
/// Builds a brand new `String`, so the caller owns the result.
pub fn shout(text: &str) -> String {
    let mut out = String::new();
    for c in text.chars() {
        out.push(c.to_ascii_uppercase());
    }
    out.push('!');
    out
}
// endregion

// region: count-vowels
pub fn count_vowels(text: &str) -> usize {
    text.chars()
        .filter(|c| matches!(c.to_ascii_lowercase(), 'a' | 'e' | 'i' | 'o' | 'u'))
        .count()
}
// endregion

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn string_and_str() {
        // region: string-vs-str
        let literal: &str = "hello"; // borrowed text, baked into the program
        let mut owned: String = literal.to_string(); // owned, and able to grow
        owned.push_str(", world");

        let view: &str = &owned; // a borrowed view of `owned`
        assert_eq!(view, "hello, world");
        assert_eq!(literal, "hello"); // `literal` was never touched
        // endregion
    }

    #[test]
    fn utf8_lengths() {
        // region: utf8
        let word = "héllo";
        assert_eq!(word.len(), 6); // bytes: the é takes two
        assert_eq!(word.chars().count(), 5); // characters

        // let c = word[1]; // error: `str` cannot be indexed by an integer
        assert_eq!(word.chars().nth(1), Some('é'));
        assert_eq!(&word[0..1], "h"); // slicing by byte range is allowed...
        assert!(!word.is_char_boundary(2)); // ...but not through the middle of é
        // endregion
    }

    #[test]
    #[should_panic]
    fn slicing_through_a_character_panics() {
        let word = "héllo";
        let end = 2;
        let _ = &word[0..end];
    }

    #[test]
    fn char_indices_gives_byte_positions() {
        // region: char-indices
        let word = "héllo";
        let positions: Vec<(usize, char)> = word.char_indices().collect();
        assert_eq!(positions[1], (1, 'é'));
        assert_eq!(positions[2], (3, 'l')); // the next character starts at byte 3
        // endregion
    }

    #[test]
    fn first_word_borrows() {
        // region: first-word-demo
        let sentence = String::from("rust makes you think");
        let word = first_word(&sentence);
        println!("{word}");
        assert_eq!(word, "rust");
        assert_eq!(first_word("single"), "single");
        assert_eq!(first_word(""), "");
        // endregion
        assert_eq!(first_word("héllo wörld"), "héllo");
    }

    #[test]
    fn shout_builds_a_new_string() {
        // region: shout-demo
        let loud = shout("hello");
        println!("{loud}");
        assert_eq!(loud, "HELLO!");
        // endregion
        assert_eq!(shout(""), "!");
    }

    #[test]
    fn counts_vowels() {
        // region: count-vowels-demo
        println!("{}", count_vowels("Rust Programming"));
        assert_eq!(count_vowels("Rust Programming"), 4);
        // endregion
        assert_eq!(count_vowels(""), 0);
        assert_eq!(count_vowels("xyz"), 0);
        assert_eq!(count_vowels("AEIOU"), 5);
    }
}

/// Practice problems, as the reader first sees them.
#[allow(unused_variables, dead_code)]
pub mod starters {
    // region: is-palindrome-start
    pub fn is_palindrome(text: &str) -> bool {
        todo!("ignore case and anything that is not a letter or digit")
    }
    // endregion

    // region: is-anagram-start
    pub fn is_anagram(a: &str, b: &str) -> bool {
        todo!("same letters, same counts; both inputs are lowercase a-z")
    }
    // endregion

    // region: first-unique-char-start
    pub fn first_unique_char(text: &str) -> Option<usize> {
        todo!("byte index of the first letter that appears once; lowercase a-z")
    }
    // endregion

    fn demos() {
        // region: is-palindrome-start-demo
        println!("{}", is_palindrome("A man, a plan, a canal: Panama"));
        // endregion
        // region: is-anagram-start-demo
        println!("{}", is_anagram("listen", "silent"));
        // endregion
        // region: first-unique-char-start-demo
        println!("{:?}", first_unique_char("loveleetcode"));
        // endregion
    }
}

/// Worked solutions, with tests.
pub mod solutions {
    // region: is-palindrome
    pub fn is_palindrome(text: &str) -> bool {
        let chars: Vec<char> = text
            .chars()
            .filter(|c| c.is_alphanumeric())
            .flat_map(|c| c.to_lowercase())
            .collect();

        if chars.is_empty() {
            return true;
        }
        let mut left = 0;
        let mut right = chars.len() - 1;
        while left < right {
            if chars[left] != chars[right] {
                return false;
            }
            left += 1;
            right -= 1;
        }
        true
    }
    // endregion

    // region: is-anagram
    pub fn is_anagram(a: &str, b: &str) -> bool {
        if a.len() != b.len() {
            return false;
        }
        let mut counts = [0i32; 26];
        for byte in a.bytes() {
            counts[(byte - b'a') as usize] += 1;
        }
        for byte in b.bytes() {
            counts[(byte - b'a') as usize] -= 1;
        }
        counts.iter().all(|&c| c == 0)
    }
    // endregion

    // region: first-unique-char
    pub fn first_unique_char(text: &str) -> Option<usize> {
        let mut counts = [0usize; 26];
        for byte in text.bytes() {
            counts[(byte - b'a') as usize] += 1;
        }
        text.bytes()
            .position(|byte| counts[(byte - b'a') as usize] == 1)
    }
    // endregion

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn palindromes() {
            // region: is-palindrome-demo
            println!("{}", is_palindrome("A man, a plan, a canal: Panama"));
            assert!(is_palindrome("A man, a plan, a canal: Panama"));
            assert!(!is_palindrome("rust"));
            // endregion
            assert!(is_palindrome(""));
            assert!(is_palindrome("!!"));
            assert!(is_palindrome("x"));
            assert!(is_palindrome("Été"));
            assert!(!is_palindrome("ab"));
        }

        #[test]
        fn anagrams() {
            // region: is-anagram-demo
            println!("{}", is_anagram("listen", "silent"));
            assert!(is_anagram("listen", "silent"));
            assert!(!is_anagram("rat", "car"));
            // endregion
            assert!(is_anagram("", ""));
            assert!(!is_anagram("a", "aa"));
            assert!(!is_anagram("aab", "abb"));
        }

        #[test]
        fn first_unique() {
            // region: first-unique-char-demo
            println!("{:?}", first_unique_char("loveleetcode"));
            assert_eq!(first_unique_char("loveleetcode"), Some(2));
            assert_eq!(first_unique_char("aabb"), None);
            // endregion
            assert_eq!(first_unique_char(""), None);
            assert_eq!(first_unique_char("z"), Some(0));
        }
    }
}
