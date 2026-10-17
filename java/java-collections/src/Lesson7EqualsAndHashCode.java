// Lesson 7: equals and hashCode. The page text is
// src/content/learn/java-collections/equals-and-hashcode.mdx.

import java.util.HashSet;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

public class Lesson7EqualsAndHashCode {
    // region: plain-student
    // No equals, no hashCode: Java falls back to "same object or not".
    static final class PlainStudent {
        final int id;
        final String name;

        PlainStudent(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }
    // endregion

    static void defaultEqualsDemo() {
        // region: default-equals
        PlainStudent a = new PlainStudent(1, "Asha");
        PlainStudent b = new PlainStudent(1, "Asha");
        System.out.println(a.equals(a));
        System.out.println(a.equals(b)); // same details, but two different objects
        Set<PlainStudent> roll = new HashSet<>();
        roll.add(a);
        roll.add(b);
        System.out.println(roll.size());
        // endregion
    }

    // region: broken-student
    // The bug: equals looks only at id, but hashCode also mixes in name.
    static final class BrokenStudent {
        final int id;
        final String name;

        BrokenStudent(int id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public boolean equals(Object other) {
            return other instanceof BrokenStudent that && id == that.id;
        }

        @Override
        public int hashCode() {
            return Objects.hash(id, name);
        }
    }
    // endregion

    static void brokenDemo() {
        // region: broken-demo
        BrokenStudent a = new BrokenStudent(1, "Asha");
        BrokenStudent b = new BrokenStudent(1, "Asha K");
        System.out.println(a.equals(b));
        System.out.println(a.hashCode() == b.hashCode());
        System.out.println("buckets: " + Lesson6HashSetAndHashMap.TinyHashMap.bucketFor(a, 16)
                + " and " + Lesson6HashSetAndHashMap.TinyHashMap.bucketFor(b, 16));
        // endregion
    }

    /** The set question from the lesson. Its answer is not promised by Java, so the tests only check it is a boolean. */
    static void brokenSetDemo() {
        // region: broken-set
        BrokenStudent a = new BrokenStudent(1, "Asha");
        BrokenStudent b = new BrokenStudent(1, "Asha K");
        Set<BrokenStudent> roll = new HashSet<>();
        roll.add(a);
        System.out.println(roll.contains(b)); // equal to a, yet the set looks on the wrong shelf
        // endregion
    }

    // region: student
    static final class Student {
        final int id;
        final String name;

        Student(int id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            // instanceof is false for null, so null needs no check of its own
            if (!(other instanceof Student that)) {
                return false;
            }
            return id == that.id && Objects.equals(name, that.name);
        }

        @Override
        public int hashCode() {
            // the same fields as equals, no more and no fewer
            return Objects.hash(id, name);
        }
    }
    // endregion

    static void fixedDemo() {
        // region: fixed-demo
        Student a = new Student(1, "Asha");
        Student b = new Student(1, "Asha");
        System.out.println(a.equals(b));
        System.out.println(a.hashCode() == b.hashCode());
        Set<Student> roll = new HashSet<>();
        roll.add(a);
        System.out.println(roll.contains(b));
        roll.add(b);
        System.out.println(roll.size());
        // endregion
    }

    // region: pupil-record
    // A record writes equals, hashCode and toString from its parts.
    record Pupil(int id, String name) {}
    // endregion

    static void recordDemo() {
        // region: record-demo
        Pupil a = new Pupil(1, "Asha");
        Pupil b = new Pupil(1, "Asha");
        System.out.println(a.equals(b));
        System.out.println(a.hashCode() == b.hashCode());
        Set<Pupil> roll = new HashSet<>();
        roll.add(a);
        roll.add(b);
        System.out.println(roll.size());
        System.out.println(a.name()); // the parts are read with name(), not getName()
        // endregion
    }

    static void bucketsDemo() {
        // region: buckets-demo
        Student a = new Student(1, "Asha");
        Student b = new Student(1, "Asha");
        // Equal objects have equal hash codes, so they pick the same shelf.
        System.out.println("buckets: " + Lesson6HashSetAndHashMap.TinyHashMap.bucketFor(a, 16)
                + " and " + Lesson6HashSetAndHashMap.TinyHashMap.bucketFor(b, 16));
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: book-start
        static final class Book {
            final String isbn;
            final String title;

            Book(String isbn, String title) {
                this.isbn = isbn;
                this.title = title;
            }

            // Two books are the same book when they share an isbn.
            // Add equals and hashCode.
        }
        // endregion

        // region: revisits-start
        static boolean revisits(java.util.List<int[]> path) {
            throw new UnsupportedOperationException("does the path ever stand on the same square twice?");
        }
        // endregion

        // region: username-start
        static final class Username {
            final String text;

            Username(String text) {
                this.text = text;
            }

            // "Asha" and "ASHA" must count as the same username.
            // Add equals and hashCode.
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: book
        static final class Book {
            final String isbn;
            final String title;

            Book(String isbn, String title) {
                this.isbn = isbn;
                this.title = title;
            }

            @Override
            public boolean equals(Object other) {
                // the title is left out on purpose: the isbn alone says which book this is
                return other instanceof Book that && isbn.equals(that.isbn);
            }

            @Override
            public int hashCode() {
                return isbn.hashCode(); // only the fields equals uses
            }
        }
        // endregion

        // region: revisits
        // A record gives the square a working equals and hashCode. An int[]
        // would not: arrays compare by identity, so two {0, 1} arrays differ.
        record Square(int row, int col) {}

        static boolean revisits(java.util.List<int[]> path) {
            Set<Square> seen = new HashSet<>();
            for (int[] step : path) {
                if (!seen.add(new Square(step[0], step[1]))) {
                    return true;
                }
            }
            return false;
        }
        // endregion

        // region: username
        static final class Username {
            final String text;

            Username(String text) {
                this.text = text;
            }

            @Override
            public boolean equals(Object other) {
                return other instanceof Username that && text.equalsIgnoreCase(that.text);
            }

            @Override
            public int hashCode() {
                // equal usernames must hash alike, so hash the lower-case form
                return text.toLowerCase(Locale.ROOT).hashCode();
            }
        }
        // endregion
    }
}
