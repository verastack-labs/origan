import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class Lesson11ChoosingTest {
    static void testShoppingList() {
        Check.eq("[milk, eggs, milk]\neggs\n", Check.printed(Lesson11Choosing::shoppingListDemo));
    }

    static void testVisitors() {
        Check.eq("3\ntrue\n", Check.printed(Lesson11Choosing::visitorsDemo));
    }

    static void testDedupeKeepsOrder() {
        Check.eq("[b, a, c]\n", Check.printed(Lesson11Choosing::dedupeKeepOrderDemo));
    }

    static void testPhoneBook() {
        Check.eq(
                "98450 33333\n{Asha=98450 11111, Meera=98450 33333, Ravi=98450 22222}\n",
                Check.printed(Lesson11Choosing::phoneBookDemo));
    }

    static void testUndoAndQueue() {
        Check.eq("deleted 'o'\ntyped 'lo'\n", Check.printed(Lesson11Choosing::undoDemo));
        Check.eq("report.pdf\n1\n", Check.printed(Lesson11Choosing::printQueueDemo));
        Check.eq("915\n1210\n", Check.printed(Lesson11Choosing::nextTrainDemo));
    }

    static void testSwapClass() {
        Check.eq("228\n", Check.printed(Lesson11Choosing::swapClassDemo));
        Map<String, Integer> sorted = new TreeMap<>(Map.of("Asha", 91, "Ravi", 72, "Meera", 65));
        Check.eq(228, Lesson11Choosing.total(sorted));
    }

    static void testSuggest() {
        Check.eq(
                "HashMap\nTreeMap\nLinkedHashSet\nArrayDeque\nPriorityQueue\n",
                Check.printed(Lesson11Choosing::suggestDemo));
        // Every branch of the guide.
        Check.eq("LinkedHashMap", Lesson11Choosing.suggest(Lesson11Choosing.Need.LOOK_UP_BY_KEY, Lesson11Choosing.Order.AS_ADDED));
        Check.eq("HashSet", Lesson11Choosing.suggest(Lesson11Choosing.Need.UNIQUE_ITEMS, Lesson11Choosing.Order.ANY));
        Check.eq("TreeSet", Lesson11Choosing.suggest(Lesson11Choosing.Need.UNIQUE_ITEMS, Lesson11Choosing.Order.SORTED));
        Check.eq("ArrayList", Lesson11Choosing.suggest(Lesson11Choosing.Need.BY_POSITION, Lesson11Choosing.Order.ANY));
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson11Choosing.Starters.firstUnique("a"));
        Check.throwsA(UnsupportedOperationException.class, () -> new Lesson11Choosing.Starters.Editor().text());
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson11Choosing.Starters.topWords(new String[0], 1));
    }

    static void testFirstUnique() {
        Check.eq(0, Lesson11Choosing.Solutions.firstUnique("leetcode"));
        Check.eq(3, Lesson11Choosing.Solutions.firstUnique("aabcb"));
        Check.eq(-1, Lesson11Choosing.Solutions.firstUnique("aabb"));
        Check.eq(-1, Lesson11Choosing.Solutions.firstUnique(""));
        Check.eq(0, Lesson11Choosing.Solutions.firstUnique("z"));
    }

    static void testEditor() {
        Lesson11Choosing.Solutions.Editor editor = new Lesson11Choosing.Solutions.Editor();
        Check.eq(false, editor.undo());
        editor.type("Hel");
        editor.type("lo");
        editor.type(" world");
        Check.eq("Hello world", editor.text());
        Check.eq(true, editor.undo());
        Check.eq("Hello", editor.text());
        editor.undo();
        editor.undo();
        Check.eq("", editor.text());
        Check.eq(false, editor.undo());
    }

    static void testTopWords() {
        String[] words = {"tea", "chai", "tea", "coffee", "chai", "tea", "milk"};
        Check.eq(List.of("tea", "chai"), Lesson11Choosing.Solutions.topWords(words, 2));
        // coffee and milk tie on one each, so A to Z decides.
        Check.eq(List.of("tea", "chai", "coffee"), Lesson11Choosing.Solutions.topWords(words, 3));
        Check.eq(List.of("tea", "chai", "coffee", "milk"), Lesson11Choosing.Solutions.topWords(words, 10));
        Check.eq(List.of(), Lesson11Choosing.Solutions.topWords(new String[0], 3));
    }
}
