import java.util.ArrayList;
import java.util.List;

public class Lesson10HelpersTest {
    static void testCollectionsTour() {
        Check.eq(
                "[10, 10, 30, 40, 50]\n[50, 40, 30, 10, 10]\n50\n10\n2\n[10, 40, 30, 10, 50]\n",
                Check.printed(Lesson10Helpers::collectionsTourDemo));
    }

    static void testBinarySearch() {
        Check.eq("5\n-3\n-1\n-9\n", Check.printed(Lesson10Helpers::binarySearchDemo));
    }

    static void testArraysTour() {
        Check.eq(
                "[72, 91, 65, 80]\n[65, 72, 80, 91]\n2\n[65, 72, 80, 91, 0, 0]\n[72, 80]\ntrue\nfalse\n",
                Check.printed(Lesson10Helpers::arraysTourDemo));
    }

    static void testAsList() {
        Check.eq("Kiran\nZoya\nadd refused\n", Check.printed(Lesson10Helpers::asListDemo));
        Check.eq("1\n3\n", Check.printed(Lesson10Helpers::asListTrapDemo));
    }

    static void testImmutable() {
        Check.eq(
                "3\n2\nview is read-only\nList.of is read-only\n",
                Check.printed(Lesson10Helpers::immutableDemo));
        Check.eq(
                "List.of refuses null\nSet.of refuses a repeat\n",
                Check.printed(Lesson10Helpers::ofRulesDemo));
    }

    static void testTinyBinarySearchAgreesWithTheLibrary() {
        Check.eq("5\n-3\n-1\n", Check.printed(Lesson10Helpers::tinySearchDemo));
        int[] sorted = {2, 4, 6, 8, 10};
        List<Integer> asList = List.of(2, 4, 6, 8, 10);
        for (int target = 0; target <= 12; target++) {
            Check.eq(java.util.Collections.binarySearch(asList, target), Lesson10Helpers.binarySearch(sorted, target));
        }
        Check.eq(-1, Lesson10Helpers.binarySearch(new int[0], 3));
        Check.eq(0, Lesson10Helpers.binarySearch(new int[] {3}, 3));
    }

    static void testTinyReadOnlyView() {
        Check.eq("[Asha, Ravi, Meera]\nread-only\n", Check.printed(Lesson10Helpers::tinyViewDemo));
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson10Helpers.Starters.insertSorted(new ArrayList<>(), 1));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson10Helpers.Starters.median(new int[] {1}));
        // The starter Roster really does leak its list: that is the bug to fix.
        Lesson10Helpers.Starters.Roster roster = new Lesson10Helpers.Starters.Roster();
        roster.names().add("Intruder");
        Check.eq(List.of("Intruder"), roster.names());
    }

    static void testInsertSorted() {
        List<Integer> list = new ArrayList<>(List.of(10, 20, 30));
        Lesson10Helpers.Solutions.insertSorted(list, 25);
        Lesson10Helpers.Solutions.insertSorted(list, 5);
        Lesson10Helpers.Solutions.insertSorted(list, 99);
        Lesson10Helpers.Solutions.insertSorted(list, 20); // already there: a duplicate is allowed
        Check.eq(List.of(5, 10, 20, 20, 25, 30, 99), list);
        List<Integer> empty = new ArrayList<>();
        Lesson10Helpers.Solutions.insertSorted(empty, 7);
        Check.eq(List.of(7), empty);
    }

    static void testMedian() {
        int[] odd = {5, 1, 3};
        Check.eq(3.0, Lesson10Helpers.Solutions.median(odd));
        Check.eq(2.5, Lesson10Helpers.Solutions.median(new int[] {4, 1, 3, 2}));
        Check.eq(7.0, Lesson10Helpers.Solutions.median(new int[] {7}));
        Check.eq(java.util.Arrays.toString(new int[] {5, 1, 3}), java.util.Arrays.toString(odd)); // input untouched
        Check.throwsA(IllegalArgumentException.class, () -> Lesson10Helpers.Solutions.median(new int[0]));
    }

    static void testRoster() {
        Lesson10Helpers.Solutions.Roster roster = new Lesson10Helpers.Solutions.Roster();
        roster.add("Asha");
        List<String> names = roster.names();
        Check.throwsA(UnsupportedOperationException.class, () -> names.add("Intruder"));
        roster.add("Ravi");
        Check.eq(List.of("Asha", "Ravi"), roster.names());
    }
}
