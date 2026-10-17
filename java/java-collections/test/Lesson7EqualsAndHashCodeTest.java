import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Lesson7EqualsAndHashCodeTest {
    static void testDefaultEquals() {
        // Object.equals is "same object", which the Java docs promise.
        Check.eq("true\nfalse\n2\n", Check.printed(Lesson7EqualsAndHashCode::defaultEqualsDemo));
    }

    static void testBrokenPair() {
        // The hash codes come from formulas the Java docs define, so the buckets are stable.
        Check.eq("true\nfalse\nbuckets: 11 and 6\n", Check.printed(Lesson7EqualsAndHashCode::brokenDemo));
    }

    static void testBrokenSetAnswersWithABoolean() {
        // Java does not say what a set does once its keys break the contract,
        // so this only checks that the demo runs and prints a yes or a no.
        String out = Check.printed(Lesson7EqualsAndHashCode::brokenSetDemo);
        Check.isTrue(out.equals("true\n") || out.equals("false\n"), "unexpected output: " + out);
    }

    static void testFixedPair() {
        Check.eq("true\ntrue\ntrue\n1\n", Check.printed(Lesson7EqualsAndHashCode::fixedDemo));
        Check.eq("buckets: 11 and 11\n", Check.printed(Lesson7EqualsAndHashCode::bucketsDemo));
    }

    static void testRecord() {
        Check.eq("true\ntrue\n1\nAsha\n", Check.printed(Lesson7EqualsAndHashCode::recordDemo));
    }

    static void testStartersAreStubs() {
        Lesson7EqualsAndHashCode.Starters.Book a = new Lesson7EqualsAndHashCode.Starters.Book("1", "X");
        Lesson7EqualsAndHashCode.Starters.Book b = new Lesson7EqualsAndHashCode.Starters.Book("1", "X");
        Check.eq(false, a.equals(b)); // still the default, which is what the reader starts from
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson7EqualsAndHashCode.Starters.revisits(List.of()));
    }

    static void testBook() {
        Lesson7EqualsAndHashCode.Solutions.Book a = new Lesson7EqualsAndHashCode.Solutions.Book("978-1", "Java");
        Lesson7EqualsAndHashCode.Solutions.Book b = new Lesson7EqualsAndHashCode.Solutions.Book("978-1", "Java, 2nd edition");
        Lesson7EqualsAndHashCode.Solutions.Book c = new Lesson7EqualsAndHashCode.Solutions.Book("978-2", "Java");
        Check.eq(true, a.equals(b));
        Check.eq(true, b.equals(a));
        Check.eq(a.hashCode(), b.hashCode());
        Check.eq(false, a.equals(c));
        Check.eq(false, a.equals(null));
        Check.eq(false, a.equals("978-1"));
        Set<Lesson7EqualsAndHashCode.Solutions.Book> shelf = new HashSet<>(List.of(a, c));
        Check.eq(true, shelf.contains(b));
        Check.eq(2, shelf.size());
    }

    static void testRevisits() {
        Check.eq(true, Lesson7EqualsAndHashCode.Solutions.revisits(
                List.of(new int[] {0, 0}, new int[] {0, 1}, new int[] {1, 1}, new int[] {0, 1})));
        Check.eq(false, Lesson7EqualsAndHashCode.Solutions.revisits(
                List.of(new int[] {0, 0}, new int[] {0, 1}, new int[] {1, 1})));
        Check.eq(false, Lesson7EqualsAndHashCode.Solutions.revisits(List.of()));
    }

    static void testUsername() {
        Lesson7EqualsAndHashCode.Solutions.Username a = new Lesson7EqualsAndHashCode.Solutions.Username("Asha");
        Lesson7EqualsAndHashCode.Solutions.Username b = new Lesson7EqualsAndHashCode.Solutions.Username("ASHA");
        Lesson7EqualsAndHashCode.Solutions.Username c = new Lesson7EqualsAndHashCode.Solutions.Username("Ravi");
        Check.eq(true, a.equals(b));
        Check.eq(a.hashCode(), b.hashCode());
        Check.eq(false, a.equals(c));
        Set<Lesson7EqualsAndHashCode.Solutions.Username> names = new HashSet<>();
        names.add(a);
        names.add(b);
        names.add(c);
        Check.eq(2, names.size());
    }
}
